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
import Select from 'react-select';
import { TextField } from '@material-ui/core';
import { getallClassNames,SubmitTestSuiteData } from '../actions/dbDetailsActions';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

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
    }
  });

  const data = {'test_case_class':"",
  'test_description':"",
      "source_db_existing_connection":"",
    "target_db_existing_connection":"",
  "source_table":"",
  "target_table":"",
  "columns":"",
  "source_query":"",
  "target_query":""
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
            isTestClassSelected:true,
            suiteData : [
                data
            ],
            Connection:{}	
        };
    }
  

    componentDidMount(){
        this.props.getallClassNames()
        this.props.getAllConnections(this.props.currentProject.project_id)

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
        this.setState({suiteData:temp,isTestClassSelected:false})
    }
    deleteRow = (index)=>{
        const temp =[...this.state.suiteData]
        temp.splice(index,1)
        this.setState({suiteData:temp})

    }
    renderExistingDBTypes = () =>{
        const options = this.props.allConnections.map((item,key) => {
            return { value: item.db_connection_id, label:item.db_connection_name} ;
        });
        return options;
    }
    handleExistingDBTypeChange = (index,item,v_index) =>{
        console.log(index,item,v_index)
        switch(v_index){
            case 3:
            const temp =[...this.state.suiteData]
            const src_connection =temp[index]
            src_connection['source_db_existing_connection']= item.value
            this.setState({temp:src_connection})
            break;
            case 4:
            const temp_tar =[...this.state.suiteData]
            const tar_connection =temp_tar[index]
            tar_connection['target_db_existing_connection']= item.value
            this.setState({temp_tar:src_connection})
            break;
        }
        console.log(this.state)
    }

    showData = (val,index) =>{
        switch(index){
            case 2:
            return val?<div>{val}</div>:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break;
            case 5:
            return val?<div>{val}</div >:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break;
            case 6:
            return val?<div>{val}</div>:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break;
            case 7:
            return val?<div>{val}</div >:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break
            case 8:
            return val?<div>{val}</div>:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break;
            case 9:
            return val?<div>{val}</div>:<div style={{color:'#C6C6C6'}}>Type here...</div>
            break;
            default:
            break
        }
    }
    showMinus = () =>{
        console.log((this.state.suiteData).length)
        if ((this.state.suiteData).length !=1){
            return true
        }
    
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
                {this.splitAndMatch(index,2)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,2)}>{this.showData(eachrow.test_description,2)}</TableCell>:
                <TableCell className={classes.tablecell}><TextField autoFocus={true} disabled={this.state.isTestClassSelected} multiline={true}  value={eachrow.test_description} onChange={()=> this.handleChange(event,index,2) }/></TableCell>}              
                <TableCell ><Select 
                    theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
                    value={this.state.source_db_existing_connection}
                    onChange={ (item) => this.handleExistingDBTypeChange(index,item,3) }
                    options= { this.renderExistingDBTypes() }
                    /> </TableCell>

                <TableCell> <Select 
                    theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
                    value={this.state.target_db_existing_connection}
                    onChange={ (item) => this.handleExistingDBTypeChange(index,item,4) }
                    options= { this.renderExistingDBTypes() }/>
                </TableCell>        
                {this.splitAndMatch(index,5)?<TableCell className={classes.tablecell}  onClick= {() =>this.switchstate(index,5)}>{this.showData(eachrow.source_table,5)} </TableCell>:
                <TableCell  className={classes.tablecell}><TextField autoFocus={true} disabled={this.state.isTestClassSelected}  multiline={true} value={eachrow.source_table}  onChange={()=> this.handleChange(event,index,5)} style={{width:"10vw"}} /></TableCell>}   
                
                {this.splitAndMatch(index,6)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,6)}>{this.showData(eachrow.target_table,6)}</TableCell>:
                <TableCell className={classes.tablecell}><TextField autoFocus={true} disabled={this.state.isTestClassSelected} multiline={true} value={eachrow.target_table} onChange={()=> this.handleChange(event,index,6)} style={{width:"11vw"}} /></TableCell>}            
                
                {this.splitAndMatch(index,7)?<TableCell  className={classes.tablepopup} onClick= {() =>this.switchstate(index,7)}>{this.showData(eachrow.columns,7)}</TableCell>: 
                <TableCell className={classes.tablepopup}><TextField autoFocus={true} disabled={this.state.isTestClassSelected} multiline={true} value={eachrow.columns} onChange={()=> this.handleChange(event,index,7)} style={{width:"8vw"}}/></TableCell>}            
                
                {this.splitAndMatch(index,8)?<TableCell  className={classes.tablecell} onClick= {() =>this.switchstate(index,8)}>{this.showData(eachrow.source_query,8)}</TableCell>:
                <TableCell className={classes.tablecell}><TextField autoFocus={true} disabled={this.state.isTestClassSelected} multiline={true} value={eachrow.source_query} onChange={()=> this.handleChange(event,index,8)} style={{width:"11vw"}} /></TableCell>}            
                  
                {this.splitAndMatch(index,9)?<TableCell className={classes.tablecell}  onClick= {() =>this.switchstate(index,9)}>{this.showData(eachrow.target_query,9)}</TableCell>:
                <TableCell ><TextField autoFocus={true} disabled={this.state.isTestClassSelected} multiline={true} value={eachrow.target_query} onChange={()=> this.handleChange(event,index,9)} style={{width:"11vw"}} /></TableCell>}
                
            <TableCell className={classes.tablepopup}>{this.showMinus()?<IconButton size = "small"><i className='fas fa-minus-circle minusCircle minuscirclecolor' onClick={() => this.deleteRow(index)}></i></IconButton>:""}</TableCell>
              </TableRow>
              
            ))
        }
    }
   
    addRow (){
       this.setState({
          suiteData:[...this.state.suiteData,{'test_case_class':"",
          'test_description':"",
              "source_db_existing_connection":"",
            "target_db_existing_connection":"",
          "source_table":"",
          "target_table":"",
          "columns":"",
          "source_query":"",
          "target_query":""
          }] 
       },()=>{
       })
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
        return (item.test_description && item.source_table && item.target_table && (item.source_db_existing_connection) && (item.target_db_existing_connection))
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
        console.log(UploadBody)
        this.props.SubmitTestSuiteData(JSON.stringify(UploadBody))
    }

    render(){
       const checkValid = this.SuiteNameValid() ||  !this.ValidRows()
       const showAddBtn = !this.ValidRows()
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
							<TableCell className={classes.tablecell}><span className="mandatory">Test class</span></TableCell>
							<TableCell className={classes.tablecell}><span className="mandatory">Description</span> </TableCell>
							<TableCell className={classes.tablecell}><span className="mandatory">Source Connection</span> </TableCell>
							<TableCell className={classes.tablecell}><span className="mandatory">Target Connection</span> </TableCell>
                            <TableCell className={classes.tablecell}><span className="mandatory">Source Table</span> </TableCell>
                            <TableCell className={classes.tablecell}><span className="mandatory">Target Table</span> </TableCell>
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
                <div>
                <IconButton disabled={showAddBtn} size = "small"className={classes.minusbtn} >
                    <i className='fas fa-plus-circle plusCircle minuscirclecolor' onClick={() => this.addRow()}></i>
                    </IconButton>
            </div>  
            </div>
        )}}


const mapStateToProps = (state) => {
	return {
		classNameList: state.dbDetailsData.classNameList?state.dbDetailsData.classNameList: [],
        currentProject: state.appData.currentProject,
       
        redirectToSuiteList: state.testSuiteUploadData.redirectToSuiteList,
        testSuites: state.testSuites.testSuiteList? state.testSuites.testSuiteList: [],
        dbDetailsList: state.dbDetailsData.dbDetailsList?state.dbDetailsData.dbDetailsList: [],
        allConnections : state.testSuites.connectionsList && 
		state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],

	};
};
const mapDispatchToProps = dispatch => ({
    getallClassNames: () => dispatch(getallClassNames()),
    SubmitTestSuiteData: (data) =>dispatch(SubmitTestSuiteData(data)),
    getAllConnections: (data) => dispatch(getAllConnections(data)),
});
CreateSuite.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default  connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles) (CreateSuite));