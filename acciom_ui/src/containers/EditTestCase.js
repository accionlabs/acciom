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
import { getallClassNames,SubmitTestCaseData } from '../actions/dbDetailsActions';


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


export class EditTestCase extends Component {
    constructor (props) {
		super(props);
		this.state = {
      firstLoad:true,
      CaseData_Description:[],
      CaseData:[],
      suite_id:null,
      showQueryModal:false,
      ModalData:{},
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
    if (nextProps.redirectToSuiteList) {
      nextProps.history.push('/startup'); 
  } 

    if(prevState.firstLoad && prevState.suiteData!== nextProps.suiteData){
      const sid = parseInt(nextProps.match.params['suite_id'])
			return {
        ...prevState,
        suite_id:sid,
        CaseData_Description: nextProps.suiteData[sid],
				};
    }
   
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
            temp_SuiteData_table_src_qry[index]['source_query'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_table_src_qry})
            break;
        case 9:
            const temp_SuiteData_table_tar_qry = [...this.state.suiteData]
            temp_SuiteData_table_tar_qry[index]['target_query'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_table_tar_qry})
        default:

    }
}


  AddData(SuiteData){
    const description_Arr=[]
    SuiteData.map((eachrow,key) =>{
          const temp_suite_obj={}
          temp_suite_obj['test_description'] = eachrow.test_description
          description_Arr.push(temp_suite_obj)
        });
    this.setState({SuiteData:description_Arr})
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
  CheckNullorDuplicate = (DbType) =>{
    if ((DbType == ('duplicatecheck')) || (DbType == ('nullcheck'))){
        return true;
    }
    else{
      return false;
    }
    
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
deleteRow = (index)=>{
  const temp =[...this.state.CaseData_Description]
  if(!temp[index]['case_id']){
    temp.splice(index,1)
  }
  else{
  temp[index]['is_deleted']=1
  }
  this.setState({CaseData_Description:temp})
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


onYesBtnClickHandler = (child_data) => {
  this.setState({showQueryModal:child_data})
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

  handleTestSuiteUploadClick = () =>{
    const TestCaseDataUpload={}
    const temp_SuiteData=[]
    TestCaseDataUpload.test_suite_id=this.state.suite_id
    this.state.CaseData_Description.map((item,key)=>{
      const temp_obj = Object.assign(item)
      temp_obj['source_db_connection_id'] == "" ? delete(temp_obj['source_db_connection_id']):temp_obj['source_db_connection_id']
      temp_SuiteData.push(temp_obj)
      
  })
    TestCaseDataUpload.test_case_detail=temp_SuiteData
    this.props.SubmitTestSuiteData(JSON.stringify(TestCaseDataUpload))
  }


  renderData = (SuiteData,classes)=>{
    {
      const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
      if (!SuiteData[suite_id]) return null;  
      return this.state.CaseData_Description.map((eachrow,index) =>(
        <TableRow className="table-create-suite-row">
          { !Boolean(eachrow.is_deleted) ?
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
                            error={(ISSPACE).test((eachrow.src_table).trim())}
                            helperText={(ISSPACE).test((eachrow.src_table).trim())?"Table cannot have space":""}
                            onChange={()=> this.handleChange(event,index,5)}  />
                </TableCell> 
                <TableCell  className={classes.tablecell}>
                            <TextField autoFocus={true} 
                            value={eachrow.target_table} 
                            placeholder="target table"
                            error={(ISSPACE).test((eachrow.target_table).trim())}
                            helperText={(ISSPACE).test((eachrow.target_table).trim())?"Table cannot have space":""}
                            onChange={()=> this.handleChange(event,index,6)}  />
                </TableCell>  
                <TableCell> 
                <TextField autoFocus={true}  placeholder="column" value={eachrow.column}
                    onChange={()=> this.handleChange(event,index,7)} />  
                  
                </TableCell>
                <TableCell>
                    {eachrow.src_query?<BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,8)}}/>:
                    <EditRounded onClick={(e) => {this.showDialog(index,8)}}/>} 
                </TableCell> 
                <TableCell  >

                  {eachrow.target_query?<BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,9)}}/>:
                  <EditRounded onClick={(e) => {this.showDialog(index,9)}}/>} 

                </TableCell>
          
                <TableCell className={classes.tablepopup}>
                {this.showMinus()?
                            
                            <IconButton  onClick={() => this.deleteRow(index)}>
                                <MinusCircle />
                            </IconButton>
                            :""
                        }
                </TableCell>
          </Fragment>:null
                      }
        </TableRow>
      
      
      ))
  }}
  showHeader = (classes) =>{
    let test =[];
    test=this.state.Headers.map((item,key)=>{
    return(
    !item.required?<TableCell className={classes.tablecell}>{item.label}</TableCell>:
    <TableCell className={classes.tablecell}>{item.label}<span className="mandatory">*</span></TableCell>
    )})
    return test
}
ValidRows(){

  if (this.state.CaseData_Description){
      return this.state.CaseData_Description.every(this.ValidFields)
  }
}
ValidFields = (item) =>{
  return  item.test_description && item.src_table && item.target_table && item.source_db_connection_id && item.target_db_connection_id
}
showMinus = () =>{
  if ((this.state.CaseData_Description).length !=1){
      return true
  }
}

    render() {

      const { classes } = this.props;
      const checkValid = !this.ValidRows()  
      const showAddBtn = !this.ValidRows()
      const DisableSrc= this.state.DisableSrc
        return (
            <div className="AddSuiteLayout">
                <i class="fa fa-th fa-lg" aria-hidden="true"></i>
                <label className="main_titles">EditTestCase:</label><br/>

              

                    <span style={{display:'inline'}}><Link to="/view_suites"><Button className="button-create back-btn" bsStyle="primary"> Back</Button></Link></span>
                    <span style={{marginLeft:"5px",display:'inline'}}><Button className="button-create" bsStyle="primary" 
                    onClick={ () => this.handleTestSuiteUploadClick()}
                    >Save</Button></span>
        <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead className={classes.tablehead}>
                            <TableRow>
                                {this.showHeader(classes)}
                            </TableRow>
                            </TableHead>
                            <TableBody className="table_body-new-suite">
                                {this.renderData(this.props.suiteData, classes )}
                            </TableBody>
                        </Table>
                    </Paper>
                    <div>
                    <IconButton 
                    onClick={() => this.addRow()} >
                                <PlusCircle  />
                            </IconButton>
                    </div> 
                    <div>
                        {
                            this.state.showQueryModal &&
                            <QueryModal
                                QueryData =  {this.getConnectionData}
                                onYesBtnClickHandler={ this.onYesBtnClickHandler}
                                connectionDetail ={this.state.ModalData}>
                            </QueryModal>
                        }
                    </div> 
                </div>
        )
    }
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

  };
};

const mapDispatchToProps = dispatch => ({
getTestCaseDetailBySuiteId : (suite_id,bool) => dispatch(getTestCaseDetailBySuiteId(suite_id,bool)),
getTestCaseByTestCaseId:(case_id) =>dispatch(getTestCaseByTestCaseId(case_id)),
getallClassNames: () => dispatch(getallClassNames()),
getAllConnections: (data) => dispatch(getAllConnections(data)),
SubmitTestSuiteData: (data) =>dispatch(SubmitTestCaseData(data)),
getAllTestSuites  : (data)=> dispatch(getAllTestSuites(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles)(EditTestCase));
