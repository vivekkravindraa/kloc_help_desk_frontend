import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import kloc from '../images/kloc.jpeg';
import axios from 'axios';
import { baseURL } from '../base_url';
import '../App.css';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            confirmPassword: '',
            checkNewPassword: '',
            checkConfirmPassword: '',
            minNewPassword: '',
            minConfirmPassword: '',
            tempToken: '',
            isEmpty: false,
            isIncorrect: false,
            isReset: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        this.setState({ tempToken: this.props.match.params.tempToken })
    }

    handleNewPassword = (e) => {
        this.setState({
            checkNewPassword: '',
            minNewPassword: '',
            newPassword: e.target.value,
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

    handleMinNewPassword = () => {
        if(this.state.newPassword.length < 8) {
            this.setState({
                minNewPassword: 'Should be at least 8 characters!'
            })
        }
    }
    handleMinConfirmPassword = () => {
        if(this.state.confirmPassword.length < 8) {
            this.setState({
                minConfirmPassword: 'Should be at least 8 characters!'
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let formData = {
        password:
            this.state.newPassword ?
            this.state.newPassword : 
            this.setState({ checkNewPassword: `field can't be blank` }),
        confirm:
            this.state.confirmPassword ?
            this.state.confirmPassword :
            this.setState({ checkConfirmPassword: `field can't be blank` })
        }

        if(this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ isIncorrect: true })
        } else if((this.state.newPassword !== '' && this.state.confirmPassword !=='') &&
        (this.state.newPassword === this.state.confirmPassword)) {
            axios.post(`${baseURL}/users/reset_password?tempToken=${this.state.tempToken}`,formData)
            .then((response) => {
                if(response.data) {
                    this.setState({
                        isReset: true
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {...this.state.error, statusCode: error.response.status, message: error.message }
                }))
            })
        }
    }

    render() {
        return (
            <div className="container reset-password-form col-md-12">
                <div className="container reset-password-form-left col-md-6">
                    <img src={kloc} alt="#" />
                </div>
                <div className="container reset-password-form-right col-md-6">
                {
                    this.state.isReset ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.isReset ? 'visible' : 'hidden'
                            }}
                            className="alert alert-success"
                            role="alert"
                        >
                        Successfully changed the password. Click here to<Link to="/login"> Login</Link>
                        </div>
                    )   :   null
                }
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
                        Email doesn't exist or invalid password!
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
                                visibility: this.state.isEmpty ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                        Please enter the required credentials!
                        </div>
                    )   :   null
                }
                {
                    !this.state.isReset ?
                    (
                        <div>
                            <h1 style={{"textAlign":"center"}}>Reset Password</h1>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>New password <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checkNewPassword}
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.state.newPassword}
                                        onChange={this.handleNewPassword}
                                        onBlur={this.handleMinNewPassword}
                                    />
                                    <span className="badge badge-danger">
                                        {this.state.minNewPassword}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <label>Confirm password <sup>* </sup>
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
                                    style={{ backgroundColor:"darkblue"}}
                                    className="btn btn-secondary btn-lg btn-block">
                                    Submit
                                </button>
                            </form>
                            <p style={{ textAlign: "center", marginTop: "10px" }}>
                                Don't want to change? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    )
                    :   null
                }
                </div>
            </div>
        )
    }
}