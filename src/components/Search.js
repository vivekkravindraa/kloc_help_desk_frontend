import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import '../App.css';

var Loader = require('react-loader');

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            loaded: false,
            userId: decodeToken() ? decodeToken()._id : null,
            email: decodeToken() ? decodeToken().email : null,
            searchData: [],
            filterData: [],
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        axios.get(`${baseURL}/applications`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            if(response.data) {
                setTimeout(() => {
                    this.setState({
                        loaded: true,
                        searchData: response.data,
                        filterData: response.data
                    })
                }, 2000)
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

    handleSearch = (e) => {
        e.persist();
        this.setState(prevState => ({
            filterData: prevState.searchData.filter((app) => app.name.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0),
            search: e.target.value
        }))
    }

    render() {
        if(!decodeToken() || (decodeToken()._id === null) || (decodeToken().email === null)) {
            return <Redirect to="/login" />
        }
        
        return (
            <div className="container">
                <Navigation />
                <form>
                    <h2 style={{textAlign:"center"}}>Search application</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.search}
                            placeholder="Search.."
                            onChange={this.handleSearch}
                        />
                    </div>
                    <div>
                        <ul style={{"listStyleType": "none", "paddingLeft": "0px"}}>
                        {
                            this.state.loaded
                            ?
                                this.state.filterData.map((app, index) => {
                                    return (
                                        <li key={index}>
                                            <Link to={{
                                                pathname: "/form",
                                                state: {
                                                    appId: `${app._id}`,
                                                    appName: `${app.name}`
                                                }
                                            }}>
                                            {app.name}
                                            </Link>
                                        </li>
                                    )
                                })
                            :
                                <Loader
                                    loaded={this.state.loaded}
                                />
                        }
                        </ul>
                    </div>
                    {   
                        this.state.searchData.length === 0 ?
                        (
                            <div
                                style={{ 
                                    textAlign: "center",
                                    visibility: this.state.searchData.length === 0 ? 'visible' : 'hidden'}}
                                className="alert alert-info"
                                role="alert"
                            >
                            No applications found!
                            </div>
                        )
                        :   null
                    }
                </form>
            </div>
        )
    }
}