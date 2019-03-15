import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import kloc from '../images/kloc.jpeg';
import axios from 'axios';
import { baseURL } from '../base_url';
import qs from 'query-string';
import '../App.css';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            fName: '',
            lName: '',
            eMail: '',
            newPwd: '',
            confirmPwd: '',
            checkfName: '',
            checklName: '',
            checkNewPwd: '',
            checkConfirmPwd: '',
            minNewPwd: '',
            minConfirmPwd: '',
            isConfirmed: false,
            isReceived: false,
            isIncorrect: false,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        let temporaryToken = qs.parse(this.props.location.search);
        axios.put(`${baseURL}/users/confirmation?temp=${temporaryToken.temp}`)
        .then((response) => {
            if(response.data && response.status === 200) {
                this.setState({
                    userId: response.data._id,
                    eMail: response.data.email,
                    isConfirmed: false
                })
            }
        })
        .catch((error) => {
            this.setState(() => ({
                error: {
                    ...this.state.error,
                    statusCode: error.response.status,
                    message: `We're sorry. The link has been expired.`
                }
            }))
        })
    }

    fNameHandle = (e) => {
        this.setState({
            checkfName: '',
            fName: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    lNameHandle = (e) => {
        this.setState({
            checklName: '',
            lName: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    eMailHandle = (e) => { this.setState({ eMail: e.target.value }) }
   
    handleNewPwd = (e) => {
        this.setState({
            checkNewPwd: '',
            minNewPwd: '',
            newPwd: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleConfirmPwd = (e) => {
        this.setState({
            checkConfirmPwd: '',
            minConfirmPwd: '',
            confirmPwd: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleMinNewPwd = () => {
        if(this.state.newPwd.length < 8) {
            this.setState({
                minNewPwd: 'Should be at least 8 characters!'
            })
        }
    }
    handleMinConfirmPwd = () => {
        if(this.state.confirmPwd.length < 8) {
            this.setState({
                minConfirmPwd: 'Should be at least 8 characters!'
            })
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        let formData = {
        firstName:
            this.state.fName ?
            this.state.fName.toLowerCase() :
            this.setState({ checkfName: `field can't be blank` }) ,
        lastName:
            this.state.lName ?
            this.state.lName.toLowerCase() :
            this.setState({ checklName: `field can't be blank` }),
        email: this.state.eMail,
        newPassword:
            this.state.newPwd ?
            this.state.newPwd :
            this.setState({ checkNewPwd: `field can't be blank` }),
        confirmPwd:
            this.state.confirmPwd ?
            this.state.confirmPwd :
            this.setState({ checkConfirmPwd: `field can't be blank` })
        }

        if((this.state.newPwd !== this.state.confirmPwd)) {
            this.setState({ isIncorrect: true })
        } else if((this.state.newPwd === this.state.confirmPwd) && (this.state.eMail !== '' && this.state.newPwd !== '' && this.state.confirmPwd !== '')) {
            
            axios.put(`${baseURL}/users/register`, formData, {headers: {'x-auth': localStorage.getItem('x-auth')}})
            .then((response) => {
                if(response) {
                    this.setState({
                        isConfirmed: true
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status,
                        message: `Unable to register! Make sure you've entered the correct details.`
                    }
                }))
            })
        }
    }

    render() {
        return (
            <div className="container register-form col-md-12">
                <div className="container register-form-left col-md-6">
                    <img src={kloc} alt="#" />
                </div>
                <div className="container register-form-right col-md-6">
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
                        {this.state.error.message}
                        </div> 
                    )   : null
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
                    )   : null
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
                    )   : null
                }
                {
                    this.state.isConfirmed
                    ?   
                    (
                        <div>
                            <h6 style={{"textAlign":"center"}}>
                                Successfully Registered.
                                <Link to={{ pathname: "/login" }}> Login</Link>
                            </h6>
                        </div>
                    ) 
                    :
                    (
                        <div>
                            <h1>Register</h1>
                            <form onSubmit={this.handleUpdate}>
                                <div className="form-group">
                                    <label>First Name <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checkfName}
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.fName}
                                        onChange={this.fNameHandle}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checklName}
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.lName}
                                        onChange={this.lNameHandle}
                                    />
                                </div> 
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={this.state.eMail}
                                        onChange={this.eMailHandle}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checkNewPwd}
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={this.handleNewPwd}
                                        onBlur={this.handleMinNewPwd}
                                        value={this.state.newPwd}
                                    />
                                    <span className="badge badge-danger">
                                        {this.state.minNewPwd}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password <sup>* </sup>
                                        <span className="badge badge-danger">
                                            {this.state.checkConfirmPwd}
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={this.handleConfirmPwd}
                                        onBlur={this.handleMinConfirmPwd}
                                        value={this.state.confirmPwd}
                                    />
                                    <span className="badge badge-danger">
                                        {this.state.minConfirmPwd}
                                    </span>
                                </div>
                                <button
                                    style={{ backgroundColor: "yellowgreen", color: "black", border: 0 }}
                                    className="btn btn-secondary btn-lg btn-block"
                                >
                                Submit
                                </button>
                            </form>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}