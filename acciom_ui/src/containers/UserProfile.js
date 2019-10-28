import React, { Component } from 'react';
import { connect } from 'react-redux';
import PersonIcon from '@material-ui/icons/Person';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { showOrgChangePage, updateSelectedOrganization, getProjectListByOrgId } from '../actions/appActions';
import { showProjectSwitchPage, updateSelectedProject } from '../actions/appActions';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';


class UserProfile extends Component{

    useStyles = makeStyles(theme => ({
        root: {
          padding: theme.spacing(3, 2),
        },
      }));
    constructor(props) {
		super(props);
		this.state = {
            selectedOrgId: '',
            selectProjectId:''
		};
	}

	componentDidMount() {
		const currentOrg = { value: this.props.currentOrg.org_id, label: this.props.currentOrg.org_name };
        this.setState({selectedOrgId: currentOrg.value});
        const currentProject = { value: this.props.currentProject.project_id, label: this.props.currentProject.project_name };
        this.setState({selectProjectId: currentProject.value},()=>{
        });
    }
    
    renderOrgListOptions = () => {
		const options = this.props.orgList.map((item) => {
			return { value: item.org_id, label: item.org_name} ;
		});
        return options;
   
	};
	handleOrgChange = (e) => {
      
		this.setState({selectedOrgId: e.target.value});
    };
    renderProjectListOptions=()=>{
        const options = this.props.projectList.map((item) => {
			return { value: item.project_id, label: item.project_name} ;
		});
		return options;

    };
    handleProjectChange =(e)=>{
         this.setState({selectProjectId:e.target.value})
    };

   
    render(){
     
        return(
            <Paper className="border_user_profile">
                 <PersonIcon className="userAccount"/>
                <div className="user_profile_heading" >User Profile</div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                        <div className=" userProfileFname">First Name</div>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                        id="standard-uncontrolled"
                        defaultValue="T"
                        className="userProfileFnameLabel"
                        margin="normal"/>
                        </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                        <div className=" userProfileLname">Last Name</div>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                        id="standard-uncontrolled"
                        defaultValue="Roja"
                        className="userProfileLnameLabel"
                        margin="normal"/>
                        </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                        <div className=" userProfileEmail">Email</div>
                        </Grid>
                         <Grid item xs={6}> 
                        <TextField
                          id="standard-uncontrolled"
                          readOnly value="user1@accionlabs.com"
                          className="userProfileEmailLabel"
                        margin="normal"/>
                        </Grid> 
                    </Grid>
                    </Grid>
                </Grid> 

                <button className="button-colors submit_button_user_profile">Submit</button>
               
                <div>
                    <label className="sub_title set_default_organization">Set default Organization :</label>
                    <Select  
                    className="select_organization_default"
				    value={this.state.selectedOrgId}
					onChange={ (item) => this.handleOrgChange(item) }
                    >
                    {this.renderOrgListOptions().map((data, index) => (
                        <MenuItem key={index} value={data.value}>{ data.label }</MenuItem>
                            ))}
                    </Select>
                </div>
                <div>
                    <label className="sub_title set_default_organization ">Set default Project :</label>
                    <Select 
                    className="select_organization_default"
                    value={this.state.selectProjectId}
                    onChange={ (item) => this.handleProjectChange(item) }
                    >
                    {this.renderProjectListOptions().map((data, index) => (
                                <MenuItem key={index} value={data.value}>{ data.label }</MenuItem>
                            ))}
                    </Select>
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    
	return {
		orgList: state.appData.organizationList,
        currentOrg: state.appData.currentOrg,
        projectList:state.appData.projectList,
        currentProject:state.appData.currentProject
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateSelectedOrganization: (data) => dispatch(updateSelectedOrganization(data)),
        getProjectListByOrgId: (data) => dispatch(getProjectListByOrgId(data)),
        showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
        updateSelectedProject: (data) => dispatch(updateSelectedProject(data)),
	}
};

   
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
	 

