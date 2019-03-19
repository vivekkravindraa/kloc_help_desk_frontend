import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import kloc from '../images/kloc.jpeg';
import axios from 'axios';
import { baseURL } from '../base_url';
import '../App.css';

const validator = require('validator');

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            signupEmail: '',
            signupPassword: '',
            confirmPassword: '',
            minSignupPassword: '',
            checkFirstname: '',
            checkLastname: '',
            checkEmail: '',
            checkPassword: '',
            checkConfirmPassword: '',
            minConfirmPassword: '',
            isSuccess: false,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    handleFirstname = (e) => {
        this.setState({
            checkFirstname: '',
            firstname: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleLastname = (e) => {
        this.setState({
            checkLastname: '',
            lastname: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleSignupEmail = (e) => {
        if(validator.isEmail(e.target.value)) {
            e.target.className = "form-control is-valid"
        } else {
            e.target.className = "form-control is-invalid"
        }

        this.setState({
            checkEmail: '',
            signupEmail: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleSignupPassword = (e) => { 
        this.setState({
            checkPassword: '',
            minSignupPassword: '',
            signupPassword: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleConfirmPassword = (e) => {
        this.setState({
            checkConfirmPassword: '',
            minConfirmPassword: '',
            confirmPassword: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })   
    }

    handleMinSignupPassword = () => {
        if(this.state.signupPassword.length < 8) {
            this.setState({ minSignupPassword: 'Should be at least 8 characters!' })
        }
    }
    handleMinConfirmPassword = () => {
        if(this.state.confirmPassword.length < 8) {
            this.setState({ minConfirmPassword: 'Should be at least 8 characters!' })
        }
    }
  
    handleSignupSubmit = (e) => {
        e.preventDefault();

        let formData = {
        firstName:
            this.state.firstname ?
            this.state.firstname.toLowerCase() :
            this.setState({ checkFirstname: `field can't be blank` }),
        lastName:
            this.state.lastname ?
            this.state.lastname.toLowerCase() : 
            this.setState({ checkLastname: `field can't be blank` }),
        email:
            this.state.signupEmail ?
            this.state.signupEmail.toLowerCase() :
            this.setState({ checkEmail: `field can't be blank` }),
        password:
            this.state.signupPassword ?
            this.state.signupPassword :
            this.setState({ checkPassword: `field can't be blank` }),
        confirm:
            this.state.confirmPassword ?
            this.state.confirmPassword :
            this.setState({ checkConfirmPassword: `field can't be blank` })
        }
        
        if(this.state.signupPassword !== this.state.confirmPassword) {
            this.setState({ isIncorrect: true })
        } else if(this.state.firstname !== '' && this.state.lastname !== '' && this.state.signupEmail !== '' && this.state.signupPassword !== '' && this.state.confirmPassword !== '') {
            axios.post(`${baseURL}/users/signup`, formData)
            .then((response) => {
                if(response) {
                    this.setState({
                        isSuccess: true
                    })
                }
            })
            .catch((error) => {
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
        return (
            <div className="container signup-form col-md-12">
                <div className="container signup-form-left col-md-6">
                    <img src={kloc} alt="#" />
                </div>
                <div className="container signup-form-right col-md-6">
                    {
                        this.state.error.message !== '' ? 
                        (
                            <div 
                                style={{ 
                                    textAlign: "center",
                                    visibility: this.state.error.message !== '' ? 'visible' : 'hidden'}}
                                className="alert alert-danger"
                                role="alert"
                            >
                            Unable to signup, make sure you've entered the correct details!
                            </div>
                        )   :   null
                    }
                    {
                        this.state.isSuccess ? 
                        (
                            <div 
                                style={{ 
                                    textAlign: "center",
                                    visibility: this.state.isSuccess ? 'visible' : 'hidden'}}
                                className="alert alert-success"
                                role="alert"
                            >
                            <h6>
                                Account has been created and the verification link has been sent to your email.
                                Please visit your email to verify. If not found in the inbox, check the spam folder. 
                                <Link to="/"> Go to home >></Link>
                            </h6>
                            </div>
                        )   :   null
                    }
                    {
                        this.state.isIncorrect ?
                        (
                            <div
                                style={{ 
                                    textAlign: "center",
                                    visibility: this.state.isIncorrect ? 'visible' : 'hidden'
                                }}
                                className="alert alert-warning"
                                role="alert"
                            >
                            Passwords does not match!
                            </div>
                        )   :   null
                    }
                    {
                        this.state.isEmpty ?
                        (
                            <div
                                style={{ 
                                    textAlign: "center",
                                    visibility: this.state.isEmpty ? 'visible' : 'hidden'}}
                                className="alert alert-warning"
                                role="alert"
                            >
                            Please enter the required credentials!
                            </div>
                        )   :   null
                    }
                    {
                        this.state.isSuccess
                        ?
                            null
                        :
                        (
                            <div>
                                <h1>Signup</h1>
                                <form onSubmit={this.handleSignupSubmit}>
                                    <div className="form-group">
                                        <label>First name <sup>* </sup>
                                            <span className="badge badge-danger">
                                                {this.state.checkFirstname}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.firstname}
                                            onChange={this.handleFirstname}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last name <sup>* </sup>
                                            <span className="badge badge-danger">
                                                {this.state.checkLastname}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.lastname}
                                            onChange={this.handleLastname}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email <sup>* </sup>
                                            <span className="badge badge-danger">
                                                {this.state.checkEmail}
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={this.state.email}
                                            onChange={this.handleSignupEmail}
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
                                            value={this.state.password}
                                            onChange={this.handleSignupPassword}
                                            onBlur={this.handleMinSignupPassword}
                                        />
                                        <span className="badge badge-danger">
                                            {this.state.minSignupPassword}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password <sup>* </sup>
                                            <span className="badge badge-danger">
                                                {this.state.checkConfirmPassword}
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={this.state.confirmPassword}
                                            onChange={this.handleConfirmPassword}
                                            onBlur={this.handleMinConfirmPassword}
                                        />
                                        <span className="badge badge-danger">
                                            {this.state.minConfirmPassword}
                                        </span>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{backgroundColor:"yellowgreen", color: "black", border: 0}}
                                        className="btn btn-secondary btn-lg btn-block"
                                    >
                                    Signup
                                    </button>
                                </form>
                                <p style={{ textAlign: "center",marginTop: "10px" }}>
                                    Already have an account? <Link to="/login">Login</Link>
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}