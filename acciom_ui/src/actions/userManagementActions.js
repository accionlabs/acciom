import _orgUserList from '../json/org_user_list.json';
import _rolesListData from '../json/roles_by_org_or_proj_id.json';
import { TIMEOUT, BASE_URL, headers} from './appActions';
import {
	GET_ORGANIZATION_USER_LIST_SUCCESS,
	GET_ORGANIZATION_USER_LIST_ERROR,
	GET_ROLES_BY_ORG_ID_SUCCESS,
	GET_ROLES_BY_ORG_ID_ERROR,
	UPDATE_USER_ROLES_SUCCESS, 
	UPDATE_USER_ROLES_ERROR,
	GET_ROLES_BY_PROJECT_ID_SUCCESS,
	GET_ROLES_BY_PROJECT_ID_ERROR,
	RETRIVE_USER_ROLE_SUCCESS,
	RETRIVE_USER_ROLE_ERROR,
	GET_ORGANIZATION_USER_LIST_ADD,
	DELETE_USERS_FROM_TABLE,
	ADD_USER_ROLES_SUCCESS,
	ADD_USER_ROLES_ERROR,
	EMAIL_VERIFY_SUCCESS,
	EMAIL_VERIFY_ERROR,
	ADD_USER_ONLOAD,
	USER_PROFILE_DETALES,
	USER_NAME_UPDATE,
	CLEAR_USER_STORE,
	USER_PROFILE_DROPDOWN,
	DEFAULT_PROJECT_ID,
		
} from "../constants/ActionTypes";

export const getOrganizationUsersList = (orgId) => {

	return {
		types: [
			'',
			GET_ORGANIZATION_USER_LIST_SUCCESS,
			GET_ORGANIZATION_USER_LIST_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/user?org_id=${orgId}`, {
			method: 'get',
			headers
		})
	};	
};	

export const deleteUsersFromTable=(id)=>{
	return{
		type:DELETE_USERS_FROM_TABLE,
		value:id,
		
	}
};

export const getRolesByOrgId = (orgId, key) => {
	return {
		types: [
			'',
			GET_ROLES_BY_ORG_ID_SUCCESS,
			GET_ROLES_BY_ORG_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/role?org_id=${orgId}`, {
			method: 'get',
			headers
		}),
		args: { key }
	};	
};	

export const getRolesByProjectId = (projectId, key) => {
	return {
		types: [
			'',
			GET_ROLES_BY_PROJECT_ID_SUCCESS,
			GET_ROLES_BY_PROJECT_ID_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/role?project_id=${projectId}`, {
			method: 'get',
			headers
		}),
		args: { key }
	};		
};	

export const retriveUserRoleByUserId = (orgId, userId) => {
	return {
		types: [
			'',
			RETRIVE_USER_ROLE_SUCCESS,
			RETRIVE_USER_ROLE_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/user-role?org_id=${orgId}&user_id=${userId}`, {
			method: 'get',
			headers
		})
	};	
};

export const updateUserRoles = (body) => {
	return {
		types: [
			'',
			UPDATE_USER_ROLES_SUCCESS,
			UPDATE_USER_ROLES_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/user-role`, {
			method: 'post',
			headers,
			body
		})
	};		
};

export const addUsersRole = (body) => {
	return {
		types: [
			'',
			ADD_USER_ROLES_SUCCESS,
			ADD_USER_ROLES_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/user-role`, {
			method: 'post',
			headers,
			body
		})
	
	};		
};

export const emailExsistingVerify = (email) => {
	return {
		types: [
			'',
			EMAIL_VERIFY_SUCCESS,
			EMAIL_VERIFY_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/user-role?org_id=1&email_id=${email}`, {
			method: 'get',
			headers
		})
	};
};


export const userProfilesDetailes = () => {
	return {
		types: [
			'',
			USER_PROFILE_DETALES,
			''
		],
		callAPI: () => fetch(`${BASE_URL}/user-profile`, {
			method: 'get',
			headers
		})
	};
};

export const updateUserProfileNames=(name)=>{
	const data = {
		first_name: name.first_name,
		last_name: name.last_name
	}
	return{
		types:[
			'',
			USER_NAME_UPDATE,
			'',
	
		],
		callAPI:() => fetch(`${BASE_URL}/user-profile`,{
			method: 'put',
			headers,
			body: JSON.stringify(data)
	
		}) 
	
	}
	}

	export const userProfileDropdown=(value) => {
		const data = {
			project_id: value
		}
		return{
			types:[
				'',
				USER_PROFILE_DROPDOWN,
				'',
		
			],
			callAPI:() => fetch(`${BASE_URL}/default-project-org`,{
				method: 'put',
				headers,
				body: JSON.stringify(data)
			}) 
	}
	}

	export const defaultProjectOrgId = (value) => {
		const data = {
			project_id: value
		}
		return{
			types:[
				'',
				DEFAULT_PROJECT_ID,
				'',
		
			],
			callAPI:() => fetch(`${BASE_URL}/default-project-org`,{
				method: 'put',
				headers,
				body: JSON.stringify(data)
			}) 
	}
	}

export const addUserOnload = () => {
	return {
		type: ADD_USER_ONLOAD
	};
};

export const clearUserData = () => {
	return {
		type: CLEAR_USER_STORE
	};
};
