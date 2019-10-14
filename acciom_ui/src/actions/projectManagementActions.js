import {
    GET_PROJECT_LIST_SUCCESS,
	GET_PROJECT_LIST_ERROR,
	DELETE_PROJECT_LIST_SUCCESS,
	DELETE_PROJECT_LIST_ERROR,
	UPDATE_PROJECT_LIST_SUCCESS,
	UPDATE_PROJECT_LIST_ERROR} from "../constants/ActionTypes";
    import {  BASE_URL, headers} from './appActions';
export const getProjectList = (orgId) => {
    
	return {
		types: [
			'',
			GET_PROJECT_LIST_SUCCESS,
			GET_PROJECT_LIST_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/project?org_id=${orgId}`, {
			method: 'get',
			headers
		})
	};	

}
export const updateProjectList=(data,orgId)=>{

return{
	types:[
		'',
		UPDATE_PROJECT_LIST_SUCCESS,
		UPDATE_PROJECT_LIST_ERROR

	],
	callAPI:() => fetch(`${BASE_URL}/project`,{
		method: 'put',
		headers,
		body: data

	}) 

}
}
export const deleteProjectDetails = (data) => {

	return {
		types: [
			'',
			DELETE_PROJECT_LIST_SUCCESS,
			DELETE_PROJECT_LIST_ERROR
		],
		
		callAPI: () => fetch(`${BASE_URL}/project?project_id=${data.rowconnectionID}`, {
			method: 'delete',
			headers
		})
	};		
};

