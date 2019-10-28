import {
    GET_ROLE_LIST_SUCCESS,
    GET_ROLE_LIST_ERROR,
    GET_SELECTED_ROLE_SUCCESS,
    GET_SELECTED_ROLE_ERROR,
    UPDATE_ROLE_LIST_SUCCESS,
    UPDATE_ROLE_LIST_ERROR,
    RESET_VALUES_ROLE} from "../constants/ActionTypes";

    const initialState = {
        roleList:[],
        selectedRoles:null,
        refreshRoleDetails:false
      }
      const roleManagementData = (state = initialState, action) => {
        switch (action.type) {
            
           case  GET_ROLE_LIST_SUCCESS:
           
               return{
                   ...state,
                   roleList:action.response.data.roles,
                   refreshRoleDetails:false
               }
              case GET_SELECTED_ROLE_SUCCESS:
                return{
                  ...state,
                  selectedRolesPermission:action.response.data.roles
                }
                case UPDATE_ROLE_LIST_SUCCESS:
            
                  return{
                    ...state,
                    refreshRoleDetails:true
                  }
              
              case RESET_VALUES_ROLE:
                return  initialState;
          
               default:
              return state;
        }

      }
      export default roleManagementData