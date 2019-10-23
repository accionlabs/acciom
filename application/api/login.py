import secrets

from flask_restful import Resource
from flask_restful import reqparse
from sqlalchemy.exc import SQLAlchemyError

from application.common.common_exception import ResourceNotAvailableException
from application.common.constants import APIMessages
from application.common.response import (api_response, STATUS_BAD_REQUEST,
                                         STATUS_CREATED, STATUS_SERVER_ERROR,
                                         STATUS_OK)
from application.common.token import (login_required, token_required,
                                      generate_auth_token)
from application.common.utils import (send_reset_email, verify_reset_token)
from application.common.utils import validate_empty_fields
from application.common.utils import (verify_hash, generate_hash)
from application.model.models import (User, PersonalToken)
from index import db


class Login(Resource):
    @login_required
    def post(self, user_detail):
        token = generate_auth_token(user_detail)
        if user_detail.asset == None:
            default_org_id = None
            default_project_id = None
        else:
            default_org_id = user_detail.asset.get("default_org_id",
                                                   None)
            default_project_id = user_detail.asset.get(
                "default_project_id", None)
        data = {"token": token,
                "default_org_id": default_org_id,
                "default_project_id": default_project_id
                }
        return api_response(True, "success", 200, data)


class LogOut(Resource):
    @token_required
    def post(self, session):
        delete_session = session.delete_user_session()
        if delete_session is not None:
            data = {"status": False,
                    "message": "Unable to logout",
                    "data": {"token": ""}
                    }
            return data, 500

        data = {"status": True,
                "message": "success",
                "data": {"token": ""}
                }
        return data, 200


class AddUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('first_name',
                            help='This field cannot be blank',
                            required=True)

        parser.add_argument('last_name',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('password',
                            help='This field cannot be blank',
                            required=True)
        user_data = parser.parse_args()
        old_user = User.query.filter_by(email=user_data['email']).first()
        if old_user is None:
            user = User(user_data['email'], user_data['first_name'],
                        user_data['last_name'],
                        generate_hash(user_data['password']),
                        True)
            user.save_to_db()
            data = {"status": True,
                    "message": "success",
                    "data": {"user_id": user.user_id}
                    }
            return data, 200
        else:
            data = {"status": False,
                    "message": "user already registered"

                    }
            return data, 409


class ForgotPassword(Resource):
    """ To handle POST API, to send Email for reseting password."""

    def post(self):
        """
        To send Email to the registered user to reset password.

        Returns:
            Standard API Response with message(returns message saying that
            Mail sent to your Email id) and http status code.
        """
        try:
            post_email_parser = reqparse.RequestParser(bundle_errors=True)
            post_email_parser.add_argument('email', required=True,
                                           type=str,
                                           help=APIMessages.PARSER_MESSAGE)
            email_data = post_email_parser.parse_args()
            user = User.query.filter_by(email=email_data['email']).first()
            if user is None:
                return api_response(False,
                                    APIMessages.EMAIL_NOT_CORRECT,
                                    STATUS_BAD_REQUEST)
            else:
                send_reset_email(user)
            return api_response(True, APIMessages.MAIL_SENT,
                                STATUS_CREATED)
        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})


class ChangePassword(Resource):
    """To change the user password"""

    @token_required
    def post(self, session):
        """
         To change the password for the user and updating new password in
         database

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message saying
            that password successfully changed) and http status code.

        """
        try:
            post_db_detail_parser = reqparse.RequestParser(bundle_errors=True)
            post_db_detail_parser.add_argument('old_password', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('new_password', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)

            password_data = post_db_detail_parser.parse_args()
            current_user_id = session.user_id
            current_user_object = db.session.query(User).get(current_user_id)
            if not verify_hash(password_data['old_password'],
                               current_user_object.password_hash):
                return api_response(False,
                                    APIMessages.INVALID_PASSWORD,
                                    STATUS_BAD_REQUEST)
            current_user_object.password_hash = generate_hash(
                password_data['new_password'])
            current_user_object.save_to_db()
            return api_response(True, APIMessages.PASSWORD_CHANGE,
                                STATUS_CREATED)
        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})


class ForgotPasswordVerifyToken(Resource):
    """To handle GET API, to verify the token provided by the user."""

    def get(self):
        """
        verify token given by the user and send user to Password Reset page.

        Returns:
            Standard API Response with message(returns message saying that
            Page to password reset) and http status code.
        """
        try:
            get_token_parser = reqparse.RequestParser()
            get_token_parser.add_argument('token', required=False,
                                          type=str,
                                          location='args')

            get_token = get_token_parser.parse_args()
            token = get_token.get("token")
            token_dic = {"token": token}
            user = verify_reset_token(token)
            if user is None:
                return api_response(False,
                                    APIMessages.INVALID_TOKEN,
                                    STATUS_BAD_REQUEST)
            else:
                return api_response(True, APIMessages.PAGE_TO_PASSWORD_RESET,
                                    STATUS_CREATED, token_dic)
        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})


class ResetPassword(Resource):
    """ To handle POST API,to Reset user Password."""

    def post(self):
        """
        To Reset the user password and update in database.

        Returns:
            Standard API Response with message(returns message saying that
            Password changed successfully) and http status code.
        """
        try:
            post_parser = reqparse.RequestParser(bundle_errors=True)
            post_parser.add_argument('password', required=True,
                                     type=str,
                                     help=APIMessages.PARSER_MESSAGE)
            post_parser.add_argument('confirm_password', required=True,
                                     type=str,
                                     help=APIMessages.PARSER_MESSAGE)
            post_parser.add_argument('token', required=True,
                                     type=str,
                                     help=APIMessages.PARSER_MESSAGE)
            email_data = post_parser.parse_args()
            user = verify_reset_token(email_data['token'])
            if user is None:
                return api_response(False,
                                    APIMessages.INVALID_TOKEN,
                                    STATUS_BAD_REQUEST)
            else:
                password = generate_hash(email_data['password'])
                user.password_hash = password
                user.save_to_db()
                return api_response(True, APIMessages.PASSWORD_CHANGE,
                                    STATUS_CREATED)
        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})


class GetToken(Resource):
    """
     Class will be used to generate a unique token for the user to be used in
      jenkins and stored procedure related calls
    """

    @token_required
    def post(self, session):
        """
        Method will be a get call used to generate a token for the user and
        store that with the user reference in the PersonalToken page.

        Args:
            session (Obj): session Object will contain the user detail used to
            associate the user with the token.

        Returns: generate a token that will be associated to the user

        """
        parser = reqparse.RequestParser(bundle_errors=True)
        parser.add_argument('message',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, location='json')
        token_generation_data = parser.parse_args()
        token = secrets.token_hex()
        token_generation_data['message'] = token_generation_data[
            'message'].strip()
        list_of_args = [arg.name for arg in parser.args]
        request_data_validation = validate_empty_fields(
            token_generation_data,
            list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        user_id = session.user_id
        personal_token_obj = PersonalToken(user_id, token,
                                           token_generation_data['message'])
        personal_token_obj.save_to_db()
        payload = {"personal_access_token": token}
        return api_response(
            True, APIMessages.CREATE_RESOURCE.format('token'),
            STATUS_CREATED, payload)

    @token_required
    def get(self, session):
        """
        Method will be a get call for the user and shows all  
        PersonalToken associated with the user.

        Args:
            session (Obj): session Object will contain the user detail used to
            associate the user with the token.

        Returns: Method will be a get call for the user and shows all  
        PersonalToken associated with the user
        """
        user_id = session.user_id
        token_objects = PersonalToken.query.filter_by(user_id=user_id,
                                                      is_deleted=False).all()
        token_list = []
        if not token_objects:
            raise ResourceNotAvailableException('Token')
        else:
            for each_token in token_objects:
                token_list.append({"token_id": each_token.personal_token_id,
                                   "token_note": each_token.note,
                                   "created_at": each_token.created_at.strftime(
                                       "%Y-%m-%d %H:%M:%S")})
        payload = {"tokens": token_list}
        return api_response(
            True, APIMessages.SUCCESS,
            STATUS_OK, payload)

    @token_required
    def delete(self, session):
        get_token_id = reqparse.RequestParser()
        get_token_id.add_argument('token_id', required=True,
                                  type=int,
                                  location='args')
        user_id = session.user_id
        token_id = get_token_id.parse_args()
        token_obj = PersonalToken.query.filter_by(
            personal_token_id=token_id['token_id'],
            user_id=user_id, is_deleted=False).first()
        if not token_obj:
            raise ResourceNotAvailableException('Token')
        else:
            token_obj.is_deleted = True
            token_obj.save_to_db()
        return api_response(
            True, APIMessages.TOKEN_DELETED.format(token_obj.note),
            STATUS_OK, STATUS_CREATED)
