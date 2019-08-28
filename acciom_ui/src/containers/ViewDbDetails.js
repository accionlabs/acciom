import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel, Table, Button, Modal} from 'react-bootstrap';

import { showProjectSwitchPage } from '../actions/appActions';
import { getAllDBDetails, deleteDBDetails } from '../actions/dbDetailsActions';

class ViewDbDetails extends Component {

	constructor(props){
		super(props);
		this.state = {
			showDeleteConfirmationDialog: false,
			deleteConnectionID: null
		};
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.refreshDBDetails) {
			nextProps.getAllDBDetails(nextProps.currentProject.project_id);
		}
		return prevState;
	};

	handleSwitchProject = () => {
		this.props.showProjectSwitchPage(true);
	};

	deleteViewDBDetails = (deleteConnectionID) => {
		this.setState({showDeleteConfirmationDialog: true, deleteConnectionID}); 
	}

	onNoBtnClickHandler = () => {
		this.hideConfirmationopup();
	}

	onYesBtnClickHandler = () => {
		this.hideConfirmationopup();
		this.props.deleteDBDetails(this.state.deleteConnectionID);
	}

	hideConfirmationopup = () => {
		this.setState({showDeleteConfirmationDialog: false, deleteConnectionID: null})
	}

	renderDeleteConfirmationPopup = () => {
		return (
			<Modal show={true} className="deleteconfirmpopup">
				<Modal.Header>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>

				<Modal.Body >
					<div className="deleteconfirmpopupfield">Do You Want to Delete this DB ?</div>
				</Modal.Body>

				<Modal.Footer>
					<Button className="onDeleteDbYesBtnClick" bsStyle="primary" onClick={ (e) => {this.onYesBtnClickHandler()}}>Yes</Button>
					<Button className="onDeleteDbNoBtnClick" bsStyle="primary" onClick={ (e) => {this.onNoBtnClickHandler()}}>No</Button>
				</Modal.Footer>
			</Modal>
		)
		// this.props.deleteDBDetails(connectionID);
	}

	renderDBDetailsList = (dbDetailsList) => {
		return dbDetailsList.map((item, index) => {
			return (
				<tr key={index}>
					<td>{item.project_name}</td>
					<td>{item.db_connection_name}</td>
					<td>{item.db_type_name}</td>
					<td>{item.db_name}</td>
					<td>{item.db_hostname}</td>
					<td>{item.db_username}</td>
					<td>
						<Link to={`/add_db_details/${item.db_connection_id}`}>
							<label className="addDBDetails">Edit</label>
						</Link>
					</td>
					<td>
						<label onClick={ (e) => {this.deleteViewDBDetails(item.db_connection_id)}} className="deleteDBDetails">Delete</label>
					</td>
				</tr>	
			);
		});
	};

	render() {
 		return (
			<div className="viewDbDetailsForm">
				<div className='btnContainer'>
					<div className='project-switch'><Button bsStyle="primary" onClick={ (e) => this.handleSwitchProject()}>Switch Project</Button> </div>
					<Link to={`/add_db_details`}>
						<Button className="addDbBtn" type="button" bsStyle="primary"> Add DB Details </Button>
					</Link>
				</div>
				<Panel>
					<Panel.Heading>Manage DB Connections</Panel.Heading>
					<Panel.Body>
						<Table responsive>
							<thead>
								<tr>
									<th>Project Name</th>
									<th>Connection Name</th>
									<th>Database Type</th>
									<th>Database Name</th>
									<th>Host Name</th>
									<th>User Name</th>
								</tr>
							</thead>
							<tbody>
								{ this.renderDBDetailsList(this.props.dbDetailsList) }
							</tbody>
						</Table>
					</Panel.Body>
				</Panel>

				{ 
					this.state.showDeleteConfirmationDialog ?
						this.renderDeleteConfirmationPopup()
						: null
				}
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		dbDetailsList: state.dbDetailsData.dbDetailsList?state.dbDetailsData.dbDetailsList: [],
		refreshDBDetails: state.dbDetailsData.refreshDBDetails,
		currentProject: state.appData.currentProject
	};
};

const mapDispatchToProps = dispatch => ({
	getAllDBDetails: (data) => dispatch(getAllDBDetails(data)),
	showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
	deleteDBDetails: (data) => dispatch(deleteDBDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewDbDetails);