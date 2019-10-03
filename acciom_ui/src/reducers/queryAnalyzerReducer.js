import {
    GET_SELECTED_DATABASE_TYPE_SUCCESS
} from '../constants/ActionTypes';

const initialState = {
	databaseType: []
};

export const databaseType = (state = initialState, action) => {
    switch(action.type) {
        case GET_SELECTED_DATABASE_TYPE_SUCCESS:    
        return{
                ...state,
                databaseType: action.response.data
            };
            default:
                return state;
             
            }
}