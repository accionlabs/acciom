import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ListGroup, Button, Col } from 'react-bootstrap';

import {getProjectList} from '../actions/projectManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import ProjectMangementTableBody from '../components/ManageProjectTable/ProjectTableBody';
import GroupIcon from '@material-ui/icons/Group';
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
class ProjectManagement extends Component {

	componentDidMount(){
    
		let location=window.location.href
		if(location.includes('projects')){
		  this.setState({location:'projects'});
		}
		  else if(location.includes('organization')){
			this.setState({location:'organization'});
  
		  }
		
	   
		
	  }

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!prevState.isOrganisationInitialised && 
			nextProps.isOrganisationInitialised > 0) {
		
	
			nextProps.getProjectList(nextProps.currentOrg.org_id);
		}
		return ({
		
			isOrganisationInitialised: nextProps.isOrganisationInitialised
		});
	}
	constructor(props) {
		super(props);
		this.state = {
			isOrganisationInitialised: false,
			isEditable : false,
			headers : [
				{ id: 'project_name',  label: 'Project Name' },
				{ id: 'project_description',  label: ' Description' },
				{ id: 'Action',  label: 'Action' },
			
			
			  ],
			  location:'projects',
			  
			
		};
	}

		
	render() {
		
		const { isEditable,headers } = this.state;
		const {projectList,classes} =this.props;
		let currentHeader =<h1 style ={{paddingLeft:"10px"}}>Project Management</h1>;
		if(this.state.location =='organization'){
		  currentHeader =<h1 style ={{paddingLeft:"10px"}}>Organization Management</h1>
		}
		
		return (
			<div>
				<div>
				<GroupIcon className={classes.IconClass}/>
			&nbsp; &nbsp;
			<label className="main_titles" >{currentHeader}</label>

				</div>
			
				{/* <h1>Project Management Page</h1> */}
				<ProjectMangementTableBody 
				projectList ={projectList}
				  headers={headers}
				  deleteClicked={this.deleteItemHandler}/>
				
			</div>
		);
	 }
}

const mapStateToProps = (state) => {

	return {
		currentOrg: state.appData.currentOrg,
		projectUserList:state.projectManagementData.projectUserList,
		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
		projectList: state.appData.projectList? state.appData.projectList: [],
		isOrganisationInitialised: state.appData.isOrganisationInitialised
	};
};

const mapDispatchToProps = dispatch => ({
	getProjectList: (data) => dispatch(getProjectList(data))
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProjectManagement));


