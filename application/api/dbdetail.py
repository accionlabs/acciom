"""File to handle Database connection operations."""
from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError

from application.common.constants import APIMessages, SupportedDBType
from application.common.response import (api_response, STATUS_BAD_REQUEST,
                                         STATUS_SERVER_ERROR, STATUS_CREATED)
from application.common.token import token_required
from application.common.utils import validate_empty_fields
from application.helper.encrypt import encrypt
from application.model.models import DbConnection, Project
from index import db


class DbDetails(Resource):
    """
    Class to handle GET, POST, PUT APIs.

    Helper Methods for storing, getting, and Updating DB Details.
    """

    @token_required
    def post(self, session):
        """
        Method to store the Database Details provided by the user into the DB.

        Args:
             session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message saying
            that db details added successfully), data and http status code.
        """
        try:
            post_db_detail_parser = reqparse.RequestParser(bundle_errors=True)
            post_db_detail_parser.add_argument('project_id', required=True,
                                               type=int,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('connection_name',
                                               required=False, type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('db_type_name', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('db_name', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('db_hostname', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('db_username', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            post_db_detail_parser.add_argument('db_password', required=True,
                                               type=str,
                                               help=APIMessages.PARSER_MESSAGE)
            db_detail = post_db_detail_parser.parse_args()
            list_of_args = [arg.name for arg in post_db_detail_parser.args]
            request_data_validation = validate_empty_fields(db_detail,
                                                            list_of_args)
            if request_data_validation:
                return api_response(success=False,
                                    message=request_data_validation,
                                    http_status_code=STATUS_BAD_REQUEST,
                                    data={})
            # check whether combination of db_type,db_name,db_username,
            # db_hostname,project_id is already present in db or not
            temp_connection = DbConnection.query.filter(
                DbConnection.project_id == db_detail["project_id"],
                DbConnection.db_type == SupportedDBType().get_db_id_by_name(
                    db_detail['db_type_name']),
                DbConnection.db_name == db_detail['db_name'],
                DbConnection.db_hostname.ilike(
                    db_detail['db_hostname']),
                DbConnection.db_username == db_detail['db_username']).first()
            if temp_connection:
                return api_response(False, APIMessages.
                                    DB_DETAILS_ALREADY_PRESENT,
                                    STATUS_BAD_REQUEST)
            else:
                # Check Db connection name already exist in db or not
                temp_connection = DbConnection.query.filter(
                    DbConnection.db_connection_name == db_detail[
                        "connection_name"],
                    DbConnection.project_id == db_detail["project_id"]).first()
                if temp_connection:
                    return api_response(False, APIMessages.
                                        DB_CONNECTION_NAME_ALREADY_PRESENT,
                                        STATUS_BAD_REQUEST)
                # Checking spaces in username and hostname
                spacecount_dbusername = db_detail["db_username"].find(" ")
                spacecount_dbhostanme = db_detail["db_hostname"].find(" ")
                if spacecount_dbusername > -1 or spacecount_dbhostanme > -1:
                    return api_response(False, APIMessages.
                                        NO_SPACES,
                                        STATUS_BAD_REQUEST)
                db_password = encrypt(db_detail["db_password"])
                new_db = DbConnection(project_id=db_detail["project_id"],
                                      owner_id=session.user_id,
                                      db_connection_name=db_detail[
                                          'connection_name'],
                                      db_type=SupportedDBType().
                                      get_db_id_by_name(
                                          db_detail['db_type_name']),
                                      db_name=db_detail['db_name'],
                                      db_hostname=db_detail["db_hostname"],
                                      db_username=db_detail["db_username"],
                                      db_encrypted_password=db_password, )
                new_db.save_to_db()
                return api_response(True, APIMessages.DB_DETAILS_ADDED,
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

    @token_required
    def get(self, session):
        """
        Method to fetch all connections for the given project_id.

        or particular connection for the db id

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message, data(returns dbdetails for the
            user passed id) and http status code.
        """
        get_db_detail_parser = reqparse.RequestParser()
        get_db_detail_parser.add_argument('project_id', required=False,
                                          type=int,
                                          location='args')
        get_db_detail_parser.add_argument('db_connection_id', required=False,
                                          type=int,
                                          location='args')
        database_id = get_db_detail_parser.parse_args()
        db_connection_id = database_id.get("db_connection_id")
        try:
            if db_connection_id:
                db_obj = DbConnection.query.filter_by(
                    db_connection_id=db_connection_id).first()

                if db_obj:

                    return api_response(
                        True, APIMessages.DATA_LOADED, STATUS_CREATED,
                        {'project_id': db_obj.project_id,
                         'db_connection_name': db_obj.db_connection_name,
                         'db_connection_id': db_obj.db_connection_id,
                         'db_type_name': SupportedDBType().get_db_name_by_id(
                             db_obj.db_type),
                         'db_type_id': db_obj.db_type,
                         "db_name": db_obj.db_name,
                         'db_hostname': db_obj.db_hostname,
                         'db_username': db_obj.db_username,
                         })
                else:
                    return api_response(False,
                                        APIMessages.DBID_NOT_IN_DB.format(
                                            db_connection_id),
                                        STATUS_BAD_REQUEST)

            dbproject_id = get_db_detail_parser.parse_args()
            project_id = dbproject_id.get("project_id")
            if project_id:
                project_obj = DbConnection.query.filter_by(
                    project_id=project_id).first()
                project_name_obj = Project.query.filter_by(
                    project_id=project_id).first()

                if project_obj:
                    def to_json(projectid):
                        return {
                            'project_id': projectid.project_id,
                            'project_name': project_name_obj.project_name,
                            'db_connection_name': projectid.db_connection_name,
                            'db_connection_id': projectid.db_connection_id,
                            'db_type_name':
                                SupportedDBType().get_db_name_by_id(
                                    projectid.db_type),
                            'db_type_id': projectid.db_type,
                            'db_name': projectid.db_name,
                            'db_hostname': projectid.db_hostname,
                            'db_username': projectid.db_username}

                    db_detail_dic = {}
                    db_detail_dic["db_details"] = list(
                        map(lambda projectid: to_json(projectid),
                            DbConnection.query.filter_by(
                                project_id=project_id)))
                    return api_response(True, APIMessages.DATA_LOADED,
                                        STATUS_CREATED,
                                        db_detail_dic)
                else:
                    return api_response(False,
                                        APIMessages.NO_DB_UNDER_PROJECT.format(
                                            db_connection_id),
                                        STATUS_BAD_REQUEST)
            else:
                return api_response(False,
                                    APIMessages.PASS_DBID_or_PROJECTID.format(
                                        db_connection_id),
                                    STATUS_BAD_REQUEST)
        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})

    @token_required
    def put(self, session):
        """
        Method to Update database details into the DB based on the db id.

        provided by the user.

        Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message db details
            uploaded successfully), data and http status code.
        """
        put_db_detail_parser = reqparse.RequestParser(bundle_errors=True)
        put_db_detail_parser.add_argument('db_connection_id', required=True,
                                          type=int)
        put_db_detail_parser.add_argument('db_connection_name', type=str)
        put_db_detail_parser.add_argument('db_type', type=str)
        put_db_detail_parser.add_argument('db_name', type=str)
        put_db_detail_parser.add_argument('db_hostname', type=str)
        put_db_detail_parser.add_argument('db_username', type=str)
        put_db_detail_parser.add_argument('db_password', type=str)
        db_detail = put_db_detail_parser.parse_args()
        db_details = put_db_detail_parser.parse_args()
        db_connection_id = db_detail["db_connection_id"]
        try:
            # Remove keys which contain None values in db_details dictionary
            for key, value in dict(db_detail).items():
                if value == None:
                    del db_detail[key]
            if db_connection_id:
                db_obj = DbConnection.query.filter_by(
                    db_connection_id=db_connection_id).first()
                del db_detail["db_connection_id"]
                # Updating values present in database with user given values
                data_base_dict = db_obj.__dict__
                data_base_dict.update(db_detail)

                if db_obj:
                    # check whether combination of db_type,db_name,db_username,
                    # db_hostname,project_id is already present in db or not
                    if db_details["db_type"] != None:
                        data_base_dict[
                            'db_type'] = SupportedDBType().get_db_id_by_name(
                            data_base_dict['db_type'])
                    temp_connection = DbConnection.query.filter(
                        DbConnection.db_connection_id != db_connection_id,
                        DbConnection.db_type == data_base_dict['db_type'],
                        DbConnection.db_name == data_base_dict['db_name'],
                        DbConnection.db_username == data_base_dict[
                            'db_username'],
                        DbConnection.db_hostname.ilike(
                            data_base_dict['db_hostname']),
                        DbConnection.project_id == data_base_dict[
                            'project_id']).all()
                    if temp_connection != []:
                        return api_response(False, APIMessages.
                                            DB_DETAILS_ALREADY_PRESENT,
                                            STATUS_BAD_REQUEST)
                    else:
                        # Check Db connection name already exist in db or not
                        if db_details["db_connection_name"] != None:
                            temp_connection = DbConnection.query.filter(
                                DbConnection.db_connection_name == db_detail[
                                    "db_connection_name"],
                                DbConnection.project_id ==
                                db_obj.project_id).first()
                            if temp_connection:
                                return api_response(False, APIMessages.
                                                    DB_CONNECTION_NAME_ALREADY_PRESENT,
                                                    STATUS_BAD_REQUEST)
                        # Checking spaces in username and hostname
                        if db_details["db_username"] != None:
                            spacecount_dbusername = db_detail[
                                "db_username"].find(" ")
                            if spacecount_dbusername > -1:
                                return api_response(False, APIMessages.
                                                    NO_SPACES,
                                                    STATUS_BAD_REQUEST)
                        if db_details["db_hostname"] != None:
                            spacecount_dbhostname = db_detail[
                                "db_hostname"].find(" ")
                            if spacecount_dbhostname > -1:
                                return api_response(False, APIMessages.
                                                    NO_SPACES,
                                                    STATUS_BAD_REQUEST)

                        for key, value in db_detail.items():
                            if value and value.strip():
                                # checking if value provided by user is
                                # neither None nor Null
                                if key == 'db_password':
                                    db_password = encrypt(value)
                                    db_obj.db_encrypted_password = db_password
                                elif key == 'db_connection_name':
                                    db_obj.db_connection_name = value
                                elif key == 'db_type':
                                    db_obj.db_type = SupportedDBType(). \
                                        get_db_id_by_name(value)
                                elif key == 'db_name':
                                    db_obj.db_name = value
                                elif key == 'db_hostname':
                                    db_obj.db_hostname = value
                                elif key == 'db_username':
                                    db_obj.db_username = value

                        db_obj.save_to_db()
                        return api_response(
                            True, APIMessages.DB_DETAILS_UPDATED.format(
                                db_connection_id), STATUS_CREATED)
                else:
                    return api_response(False,
                                        APIMessages.DBID_NOT_IN_DB.format(
                                            db_connection_id),
                                        STATUS_BAD_REQUEST)
            else:
                return api_response(False, APIMessages.ABSENCE_OF_DBID,
                                    STATUS_BAD_REQUEST)

        except SQLAlchemyError as e:
            db.session.rollback()
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
        except Exception as e:
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR,
                                {'error_log': str(e)})
