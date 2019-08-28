import React, { Component } from 'react';
import{ connect } from 'react-redux';
import { Button, Panel } from 'react-bootstrap';
import { forgetPassword } from '../actions/loginActions';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false,
			value:'' // Indicates in progress state of login form
		};
		this.updateInput = this.updateInput.bind(this);
	}
	
	getConfirmtionMessage(e) {
		e.preventDefault();
		let emailAdd = {
			"email": this.state.value
		};
		this.props.forgetPassword(JSON.stringify(emailAdd));
	}
	
	handleInputChange = ({target}) => {
		const { value, name } = target;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData
		});
	}

	login = (e) => {
		e.preventDefault();
		if (errors === true){
			this.props.changePassword(this.state.formData);
		} else {
			this.setState({
				errors,
				formSubmitted: true
			});
		}
	}

	updateInput(evt){
		this.setState({value: evt.target.value})   
	}

	render(){
		const { errors, formSubmitted } = this.state;
		return(
			<div className='forgotPassword'>
				<div className='frgtpassheading'>Forgot Password</div>
				<Panel>
					<Panel.Body>
						<input type="text" ref="emailAddrss" className='frgtpassfield' onChange={this.updateInput} placeholder="Enter Email Id"></input>
						<Button className='frgtpassbtn' bsStyle="primary" onClick={(e) => {this.getConfirmtionMessage(e)}}>Send Link</Button>
					</Panel.Body>
				</Panel>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		forgetPasswordChanged: state.loginData.forgetPasswordChanged
	};
};

const mapDispatchToProps = dispatch => ({
	forgetPassword: (data) => dispatch(forgetPassword(data))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);