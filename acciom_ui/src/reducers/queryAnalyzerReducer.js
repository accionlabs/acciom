import {
    RUN_QUERY_SUCCESS,
    RUN_QUERY_ERROR,
    GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS,
    GET_QUERY_ANALYSER_TABLE_DATA_ERROR
} from '../constants/ActionTypes';

const initialState = {
    runQueryId:null,
    projectQueryData:[]
};

const runQuery = (state= initialState, action) => {
    switch(action.type) {
        case RUN_QUERY_SUCCESS:
            console.log(action,'action----');
            console.log(state,'state======')
                return {
                    ...state,
                    // runQueryId: state.runQueryId
                };
            case GET_QUERY_ANALYSER_TABLE_DATA_SUCCESS:
                console.log('tabledataction=====>', action)
                return{
                    ...state,
                    projectQueryData: action.response.data.queries
                }
        default:
		    return state;
    }
};

export default runQuery;