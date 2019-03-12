import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import { Card, Icon, Image } from 'semantic-ui-react';
import decodeToken from '../helpers/token';
import logo from '../images/logo.jpg';
import Navigation from './Navigation';
import '../App.css';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: {},
            firstName: '',
            lastName: '',
            mobileNumber: '',
            userId: decodeToken()._id,
            email: '',
            role: '',
            store: '',
            contact: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            checkFirstname: '',
            checkLastname: '',
            checkOldPassword: '',
            checkNewPassword: '',
            checkConfirmPassword: '',
            minOldPassword: '',
            minNewPassword: '',
            minConfirmPassword: '',
            minMobileNumber: '',
            editMode: false,
            isEmpty: false,
            isIncorrect: false,
            isSuccess: false,
            isChanging: false,
            isChanged: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = () => {
        axios.get(`${baseURL}/users/${this.state.userId}`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                profileData: response.data,
                firstName: response.data.firstName ? response.data.firstName[0].toUpperCase() + response.data.firstName.slice(1) : '',
                lastName: response.data.lastName ? response.data.lastName[0].toUpperCase() + response.data.lastName.slice(1) : '',
                email: response.data.email,
                mobileNumber: response.data.mobileNumber,
                role: response.data.role[0].toUpperCase() + response.data.role.slice(1)
            })
        })
        .catch((error) => {
            this.setState(() => ({
                error: {...this.state.error, statusCode: error.response.status, message: error.message }
            }))
        })
    }

    handleEditProfile = () => {
        this.setState({
            editMode: true,
            isChanged: false,
            isEmpty: false,
            isIncorrect: false,
            isSuccess: false,
            minMobileNumber: ''
        })
    }
    handleCancel = () => {
        this.setState({
            editMode: false,
            isChanging: false,
            isEmpty: false,
            isIncorrect: false,
            isSuccess: false,
            errorMsg: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            checkFirstname: '',
            checkLastname: '',
            checkOldPassword: '',
            checkNewPassword: '',
            checkConfirmPassword: '',
            minOldPassword: '',
            minNewPassword: '',
            minConfirmPassword: '',
            minMobileNumber: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
        this.getUser()
    }

    firstNameHandle = (e) => {
        this.setState({
            firstName: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    lastNameHandle = (e) => {
        this.setState({
            lastName: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    mobileNumberHandle = (e) => {
        this.setState({
            mobileNumber: e.target.value,
            minMobileNumber: '',
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    storeHandle = (e) => {
        this.setState({
            store: e.target.value,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleChangePassword = () => {
        this.setState({
            editMode: true,
            isChanging: true
        })
    }

    handleOldPassword = (e) => {
        this.setState({
            checkOldPassword: '',
            minOldPassword: '',
            oldPassword: e.target.value,
            isEmpty: false,
            isIncorrect: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
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

    handleMinOldPassword = () => {
        if(this.state.oldPassword.length < 8) {
            this.setState({
                minOldPassword: 'Should be at least 8 characters!'
            })
        }
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
    handleMinMobileNumber = () => {
        if(this.state.mobileNumber.length !== 10) {
            this.setState({
                minMobileNumber: 'Should be equal to 10 digits!'
            })
        }
    }

    handleSubmitPassword = (e) => {
        e.preventDefault();

        if(this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ isIncorrect: true })
        } else {
            
            let formData = {
            oldPassword:
                this.state.oldPassword
                ?   this.state.oldPassword
                :   this.setState({ checkOldPassword: `field can't be blank!` }),
            newPassword:
                this.state.newPassword
                ?   this.state.newPassword
                :   this.setState({ checkNewPassword: `field can't be blank!` }),
            confirmPassword:
                this.state.confirmPassword
                ?   this.state.confirmPassword
                :   this.setState({ checkConfirmPassword: `field can't be blank` })
            }

            if((this.state.oldPassword !== '' && this.state.newPassword !== '' && this.state.confirmPassword !== '') && (this.state.newPassword === this.state.confirmPassword)) {
                axios.put(`${baseURL}/users/${this.state.userId}/change_password`,formData,{headers: {'x-auth': localStorage.getItem('x-auth')}})
                .then((response) => {
                    if(response.data) {
                        this.setState({
                            isChanged: true,
                            isChanging: false,
                            editMode: false,
                            profileData: response.data
                        })
                    }
                })
                .catch((error) => {
                    this.setState(() => ({
                        error: {
                            ...this.state.error,
                            statusCode: error.response.status,
                            message: `Incorrect old password.`
                        }
                    }))
                })
            }
        }
    }

    handleUpdateProfile = (e) => {
        e.preventDefault();

        if(this.state.firstName === '' && this.state.lastName === '' && this.state.mobileNumber === '') {
            this.setState({ isEmpty: true })
        } else {

            let formData = {
                firstName:
                    this.state.firstName
                    ?   this.state.firstName
                    :   this.setState({ checkFirstname: `field can't be blank`}),
                lastName:
                    this.state.lastName
                    ?   this.state.lastName
                    :   this.setState({ checkLastname: `field can't be blank`}),
                mobileNumber: this.state.mobileNumber
            }

            if(this.state.firstName !== '' && this.state.lastName !== '') {
                axios.put(`${baseURL}/users/${this.state.profileData._id}`,formData,{headers: {'x-auth': localStorage.getItem('x-auth')}})
                .then((response) => { 
                    if(response.data) {
                        this.setState({
                            isSuccess: true,
                            editMode: false,
                            profileData: response.data
                        })
                    }
                })
                .catch((error) => {
                    this.setState(() => ({
                        error: {
                            ...this.state.error,
                            statusCode: error.response.status,
                            message: `Unable to update the profile! Please try again.`
                        }
                    }))
                })
            }
        }
    }

    render() {
        if(!decodeToken()) {
            return <Redirect to="/login" />
        } 
        return (
            <div className="container">
                <Navigation />
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
                            className="alert alert-danger"
                            role="alert"
                        >
                        Passwords does not match!
                        New password and confirm password should be same!
                        </div>
                    )   :   null
                }
                {
                    this.state.isSuccess ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.isSuccess ? 'visible' : 'hidden'
                            }}
                            className="alert alert-success"
                            role="alert"
                        >
                        Successfully updated!
                        </div>
                    )   :   null
                }
                {
                    this.state.isChanged ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.isChanged ? 'visible' : 'hidden'
                            }}
                            className="alert alert-success"
                            role="alert"
                        >
                        Successfully changed password!
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
                        Please fill all mandatory * fields!
                        </div>
                    )   :   null
                }
                {
                    this.state.profileData === {} ?
                    (
                        <div
                            style={{ 
                                textAlign: "center",
                                visibility: this.state.profileData === {} ? 'visible' : 'hidden'
                            }}
                            className="alert alert-info"
                            role="alert"
                        >
                        No data found!
                        </div>
                    )   :   null
                }
                {
                    this.state.editMode
                    ?
                        this.state.profileData !== {}
                        ?   
                            this.state.isChanging
                            ?
                            (
                                <div>
                                    <h2 style={{textAlign:"center"}}>Change password</h2>
                                    <div className="form-group">
                                        <label>Old password <sup>* </sup>
                                            <span className="badge badge-danger">
                                                {this.state.checkOldPassword}
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={this.state.oldPassword}
                                            onChange={this.handleOldPassword}
                                            onBlur={this.handleMinOldPassword}
                                        />
                                        <span className="badge badge-danger">
                                            {this.state.minOldPassword}
                                        </span>
                                    </div>
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
                                    <div className="btn-group">
                                        <button
                                            className="btn"
                                            style={{ backgroundColor:"orange", color:"black", border:0 }}
                                            onClick={this.handleCancel}
                                        >
                                        Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{ backgroundColor:"yellowgreen", color:"black", border:0 }}
                                            onClick={this.handleSubmitPassword}
                                        >
                                        Save
                                        </button>
                                        <button
                                            style={{ backgroundColor:"darkblue", color:"white", outline:0 }}
                                            className="btn"
                                            onClick={() => {
                                                this.setState(() => ({
                                                    isChanging: false,
                                                    checkOldPassword: false,
                                                    checkNewPassword: false,
                                                    checkConfirmPassword: false,
                                                    minOldPassword: false,
                                                    minNewPassword: false,
                                                    minConfirmPassword: false
                                                }))
                                            }}
                                        >
                                        Edit Profile
                                        </button>
                                    </div>
                                </div>
                            )        
                            :
                            (
                                <div>
                                    <h2 style={{textAlign:"center"}}>Edit profile</h2>
                                    <div className="form-group">
                                        <label>First name <sup>* </sup><span className="badge badge-danger">
                                            {this.state.checkFirstname}
                                        </span></label>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            value={this.state.firstName}
                                            onChange={this.firstNameHandle} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last name <sup>* </sup><span className="badge badge-danger">
                                            {this.state.checkLastname}
                                        </span></label>
                                        <input 
                                            type="text"
                                            className="form-control" 
                                            value={this.state.lastName}
                                            onChange={this.lastNameHandle}
                                        />
                                    </div>
                                    {
                                        this.state.role === 'customer' ?
                                            <div className="form-group">
                                            <label>Store <small>(Optional)</small></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.store}
                                                onChange={this.storeHandle}
                                            />
                                        </div>
                                        :   null
                                    }
                                    <div className="form-group">
                                        <label>Mobile number</label>
                                        <input 
                                            type="text"
                                            className="form-control" 
                                            value={this.state.mobileNumber}
                                            onChange={this.mobileNumberHandle}
                                            onBlur={this.handleMinMobileNumber}
                                        />
                                        <span className="badge badge-danger">
                                            {this.state.minMobileNumber}
                                        </span>
                                    </div>
                                    <div className="btn-group">
                                        <button
                                            className="btn"
                                            style={{
                                                backgroundColor:"orange",
                                                color:"black",
                                                border:0,
                                                outline:0
                                            }}
                                            onClick={this.handleCancel}
                                        >
                                        Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{
                                                backgroundColor:"yellowgreen",
                                                color:"black",
                                                border:0,
                                                outline:0
                                            }}
                                            onClick={this.handleUpdateProfile}
                                        >
                                        Save
                                        </button>
                                        <button
                                            className="btn"
                                            style={{
                                                backgroundColor:"darkblue",
                                                color:"white"
                                            }}
                                            onClick={this.handleChangePassword}
                                        >
                                        Change password
                                        </button>
                                    </div>
                                </div>
                            )
                        :   null
                    :   
                    (
                        <div style={{ textAlign: "center" }}>
                            <h2>User profile</h2>
                            <button
                                style={{ backgroundColor:"darkblue" }}
                                className="btn btn-secondary"
                                onClick={this.handleEditProfile}
                            >
                            Edit
                            </button>
                            <Card className="segment centered">
                                <Image src={logo} />
                                <Card.Content>
                                    <Card.Header>
                                    {this.state.profileData.firstName ? this.state.profileData.firstName.toUpperCase()[0] + this.state.profileData.firstName.slice(1) : ''} {this.state.profileData.lastName ? this.state.profileData.lastName.toUpperCase()[0] + this.state.profileData.lastName.slice(1) : ''}
                                    </Card.Header>
                                    <Card.Meta>
                                    <span className='date'>{this.state.profileData.mobileNumber}</span>
                                    </Card.Meta>
                                    <Card.Description>{this.state.profileData.email}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <button>
                                    <Icon name='user' />
                                    {this.state.role}
                                    </button>
                                </Card.Content>
                            </Card>
                        </div>
                    )
                }
            </div>
        )
    }
}