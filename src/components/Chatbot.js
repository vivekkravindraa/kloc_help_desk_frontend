import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";
import axios from "axios";
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';

class InfoForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			mobile: '',
			isEmpty: false,
			isSuccess: false,
			error: {
				statusCode: '',
				message: ''
			}
		}
	}

	onChange = (e) => { this.setState({ [e.target.name]: e.target.value }) }

	handleSubmit = (e) => {
		e.preventDefault();
		const { firstName, lastName, email, mobile } = this.state;

		if (email === '' || mobile === '') {
			this.setState({ isEmpty: true })
			return <ErrorMsg />
		} else if (email !== '' && mobile !== '') {
			this.setState({ isEmpty: false })

			const formData = {
				firstName,
				lastName,
				email,
				mobile
			}

			axios.post(`${baseURL}/chats`, formData)
				.then((response) => {
					if (response.data) {
						this.setState({ isSuccess: true })
					}
				})
				.catch((error) => {
					this.setState({
						error: {
							...this.state.error,
							statusCode: error.response.status ? error.response.status : '',
							message: error.message ? error.message : ''
						}
					})
				})
		}
	}

	render() {
		const { firstName, lastName, email, mobile } = this.state;

		return (
			this.state.isSuccess ? <SuccessMsg />
				:
				<div className="container">
					<p>Our bot is busy! Please leave your contact details for future reference:</p>
					<div className="form-group">
						<label>First Name:</label>
						<input
							className="form-control form-control-sm"
							type="text"
							name="firstName"
							value={firstName}
							onChange={this.onChange}
							required
						/>
					</div>
					<div className="form-group">
						<label>Last Name:</label>
						<input
							className="form-control form-control-sm"
							type="text"
							name="lastName"
							value={lastName}
							onChange={this.onChange}
							required
						/>
					</div>
					<div className="form-group">
						<label>Email: *</label>
						<input
							className="form-control form-control-sm"
							type="email"
							name="email"
							value={email}
							onChange={this.onChange}
							required
						/>
					</div>
					<div className="form-group">
						<label>Mobile: *</label>
						<input
							className="form-control form-control-sm"
							type="text"
							name="mobile"
							value={mobile}
							onChange={this.onChange}
							required
						/>
					</div>
					{this.state.isEmpty ? <ErrorMsg /> : null}
					<button type="submit" onClick={this.handleSubmit}>Submit</button>
				</div>
		)
	}
}

const ErrorMsg = () => {
	return (
		<div className="alert alert-danger">
			Fill all mandatory (*) fields!
    </div>
	)
}

const SuccessMsg = () => {
	return (
		<div className="alert alert-success">
			Success! Thank you! :)
    </div>
	)
}

const steps = [
	{
		id: '1',
		component: <InfoForm />
	}
];

export default class Chatbot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: decodeToken() ? decodeToken()._id : null
		}
	}

	render() {
		return (
			<ChatBot
				recognitionEnable={true}
				// speechSynthesis={{ enable: true, lang: "en" }}
				steps={this.state.isLoggedIn === null ? steps : steps}
				style={{ marginTop: "10px" }}
			/>
		);
	}
}