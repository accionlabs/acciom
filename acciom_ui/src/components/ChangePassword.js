import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect }from 'react-redux'
import { Row, FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap';
import { changePassword } from '../actions/loginActions';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import LockOpenIcon from '@material-ui/icons/LockOpen';

class ChangePasswordComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false, // Indicates in progress state of login form
			newpassword_error: '',
			confirmpassword_error:'',
			disabled: false
		};
	}
	getConfirmtionMessage() {
		let element = null;
		if (this.props.changePassword) {
			element = (
				<div>Password Changed SuccessFully.</div>
			) 
		}
		return element;
	}

	handleInputChange = ({target}) => {
		const { value, name } = target;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData
		});
	}

	submitNewPassWord = (e) => {
		let formData = this.state.formData;
		let formObj = {
			'old_password': formData.old_password,
			'new_password': formData.new_password
		};
		if (this.state.formData.new_password === this.state.formData.old_password) {
			this.setState({newpassword_error: "Old password and new password are same"});
			return;
		}
		if (this.state.formData.new_password !== this.state.formData.confirm_password) {
			this.setState({confirmpassword_error: 'New password and Confirm password did not match'});
			return;
		}
		this.props.changePassword(JSON.stringify(formObj));
	};

	goToBackBtnPage = () => {
        this.props.history.goBack();
    };

	render() {
		const { errors, formSubmitted } = this.state;
		return(
			<div className="changePasswordPage">
				<div className="addDBTitles">
					<LockOpenIcon className="addDBIcon" />
					<label className="main_titles">Change Password</label>
				</div>
				<Paper className="passw_chng_panel_margin">
							<FormGroup controlId="email" >
								<FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
									<TextField 
										className="chnagePasswordText"
										type="password"
										name="old_password"
										onChange={this.handleInputChange}
										label="Old Password"
									/>
								</FormGroup>
								&nbsp; &nbsp;
								<TextField 
										className="chnagePasswordText"
										type="password"
										name="new_password"
										onChange={this.handleInputChange}
										label="New Password"
										inputProps = {{maxLength: 50,}}
									/>
									<FormHelperText style={{color:'red'}}>{this.state.newpassword_error}</FormHelperText>
								</FormGroup >
							<FormGroup controlId="password">
								<TextField 
										className="chnagePasswordText"
										type="password"
										name="confirm_password"
										onChange={this.handleInputChange}
										label="Confirm Password"
									/>
								<FormHelperText style={{color:'red'}}>{this.state.confirmpassword_error}</FormHelperText>
							</FormGroup>
							<div className="changePasswordDiv">
							<Button onClick={this.goToBackBtnPage} variant="contained" className="backbutton_colors changepasswbackbutton">Cancel</Button>
							<Button onClick={(e) => this.submitNewPassWord(e)} variant="contained" type="submit" disabled={this.state.disabled} className="button-colors chngpasswbtn">Submit</Button>
							</div>
					</Paper>
			</div>
		);
	}
}


const mapDispatchToProps = dispatch => ({
	changePassword: (data) => dispatch(changePassword(data))
})
  
export default connect(null, mapDispatchToProps)(ChangePasswordComponent);