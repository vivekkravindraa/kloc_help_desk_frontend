import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Item } from 'semantic-ui-react';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import '../App.css';

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
        axios.get(`${baseURL}/applications/${id}`, {headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                appData: response.data,
                appName: response.data.name,
                appDescription: response.data.description,
                appNameChars: response.data.name.length,
                appDescriptionChars: response.data.description.length,
                moderators: response.data.user
            })
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
            editMode: false,
            isSuccess: false,
            isNotMinimum: false,
            minName: '',
            minDescription: ''
        })
        this.getApplication()
    }

    handleMinName = () => {
        if(this.state.appName.length < 3) {
            this.setState({
                minName: 'Should be at least 3 characters!'
            })
        }
    }
    handleMinDescription = () => {
        if(this.state.appDescription.length < 10) {
            this.setState({
                minDescription: 'Should be at least 10 characters!'
            })
        }
    }

    handleUpdateApplication = (e) => {
        e.preventDefault();

        if(this.state.appName === '' || this.state.appDescription === '') {
            this.setState({ isEmpty: true })
        } else if(this.state.appName.length < 10 || this.state.appDescription.length < 50) {
            this.setState({ isNotMinimum: true })
        }
        else if(this.state.appName !== '' && this.state.appDescription !== '') {
            let formData = {
                name: this.state.appName,
                description: this.state.appDescription
            }

            axios.put(`${baseURL}/applications/${this.state.appData._id}`, formData, {headers: {'x-auth': localStorage.getItem('x-auth')}})
            .then((response) => {
                this.setState({
                    appData: response.data,
                    appName: response.data.name,
                    appDescription: response.data.description,
                    isSuccess: true,
                    editMode: false
                })
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

    handleDeleteApplication = () => {
        let id = this.props.location.state.appId;
        axios.delete(`${baseURL}/applications/${id}/archive`, {headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                isArchived: true
            })
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

    render() {
        if(!decodeToken()) {
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
                        Successfully removed the application!
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
                    !this.state.editMode ?
                    <div>
                        {
                            !this.state.isArchived ?
                            (
                                <div style={{textAlign: "center"}}>
                                    <h2>Application</h2>
                                    <Item.Group>
                                        <Item>
                                            <Item.Content>
                                                <Item.Meta>Name:</Item.Meta>
                                                <Item.Header as='a'>{this.state.appData.name}</Item.Header>
                                                <Item.Meta>Description:</Item.Meta>
                                                <Item.Description>
                                                {this.state.appData.description}
                                                </Item.Description>
                                                <Item.Meta>Linked Moderators:</Item.Meta>
                                                <Item.Extra>
                                                    {
                                                        this.state.moderators.length > 0 ?
                                                        this.state.moderators.map((mode, index) => {
                                                            return (
                                                                <h4>
                                                                    <span
                                                                        key={index}
                                                                        className="badge badge-light"
                                                                    >
                                                                    {mode.email}
                                                                    </span>
                                                                </h4>
                                                            )
                                                        })
                                                        :
                                                        <h4>
                                                            <span className="badge badge-success">
                                                                Linked to all moderators.
                                                            </span>
                                                        </h4>
                                                    }
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>
                                    </Item.Group>
                                    {
                                        !this.state.isArchived ?
                                            <div className="btn btn-group">
                                                <div>
                                                <Button.Group>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={this.handleEditApplication}
                                                    >
                                                    Edit
                                                    </button>
                                                    <Button.Or />
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={this.handleDeleteApplication}
                                                    >
                                                    Delete
                                                    </button>
                                                </Button.Group>
                                                </div>
                                            </div>
                                        :   null
                                    }
                                    <Link to="/application">{`<< Back to applications`}</Link>
                                </div>
                            )
                            :   null
                        }
                    </div>
                    :   null
                }
                <div>
                {
                    this.state.editMode ?
                        <div>
                        {
                            this.state.appData !== {} ?
                            (   
                                <div>
                                    <h2 style={{textAlign: "center"}}>Edit application</h2>
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
                                            rows="4"
                                            className="form-control" 
                                            value={this.state.appDescription}
                                            onChange={this.appDescriptionHandle}
                                            onBlur={this.handleMinDescription}
                                            minLength="10"
                                            maxLength="1000"
                                        />
                                        <small>1000 / {1000 - this.state.appDescriptionChars} characters remaining. </small>
                                        <span className="badge badge-danger">{this.state.minDescription}</span>
                                    </div>
                                    <div className="btn btn-group">
                                        <Button.Group>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={this.handleUpdateApplication}
                                        >
                                        Save
                                        </button>
                                        <Button.Or />
                                        <button
                                            className="btn btn-secondary"
                                            onClick={this.handleCancel}
                                        >
                                        Cancel
                                        </button>
                                        </Button.Group>
                                    </div>
                                </div>
                            )
                            :   null
                        }
                        </div>
                    : null
                }
                </div>
            </div>
        )
    }
}