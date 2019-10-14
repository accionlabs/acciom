import { 
	TEST_SUITE_FILE_UPLOAD_SUCCESS,
	TEST_SUITE_SHEET_LOAD_SUCCESS,
	TEST_SUITE_SHEET_SELECT,
	TEST_CASE_SELECTION_CHANGE,
	TEST_CASE_SELECT_ALL_TOGGLE,
	UPLOAD_TESTCASES_SUCCESS,
	UPLOAD_TESTCASES_ERROR,
	RESET_TEST_SUITE_UPLOAD_DATA,
	ON_SHEET_NAME_CHANGE,
	RESET_DATA_FOR_SHEET_PAGE,
	RESET_DATA_FOR_CASE_PAGE,
	
} from '../constants/ActionTypes';

import { BASE_URL, headers } from './appActions';

export const testSuiteFileUploadSuccess = (sheets, file) => ({
	type: TEST_SUITE_FILE_UPLOAD_SUCCESS,
	sheets,
	file
});

export const testSuiteSheetloadSuccess = sheetData => ({
	type: TEST_SUITE_SHEET_LOAD_SUCCESS,
	sheetData
});

export const resetTestSuiteUploadData = (sheet) => ({
	type: RESET_TEST_SUITE_UPLOAD_DATA,
	sheet
});
export const onTestSuiteSheetSelect = (sheet) => ({
	type: TEST_SUITE_SHEET_SELECT,
	sheet
});

export const testCaseSelectionChange = (testCase) => ({
	type: TEST_CASE_SELECTION_CHANGE,
	testCase
});

export const testCaseSelectAllToggle = () => ({
	type: TEST_CASE_SELECT_ALL_TOGGLE
});	

export const onSheetNameChange = ({sheetIndex, displayName}) => ({
	type: ON_SHEET_NAME_CHANGE,
	sheetIndex,
	displayName
});	

export const resetDataForSheetPage = () => ({
	type: RESET_DATA_FOR_SHEET_PAGE
});	

export const resetDataForCasePage = () => ({
	type: RESET_DATA_FOR_CASE_PAGE
});	

export const uploadTestCases = (body) => {
	const newHeader = new Headers({'Authorization': headers.Authorization});
	newHeader['Content-Type'] = 'multipart/form-data';

	return {
		types: [
			'',
			UPLOAD_TESTCASES_SUCCESS,
			UPLOAD_TESTCASES_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/test-suite`, {
			method: 'post',
			headers: newHeader,
			body
		}),
		showSuccessMsg: true
	};	
};