from application.common.constants import ExecutionStatus
from application.helper.runnerclass import run_by_case_id
from application.helper.runnerclass import save_job_status, save_case_log
from application.model.models import TestSuite, TestCase, TestCaseLog
from flask_celery import make_celery
from index import app

celery = make_celery(app)


def create_job(user_id, suite_id, is_external, case_id_list=None):
    """
     Method will create a job , submit the job for the given id.
     Args:
         user_id (Int): User id of the executor
         suite_id (Int): suite id of the test suite passed
         is_external (bool): boolean value
         case_id_list (List): list of all the cases

     Returns: submit the job through celery ,and returns its status

    """
    execution_status_new = ExecutionStatus().get_execution_status_id_by_name(
        'new')
    suite_obj = TestSuite.query.filter_by(test_suite_id=int(suite_id)).first()
    if not case_id_list:
        case_id_list = [case.test_case_id for case in suite_obj.test_case]
    job, job_id = save_job_status(suite_obj.test_suite_id, user_id,
                                  is_external)
    for each_case in case_id_list:
        case_obj = TestCase.query.filter_by(test_case_id=each_case).first()
        save_case_log(case_obj.test_case_id, execution_status_new, job_id)
    job_submit.delay(job_id, user_id)  # submit the job
    return True


@celery.task(name='job_submit')
def job_submit(job_id, user_id):
    """
    Method will submit each case associated with the job id in the celery queue
    parralely.
    Args:
        job_id (Int): Job id of the job passed
        user_id (int): User id associated with the executor

    Returns: Status of the jobs

    """
    execution_status_new = ExecutionStatus().get_execution_status_id_by_name(
        'new')
    test_case_log_obj = TestCaseLog.query.filter_by(job_id=job_id).all()
    # change job status ->inprogress
    for each_case in test_case_log_obj:
        if each_case.execution_status == execution_status_new:
            # Submit to 2 queues based on type
            run_by_case_id(each_case, each_case.test_case_id, user_id)
    # Wait for all sub-jobs to be completed
    # change job status -> pass/failed
    # Based on config send mail using another queue
    # send_mail(job_id)
