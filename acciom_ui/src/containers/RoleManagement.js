
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {getRolesList,resetAllValueOfRole} from '../actions/roleManagementActions';
import GroupIcon from '@material-ui/icons/Group';
import { Button} from 'react-bootstrap';
import { ROLENAME, ROLEID, ROLEDESCRIPTIONID, ROLEDESCRIPTIONLABEL, SMALL, ACTION, ADD_ROLES, ROLE_MANAGEMENT } from '../constants/FieldNameConstants';
import CustomTable from '../components/Table/CustomTable';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const styles = theme => ({

	IconClass:{
		marginBottom:'-5px',
		marginLeft:'3px'
	}
});

class RoleManagement extends Component {
    handleAddButtonHandler=()=>{
     
        this.props.history.push('/addRole');
    }
    static getDerivedStateFromProps =(nextProps, prevState)=>{
      
        if(nextProps.roleList.length === 0){
        if (nextProps.currentOrg ? nextProps.currentOrg.org_id : false) {
            nextProps.getRolesList(nextProps.currentOrg.org_id);
			return {
				prevState
			};

        }
    }
    if(prevState.roleList!== nextProps.roleList){
        return {
            ...prevState,
            roleDetailsList: nextProps.roleList
            };

    } 

    }
    componentWillUnmount(){
    
        this.props.resetAllValueOfRole();
    }
    state ={
        headers : [
            { id: ROLEID,  label: ROLENAME },
            { id: ROLEDESCRIPTIONID,  label: ROLEDESCRIPTIONLABEL },
          ],
          roleDetailsList:[],

    };
render(){
    const {headers,roleDetailsList}=this.state;
   
   const roleModifyData=[];
    if(roleDetailsList){
        roleDetailsList.forEach((role,index)=>{
            roleModifyData.push({
                role_name:role.role_name,
                role_description:role.role_description,
                action: (
                    <Fragment>
                        <Link to={`/manage_role/${role.role_id}`}>
                        <EditIcon 
                            fontSize={SMALL}
                            className="editicon2" 
                            style={{color:"#696969" ,marginRight:'8px'}} 
                            
                        />
								
							</Link>	
                   
                  <DeleteIcon 
                          className="cursorhover" 
                          fontSize={SMALL}
                          style={{color:"#696969",marginRight:'8px'}} 
                        //   onClick ={() =>{this.deleteItemHandler(org.org_id);}}
                           />

                    </Fragment>
                
                ),
            })

        })

    }
    return(
     <Fragment>
        
         <div>
				<GroupIcon className=" organizationManagementIcon" />
			&nbsp; &nbsp;

				
                    <label className="main_titles projectManagementMargin" >
                     {ROLE_MANAGEMENT}
                    </label>
                    <Button 
					className="backbutton_colors_project addUserButton"
					onClick={this.handleAddButtonHandler}
                    >
                     {ADD_ROLES}
                    </Button>
                  
                  <CustomTable
                  headers={headers}
                  bodyData={roleModifyData}
                  actionLabel={ACTION}
                 
                  /> 


				</div>
     </Fragment>
    );
}
}
const mapStateToProps=(state)=>{
    return{
        currentOrg: state.appData.currentOrg,
        roleList:state.roleManagementData.roleList,
    };

};
const mapDispatchToProps =dispatch=>({
    getRolesList: (data) => dispatch(getRolesList(data)),
    resetAllValueOfRole:()=>dispatch(resetAllValueOfRole())

  
})

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(RoleManagement));
