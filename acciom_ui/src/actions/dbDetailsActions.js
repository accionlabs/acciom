import { BASE_URL, headers, TIMEOUT} from './appActions';

import _add_db_details_success from '../json/add_db_details.json';
import _db_details_list_success from '../json/db_details_list.json';

import {
	ADD_DB_DETAILS_SUCCESS,
	ADD_DB_DETAILS_ERROR,
	UPDATE_DB_DETAILS_SUCCESS,
	UPDATE_DB_DETAILS_ERROR,
	GET_ALL_DB_DETAILS_SUCCESS,
	GET_ALL_DB_DETAILS_ERROR,
	GET_DB_DETAILS_BY_ID_SUCCESS,
	GET_DB_DETAILS_BY_ID_ERROR,
	DELETE_DB_DETAILS_SUCCESS,
	DELETE_DB_DETAILS_ERROR,
	REDIRECT_TO_VIEW_DB_PAGE_COMPLETE,
	RESET_SELECTED_DB_DETAILS,
	DB_TYPE_DETAILS_SUCCESS,
	DB_TYPE_DETAILS_ERROR,
	CLASS_NAME_DETAILS_SUCCESS,
	CLASS_NAME_DETAILS_ERROR,
	SUBMIT_SUITE_NAME_SUCCESS,
	SUBMIT_SUITE_NAME_ERROR,
	GET_ALL_TEST_SUITES_SUCCESS,

} from '../constants/ActionTypes'; 

export const redirectToViewDbPageComplete = error => {
	return {
		type: REDIRECT_TO_VIEW_DB_PAGE_COMPLETE,
		error
	}
};

export const resetSelectedDbDetails = () => {
	return {
		type: RESET_SELECTED_DB_DETAILS
	}
};

export const addDatabaseDetails = (formData) => {
	return {
		types: [
			'',
			ADD_DB_DETAILS_SUCCESS,
			ADD_DB_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-detail`, {
			method: 'post',
			headers,
			body: formData
		})
	};	
};

export const updateDBDetails = (formData) => {
	return {
		types: [
			'',
			UPDATE_DB_DETAILS_SUCCESS,
			UPDATE_DB_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-detail`, {
			method: 'put',
			headers,
			body: formData
		})
	};	
};

export const getAllDBDetails = (projectId) => {
	return {
		types: [
			'',
			GET_ALL_DB_DETAILS_SUCCESS,
			GET_ALL_DB_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-detail?project_id=${projectId}`, {
			method: 'get',
			headers
		})
	};		
};

export const getDBDetailsById = (dbID) => {
	return {
		types: [
			'',
			GET_DB_DETAILS_BY_ID_SUCCESS,
			GET_DB_DETAILS_BY_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-detail?db_connection_id=${dbID}`, {
			method: 'get',
			headers
		})
	};		
};

export const checkDbConnection = (body) => {
	return {
		types: [
			'',
			GET_DB_DETAILS_BY_ID_SUCCESS,
			GET_DB_DETAILS_BY_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/check-connection`, {
			method: 'post',
			headers,
			body
		})
	};			
};

export const deleteDBDetails = (data) => {
	return {
		types: [
			'',
			DELETE_DB_DETAILS_SUCCESS,
			DELETE_DB_DETAILS_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-detail?db_connection_id=${data.connectionID}&verify_delete=True`, {
			method: 'delete',
			headers
		})
	};		
};

export const getAllDBTypes = () =>{
	return {
		types:[
			'',
			DB_TYPE_DETAILS_SUCCESS,
			DB_TYPE_DETAILS_ERROR
		],
		callAPI: () =>fetch(`${BASE_URL}/supported-database-type`,{
			method:'get',
			headers
		})
	}
}

export const getallClassNames = () =>{
	return {
		types:[
			'',
			CLASS_NAME_DETAILS_SUCCESS,
			CLASS_NAME_DETAILS_ERROR
		],
		callAPI: () =>fetch(`${BASE_URL}/supported-test-class-type`,{
			method:'get',
			headers
		})
	}
}

export const SubmitTestSuiteData = (formData) =>{
	return {
		types:[
			'',
			SUBMIT_SUITE_NAME_SUCCESS,
			SUBMIT_SUITE_NAME_ERROR
		],
		callAPI: () =>fetch(`${BASE_URL}/add-test-suite-manually`,{
			method:'post',
			headers,
			body: formData
		})
	}
}