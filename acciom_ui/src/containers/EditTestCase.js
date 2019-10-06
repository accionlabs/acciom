import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import '../css/Db-ui-styles.css';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { 
  getTestCaseDetailBySuiteId,
  getAllConnections
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
  
      showdata = (SuiteData) =>{
      const	suite_id = (this.props.match && this.props.match.params) ? this.props.match.params.suite_id : null;
      console.log(SuiteData[suite_id])
      if (!SuiteData[suite_id]) return null;
      return SuiteData[suite_id].map(item =>(
        <TableRow  className="table_body"> 
        <TableCell>{item.case_id}</TableCell>
        <TableCell>{item.test_class_name}</TableCell>
        <TableCell>{item.class_name}</TableCell>
        <TableCell>{item.class_name}</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
            </TableRow>
      ))
     


  };
    render() {
        return (
          
            <div>
                <h2 className="main_titles">EditTestCase :  </h2>
               <Button className="button-colors" bsStyle="primary"> <div className="create-suite">Create Suite</div></Button>
               <Button className="button-colors" bsStyle="primary"> <div className="create-suite">Save</div></Button>
               <Paper >
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Select all</TableCell>
            <TableCell align="right">Test Class</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Source Connection</TableCell>
            <TableCell align="right">Target Connection</TableCell>
            <TableCell align="right">Source Table </TableCell>
            <TableCell align="right">Target Table </TableCell>
            <TableCell align="right">Column</TableCell>
            <TableCell align="right">Source Query</TableCell>
            <TableCell align="right">Target Query</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {this.showdata(this.props.suiteData)}
        </TableBody>
      </Table>
    </Paper>
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
