import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import ReactTable from 'react-table';
import Select from 'react-select';
import Navigation from './Navigation';
import '../App.css';

export default class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appName: '',
            appDescription: '',
            minName: '',
            minDescription: '',
            appData: [],
            filterData: [],
            moderators: [],
            newObj: {},
            isEmpty: false,
            isSuccess: false,
            selectedOption: null,
            appNameChars: 0,
            appDescriptionChars: 0,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        this.getApplications();

        axios.get(`${baseURL}/users?user=moderator`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                let data = response.data.map((mode) => ({
                    value: mode._id,
                    label: mode.email
                }))
                this.setState({
                    moderators: data
                })
            })
            .catch((error) => {
                this.setState({
                    moderators: []
                })
            })
    }

    getApplications = () => {
        axios.get(`${baseURL}/applications`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                this.setState({
                    appData: response.data,
                    filterData: response.data
                })
            })
            .catch((error) => {
                this.setState({
                    appData: [],
                    filterData: []
                })
            })
    }

    handleName = (e) => {
        this.setState({
            appName: e.target.value,
            appNameChars: e.target.value.length,
            isEmpty: false,
            isSuccess: false,
            minName: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleDescription = (e) => {
        this.setState({
            appDescription: e.target.value,
            appDescriptionChars: e.target.value.length,
            isEmpty: false,
            isSuccess: false,
            minDescription: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }
    handleChange = (selectedOption) => {
        this.setState({
            selectedOption,
            isEmpty: false,
            isSuccess: false,
            error: {
                statusCode: '',
                message: ''
            }
        })
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

    handleAddApplication = (e) => {
        e.preventDefault();

        if (this.state.appName === '' || this.state.appDescription === '') {
            this.setState({ isEmpty: true })
        } else if (this.state.appName !== '' && this.state.appDescription !== '') {
            let formData = {
                name: this.state.appName,
                description: this.state.appDescription,
                user: this.state.selectedOption === null ? [] : this.state.selectedOption.map((option) => option.value)
            }

            axios.post(`${baseURL}/applications`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
                .then((response) => {
                    this.getApplications();
                    this.setState({
                        newObj: response.data
                    })
                    let newData = [];
                    newData.push(this.state.newObj)
                    this.setState({
                        isSuccess: true,
                        appData: this.state.appData.concat(newData),
                        appName: '',
                        appDescription: '',
                        selectedOption: null
                    })
                })
                .catch((error) => {
                    this.setState(() => ({
                        error: {
                            ...this.state.error,
                            statusCode: error.response.status,
                            message: `Unable to add application / application already exists.`
                        }
                    }))
                })
        }
    }

    render() {
        if (!decodeToken() || (decodeToken().role !== 'admin')) {
            return <Redirect to="/login" />
        }

        const columns = [
            {
                Header: "Name",
                accessor: "name",
                resizable: false,
                width: 250
            },
            {
                Header: "Description",
                accessor: "description",
                Cell: props => (
                    <div>
                        {
                            props.original.description.length > 100
                                ? props.original.description.slice(0, 49) + ' ..'
                                : props.original.description
                        }
                        {
                            props.original.description.length > 100
                                ?
                                (
                                    <button
                                        className="btn btn-outline-basic btn-sm"
                                        onClick={this.handleViewMore}
                                    >
                                        <Link to={{
                                            pathname: "/manage_application",
                                            state: {
                                                appId: `${props.original._id}`
                                            }
                                        }}>
                                        <u>view more</u>
                            </Link>
                                    </button>
                                )
                                : null
                        }
                    </div>
                ),
                resizable: false,
                width: 500
            },
            {
                Header: "Moderators",
                accessor: "user",
                Cell: props => (
                    props.original.user.length > 0
                        ?
                        props.original.user.map((mode, index) => {
                            return (
                                <p key={index}>{mode.email}</p>
                            )
                        })
                        : <b>Linked to all moderators.</b>
                ),
                resizable: false,
                width: 250
            },
            {
                Header: "Edit",
                accessor: "",
                Cell: props => (
                    <Link to={{
                        pathname: "/manage_application",
                        state: {
                            appId: `${props.original._id}`
                        }
                    }}>
                        Edit
                    </Link>
                ),
                resizable: false,
                sortable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100
            }
        ]

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
                            Application successfully added!
                    </div>
                    )   :   null
                }
                <form onSubmit={this.handleAddApplication}>
                    <h2 style={{ textAlign: "center" }}>Add topic</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.appName}
                            onChange={this.handleName}
                            onBlur={this.handleMinName}
                            placeholder="Name *"
                            minLength="3"
                            maxLength="50"
                        />
                        <small>50 / {50 - this.state.appNameChars} characters remaining. </small>
                        <span className="badge badge-danger">{this.state.minName}</span>
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows="3"
                            value={this.state.appDescription}
                            onChange={this.handleDescription}
                            onBlur={this.handleMinDescription}
                            placeholder="Description *"
                            minLength="10"
                            maxLength="1000"
                        >
                        </textarea>
                        <small>1000 / {1000 - this.state.appDescriptionChars} characters remaining. </small>
                        <span className="badge badge-danger">{this.state.minDescription}</span>
                    </div>
                    <div className="form-group">
                        <Select
                            isMulti
                            name="moderators"
                            placeholder="Select Moderators.."
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.moderators}
                        />
                    </div>
                    <button
                        style={{ backgroundColor: "yellowgreen" }}
                        className="btn btn-md btn-block"
                    >
                        Submit
                    </button>
                </form>
                {
                    this.state.appData.length === 0 ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: this.state.appData.length === 0 ? 'visible' : 'hidden'
                            }}
                            className="alert alert-info"
                            role="alert"
                        >
                            No applications found!
                        </div>
                    )   :   null
                }
                {
                    this.state.appData.length > 0 ?
                    (
                        <div style={{ marginTop: 10, textAlign: "center" }}>
                            <ReactTable
                                columns={columns}
                                data={this.state.filterData}
                                defaultPageSize={5}
                                noDataText={"No data found!"}
                            >
                            </ReactTable>
                        </div>
                    )
                    :   null
                }
            </div>
        )
    }
}