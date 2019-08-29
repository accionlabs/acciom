import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import ManageConnectionInputs from './ManageConnectionInputs';
import ManageConnectionSelect from './ManageConnectionSelect';

import { hideManageConnectionsDialog, updateConnections } from '../actions/testSuiteListActions';

class ManageConnection extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selectedConnectionType: 'source',
			selectedConnection: '',
			selectedCases: []
		};
	};

	handleDialogBoxClose = () => {
		this.props.hideManageConnectionsDialog();
	};

	handleConnectionTypeChange = (connectionType) => {
		this.setState({
			selectedConnectionType: connectionType
		});
	};
	
	handleConnectionChange = (connection) => {
		this.setState({
			selectedConnection: Number(connection)
		});
	};

	handleCasesChange = (testCase) => {
		const cases = [...this.state.selectedCases];
		const value = Number(testCase.value);
		if (testCase.checked) {
			cases.push(value);
		} else {
			cases.splice(cases.indexOf(value), 1);
		}

		// this.setState({
		// 	selectedConnectionType: 'source'
		// });

		this.setState({
			selectedCases: cases
		});
	};

	handleManageConnectionSave = (e) => {
		// const payload = new FormData();
		// payload.append('connection_references', this.state.selectedConnectionType);
		// payload.append('case_id_list', this.state.selectedCases);
		// payload.append('db_connection_id', this.state.selectedConnection);
		// this.props.updateConnections(payload);
		this.props.updateConnections({
			connection_reference: this.state.selectedConnectionType,
			case_id_list: this.state.selectedCases,
			db_connection_id: this.state.selectedConnection
		});
	};

	handleResetConnection = (e) => {
		this.setState({
			selectedConnectionType: null,
			selectedConnection: '',
			selectedCases: []
		});
	};
	
	render() {
		return (
			<Modal
				show={this.props.showConnectionsDialog}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				onHide={this.handleDialogBoxClose}
				className="ModalMargin"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						<label className="manageConnectionHeading">Manage Connections</label>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ManageConnectionInputs selectedConnectionType={this.state.selectedConnectionType}  onChange={this.handleConnectionTypeChange}></ManageConnectionInputs>
					<ManageConnectionSelect 
						selectedConnection={this.state.selectedConnection} 
						selectedCases={this.state.selectedCases}
						onConnectionChange={this.handleConnectionChange}
						onCaseSelectionChange={this.handleCasesChange}
						testSuiteId={this.props.testSuiteId}>
					</ManageConnectionSelect>
				</Modal.Body>
				<Modal.Footer>
					<Button className="btn btn-primary" onClick={e => this.handleManageConnectionSave(e)}>
						Save
					</Button>
					<Button className="btn btn-primary" onClick={e => this.handleResetConnection(e)}>Reset</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showConnectionsDialog: state.testSuites.connectionsList.showConnectionsDialog
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideManageConnectionsDialog: () => dispatch(hideManageConnectionsDialog()),
		updateConnections: (data) => dispatch(updateConnections(data))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageConnection);