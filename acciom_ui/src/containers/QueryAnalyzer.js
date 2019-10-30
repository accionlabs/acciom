import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import QueryAnalyzerTable from '../components/QueryAnalyzerTable';
// import { Modal, Button } from 'react-bootstrap';
import { getSelectedDatabaseType,runQuery,getTableData } from '../actions/queryAnalyzerActions';
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
import NotesIcon from '@material-ui/icons/Notes';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';


class QueryAnalyzer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            table: false,
            tablesOnRunQuery:  [],
            QueryAnalyzerClicked: false,
            db_connection_id:null,
            query_text:'',
            queryTextExecuted:'',
            isDialogOpen: false,
            isRunQueryClicked: true,  
            showTables: false,
            tableHeader: false,
            queryTextValues: []
         };
    }

    componentDidMount() {
        if(this.props.currentProject){
            console.log("26")
            console.log(this.props.currentProject)
            this.props.getAllConnections(this.props.currentProject);
            // this.props.runQuery(this.props.currentProject)
        }
    }

    handleConnectionChange =(e) => {
        console.log(e.target.value)
        this.setState({
            db_connection_id:e.target.value
        })}
        
    onRunQueryClick = async(e) => {
        if(this.state.query_text != ''){
            this.setState({tablesOnRunQuery: [...this.state.tablesOnRunQuery, ''],})
            // const tempArr= this.state.tablesOnRunQuery.push('');
            // this.setState({tablesOnRunQuery: tempArr})
        }
        this.state.queryTextValues.push(this.state.query_text);
        console.log(this.state.queryTextValues, '<=================this.state.queryTextValues')
        console.log('this.state.db_connection_id',this.state.db_connection_id,)
        let querybody = {
            'project_id':this.props.currentProject.project_id,
            'connection_id':this.state.db_connection_id,
            'query':this.state.query_text
        }
        await this.props.runQuery(JSON.stringify(querybody))
        let getTableRefreshTimer;
        await this.props.getTableData(querybody.project_id);
            // getTableRefreshTimer = setInterval(()=> {this.props.getTableData(querybody.project_id)}, 5000)
    }
    closeTable = () => {
        this.setState({isRunQueryClicked: false})
    }

    handleQueryTextChange = (e) =>{
        this.setState({
            query_text: e.target.value
        });
    }

    handleDialogBox = (e) => {
        this.setState({isDialogOpen: true});
    }
    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }
    nextTable = () => {
        return <h3>{this.state.query_text}</h3>;
    } 
    removeTable = (index) => {
        this.state.tablesOnRunQuery.splice(index, 1);
        // this.state.queryTextValues.slice(index, 1)
        this.setState({tablesOnRunQuery: this.state.tablesOnRunQuery});
        // this.setState({queryTextValues: this.state.queryTextValues});
    }
 
render() {
        const headers = [
			{ id: 'query_id',  label: 'Query Id' },
			{ id: 'execution_status',  label: 'Execution Status' },
			{ id: 'query_result', label: 'Query Result' }
          ];


        // const tableData = [];
        //   if (this.props.porjectQueryData) {
        //       this.props.porjectQueryData.forEach(query => {
        //         tableData.push({
        //               query_id: query.query_id,
        //               execution_status: query.execution_status,
        //               query_result: query.query_result,
        //             //   action: (
        //             //       <Link to={`/edit_user_role/${user.user_id}`}>
        //             //           <EditIcon fontSize="small" className="editicon2" style={{color:"#696969" ,marginRight:'15px'}} />
        //             //       </Link>	
        //             //   )
        //           })
        //       })
        // }
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
        console.log('this.props.projectQueryData=============>',this.props.projectQueryData )

         return (
            <div className='queryAnalyzer'>
                <table>
                    <tr>
                        <td>
                            <NotesIcon className="queryAnalysisIcon" />
                        </td>
                        <td><label className="main_titles queryAnalysisLable">Analyse Queries</label></td>
                    </tr>
                </table>
                <div className='queryAnalElemment'>
                <div className='queryLable sub_title' style={{   color: '#69717D !important',fontSize: '15px',fontWeight:'bold'}}>Query</div>
                <div className='dropdownQueryAnalyser'>
                    <select onChange={this.handleConnectionChange}  className="queryAnalysisDropdown">
                        <option value="Select Connection" theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' } })}>Select Connection</option>
                                    { this.props.allConnections.map(connection => (
                                        connection ?
                                            <option key={connection.db_connection_id} value={connection.db_connection_id} >{connection.db_connection_name}</option> : null
                                    ))
								}
                    </select>
                </div>
                <div>
                    <textarea value={this.state.query_text} onChange={this.handleQueryTextChange} rows="6" cols="70" className='queryAnalysisTextarea'></textarea>
                </div>
                <div>    
                    <button className='button-colors runQueryButtoon' onClick={this.onRunQueryClick} disabled={!this.state.query_text}>Run Query</button>
                </div>
                <div className='tableHeader'>
                    {/* {this.state.isRunQueryClicked ? 
                     <>
                     <button className='queryAnalDeleteTableBtn' onClick={this.closeTable}>X</button>
                     <button className='queryAnalExportBtn'>Export</button>
                     <button className='queryAnalExportPopUp' onClick={this.handleDialogBox}>Query</button> 
                     </> 
                     : null
                     } */}
                    {/* {this.state.isRunQueryClicked ? <QueryAnalyzerTable 
                        headers={headers}
                        bodyData={userList}
                    /> : null
                    } */}
                    {
                        this.state.tablesOnRunQuery.map((table, index)=>{
                                return <div key={index}>
                                            <>
                                                <button className='queryAnalDeleteTableBtn' style={{backgroundColor: '#BD4951', color: '#fff' }} onClick={()=> this.removeTable(index)}>X</button>
                                                {/* <button className='queryAnalExportBtn'>Export</button> */}
                                                <IconButton className="queryAnalExportIcon">
                                                <GetAppIcon />
                                                </IconButton>
                                                {/* <button className='queryAnalExportPopUpButton'  onClick={this.handleDialogBox}>Query</button> */}
                                                <IconButton onClick={this.handleDialogBox} className="queryAnalyserQueryIcon">
                                                    <InfoIcon />
                                                </IconButton>
                                                <QueryAnalyzerTable
                                                    className="QueryAnalyzerTableWidth"
                                                    headers={headers}
                                                    bodyData={this.props.projectQueryData}
                                                /> 
                                            </> 
                                        </div>
                        
                    })
                        }
                </div>
                {this.state.isDialogOpen && (
                        <QueryAnalyzerDialogBox style={{position:'absolute', zIndex:'99999'}} onDialogBoxClose={(e) => this.setState({isDialogOpen: false})}>
                            {this.state.queryTextValues[(this.state.queryTextValues.length - 1)]}
                        </QueryAnalyzerDialogBox>
                )} 
                </div>
            </div>

            
        );
    }
}

const mapStateToProps = (state) => {
    console.log('state--------->', state)
	return {
        projectQueryData: state.runQuery.projectQueryData? state.runQuery.projectQueryData : [],
		allConnections : state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
        currentProject : state.appData.currentProject,
        currentOrg: state.appData.currentOrg,
		orgUserList: state.userManagementData.orgUserList? state.userManagementData.orgUserList: [],
		projectList: state.appData.projectList? state.appData.projectList: [],
        isOrganisationInitialised: state.appData.isOrganisationInitialised,        
    	};
};
const mapDispatchToProps = dispatch => ({
    getQueryAnalyzerDetails: (data) => dispatch(getQueryAnalyzerDetails(data)),
    getAllConnections:(data) =>dispatch(getAllConnections(data)),
    runQuery:(data) =>dispatch(runQuery(data)),
    getTableData:(data) =>dispatch(getTableData(data)),
    getOrganizationUsersList: (data) => dispatch(getOrganizationUsersList(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(QueryAnalyzer);



// onRunQueryClick = async(e) => {
//     const { query_text, queryTextExecuted } = this.state;
//     if(query_text != queryTextExecuted){
//         this.setState({
//             isRunQueryClicked: true,
//             queryTextExecuted: query_text,  
//         }) 
//     }