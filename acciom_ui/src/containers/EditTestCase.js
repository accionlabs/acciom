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



import { 
  getTestCaseDetailBySuiteId,
  getTestCaseByTestCaseId, 

} from '../actions/testSuiteListActions';
import { array } from 'prop-types';
import { typography } from '@material-ui/system';

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
    ]
			
		};
    }
    componentDidMount () {
		const suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
        console.log(suite_id)
        this.props.getTestCaseDetailBySuiteId(suite_id,false)
        console.log("state",this.state)



  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    const s_id = nextProps.match.params.suite_id
    console.log(s_id)
    
    console.log("116",nextProps.match.params.suite_id)
    console.log("116",nextProps.suiteData[s_id])
    const arr_temp = nextProps.suiteData[s_id]
    console.log(arr_temp[0])


    // this.props.getTestCaseByTestCaseId(this.state.CaseData_Description[0]['case_id']) 
    if(prevState.suiteData!== nextProps.suiteData){

			return {
				...prevState,
        CaseData_Description: nextProps.suiteData,
        CaseData:nextProps.suiteData[nextProps.match.params.suite_id]
				};
    }

    if(prevState.allCases !==nextProps.allCases){
			return {
				...prevState,
				CaseData: nextProps.allCases.testCaseDetails
				};
    }
  }

  some_func = (data) =>{
    console.log(data)
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
  
  
  renderData = (SuiteData,classes)=>{
    {
      console.log("141",this.state)

      const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
      if (!SuiteData[suite_id]) return null;
      // this.AddData(SuiteData[suite_id])
      
      return this.state.CaseData.map(eachrow =>(
        <TableRow className="table-create-suite-row">

                <TableCell>{eachrow.test_class_name}</TableCell>
                <TableCell>{eachrow.case_name}</TableCell>
                <TableCell> </TableCell>
                <TableCell  > <Select/></TableCell>
                <TableCell  > </TableCell>
                <TableCell  ></TableCell>
                <TableCell>  </TableCell>
                <TableCell  ></TableCell> 
                <TableCell  ></TableCell>
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
        allCases: state.testSuites.testCase? state.testSuites.testCase: {}
     };
};

const mapDispatchToProps = dispatch => ({
getTestCaseDetailBySuiteId : (suite_id,bool) => dispatch(getTestCaseDetailBySuiteId(suite_id,bool)),
getTestCaseByTestCaseId:(case_id) =>dispatch(getTestCaseByTestCaseId(case_id))
});

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles)(EditTestCase));
