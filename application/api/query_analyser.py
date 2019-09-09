from flask import current_app as app

from flask_restful import Resource, reqparse

from application.common.constants import (APIMessages, ExecutionStatus,
                                          SupportedTestClass, SupportedDBType)
from application.common.response import (STATUS_CREATED, STATUS_SERVER_ERROR,
                                         STATUS_BAD_REQUEST,STATUS_OK)
from application.common.response import api_response

from application.common.token import (token_required)
from application.common.runbysuiteid import create_job

from application.model.models import (DbConnection, User, Project, Query)
from application.helper.permission_check import check_permission


class QueryAnalyser(Resource):
    """
    QueryAnalyser Executes the manual query provided by the user
    """

    @token_required
    def post(self,session):
        """
        Executes the manual query provided by the user
        returns Success response on Execution or error log
        in case of a error

        Args:
            session(Object): session gives user ID of the owner
            who is execution the job

        Returns: Return api response ,either successful job run or error.
        """
        try:

            user_id = session.user_id
            query_parser = reqparse.RequestParser()
            query_parser.add_argument('project_id', type=int, required=True,
                                help=APIMessages.PARSER_MESSAGE,)
            query_parser.add_argument('connection_id', type=int, required=True,
                                help=APIMessages.PARSER_MESSAGE,)
            query_parser.add_argument('query', type=str, required=True,
                                help=APIMessages.PARSER_MESSAGE,)
            query_data = query_parser.parse_args()
            print("########")
            project_obj = Project.query.filter_by(
                project_id=query_data['project_id']).first()
            print(project_obj.project_id)
            if not project_obj:
                raise ResourceNotAvailableException(
                    APIMessages.PROJECT_NOT_EXIST)
            db_connection = DbConnection.query.filter(
                DbConnection.db_connection_id == query_data['connection_id'],
                DbConnection.project_id == query_data['project_id'])
            if db_connection:
                user_obj = User.query.filter_by(user_id=1,
                                                is_deleted=False).first()
                check_permission(user_obj, list_of_permissions=["execute"],
                                 org_id=project_obj.org_id,
                                 project_id=project_obj.project_id)
                query_obj = Query(project_id=project_obj.project_id,
                                  query_string=query_data['query'],
                                  db_connection_id=query_data['connection_id'],
                                  owner_id=user_id,
                                  execution_status=ExecutionStatus().
                                  get_execution_status_id_by_name('new'))
                print(query_obj)
                query_obj.save_to_db()
                print(query_obj.query_id)
                # Create a Job
                # create_job(user_id, test_suite_obj, is_external)
                return api_response(True, APIMessages.JOB_SUBMIT,
                                    STATUS_CREATED)
            else:
                return api_response(False, APIMessages.WRONG_DB_CONNECTION,
                                    STATUS_SERVER_ERROR)

        except Exception as e:
            app.logger.error(e)
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR)
    @token_required
    def get(self, session):
        """
        Returns the list of queries for the give project
        Args:
            project_id (int): project_id of the project for which queries to be
             returned
        Returns: Return api response and queries.
        """
        query_parser = reqparse.RequestParser()
        query_parser.add_argument('project_id', type=int, required=True,
                                  help=APIMessages.PARSER_MESSAGE, location='args')
        query_data = query_parser.parse_args()
        query_obj_list = Query.query.filter_by(project_id=query_data['project_id']).all()
        query_list = list()

        for query_obj in query_obj_list:
            query_list.append(
                {'query_id':query_obj.query_id,
                 'query_string':query_obj.query_string,
                 'project_id' : query_obj.project_id,
                 'execution_status' : query_obj.execution_status,
                 'db_connection_id' : query_obj.db_connection_id,
                 'owner_id': query_obj.owner_id,
                 'query_result' : query_obj.query_result,
                 'is_deleted' : query_obj.is_deleted
                 })
            return api_response(True, APIMessages.SUCCESS, STATUS_OK)

class QueryExporter(Resource):
    """

    """
    token_required()
    def post(self, session):
        try:
            user_id = session.user_id
            query_parser = reqparse.RequestParser()
            query_parser.add_argument('query_id', type=int, required=True,
                                      help=APIMessages.PARSER_MESSAGE, )
            query_data = query_parser.parse_args()

            query_obj = Query.query.filter_by(
                query_id=query_data['query_id']).first()
            if query_obj:
                user_obj = User.query.filter_by(user_id=user_id,
                                                is_deleted=False).first()
                project_obj = Project.query.filter_by(
                    project_id=query_obj.project_id).first()
                check_permission(user_obj, list_of_permissions=["execute"],
                                 org_id=project_obj.org_id,
                                 project_id=project_obj.project_id)

            else:
                return api_response(False, APIMessages.WRONG_QUERY_ID,
                                    STATUS_SERVER_ERROR)
        except Exception as e:
            app.logger.error(e)
            return api_response(False, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR)

