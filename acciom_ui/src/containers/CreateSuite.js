import React, { Component } from 'react'
import { connect } from 'react-redux';
import '../css/Db-ui-styles.css';
import {Button} from 'react-bootstrap';
import { Panel, Table, Modal} from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { __esModule } from 'react-redux/lib/utils/reactBatchedUpdates';
import Dialog from '../components/Dialog';
 const useStyles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(4),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  });


export class CreateSuite extends Component {
    constructor(props) {
        super(props);
        //   const [open, setOpen] = React.useState(false);

		this.state = {
            isOpen:false,
            show_input:'a,b',
            suiteName:'',
            suiteData : [
                {'test_case_class':'Countcheck',
                'test_description':'Countcheck description',
                'source_db_connection':null,
                'target_db_connection':null,
                'source_details':{
                    "source_db_type":null,
	                "source_db_name":null,
                    "source_db_server":null,
                    "source_db_username":null,
                },
                'target_details':{
                    "target_db_type":null,
	                "target_db_name":null,
                    "target_db_server":null,
                    "target_db_username":null,
                },
                "source_table":"Customer_Account",
                "target_table":"Customer_Account",
                "columns":"null",
                "source_query":"select count(*) from Customer_Account",
                "target_query":"select count(*) from Customer_Account"
                }
            ]
			
		};
    }
  

    componentDidMount(){

    }
    switchstate =(index,v_index)=>{
        console.log(index,v_index)
        this.setState({show_input:index+','+v_index});

    }

    splitAndMatch = (index,vIndex) => {
        const selected = this.state.show_input.split(",");
        return !(selected[0] == index && selected[1] == vIndex); //selected (0,1) is equals to the current then true
    }

    handleChange = (e,index,col_event) =>{
        switch (col_event){
            case 1:
            const temp_SuiteData = [...this.state.suiteData]
            temp_SuiteData[index]['test_case_class'] = e.target.value;
            this.setState({suiteData:temp_SuiteData})
            break;
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
    
   


    renderData = () =>{
        {
            return this.state.suiteData.map((eachrow,index) =>(     
                <tr className="table-create-suite-row">
                {this.splitAndMatch(index,1)?<td  onClick= {() =>this.switchstate(index,1)}>{eachrow.test_case_class}</td>:
                <td><input type="text" value={eachrow.test_case_class} onChange={()=> this.handleChange(event,index,1) }/></td>}
                {this.splitAndMatch(index,2)?<td  onClick= {() =>this.switchstate(index,2)}>{eachrow.test_description}</td>:
                <td><textarea value={eachrow.test_description}  onChange={()=> this.handleChange(event,index,2) }/></td>}              
                <td  onClick={(e) => this.setState({ isOpen: true })}><LaunchIcon/></td>
                <td onClick= {() =>this.switchstate(index,4)}><LaunchIcon/></td>
                {this.splitAndMatch(index,5)?<td  onClick= {() =>this.switchstate(index,5)}>{eachrow.source_table}</td>:
                <td><input value={eachrow.source_table}  onChange={()=> this.handleChange(event,index,5)} /></td>}   
                {this.splitAndMatch(index,6)?<td  onClick= {() =>this.switchstate(index,6)}>{eachrow.target_table}</td>:
                <td><input value={eachrow.target_table} onChange={()=> this.handleChange(event,index,6)} /></td>}            
                {this.splitAndMatch(index,7)?<td  onClick= {() =>this.switchstate(index,7)}>{eachrow.columns}</td>: 
                <td><textarea value={eachrow.columns} onChange={()=> this.handleChange(event,index,7)}/></td>}            
                {this.splitAndMatch(index,8)?<td  onClick= {() =>this.switchstate(index,8)}>{eachrow.source_query}</td>:
                <td><textarea value={eachrow.source_query} onChange={()=> this.handleChange(event,index,8)} /></td>}            
                {this.splitAndMatch(index,9)?<td  onClick= {() =>this.switchstate(index,9)}>{eachrow.target_query}</td>:
                <td><textarea value={eachrow.target_query} onChange={()=> this.handleChange(event,index,9)}/></td>}
              </tr>
              
            ))
        }
    }
    EditTestConnection(){
        console.log("open popup")
    }
    
    addRow (){
       this.setState({
          suiteData:[...this.state.suiteData,{'test_case_class':"Nullcheck",
          'test_description':"nullcheck",
          'source_db_connection':null,
          'target_db_connection':null,
          'source_details':{
              "source_db_type":null,
              "source_db_name":null,
              "source_db_server":null,
              "source_db_username":null,
          },
          'target_details':{
              "target_db_type":null,
              "target_db_name":null,
              "target_db_server":null,
              "target_db_username":null,
          },
          "source_table":"Customer_Account",
          "target_table":"Customer_Account",
          "columns":"null",
          "source_query":"null",
          "target_query":"null"
          }] 
       },()=>{
           console.log(this.state.suiteData)
       })
        console.log(this.state.suiteData)
    }

    render(){
        const {classes} = this.props;
        return(
            <div>
                <h3 className="usermanagetitle main_titles">Create Suite</h3>
                <input className="suite-txt" type="textbox" placeholder="&nbsp;Enter SuiteName"/>
				<Button className="button-create" bsStyle="primary" onClick={ (e) => handleTestSuiteUploadClick()}> Create Suite</Button>
             
                <Table responsive className="manage-db-table">
					<thead className="table_head_create_suite">
						<tr>
							<th>Test class</th>
							<th>Description</th>
							<th>Source Connection</th>
							<th>Target Connection</th>
                            <th>Source Table</th>
                            <th>Target Table</th>
                            <th>Columns</th>
                            <th>Source query</th>
                            <th>Target query</th>
						</tr>
					</thead>
					<tbody className="table_body-new-suite">
                    {this.renderData()}
					</tbody>
				</Table>
                <div><i className='fas fa-plus-circle plusCircle minuscirclecolor' onClick={() => this.addRow()}></i>
            </div>  

            <Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
        </Dialog>

            </div>
        )}}


// const mapStateToProps = (state) => {
	
// };
// const mapDispatchToProps = dispatch => ({
// });


export default withStyles(useStyles) (CreateSuite);