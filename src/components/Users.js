import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import ReactTable from 'react-table';
import Navigation from './Navigation';
import '../App.css';

var Loader = require('react-loader');

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            filterUsers: [],
            search: '',
            loaded: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loaded: true })
        }, 2000)
        axios.get(`${baseURL}/users?user=all`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            if(response) {
                this.setState({
                    allUsers: response.data,
                    filterUsers: response.data
                })
            }
        })
        .catch((error) => {
            this.setState({
                allUsers: [],
                filterUsers: []
            })
        })
    }

    handleSearch = (e) => {
        e.persist();
        this.setState(prevState => ({
            filterUsers: prevState.allUsers.filter((user) => user.email.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0),
            search: e.target.value
        }))
    }

    handleSelectFilters = (e) => {
        let value = e.target.value;
        axios.get(`${baseURL}/users?user=${value}`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                allUsers: response.data,
                filterUsers: response.data
            })
        })
        .catch((error) => {
            this.setState({
                allUsers: [],
                filterUsers: []
            })
        })
    }

    render() {
        if(!decodeToken() || (decodeToken().role !== 'admin')) {
            return <Redirect to="/login" />
        }

        const columns = [
            {
                Header: "User ID",
                accessor: "_id",
                filterable: false,
                resizable: false,
                sortable: false,
                width: 250,
                style: { textAlign: "center" }
            },
            {
                Header: "First Name",
                accessor: "firstName",
                Cell: props => (
                    props.original.firstName
                    ?   props.original.firstName[0].toUpperCase() + props.original.firstName.slice(1)
                    :   null
                ),
                filterable: false,
                resizable: false,
                sortable: true,
                style: { textAlign: "center" }
            },
            {
                Header: "Last Name",
                accessor: "lastName",
                Cell: props =>  (
                    props.original.lastName
                    ?   props.original.lastName[0].toUpperCase() + props.original.lastName.slice(1)
                    :   null
                ),
                filterable: false,
                resizable: false,
                sortable: true,
                style: { textAlign: "center" }
            },
            {
                Header: "Email",
                accessor: "email",
                filterable: false,
                resizable: false,
                sortable: true,
                width: 300,
                style: { textAlign: "center" }
            },
            {
                Header: "Role",
                accessor: "role",
                Cell: props => (
                    props.original.role
                    ?   props.original.role[0].toUpperCase() + props.original.role.slice(1)
                    :   null
                ),
                filterable: false,
                resizable: false,
                sortable: true,
                width: 100,
                style: { textAlign: "center" }
            }
        ]
        
        return  (
            <div className="container">
                <Navigation />
                <form>
                    <h2 style={{textAlign:"center"}}>All users</h2>
                    <div className="form-inline">
                        <div>
                            <label>Search By Email:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={this.state.search}
                                placeholder="Search.."
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div>
                            <label>Select Filters:</label>
                            <select
                                className="custom-select custom-select-sm"
                                onChange={this.handleSelectFilters}
                                defaultValue="all"
                            >
                                <option value="all">All Users</option>
                                <option value="admin">Filter By Admin</option>
                                <option value="moderator">Filter By Moderator</option>
                                <option value="customer">Filter By Customer</option>
                            </select>
                        </div>
                    </div>
                </form>
                <ReactTable
                    className="all-users-table"
                    columns={columns}
                    data={this.state.filterUsers}
                    defaultPageSize={5}
                    noDataText={"No data found!"}
                >
                </ReactTable>
                {
                    this.state.loaded
                    ?   null  
                    :   <Loader loaded={this.state.loaded} />
                }
            </div>
        )
    }
}