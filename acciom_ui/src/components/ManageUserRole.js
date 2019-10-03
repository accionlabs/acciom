import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { retriveUserRoleByUserId, updateUserRoles } from '../actions/userManagementActions';
import { roleTypes } from '../reducers/userManagementReducer';
import RoleListItemContainer from '../containers/RoleListItemContainer';


class ManageUserRole extends Component{
    render(){
        return(
            <div>
            <div className="main_titles manageUserRoleTitles">Manage User Role</div>
            <table>
                <tr>
                    <td className="sub_title userRoleFname">First Name:</td>
                    <td><input className="editRoleFnameLabel" type="text" name="Fname"></input></td>
                    <td className="sub_title userRoleLname">Last Name: <input className="editRoleLanameLabel" type="text" name="Lname"></input></td>
                    
                  
                    
                </tr>
                <tr>
                    <td>
                        <label className="emailRoleLabel sub_title">Email:</label>
                    </td>
                    <td><input className="editRoleLabel" type="text" name="email"></input></td>
                </tr>
                
            </table>
            <button className="button-colors verifyButtons">Verify</button>
                
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
	generateToken: (data) => dispatch(generateToken(data))
})

const mapStateToProps = (state) => {
	return {
		authTokenExpired: state.loginData.authTokenExpired
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserRole);