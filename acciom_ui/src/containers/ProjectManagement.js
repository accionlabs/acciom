import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ListGroup, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import ProjectMangementTableBody from '../components/ManageProjectTable/ProjectTableBody';

class ProjectManagement extends Component {

	componentDidMount(){
		console.log('In did mount of project');
	}
	
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false,
			headers : [
				{ id: 'first_name',  label: 'Project Name' },
				{ id: 'last_name',  label: 'Project Description' },
			    { id: 'Action',  label: 'Action' },
			
			  ],
			  projectListDetails:[{user_id: 2, first_name: "B", last_name: "Akhil" },
			  {user_id: 3, first_name: "N", last_name: "Gautam"},
			 {user_id: 4, first_name: "R", last_name: "Hakif"},
			  {user_id: 6, first_name: "B", last_name: "Kingsuk"},
			  {user_id: 7, first_name: "B", last_name: "Lalith"},
			  {user_id: 9, first_name: "P", last_name: "Suresh"},
			  {user_id: 18, first_name: "T", last_name: "Roja"},
			  {user_id: 19, first_name: "K", last_name: "Santhosh" },
			  {user_id: 20, first_name: "BS", last_name: "Srinath"  },
			  {user_id: 21, first_name: "user15", last_name: "user15" },
			  {user_id: 22, first_name: "user16", last_name: "user16"  },
			  {user_id: 23, first_name: "user17", last_name: "user17"  },
			  {user_id: 24, first_name: "user18", last_name: "user18"  },
			  {user_id: 25, first_name: "user19", last_name: "user19"  },
			  {user_id: 26, first_name: "user20", last_name: "user20" },
			  {user_id: 27, first_name: "user21", last_name: "user21"  },
			  {user_id: 28, first_name: "user22", last_name: "user22"  },
			  {user_id: 29, first_name: "user23", last_name: "user23"  },
			  {user_id: 30, first_name: "user24", last_name: "user24"  },
			  {user_id: 31, first_name: "user25", last_name: "user25"  },
			  {user_id: 32, first_name: "user26", last_name: "user26"  },
			  {user_id: 33, first_name: "user27", last_name: "27user" },
			  {user_id: 34, first_name: "kingsuk9@gmail.com", last_name: "kingsuk9@gmail.com"}]
		};
	}
	
	

		
	render() {
		const { isEditable } = this.state;
		return (
			<div>
				<h1>Project Management Page</h1>
				<ProjectMangementTableBody 
				projectList ={this.state.projectListDetails}
				  headers={this.state.headers}/>
			</div>
		);
	 }
}

// const mapStateToProps = (state) => {
// 	console.log('UserManagement.mapStateToProps() ', state);
// 	return {
// 		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
// 		projectList: state.appData.projectList? state.appData.projectList: [],
// 		isOrganisationInitialised: state.appData.isOrganisationInitialised
// 	};
// };

// const mapDispatchToProps = dispatch => ({
// 	getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);

export default ProjectManagement;