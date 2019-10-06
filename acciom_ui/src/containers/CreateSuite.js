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
        
		this.state = {
            suiteName:'',
            suiteData : [
                {'test_case_class':'Countcheck',
                'test_description':'Countcheck',
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
                }
            ]
			
		};
    }
  

    componentDidMount(){
        // console.log(this.state.suiteData)

    }
    renderData = () =>{
        {
            
            return this.state.suiteData.map(eachrow =>(
                <tr className="table-create-suite-row">
                <td>{eachrow.test_case_class}</td>
                <td>{eachrow.test_description}</td>
                <td ><LaunchIcon/></td>
                <td  ><LaunchIcon/></td>
                <td  > {eachrow.test_description}</td>
                <td  >{eachrow.test_description}</td>
                <td  >{eachrow.test_description}</td>
                <td  >{eachrow.test_description}</td> 
                <td  >{eachrow.test_description}</td>
              </tr>
              
            ))
        }
    }
    addRow (){
        console.log("add row")
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
					<tbody className="table_body">
                    {this.renderData()}
					</tbody>
				</Table>
    <div><i className='fas fa-plus-circle plusCircle minuscirclecolor' onClick={() => this.addRow()}></i>
</div>   

            </div>
        )
    }

}


// const mapStateToProps = (state) => {
	
// };
// const mapDispatchToProps = dispatch => ({
// });


export default withStyles(useStyles) (CreateSuite);