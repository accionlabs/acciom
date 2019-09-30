import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';

import { 
	ICON_STATUS_SUCCESS, 
	ICON_STATUS_FAIL, 
	ICON_STATUS_ERROR, 
	ICON_STATUS_INPROGRESS 
} from '../constants/icons';

import {
	COUNT_CHECK, NULL_CHECK, DUPLICATE_CHECK, DDL_CHECK, DATA_VALIDATION,
	NEW, PASS, FAIL, ERROR, INPROGRESS, INPROGRESS_ID, PASS_ID, FAIL_ID, ERROR_ID, NEW_ID
} from '../constants/common';

export const renderStatusLabel = (status) => {
	let labelColor = '';
	let  label = '';
	switch(status) {
	case INPROGRESS_ID:
	case INPROGRESS:
		labelColor = '#f3a563';
		label = 'In Progress';
		break;

	case PASS_ID:
	case PASS:	
		labelColor = 'green';
		label = 'Pass';
		break;

	case FAIL_ID:
	case FAIL:
		labelColor = 'red';
		label = 'Fail';
		break;

	case ERROR_ID:
	case ERROR:
		labelColor = 'red';
		label = 'Error';
		break;
	
	case NEW_ID:
	case NEW:
		labelColor = 'blue';
		label = 'New';
		break;

	default:
		break;
	}
	return <label style={{ color: labelColor }}>{label}</label>;
};

export const renderStatusIcon = (status) => {
	let iconClassName = '';
	switch(status) {
	case INPROGRESS:
	case INPROGRESS_ID:
		iconClassName = ICON_STATUS_INPROGRESS;
		break;
		// return <img alt={status} src={icon_new} />;

	case PASS:
	case PASS_ID:
		iconClassName = ICON_STATUS_SUCCESS;
		break;
	
	case FAIL:
	case FAIL_ID:
		iconClassName = ICON_STATUS_FAIL;
		break;

	case ERROR:
	case ERROR_ID:
		iconClassName = ICON_STATUS_ERROR;
		break;
	
	case NEW:
	case NEW_ID:
		return 'New';

	default:
	}

	return <i className={iconClassName} aria-hidden="true"></i>;
};

class CaseLogDetails extends React.Component {

	handleMessage = (status, name) => {
		let message = null;
		if (status === PASS) {
			if (name === COUNT_CHECK) {
				message = 'Source and Target Records Count Matches.';
			} else if (name === DUPLICATE_CHECK) {
				message = 'No Duplicate rows found in Target Table.';
			} else if (name === NULL_CHECK) {
				message = 'No Null values found in Target Table.';
			} else if (name === DDL_CHECK || name === DATA_VALIDATION) {
				message = 'Source and Target Schema are Same.';
			}
		} else {
			if (name === COUNT_CHECK) {
				message = 'Source and Target Records Count do not Match';
			} else if (name === DUPLICATE_CHECK) {
				message = 'Duplicates Found';
			} else if (name === NULL_CHECK) {
				message = 'Records found with Null value(s)';
			} else if (name === DDL_CHECK || name === DATA_VALIDATION) {
				message = "Source and Target Schema didn't Match";
			}
		}
		return message;
	};

	render() {
		
		return (
			<div>
				{ this.props.testCaseName == 'countcheck' ?
					// CountCheck
					<Table id="viewLogDetails">
						<tbody>
							<tr>
								<td className="testCaseLogLabel">
									<label className="main_titles countchecklabelfont testViewDataLabel">Log Details - {this.props.testCaseDisplayName} </label>
									
									<label className="countcheckstatuslabel">Status: </label>
									<label className="resultLog">
									&nbsp;{renderStatusLabel(this.props.TestCaseLogDetails.Execution_status)}
									</label>&nbsp;
									{ renderStatusIcon(this.props.TestCaseLogDetails.Execution_status) }
									{ this.props.TestCaseLogDetails.Execution_status === 'fail' &&
										<IconButton className="downloaddataicon">
											<GetAppIcon 
											
											/>
										</IconButton>
										}
								</td>
							</tr>
							<tr>
									{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span><label className="sub_title checkresultlabel testViewDataLabel">Result: </label>
									<label className="testViewDataLabel resultlabel2">
									{this.handleMessage(this.props.TestCaseLogDetails.Execution_status, this.props.testCaseName)} 
									</label></span>
									}
									</tr>
							<tr>
								{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
								<Table size="sm" className="executionLog executiontablelog">
									<tr className="executiontablebottomborder bgcolor borderpadding">
										<td className="testCaseLogLabel">
											<label className="testViewDataLabel">Source Table Execution</label>
										</td>
										<td className="testCaseLogLabel">
											<label className="testViewDataLabel">Target Table Execution</label>
										</td>
									</tr>
									<tr className="executiontablebottomborder bgcolorOdd countchecklineheight">
										<td className="testCaseLogLabel">
											{ this.props.TestCaseLogDetails.Execution_log ?
												<label className="testViewExecution countcheckmarginbottom">{this.props.TestCaseLogDetails.Execution_log['source_execution_log']}</label>
												:
												null
											}
										</td>
										<td className="testCaseLogLabel">
											{ this.props.TestCaseLogDetails.Execution_log ?
												<label className="testViewExecution countcheckmarginbottom">{this.props.TestCaseLogDetails.Execution_log['dest_execution_log']}</label>
												:
												null
											}
										</td>
									</tr>
								</Table></span>}
							</tr>
						</tbody>
					</Table>
					: 
					this.props.testCaseName == 'duplicatecheck' ?
						// DuplicateCheck
						<Table id="viewLogDetails">
							<tbody>
								<tr>
									<td className="testCaseLogLabel">
										<label className="main_titles countchecklabelfont testViewDataLabel">Log Details - {this.props.testCaseDisplayName} </label>
										<label className="statuslabel ">Status:&nbsp;</label>
										<label className="resultLog">
											{renderStatusLabel(this.props.TestCaseLogDetails.Execution_status)}
										</label>&nbsp;&nbsp;
										{ renderStatusIcon(this.props.TestCaseLogDetails.Execution_status) }
										{ this.props.TestCaseLogDetails.Execution_status === 'fail' &&
										<IconButton className="geticonmargins2">
											<GetAppIcon />
										</IconButton>
										}
									</td>									
								</tr>
								<tr>
									<label className="sub_title testViewDataLabel duplicatecheckstatuslabel">Result: </label>
										<label className="testViewDataLabel resultvaluelabel">
										&nbsp;&nbsp;{this.handleMessage(this.props.TestCaseLogDetails.Execution_status, this.props.testCaseName)} 
										</label>
									</tr>
								{ this.props.TestCaseLogDetails.Execution_status !== 'pass' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('dest_execution_log') && this.props.TestCaseLogDetails.Execution_log['dest_execution_log'].length > 0 ?
								<tr>
									<Table className="executiontablelog executionLog">
										{
											this.props.TestCaseLogDetails.Execution_log['dest_execution_log'].map((log, index) => (
											<tr className={index === 0 ? "testCaseLogLabel bgcolor borderpadding executiontablebottomborder" : (index%2 === 0 ? "bgcoloreven Duplicateline executiontablebottomborder" : "bgcolorOdd Duplicateline executiontablebottomborder")} nowrap>
												{log.map(details => (
													<td><label className={details === null ? "bgcolorNullmargin": "testViewDataLabel" } >{details === null ? 'NULL' : details}</label></td>
												))}
											</tr>
											))											
										}
									</Table>
									</tr>
								: null }
							</tbody>
						</Table>

						// NullCheck
						: this.props.testCaseName == 'nullcheck' ?
						<Table id="viewLogDetails" className="nullcheck">
							<tbody>
								<tr>
									<td className="testCaseLogLabel">
										<label className="main_titles loglabel">Log Details&nbsp;-&nbsp;</label>
										<label className="testViewDataLabel main_titles nullchecklabel">{this.props.testCaseDisplayName} </label>							
										<label className="statuslabel">Status:&nbsp; </label>
										<label className="resultLog">
											{renderStatusLabel(this.props.TestCaseLogDetails.Execution_status)}
										</label>&nbsp;&nbsp;
										{ renderStatusIcon(this.props.TestCaseLogDetails.Execution_status) }&nbsp;&nbsp;
										{ this.props.TestCaseLogDetails.Execution_status === 'fail' &&
										<IconButton className="geticonmargins">
											<GetAppIcon 
											
											/>
										</IconButton>
										}
									</td>
								</tr>
								<tr>
								<label className="testViewDataLabel resultlabel sub_title">Result:</label>
										<label className="testViewDataLabel resultlabel2">
										{this.props.TestCaseLogDetails.Execution_log.result} 
										</label>
								</tr>
								<tr>
								{this.props.TestCaseLogDetails.Execution_log['dest_log'] && <td className="testCaseLogMessage">
										<label className="tablenamelabel">Table:&nbsp;</label>
										<label className="table_namelabel">{this.props.TestCaseLogDetails.Execution_log.table_name}</label>
										<label className="top10label">Top 10 Null Records </label>
									</td>}
								</tr>
								{this.props.TestCaseLogDetails.Execution_status !== 'pass' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('dest_log') && this.props.TestCaseLogDetails.Execution_log['dest_log'].length > 0 ?
								<tr>
									<Table className="executionLog executiontablelog">
									{this.props.TestCaseLogDetails.Execution_log['dest_log'].map((log, index) => (
										<tr className="executiontablebottomborder">
											{log.map(details => (
												<td className={index === 0 ? "testCaseLogLabel bgcolor borderpadding" : (index%2 === 0 ? "testCaseLogLabel bgcoloreven" : "testCaseLogLabel bgcolorOdd")} nowrap>
													<label className={details === null ? "testViewDataLabel bgcolorNull" : "testViewDataLabel"} >{details === null ? 'NULL' : details}</label>
												</td>
											))}	
										</tr>
									))}
									</Table>
								</tr>
								: null }
							</tbody>
						</Table> : 

						// DDL Check
						this.props.testCaseName == 'ddlcheck' ?
						<Table className="ddlchecktable">
							<tbody>
								<tr>
									<td className="testCaseLogLabel ddlborder">
										<label className="ddlnamelabel main_titles">Log Details - {this.props.testCaseDisplayName} </label>
									</td>
									<td className="ddlborder">
									
										<label className="ddlstatuslabel">Status:&nbsp;</label>
										<label className="resultLog">
											{renderStatusLabel(this.props.TestCaseLogDetails.Execution_status)}
										</label>&nbsp;&nbsp;
										{ renderStatusIcon(this.props.TestCaseLogDetails.Execution_status) }
										{ this.props.TestCaseLogDetails.Execution_status === 'fail' &&
										<IconButton className="geticonmargins4">
											<GetAppIcon 
											
											/>
										</IconButton>
										}
									</td>
								</tr>
								<tr>
								{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
								<label className="sub_title ddlresultlabel">Result:</label>
									<label className="resultmargin">
											{this.handleMessage(this.props.TestCaseLogDetails.Execution_status, this.props.testCaseName)} 
								</label>
								</span>
								}
								</tr>
								{ this.props.TestCaseLogDetails.Execution_status === 'fail' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('source_execution_log') && this.props.TestCaseLogDetails.Execution_log['source_execution_log'].length > 0 ?
								<td className="ddlchecklogborder1">
										{
											this.props.TestCaseLogDetails.Execution_log['source_execution_log'].map((log, index) => (
											<tr className={index%2 === 0 ? "testCaseLogLabel bgcolorevenddl" : "testCaseLogLabel bgcolorOddddl"}>
												{
													log.map((value,index) => (
														value !== 'Not Available' ?
													<td style={{border:'1px solid rgb(32, 31, 31,25%)',width:"124px"}} className="ddlsecoundpadding">
														{value}
													</td>: <td className="ddlchecksecoundtable" colspan="3">Not Available</td>
													))											
												}
											</tr>
											))											
										}
									</td>
								: <td style={{'width': '200px'}}></td> }
								{ this.props.TestCaseLogDetails.Execution_status === 'fail' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('dest_execution_log') && this.props.TestCaseLogDetails.Execution_log['dest_execution_log'].length > 0 ?
								<td className="ddlchecklogborder2">
										{
											this.props.TestCaseLogDetails.Execution_log['dest_execution_log'].map((log, index) => (
											<tr className={index%2 === 0 ? "testCaseLogLabel bgcolorevenddl" : "testCaseLogLabel bgcolorOddddl"}>
											{
												log.map((value, index) => (
													value !== 'Not Available' ?
												<td style={{border:'1px solid rgb(32, 31, 31,25%)' ,width:"130px"}} className="ddlsecoundpadding">
													{value}
												</td>: <td className="ddlchecksecoundtable" colSpan="3">Not Available</td>
												))											
											}
											</tr>
											))											
										}
									</td>
								: <td style={{'width': '200px'}}></td> }
							</tbody>
						</Table>
						: this.props.testCaseName == 'datavalidation' ?
						// Datavalidation
						<Table id="viewLogDetails">
							<tbody>
								<tr>
									<td className="testCaseLogLabel">
										<label className="testViewDataLabel main_titles lablemargindv">Log Details - {this.props.testCaseDisplayName} </label>
										
										<label className="sub_title statslabelmargin">Status:&nbsp;</label>
										<label className="resultLog">
											{renderStatusLabel(this.props.TestCaseLogDetails.Execution_status)}
										</label>&nbsp;&nbsp;
										{ renderStatusIcon(this.props.TestCaseLogDetails.Execution_status) }&nbsp;&nbsp;
										{ this.props.TestCaseLogDetails.Execution_status === 'fail' &&
										<IconButton className="geticonmargins3">
											<GetAppIcon 
											
											/>
										</IconButton>
										}
									</td>
								</tr>
								<tr>
								{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
									<label className="testViewDataLabel resultlabel3 sub_title">Result: </label>&nbsp;&nbsp;
									<label className="testViewDataLabel resultlabel3margin">
									{this.handleMessage(this.props.TestCaseLogDetails.Execution_status, this.props.testCaseName)} 
								</label></span>
								}
								</tr>
								<tr>
									<td className="testCaseLogMessage">
										{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
										<label className="testViewDataLabel sourcecountlabel">
											Source Count&nbsp;: 
											&nbsp;{ this.props.TestCaseLogDetails.Execution_log  !== null?
												<span className="red">{this.props.TestCaseLogDetails.Execution_log['src_count']}</span>
												: null
											} 
										</label></span>
										}
										{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
										<label className="testViewDataLabel targetcountlabel">
											Target Count&nbsp; : 
											&nbsp;{ this.props.TestCaseLogDetails.Execution_log  !==null?
												<span className="red">{this.props.TestCaseLogDetails.Execution_log['dest_count']}</span> 
												: null
											}
										</label></span>
										}
										
									</td>
								</tr>
								<tr>
								{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
								<label className="testViewDataLabel sublabel1">
												Number of Mismatch Records found in Source&nbsp; :
												&nbsp;{ this.props.TestCaseLogDetails.Execution_log  !== null?
												 <span className="red">{this.props.TestCaseLogDetails.Execution_log['src_to_dest_count']}</span> 
												 :null
												}
										</label></span>
										}
										{this.props.TestCaseLogDetails.Execution_status !== 'error' && <span>
										<label className="testViewDataLabel sublabel2">
												Number of Mismatch Records found in Target&nbsp;: 
												&nbsp;{ this.props.TestCaseLogDetails.Execution_log  !==null?
												<span className="red">{this.props.TestCaseLogDetails.Execution_log['dest_to_src_count']}</span> 
												: null
											}
										</label></span>
										}
										
								</tr>
								{ this.props.TestCaseLogDetails.Execution_status === 'fail' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('source_execution_log') && this.props.TestCaseLogDetails.Execution_log['source_execution_log'] !== null && this.props.TestCaseLogDetails.Execution_log['source_execution_log'].length > 0 ?
								<tr>
									<Table className="datavalitable2">
										{
											this.props.TestCaseLogDetails.Execution_log.source_execution_log.map((log, index) => (
											<tr className={index === 0 ? "testCaseLogLabel bgcolor borderpadding" : (index%2 === 0 ? "testCaseLogLabel bgcoloreven" : "testCaseLogLabel bgcolorOdd")} nowrap>
												{log.map(details => (
													<td className="datavalitablefont">{details}</td>
												))}
											</tr>
											))											
										}
									</Table>
								</tr>
								: null }
								{ this.props.TestCaseLogDetails.Execution_status === 'fail' && this.props.TestCaseLogDetails.Execution_log && this.props.TestCaseLogDetails.Execution_log.hasOwnProperty('dest_execution_log') && this.props.TestCaseLogDetails.Execution_log['dest_execution_log'] !== null && this.props.TestCaseLogDetails.Execution_log['dest_execution_log'].length > 0 ?
								<tr>
									<Table className="datavalitable1">
										{
											this.props.TestCaseLogDetails.Execution_log.dest_execution_log.map((log, index) => (
											<tr className={index === 0 ? "testCaseLogLabel bgcolor borderpadding" : (index%2 === 0 ? "testCaseLogLabel bgcoloreven" : "testCaseLogLabel bgcolorOdd")} nowrap>
												{log.map(details => (
													<td className="datavalitablefont">{details}</td>
												))}
											</tr>
											))											
										}
									</Table>
									</tr>
								: null }	
							</tbody>
						</Table> 
						: 'No Logs Found!' }
				</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		testCaseName: state.testSuites.testCaseLog.logData.test_case_class_name,
		testCaseDisplayName: state.testSuites.testCaseLog.logData.test_case_class_display_name,
		TestCaseLogDetails: state.testSuites.testCaseLog.logData 
	};
};

export default connect(mapStateToProps)(CaseLogDetails);