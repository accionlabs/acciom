import React, { Component } from 'react';
import { connect }from 'react-redux'
import { FormGroup,} from 'react-bootstrap';
import { changePassword } from '../actions/loginActions';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import LockOpenIcon from '@material-ui/icons/LockOpen';

class ChangePasswordComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
			errors: {}, 
			formSubmitted: false,
			loading: false,
			newpassword_error: '',
			confimPasswodMatch: '',
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
		if(formData.new_password !== formData.confirm_password) {
			this.setState({confimPasswodMatch: 'New Password and Confirm Password did Not Match'})
		}else if(formData.old_password === formData.new_password) {
			this.setState({newpassword_error: 'Old Password and New Password are Same'})
			return false
		}else {
			this.props.changePassword(JSON.stringify(formObj));
			location.reload();
			return true
		}
	};

	goToBackBtnPage = () => {
        this.props.history.goBack();
    };

	render() {
		const { errors, formSubmitted, formData, 
				confimPasswodMatch, newpassword_error, } = this.state;
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
								<TextField 
										className="chnagePasswordText"
										type="password"
										name="new_password"
										onChange={this.handleInputChange}
										label="New Password"
										inputProps = {{maxLength: 50,}}
										error={newpassword_error}
										helperText={newpassword_error}
									/>
								</FormGroup >
							<FormGroup controlId="password">
								<TextField 
										className="chnagePasswordText"
										type="password"
										name="confirm_password"
										onChange={this.handleInputChange}
										label="Confirm Password"
										error={confimPasswodMatch}
										helperText={confimPasswodMatch}
									/>
							</FormGroup>
							<div className="changePasswordDiv">
							<Button onClick={this.goToBackBtnPage} variant="contained" className="backbutton_colors changepasswbackbutton">Cancel</Button>
							<Button onClick={(e) => this.submitNewPassWord(e)} variant="contained" type="submit" disabled={!formData.new_password || !formData.old_password 
								|| !formData.confirm_password} className="button-colors chngpasswbtn">Submit</Button>
							</div>
					</Paper>
			</div>
		);
	}
}


const mapDispatchToProps = dispatch => ({
	changePassword: (data) => dispatch(changePassword(data))
});

export default connect(null, mapDispatchToProps)(ChangePasswordComponent);