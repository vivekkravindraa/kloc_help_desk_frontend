import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import '../App.css';

// const Loader = require('react-loader');

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // loaded: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }
    render () {
        if(!decodeToken()) {
            return <Redirect to="/" />
        }
        return (
            <nav className="navbar navbar-light bg-basic" id="navigation">
                <ul className="nav" style={{"listStyleType": "none"}}>
                { 
                    decodeToken().role === 'admin' &&  (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/invite`}>Invite Moderators</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'admin'  && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/application`}>Application</Link>
                        </li>
                    )
                }
                {
                    ((decodeToken().role === 'admin') || ( decodeToken().role === 'moderator') || (decodeToken().role === 'customer')) && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/search`}>Issue Ticket</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'admin' && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/tickets`}>All Tickets</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'customer' && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/my_tickets`}>My Tickets</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'moderator' && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/moderator_tickets`}>Unassigned Tickets</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'admin' && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/users`}>All Users</Link>
                        </li>
                    )
                }
                {
                    decodeToken().role === 'moderator' && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/assigned_tickets`}>Assigned Tickets</Link>
                        </li>
                    )
                }
                {
                    ((decodeToken().role === 'admin') || (decodeToken().role === 'moderator') || (decodeToken().role === 'customer')) && (
                        <li className="nav-item">
                            <Link className="nav-link" to={`/profile`}>Manage Profile</Link>
                        </li>
                    )
                }
                <li className="nav-item">
                    {/* <Loader loaded={this.state.loaded} /> */}
                    <Link className="nav-link" to="/" onClick={() => {
                        axios.delete(`${baseURL}/users/logout`, {headers: {'x-auth': localStorage.getItem('x-auth')}})
                        .then((response) => {
                            localStorage.removeItem('x-auth')
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
                    }}>
                        <Icon name='sign-out' />
                        Logout
                    </Link>
                </li>
                </ul>
            </nav>
        )
    }
}