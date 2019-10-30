import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
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

import { 
  getTestCaseDetailBySuiteId,
  getTestCaseByTestCaseId, 

} from '../actions/testSuiteListActions';
import { getallClassNames,SubmitTestSuiteData } from '../actions/dbDetailsActions';


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
      CaseData_Description:[],
      CaseData:[],
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

			
		};
    }
    componentDidMount () {
    const suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;

        console.log(suite_id)
        this.props.getTestCaseDetailBySuiteId(suite_id,false)
        this.props.getallClassNames()

  }
  static getDerivedStateFromProps = (nextProps, prevState) => {

    if(prevState.suiteData!== nextProps.suiteData){
      const sid = parseInt(nextProps.match.params['suite_id'])
      console.log(sid)
			return {
				...prevState,
        CaseData_Description: nextProps.suiteData[sid],
				};
    }
  }

  handleChange = (e,index,col_event) =>{
    switch (col_event){
        
        case 2:
            const temp_SuiteData_desc = [...this.state.CaseData_Description]
            temp_SuiteData_desc[index]['case_name'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_desc})
            break;
        case 5:
            const temp_SuiteData_table = [...this.state.CaseData_Description]
            temp_SuiteData_table[index]['src_table'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_table})
            break;
        case 6:
            const temp_SuiteData_table_tar = [...this.state.CaseData_Description]
            temp_SuiteData_table_tar[index]['target_table'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_table_tar})
            break;
        case 7:
            const temp_SuiteData_table_col = [...this.state.suiteData]
            temp_SuiteData_table_col[index]['columns'] = e.target.value;
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
          temp_suite_obj['test_description'] = eachrow.case_name
          description_Arr.push(temp_suite_obj)
        });

        this.setState({SuiteData:description_Arr})
  }
  showClass = (classNameList,classes) =>{
    console.log(classNameList)
    const test =  classNameList.map((item) =>{
    const key = Object.keys(item)[0][0]
      return ( <MenuItem value={item[key]['supported_test_class']}>
      {item[key]['supported_test_class_display_name']} 
      </MenuItem>)
             
      })
      return test  
  }
  handleDBTypeChange = (index,e)=>{
    console.log(index,e)
    const temp =[...this.state.CaseData_Description]
    temp[index]['test_class_name'] = e.target.value
    this.setState({CaseData_Description:temp})
}
  
  renderData = (SuiteData,classes)=>{
    {
      console.log("141",this.state)

      const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
      if (!SuiteData[suite_id]) return null;      
      return this.state.CaseData_Description.map((eachrow,index) =>(
        <TableRow className="table-create-suite-row">
                {
                  <TableCell className="DropDown-SelectClass">
                    <Select
                      style={{width:'10vw'}}
                      value="countcheck"
                      onChange={(e)=>this.handleDBTypeChange(index,e) }> 
                      {this.showClass(this.props.classNameList,classes)}
                    </Select>
                  </TableCell>
                }
                {
                        <TableCell className={classes.tablecell}>
                            <TextField autoFocus={true}
                            className={classes.textField}
                             placeholder="description" value={eachrow.case_name}
                            onChange={()=> this.handleChange(event,index,2) }/>
                        </TableCell>
                }  
                <TableCell></TableCell>
                <TableCell> </TableCell>
                {/* drop downs */}
                <TableCell  className={classes.tablecell}>
                            <TextField autoFocus={true} 
                             value={eachrow.src_table} 
                            placeholder="source table"
                            error={(ISSPACE).test((eachrow.src_table).trim())}
                            helperText={(ISSPACE).test((eachrow.src_table).trim())?"Table cannot have space":""}
                            onChange={()=> this.handleChange(event,index,5)}  />
                </TableCell> 
                <TableCell  className={classes.tablecell}>
                            <TextField autoFocus={true} 
                             value={eachrow.target_table} 
                            placeholder="source table"
                            error={(ISSPACE).test((eachrow.target_table).trim())}
                            helperText={(ISSPACE).test((eachrow.target_table).trim())?"Table cannot have space":""}
                            onChange={()=> this.handleChange(event,index,6)}  />
                </TableCell>  
                <TableCell>  </TableCell>
                <TableCell  >{eachrow.src_query}</TableCell> 
                <TableCell  >{eachrow.target_query}</TableCell>
              </TableRow>
      
      
      ))
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
    render() {
      const { classes } = this.props;
        return (
            <div>
                <h2 className="main_titles">EditTestCase :  </h2>
                {/* <Button className="button-colors" bsStyle="primary"><div className="create-suite"> Clone</div></Button> */}
              <Button className="button-colors" bsStyle="primary"> <div className="create-suite">Clone</div></Button>
              <Button className="button-colors savebtn" bsStyle="primary"> <div className="create-suite">Save</div></Button>
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
                </div>
        )
    }
}
const mapStateToProps = (state) => {
  return {
        suiteData: state.testSuites.connectionsList? state.testSuites.connectionsList.allCases: {},
        allCases: state.testSuites.testCase? state.testSuites.testCase: {},
        classNameList: state.dbDetailsData.classNameList?state.dbDetailsData.classNameList: [],

     };
};

const mapDispatchToProps = dispatch => ({
getTestCaseDetailBySuiteId : (suite_id,bool) => dispatch(getTestCaseDetailBySuiteId(suite_id,bool)),
getTestCaseByTestCaseId:(case_id) =>dispatch(getTestCaseByTestCaseId(case_id)),
getallClassNames: () => dispatch(getallClassNames()),

});

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles)(EditTestCase));
