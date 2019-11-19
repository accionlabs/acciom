import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';

import {Button} from 'react-bootstrap';
import '../css/Db-ui-styles.css';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';
import { ISSPACE } from '../constants/FieldNameConstants';
import IconButton from '@material-ui/core/IconButton';
import PlusCircle from '@material-ui/icons/AddCircle';
import MinusCircle from '@material-ui/icons/RemoveCircle';
import EditRounded from '@material-ui/icons/EditRounded';
import { Link } from 'react-router-dom';

import BorderColorRoundedIcon from '@material-ui/icons/BorderColorRounded';
import { getallClassNames,SubmitTestSuiteData } from '../actions/dbDetailsActions';

import QueryModal from '../components/QueryModal';
import { 
  getTestCaseDetailBySuiteId,
  getTestCaseByTestCaseId, 
}
from '../actions/testSuiteListActions';
import { 
  getAllTestSuites,
} from '../actions/testSuiteListActions';
import { 
  getAllConnections
} from '../actions/testSuiteListActions';
const useStyles = theme => ({
    root: {
    width: '90vw',
    marginTop: theme.spacing(3),
    overflowX: 'unset',
    overflowY:'unset',
    },
    table: {
    minWidth: 650,
    },
    tablecell:{
        whiteSpace: 'nowrap', 
        maxWidth: '11vw',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor:'pointer',
    },
    tablecellDropDown:{ 
        maxWidth: '11vw'
    },
    tablepopup:{
        whiteSpace: 'nowrap', 
        maxWidth: '5vw',
        overflow: 'hidden',
        textOverflow: 'ellipsis', 
    },
    tablehead:{
        verticalAlign: 'middle',
        color: '#fff',
    },
    minusbtn:{
        margin: theme.spacing(1),
        marginBottom:"40px"
    },
    but:{
       
        borderColor: '#BD4951 !important',
        color: 'white',
        fontSize: '13px',
        borderRadius: '3px',
        textAlign: 'center',
        width:' 121px',
        height:'31px',
        marginTop:'10px',
        "&:disabled": {
            cursor: "not-allowed"
          }
    },
    Backbut:{
        backgroundColor: '#BD4951 !important',
    },
    Uploadbut:{
        backgroundColor:'rgb(156, 157, 160);'
    },
    customWidth:{
        maxWidth: 500,
    }
    
  });

export class CloneTestSuite extends Component {
    constructor (props) {
		super(props);
        this.state = {
            firstLoad:true,
      CaseData_Description:[],
      CaseData:[],
      suite_id:null,
      showQueryModal:false,
      ModalData:{},
      suiteName:'',
      Headers : [
        {label: 'Test class','required':true },
        {label: 'Description','required':true },
        {label: 'Source Connection','required':true},
        {label: 'Target Connection','required':true},
        {label: 'Source Table' ,'required':true},
        {label: 'Target Table','required':true },
        {label: 'Columns','required':false },
        {label: 'Source query' ,'required':false},
        {label: 'Target query','required':false }
    ],
      isTestClassSelected:true,	
      DisableSrc:false
    };
            this.onYesBtnClickHandler = this.onYesBtnClickHandler.bind(this)
            this.getConnectionData = this.getConnectionData.bind(this)
        }

        componentDidMount () {
            this.props.getAllTestSuites(this.props.currentProject.project_id)
              const suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
              this.props.getTestCaseDetailBySuiteId(suite_id,false)
              this.props.getallClassNames()
              this.props.getAllConnections(this.props.currentProject.project_id) 
        }
        static getDerivedStateFromProps = (nextProps, prevState) => {
          let newState = prevState;
            if (nextProps.redirectToSuiteList) {
              nextProps.history.push('/startup'); 
          } 
          if (nextProps.refreshDBDetails){
            nextprops.getAllConnections(this.props.currentProject.project_id)
        }
        
            if(prevState.firstLoad && prevState.suiteData!== nextProps.suiteData){
              const sid = parseInt(nextProps.match.params['suite_id'])
                    return {
                ...prevState,
                suite_id:sid,
                CaseData_Description: nextProps.suiteData[sid],
                        };
            } 
            return newState;
          }

          handleChange = (e,index,col_event,reset=false) =>{

            switch (col_event){
                case 2:
                    const temp_SuiteData_desc = [...this.state.CaseData_Description]
                    temp_SuiteData_desc[index]['test_description'] = e.target.value;
                    this.setState({suiteData:temp_SuiteData_desc})
                    break;
                case 5:
                    const temp_SuiteData_table = [...this.state.CaseData_Description]
                    temp_SuiteData_table[index]['src_table'] = reset ? "":e.target.value;
                    this.setState({suiteData:temp_SuiteData_table})
                    break;
                case 6:
                    const temp_SuiteData_table_tar = [...this.state.CaseData_Description]
                    temp_SuiteData_table_tar[index]['target_table'] = reset ? "":e.target.value;
                    this.setState({suiteData:temp_SuiteData_table_tar})
                    break;
                case 7:
                    const temp_SuiteData_table_col = [...this.state.CaseData_Description]
                    temp_SuiteData_table_col[index]['column'] = e.target.value;
                    this.setState({suiteData:temp_SuiteData_table_col})
                    break;
                case 8:
                    const temp_SuiteData_table_src_qry = [...this.state.suiteData]
                    temp_SuiteData_table_src_qry[index]['source_query'] = reset ? "":e.target.value;;
                    this.setState({suiteData:temp_SuiteData_table_src_qry})
                    break;
                case 9:
                    const temp_SuiteData_table_tar_qry = [...this.state.suiteData]
                    temp_SuiteData_table_tar_qry[index]['target_query'] = e.target.value;
                    this.setState({suiteData:temp_SuiteData_table_tar_qry})
                default:
        
            }
        }

          showHeader = (classes) =>{
            let test =[];
            test=this.state.Headers.map((item,key)=>{
            return(
            !item.required?<TableCell className={classes.tablecell}>{item.label}</TableCell>:
            <TableCell className={classes.tablecell}>{item.label}<span className="mandatory">*</span></TableCell>
            )})
            return test
        }
        handleDBTypeChange = (index,e)=>{

            if ((e.target.value == ('duplicatecheck')) || (e.target.value == ('nullcheck'))){
              this.handleExistingDBTypeChange(index,e,0)
              this.handleChange(e,index,5,true)
            }
            const temp =[...this.state.CaseData_Description]
            temp[index]['test_class'] = e.target.value
            this.setState({CaseData_Description:temp})
        }
        showClass = (classNameList,classes) =>{
            const test =  classNameList.map((item) =>{
            const key = Object.keys(item)[0][0]
              return ( <MenuItem value={item[key]['supported_test_class']}>
              {item[key]['supported_test_class_display_name']} 
              </MenuItem>)
              })
              return test  
          }
        
          handleExistingDBTypeChange = (index,e,v_index) =>{
            switch(v_index){
                case 3:
                    const temp =[...this.state.CaseData_Description]
                    const src_connection =temp[index]
                    src_connection['source_db_connection_id']= e.target.value
                    this.setState({temp:src_connection})
                    break;
                case 4:
                    const temp_tar =[...this.state.CaseData_Description]
                    const tar_connection =temp_tar[index]
                    tar_connection['target_db_connection_id']= e.target.value
                    this.setState({temp_tar:tar_connection})
                    break;
                case 0:
                    const temp_src =[...this.state.CaseData_Description]
                    const src_connection_temp =temp_src[index]
                    src_connection_temp['source_db_connection_id']= ""
                    this.setState({temp_src:src_connection_temp})
                    break;
                  
          
            }
          }
        
          CheckNullorDuplicate = (DbType) =>{
            if ((DbType == ('duplicatecheck')) || (DbType == ('nullcheck'))){
                return true;
            }
            else{
              return false;
            }
            
          }
        
          renderExistingDBTypes = (ExistingDBlist,classes) =>{

            const test =  ExistingDBlist.map((item) =>{
                  return ( <MenuItem  value={item.db_connection_id}>
                  {item.db_connection_name} 
                  </MenuItem>)     
                  })
                  test.splice( 0,0,<MenuItem value="">
                  <em>None</em>
                </MenuItem>)
                  return test;
          }
          
            deleteRow = (index)=>{
                const temp =[...this.state.CaseData_Description]
                temp.splice(index,1)
                this.setState({CaseData_Description:temp,firstLoad:false})


              }
        /* upload clone suite data */
        handleSuiteClone = () =>{
            const temp_SuiteData=[]
            this.state.CaseData_Description.map((item,key)=>{
                const temp_obj = Object.assign(item)
                
                if(temp_obj['test_class']){
                temp_obj['test_case_class'] = temp_obj['test_class'] 
                delete(temp_obj['test_class'])
                }
                if(temp_obj['source_db_connection_id']){
                    temp_obj['source_db_existing_connection'] = temp_obj['source_db_connection_id'] 
                    delete(temp_obj['source_db_connection_id'])  
                }
                if(temp_obj['target_db_connection_id']){
                    temp_obj['target_db_existing_connection'] = temp_obj['target_db_connection_id'] 
                    delete(temp_obj['target_db_connection_id'])  
                }
                if(temp_obj['src_table']){
                    temp_obj['source_table'] = temp_obj['src_table'] 
                    delete(temp_obj['src_table'])  
                }
                if(temp_obj['src_query']){
                    temp_obj['source_query'] = temp_obj['src_query'] 
                    delete(temp_obj['src_query'])

                }
                if(temp_obj['column']){
                    temp_obj['columns'] = temp_obj['column'] 
                    delete(temp_obj['column'])  

                }
                if(!temp_obj['is_deleted']){
                    temp_SuiteData.push(temp_obj)
                }   
                if (temp_obj['test_case_id']){
                  delete(temp_obj['test_case_id'])
                }
                if (temp_obj['test_status']){
                  delete(temp_obj['test_status'])
                }
                if (temp_obj['case_id']){
                  delete(temp_obj['case_id'])
                }
                if (temp_obj['test_class_id']){
                  delete(temp_obj['test_class_id'])
                }
                temp_obj['source_db_existing_connection'] == "" ? delete(temp_obj['source_db_existing_connection']):temp_obj['source_db_existing_connection']
                temp_obj['target_db_existing_connection'] == "" ? delete(temp_obj['target_db_existing_connection']):temp_obj['target_db_existing_connection']         
               })
            const UploadBody = {}
            UploadBody.suite_name=this.state.suiteName
            UploadBody.project_id = this.props.currentProject.project_id
            UploadBody.test_case_detail = temp_SuiteData
            this.props.SubmitTestSuiteData(JSON.stringify(UploadBody))
        }
        SuiteNameValid (){
          return (this.state.suiteName == '')? true:false
          }
        renderData = (SuiteData,classes)=>{
            {
              const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
              if (!SuiteData[suite_id]) return null;  
              return this.state.CaseData_Description.map((eachrow,index) =>(
                <TableRow className="table-create-suite-row">
                  <Fragment>
                        {
                          <TableCell className="DropDown-SelectClass">
                            <Select
                              style={{width:'10vw'}}
                              value={eachrow.test_class}
                              onChange={(e)=>this.handleDBTypeChange(index,e) }> 
                              {this.showClass(this.props.classNameList,classes)}
                            </Select>
                          </TableCell>
                        }
                        {
                          <TableCell className={classes.tablecell}>
                            <TextField autoFocus={true}
                                    className={classes.textField}
                                    placeholder="description" value={eachrow.test_description}
                                    onChange={()=> this.handleChange(event,index,2) }/>
                          </TableCell>
                        }  
                        <TableCell>
                        <Select
                                style={{width:'10vw'}}
                                value={eachrow.source_db_connection_id}
                                disabled = {this.CheckNullorDuplicate(eachrow.test_class)}
                                onChange={ (e) => this.handleExistingDBTypeChange(index,e,3) }> 
                                {this.CheckNullorDuplicate(eachrow.test_class)} ? {this.renderExistingDBTypes(this.props.allConnections,classes)} : ""
                            </Select>
                        </TableCell>
        
                        <TableCell>
                          <Select
                            style={{width:'10vw'}}
                            value={eachrow.target_db_connection_id}
                            onChange={ (e) => this.handleExistingDBTypeChange(index,e,4) }> 
                            {this.renderExistingDBTypes(this.props.allConnections,classes)}
                          </Select>
                        </TableCell>
        
                        <TableCell  className={classes.tablecell}>
                                    <TextField autoFocus={true} 
                                    value={eachrow.src_table} 
                                    placeholder="source table"
                                    disabled = {this.CheckNullorDuplicate(eachrow.test_class)}
                                    error= { this.CheckNullorDuplicate(eachrow.test_class) ?(ISSPACE).test((eachrow.src_table).trim()):""}
                                    helperText={this.CheckNullorDuplicate(eachrow.test_class) ?(ISSPACE).test((eachrow.src_table).trim())?"Table cannot have space":"":""}
                                    onChange={()=> this.handleChange(event,index,5)}  />
                        </TableCell> 
                        <TableCell  className={classes.tablecell}>
                                    <TextField autoFocus={true} 
                                    value={eachrow.target_table} 
                                    placeholder="target table"
                                    error={this.CheckNullorDuplicate(eachrow.test_class) ?(ISSPACE).test((eachrow.target_table).trim()):""}
                                    helperText={this.CheckNullorDuplicate(eachrow.test_class)?(ISSPACE).test((eachrow.target_table).trim())?"Table cannot have space":"":""}
                                    onChange={()=> this.handleChange(event,index,6)}  />
                        </TableCell>  
                        <TableCell> 
                        <TextField autoFocus={true}  placeholder="column" value={eachrow.column}
                            onChange={()=> this.handleChange(event,index,7)} />  
                          
                        </TableCell>
                        <TableCell>
                            {eachrow.src_query?<BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,8)}}/>:
                            <IconButton disabled={this.CheckNullorDuplicate(eachrow.test_class)} >
                            <EditRounded  onClick={(e) => {this.showDialog(index,8)}}/>
                            </IconButton>} 
                        </TableCell> 
                        <TableCell>
                            {eachrow.target_query?<BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,9)}}/>:
                            <IconButton>
                            <EditRounded onClick={(e) => {this.showDialog(index,9)}}/>
                        </IconButton>} 

                        </TableCell>
                  
                        <TableCell className={classes.tablepopup}>
                        {this.showMinus()?
                                    
                                    <IconButton 
                                     onClick={() => this.deleteRow(index)}
                                     >
                                        <MinusCircle />
                                    </IconButton>
                                    :""
                                }
                        </TableCell>
                  </Fragment>
                </TableRow>
              
              
              ))
          }}
        
          showMinus = () =>{
            if ((this.state.CaseData_Description).length > 1){
                return true
            }
            else{
                return false
            }
          }
          handleSuiteNameChange = (e)=>{
            this.setState({suiteName:e.target.value})
        }
        addRow=()=>{
      
            const CaseData_Description_temp = this.state.CaseData_Description.map(l => Object.assign({}, l));
      
            CaseData_Description_temp.push({
              'test_class':"",
              'test_description':"",
              "source_db_connection_id":"",
              "target_db_connection_id":"",
              "src_table":"",
              "target_table":"",
              "column":"",
              "src_query":"",
              "target_query":""
            })
            this.setState({
              firstLoad:false,
              CaseData_Description:CaseData_Description_temp
          },()=>{
          })
        }
        ValidRows(){

            if (this.state.CaseData_Description){
                return this.state.CaseData_Description.every(this.ValidFields)
            }
          }
          ValidFields = (item) =>{
            if((item.test_class=='nullcheck') || (item.test_class=='duplicatecheck')){
              return  item.test_description &&  item.target_table &&  item.target_db_connection_id
          
            }else{
            return  item.test_description && item.src_table && item.target_table && item.source_db_connection_id && item.target_db_connection_id
          }
          }
          onYesBtnClickHandler = (child_data) => {
            this.setState({showQueryModal:child_data})
          }
          getConnectionData = (data) =>{
            switch(data.type){
                case "src":
                const temp =[...this.state.CaseData_Description]
                const src_connection  =temp[data.index]
                src_connection['src_query'] = data.query
                this.setState({temp:src_connection}) 
                break;
                case "target":
                const temp_tar = [...this.state.CaseData_Description]
                const target_connection = temp_tar[data.index]
                target_connection['target_query'] = data.query
                this.setState({temp_tar:target_connection})
                break;
                default:
                break;
            }
          }
          showDialog = (index,v_index) =>{
            switch(v_index){
                case 8:
                const temp_SuiteData= [...this.state.CaseData_Description]
                let ModalData_src = temp_SuiteData[index]
                ModalData_src['Query'] =this.state.CaseData_Description[index].src_query
                ModalData_src['type'] = "src"
                ModalData_src["index"] = index
                this.setState({showQueryModal:true,ModalData:ModalData_src})
                break;
                case 9:
                const temp_SuiteData_target= [...this.state.CaseData_Description]
                let ModalData_tar = temp_SuiteData_target[index]
                ModalData_tar['Query'] =this.state.CaseData_Description[index].target_query
                ModalData_tar['type'] = "target"
                ModalData_tar["index"] = index
                this.setState({showQueryModal:true,ModalData:ModalData_tar})
                break;
                default:
                break;
            }
          }
          checkNameAlreadyExist = (testSuites,displayName) => {
			let isNameAlreadyExist = false;
			for(let data of testSuites ){
				if(data.test_suite_name === displayName){
					isNameAlreadyExist = true;
					break;
				}
			}
			return isNameAlreadyExist;
		}
          render(){
            const checkValid = !this.ValidRows() ||  this.SuiteNameValid()
            const showAddBtn = !this.ValidRows()
            let testSuites = this.props.testSuites;
            this.isNameAlreadyExist = this.checkNameAlreadyExist(testSuites,this.state.suiteName);
    
                const { classes } = this.props;
                
                return(
                    <div className="AddSuiteLayout">
                        <i class="fa fa-th fa-lg" aria-hidden="true"></i>
                        <label className="db_page_title main_titles">Clone Suite</label><br/>
                        <span style={{display:'block'}}><TextField style={{width:"250px"}} 
                        error={this.isNameAlreadyExist}
                        helperText={this.isNameAlreadyExist?"Suite Name already Exists":""}
                        type="textbox" onChange={()=> this.handleSuiteNameChange(event) }
                        type="textbox"  placeholder="&nbsp;Enter SuiteName"/></span>
                        <span style={{display:'inline'}}><Link to="/view_suites"><Button className="button-create back-btn" bsStyle="primary"> Back</Button></Link></span>
                        <span style={{marginLeft:"5px",display:'inline'}}><Button className="button-create" bsStyle="primary"
                        disabled={checkValid}
                        onClick={ () => this.handleSuiteClone()}> Clone</Button></span>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead className={classes.tablehead}>
                                <TableRow>
                                    {this.showHeader(classes)}
                                </TableRow>
                                </TableHead>
                                <TableBody className="table_body-new-suite">
                                    {this.renderData(this.props.suiteData, classes)}
                                </TableBody>
                            </Table>
                        </Paper>
                        <div>
                                <IconButton
                                 disabled={showAddBtn}
                                 >
                                    <PlusCircle 
                                    onClick={() => this.addRow()}
                                    />
                                </IconButton>
                        </div>  
                        <div>
                            {
                                this.state.showQueryModal ?
                                <QueryModal
                                    QueryData =  {this.getConnectionData}
                                    onYesBtnClickHandler={ this.onYesBtnClickHandler}
                                    connectionDetail ={this.state.ModalData}>
                                </QueryModal>:null
                            }
                        </div>
                    </div>
                    
                )}
        

}

const mapStateToProps = (state) => {
    return {
          currentProject: state.appData.currentProject,
          suiteData: state.testSuites.connectionsList? state.testSuites.connectionsList.allCases: {},
          allCases: state.testSuites.testCase? state.testSuites.testCase: {},
          classNameList: state.dbDetailsData.classNameList?state.dbDetailsData.classNameList: [],
          allConnections : state.testSuites.connectionsList && 
            state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
           redirectToSuiteList: state.testSuiteUploadData.redirectToSuiteList,
          testSuites: state.testSuites.testSuiteList? state.testSuites.testSuiteList: [],
  
    };
  };

const mapDispatchToProps = dispatch => ({
    getTestCaseDetailBySuiteId : (suite_id,bool) => dispatch(getTestCaseDetailBySuiteId(suite_id,bool)),
    getallClassNames: () => dispatch(getallClassNames()),
    getAllConnections: (data) => dispatch(getAllConnections(data)),
    getAllTestSuites  : (data)=> dispatch(getAllTestSuites(data)),
    SubmitTestSuiteData: (data) =>dispatch(SubmitTestSuiteData(data)),
    });
export default connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles)(CloneTestSuite));