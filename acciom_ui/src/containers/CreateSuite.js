    import React, { Component } from 'react'
    import { connect } from 'react-redux';
    import '../css/Db-ui-styles.css';
    import Button from '@material-ui/core/Button';
    import { Link } from 'react-router-dom';
    import { withStyles } from '@material-ui/core/styles';
    import PropTypes from 'prop-types';
    import Table from '@material-ui/core/Table';
    import TableBody from '@material-ui/core/TableBody';
    import TableCell from '@material-ui/core/TableCell';
    import TableHead from '@material-ui/core/TableHead';
    import TableRow from '@material-ui/core/TableRow';
    import Paper from '@material-ui/core/Paper';
    import { TextField } from '@material-ui/core';
    import IconButton from '@material-ui/core/IconButton';
    import PlusCircle from '@material-ui/icons/AddCircle';
    import MinusCircle from '@material-ui/icons/RemoveCircle';
    import EditRounded from '@material-ui/icons/EditRounded';
    import MenuItem from '@material-ui/core/MenuItem';
    import Select from '@material-ui/core/Select';
    import { ISSPACE } from '../constants/FieldNameConstants';
    import QueryModal from '../components/QueryModal';
    import BorderColorRoundedIcon from '@material-ui/icons/BorderColorRounded';
    import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

    import { getallClassNames,SubmitTestSuiteData } from '../actions/dbDetailsActions';
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

    const data = {'test_case_class':"",
                    'test_description':"",
                    "source_db_existing_connection":"",
                    "target_db_existing_connection":"",
                    "source_table":"",
                    "target_table":"","columns":"",
                    "source_query":"","target_query":""
                    }

    export class CreateSuite extends Component {
        constructor(props) {
            super(props);
            this.state = {
                
                suiteData : [{
                    ...data
                }],
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
                ]	,suitename:'',
                showQueryModal:false,
                suiteName:'',
                selectedDBType:1,
                isTestClassSelected:true,
            };
            this.onYesBtnClickHandler = this.onYesBtnClickHandler.bind(this)
            this.getConnectionData = this.getConnectionData.bind(this)
            this.baseState = this.state 

        }
        componentDidMount = () =>{
            this.props.getallClassNames()
            this.props.getAllConnections(this.props.currentProject.project_id)  
            this.props.getAllTestSuites(this.props.currentProject.project_id)
        }
        
        static getDerivedStateFromProps = (nextProps, prevState) => {
            let newState = prevState;
            if (nextProps.redirectToSuiteList) {

                nextProps.history.push('/startup');
                
            } 
            if (nextProps.refreshDBDetails){
                nextprops.getAllConnections(this.props.currentProject.project_id)
            }
            return newState;
        }
        getConnectionData = (data) =>{
            switch(data.type){
                case "src":
                const temp =[...this.state.suiteData]
                const src_connection  =temp[data.index]
                src_connection['source_query'] = data.query
                this.setState({temp:src_connection}) 
                break;
                case "target":
                const temp_tar = [...this.state.suiteData]
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

        handleChange = (e,index,col_event,reset=false) =>{
            switch (col_event){
                
                case 2:
                    const temp_SuiteData_desc = [...this.state.suiteData]
                    temp_SuiteData_desc[index]['test_description'] = e.target.value;
                    this.setState({suiteData:temp_SuiteData_desc})
                    break;
                case 5:
                    const temp_SuiteData_table = [...this.state.suiteData]
                    temp_SuiteData_table[index]['source_table'] = reset ? "":e.target.value;
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
                    temp_SuiteData_table_src_qry[index]['source_query'] = reset ? "":e.target.value;;;
                    this.setState({suiteData:temp_SuiteData_table_src_qry})
                    break;
                case 9:
                    const temp_SuiteData_table_tar_qry = [...this.state.suiteData]
                    temp_SuiteData_table_tar_qry[index]['target_query'] = e.target.value;
                    this.setState({suiteData:temp_SuiteData_table_tar_qry})
                default:

            }
        }
        handleDBTypeChange = (index,e)=>{

            if ((e.target.value == ('duplicatecheck')) || (e.target.value == ('nullcheck'))){
                this.handleExistingDBTypeChange(index,e,0)
                this.handleChange(e,index,5,true)
                this.handleChange(e,index,8,true)

            }

            const temp =[...this.state.suiteData]
            temp[index]['test_case_class'] = e.target.value
            this.setState({suiteData:temp,isTestClassSelected:false})
        }
        deleteRow = (index)=>{
            const temp =[...this.state.suiteData]
            temp.splice(index,1)
            this.setState({suiteData:temp})
        }
        renderExistingDBTypes = (ExistingDBlist,classes) =>{

            const test =  ExistingDBlist.map((item) =>{
                return ( <MenuItem  value={item.db_connection_id}>
                {item.db_connection_name} 
                </MenuItem>)     
                })
                return test;
        }
        handleExistingDBTypeChange = (index,e,v_index) =>{
            switch(v_index){
                case 3:
                    const temp =[...this.state.suiteData]
                    const src_connection =temp[index]
                    src_connection['source_db_existing_connection']= e.target.value
                    this.setState({temp:src_connection})
                    break;
                case 4:
                    const temp_tar =[...this.state.suiteData]
                    const tar_connection =temp_tar[index]
                    tar_connection['target_db_existing_connection']= e.target.value
                    this.setState({temp_tar:tar_connection})
                    break;
                    case 0:
                const temp_src =[...this.state.suiteData]
                const src_connection_temp =temp_src[index]
                src_connection_temp['source_db_existing_connection']= ""
                this.setState({temp_src:src_connection_temp})
                break;
            }
        }

        showData = (val,index) =>{
            switch(index){
                case 8:
                    return val?<div>{val}</div>:<div>Type here...</div>
                    break;
                case 9:
                    return val?<div>{val}</div>:<div>Type here...</div>
                    break;
                default:
                break
            }
        }
        showMinus = () =>{
            if ((this.state.suiteData).length !=1){
                return true
            }
        }
        showDialog = (index,v_index) =>{
            switch(v_index){
                case 8:
                const temp_SuiteData= [...this.state.suiteData]
                let ModalData_src = temp_SuiteData[index]
                ModalData_src['Query'] =this.state.suiteData[index].source_query
                ModalData_src['type'] = "src"
                ModalData_src["index"] = index
                this.setState({showQueryModal:true,ModalData:ModalData_src})
                break;
                case 9:
                const temp_SuiteData_target= [...this.state.suiteData]
                let ModalData_tar = temp_SuiteData_target[index]
                ModalData_tar['Query'] =this.state.suiteData[index].target_query
                ModalData_tar['type'] = "target"
                ModalData_tar["index"] = index
                this.setState({showQueryModal:true,ModalData:ModalData_tar})
                break;
                default:
                break;
            }
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
        
        renderData = (classes) =>{
            {
                return this.state.suiteData.map((eachrow,index) =>(  
                    <TableRow className="table-create-suite-row">
                        {
                        <TableCell className="DropDown-SelectClass">
                               
                        <Select
                            style={{width:'10vw'}}
                            value={this.state.suiteData[index]['test_case_class']}
                            onChange={(e)=>this.handleDBTypeChange(index,e) }> 
                            {this.showClass(this.props.classNameList,classes)}
                        </Select>
                        </TableCell>
                        }
                        {
                        <TableCell className={classes.tablecell}>
                            <TextField autoFocus={true}
                            className={classes.textField}
                            disabled={!this.state.suiteData[index]['test_case_class']}

                             placeholder="description" value={eachrow.test_description}
                            onChange={()=> this.handleChange(event,index,2) }/>
                        </TableCell>}              
                        <TableCell >
                                       
                        <Select
                        disabled = {this.CheckNullorDuplicate(eachrow.test_case_class) || !this.state.suiteData[index]['test_case_class']}
                        style={{width:'10vw'}}
                        value={this.state.suiteData[index]['source_db_existing_connection']}
                        onChange={ (e) => this.handleExistingDBTypeChange(index,e,3) }> 
                        {this.renderExistingDBTypes(this.props.allConnections,classes)}
                    </Select>
                        </TableCell>
                        <TableCell>
                           
                            <Select
                            disabled={!this.state.suiteData[index]['test_case_class']}

                             style={{width:'10vw'}}
                        value={this.state.suiteData[index]['target_db_existing_connection']}
                        onChange={ (e) => this.handleExistingDBTypeChange(index,e,4) }> 
                        {this.renderExistingDBTypes(this.props.allConnections,classes)}
                    </Select>
                        </TableCell>        
                        
  
                        <TableCell  className={classes.tablecell}>
                            <TextField autoFocus={true} 
                        disabled = {this.CheckNullorDuplicate(eachrow.test_case_class) || !this.state.suiteData[index]['test_case_class']}
                        value={eachrow.source_table} 
                            placeholder="source table"
                            error={(ISSPACE).test((eachrow.source_table).trim())}
                            helperText={(ISSPACE).test((eachrow.source_table).trim())?"Table cannot have space":""}
                            onChange={()=> this.handleChange(event,index,5)}  />
                        </TableCell>  
                        
                        
                        <TableCell className={classes.tablecell}>
                            <TextField autoFocus={true}
                            error={(ISSPACE).test((eachrow.target_table).trim())}
                            placeholder="target table"
                            disabled={!this.state.suiteData[index]['test_case_class']}
                            helperText={(ISSPACE).test((eachrow.target_table).trim())?"Table cannot have space":""}
                              value={eachrow.target_table}
                            onChange={()=> this.handleChange(event,index,6)}  />
                        </TableCell>
                        <TableCell className={classes.tablecell}>
                            <TextField autoFocus={true}  placeholder="column" value={eachrow.columns}
                            disabled={!this.state.suiteData[index]['test_case_class']}
                            onChange={()=> this.handleChange(event,index,7)} />
                        </TableCell>           
                        
                        
                        <TableCell className={classes.tablecell}>
                        {eachrow.source_query?
                        <IconButton>
                        <BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,8)}}/>
                        </IconButton>:
                        <IconButton disabled={this.CheckNullorDuplicate(eachrow.test_case_class)} >
                        <EditRounded onClick={(e) => {this.showDialog(index,8)}}/>
                        </IconButton>
                        } 
                        
                        </TableCell>           
                        
                        <TableCell className={classes.tablecell}>
                        {eachrow.target_query?
                        <IconButton>
                        <BorderColorRoundedIcon onClick={(e) => {this.showDialog(index,9)}}/></IconButton>:
                        <IconButton>
                        <EditRounded onClick={(e) => {this.showDialog(index,9)}}/>
                        </IconButton>} 
                          </TableCell>
                        
                        <TableCell className={classes.tablepopup}>
                            {this.showMinus()?
                            
                                <IconButton  onClick={() => this.deleteRow(index)}>
                                    <MinusCircle />
                                </IconButton>
                                :""
                            }
                        </TableCell>
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
            return stateData.every(this.ValidFields)
        }
        ValidFields = (item) =>{
            if((item.test_case_class=='nullcheck') || (item.test_case_class=='duplicatecheck')){
                return  item.test_description &&  item.target_table &&  item.target_db_existing_connection
            }else{ 
            return (item.test_description && item.source_table && item.target_table && (item.source_db_existing_connection) && (item.target_db_existing_connection))
            }
        }
        ValidTable(){
            const stateData = [...this.state.suiteData]
            return stateData.some(this.checkValidTable)
        }
        checkValidTable = (item) =>{
            return (((ISSPACE).test(item.source_table)) || ((ISSPACE).test(item.target_table)) )
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
        showHeader = (classes) =>{
            let test =[];
            test=this.state.Headers.map((item,key)=>{
            return(
            !item.required?<TableCell className={classes.tablecell}>{item.label}</TableCell>:
            <TableCell className={classes.tablecell}>{item.label}<span className="mandatory">*</span></TableCell>
            )})
            return test
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
        const checkValid = this.SuiteNameValid() ||  !this.ValidRows() || this.ValidTable()
        const showAddBtn = !this.ValidRows()
        let testSuites = this.props.testSuites;
        this.isNameAlreadyExist = this.checkNameAlreadyExist(testSuites,this.state.suiteName);

            const { classes } = this.props;
            
            return(
                <div className="AddSuiteLayout">
                    {/* <i class="fa fa-th fa-lg" aria-hidden="true"></i> */}
                    <PlaylistAddIcon className="createSuite" />
                    <label className="db_page_title main_titles">Create Suite</label><br/>
                    <span style={{display:'block'}}><TextField style={{width:"250px"}} 
                    error={this.isNameAlreadyExist}
                    helperText={this.isNameAlreadyExist?"Suite Name already Exists":""}
                    type="textbox" onChange={()=> this.handleSuiteNameChange(event) } placeholder="&nbsp;Enter SuiteName"/></span>
                    <span style={{display:'inline'}}><Link to="/view_suites"><Button className="button-create backbutton_colors" variant="contained"> Back</Button></Link></span>
                    <span style={{marginLeft:"5px",display:'inline'}}><Button className="createButton-create button-colors" variant="contained" disabled={checkValid} onClick={ () => this.handleTestSuiteUploadClick()}> Create Suite</Button></span>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead className={classes.tablehead}>
                            <TableRow>
                                {this.showHeader(classes)}
                            </TableRow>
                            </TableHead>
                            <TableBody className="table_body-new-suite">
                                {this.renderData( classes )}
                            </TableBody>
                        </Table>
                    </Paper>
                    <div>
                            <IconButton disabled={showAddBtn} onClick={() => this.addRow()} >
                                <PlusCircle  />
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
            testSuites: state.testSuites.testSuiteList? state.testSuites.testSuiteList: [],

        };
    };
    const mapDispatchToProps = dispatch => ({
        getallClassNames: () => dispatch(getallClassNames()),
        SubmitTestSuiteData: (data) =>dispatch(SubmitTestSuiteData(data)),
        getAllConnections: (data) => dispatch(getAllConnections(data)),
        getAllTestSuites  : (data)=> dispatch(getAllTestSuites(data)),

    });
    CreateSuite.propTypes = {
        classes: PropTypes.object.isRequired,
    };

    export default  connect(mapStateToProps, mapDispatchToProps)( withStyles(useStyles) (CreateSuite));