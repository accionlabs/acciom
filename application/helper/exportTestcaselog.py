from tempfile import NamedTemporaryFile

from flask import Response
from openpyxl import Workbook

from application.common.constants import SupportedTestClass, TestClass
from application.model.models import TestCaseLog


def export_test_case_log(case_log_id):
    """
    Method will return an excel of the case_log.
    Args:
        case_log_id: case_log Id associated with log.

    Returns:  return an excel of the case_log.

    """
    export_response = []
    case_log = TestCaseLog.query.filter_by(
        test_case_log_id=case_log_id).first()
    test_case = case_log.test_cases

    if test_case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            'Datavalidation'):
        log_data = case_log.execution_log  # dict
        if log_data["source_execution_log"] and not log_data[
            "dest_execution_log"]:
            dict_src = log_data["source_execution_log"]
            dict_src.insert(0, ["Source Table"])
            response = dict_src

        if log_data["dest_execution_log"] and not log_data[
            "source_execution_log"]:
            dict_dest = log_data["dest_execution_log"]
            dict_dest.insert(0, ["Target Table"])
            response = dict_dest

        if log_data["dest_execution_log"] and log_data["source_execution_log"]:
            dict_src = log_data["source_execution_log"]
            dict_src.insert(0, ["Source Table"])
            dict_dest = log_data["dest_execution_log"]
            dict_src.append(["Target Table"])
            for each_response in dict_dest:
                dict_src.append(each_response)
            response = dict_src


    elif test_case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            TestClass.COUNT_CHECK):
        src_response = case_log.execution_log["source_execution_log"]
        des_response = case_log.execution_log["dest_execution_log"]
        res = [['Source Count', 'destination Count']]
        res.append([src_response, des_response])
        response = res


    elif test_case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            TestClass.DUPLICATE_CHECK):
        response = case_log.execution_log["dest_execution_log"]

    elif test_case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            TestClass.NULL_CHECK):
        response = case_log.execution_log["dest_log"]

    elif test_case.test_case_class == SupportedTestClass().get_test_class_id_by_name(
            TestClass.DDL_CHECK):
        src_response = case_log.execution_log["source_execution_log"]
        dest_response = case_log.execution_log["dest_execution_log"]
        src_response.append(["Target Schema"])
        for each_response in dest_response:
            src_response.append(each_response)
        src_response.insert(0, ["Source Schema"])
        response = src_response

    work_book = Workbook()
    work_sheet = work_book.active

    for each in response:
        work_sheet.append(list(each))

    with NamedTemporaryFile(delete=False) as tmp_file:
        work_book.save(tmp_file.name)
        tmp_file.seek(0)
        stream = tmp_file.read()
        case_name = SupportedTestClass().get_test_class_name_by_id(
            test_case.test_case_class)
    return Response(
        stream,
        mimetype="application/vnd.openxmlformats-officedocument."
                 "spreadsheetml.sheet",
        headers={"Content-disposition": "attachment; "
                                        "filename={}.xlsx".format(case_name)})
