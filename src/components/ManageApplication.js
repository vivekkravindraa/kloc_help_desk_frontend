import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Segment, Label, Grid, Icon } from 'semantic-ui-react';
import Rodal from 'rodal';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import '../App.css';
import 'rodal/lib/rodal.css';

var Loader = require('react-loader');

export default class ManageApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moderators: [],
            appData: {},
            appName: '',
            appDescription: '',
            minName: '',
            minDescription: '',
            editMode: false,
            isArchived: false,
            isEmpty: false,
            isSuccess: false,
            isNotMinimum: false,
            visible: false,
            nowDelete: false,
            nowSave: false,
            loaded: false,
            appNameChars: 0,
            appDescriptionChars: 0,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        this.getApplication()
    }

    getApplication = () => {
        let id = this.props.location.state.appId;
        axios.get(`${baseURL}/applications/${id}`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                setTimeout(() => {
                    this.setState({
                        appData: response.data,
                        appName: response.data.name,
                        appDescription: response.data.description,
                        appNameChars: response.data.name.length,
                        appDescriptionChars: response.data.description.length,
                        moderators: response.data.user,
                        loaded: true
                    })
                }, 2000)
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status ? error.response.status : '',
                        message: error.message
                    }
                }))
            })
    }

    appNameHandle = (e) => {
        this.setState({
            appName: e.target.value,
            isEmpty: false,
            isNotMinimum: false,
            appNameChars: e.target.value.length,
            minName: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    appDescriptionHandle = (e) => {
        this.setState({
            appDescription: e.target.value,
            isEmpty: false,
            isNotMinimum: false,
            appDescriptionChars: e.target.value.length,
            minDescription: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleEditApplication = () => {
        this.setState({
            editMode: true,
            isSuccess: false,
            isNotMinimum: false
        })
    }
    handleCancel = () => {
        this.setState({
            loaded: false,
            editMode: false,
            isSuccess: false,
            isNotMinimum: false,
            isEmpty: false,
            minName: '',
            minDescription: ''
        })
        this.getApplication()
    }

    handleMinName = () => {
        if (this.state.appName.length < 3) {
            this.setState({
                minName: 'Should be at least 3 characters!'
            })
        }
    }
    handleMinDescription = () => {
        if (this.state.appDescription.length < 10) {
            this.setState({
                minDescription: 'Should be at least 10 characters!'
            })
        }
    }

    handleUpdateApplication = (e) => {
        e.preventDefault();

        if (this.state.appName === '' || this.state.appDescription === '') {
            this.setState({ isEmpty: true })
        } else if (this.state.appName.length < 3 || this.state.appDescription.length < 10) {
            this.setState({ isNotMinimum: true })
        } else if (this.state.appName !== '' && this.state.appDescription !== '') {
            let formData = {
                name: this.state.appName,
                description: this.state.appDescription
            }

            axios.put(`${baseURL}/applications/${this.state.appData._id}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
                .then((response) => {
                    this.setState({
                        appData: response.data,
                        appName: response.data.name,
                        appDescription: response.data.description,
                        appNameChars: response.data.name.length,
                        appDescriptionChars: response.data.description.length,
                        moderators: response.data.user,
                        isSuccess: true,
                        editMode: false,
                        visible: false,
                        nowSave: false
                    })
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

    show = (e) => {
        if(e.target.innerText === 'Delete') {
            this.setState({
                isSuccess: false,
                visible: true,
                nowDelete: true
            })
        } else {
            this.setState({
                isSuccess: false,
                visible: true,
                nowSave: true
            })
        }
    }
    hide = () => {
        this.setState({
            visible: false,
            nowDelete: false,
            nowSave: false
        })
    }

    handleDeleteApplication = () => {
        let id = this.props.location.state.appId;
        axios.delete(`${baseURL}/applications/${id}/archive`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                this.setState({
                    isArchived: true,
                    visible: false,
                    nowDelete: false
                })
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status ? error.response.status : '',
                        message: error.message
                    }
                }))
            })
    }

    render() {
        if (!decodeToken()) {
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
                            Unable to update the application!
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
                            Successfully updated!
                    </div>
                    )
                    :   null
                }
                {
                    this.state.isArchived ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: this.state.isArchived ? 'visible' : 'hidden'
                            }}
                            className="alert alert-success"
                            role="alert"
                        >
                            Successfully removed the application! <Link to="/application">Click to add Applications.</Link>
                    </div>
                    )
                    :   null
                }
                {
                    this.state.isNotMinimum ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: this.state.isNotMinimum ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                            Please fill all mandatory * fields!
                    </div>
                    )
                    :   null
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
                            Please enter the required details!
                    </div>
                    )
                    :   null
                }
                {
                    this.state.visible ?
                    <Rodal visible={this.state.visible} onClose={this.hide}>
                    {
                        this.state.nowDelete ?
                        (
                            <div>
                                <p>Are you sure you want to delete the application ?</p>
                                <Button
                                    negative
                                    onClick={this.handleDeleteApplication}
                                >
                                    <Icon name='archive' />
                                    Yes
                                </Button>
                            </div>
                        )
                        :   null
                    }
                    {
                        this.state.nowSave ?
                        (
                            <div>
                                <p>Your changes will be saved permanently. Are you sure ?</p>
                                <Button
                                    positive
                                    onClick={this.handleUpdateApplication}
                                >
                                    <Icon name='check' />
                                    Yes
                                </Button>
                            </div>
                        )
                        :   null
                    }
                    </Rodal>
                    :   null
                }
                {
                    this.state.loaded ?
                    !this.state.editMode ?
                    !this.state.isArchived ?
                    (
                        <div>
                            <h2 style={{ textAlign: "center" }}>Application</h2>
                            <Grid.Column>
                                <Segment raised>
                                    <Label as='a' color='blue' ribbon>Name</Label>
                                    <p>{this.state.appName}</p>
                                    <Label as='a' color='blue' ribbon>Description</Label>
                                    <p>{this.state.appDescription}</p>
                                    <Label as='a' color='blue' ribbon>Linked Moderators</Label>
                                    <p>
                                        {
                                            this.state.moderators.length > 0 ?
                                            this.state.moderators.map((mode, index) => {
                                                return (
                                                    <span
                                                        key={index}
                                                    >
                                                        {mode.email}
                                                    </span>
                                                )
                                            })
                                            :
                                            <span>Linked to all moderators.</span>
                                        }
                                    </p>
                                </Segment>
                            </Grid.Column>
                            {
                                !this.state.isArchived ?
                                <Button.Group style={{ marginTop: 10 }}>
                                    <Button
                                        color="blue"
                                        className="btn btn-secondary"
                                        onClick={this.handleEditApplication}
                                    >
                                        <Icon name='edit' />
                                        Edit
                                    </Button>
                                    <Button.Or />
                                    <Button
                                        negative
                                        className="btn btn-secondary"
                                        onClick={this.show}
                                    >
                                        <Icon name="archive" />
                                        Delete
                                    </Button>
                                </Button.Group>
                                : null
                            }
                            <Link style={{ paddingLeft: 10 }} to="/application">{`<< Back to applications`}</Link>
                        </div>
                    )
                    :   null
                    :   null
                    :   null
                }
                {
                    this.state.editMode ?
                    this.state.appData !== {} ?
                    (
                        <div>
                            <h2 style={{ textAlign: "center" }}>Edit application</h2>
                            <div className="form-group">
                                <label>Application Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.appName}
                                    onChange={this.appNameHandle}
                                    onBlur={this.handleMinName}
                                    minLength="3"
                                    maxLength="50"
                                />
                                <small>50 / {50 - this.state.appNameChars} characters remaining. </small>
                                <span className="badge badge-danger">{this.state.minName}</span>
                            </div>
                            <div className="form-group">
                                <label>Application Description *</label>
                                <textarea
                                    type="text"
                                    rows="10"
                                    className="form-control"
                                    value={this.state.appDescription}
                                    onChange={this.appDescriptionHandle.bind(this)}
                                    onBlur={this.handleMinDescription}
                                    minLength="10"
                                    maxLength="1000"
                                />
                                <small>1000 / {1000 - this.state.appDescriptionChars} characters remaining. </small>
                                <span className="badge badge-danger">{this.state.minDescription}</span>
                            </div>
                            <Button.Group>
                                <Button
                                    positive
                                    className="btn btn-secondary"
                                    onClick={this.show}
                                >
                                    <Icon name='save' />
                                    Save
                                </Button>
                                <Button.Or />
                                <Button
                                    primary
                                    className="btn btn-secondary"
                                    onClick={this.handleCancel}
                                >
                                    <Icon name='cancel' />
                                    Cancel
                                </Button>
                            </Button.Group>
                        </div>
                    )
                    :   null
                    :   null
                }
                {
                    this.state.loaded
                    ?   null
                    :   <Loader loaded={this.state.loaded} />
                }
            </div>
        )
    }
}