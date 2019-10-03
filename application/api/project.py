"""File to handle Project API Operations."""
from flask_restful import Resource, reqparse

from application.common.api_permission import PROJECT_POST, \
    PROJECT_PUT
from application.common.common_exception import GenericBadRequestException
from application.common.constants import APIMessages
from application.common.response import (STATUS_CREATED,
                                         STATUS_OK, STATUS_UNAUTHORIZED,
                                         STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.token import token_required
from application.common.utils import validate_empty_fields
from application.helper.permission_check import check_permission
from application.helper.runnerclasshelpers import project_detail
from application.model.models import (Project, UserOrgRole, Organization,
                                      UserProjectRole,TestSuite,DbConnection,UserProjectRole,User)


class ProjectAPI(Resource):
    """Class to handle Project related GET, POST and PUT API."""

    @token_required
    def post(self, session):
        """
        Post call to create Project with name and organization Id.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code
        """
        create_project_parser = reqparse.RequestParser(bundle_errors=True)
        create_project_parser.add_argument(
            'project_name',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str, location='json')
        create_project_parser.add_argument(
            'project_description',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str, location='json')
        create_project_parser.add_argument(
            'org_id',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=int, location='json')
        create_project_data = create_project_parser.parse_args()
        org_obj = Organization.query.filter_by(
            org_id=create_project_data['org_id'],
            is_deleted=False).first()
        if not org_obj:
            raise GenericBadRequestException(APIMessages.INVALID_ORG_ID)
        check_permission(user_object=session.user,
                         list_of_permissions=PROJECT_POST,
                         org_id=create_project_data["org_id"])
        create_project_data['project_name'] = create_project_data[
            'project_name'].strip()
        list_of_args = [arg.name for arg in create_project_parser.args]
        request_data_validation = validate_empty_fields(
            create_project_data,
            list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        new_project = Project(create_project_data['project_name'],
                            create_project_data['project_description'],
                              create_project_data['org_id'],
                              session.user_id)
        new_project.save_to_db()
        project_payload = {'project_name': new_project.project_name,
                           'project_id': new_project.project_id,
                           'project_description':new_project.project_description,
                           'org_id': new_project.org_id}
        return api_response(True,
                            APIMessages.CREATE_RESOURCE.format('Project'),
                            STATUS_CREATED, project_payload)

    @token_required
    def put(self, session):
        """
        PUT call to update project name.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code

        """
        update_project_parser = reqparse.RequestParser(bundle_errors=True)
        update_project_parser.add_argument(
            'project_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int)
        update_project_parser.add_argument(
            'project_name',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str)
        update_project_parser.add_argument(
            'project_description',
            help=APIMessages.PARSER_MESSAGE,
            required=True, type=str)
        update_project_data = update_project_parser.parse_args()
        current_project = Project.query.filter_by(
            project_id=update_project_data['project_id'],
            is_deleted=False).first()
        if not current_project:
            return api_response(False, APIMessages.PROJECT_NOT_EXIST,
                                STATUS_BAD_REQUEST)
        check_permission(user_object=session.user,
                         list_of_permissions=PROJECT_PUT,
                         project_id=update_project_data["project_id"],
                         org_id=current_project.org_id)
        update_project_data['project_name'] = update_project_data[
            'project_name'].strip()
        list_of_args = [arg.name for arg in update_project_parser.args]
        request_data_validation = validate_empty_fields(
            update_project_data,
            list_of_args)
        if request_data_validation:
            return api_response(success=False,
                                message=request_data_validation,
                                http_status_code=STATUS_BAD_REQUEST,
                                data={})
        current_project.project_name = update_project_data['project_name']
        current_project.save_to_db()
        return api_response(True,
                            APIMessages.UPDATE_RESOURCE.format('Project'),
                            STATUS_OK)

    @token_required
    def get(self, session):
        """
        GET call to retrieve project details.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code

        """
        get_project_parser = reqparse.RequestParser()
        get_project_parser.add_argument(
            'org_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int, location='args')
        get_project_data = get_project_parser.parse_args()
        # TODO: Check if organization is active and called has access
        user_obj = session.user
        # TODO:Add Check permission
        # check_permission(user_object=session.user,
        #                  list_of_permissions=PROJECT_GET,
        #                  org_id=get_project_data["org_id"])
        # check if user has all org level permissions
        user_org_role = UserOrgRole.query.filter_by(
            user_id=session.user_id,
            org_id=get_project_data['org_id']).first()
        if user_obj.is_super_admin == True or user_org_role:
            # Storing all active projects in a list
            list_of_active_project_obj = Project.query.filter_by(
                org_id=get_project_data['org_id'], is_deleted=False).all()
            if not list_of_active_project_obj:
                return api_response(False,
                                    APIMessages.NO_RESOURCE.format('Project'),
                                    STATUS_UNAUTHORIZED)
            projects_to_return = project_detail(list_of_active_project_obj,
                                                user_org_role)
            return api_response(
                True, APIMessages.SUCCESS, STATUS_OK,
                {"projects_under_organization": projects_to_return})
        else:
            project_obj = UserProjectRole.query.filter(
                UserProjectRole.user_id == session.user_id,
                UserProjectRole.org_id == get_project_data['org_id']).all()
            if not project_obj:
                return api_response(False,
                                    APIMessages.NO_RESOURCE.format('Project'),
                                    STATUS_UNAUTHORIZED)
            active_project = set()
            for each_project in project_obj:
                active_project.add(
                    each_project.project_id)
            list_of_active_project_obj = Project.query.filter(
                Project.project_id.in_(active_project),
                Project.is_deleted == False).all()
            projects_to_return = project_detail(list_of_active_project_obj,
                                                user_org_role)
            return api_response(
                True, APIMessages.SUCCESS, STATUS_OK,
                {"projects_under_organization": projects_to_return})

    @token_required
    def delete(self, session):
        """
        DELETE call to delete project details.

        Args:
            session(object): User session
            project_id: project_id to be deleted

        Returns: Standard API Response with HTTP status code

        """
        db_connections=[]
        suites=[]
        user_associated=[]
        distinct_user_associated=[]
        get_project_parser = reqparse.RequestParser()
        get_project_parser.add_argument(
            'project_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int, location='args')
        get_project_data = get_project_parser.parse_args()
        project_obj = Project.query.filter_by(project_id =get_project_data['project_id'],is_deleted=False).first()
        if not project_obj:
            return api_response(False,
                                    APIMessages.NO_RESOURCE.format('Project'),
                                    STATUS_UNAUTHORIZED)
        check_permission(user_object=session.user,
                         list_of_permissions=PROJECT_PUT,
                         project_id=get_project_data["project_id"],
                         org_id=project_obj.org_id)
        test_suite_obj=TestSuite.query.filter_by(project_id=project_obj.project_id,is_deleted=False).all()
        db_connection_obj = DbConnection.query.filter_by(project_id = project_obj.project_id,is_deleted=False).all()
        user_project_role_obj = UserProjectRole.query.filter_by(project_id=project_obj.project_id).all()
        if not test_suite_obj and not db_connection_obj and not user_project_role_obj:
            project_obj.is_deleted=True
            project_obj.save_to_db()
            
            delete_message = APIMessages.DELETE_PROJECT_TRUE.format(project_obj.project_name)
        else:
            for each_obj in db_connection_obj:
                db_connections.append({"db_connection_id":each_obj.db_connection_id,
                "db_connection_name":each_obj.db_connection_name})
            for each_suite in test_suite_obj:
                suites.append({"suite_id":each_suite.test_suite_id, "suite_name":each_suite.test_suite_name})
            for each_user in user_project_role_obj:
                user_obj = User.query.filter_by(user_id=each_user.user_id).first()
                user_associated.append({"user_id":user_obj.user_id,"email_id":user_obj.email})
            if user_associated == []:
                distinct_user_associated =[]
            else:
                distinct_user_associated = unique_users(user_associated)
            delete_message = APIMessages.DELETE_PROJECT_FALSE.format(project_obj.project_name)
        user_obj = session.user
        return api_response(
                True, APIMessages.SUCCESS, STATUS_OK,{"data":{
                                                            "message":delete_message,
                                                            "db_connections":db_connections,
                                                            "test_suites":suites,
                                                                "Asociated_users":distinct_user_associated}})


def unique_users(user_associated):
    """
    Returns list of key,value pairs with unique users

    Args:
        user_associated(list): list of users with duplicate copies

    Returns:Returns list of key,value pairs with unique users

    """
    unique_users=[]
    uids=[]
    for each_user in user_associated:
        if each_user['user_id'] not in uids:
            uids.append(each_user['user_id'])
            unique_users.append(each_user)
    return unique_users