import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryAnalyzerTable from '../components/QueryAnalyzerTable';
// import { Modal, Button } from 'react-bootstrap';
import { getSelectedDatabaseType,runQuery } from '../actions/queryAnalyzerActions';
// import CustomPaginationActionsTable from '../components/Tables';
import Paper from '@material-ui/core/Paper';
import { 
	getAllConnections, 
} from '../actions/testSuiteListActions';
import CustomTable from '../components/Table/CustomTable';
import { ListGroup,Table, Button, Col } from 'react-bootstrap';
import { getOrganizationUsersList,addOrganizationUsersList, retriveUserRoleByUserId } from '../actions/userManagementActions';
import  RoleListItemContainer  from './RoleListItemContainer';
import CustomPaginationActionsTable from '../components/Tables';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import QueryAnalyzerDialogBox from '../components/QueryAnalyzerDialogBox'


class QueryAnalyzer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            table: false,
            QueryAnalyzerClicked: false,
            db_connection_id:null,
            query_text:'',
            isDialogOpen: false
         };
    }

    componentDidMount() {
        if(this.props.currentProject){
            console.log("26")
            console.log(this.props.currentProject)
            this.props.getAllConnections(this.props.currentProject)
        }
    }
    handleConnectionChange =(e) => {
        
        console.log(e.target.value)
        this.setState({
            db_connection_id:e.target.value
        })}
    onRunQueryClick = (e) => {
        console.log('Run Query Clicked !!');
        console.log("this.props.runQuery====>",this.props.runQuery);
    let querybody = {
        'project_id':this.props.currentProject.project_id,
        'db_connection_id':this.state.db_connection_id,
        'query':this.state.query_text
    }
    this.props.runQuery(JSON.stringify(querybody));
}

handleQueryTextChange = (e) =>{
    this.setState({
        query_text: e.target.value
      });
    //   console.log(this.state.query_text)
}
handleDialogBox = (e) => {
    this.setState({isDialogOpen: true});
}
 createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  

    render() {
        const rows = [
            this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
            this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
              // createData('Eclair', 262, 16.0, 24, 6.0),
              // createData('Cupcake', 305, 3.7, 67, 4.3),
              // createData('Gingerbread', 356, 16.0, 49, 3.9),
          ];
          const headers = [
			{ id: 'first_name',  label: 'First Name' },
			{ id: 'last_name',  label: 'Last Name' },
			{ id: 'email', label: 'Email' }
          ];
          const userList = [];
          if (this.props.orgUserList) {
              this.props.orgUserList.forEach(user => {
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
            <div className='queryAnalyzer'>
                <div style={{fontSize:'17px'}}>Analyse Queries</div>
                <div className='queryAnalElemment'>
                <div className='query' style={{fontSize:'17px'}}>Query</div>
                <div className='dropdown'>
                    <select onChange={this.handleConnectionChange}>
                        <option value="" disabled></option>
                                    { this.props.allConnections.map(connection => (
                                        connection ?
                                            <option key={connection.db_connection_id} value={connection.db_connection_id} >{connection.db_connection_name}</option> : null
                                    ))
								}
                    </select>
                </div>
                <div>
                    <textarea value={this.state.query_text} onChange={this.handleQueryTextChange} rows="6" cols="70" className='textarea'></textarea>
                </div>
                <div>    
                    <button className='runQuery' onClick={this.onRunQueryClick} className='runQuery'>Run Query</button>
                </div>
                <div className='tableHeader'>
                    <button className='queryAnalDeleteTableBtn'>X</button>
                    <button className='queryAnalExportBtn'>Export</button>
                    <button className='queryAnalExportPopUp' onClick={this.handleDialogBox}>Query</button>
                    <QueryAnalyzerTable 
                        headers={headers}
                        bodyData={userList}
                    />
                </div>
                {this.state.isDialogOpen && (
                        <QueryAnalyzerDialogBox style={{position:'absolute', zIndex:'99999'}} onDialogBoxClose={(e) => this.setState({isDialogOpen: false})}>
                           {this.state.query_text}
                        </QueryAnalyzerDialogBox>
                )} 
                </div>
            </div>

            
        );
    }
}

const mapStateToProps = (state) => {
	return {
		allConnections : state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
        currentProject : state.appData.currentProject,
        currentOrg: state.appData.currentOrg,
		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
		projectList: state.appData.projectList? state.appData.projectList: [],
		isOrganisationInitialised: state.appData.isOrganisationInitialised
    	};
};
const mapDispatchToProps = dispatch => ({
    getQueryAnalyzerDetails: (data) => dispatch(getQueryAnalyzerDetails(data)),
    getAllConnections:(data) =>dispatch(getAllConnections(data)),
    runQuery:(data) =>dispatch(runQuery(data)),
    getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(QueryAnalyzer);