/**
 * Mocking client-server processing
 */
// import _testSuitesData from '../json/test-suites-data.json';
// import _getAllConnections from '../json/getAllConnections.json';
// import _viewTestCase from '../json/viewTestCase.json';
// import _viewTestCaseLog from '../json/viewLogs.json';
// import _db_connection_detail from '../json/db-connection-detail.json';
// import test_case_detail_by_suit_id from '../json/test_case_detail_by_suit_id.json';
// import _select_connection_post from '../json/select_connection_post.json';

import { BASE_URL, headers, TIMEOUT } from './appActions';
import { 
	GET_ALL_TEST_SUITES_SUCCESS,
	GET_ALL_TEST_SUITES_ERROR,
	EXECUTE_TEST_BY_SUITE_ID_SUCCESS,
	EXECUTE_TEST_BY_SUITE_ID_ERROR,
	EXECUTE_TEST_BY_CASE_ID_SUCCESS,
	EXECUTE_TEST_BY_CASE_ID_ERROR,
	GET_ALL_CONNECTIONS_SUCCESS, 
	GET_ALL_CONNECTIONS_ERROR,
	SELECT_CONNECTIONS_SUCCESS,
	SELECT_CONNECTIONS_ERROR,
	GET_TESTCASE_LOG_BY_ID_SUCCESS,
	MANAGE_CONNECTIONS_CASE_UPDATE,
	HIDE_MANAGE_CONNECTIONS_DIALOG,
	HIDE_CASE_LOG_DIALOG,
	HIDE_TEST_CASE_DIALOG,
	SHOW_TEST_CASE_EDIT_ENABLED,
	SAVE_MANAGE_CONNECTION_DETAILS,
	SHOW_TEST_CASE_VIEW_ENABLED,
	GET_TEST_CASE_BY_TEST_CASE_ID_SUCCESS,
	GET_TEST_CASE_BY_TEST_CASE_ID_ERROR,
	GET_TESTCASE_DETAIL_BY_SUITE_ID_SUCCESS,
	GET_TESTCASE_DETAIL_BY_SUITE_ID_ERROR,
	UPDATE_TEST_CASE_SUCCESS,
	UPDATE_TEST_CASE_ERROR,
	GET_EACH_TEST_CASE_BY_CASE_ID_SUCCESS,
	GET_EACH_TEST_CASE_BY_CASE_ID_ERROR,
	GET_TESTCASE_LOG_BY_ID_ERROR,
	GET_TESTCASE_DETAIL_BY_SUITE_ID_REQUEST,
	GET_EACH_TEST_CASE_BY_CASE_ID_REQUEST,
	GET_ALL_TEST_SUITES_REQUEST
} from "../constants/ActionTypes"; 

export const hideManageConnectionsDialog = () => ({
	type: HIDE_MANAGE_CONNECTIONS_DIALOG
});

export const manageConnectionsCaseUpdate = data => ({
	type: MANAGE_CONNECTIONS_CASE_UPDATE,
	data
});

export const hideCaseLogDialog = () => ({
	type: HIDE_CASE_LOG_DIALOG
});

export const hideTestCaseDialog = () => ({
	type: HIDE_TEST_CASE_DIALOG
});

export const showTestCaseEditEnabled = () => ({
	type: SHOW_TEST_CASE_EDIT_ENABLED
});

export const showTestCaseViewEnabled = () => ({		
	type: SHOW_TEST_CASE_VIEW_ENABLED		
});

export const saveManageConnectionDetails = data => ({
	type: SAVE_MANAGE_CONNECTION_DETAILS,
	data
});

export const getAllTestSuites = (projectId) => {
	return {
		types: [
			GET_ALL_TEST_SUITES_REQUEST,
			GET_ALL_TEST_SUITES_SUCCESS,
			GET_ALL_TEST_SUITES_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-suite?project_id=${projectId}`, {
			method: 'get',
			headers
		})
	};
};

export const executeTestBySuiteId = (suiteID) => {
	return {
		types: [
			'',
			EXECUTE_TEST_BY_SUITE_ID_SUCCESS,
			EXECUTE_TEST_BY_SUITE_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-case-job/`, {
			method: 'post',
			headers,
			body: JSON.stringify({'suite_id': suiteID})
		})
	};
	//getTestCaseDetailBySuiteId(suiteID);
};

export const executeTestByCaseId = (caseIdList) => {
	return {
		types: [
			'',
			EXECUTE_TEST_BY_CASE_ID_SUCCESS,
			EXECUTE_TEST_BY_CASE_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-case-job/`, {
			method: 'post',
			headers,
			body: JSON.stringify({'case_id_list': caseIdList})
		})
	};
	 
    // getEachTestCaseDetailByCaseID(caseIdList);
};

export const getAllConnections = (projectId) => {
	return {
		types: [
			'',
			GET_ALL_CONNECTIONS_SUCCESS,
			GET_ALL_CONNECTIONS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-connection-detail?project_id=${projectId}`, {
			method: 'get',
			headers
		})
	};		
};

export const getTestCaseDetailBySuiteId = (suiteId, showDialog) => {
	return {
		types: [
			'',// GET_TESTCASE_DETAIL_BY_SUITE_ID_REQUEST,
			GET_TESTCASE_DETAIL_BY_SUITE_ID_SUCCESS,
			GET_TESTCASE_DETAIL_BY_SUITE_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-case-detail?suite_id=${suiteId}`, {
			method: 'get',
			headers
		}),
		args: { suiteId, showDialog }
	};	
};

export const getTestCaseByTestCaseId = (caseID) => {
	return {
		types: [
			'',
			GET_TEST_CASE_BY_TEST_CASE_ID_SUCCESS,
			GET_TEST_CASE_BY_TEST_CASE_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/edit-test-case?test_case_id=${caseID}`, {
			method: 'get',
			headers
		})
	};	
};

export const getEachTestCaseDetailByCaseID = (caseID) => {
	return {
		types: [
			'',//GET_EACH_TEST_CASE_BY_CASE_ID_REQUEST,
			GET_EACH_TEST_CASE_BY_CASE_ID_SUCCESS,
			GET_EACH_TEST_CASE_BY_CASE_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/each-case-detail?test_case_id=${caseID}`, {
			method: 'get',
			headers
		}), 
		args: { caseID }
	};
};

export const updateTestCase = (body) => {
	return {
		types: [
			'',
			UPDATE_TEST_CASE_SUCCESS,
			UPDATE_TEST_CASE_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/edit-test-case/`, {
			method: 'put',
			headers,
			body: JSON.stringify(body)
		})
	};		
};

export const updateConnections = (body) => {
	return {
		types: [
			'',
			SELECT_CONNECTIONS_SUCCESS,
			SELECT_CONNECTIONS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/select-connection`, {
			method: 'post',
			headers,
			body: JSON.stringify(body)
		})
	};	
};

export const getTestCaseLogById = (logID, testCaseName) =>{
	return {
		types: [
			'',
			GET_TESTCASE_LOG_BY_ID_SUCCESS,
			GET_TESTCASE_LOG_BY_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-case-log?test_case_log_id=${logID}`, {
			method: 'get',
			headers
		}),
		args: { testCaseName }
	};		
};