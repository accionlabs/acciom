import React, { Fragment } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { TextField, Paper } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {Permissions, SAVE, BACKBTNPAGE, ROLEFIELD, DESCRIPTIONFIELD, ROLEDESCFIELD, ROLENAMEFIELD} from '../constants/FieldNameConstants';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import {getSelectedRole,updateRoleList,getRolesList,resetAllValueOfRole} from '../actions/roleManagementActions';
import {Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width:'95%',
    marginTop:'29px',
    marginLeft:'20px !important',
 
   
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',

  },

  chip: {
    margin: theme.spacing.unit / 4,
   
  },

});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const formatRoleList=(rolesList)=>{
  let formatedList = [];
  
  if(rolesList){
    formatedList = rolesList.permissions.map((item) => {
			return { value: item.permission_id, label: item.permission_name, description:item.permission_description };
    });
   
	return formatedList;

  }

}
const getSelectedRoleItems = (roleList, selectedRoles) => {
	
	const selectedItems = roleList.filter(role => {
		return selectedRoles.includes(role.value);
	});

	return selectedItems;
};

class ManageRoles extends React.Component {
  state = {
    initialRole: [],
    roleList:[],
    selectedRoles:[],
    textFieldName:'',
    textFieldDesc:'',
    selectedIdValue:null
  };

  goToBackBtnPage=()=>{
    this.props.history.push('/manageRole');

  }
  validateConditions=(permissionIdList)=>{
    const {initialRole,textFieldName,textFieldDesc,selectedIdValue} =this.state;
  
  let sortedSelectedIdValue=selectedIdValue.sort();
    let sortedPermissionIdList= permissionIdList.sort();

  if(textFieldName ===initialRole.role_name && 
    textFieldDesc===initialRole.role_description &&
    JSON.stringify(sortedSelectedIdValue)===JSON.stringify(sortedPermissionIdList)){
      
      return true
  }
  return false
}
  saveFunctionality=()=>{
   
    const {initialRole,selectedRoles,textFieldName,textFieldDesc} =this.state;
    const permissionIdList = selectedRoles.map((item)=>{
      return item.value
    })
 

    const saveFunctionalityDetails ={
      "role_name":textFieldName,
      "role_description":textFieldDesc,
      "role_id":initialRole.role_id,
      "permission_id_list":permissionIdList

    }
    

   if(textFieldName.length ==0){
     toast.error(ROLENAMEFIELD);


   }
   else{
     if(textFieldDesc.length==0){
      toast.error(ROLEDESCFIELD);
 
     }
   }

   if(textFieldName.length >0 && textFieldDesc.length>0 &&(!this.validateConditions(permissionIdList))){
     
   
    this.props.updateRoleList(JSON.stringify(saveFunctionalityDetails));
   }
   this.props.history.push('/manageRole');
  }

  handleChangeDropdown = (event) => {
  
  
      this.setState({selectedRoles:event.target.value});
    

  };
  handleTextField=()=>{


  if(event.target.name ==ROLEFIELD){
    this.setState({textFieldName:event.target.value});
    this.setState({editNameIdx:1});
  }
  if(event.target.name ==DESCRIPTIONFIELD){
   
    this.setState({textFieldDesc:event.target.value});
    this.setState({editDescIdx:1});
    
  }

  }

 componentDidMount(){
  
   const roleId = (this.props.match && this.props.match.params) ? this.props.match.params.id : null;
   
   this.props.getSelectedRole(roleId);
 }

 static getDerivedStateFromProps =(nextProps, prevState)=>{

  
  if(nextProps.refreshRoleDetails){
    const roleId = (nextProps.match && nextProps.match.params) ? nextProps.match.params.id : null;
  
    nextProps.getRolesList(nextProps.currentOrg.org_id);
    nextProps.getSelectedRole(roleId);
    

    return {
        prevState,
      
    };
  
 
}
  
    if(prevState.selectedRolesPermission!==nextProps.selectedRolesPermission && prevState.selectedRoles.length==0){
    

  
    const roleList=formatRoleList(nextProps.selectedRolesPermission);
    const isSelected=(nextProps.selectedRolesPermission.permissions.filter(per=>per.is_selected===true))
   
    const selectedIdValue=isSelected.map(idValue=>idValue.permission_id);
 
    const selectedRoles = getSelectedRoleItems(roleList,selectedIdValue);
   

      return{
        ...prevState,
        roleList,
        selectedRoles,
        initialRole:nextProps.selectedRolesPermission,
        textFieldName:nextProps.selectedRolesPermission.role_name,
        textFieldDesc:nextProps.selectedRolesPermission.role_description,
        selectedIdValue
       
      };
   }
  return prevState;

 }

 componentWillUnmount(){
 
  this.setState({textFieldDesc:'',textFieldName:'',editNameIdx:-1, editDescIdx:-1,selectedRoles:[]})
  this.props.resetAllValueOfRole();
 }

  render() {
  
    const { classes,selectedRolesPermission } = this.props;
    const{ textFieldName,textFieldDesc}=this.state;
  
 

    return (
        <Fragment>
          <PersonAddIcon className="editRoleEditIcon" />
			<h3 className="usermanagetitle main_titles">Manage Roles</h3>
            <Paper className="manageRolePaper">
  
        <TextField 
         label ={ROLEFIELD}
         style ={{marginLeft:'20px',marginTop:'11px',width:'370px'}}
        
         value ={textFieldName}
         name={ROLEFIELD}
         onChange ={this.handleTextField}
        />

       <TextField 
      label ={DESCRIPTIONFIELD}
      style ={{marginRight:'20px',marginTop:'11px',width:'370px',float:'right'}}
      value ={textFieldDesc}
      name ={DESCRIPTIONFIELD}
      onChange ={this.handleTextField}
     />
     

        <FormControl className={classes.formControl}>
      
          <InputLabel htmlFor="select-multiple-checkbox" >{Permissions}</InputLabel>
          <Select
            multiple
            
            value={this.state.selectedRoles}
           
            onChange={(event)=>this.handleChangeDropdown(event)}
        
            renderValue={() => (
                <div className={classes.chips}>
                  {this.state.selectedRoles.map((value,index) => (
                               
                      <Chip key={value.label} label={value.label} className={classes.chip} />
           
            ))}
                </div>
              )}
              
            
          >
            {this.state.roleList.map((role,index) => (
               
          
              <MenuItem key={index} value={role} style ={{color:'#ffc0cb '}}>
           
              {role.label}
          
              </MenuItem>
       
            ))}
          </Select>
        </FormControl>
        <Button className="onDeleteDbYesBtnClick nobtnbgcolor" 
                bsStyle="primary" 
                onClick={this.saveFunctionality}
                style ={{float:'right',paddingLeft:'8px',marginRight:'24px',marginTop:'10px',marginBottom:'10px'}}
                >
                 {SAVE}
                </Button>
                
                <Button className="button-colors" 
               onClick={this.goToBackBtnPage}
                 style ={{float:'right',marginRight:'10px',width: '130px',marginTop:'10px',marginBottom:'10px'}}
                >
               {BACKBTNPAGE}
                    </Button>
     
      
        </Paper>
        </Fragment>
    );
  }
}


const mapStateToProps =(state)=>{
  return{
    selectedRolesPermission:state.roleManagementData.selectedRolesPermission,
    refreshRoleDetails:state.roleManagementData.refreshRoleDetails,
    currentOrg: state.appData.currentOrg,

  }
}
const mapDispatchToProps =(dispatch)=>({
  getSelectedRole: (data) => dispatch(getSelectedRole(data)),
  updateRoleList: (data) => dispatch(updateRoleList(data)),
  getRolesList: (data) => dispatch(getRolesList(data)),
  resetAllValueOfRole:()=>dispatch(resetAllValueOfRole())
  
 
 })
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ManageRoles));

