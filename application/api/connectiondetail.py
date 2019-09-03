from flask_restful import Resource, reqparse

from application.common.common_exception import ResourceNotAvailableException
from application.common.constants import APIMessages
from application.common.response import (api_response, STATUS_SERVER_ERROR,
                                         STATUS_CREATED, STATUS_BAD_REQUEST)
from application.common.token import (token_required)
from application.helper.connectiondetails import (select_connection,
                                                  get_db_connection,
                                                  get_case_detail)
from application.helper.permission_check import check_permission
from application.model.models import (Project, TestSuite, DbConnection,
                                      TestCase, User)


class SelectConnection(Resource):
    """
    class to select a connection
    """

    @token_required
    def post(self, session):
        """
        Method will allow user to select connection for particular user
        Args:
            session (Obj): gives user_id of the user

        Returns:will allow user to select connection for particular user
        """
        parser = reqparse.RequestParser()
        parser.add_argument('connection_reference',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        parser.add_argument('case_id_list',
                            type=list, location="json",
                            help=APIMessages.PARSER_MESSAGE)
        parser.add_argument('db_connection_id',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        data = parser.parse_args()
        user = session.user_id
        case_obj = TestCase.query.filter_by(
            test_case_id=data['case_id_list'][0]).first()
        suite_obj = TestSuite.query.filter_by(
            test_suite_id=case_obj.test_suite_id).first()
        project_obj = Project.query.filter_by(
            project_id=suite_obj.project_id).first()
        user_obj = User.query.filter_by(user_id=user).first()
        print(project_obj.org_id, project_obj.project_id)
        check_permission(user_obj, ['edit_project'], org_id=project_obj.org_id,
                         project_id=project_obj.project_id)
        select_connection(data, user)

        return api_response(True, APIMessages.RETURN_SUCCESS,
                            STATUS_CREATED)


class DbConnection(Resource):
    """
    Class to handle GET API to give all the db_connection_ids
    associated with the project_id.
    """

    @token_required
    def get(self, session):
        """
        Method will give all the db_connection_ids and db connection name.

        Args:
             session (object):By using this object we can get the user_id.

        Returns:
              Standard API Response with message(returns message saying
              that success), data and http status code.
        """
        db_connection_detail = reqparse.RequestParser()
        db_connection_detail.add_argument('project_id', required=True,
                                          type=int,
                                          location='args')
        project_data = db_connection_detail.parse_args()
        project_obj = Project.query.filter(
            Project.project_id == project_data['project_id'],
            Project.is_deleted == False).first()
        if not project_obj:
            raise ResourceNotAvailableException("Project")
        check_permission(session.user, ["view_db_details"],
                         project_obj.org_id, project_data["project_id"])
        payload = get_db_connection(project_data['project_id'])
        return api_response(True, APIMessages.SUCCESS,
                            STATUS_CREATED, payload)


def get_case_detail(suite_id):
    """
    To get all the test case details associated with the particular suite id
    provided in the args.

    Args:
        suite_id(int):Test suite id

    Returns:
        Returns a dictionary containing test case details.
    """
    suite_obj = TestSuite.query.filter_by(test_suite_id=suite_id).first()
    all_case = [{"case_id": each_case.test_case_id,

                 "case_name": each_case.test_case_detail.get('test_desc',
                                                             APIMessages.NO_NAME_DEFINE),
                 'test_class_name': SupportedTestClass().get_test_class_display_name_by_id(
                     each_case.test_case_class),
                 'test_class_id': each_case.test_case_class,
                 "source_db_connection_id": check_db_id(
                     each_case.test_case_detail.get(
                         'src_db_id')),
                 "source_db_connection_name": get_connection_name(
                     each_case.test_case_detail.get('src_db_id')),
                 'test_status': each_case.latest_execution_status,
                 'test_status_name': ExecutionStatus().get_execution_status_by_id(
                     each_case.latest_execution_status),
                 "target_db_connection_id": check_db_id(
                     each_case.test_case_detail.get(
                         'target_db_id')),
                 "target_db_connection_name": get_connection_name(
                     each_case.test_case_detail.get('target_db_id')),
                 }
                for each_case in suite_obj.test_case if
                each_case.is_deleted == False]
    payload = {"suite_id": suite_obj.test_suite_id,
               "suite_name": suite_obj.test_suite_name,
               "all_cases": all_case}
    return payload
