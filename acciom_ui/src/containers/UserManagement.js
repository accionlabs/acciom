import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
import { ListGroup,Table, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList,addOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import CustomPaginationActionsTable from '../components/Tables';
import GroupIcon from '@material-ui/icons/Group';

import CustomTable from '../components/Table/CustomTable'


import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
	textField:{
		float:'right',
		
	},
	label:{
	
		top:0,
		left:0
	},
	IconClass:{
		marginBottom:'-5px',
		marginLeft:'3px'
	}
});

class UserManagement extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false,
		};
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!prevState.isOrganisationInitialised && 
			nextProps.isOrganisationInitialised > 0) {
			
			nextProps.getOrganizationUsersList(nextProps.currentOrg.org_id);
			
		}
		return ({
		
			isOrganisationInitialised: nextProps.isOrganisationInitialised
		});
	}	

	render() {
		const{orgUserList,classes}=this.props;

		const headers = [
			{ id: 'first_name',  label: 'First Name' },
			{ id: 'last_name',  label: 'Last Name' },
			{ id: 'email', label: 'Email' }
		  ];

		  const userList = [];
			if (orgUserList) {
				orgUserList.forEach(user => {
					userList.push({
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
						action: (
							<Link to={`/edit_user_role/${user.user_id}`}>
								<EditIcon fontSize="small" className="editicon2" style={{color:"#696969" ,marginRight:'15px'}} />
							</Link>	
						)
					})
				})
			}
	
		return (
			<div id="userManagement">
				<div>
					<GroupIcon className={classes.IconClass}/>
					&nbsp; &nbsp;
					<label className="main_titles" > Manage Users</label>				
				</div>				
				<CustomTable 
					headers={headers}
					bodyData={userList}
					actionLabel="Manage Role"
				/>
			</div>
		);
	 }
}

const mapStateToProps = (state) => {
	return {
		currentOrg: state.appData.currentOrg,
		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
		projectList: state.appData.projectList? state.appData.projectList: [],
		isOrganisationInitialised: state.appData.isOrganisationInitialised
	};
};

const mapDispatchToProps = dispatch => ({
	getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data)),
	// addOrganizationUsersList:(data) =>dispatch(addOrganizationUsersList(data))
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserManagement));