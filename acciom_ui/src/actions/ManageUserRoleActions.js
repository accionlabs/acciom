import { BASE_URL, headers, TIMEOUT } from './appActions';
import{
    GET_USER_EMAIL_ID_SUCCESS,
    GET_USER_EMAIL_ID_ERROR,
} from "../constants/ActionTypes";

export const getUserEmailId = (EmailId) => {
    return {
        types: [
			'',
		GET_USER_EMAIL_ID_SUCCESS,
        GET_USER_EMAIL_ID_ERROR,
		],
		callAPI: () => fetch(`${BASE_URL}/test-suite?project_id=${EmailId}`, {
			method: 'get',
			headers
		})
	};
}
   