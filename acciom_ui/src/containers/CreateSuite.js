import React, { Component } from 'react'
import { connect } from 'react-redux';
import '../css/Db-ui-styles.css';
import {Button} from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';
import Select from 'react-select';
import { Input } from '@material-ui/core';
import { TextField } from '@material-ui/core';


import { getallClassNames,SubmitTestSuiteData } from '../actions/dbDetailsActions';

import RenderManageConnectionDialog from '../components/renderManageConnectionDialog';

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
    }
  });

  const data = {'test_case_class':null,
  'test_description':null,
      "source_db_existing_connection":"",
      "source_db_type":null,
      "source_db_name":null,
      "source_db_server":null,
      "source_db_username":null,
    "target_db_existing_connection":"",
      "target_db_type":null,
      "target_db_name":null,
      "target_db_server":null,
      "target_db_username":null,
  "source_table":"Customer_Account",
  "target_table":"Customer_Account",
  "columns":"null",
  "source_query":"select count(*) from Customer_Account",
  "target_query":"select count(*) from Customer_Account"
  }

export class CreateSuite extends Component {
    constructor(props) {
        super(props);
		this.state = {
            suitename:'',
            showManageConnectionPopUp:false,
            show_input:'a,b',
            suiteName:'',
            selectedDBType:1,
            suiteData : [
                data
            ],
            Connection:{}	
        };
        this.onYesBtnClickHandler = this.onYesBtnClickHandler.bind(this)
        this.getConnectionData = this.getConnectionData.bind(this)
    }
  

    componentDidMount(){
        this.props.getallClassNames()
    }
    static getDerivedStateFromProps = (nextProps, prevState) => {
        let newState = prevState;
        if (nextProps.redirectToSuiteList) {
			nextProps.history.push('/startup');
		} 
        return newState;
    }
    switchstate =(index,v_index)=>{
        this.setState({show_input:index+','+v_index});
    }
    splitAndMatch = (index,vIndex) => {
        const selected = this.state.show_input.split(",");
        return !(selected[0] == index && selected[1] == vIndex);
    }

    handleChange = (e,index,col_event) =>{
        switch (col_event){
            
            case 2:
            const temp_SuiteData_desc = [...this.state.suiteData]
            temp_SuiteData_desc[index]['test_description'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_desc})
            break;
            case 5:
            const temp_SuiteData_table = [...this.state.suiteData]
            temp_SuiteData_table[index]['source_table'] = e.target.value;
            this.setState({suiteData:temp_SuiteData_table})
            break;
            case 6:
            const temp_SuiteData_table_tar = [...this.state.suiteData]
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
            console.log("")

        }

    }
    showDialog = (index,v_index) =>{
        switch(v_index){
            case 3:
            const temp_SuiteData= [...this.state.suiteData]
            let Connection = temp_SuiteData[index]
            Connection['source_db_existing_connection'] = ''
            Connection['source_db_type'] = ''
            Connection['source_db_name'] = ''
            Connection['source_db_server'] = ''
            Connection['source_db_username'] = ''
            Connection['type'] = "src"
            Connection["index"] = index
            this.setState({showManageConnectionPopUp:true,Connection:Connection})
            break;
            case 4:
            const temp_SuiteData_target= [...this.state.suiteData]
            let Connection_target = temp_SuiteData_target[index]
            Connection_target['target_db_existing_connection'] = ''
            Connection_target['target_db_type'] = ''
            Connection_target['target_db_name'] = ''
            Connection_target['target_db_server'] = ''
            Connection_target['target_db_username'] = ''
            Connection_target['type'] = "target"
            Connection_target["index"] = index
            this.setState({showManageConnectionPopUp:true,Connection:Connection_target})
            break;
            default:
            break;
        }
    }
    hideConfirmationopup = (child_data) =>{
        this.setState({showManageConnectionPopUp:child_data})
    }
    onYesBtnClickHandler = (child_data) => {
        this.setState({showManageConnectionPopUp:child_data})
    }
    getConnectionData = (data) =>{
        switch(data.type){
            case "src":
            const temp =[...this.state.suiteData]
            const src_connection  =temp[data.index]
            src_connection['source_db_existing_connection'] = data.source_db_connection_id
            src_connection['source_db_type'] = data.source_db_type
            src_connection['source_db_name'] = data.source_db_name
            src_connection['source_db_server'] = data.source_db_server
            src_connection["source_db_username"] = data.source_db_username
            this.setState({temp:src_connection}) 
            case "target":
            const temp_tar = [...this.state.suiteData]
            const target_connection = temp_tar[data.index]
            target_connection['target_db_existing_connection'] = data.source_db_connection_id
            target_connection['target_db_type'] = data.source_db_type
            target_connection['target_db_name'] = data.source_db_name
            target_connection['target_db_server'] = data.source_db_server
            target_connection["target_db_username"] = data.source_db_username
            this.setState({temp_tar:target_connection})

        }
    }
    renderDBTypes = () =>{
        const options = this.props.classNameList.map((item) =>{
            const key = Object.keys(item)[0][0]
            return { value: item[key]['supported_test_class'], label: item[key]['supported_test_class_display_name']} ;
        })
		return options;
    }
    handleDBTypeChange = (item,index)=>{
        const temp =[...this.state.suiteData]
        temp[index]['test_case_class'] = item.value
        this.setState({suiteData:temp})
    }
    deleteRow = (index)=>{
        const temp =[...this.state.suiteData]
        temp.splice(index,1)
        this.setState({suiteData:temp})

    }
    renderData = (classes) =>{
        {
            return this.state.suiteData.map((eachrow,index) =>(  

                <TableRow className="table-create-suite-row">
                {
                    <TableCell className="DropDown-SelectClass">
                    <Select 
                    theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
                    value={this.state.test_case_class}
                    onChange={ (item) => this.handleDBTypeChange(item,index) }
                    options= { this.renderDBTypes() }
                    /></TableCell>
                }
                {this.splitAndMatch(index,2)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,2)}>{eachrow.test_description}</TableCell>:
                <TableCell className={classes.tablecell}><TextField  multiline={true}  value={eachrow.test_description} onChange={()=> this.handleChange(event,index,2) }/></TableCell>}              
                
                <TableCell  onClick={(e) => {this.showDialog(index,3)}} className={classes.tablepopup} style={{maxwidth:"6vw"}}><LaunchIcon/></TableCell>
                <TableCell onClick={(e) => {this.showDialog(index,4)}} className={classes.tablepopup} style={{maxwidth:"6vw"}}><LaunchIcon/></TableCell>
                
                {this.splitAndMatch(index,5)?<TableCell className={classes.tablecell}  onClick= {() =>this.switchstate(index,5)}>{eachrow.source_table}</TableCell>:
                <TableCell  className={classes.tablecell}><TextField   multiline={true} value={eachrow.source_table}  onChange={()=> this.handleChange(event,index,5)} style={{width:"10vw"}} /></TableCell>}   
                
                {this.splitAndMatch(index,6)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,6)}>{eachrow.target_table}</TableCell>:
                <TableCell className={classes.tablecell}><TextField  multiline={true} value={eachrow.target_table} onChange={()=> this.handleChange(event,index,6)} style={{width:"10vw"}} /></TableCell>}            
                
                {this.splitAndMatch(index,7)?<TableCell  className={classes.tablepopup} onClick= {() =>this.switchstate(index,7)}>{eachrow.columns}</TableCell>: 
                <TableCell className={classes.tablepopup}><TextField multiline={true} value={eachrow.columns} onChange={()=> this.handleChange(event,index,7)} style={{maxwidth:"8vw"}}/></TableCell>}            
                
                {this.splitAndMatch(index,8)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,8)}>{eachrow.source_query}</TableCell>:
                <TableCell className={classes.tablecell}><TextField multiline={true} value={eachrow.source_query} onChange={()=> this.handleChange(event,index,8)} style={{maxwidth:"10vw"}} /></TableCell>}            
                
                {this.splitAndMatch(index,9)?<TableCell className={classes.tablecell}  onClick= {() =>this.switchstate(index,9)}>{eachrow.target_query}</TableCell>:
                <TableCell ><TextField multiline={true} value={eachrow.target_query} onChange={()=> this.handleChange(event,index,9)} style={{width:"10vw"}} /></TableCell>}
                <TableCell className={classes.tablepopup}><i className='fas fa-minus-circle minusCircle minuscirclecolor' onClick={() => this.deleteRow(index)}></i></TableCell>
              </TableRow>
              
            ))
        }
    }
   
    addRow (){
       this.setState({
          suiteData:[...this.state.suiteData,{'test_case_class':null,
          'test_description':"",
              "source_db_existing_connection":"",
              "source_db_type":null,
              "source_db_name":null,
              "source_db_server":null,
              "source_db_username":null,
            "target_db_existing_connection":"",
              "target_db_type":null,
              "target_db_name":null,
              "target_db_server":null,
              "target_db_username":null,
          "source_table":"",
          "target_table":"Customer_Account",
          "columns":"null",
          "source_query":"select count(*) from Customer_Account",
          "target_query":"select count(*) from Customer_Account"
          }] 
       },()=>{
       })
       console.log(this.state)
    }
    handleSuiteNameChange = (e)=>{
        this.setState({suiteName:e.target.value})
    }
    SuiteNameValid (){
       return (this.state.suiteName == '')? true:false
    }
    ValidRows(){
        const stateData = [...this.state.suiteData]
        return stateData.some(this.ValidFields)
    }
    ValidFields = (item) =>{
        return (item.test_description && item.source_table && item.target_table && (item.source_db_existing_connection || item.source_db_type) && (item.target_db_existing_connection || item.target_db_type))
    }

    
    handleTestSuiteUploadClick = () =>{
        const temp_SuiteData=[]
        this.state.suiteData.map((item,key)=>{
            const temp_obj = Object.assign(item)
            temp_obj['source_db_existing_connection'] == "" ? delete(temp_obj['source_db_existing_connection']):temp_obj['source_db_existing_connection']
            temp_obj['target_db_existing_connection'] == "" ? delete(temp_obj['target_db_existing_connection']):temp_obj['target_db_existing_connection']
            delete(temp_obj.type)
            delete(temp_obj.index)
            temp_SuiteData.push(temp_obj)
            
        })
        const UploadBody = {}
            UploadBody.suite_name=this.state.suiteName
            UploadBody.project_id = this.props.currentProject.project_id
            UploadBody.test_case_detail = temp_SuiteData
       
        this.props.SubmitTestSuiteData(JSON.stringify(UploadBody))
    }

    render(){
       const checkValid = this.SuiteNameValid() ||  !this.ValidRows()
        const { classes } = this.props;
        return(
            <div>
                <h3 className="usermanagetitle main_titles">Create Suite</h3>
                <input className="suite-txt" type="textbox" onChange={()=> this.handleSuiteNameChange(event) } placeholder="&nbsp;Enter SuiteName"/>
				<Button className="button-create" bsStyle="primary" disabled={checkValid} onClick={ () => this.handleTestSuiteUploadClick()}> Create Suite</Button>
                <Paper className={classes.root}>
                <Table className={classes.table}>
                <TableHead className={classes.tablehead}>
                <TableRow>
							<TableCell className={classes.tablecell}>Test class</TableCell>
							<TableCell className={classes.tablecell}>Description </TableCell>
							<TableCell className={classes.tablecell}>Source Connection </TableCell>
							<TableCell className={classes.tablecell}>Target Connection </TableCell>
                            <TableCell className={classes.tablecell}>Source Table </TableCell>
                            <TableCell className={classes.tablecell}>Target Table </TableCell>
                            <TableCell className={classes.tablecell}>Columns </TableCell>
                            <TableCell className={classes.tablecell}>Source query </TableCell>
                            <TableCell className={classes.tablecell}>Target query </TableCell>
                            <TableCell className={classes.tablecell}>  </TableCell>

                </TableRow>
                </TableHead>
					<TableBody className="table_body-new-suite">
                    {this.renderData( classes )}
					</TableBody>
				</Table>
                </Paper>
                <div><i className='fas fa-plus-circle plusCircle minuscirclecolor'  onClick={() => this.addRow()}></i>
            </div>  

            { 
					this.state.showManageConnectionPopUp ?
                        <RenderManageConnectionDialog
                        connectionDetail ={this.state.Connection}
                         onYesBtnClickHandler={ this.onYesBtnClickHandler}
                         ConnectionData =  {this.getConnectionData}
                         currentProject={this.props.currentProject}
                         ></RenderManageConnectionDialog>
						: null
			}
            </div>
        )}}


const mapStateToProps = (state) => {
	return {
		classNameList: state.dbDetailsData.classNameList?state.dbDetailsData.classNameList: [],
        currentProject: state.appData.currentProject,
        redirectToSuiteList: state.testSuiteUploadData.redirectToSuiteList,
        testSuites: state.testSuites.testSuiteList? state.testSuites.testSuiteList: [],


	};
};
const mapDispatchToProps = dispatch => ({
    getallClassNames: () => dispatch(getallClassNames()),
    SubmitTestSuiteData: (data) =>dispatch(SubmitTestSuiteData(data))
});
CreateSuite.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default  connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles) (CreateSuite));