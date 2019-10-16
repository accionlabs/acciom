
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import CustomTable from '../components/Table/CustomTable'
import CustomModal from '../components/CommonModal/CustomModal';
import {getProjectList,updateProjectList,deleteProjectDetails} from '../actions/projectManagementActions';
import { PROJECTS, ORGANIZATION, PROJECTNAME, PROJECTDESCRIPTION, PROJNAME, DESCRIPTION, SMALL, ACTION, } from '../constants/FieldNameConstants';

const styles = theme => ({

	IconClass:{
		marginBottom:'-5px',
		marginLeft:'3px'
	}
});

class ProjectManagement extends Component {
	componentDidMount(){
    
		const location=window.location.href;

		if(location.includes(PROJECTS)){
		  this.setState({location:PROJECTS});
		}
		  else if(location.includes(ORGANIZATION)){
			this.setState({location:ORGANIZATION});
  
		  }
	  }

	  deleteItemHandler = (deleteProjectId)=>{	 
		  this.setState({showDeleteConfirmationDialog:true, deleteConnectionID:deleteProjectId});
	  }

	  onYesBtnClickHandler=()=>{
		  const connectionId = {
				 
				      rowconnectionID: this.state.deleteConnectionID
			          };
                      this.props.deleteProjectDetails(connectionId);
		              this.hideConfirmationopup();
	  	              location.reload(true);
		       }

		onNoBtnClickHandler=()=>{
			this.hideConfirmationopup();
		}

		hideConfirmationopup = () => {
			this.setState({showDeleteConfirmationDialog: false ,deleteConnectionID:null});
		}

		editHandler=(index)=>{	
			this.setState({editIdx:index});
			const localProjectList = [...this.state.projectList];
		
			this.setState({projectName:localProjectList[index].project_name});
			this.setState({projectDescription:localProjectList[index].project_description});
		}

		saveDataHandler=(index)=>{	
			const localProjectListHandler = [...this.state.projectList];
		
			localProjectListHandler[index].project_name = this.state.projectName;
			localProjectListHandler[index].project_description = this.state.projectDescription;
		
			let upDateProjectDetails = {};

			upDateProjectDetails={
				project_name:localProjectListHandler[index].project_name,
				project_description:localProjectListHandler[index].project_description,
				project_id:localProjectListHandler[index].project_id
			};
	
	 		this.props.updateProjectList(JSON.stringify(upDateProjectDetails));
			this.setState({editIdx:-1});	
		}

		clearDataHandler = () =>{

			this.setState({editIdx:-1});	
		}

		handleChangeHandler=(event)=>{
			if(event.target.name ===PROJECTNAME){
			
				this.setState({projectName:event.target.value});
			}
			else if(event.target.name ===PROJECTDESCRIPTION){
				
				this.setState({projectDescription:event.target.value});
			}

		}

	static getDerivedStateFromProps = (nextProps, prevState) => {
	
		if (!prevState.isOrganisationInitialised && 
			nextProps.isOrganisationInitialised > 0) {
				
			nextProps.getProjectList(nextProps.currentOrg.org_id);
			if(prevState.projectList!== nextProps.projectList){
				return {
					...prevState,
					projectList: nextProps.projectList
				      };

			}
		
		}
		return ({
		
			isOrganisationInitialised: nextProps.isOrganisationInitialised
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			
			headers : [
				{ id: PROJECTNAME,  label: PROJNAME },
				{ id: PROJECTDESCRIPTION,  label: DESCRIPTION },
			  ],
			  location:PROJECTS,
			  showDeleteConfirmationDialog: false,
			  deleteConnectionID: null,
			  editIdx:-1,
			  projectList:[],
			  projectName:'',
			  projectDescription:''
		};
	}
		
	render() {
		
		const { headers , projectList} = this.state;
		const {classes} =this.props;
		
		let currentHeader =<h1 style ={{paddingLeft:"10px"}}>Project Management</h1>;
		if(this.state.location == ORGANIZATION){
		  currentHeader =<h1 style ={{paddingLeft:"10px"}}>Organization Management</h1>;
		}

		const projectModifyData=[];
		if(projectList){
			projectList.forEach((project,index) => {
				projectModifyData.push({
					project_name: project.project_name,
					project_description: project.project_description,
				
					action: (
						<Fragment>
							
							<EditIcon 
								fontSize={SMALL}
								className="editicon2" 
								style={{color:"#696969" ,marginRight:'8px'}} 
								onClick ={() =>{this.editHandler(index);}}
							/>
					  <DeleteIcon 
							  className="cursorhover" 
							  fontSize={SMALL}
							  style={{color:"#696969",marginRight:'8px'}} 
							  onClick ={() =>{this.deleteItemHandler(project.project_id);}}
							   />

						</Fragment>
					
					),
					editingIconAction:(
						<Fragment>
							<CheckIcon
						  style={{color:"#696969" ,marginRight:'8px'}} 
						  onClick ={()=>this.saveDataHandler(index)}/> 
						  <Clear
						   fontSize={SMALL}
						   style={{color:"#696969",marginRight:'8px'}} 
						   onClick={()=>this.clearDataHandler()}/>
						</Fragment>

					)
				});

			});
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
					actionLabel={ACTION}
					editIdx ={this.state.editIdx}
					projectNameValue ={this.state.projectName}
					projectDescriptionValue ={this.state.projectDescription}
					handleChange ={this.handleChangeHandler}
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
	updateProjectList:(data)=>dispatch(updateProjectList(data)),
	deleteProjectDetails: (data) => dispatch(deleteProjectDetails(data))
});
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProjectManagement));

