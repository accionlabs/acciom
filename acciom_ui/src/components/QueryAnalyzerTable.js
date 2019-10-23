import React from 'react';
import { connect } from 'react-redux';
import TableToolbar from './Table/TableToolbar';
import TableHeader from './Table/TableHeader';
import TableListBody from './Table/TableListBody';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { getSelectedDatabaseType,runQuery,getTableData } from '../actions/queryAnalyzerActions';
import { 
	getAllConnections, 
} from '../actions/testSuiteListActions';

const desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
const stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
  
const getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
  
const searchingFor = (search,headers) => {
    return function(sortData){
      return headers.some(data => {
        return sortData[data.id].toLowerCase().includes(search.toLowerCase());
      });
    }
}


const styles = theme => ({
    root: {
      marginTop: '0px',
      marginBottom: '20px'
      // marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
      overflowX: 'auto'
    },
  
  });

class QueryAnalyzerTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          order: 'asc',
          orderBy: '',
          page: 0,
          rowsPerPage: 10,
          search:'',      
        };
    }
      
    handleSort = (property) => {
      const orderBy = property;
      let order = 'desc';
      if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
      }
      this.setState({ order, orderBy });
    };

    handleChangePage = (event, page) => {
      this.setState({ page });
    };
  
    handleChangeRowsPerPage = event => {
      this.setState({ rowsPerPage: event.target.value, page:0 });
    };

    handleClear=()=>{
      this.setState({search:''});
    }
    handleSearch=(event)=>{
      this.setState({search:event.target.value})
    }
    getTableData=()=>{
      let querybody = {
        'project_id':this.props.currentProject.project_id,
        'connection_id':this.state.db_connection_id,
        'query':this.state.query_text
    }
    this.props.getTableData(querybody.project_id);
    }

    render(){
      const {classes, headers, bodyData, actionLabel} = this.props;
      const { order, orderBy, page, rowsPerPage, search } = this.state;
        return(
          <Paper className={classes.root} onTableClose={this.props.onTableClose}>
            {/* <button className='queryAnalDeleteTableBtn'>X</button>
            <button className='queryAnalExportBtn'>Export</button>
            <button className='queryAnalExportPopUp' onClick={this.handleDialogBox}>Query</button> */}
            <TableToolbar
            handleSearch = {this.handleSearch}
            handleClear = {this.handleClear}
            search = {search}
            />
                        
            <div className={classes.tableWrapper}>
              <TableHeader 
                headers={headers}
                handleSort={this.handleSort}
                actionLabel={actionLabel} 
                order = {order}
                orderBy = {orderBy}
              />
              <TableListBody
                bodyData = {bodyData} 
                order = {order}
                orderBy = {orderBy}
                page = {page}
                rowsPerPage = {rowsPerPage}
                search = {search}
                stableSort = {stableSort}
                getSorting = {getSorting}
                headers = {headers}
                searchingFor={searchingFor}
              />
            </div>
            <TablePagination
              rowsPerPageOptions={[10,15,20,25]}
              component="div"
              count={bodyData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
          </Paper>
        )
    }
}
const mapStateToProps = (state) => {
  return {

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
  getTableData:(data) =>dispatch(getTableData(data)),
  getAllConnections:(data) =>dispatch(getAllConnections(data)),
 })

 export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QueryAnalyzerTable));