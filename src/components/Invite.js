import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import '../App.css';

const validator = require('validator');

export default class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            moderators: [{ email: '' }],
            notice: [],
            duplicates: [],
            isSuccess: false,
            isAdded: true,
            isInvalid: true,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    handleAddModerator = () => {
        this.setState({
            moderators: this.state.moderators.concat([{ email: '' }]),
            isSuccess: false,
            isAdded: true,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleRemoveModerator = (index) => () => {
        this.setState({
            moderators: this.state.moderators.filter((s, sindex) => index !== sindex),
            isSuccess: false,
            isAdded: true,
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleModeratorEmail = (index) => (evt) => {
        const newModerators = this.state.moderators.map((moderator, sindex) => {
            if (index !== sindex) return moderator;
            return { ...moderator, email: evt.target.value };
        });

        this.setState({
            moderators: newModerators,
            isSuccess: false,
            isAdded: true,
            error: {
                statusCode: '',
                message: ''
            }
        });
    }

    handleSubmit = evt => {
        evt.preventDefault();

        let moderators = this.state.moderators;
        let formData = { email: this.state.moderators };
    
        if (this.state.moderators.length === 0) {
            this.setState({ isAdded: false })
        } else {
            let array = [];
            let emailValid = true;
            
            for (let i = 0; i < moderators.length; i++) {
                array.push(moderators[i].email);
                if (!validator.isEmail(moderators[i].email)) {
                    emailValid = false;
                }
            }
            
            let result = [];
            let duplicates = [];
            for (let j = 0; j < array.length; j++) {
                if (array.indexOf(array[j]) === array.lastIndexOf(array[j])) {
                    result.push(array);
                } else {
                    duplicates = array.reduce(function(acc, el, i, arr) {
                        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
                    }, []);
                }
            }

            this.setState({ duplicates: duplicates })

            if (array.length === result.length && emailValid) {
                axios.post(`${baseURL}/users/invitation`, formData, {headers: { 'x-auth': localStorage.getItem('x-auth') }})
                .then(response => {
                    if (response.data && response.status === 200) {
                        this.setState({
                            isSuccess: true
                        });
                    }
                })
                .catch(error => {
                    this.setState(() => ({
                        error: { 
                            ...this.state.error,
                            statusCode: error.response.status ? error.response.status : '',
                            message: `User(s) already exists! Please remove the following email(s) in the list:`,
                        },
                        notice: error.response.data.notice ? error.response.data.notice: []
                    }))
                });
            } else {
                this.setState(() => ({
                    error: {
                        statusCode: '',
                        message: `Avoid invalid emails!`
                    }
                }))
            }
        }
    }

    render() {
        if (!decodeToken() || (decodeToken().role !== 'admin')) {
            return <Redirect to="/login" />
        }
        return (
            <div className="container">
                <Navigation />
                {
                    this.state.error.message ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: this.state.error.message ? 'visible' : 'hidden'
                            }}
                            className="alert alert-danger"
                            role="alert"
                        >
                        {
                            this.state.error.statusCode === 409
                            ?
                                <div>
                                    {this.state.error.message}
                                    {this.state.notice.map((obj, index) => {
                                        return (
                                            <li
                                                key={index}
                                                style={{ fontWeight: "bold" }}
                                            >
                                            {obj.email}
                                            </li>
                                        )
                                    })}
                                </div>
                            :   
                                <div>
                                    Avoid duplicate email(s) listed below:
                                    {
                                        this.state.duplicates.length > 0 ?
                                        this.state.duplicates.map((email,index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    style={{ fontWeight: "bold" }}
                                                >
                                                {email}
                                                </li>
                                            )
                                        })
                                        :   null
                                    }
                                </div>
                        }
                        </div>
                    )
                    :   null 
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
                        Invitation sent successfully to the following mails!
                        {
                            this.state.moderators.length > 0 ?
                            this.state.moderators.map((mode,index) => {
                                return (
                                    <li key={index}>{mode.email}</li>
                                )
                            })
                            :   null
                        }
                        </div>
                    )   :   null
                }
                {
                    !this.state.isAdded ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: !this.state.isAdded ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                        Moderator(s) Required! Please click on 'Add Moderator' below.
                        </div>
                    )   :   null
                }
                {
                    !this.state.isSuccess
                    ?   <form style={{ textAlign:"center" }} onSubmit={this.handleSubmit}>
                            <h2>Invite moderator(s)</h2>
                            {this.state.moderators.map((moderator, index) => (
                                <div className="form-group" key={index}>
                                    <input
                                        className="form-control"
                                        type="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                        placeholder={`Moderator #${index + 1} Email`}
                                        value={moderator.email}
                                        onChange={this.handleModeratorEmail(index)}
                                        maxLength={140}
                                        required
                                    />
                                    <button
                                        className="btn btn-light btn-sm btn-block"
                                        type="button"
                                        style={{ "marginTop": "4px" }}
                                        onClick={this.handleRemoveModerator(index)}
                                    >
                                    Remove Email
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                style={{backgroundColor:"darkblue",color:"white"}}
                                className="btn btn-sm btn-block"
                                onClick={this.handleAddModerator}
                            >
                            Add Moderator
                            </button>
                            <button
                                style={{backgroundColor:"yellowgreen"}}
                                className="btn btn-sm btn-block"
                            >
                            Send Invitation
                            </button>
                        </form>
                    :   null
                }   
            </div>
        )
    }
}