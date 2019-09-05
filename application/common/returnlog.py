from application.common.constants import ExecutionStatus, SupportedTestClass
from application.model.models import TestCaseLog, TestCase


def return_all_log(case_log_id):
    """
    Method to return Case_log of a case_log_id

    Args:
        case_log_id(int): Accepts test_Case_log_id as argument

    Returns: return Case_log
    """

    def test_case_log_json(case_log):
        case_obj = TestCase.query.filter_by(test_case_id=case_log.test_case_id,
                                            is_deleted=False).first()
        if case_obj:
            test_case_class_id = case_obj.test_case_class
            test_case_class_display_name = SupportedTestClass().get_test_class_display_name_by_id(
                test_case_class_id)
            test_case_class_name = SupportedTestClass().get_test_class_name_by_id(
                test_case_class_id)
        payload = {
            "test_case_log_id": case_log.test_case_log_id,
            "test_case_id": case_log.test_case_id,
            'test_case_class_id': test_case_class_id,
            'test_case_class_name': test_case_class_name,
            'test_case_class_display_name': test_case_class_display_name,
            "Execution_status": ExecutionStatus().get_execution_status_by_id(
                case_log.execution_status),
            "Execution_log": case_log.execution_log
        }
        return payload

    return {"log_data": test_case_log_json(TestCaseLog.query.filter_by(
        test_case_log_id=case_log_id
    ).first())}
