import { 
	GET_ALL_TEST_SUITES_SUCCESS,
	EXECUTE_TEST_BY_SUITE_ID_SUCCESS ,
	GET_ALL_CONNECTIONS_SUCCESS,
	SELECT_CONNECTIONS_SUCCESS,
	EXECUTE_TEST_BY_CASE_ID_SUCCESS,
	GET_TESTCASE_LOG_BY_ID_SUCCESS,
	MANAGE_CONNECTIONS_CASE_UPDATE,
	HIDE_MANAGE_CONNECTIONS_DIALOG,
	HIDE_CASE_LOG_DIALOG,
	GET_TEST_CASE_BY_TEST_CASE_ID_SUCCESS,
	UPDATE_TEST_CASE_SUCCESS,
	HIDE_TEST_CASE_DIALOG,
	SHOW_TEST_CASE_EDIT_ENABLED,
	SHOW_TEST_CASE_VIEW_ENABLED,
	GET_TESTCASE_DETAIL_BY_SUITE_ID_SUCCESS,
	SWITCH_PROJECT_SUCCESS,
	GET_PROJECT_LIST_BY_ORG_ID_SUCCESS,
	GET_EACH_TEST_CASE_BY_CASE_ID_SUCCESS,
	GET_ALL_TEST_SUITES_REQUEST
} from '../constants/ActionTypes';

const initialState = {
	testSuiteList: [],
	connectionsList:{
	   showConnectionsDialog: false,
	   allCases: {},
	   allConnections: []
	},
	testCaseLog: {
		showCaseLogDialog: false,
		logData: null,
		testCaseName: null
	},
	testCase: {
		showTestCaseDialog: false,
		testCaseDetails:[]
	},
	eachTestCaseDetails: {},
	showTestCaseEditEnabled: false,
	refreshTestSuites: false,
	showTestCaseViewEnabled: false
};

const testSuites = (state = initialState, action) => {
	switch (action.type) {
	case GET_ALL_TEST_SUITES_REQUEST:
		return {
			...state,
			connectionsList:{
				...state.connectionsList,
				showConnectionsDialog: false
			 },
			testCaseLog: {
				...state.testCaseLog,
				showCaseLogDialog: false
			},
			testCase: {
				...state.testCase,
				showTestCaseDialog: false,
			}
		};
	case GET_ALL_TEST_SUITES_SUCCESS:
		return {
			...state,
			testSuiteList: action.response.data.suites.test_suite_details_list,
			refreshTestSuites: false
		};

	case EXECUTE_TEST_BY_SUITE_ID_SUCCESS:
		return {
			...state,
			testExecutionResult:{
				success: action.response.success,
			}
		};
	
	case EXECUTE_TEST_BY_CASE_ID_SUCCESS:
		return {
			...state,
			testExecutionResult:{
				success: action.response.success
			}
		};	

	case GET_ALL_CONNECTIONS_SUCCESS:
		action.response.data.all_connections.forEach(connection => {
			connection.checked = false;
		});
		
		return {
			...state,
			connectionsList : { 
				...state.connectionsList,
				allConnections: action.response.data.all_connections
			}
		};

	case GET_TESTCASE_DETAIL_BY_SUITE_ID_SUCCESS:
		const allCases = { ...state.connectionsList.allCases };
		allCases[action.args.suiteId] = action.response.data.all_cases;
		return {
			...state,
			connectionsList : { 
				...state.connectionsList,
				allCases,
				showConnectionsDialog: action.args.showDialog
			}
		};

	case GET_EACH_TEST_CASE_BY_CASE_ID_SUCCESS:
		const eachTestCaseDetails = { ...state.eachTestCaseDetails };
		eachTestCaseDetails[action.args.caseID] = action.response.test_case_log_list;
		return {
			...state,
			eachTestCaseDetails
		};	

	case GET_TESTCASE_LOG_BY_ID_SUCCESS:
		return {
			...state,
			testCaseLog : {
				...state.testCaseLog,
				logData : action.response.data.test_case_log.log_data,
				testCaseName: action.args.testCaseName, 
				showCaseLogDialog: true
			}
		};

	case HIDE_CASE_LOG_DIALOG:
		state.testCaseLog.showCaseLogDialog = false;
		return {
			...state
		};

	case GET_TEST_CASE_BY_TEST_CASE_ID_SUCCESS:
		action.response.data.showTestCaseDialog = true;
		return {
			...state,
			testCase : action.response.data
		};
	
	case UPDATE_TEST_CASE_SUCCESS:
		return {
			...state,
			showTestCaseEditEnabled: false,
			testCase : {
				message: action.response.data.message,
				testCaseDetails: [],
				showTestCaseDialog: false
			}
		};
	
	case HIDE_TEST_CASE_DIALOG:
		return {
			...state,
			testCase: {
				...state.testCase,
				showTestCaseDialog: false
			}
		};

	case HIDE_MANAGE_CONNECTIONS_DIALOG:
		return {
			...state,
			connectionsList:{
				...state.connectionsList,
				showConnectionsDialog: false
			}
		};

	case SELECT_CONNECTIONS_SUCCESS:
		return {
			...state,
			connectionsList:{
				...state.connectionsList,
				showConnectionsDialog: false
			}
		};

	case MANAGE_CONNECTIONS_CASE_UPDATE:
		return {
			...state
		};

	case SHOW_TEST_CASE_EDIT_ENABLED:
		state.showTestCaseEditEnabled = true;
		return {
			...state
		};
	
	case SHOW_TEST_CASE_VIEW_ENABLED:
		state.showTestCaseEditEnabled = false;
		return {
			...state,
			
			
		};

	case GET_PROJECT_LIST_BY_ORG_ID_SUCCESS:
	case SWITCH_PROJECT_SUCCESS:
		return {
			...state,
			refreshTestSuites: true
		};

	default:
		return state;
	 }
};

export default testSuites;