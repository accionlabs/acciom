import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, Button, FormGroup, FormControl, ControlLabel, HelpBlock, Panel } from 'react-bootstrap';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../shared/validator';
 
import styled from 'styled-components';

import { loginToPortal } from '../actions/loginActions';

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
			<div className="loginForm">
				<Panel>
					<Panel.Heading>User Login</Panel.Heading>
					<Panel.Body>
						<form onSubmit={this.login}>
							<FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
								<ControlLabel>Email</ControlLabel>
								<FormControl type="text" name="email" placeholder="Enter your email" onChange={this.handleInputChange} />
								{ errors.email && 
									<HelpBlock>{errors.email}</HelpBlock> 
								}
							</FormGroup >
							<FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
								<ControlLabel>Password</ControlLabel>
								<FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
								{ errors.password && 
									<HelpBlock>{errors.password}</HelpBlock> 
								}
							</FormGroup>
							<Button type="submit" bsStyle="primary">Sign-In</Button>
						</form>
					</Panel.Body>
				</Panel>
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