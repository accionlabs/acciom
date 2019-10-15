import { 
	ADD_DB_DETAILS_SUCCESS,
	UPDATE_DB_DETAILS_SUCCESS,
	GET_ALL_DB_DETAILS_SUCCESS,
	GET_DB_DETAILS_BY_ID_SUCCESS,
	GET_PROJECT_LIST_BY_ORG_ID_SUCCESS,
	SWITCH_PROJECT_SUCCESS,
	REDIRECT_TO_VIEW_DB_PAGE_COMPLETE,
	DELETE_DB_DETAILS_SUCCESS,
	UPLOAD_TESTCASES_SUCCESS,
	RESET_SELECTED_DB_DETAILS,
	DB_TYPE_DETAILS_SUCCESS,
	DB_TYPE_DETAILS_ERROR,
	CLASS_NAME_DETAILS_SUCCESS,
	CLASS_NAME_DETAILS_ERROR,
	


} from '../constants/ActionTypes';

const initialState = {
	dbDetailsList: [],
	selectedDbDetails: null, 
	refreshDBDetails: false,
	redirectToViewDBPage: false,
	dbTypeList:[],
	classNameList:[],

};

const dbDetailsData = (state = initialState, action) => {
	switch (action.type) {
	case GET_ALL_DB_DETAILS_SUCCESS:
		return {
			...state,
			dbDetailsList: action.response.data.db_details,
			refreshDBDetails: false
		};

	case GET_DB_DETAILS_BY_ID_SUCCESS:
		return {
			...state,
			selectedDbDetails: action.response.data
		};
	
	case ADD_DB_DETAILS_SUCCESS:
		return {
			...state,
			redirectToViewDBPage:true,
			refreshDBDetails: true
		};
	
	case UPDATE_DB_DETAILS_SUCCESS:
		return {
			...state,
			redirectToViewDBPage:true,
			refreshDBDetails: true
		};
	
	case GET_PROJECT_LIST_BY_ORG_ID_SUCCESS:
	case SWITCH_PROJECT_SUCCESS:
	case DELETE_DB_DETAILS_SUCCESS:
	case UPLOAD_TESTCASES_SUCCESS:
		return {
			...state,
			refreshDBDetails: true
		};
	
	case REDIRECT_TO_VIEW_DB_PAGE_COMPLETE:
		return {
			...state,
			redirectToViewDBPage:false
		};
	case RESET_SELECTED_DB_DETAILS:
		return {
			...state,
			selectedDbDetails: null
		}
	case DB_TYPE_DETAILS_SUCCESS:
	return {
		...state,
		dbTypeList:action.response.data.data
	}
	case DB_TYPE_DETAILS_ERROR:
	return {
		...state,
		dbTypeList:[]
	}
	case CLASS_NAME_DETAILS_SUCCESS:
	return{
		...state,
		classNameList:action.response.data.data
	}
	case CLASS_NAME_DETAILS_ERROR:
	return{
		...state,
		classNameList:[]

	}
	
	
	
	default:
		return state;
	}
};

export default dbDetailsData;

