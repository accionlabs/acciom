import { BASE_URL, headers, TIMEOUT } from './appActions';
 import { 
    GET_SELECTED_DATABASE_TYPE_SUCCESS,
	GET_SELECTED_DATABASE_TYPE_ERROR,
	RUN_QUERY_SUCCESS,
	RUN_QUERY_ERROR
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
    console.log("@@@@@@@@@@@@@@@@@@@@")
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
};