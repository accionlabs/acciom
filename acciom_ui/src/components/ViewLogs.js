import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import ViewLogDetails from './ViewLogDetails';

import { hideCaseLogDialog } from '../actions/testSuiteListActions';

class CaseLogs extends React.Component {
	handleCaseLogDialogBoxClose = () => {
		 this.props.hideCaseLogDialog();
	};

	render() {
		return (
			<div>
				<Modal
					show={this.props.showCaseLogDialog}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					onHide={this.handleCaseLogDialogBoxClose}
					className="caseLogMargin" >
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							<label className="manageConnectionHeading">Log Details:</label>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<ViewLogDetails />
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showCaseLogDialog: state.testSuites.testCaseLog.showCaseLogDialog,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideCaseLogDialog: () => dispatch(hideCaseLogDialog())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseLogs);