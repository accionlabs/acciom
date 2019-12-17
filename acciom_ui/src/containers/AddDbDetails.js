import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Paper from '@material-ui/core/Paper';
import { FormGroup, ControlLabel, FormControl, Panel, Form, Col} from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import {
    addDatabaseDetails,
    getDBDetailsById,
    updateDBDetails,
    checkDbConnection,
    redirectToViewDbPageComplete,
    resetSelectedDbDetails
} from '../actions/dbDetailsActions';

class AddDbDetails extends Component {
    constructor(props) {
        super(props);
        this.initialiseFormState();
    }

    componentDidMount() {
        const dbTypeId = this.state.formData['db_connection_id'];
        if (dbTypeId) {
            this.setState({ isEditMode: true });
            this.props.getDBDetailsById(dbTypeId);
        } else {
            this.setState({ isEditMode: false });
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (
            prevState.isEditMode &&
            prevState.loading &&
            !prevState.selectedDbDetails &&
            nextProps.selectedDbDetails
        ) {
            return {
                ...prevState,
                formData: {
                    ...prevState.formData,
                    db_connection_name:
                        nextProps.selectedDbDetails.db_connection_name,
                    db_type: nextProps.selectedDbDetails.db_type,
                    db_name: nextProps.selectedDbDetails.db_name,
                    db_hostname: nextProps.selectedDbDetails.db_hostname,
                    db_username: nextProps.selectedDbDetails.db_username,
                    db_password: nextProps.selectedDbDetails.db_password
                },
                loading: false
            };
        } else if (nextProps.redirectToViewDBPage) {
            nextProps.redirectToViewDbPageComplete();
            nextProps.history.push('/view_db_details');
        }
        return null;
    };

    initialiseFormState = () => {
        const dbTypeId =
            this.props.match && this.props.match.params
                ? this.props.match.params.id
                : null;
        this.state = {
            formData: this.getInitialFormData(dbTypeId),
            errors: {},
            formSubmitted: false,
            loading: true,
            selectedDbDetails: null,
            isEditMode: false,
            updatedDbDetails: false
        };
    };

    getInitialFormData = dbConnectionId => {
        const formDataObj = {
            project_id: this.props.currentProject.project_id
        };
        if (dbConnectionId) {
            formDataObj['db_connection_id'] = dbConnectionId;
        }
        return formDataObj;
    };

    handleInputChange = ({ target }) => {
        const { value, name } = target;

        const formData = { ...this.state.formData };
        formData[name] = value;

        this.setState({
            formData
        });
    };

    formSubmit = () => {
        const errors = true;

        if (errors === true) {
            if (this.state.isEditMode) {
                this.props.updateDBDetails(JSON.stringify(this.state.formData));
            } else {
                this.props.addDatabaseDetails(
                    JSON.stringify(this.state.formData)
                );
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
        this.props.checkDbConnection(
            JSON.stringify({
                db_type: dbdata.db_type,
                db_name: dbdata.db_name,
                db_hostname: dbdata.db_hostname,
                db_username: dbdata.db_username,
                db_password: dbdata.db_password
            })
        );
    };

    formValidation = () => {
        return [
            this.state.formData.db_connection_name,
            this.state.formData.db_type,
            this.state.formData.db_name,
            this.state.formData.db_hostname,
            this.state.formData.db_username,
            this.state.formData.db_password
        ].every(Boolean);
    };

    render() {
        const inValid = !this.formValidation();
        return (
            <div className="addDBTitles">
                <div className="addDBTitles">
                    <PlaylistAddIcon className="addDBIcon" />
                    <label className="main_titles">Add DB Details</label>
                </div>
                <Paper className="adDbDetailsPaper">
                    <table>
                        <tr>
                            <td>
                                <TextField
                                    value={
                                        this.state.formData.db_connection_name
                                    }
                                    name="db_connection_name"
                                    onChange={this.handleInputChange}
                                    label="Connection Name"
                                    type="textbox"
                                    className="adDbDetilsText"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                            
                        </tr>
                        &nbsp; &nbsp;
                        <tr>
                        <td>
                                <TextField
                                    value={this.state.formData.db_type}
                                    name="db_type"
                                    onChange={this.handleInputChange}
                                    label="Database Type"
                                    type="textbox"
                                    className="adDbDetilsText"
                                    inputProp={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                        </tr>
                        &nbsp; &nbsp;
                        <tr>
                            <td>
                                <TextField
                                    value={this.state.formData.db_name}
                                    name="db_name"
                                    onChange={this.handleInputChange}
                                    label="Database Name"
                                    type="textbox"
                                    className="adDbDetilsText"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                            
                        </tr>
                        &nbsp; &nbsp;
                        <tr>
                        <td>
                                <TextField
                                    value={this.state.formData.db_hostname}
                                    name="db_hostname"
                                    onChange={this.handleInputChange}
                                    label="Host Name"
                                    type="textbox"
                                    className="adDbDetilsText"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                            
                            
                        </tr>
                        &nbsp; &nbsp;
                        <tr>
                        <td>
                                <TextField
                                    value={this.state.formData.db_username}
                                    name="db_username"
                                    onChange={this.handleInputChange}
                                    label="User Name"
                                    type="textbox"
                                    className="adDbDetilsText"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                        </tr>
                        &nbsp; &nbsp;
                        <tr>
                        <td>
                                <TextField
                                    value={this.state.formData.db_password}
                                    name="db_password"
                                    onChange={this.handleInputChange}
                                    label="Password"
                                    type="password"
                                    className="adDbDetilsText"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="addDbDetailsButtonDIv">
                        <Link to={'/view_db_details'} className="backbtn">
                            <Button
                                variant="contained"
                                className="backbutton_colors backbtnbackgroundcolor"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            variant="contained"
                            className="button-colors testConnectionButton"
                            type="button"
                            onClick={e => {
                                this.checkConnection();
                            }}
                            disabled={inValid}
                        >
                            Test Connection
                        </Button>
                        <Button
                            variant="contained"
                            className="button-colors submitButton"
                            type="submit"
							disabled={inValid}
							onClick={() => this.formSubmit()}	
                        >
                            Submit
                        </Button>
                    </div>
                </Paper>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.resetSelectedDbDetails();
    }
}

const mapStateToProps = state => {
    return {
        updatedDbDetails: state.dbDetailsData.updatedDbDetails,
        selectedDbDetails: state.dbDetailsData.selectedDbDetails,
        redirectToViewDBPage: state.dbDetailsData.redirectToViewDBPage,
        currentProject: state.appData.currentProject
    };
};

const mapDispatchToProps = dispatch => ({
    addDatabaseDetails: data => dispatch(addDatabaseDetails(data)),
    getDBDetailsById: data => dispatch(getDBDetailsById(data)),
    updateDBDetails: data => dispatch(updateDBDetails(data)),
    checkDbConnection: data => dispatch(checkDbConnection(data)),
    redirectToViewDbPageComplete: () =>
        dispatch(redirectToViewDbPageComplete()),
    resetSelectedDbDetails: () => dispatch(resetSelectedDbDetails())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddDbDetails);
