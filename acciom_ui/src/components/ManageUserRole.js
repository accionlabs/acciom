import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { emailExsistingVerify, addUserOnload, updateUserRoles } from '../actions/userManagementActions';
import { roleTypes } from '../reducers/userManagementReducer';
import RoleListItemContainer from '../containers/RoleListItemContainer';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
// import Paper from '@material-ui/core/Paper';


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
		const userRoleList = [].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);
		const orgRoleList = [].concat(
			[{ id: Math.floor(Math.random()*1000000), allowed_role_list: [], roleType: roleTypes.NEW }]
		);
		//const orgProjectList = formatOrgProjectList(props.currentOrg, props.projectList);
        this.state = {
            email: "",
            selectedUser: null,
			userRoleList: userRoleList,
			orgProjectList: [],
			firstname: "",
			lastname: "",
			orgRoleList: orgRoleList,
			showPermission: false,
		}
		this.handleInputChange = this.handleInputChange.bind(this)
	}
	
    emailVerify = () => {
		const { email } = this.state;
		this.props.emailExsistingVerify(email);
    }

    handleInputChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })

	}
	
	componentWillUnmount() {
		this.props.addUserOnload();
	}

    static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.redirectToUserMgmtEdit) {
			nextProps.history.push(`/edit_user_role/${nextProps.emailUserID}`);
		}
		if (nextProps.emailUserID === "show") {
			const showPermission = true;
			return { ...prevState, showPermission };
		} 
		if (nextProps.currentOrg && nextProps.projectList) {
			const orgProjectList = formatOrgProjectList(nextProps.currentOrg, nextProps.projectList);
			return { ...prevState, orgProjectList };
		}
		return prevState;
	};

	renderUserRoles = () => {
		let element = []; 
		if (this.state.userRoleList.length > 0) {
			element.push(
				(
				<li className="listDots">
					<div>
						<span className="projectLabel ">
							Organisation
						</span>
						<span className="projectLabel">
							Roles
						</span>
					</div>
				</li>
				)
			);
			element.push(
				this.getRoleItemComponent(this.state.orgRoleList,"ORGANIZATION")
			);
			element.push(
				(
				<li className="listDots">
					<div>
						<span className="projectLabel">
							Project
						</span>
						<span className="projectLabel">
							Roles
						</span>
					</div>
				</li>
				)
			);
			element.push(
				this.getRoleItemComponent(this.state.userRoleList,"PROJECT")
			)
			// element = this.getRoleItemComponent(this.state.userRoleList,"PROJECT");
			if (element.length > 0) {
				element.push(
					(<div className='footer'>
						<Link to={`/user_management`}>
							<Button type="button" className="userbackbtn adduserBackButton" bsStyle="primary">Back To User List</Button>
						</Link>
						<Button type="button" className="button-colors adduserSaveButton" bsStyle="primary" onClick={(e) => {this.onSaveUserRoles()}}>Save</Button>
					</div>)
				);
			}
		}

		return element;
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

	onOrgProjectChange = (index, selectedOrgProject, category) => {
		if(category === 'PROJECT'){
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
		}else{
			const orgRoleList = [...this.state.orgRoleList];
			orgRoleList.splice(index, 1, 
				{	
					id: selectedOrgProject.value, 
					roleType: selectedOrgProject.roleType, 
					uid: selectedOrgProject.uid,  
					allowed_role_list:[]
				}
			);
			this.setState({orgRoleList});
		}
	};

	onRoleChange = (index, roles, category) => {
		if(category === 'PROJECT'){
			const userRoleList = [...this.state.userRoleList];
			const listItem = userRoleList[index];

			const allowed_role_list = roles.map((role) =>{
				return role.value;
			});
			
			userRoleList.splice(index, 1, {...listItem, allowed_role_list});
			this.setState({userRoleList});
		}else{
			const orgRoleList = [...this.state.orgRoleList];
			const listItem = orgRoleList[index];

			const allowed_role_list = roles.map((role) =>{
				return role.value;
			});
			
			orgRoleList.splice(index, 1, {...listItem, allowed_role_list});
			this.setState({orgRoleList});
		}
		
	};

	getSelectedOrgProject = (id) => {
		return getObjFromList(this.state.orgProjectList, 'value', id);
	};

    getRoleItemComponent = (list,type) => {
		let roleElements = [];
		const count = list.length;
		const projectList = this.state.orgProjectList.filter((e) => e.roleType === type );
		
		roleElements = list.map((item, index) => {
			let showAdd = false;
			let showDelete = true;
			if (count === 1) {
				showDelete = false;
			}
			if (count-1 === index) {
				showAdd = true;
			}
			if(type === 'ORGANIZATION')
			showAdd = false;
			return (
				<li key={`${item.roleType}${index}`} className="listDots">
					<RoleListItemContainer 
						onAddRowClick={this.onAddRowClick}
						onDeleteRowClick={this.onDeleteRowClick}
						showAddBtn={showAdd && list.length === (index+1)}
						showDeleteBtn={(!showDelete && list.length === 1)? false : true }
						index={index} 
						roleType={item.roleType}
						orgProjectList = {projectList}
						selectedOrgProject = { getObjFromList(projectList, 'value', item.id) }
						id={item.id}
						selectedRoles = {item.allowed_role_list}
						onOrgProjectChange = {this.onOrgProjectChange}
						onRoleChange = {this.onRoleChange}
						category={type}
					/>
				</li>
			);
		});
		// roleElements.push(
		// 	<ManageUserRoleListContainer
			
		// 	/>
		// )
		return roleElements;
	};
	onSaveUserRoles = () => {
		// build payload
		const projectRoleList = [];
		let orgAllowedRoleList = []; 
		this.state.userRoleList.forEach((item) => {
			if (item.roleType === roleTypes.PROJECT) {
				projectRoleList.push(
					{
						'project_id': item.uid,
						'allowed_role_list': item.allowed_role_list
					}
				);
			} else if (item.roleType === roleTypes.ORGANIZATION) {
				orgAllowedRoleList = orgAllowedRoleList.concat([...item.allowed_role_list]);
			}

		});

		const payload = {
			'first_name': this.state.firstname,
			'last_name' : this.state.lastname,
			'org_id': this.props.currentOrg.org_id,
			'email_id': this.state.email,
			'project_role_list': projectRoleList,
			'org_allowed_role_list': orgAllowedRoleList
		};
		this.props.updateUserRoles(JSON.stringify(payload));
	};

    render(){
        return(
			// <Paper>
            <div>
				<table>
					<tr>
						<td>
							<PersonAddIcon  className="addUserIcon" />
						</td>
						<td><div className="main_titles manageUserRoleTitles">Manage User Role</div></td>
					</tr>
				</table>
            <table>
                <tr>
                    <td className="sub_title userRoleFname">First Name:</td>
                    <td><input className="editRoleFnameLabel" type="text" name="firstname" onChange={this.handleInputChange}></input></td>
                    <td className="sub_title userRoleLname">Last Name:</td>
                    <td><input className="editRoleLanameLabel" type="text" name="lastname" onChange={this.handleInputChange}></input></td>
                    <td><label className="emailRoleLabel sub_title">Email:</label></td>
					<td><input className="emailEditBox" type="email" onChange={this.handleInputChange}  name="email"></input></td>
                </tr>
				<tr>
					<td><button className="button-colors verifyButtons" disabled={!this.state.firstname || !this.state.lastname || !this.state.email} onClick={() => this.emailVerify()}>Verify</button></td>
				</tr>
            </table>
			<div className="rolesborder">
				{ this.state.showPermission && this.renderUserRoles() }
			</div>
            </div>
			// </Paper>
            
        );
    }
}


const mapDispatchToProps = dispatch => ({
    getSelectedUser: (org_id, user_id) => dispatch(retriveUserRoleByUserId(org_id, user_id)),
	emailExsistingVerify: (data) => dispatch(emailExsistingVerify(data)),
	addUserOnload: () => dispatch(addUserOnload()),
	updateUserRoles: (data) => dispatch(updateUserRoles(data))
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