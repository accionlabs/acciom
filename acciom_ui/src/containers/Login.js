import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormGroup } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { loginToPortal } from '../actions/loginActions';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';


class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			formData: {
				email: '',
				password: ''
			}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false, // Indicates in progress state of login form
			isSubmit: false,
		}
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		if (!nextProps.loginData.authTokenExpired) {
			nextProps.history.push('./');
		}
		return null;
	}
	handleInputChange = () => {
		const { value, name } = event.target;
		const { formData } = this.state;
		formData[name] = value
		this.setState({
			formData: formData
		})
	}

	isEmailValid = () => {
		const { formData } = this.state;
        const emailRegx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegx.test(String(formData.email.toLowerCase()));
    };

	login = (e) => {
		const { formData } = this.state;
		e.preventDefault();
		if (this.isEmailValid()){
			this.props.loginToPortal(formData);
		} else {
			this.setState({
				isSubmit: true
			});
		}
	}

	render() {
		const { errors, formSubmitted, isSubmit, formData } = this.state;
		return (
			<div className="changePasswordPage">
				<Paper className="loginPagePaper">
							<FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
								<div style = {{paddingBottom:'30px'}}>
								<TextField type="text" name="email" className="chnagePasswordText" label="Email "  onChange={this.handleInputChange} 
									error={!this.isEmailValid() && isSubmit}
									helperText={
									!this.isEmailValid() && isSubmit
										? "Please Enter a Valid Email"
										: ""
									}
								/>
								</div>
							</FormGroup >
							<FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
								<div>
								<TextField type="password" className="chnagePasswordText" name="password" label="Password" onChange={this.handleInputChange} />
									<FormHelperText>{errors.password}</FormHelperText> 
								</div>
							</FormGroup>
						<div className="loginPageButtonDiv">
						<Button type="submit" onClick={(e) => this.login(e)} disabled={!formData.email || !formData.password} variant="contained" className="button-colors sign-upbtn">Sign-In</Button>	
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