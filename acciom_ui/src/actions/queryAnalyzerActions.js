import { BASE_URL, headers, TIMEOUT } from './appActions';
 import { 
    GET_SELECTED_DATABASE_TYPE_SUCCESS,
	GET_SELECTED_DATABASE_TYPE_ERROR,
	RUN_QUERY_SUCCESS,
	RUN_QUERY_ERROR,
	GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
    GET_QUERY_ANALYSER_TABLE_DATA_ERROR
	
} from "../constants/ActionTypes";

export const getSelectedDatabaseType = () => {
	return {
		types: [
            '',
            GET_SELECTED_DATABASE_TYPE_SUCCESS,
			GET_SELECTED_DATABASE_TYPE_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/db-connection-detail`, {
			method: 'get',
			headers
		})
	};
};
export const runQuery = (body) => {
	// projectId= body.project_id;
    return {
		types: [
            '',
            RUN_QUERY_SUCCESS,
			RUN_QUERY_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/query-analyser`, {
			method: 'post',
            headers,
			body
		})
	};
}
export const getTableData = (projectId) => {
	// projectId= body.project_id;
    return {
		types: [
            '',
            GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
			GET_QUERY_ANALYSER_TABLE_DATA_ERROR
		],
		callAPI: () => fetch(`${BASE_URL}/query-analyser?project_id=${projectId}`, {
			method: 'get',
            headers
		})
	};
}