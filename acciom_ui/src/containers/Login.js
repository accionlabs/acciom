import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../shared/validator';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { loginToPortal } from '../actions/loginActions';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
// import logo from '../assets/images/logo.png';
import FormHelperText from '@material-ui/core/FormHelperText';


class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false // Indicates in progress state of login form
		}
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!nextProps.loginData.authTokenExpired) {
			nextProps.history.push('./');
		}
		return null;
	}

	handleInputChange = ({target}) => {
		const { value, name } = target;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData
		});
	}

	validateLoginForm = (e) => {
		
		const errors = {};
		const { formData } = this.state;

		if (isEmpty(formData.email)) {
			errors.email = "Email can't be blank";
		} else if (!isEmail(formData.email)) {
			errors.email = "Please enter a valid email";
		}

		if (isEmpty(formData.password)) {
			errors.password = "Password can't be blank";
		} else if (isContainWhiteSpace(formData.password)) {
			errors.password = "Password should not contain white spaces";
		} 
		// else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
		// 	errors.password = "Password's length must between 6 to 16";
		// }

		if (isEmpty(errors)) {
			return true;
		} else {
			return errors;
		}
	}

	login = (e) => {
		e.preventDefault();
		const errors = this.validateLoginForm();

		if (errors === true){
			this.props.loginToPortal(this.state.formData);
		} else {
			this.setState({
				errors,
				formSubmitted: true
			});
		}
	}

	render() {
		const { errors, formSubmitted } = this.state;
		return (
			<div className="changePasswordPage">
				<Paper className="loginPagePaper">
							<FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
								<div style = {{paddingBottom:'30px'}}>
								<TextField type="text" name="email" className="chnagePasswordText" label="Email "  onChange={this.handleInputChange} />
									<FormHelperText style={{color: 'red'}}>{errors.email}</FormHelperText>
								</div>
							</FormGroup >
							<FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
								<div>
								<TextField type="password" className="chnagePasswordText" name="password" label="Password" onChange={this.handleInputChange} />
									<FormHelperText>{errors.password}</FormHelperText> 
								</div>
							</FormGroup>
						<div className="loginPageButtonDiv">
						<Button type="submit" onClick={(e) => this.login(e)} variant="contained" className="button-colors sign-upbtn">Sign-In</Button>	
						</div>
				</Paper>
				
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		loginData: state.loginData
	};
};

const mapDispatchToProps = dispatch => ({
	loginToPortal: (data) => dispatch(loginToPortal(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);