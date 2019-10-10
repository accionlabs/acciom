import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import EditIcon from '@material-ui/icons/Edit';
import {getProjectList} from '../actions/projectManagementActions';
import GroupIcon from '@material-ui/icons/Group';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomTable from '../components/Table/CustomTable'
import CustomModal from '../components/CommonModal/CustomModal';
import {deleteProjectDetails} from '../actions/projectManagementActions';


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
	  deleteItemHandler=(deleteProjectId)=>{
		 
		  this.setState({showDeleteConfirmationDialog:true ,deleteConnectionID:deleteProjectId});
	  }
	  onYesBtnClickHandler=()=>{
    
		const data = {
				connectionID:this.state.deleteConnectionID
		}
		this.props.deleteProjectDetails(data);
		this.hideConfirmationopup();
	 
		location.reload(true);
		}

		onNoBtnClickHandler=()=>{
			this.hideConfirmationopup();
		}
		hideConfirmationopup = () => {
			this.setState({showDeleteConfirmationDialog: false ,deleteConnectionID:null})
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
			  ],
			  location:'projects',
			  showDeleteConfirmationDialog: false,
			  deleteConnectionID: null,
			  
			
		};
	}

		
	render() {
		
		const { isEditable,headers } = this.state;
		const {projectList,classes} =this.props;
		
		let currentHeader =<h1 style ={{paddingLeft:"10px"}}>Project Management</h1>;
		if(this.state.location =='organization'){
		  currentHeader =<h1 style ={{paddingLeft:"10px"}}>Organization Management</h1>
		}

		const projectModifyData=[];
		if(projectList){
			projectList.forEach(project => {
				projectModifyData.push({
					project_name: project.project_name,
					project_description: project.project_description,
				
					action: (
						<Fragment>
								{/* <Link to={`/edit_user_role/${project.project_id}`}> */}
							<EditIcon fontSize="small" className="editicon2" style={{color:"#696969" ,marginRight:'15px'}} />
						{/* </Link>	 */}
						      <DeleteIcon 
							  className="cursorhover" 
							  fontSize="small" 
							  style={{color:"#696969",marginRight:'15px'}} 
							  onClick ={(e) =>{this.deleteItemHandler(project.project_id)}}
							   />

						</Fragment>
					
					)
				})


			})

		}
	
		return (
			<div>
				<div>
				<GroupIcon className={classes.IconClass}/>
			&nbsp; &nbsp;
			<label className="main_titles" >{currentHeader}</label>

				</div>
			
		
			
				  	<CustomTable 
					headers={headers}
					bodyData={projectModifyData}
					actionLabel="Action"
				/>
				 { 
					this.state.showDeleteConfirmationDialog ?
						<CustomModal
						  onYesBtnClicked={this.onYesBtnClickHandler}
						  onNoBtnClicked={this.onNoBtnClickHandler}/>
						: null
				}
				
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
	getProjectList: (data) => dispatch(getProjectList(data)),
	deleteProjectDetails: (data) => dispatch(deleteProjectDetails(data))
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProjectManagement));


