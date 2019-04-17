import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import kloc from '../images/kloc.jpeg';
import '../App.css';

const validator = require('validator');

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            checkEmail: '',
            checkPassword: '',
            minPassword: '',
            errorMsg: '',
            userData: {},
            isLoggedin: false,
            isEmpty: false, 
            error: {
                statusCode: '',
                message: ''
            }
        }
    }
    
    handleLoginEmail = (e) => {
        if(validator.isEmail(e.target.value)) {
            e.target.className = "form-control is-valid"
        } else {
            e.target.className = "form-control is-invalid"
        }

        this.setState({
            checkEmail: '',
            loginEmail: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleLoginPassword = (e) => {
        this.setState({
            checkPassword: '',
            minPassword: '',
            loginPassword: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleMinPassword = () => {
        if(this.state.loginPassword.length < 8) {
            this.setState({
                minPassword: 'Should be at least 8 characters!'
            })
        }
    }

    handleLoginSubmit = (e) => {
        e.preventDefault();

        let formData = {
        email:
            this.state.loginEmail ?
            this.state.loginEmail.toLowerCase() :
            this.setState({ checkEmail: `field can't be blank` }),
        password:
            this.state.loginPassword ?
            this.state.loginPassword :
            this.setState({ checkPassword: `field can't be blank` })
        }

        if(this.state.loginEmail !== '' && this.state.loginPassword !== '') {
            axios.post(`${baseURL}/users/login`, formData)
            .then((response) => {
                if(response.headers && response.headers['x-auth']) {
                    localStorage.setItem('x-auth',response.headers['x-auth']);    
                    this.setState(() => ({ 
                        isLoggedin: true 
                    }))          
                }
            })
            .catch((error) => {
                if(error.statusCode === undefined) {
                    return null;
                }
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status ? error.response.status : '',
                        message: error.message ? error.message : ''
                    }
                }))
            })
        }
    }
  
    render() {
        if (decodeToken() && decodeToken().role === 'admin') {
            return <Redirect to="/tickets" />
        } else if(decodeToken() && decodeToken().role === 'customer') {
            return <Redirect to="/my_tickets" />
        } else if(decodeToken() && decodeToken().role === 'moderator') {
            return <Redirect to="/moderator_tickets" />
        } else {
            return (
                <div className="container login-form col-md-12">
                    <div className="container login-form-left col-md-6">
                        <img src={kloc} alt="#" />
                    </div>
                    <div className="container login-form-right col-md-6">
                        {   
                            this.state.error.message ?
                            (
                                <div
                                    style={{ 
                                        textAlign: "center",
                                        visibility: this.state.error.message !== '' ? 'visible' : 'hidden'
                                    }}
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                Email doesn't exist or invalid password!
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
                                Please enter the requried credentials!
                                </div>
                            )   :   null
                        }
                        <h1>Login</h1>
                        <form onSubmit={this.handleLoginSubmit}>
                            <div className="form-group">
                                <label>Email <sup>* </sup> 
                                    <span className="badge badge-danger">
                                        {this.state.checkEmail}
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={this.state.loginEmail}
                                    onChange={this.handleLoginEmail}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password <sup>* </sup> 
                                    <span className="badge badge-danger">
                                        {this.state.checkPassword}
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={this.state.loginPassword}
                                    onChange={this.handleLoginPassword}
                                    onBlur={this.handleMinPassword}
                                />
                                <span className="badge badge-danger">
                                    {this.state.minPassword}
                                </span>
                            </div>
                            <button
                                type="submit"
                                style={{backgroundColor:"darkblue"}}
                                className="btn btn-secondary btn-lg btn-block">
                                Login
                            </button>
                        </form>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            Don't have an account? <Link to="/signup">Signup</Link>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            <Link to="/forgot_password">Forgot password?</Link>
                        </p>
                    </div>
                </div>
            )
        }
    }
}