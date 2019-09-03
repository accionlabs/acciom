import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button, Panel, Form, Col} from 'react-bootstrap';

import { addDatabaseDetails, getDBDetailsById, updateDBDetails, checkDbConnection, redirectToViewDbPageComplete} from '../actions/dbDetailsActions';

class AddDbDetails extends Component {

	constructor(props) {
		super(props);
		this.initialiseFormState();
	}

	componentDidMount() {
		const dbTypeId = this.state.formData['db_connection_id'];
		if (dbTypeId)  {
			this.setState({isEditMode:true});
			this.props.getDBDetailsById(dbTypeId);
		}
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (prevState.loading && !prevState.selectedDbDetails && nextProps.selectedDbDetails) {
			return {
				...prevState,
				formData: {
					...prevState.formData,
					'db_connection_name' : nextProps.selectedDbDetails.db_connection_name,
					'db_type_name' : nextProps.selectedDbDetails.db_type_name,
					'db_name' : nextProps.selectedDbDetails.db_name,
					'db_hostname' : nextProps.selectedDbDetails.db_hostname,
					'db_username' : nextProps.selectedDbDetails.db_username,
					'db_password' : nextProps.selectedDbDetails.db_password
				},
				loading : false
			};
		} else if (nextProps.redirectToViewDBPage) {
			nextProps.redirectToViewDbPageComplete();
			nextProps.history.push('/view_db_details');
		} 
		return null;
	}

	initialiseFormState = () => {
		const dbTypeId= (this.props.match && this.props.match.params) ? this.props.match.params.id : null;
		this.state = {
			formData: this.getInitialFormData(dbTypeId),
			errors: {}, 
			formSubmitted: false, 
			loading: true,
			selectedDbDetails: null,
			isEditMode: false,
			updatedDbDetails:false
		};
	}
	
	getInitialFormData = (dbConnectionId) => {
		const formDataObj = {'project_id': this.props.currentProject.project_id};
		if (dbConnectionId) {
			formDataObj['db_connection_id'] = dbConnectionId;
		}
		return formDataObj;
	}

	handleInputChange = ({target}) => {
		const { value, name } = target;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData
		});
	}
	
	formSubmit = (e) => {
		e.preventDefault();
		const errors = true;

		if (errors === true){
			if (this.state.isEditMode) {
				this.props.updateDBDetails(JSON.stringify(this.state.formData));
			} else {
				this.props.addDatabaseDetails(JSON.stringify(this.state.formData));
			}
		} else {
			this.setState({
				errors,
				formSubmitted: true
			});
		}
	};

	checkConnection = () => {
		const dbdata = this.state.formData;
		this.props.checkDbConnection(JSON.stringify({
			'db_type_name' : dbdata.db_type_name,
			'db_name' : dbdata.db_name,
			'db_hostname' : dbdata.db_hostname,
			'db_username' : dbdata.db_username,
			'db_password' : dbdata.db_password
		}));
	}

	render() {
 		return (
			<div className="addDbDetailsForm">
				<Panel>
					<Panel.Heading>Add DB Details</Panel.Heading>
					<Panel.Body>
						<Form onSubmit={this.formSubmit} horizontal>
							<FormGroup controlId="formControlsConnName">
								<Col sm={4}><ControlLabel>Connection Name</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_connection_name} type="text" name="db_connection_name" onChange={this.handleInputChange} /></Col>
							</FormGroup >
							<FormGroup controlId="formControlsDbType">
								<Col sm={4}><ControlLabel>Database Type</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_type_name} type="text" name="db_type_name" onChange={this.handleInputChange} /></Col>
							</FormGroup >
							<FormGroup controlId="formControlsDbName">
								<Col sm={4}><ControlLabel>Database Name</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_name} type="text" name="db_name" onChange={this.handleInputChange} /></Col>
							</FormGroup >
							<FormGroup controlId="formControlsHostName">
								<Col sm={4}><ControlLabel>Host Name</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_hostname} type="text" name="db_hostname" onChange={this.handleInputChange} /></Col>
							</FormGroup >
							<FormGroup controlId="formControlsUsername">
								<Col sm={4}><ControlLabel>User Name</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_username} type="text" name="db_username" onChange={this.handleInputChange} /></Col>
							</FormGroup >
							<FormGroup controlId="formControlsPassword">
								<Col sm={4}><ControlLabel>Password</ControlLabel></Col>
								<Col sm={8}><FormControl value={this.state.formData.db_password} type="password" name="db_password" onChange={this.handleInputChange} /></Col>
							</FormGroup >

							<FormGroup className="formFooter">
								<Button type="button" bsStyle="primary" onClick={(e) => {this.checkConnection()}}>Test Connection</Button>
								<Button type="submit" bsStyle="primary">Submit</Button>
							</FormGroup>
						</Form>
					</Panel.Body>
				</Panel>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		updatedDbDetails: state.dbDetailsData.updatedDbDetails,
		selectedDbDetails: state.dbDetailsData.selectedDbDetails,
		redirectToViewDBPage: state.dbDetailsData.redirectToViewDBPage,
		currentProject: state.appData.currentProject
	};
};

const mapDispatchToProps = dispatch => ({
	addDatabaseDetails: (data) => dispatch(addDatabaseDetails(data)),
	getDBDetailsById: (data) => dispatch(getDBDetailsById(data)),
	updateDBDetails: (data) => dispatch(updateDBDetails(data)),
	checkDbConnection: (data) => dispatch(checkDbConnection(data)),
	redirectToViewDbPageComplete: () => dispatch(redirectToViewDbPageComplete())	
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDbDetails);