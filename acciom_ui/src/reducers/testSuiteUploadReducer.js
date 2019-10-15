import { 
	TEST_SUITE_FILE_UPLOAD_SUCCESS,
	TEST_SUITE_SHEET_SELECT,
	TEST_SUITE_SHEET_LOAD_SUCCESS,
	UPLOAD_TESTCASES_SUCCESS,
	TEST_CASE_SELECTION_CHANGE,
	TEST_CASE_SELECT_ALL_TOGGLE,
	RESET_TEST_SUITE_UPLOAD_DATA,
	ON_SHEET_NAME_CHANGE,
	RESET_DATA_FOR_CASE_PAGE,
	RESET_DATA_FOR_SHEET_PAGE,
	GET_ALL_TEST_SUITES_SUCCESS,
	SUBMIT_SUITE_NAME_SUCCESS,
	SUBMIT_SUITE_NAME_ERROR
} from '../constants/ActionTypes';

const initialState = {
	file: '',
	sheets:[],
	sheetData: null,
	selectAll: false,
	isUpdateSuitePageDisabled: false,
	isSheetListPageDisabled: true,
	isCaseListPageDisabled: true,
	moveToSelectSheetPage: false,
	moveToSelectCasePage: false,
	redirectToSuiteList: false
};

const getSheetsDataOnLoad = (sheets) => {
	return sheets.map((sheet) => {
		return { name: sheet, selected: false, displayName: sheet };
	});
};

const getUpdatedSheetsDataOnSelectionChange = (sheets, selectedSheet) => {
	return sheets.map((sheet) => {
		if (sheet === selectedSheet) {
			return { ...sheet, selected: true };
		} else {
			return { ...sheet, selected: false };
		}
	});
};

const getTestCaseDataOnSelectAllToggle = (selectedAll,allCases) => {
	return allCases.map(item => {
		return {
			...item,
			selected: selectedAll ? true: false
		};
	});
};

const checkAllCheckBox = (data) => {
	return data.selected === true;
}

const testSuiteUploadData = (state = initialState, action) => {
	let sheets = [];
	let testCases = [];
	let index = -1;
	let selectAll = false;
	let allCases = [];

	switch (action.type) {
	case GET_ALL_TEST_SUITES_SUCCESS:
		return {
			...state,
			redirectToSuiteList: false
		};
		
	case TEST_SUITE_FILE_UPLOAD_SUCCESS:
		sheets = getSheetsDataOnLoad(action.sheets);
		return {
			...state,
			sheets,
			sheetData: null,
			file: action.file,
			isSheetListPageDisabled: false,
			isCaseListPageDisabled: true,
			moveToSelectSheetPage: true
		};
	
	case TEST_SUITE_SHEET_SELECT:
		sheets = getUpdatedSheetsDataOnSelectionChange(state.sheets, action.sheet);
		return {
			...state,
			sheets
		};
	
	case TEST_SUITE_SHEET_LOAD_SUCCESS:
		return {
			...state,
			sheetData : action.sheetData,
			isCaseListPageDisabled: false,
			moveToSelectCasePage: true
		};
	
	case TEST_CASE_SELECTION_CHANGE:
		index = state.sheetData.allCases.indexOf(action.testCase);
		allCases = [...state.sheetData.allCases];
		allCases[index].selected = !allCases[index].selected;
		selectAll = allCases.every(checkAllCheckBox);
		return {
			...state,
			selectAll: selectAll,
			sheetData: {
				...state.sheetData,
				allCases: allCases
			}
		};
		
	case TEST_CASE_SELECT_ALL_TOGGLE:
		testCases = getTestCaseDataOnSelectAllToggle(!state.selectAll,state.sheetData.allCases);
		return {
			...state,
			selectAll: !state.selectAll,
			sheetData: {
				...state.sheetData,
				allCases: testCases
			}
		};
	
	case UPLOAD_TESTCASES_SUCCESS:
		return {
			...state,
			redirectToSuiteList: true
		};
	
	case RESET_TEST_SUITE_UPLOAD_DATA:
		return initialState;
	
	case ON_SHEET_NAME_CHANGE:
		let sheets = [...state.sheets];
		sheets[action.sheetIndex].displayName = action.displayName; 
		return {
			...state,
			sheets
		};
	
	case RESET_DATA_FOR_SHEET_PAGE:
		return {
			...state,
			moveToSelectSheetPage: false
		};
	
	case RESET_DATA_FOR_CASE_PAGE:
		return {
			...state,
			moveToSelectCasePage: false
		};
	case SUBMIT_SUITE_NAME_SUCCESS:
		return {
			...state,
			redirectToSuiteList: true


		}

	default:
		return state;
	}
};

export default testSuiteUploadData;