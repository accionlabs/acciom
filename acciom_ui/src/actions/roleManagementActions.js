import {
    GET_ROLE_LIST_SUCCESS,
    GET_ROLE_LIST_ERROR,
    GET_SELECTED_ROLE_SUCCESS,
    GET_SELECTED_ROLE_ERROR ,
    UPDATE_ROLE_LIST_SUCCESS,
    UPDATE_ROLE_LIST_ERROR,
    RESET_VALUES_ROLE
   } from "../constants/ActionTypes";
   import {  BASE_URL, headers} from './appActions';
export const getRolesList = (orgId) => {
   

    return {
        types: [
            '',
            GET_ROLE_LIST_SUCCESS,
            GET_ROLE_LIST_ERROR
        ],
        
        callAPI: () => fetch(`${BASE_URL}/role?org_id=${orgId}`, {
            method: 'get',
            headers,
          
        })
     
    };	
}


export const getSelectedRole = (roleId) => {
   

    return {
        types: [
            '',
            GET_SELECTED_ROLE_SUCCESS,
            GET_SELECTED_ROLE_ERROR
        ],
        
        callAPI: () => fetch(`${BASE_URL}/role?role_id=${roleId}`, {
            method: 'get',
            headers,
          
        })
     
    };	
}

export const updateRoleList = (data) => {
   

    return {
        types: [
            '',
            UPDATE_ROLE_LIST_SUCCESS,
            UPDATE_ROLE_LIST_ERROR
        ],
        
        callAPI: () => fetch(`${BASE_URL}/role`, {
            method: 'put',
            headers,
            body:data
          
        })
     
    };	
}
export const resetAllValueOfRole=()=>{
    return{
        type:RESET_VALUES_ROLE
    }

}