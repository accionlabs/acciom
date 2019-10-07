import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import '../css/Db-ui-styles.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';

import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';

import { 
	getTestCaseDetailBySuiteId,
} from '../actions/testSuiteListActions';



export class EditTestCase extends Component {
    constructor (props) {
		super(props);
		this.state = {
			
		};
    }
     useStyles = makeStyles(theme => ({
        root: {
          width: '100%',
          marginTop: theme.spacing(3),
          overflowX: 'auto',
        },
        table: {
          minWidth: 650,
        },
      }));

    componentDidMount () {
		const suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
        console.log(suite_id)
        this.props.getTestCaseDetailBySuiteId(suite_id,false)
         
  }
  
  renderData = (SuiteData)=>{
    {
      const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
      console.log(SuiteData[suite_id])
      if (!SuiteData[suite_id]) return null;
      return SuiteData[suite_id].map(eachrow =>(
        <tr className="table-create-suite-row">
                <td>{eachrow.case_id}  <Checkbox
        value="checkedC"
        inputProps={{
          'aria-label': 'uncontrolled-checkbox',
        }}
      /></td>
                <td>{eachrow.case_name}</td>
                <td ><LaunchIcon onClick={() => this.EditTestConnection()}/></td>
                <td  ><LaunchIcon/></td>
                <td  > {eachrow.source_table}</td>
                <td  >{eachrow.target_table}</td>
                <td  >{eachrow.test_description}</td>
                <td  >{eachrow.source_query}</td> 
                <td  >{eachrow.target_query}</td>
              </tr>
      ))
  }
  }
    

    render() {
        return (
            <div>
                <h2 className="main_titles">EditTestCase :  </h2>
                {/* <Button className="button-colors" bsStyle="primary"><div className="create-suite"> Clone</div></Button> */}
               <Button className="button-colors" bsStyle="primary"> <div className="create-suite">Clone</div></Button>
               <Button className="button-colors" bsStyle="primary"> <div className="create-suite">Create Suite</div></Button>

               <Button className="button-colors savebtn" bsStyle="primary"> <div className="create-suite">Save</div></Button>
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
                    {this.renderData(this.props.suiteData)}
					</tbody>
				</Table>
                </div>
        )
    }
}
const mapStateToProps = (state) => {
  return {
        suiteData: state.testSuites.connectionsList? state.testSuites.connectionsList.allCases: {}
     };
};

const mapDispatchToProps = dispatch => ({
getTestCaseDetailBySuiteId : (suite_id,bool) => dispatch(getTestCaseDetailBySuiteId(suite_id,bool))

});

export default connect(mapStateToProps, mapDispatchToProps)(EditTestCase);
