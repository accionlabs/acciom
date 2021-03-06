import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel, Table, Modal} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { showProjectSwitchPage, headers } from '../actions/appActions';
import { getAllDBDetails, deleteDBDetails } from '../actions/dbDetailsActions';
import EditIcon from '@material-ui/icons/Edit';
import StorageIcon from '@material-ui/icons/Storage';
import DeleteIcon from '@material-ui/icons/Delete';
import '../css/Db-ui-styles.css';
import CustomTable from '../components/Table/CustomTable';

import {
	PROJECTNAME,
	CONNECTIONAME,
	CONNECTIONAMELABEL,
	DATABASETYPE,
	DATABASETYPELABEL,
	DATABASENAME,
	HOSTNAMELABEL,
	DATABASENAMELABEL,
	USERNAMELABEL,
    HOSTNAME,
    USERNAME,
	ACTION,
	PROJNAME,
	SMALL, 
} from '../constants/FieldNameConstants';

class ViewDbDetails extends Component {

	constructor(props){
		super(props);
		this.state = {
			showDeleteConfirmationDialog: false,
			deleteConnectionID: null,
			headers: [
			{ id: PROJECTNAME, label: PROJNAME },
			{ id: CONNECTIONAME, label: CONNECTIONAMELABEL },
			{ id: DATABASETYPE, label: DATABASETYPELABEL },
			{ id: DATABASENAME, label: DATABASENAMELABEL },
			{ id: HOSTNAME, label: HOSTNAMELABEL },
			{ id: USERNAME, label: USERNAMELABEL },
			]
		};
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		// if (nextProps.refreshDBDetails !=true) {
		if (nextProps.refreshDBDetails){
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
		const data = {
			connectionID:this.state.deleteConnectionID
		}
		this.props.deleteDBDetails(data);
	}

	hideConfirmationopup = () => {
		this.setState({showDeleteConfirmationDialog: false, deleteConnectionID: null})
	}

	renderDeleteConfirmationPopup = () => {
		return (
			<Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
				<Modal.Header className="popboxheader">
					<Modal.Title className="sub_title">Confirmation</Modal.Title>
				</Modal.Header>

				<Modal.Body >
					<div className="deleteconfirmpopupfieldtext">Do you want to delete this DB connection?</div>
				</Modal.Body>

				<Modal.Footer className="popboxfooter">
					<Button variant="contained" className="deleteDBConnection button-colors" onClick={ (e) => {this.onYesBtnClickHandler()}}>Yes</Button>
					<Button variant="contained" className="backbutton_colors deleteDBConnection" onClick={ (e) => {this.onNoBtnClickHandler()}}>No</Button>
				</Modal.Footer>
			</Modal>
		)
		// this.props.deleteDBDetails(connectionID);
	}

	render() {
		const {headers} = this.state;
		const { dbDetailsList } = this.props;

		const modifyData = [];
		if(dbDetailsList){
			dbDetailsList.forEach((project, index)=>{
				modifyData.push({
					project_name: project.project_name,
					Connection_name: project.db_connection_name,
					database_type: project.db_type,
					database_name: project.db_name,
					host_name: project.db_hostname,
					db_username: project.db_username,

					action: (
						<Fragment>
							<Link to={`/add_db_details/${project.db_connection_id}`}>
                                <EditIcon
                                    fontSize={SMALL}
                                    className="editicon2"
                                    style={{
                                        color: '#696969',
                                        marginRight: '8px'
                                    }}
                                />
                            </Link>
							<DeleteIcon 
								className="cursorhover"
                                fontSize={SMALL}
                                style={{ color: '#696969', marginRight: '8px' }}
                                onClick={ (e) => {this.deleteViewDBDetails(project.db_connection_id)}}
							/>
						</Fragment>
					)
				})
			})
		}

	return (
			<div className="viewDbDetailsForm">
				<div className='btnContainer'>
				<StorageIcon className="manageDbIcon" />
				<label className="db_page_title main_titles">Manage Database Connections</label>
					<Button variant="contained" className="button-colors switchProjectButton"  onClick={ (e) => this.handleSwitchProject()}>Switch Project</Button>
					<Link to={`/add_db_details`}>
						<Button variant="contained" className="button-colors addDbBtn" type="button"> Add DB Details </Button>
					</Link>
				</div>
				{ 
					this.state.showDeleteConfirmationDialog ?
						this.renderDeleteConfirmationPopup()
						: null
				}
				<CustomTable
					headers={headers}
					bodyData={modifyData}
					actionLabel={ACTION}
				/>
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