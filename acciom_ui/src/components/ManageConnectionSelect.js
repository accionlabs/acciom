import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { manageConnectionsCaseUpdate } from '../actions/testSuiteListActions';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(1),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '10px 26px 10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#80bdff',
			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
		},
	},
}))(InputBase);

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: theme.spacing(1),
	},
	MuiSelect: {minWidth:'160px'},
}));


function ManageConnectionSelect(props) {
	const classes = useStyles();

	const renderTestCases = (allCases) => {
		if (allCases) {
			return ( 
			<Fragment> 
				<div className="manageconnectionTestCase">
					<label className="form-check-label">
						<input
							type="checkbox"
							value="Select All"
							id="Select All"
							name="Select All"
							checked= {allCases.length === props.selectedCases.length}
							onChange={(e) => props.testCaseSelectAllToggle(allCases)}
						/>
					</label> Select All
				</div>
				{
				allCases.map(testCase => (
					<div key={testCase.case_id} className="manageconnectionTestCase">
						<label className="form-check-label">
							<input
								type="checkbox"
								value={testCase.case_id}
								name={testCase.case_name}
								checked={props.selectedCases.indexOf(testCase.case_id) > -1}
								onChange={(e) => props.onCaseSelectionChange(e.target)}
							/>
						</label> {testCase.case_name}
					</div>
				))
				}
			</Fragment>
			)
		}
	    return null;
	};
	return (
		<form className={classes.root} autoComplete="off">
			<Table className="manageSelectConnection">
				<tbody>
					<tr className="	">
						<td className="manageConnectionLabel changeconnpanelheadborder">
							<label className="manageConnectionHeading sub_title selectcaselabel">Select Connection</label>
						</td>
						<td className="changeconnpanelheadborder">
							<Select
								className="manageConnectionSelect"
								value={props.selectedConnection}
								onChange={props.onConnectionChange}
								name="selectConnection"
							>
								{props.allConnections.map(connection => (
									connection ?
										<MenuItem key={connection.db_connection_id} value={connection.db_connection_id}>{connection.db_connection_name}</MenuItem> : null
								))
								}
								
							</Select>
						</td>
					</tr> 
					<tr>
						<td className="manageConnectionLabel">
							<label className="manageConnectionHeading sub_title selectcaselabel2">Select Cases</label>
						</td>
						<td className="manageConnectionLabel">
							{
								renderTestCases(props.allCases[props.testSuiteId])
							}
						</td>
					</tr>
				</tbody>
			</Table>
		</form>
	);
}

const mapStateToProps = (state) => {
	return {
		allConnections : state.testSuites.connectionsList && 
		state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
		allCases : state.testSuites.connectionsList && 
		state.testSuites.connectionsList.allCases? state.testSuites.connectionsList.allCases : []
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		
		onManageConnectionsCaseUpdate: data => dispatch(manageConnectionsCaseUpdate(data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageConnectionSelect);