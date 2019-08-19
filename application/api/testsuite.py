from flask import current_app as app
from flask import request
from flask_restful import reqparse, Resource
from sqlalchemy.exc import SQLAlchemyError

from application.common.constants import APIMessages
from application.common.constants import SupportedTestClass
from application.common.createdbdetail import create_dbconnection
from application.common.response import (STATUS_CREATED, STATUS_SERVER_ERROR,
                                         STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.returnlog import return_all_log
from application.common.runbysuiteid import create_job
from application.common.token import (token_required)
from application.helper.exportTestcaselog import export_test_case_log
from application.helper.returnallsuites import (return_all_suites,
                                                test_case_details)
from application.helper.runnerclasshelpers import args_as_list
from application.helper.uploadfiledb import save_file_to_db
from application.model.models import (Project, TestCaseLog, TestCase,
                                      TestSuite)
from index import db


class TestSuiteAPI(Resource):
    """
    AddTestSuite Uploads the suite
    """

    @token_required
    def post(self, session):
        """
        Method will add a suite to database

        Args:
            session(Object): contains User_id.

        Returns: Add suite to Database
        """
        parser = reqparse.RequestParser()
        parser.add_argument('sheet_name',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=str)
        parser.add_argument('case_id_list',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=args_as_list, default=[])
        parser.add_argument('suite_name',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True, type=str)
        parser.add_argument('upload_and_execute',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        parser.add_argument('project_id',
                            help=APIMessages.PARSER_MESSAGE,
                            required=True)
        test_suite_data = parser.parse_args()
        current_user = session.user_id
        file = request.files['inputFile']
        suite_result = save_file_to_db(current_user,
                                       test_suite_data['project_id'],
                                       test_suite_data, file)
        if int(test_suite_data['upload_and_execute']) == 1:
            test_suite_obj = TestSuite.query.filter_by(
                test_suite_id=int(suite_result['Suite'].test_suite_id)).first()
            create_job(current_user, test_suite_obj, False)
        return api_response(True, APIMessages.ADD_DATA, STATUS_CREATED)

    @token_required
    def get(self, session):
        """
        Method will give suite details, case details  of the user based on the
        token of the user

        Args:
            session(Object): session contains user_id

        Returns: returns suite level details of associated user
        """
        try:
            get_project_id_parser = reqparse.RequestParser()
            get_project_id_parser.add_argument('project_id', required=False,
                                               type=int,
                                               location='args')
            project_id = get_project_id_parser.parse_args()
            project_obj = Project.query.filter_by(
                project_id=project_id['project_id']).first()
            if not project_obj:
                return api_response(True, APIMessages.PROJECT_NOT_EXIST,
                                    STATUS_SERVER_ERROR)
            else:
                data = {"suites": return_all_suites(project_id['project_id'])}
                return api_response(True, APIMessages.RETURN_SUCCESS,
                                    STATUS_CREATED, data)
        except Exception as e:
            app.logger.debug(str(e))
            return api_response(True, APIMessages.INTERNAL_ERROR,
                                STATUS_SERVER_ERROR)


class AddTestSuiteManually(Resource):
    """ To add a test suite manually by a user."""

    @token_required
    def post(self, session):
        """
        It handles a POST API to add new test suite into database.

       Args:
            session (object):By using this object we can get the user_id.

        Returns:
            Standard API Response with message(returns message saying
            that test suite added successfully) and http status code.
        """
        try:
            test_suite_parser = reqparse.RequestParser()
            test_suite_parser.add_argument('suite_name',
                                           help=APIMessages.PARSER_MESSAGE,
                                           required=True, type=str)
            test_suite_parser.add_argument('project_id',
                                           help=APIMessages.PARSER_MESSAGE,
                                           required=True, type=int)
            test_suite_parser.add_argument('test_case_detail',
                                           help=APIMessages.PARSER_MESSAGE,
                                           required=True, type=list,
                                           location='json')
            test_suite_data = test_suite_parser.parse_args()

            test_suite = TestSuite(project_id=test_suite_data["project_id"],
                                   owner_id=session.user_id,
                                   excel_name=None,
                                   test_suite_name=test_suite_data[
                                       'suite_name'])
            test_suite.save_to_db()
            keys = []
            for each_test_case in test_suite_data['test_case_detail']:
                for key in each_test_case:
                    keys.append(key)
                if "source_db_existing_connection" not in keys:
                    src_db_id = create_dbconnection(session.user_id,
                                                    each_test_case[
                                                        'source_db_type'].lower(),
                                                    each_test_case[
                                                        'source_db_name'],
                                                    each_test_case[
                                                        'source_db_server'].lower(),
                                                    each_test_case[
                                                        'source_db_username'],
                                                    each_test_case[
                                                        "project_id"])
                else:
                    src_db_id = each_test_case[
                        "source_db_existing_connection"]
                if "target_db_existing_connection" not in keys:
                    target_db_id = create_dbconnection(session.user_id,
                                                       each_test_case[
                                                           'target_db_type'].lower(),
                                                       each_test_case[
                                                           'target_db_name'],
                                                       each_test_case[
                                                           'target_db_server'].lower(),
                                                       each_test_case[
                                                           'target_db_username'],
                                                       each_test_case[
                                                           "project_id"])
                else:
                    target_db_id = each_test_case[
                        "target_db_existing_connection"]
                table = {}
                table[each_test_case["source_table"]] = each_test_case[
                    "target_table"]
                if "column" not in keys:
                    column = {}
                else:
                    each_test_case["column"] = each_test_case[
                        "column"].replace(
                        " ",
                        "")
                    if ";" and ":" in each_test_case["column"]:
                        column = {}
                        user_columns = each_test_case["column"].split(
                            ";")
                        for columnpair in user_columns:
                            if ":" in columnpair:
                                singlecolumn = columnpair.split(
                                    ":")
                                column[singlecolumn[0]] = \
                                    singlecolumn[1]
                            else:
                                column[columnpair] = columnpair
                    elif ";" in each_test_case["column"]:
                        column = {}
                        columns = each_test_case["column"].split(";")
                        for singlecolumn in columns:
                            column[singlecolumn] = singlecolumn
                    else:
                        column = {}
                        column[each_test_case["column"]] = \
                            each_test_case["column"]
                query = {}
                if "source_query" not in keys and "target_query" not in keys:
                    query["sourceqry"] = ""
                    query["targetqry"] = ""
                elif "source_query" not in keys:
                    query["sourceqry"] = ""
                    query["targetqry"] = each_test_case["target_query"]
                else:
                    query["sourceqry"] = each_test_case["source_query"]
                    query["targetqry"] = each_test_case["target_query"]
                jsondict = {"column": column, "table": table, "query": query,
                            "src_db_id": src_db_id,
                            "target_db_id": target_db_id,
                            "test_desc": each_test_case["test_description"]}

                test_case = TestCase(test_suite_id=test_suite.test_suite_id,
                                     owner_id=session.user_id,
                                     test_case_class=SupportedTestClass().
                                     get_test_class_id_by_name(
                                         each_test_case["test_case_class"]),
                                     test_case_detail=jsondict)

                test_case.save_to_db()
            return api_response(True, APIMessages.TEST_SUITE_ADDED,
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


class TestCaseLogDetail(Resource):
    @token_required
    def get(self, session):
        """
        Method call will return the log of the Executed case based on its
        test_case_log_id
        Returns: return the log of the case_log_id
        """
        try:
            test_case_log = reqparse.RequestParser()
            test_case_log.add_argument('test_case_log_id',
                                       required=True,
                                       type=int,
                                       location='args')
            test_case_logid = test_case_log.parse_args()
            db_obj = TestCaseLog.query.filter_by(
                test_case_log_id=test_case_logid['test_case_log_id']).first()
            if not db_obj:
                return api_response(False,
                                    APIMessages.TESTCASELOGID_NOT_IN_DB.format(
                                        test_case_logid['test_case_log_id']),
                                    STATUS_BAD_REQUEST)
            test_case_log = test_case_log.parse_args()
            log_data = {"test_case_log": return_all_log(
                test_case_log['test_case_log_id']),
                "success": True}
            return api_response(True, APIMessages.RETURN_SUCCESS,
                                STATUS_CREATED, log_data)
        except Exception as e:
            return api_response(True, APIMessages.INTERNAL_ERROR, str(e))


class ExportTestLog(Resource):
    """
    Class to Export log to Excel of the executed case based on the
     test_case_log_id
    """

    @token_required
    def get(self, session):
        """
        Method will Export log to Excel based on the test_case_log_id of the
        executed job
        Returns:  Export log to Excel based on the test_case_log_id of the
        executed job
        """
        test_case_log = reqparse.RequestParser()
        test_case_log.add_argument('test_case_log_id',
                                   required=False,
                                   type=int,
                                   location='args')
        test_case_log = test_case_log.parse_args()
        db_obj = TestCaseLog.query.filter_by(
            test_case_log_id=test_case_log['test_case_log_id']).first()
        if not db_obj:
            return api_response(False,
                                APIMessages.TESTCASELOGID_NOT_IN_DB.format(
                                    test_case_log['test_case_log_id']),
                                STATUS_BAD_REQUEST)

        return export_test_case_log(test_case_log['test_case_log_id'])


class TestCaseLogAPI(Resource):
    def get(self):
        test_case_detail = reqparse.RequestParser()
        test_case_detail.add_argument('test_case_id',
                                      required=False,
                                      type=int,
                                      location='args')
        test_case_detail = test_case_detail.parse_args()
        case_obj = TestCase.query.filter_by(
            test_case_id=test_case_detail['test_case_id']).first()
        if not case_obj:
            return api_response(False,
                                APIMessages.TEST_CASE_NOT_IN_DB.format(
                                    test_case_detail['test_case_id']),
                                STATUS_BAD_REQUEST)

        return test_case_details(test_case_detail['test_case_id'])
