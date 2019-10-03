
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { TextField } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import ProjectTableHead from './ProjectTableHead';
import { Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import CustomModal from '../../components/CommonModal/CustomModal';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {deleteProjectDetails} from '../../actions/projectManagementActions';
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  // return;
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function searchingFor(search){
  

  return function(x){
    if(x.project_description ==null){
      x.project_description='Project for testing';
    }
 
    return (x.project_name.toLowerCase().includes(search.toLowerCase())||
    (x.project_description.toLowerCase().includes(search.toLowerCase()) )
  
  );

  }
}


const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  textField: {
    marginLeft: '0px',
    marginRight: '10px',
    
    width: 200,
    height:'auto !important'
  },
  startIcon:{
   paddingBottom:'10px'
  },
  
  textFieldEdit:{
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto',
    paddingBottom:'10px',
    paddingLeft:'10px'

  }
});

let EnhancedTableToolbar = props => {
  const {  classes,addButton } = props;
  
  return (
    <Toolbar
      className={classes.root}
    >
      <div className={classes.title}>
     
      <TextField
        id="search"
        placeholder="Search"
        type="search"
        className={classes.textField}
        margin="normal"
        onChange ={props.searchData}
        value ={props.textValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"
             className={classes.startIcon}>
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {props.textValue? 
              <IconButton
                edge="end"
                onClick={props.clearText}
              >
              <Clear />
              </IconButton>:null}
             
            </InputAdornment>
          ),
        }}
      />
     
      </div>
      <div className={classes.spacer} />
      <Tooltip title ="Add Role">
            <IconButton  onClick={props.addButton} >
         
            <AddIcon style ={{color:"#696969"}}/> 
          </IconButton>
          </Tooltip>
   
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 600,
  
   
   
  },
  tableWrapper: {
    overflowX: 'auto',
    height:'100%'
  },
  tableHover:{
    "&:hover": {
     
      color:'#eff4fc!important'
    }

  },
  headerStyles:{
   
    // paddingLeft:'22px !important',
    fontFamily: 'Open Sans !important',
    // paddingRight:'12px !important',
    fontWeight:'bold',
    backgroundColor: '#BD4951',
    color: '#ffffff',
  
   
  
   
  },

   
  toolbarCss:{

    paddingRight:'52px !important',
   
    "&:hover": {
     
      color:'#ffffff!important'
    }

  },
  toolbarDefaultCss:{

    paddingLeft:'8px !important',
   
    "&:hover": {
     
      color:'#ffffff!important'
    }

  },
  headerHeight:{
    height:'10px!important'
  },
  tableRowStyling:{
    fontFamily: 'Open Sans !important',
    paddingLeft:'22px !important',
    fontWeight:400,
   
  },
  cellStyling:{
    textAlign:'right !important',
    paddingLeft:'12px!important',
   
  },
  deleteIcon:{
   marginLeft:'7px', 
   color:"#696969",
    padding :'1px',

  }
 

});

function createData(name, calories, fat) {
  return { name, calories, fat };
}

class ProjectMangementTableBody extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'Project Name',
 
     page: 0,
    rowsPerPage: 10,
    search:'',
    showDeleteConfirmationDialog: false,
    deleteConnectionID: null,
    };

  handleRequestSort = (event, property) => {

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
    this.setState({ rowsPerPage: event.target.value,page:0 });
  };

  searchTable=()=>{

    this.setState({search:event.target.value})
  }
  clearTextField=()=>{
    this.setState({search:''});
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
	}
	onNoBtnClickHandler=()=>{
		this.hideConfirmationopup();
	}
	hideConfirmationopup = () => {
		this.setState({showDeleteConfirmationDialog: false ,deleteConnectionID:null})
	}

  displayTableBody=(projectList)=>{

    const {  order, orderBy, rowsPerPage, page} = this.state;
    const {classes}=this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, projectList.length - page * rowsPerPage);
    let tableData=[];
    tableData= stableSort(projectList, getSorting(order, orderBy))
          
      .filter(searchingFor(this.state.search))
     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
     .map((project) => {
 
       return (
         <TableRow
   
           role="checkbox"
           tabIndex={-1}
            key={project.project_id}
            className ={classes.tableHover}
            >
         
           <TableCell component="th" scope="row"  align="left"
              className={classes.tableRowStyling}
              style ={{height:'2px'}}
              >
             {project.project_name}
           
           
           </TableCell>
           <TableCell align="left" component="th" scope="row"  
           className={classes.tableRowStyling}
           >
           {project.project_description?project.project_description:'Project For Testing'}
         
           </TableCell>
         
          <TableCell 
          className={classes.cellStyling}
          align="right"
          >
          <Link to={`/edit_user_role/${project.project_id}`}>
          <EditIcon fontSize="small" className="editicon2" style={{color:"#696969" ,marginRight:'15px'}} />
          
         
          </Link>	
          <DeleteIcon 
          className="cursorhover" 
          fontSize="small" 
          style={{color:"#696969",marginRight:'15px'}} 
          onClick ={(e) =>{this.deleteItemHandler(project.project_id)}} />
        
        
        
         
          </TableCell>
         </TableRow>
       );
     })
   {emptyRows > 0 && (
     <TableRow style={{ height: 49 * emptyRows }}>
       <TableCell colSpan={6} />
     </TableRow>
   )}
 
  return tableData;

  }
 
  
  render() {
  
    const { classes,headers,projectList } = this.props;
    const {  order, orderBy, rowsPerPage, page } = this.state;

    return (
      <Paper className={classes.root}>
   
        <EnhancedTableToolbar 
        searchData ={this.searchTable} 
        textValue={this.state.search}
        clearText={this.clearTextField} 
     
        />
      
        <div className={classes.tableWrapper}>
          <Table aria-labelledby="tableTitle" size='small'>
            <ProjectTableHead
              order={order}
              orderBy={orderBy}
             
              onRequestSort={this.handleRequestSort}
              rowCount={projectList.length}
              headers={headers}
              headerCss ={classes.headerStyles}
              toolbarCss ={classes.toolbarCss}
              toolbarDefaultCss={classes.toolbarDefaultCss}
               />
         
            <TableBody  className="table_body">
         
       
              {this.displayTableBody(projectList)}
            </TableBody>
          </Table>
          { 
					this.state.showDeleteConfirmationDialog ?
						<CustomModal
						  onYesBtnClicked={this.onYesBtnClickHandler}
						  onNoBtnClicked={this.onNoBtnClickHandler}/>
						: null
				}
        </div>
        <TablePagination
          rowsPerPageOptions={[10,15,20,25]}
          component="div"
          count={projectList.length}
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
    );
  }
}

const mapDispatchToProps = dispatch => ({

	deleteProjectDetails: (data) => dispatch(deleteProjectDetails(data))
});
export default withStyles(styles)(connect(null, mapDispatchToProps)(ProjectMangementTableBody));

