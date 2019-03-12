import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import kloc from '../images/kloc.jpeg';
import axios from 'axios';
import { baseURL } from '../base_url';
import '../App.css';

const validator = require('validator');

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmEmail: '',
            checkConfirmEmail: '',
            isEmpty: false,
            isSent: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    handleConfirmEmail = (e) => {
        if(validator.isEmail(e.target.value)) {
            e.target.className = "form-control is-valid"
        } else {
            e.target.className = "form-control is-invalid"
        }

        this.setState({
            confirmEmail: e.target.value,
            checkConfirmEmail: '',
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let formData = { email: this.state.confirmEmail }

        if(this.state.confirmEmail === '') {
            this.setState({
                checkConfirmEmail: `field can't be blank!`,
                isEmpty: true
            })
        } else {
            axios.post(`${baseURL}/users/forgot_password`,formData)
            .then((response) => {
                if(response.data) {
                    this.setState({
                        isSent: true
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status,
                        message: error.message
                    }
                }))
            })
        }
    }

    render() {
        return (
            <div className="container forgot-password-form col-md-12">
                <div className="container forgot-password-form-left col-md-6">
                    <img src={kloc} alt="#" />
                </div>
                <div className="container forgot-password-form-right col-md-6">
                {   
                    this.state.error.message !== '' ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.error.message !== '' ? 'visible' : 'hidden'
                            }}
                            className="alert alert-danger"
                            role="alert"
                        >
                        Email doesn't exist!
                        </div>
                    )   :   null
                }
                {   
                    this.state.isEmpty ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.isEmpty ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                        Please enter the email id!
                        </div>
                    )   :   null
                }
                {
                    this.state.isSent ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.isSent ? 'visible' : 'hidden'
                            }}
                            className="alert alert-success"
                            role="alert"
                        >
                        Password reset link has been sent to your registered mail id.
                        Please visit your mail. If not found, check your spam folder. 
                        <Link to="/login"> Go to login >></Link>
                        </div>
                    )   :   null
                }
                {
                    !this.state.isSent ?
                    (
                        <div>
                            <h1>Forgot password</h1>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Confirm email <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checkConfirmEmail}
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                        className="form-control"
                                        value={this.state.confirmEmail}
                                        onChange={this.handleConfirmEmail}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{ backgroundColor:"darkblue" }}
                                    className="btn btn-secondary btn-lg btn-block"
                                >
                                Submit
                                </button>
                                <p style={{ textAlign: "center",marginTop: "10px" }}>
                                    Don't want to change? <Link to="/login">Login</Link>
                                </p>
                            </form>
                        </div>
                    )
                    :   null
                }
                </div>
            </div>
        )
    }
}