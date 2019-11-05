import {
    GET_ROLE_LIST_SUCCESS,
    GET_ROLE_LIST_ERROR,
    GET_SELECTED_ROLE_SUCCESS,
    GET_SELECTED_ROLE_ERROR,
    UPDATE_ROLE_LIST_SUCCESS,
    UPDATE_ROLE_LIST_ERROR,
    RESET_VALUES_ROLE,
    GET_ALL_PERMISSIONS_SUCCESS,
    GET_ALL_PERMISSIONS_ERROR,
    CREATE_ROLE_SUCCESS,
    CREATE_ROLE_ERROR,
    DELETE_ROLE_SUCCESS,
    DELETE_ROLE_ERROR
} from '../constants/ActionTypes';
import { BASE_URL, headers } from './appActions';
export const getRolesList = orgId => {
    return {
        types: ['', GET_ROLE_LIST_SUCCESS, GET_ROLE_LIST_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/role?org_id=${orgId}`, {
                method: 'get',
                headers
            })
    };
};

export const getSelectedRole = roleId => {
    return {
        types: ['', GET_SELECTED_ROLE_SUCCESS, GET_SELECTED_ROLE_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/role?role_id=${roleId}`, {
                method: 'get',
                headers
            })
    };
};

export const updateRoleList = data => {
    return {
        types: ['', UPDATE_ROLE_LIST_SUCCESS, UPDATE_ROLE_LIST_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/role`, {
                method: 'put',
                headers,
                body: data
            })
    };
};

export const getAllPermissions = () => {
    return {
        types: ['', GET_ALL_PERMISSIONS_SUCCESS, GET_ALL_PERMISSIONS_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/permission`, {
                method: 'get',
                headers
            })
    };
};

export const createRole = data => {
    return {
        types: ['', CREATE_ROLE_SUCCESS, CREATE_ROLE_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/role`, {
                method: 'post',
                headers,
                body: data
            })
    };
};

export const deleteRoleList = roleId => {
    return {
        types: ['', DELETE_ROLE_SUCCESS, DELETE_ROLE_ERROR],

        callAPI: () =>
            fetch(`${BASE_URL}/role?role_id=${roleId}`, {
                method: 'delete',
                headers
            })
    };
};
export const resetAllValueOfRole = () => {
    return {
        type: RESET_VALUES_ROLE
    };
};
