import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { emailExsistingVerify, addUserOnload } from '../actions/userManagementActions';
import { roleTypes } from '../reducers/userManagementReducer';
import RoleListItemContainer from '../containers/RoleListItemContainer';

const formatOrgProjectList = (currentOrg, projectList) => {
	const orgList = [{
		value: `o_${currentOrg.org_id}`, 
		label: currentOrg.org_name, 
		roleType: roleTypes.ORGANIZATION,
		uid: currentOrg.org_id
	}];

	const formattedProjectList = projectList.map((item) => {
		return { value: `p_${item.project_id}`, label: item.project_name, roleType: roleTypes.PROJECT, uid: item.project_id} ;
	});

	return [...orgList, ...formattedProjectList];
};

const getObjFromList = (list, key, value)=> list.find(v => v[key] === value);

class ManageUserRole extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: "",
            selectedUser: null,
			userRoleList: [],
			orgProjectList: [],
			firstname: "",
			lastname: "",
			
            
		}
		this.handleInputChange = this.handleInputChange.bind(this)
	}
	
    emailVerify = () => {
		const { email } = this.state;
		// const isValid = this.validate();
		// console.log("onClick", email);
		// if (isValid) {
		// 	console.log(this.state);
		// }
		this.props.emailExsistingVerify(email);
    }

    handleInputChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })

	}

	// validate = () => {
	// 	let email = "";

	// 	if (!this.state.email.includes("@")){
	// 		emailError = "Invalid email" ;
	// 	}

	// 	if (emailError){
	// 		this.setState({ emailError })
	// 		return false;
	// 	}
	// }
	
	componentWillUnmount() {
		this.props.addUserOnload();
	}

    static getDerivedStateFromProps = (nextProps, prevState) => {
		console.log("nextProps.emailUserID", nextProps.emailUserID);
		console.log("nextProps.redirectToUserMgmtEdit ", nextProps.redirectToUserMgmtEdit);
		if (nextProps.redirectToUserMgmtEdit) {
			nextProps.history.push(`/edit_user_role/${nextProps.emailUserID}`);
		} else if (!prevState.selectedUser && nextProps.selectedUser) {
			
			const orgProjectList = formatOrgProjectList(nextProps.currentOrg, nextProps.projectList);

			let userRoleList = [];

			// organization roles
			if (nextProps.selectedUser.org_allowed_role_list.length > 0) {
				userRoleList = [{
					id: `o_${nextProps.currentOrg.org_id}`, 
					allowed_role_list: nextProps.selectedUser.org_allowed_role_list, 
					roleType: roleTypes.ORGANIZATION,
					uid: nextProps.currentOrg.org_id
				}];
			}

			// project roles
			if (nextProps.selectedUser.project_role_list.length > 0) {
				const userProjectRoleList = nextProps.selectedUser.project_role_list.map((item) => {
					return {
						id: `p_${item.project_id}`, 
						allowed_role_list: item.allowed_role_list, 
						roleType: roleTypes.PROJECT,
						uid: item.project_id
					};
				});
				userRoleList = userRoleList.concat(userProjectRoleList);
			}
			
			return {
				...prevState,
				selectedUser: nextProps.selectedUser,
				userRoleList,
				orgProjectList
			};
		}

		return prevState;
	};

	onAddRowClick = () => {
		const userRoleList = [...this.state.userRoleList].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);

		this.setState({userRoleList});
	};

	onDeleteRowClick = (type, index) => {
		const userRoleList = [...this.state.userRoleList];
		userRoleList.splice(index, 1);
		this.setState({userRoleList});
	};

	onOrgProjectChange = (index, selectedOrgProject) => {
		const userRoleList = [...this.state.userRoleList];
		userRoleList.splice(index, 1, 
			{	
				id: selectedOrgProject.value, 
				roleType: selectedOrgProject.roleType, 
				uid: selectedOrgProject.uid,  
				allowed_role_list:[]
			}
		);
		this.setState({userRoleList});
	};

	onRoleChange = (index, roles) => {
		const userRoleList = [...this.state.userRoleList];
		const listItem = userRoleList[index];

		const allowed_role_list = roles.map((role) =>{
			return role.value;
		});
		
		userRoleList.splice(index, 1, {...listItem, allowed_role_list});
		this.setState({userRoleList});
	};

	getSelectedOrgProject = (id) => {
		return getObjFromList(this.state.orgProjectList, 'value', id);
	};

    getRoleItemComponent = (list) => {
		let roleElements = [];
		const count = list.length;

		roleElements = list.map((item, index) => {
			let showAdd = false;
			let showDelete = true;
			if (count === 1) {
				showDelete = false;
			}
			if (count-1 === index) {
				showAdd = true;
			}

			return (
				<li key={`${item.roleType}${index}`}>
					<RoleListItemContainer 
						onAddRowClick={this.onAddRowClick}
						onDeleteRowClick={this.onDeleteRowClick}
						showAddBtn={showAdd && list.length === (index+1)}
						showDeleteBtn={(!showDelete && list.length === 1)? false : true }
						index={index} 
						roleType={item.roleType}
						orgProjectList = {this.state.orgProjectList}
						selectedOrgProject = { getObjFromList(this.state.orgProjectList, 'value', item.id) }
						id={item.id}
						selectedRoles = {item.allowed_role_list}
						onOrgProjectChange = {this.onOrgProjectChange}
						onRoleChange = {this.onRoleChange}
					/>
				</li>
			);
		});

		return roleElements;
	};

    render(){
        return(
            <div>
            <div className="main_titles manageUserRoleTitles">Manage User Role</div>
            <table>
                <tr>
                    <td className="sub_title userRoleFname">First Name:</td>
                    <td><input className="editRoleFnameLabel" type="text" name="firstname" onChange={this.handleInputChange}></input></td>
                    <td className="sub_title userRoleLname">Last Name:</td>
                    <td><input className="editRoleLanameLabel" type="text" name="lastname" onChange={this.handleInputChange}></input></td>
                    <td>
                        <label className="emailRoleLabel sub_title">Email:</label>
                    </td>
                    <td><input className="editRoleLabel" type="text" onChange={this.handleInputChange}  name="email"></input></td>
                </tr>
            </table>
            <button className="button-colors verifyButtons" disabled={!this.state.firstname || !this.state.lastname || !this.state.email} onClick={() => this.emailVerify()}>Verify</button>
            <div className="rolesborder">
				{/* { this.renderUserRoles() } */}
			    </div>
            </div>
            
        );
    }
}


const mapDispatchToProps = dispatch => ({
    getSelectedUser: (org_id, user_id) => dispatch(retriveUserRoleByUserId(org_id, user_id)),
	emailExsistingVerify: (data) => dispatch(emailExsistingVerify(data)),
	addUserOnload: () => dispatch(addUserOnload())
})

const mapStateToProps = (state) => {
	return {
		orgProjectRolesList: state.userManagementData.orgProjectRolesList,
        authTokenExpired: state.loginData.authTokenExpired,
        currentOrg: state.appData.currentOrg,
		selectedUser: state.userManagementData.selectedUser,
		projectList: state.appData.projectList,
		userOrgRoleList: state.userManagementData.userOrgRoleList,
		userProjectRoleList: state.userManagementData.userProjectRoleList,
		userNewRoleList: state.userManagementData.userNewRoleList,
		redirectToUserMgmtEdit: state.userManagementData.redirectToUserMgmtEdit,
		emailUserID: state.userManagementData.emailUserID,
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserRole);