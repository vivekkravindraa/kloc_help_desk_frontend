import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import ReactTable from 'react-table';
import '../App.css';

const Loader = require('react-loader');

export default class AsssignedTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketsData: [],
            filterData: [],
            userId: decodeToken() ? decodeToken()._id : null,
            filterBy: '',
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

        this.getAll()
    }

    getAll = () => {
        axios.get(`${baseURL}/tickets/assigned`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                ticketsData: response.data,
                filterData: response.data
            })
        })
        .catch((error) => {
            this.setState({
                ticketsData: [],
                filterData: []
            })
        })
    }
    
    getPriority = (priority) => {
        if(Number(priority) === 1) {
            return 'Low'
        } else if(Number(priority) === 2) {
            return 'Medium'
        } else if(Number(priority) === 3) {
            return 'High'
        } else if(Number(priority) === 4){
            return 'Urgent'
        }
    }

    handleSearch = (e) => {
        e.persist();
        this.setState(prevState => ({
            filterData: prevState.ticketsData.filter((ticket) => ticket.subject.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0),
            search: e.target.value
        }))
    }

    handleSelectFilters = (e) => {
        if(e.target.value === 'all') {
            this.setState({
                filterBy: e.target.value
            })
            return this.getAll();
        } else {
            this.setState({
                filterBy: e.target.value
            })
        } 
    }

    handleFilterByStatus = (e) => {
        let value = e.target.value;
        axios.get(`${baseURL}/tickets/assigned_tickets/filter_by_status?ticketStatus=${value}`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                ticketsData: response.data,
                filterData: response.data
            })
        })
        .catch((error) => {
            this.setState({
                ticketsData: [],
                filterData: []
            })
        })
    }

    handleFilterByPriority = (e) => {
        let value = e.target.value;
        axios.get(`${baseURL}/tickets/assigned_tickets/filter_by_priority?ticketPriority=${value}`,{headers: {'x-auth': localStorage.getItem('x-auth')}})
        .then((response) => {
            this.setState({
                ticketsData: response.data,
                filterData: response.data
            })
        })
        .catch((error) => {
            this.setState({
                ticketsData: [],
                filterData: []
            })
        })
    }

    render() {
        if(!decodeToken() || (decodeToken().role !== 'moderator') || (decodeToken()._id === null)) {
            return <Redirect to="/login" />
        }

        const columns = [
            // {
            //     Header: "Ticket ID",
            //     accessor: "_id",
            //     sortable: false,
            //     resizable: false,
            //     width: 250,
            //     style: { textAlign: "center" }
            // },
            {
                Header: "Subject",
                accessor: "subject",
                sortable: true,
                resizable: false,
                style: { textAlign: "center" }
            },
            {
                Header: "Description",
                accessor: "description",
                sortable: true,
                resizable: false,
                style: { textAlign: "center" }
            },
            {
                Header: "Priority",
                accessor: "ticketPriority",
                Cell: props => this.getPriority(props.original.ticketPriority),
                sortable: true,
                resizable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" }
            },
            {
                Header: "Status",
                accessor: "ticketStatus",
                Cell: props => props.original.ticketStatus.toUpperCase()[0] + props.original.ticketStatus.slice(1),
                sortable: true,
                resizable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" }
            },
            {
                Header: "Date & Time",
                accessor: "updatedAt",
                Cell: props => props.original.updatedAt.slice(0,10) + ' at ' + props.original.updatedAt.slice(11,16),
                sortable: true,
                resizable: false,
                width: 200,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" }
            },
            {
                Header: "View Ticket",
                Cell: props => <Link to={{
                    pathname:`tickets/${props.original._id}`,
                    userId: `${this.state.userId}`
                }}>View Ticket</Link>,
                sortable: false,
                resizable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" }
            }
        ]

        return (
            <div className="container">
                <Navigation />
                <form>
                    <h2 style={{textAlign:"center"}}>Assigned tickets</h2>
                    <div className="form-inline">
                        <div>
                            <label>Search by Subject:</label>
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
                                <option value="all">Assigned Tickets</option>
                                <option value="status">Filter By Status</option>
                                <option value="priority">Filter By Priority</option>
                            </select>
                        </div>
                        {
                            this.state.filterBy === 'status'
                            ?
                                <div>
                                    <label>Filter by Status:</label>
                                    <select
                                        className="custom-select custom-select-sm"
                                        onChange={this.handleFilterByStatus}
                                    >
                                        <option selected disabled={true}>Select Priority</option>
                                        <option value="open">Open</option>
                                        <option value="processing">Processing</option>
                                        <option value="pending">Pending</option>
                                        <option value="resolved">Resolve</option>
                                        <option value="closed">Close</option>
                                    </select>
                                </div>
                            :   null
                        }
                        {
                            this.state.filterBy === 'priority'
                            ?
                                <div>
                                    <label>Filter by Priority:</label>
                                    <select
                                        className="custom-select custom-select-sm"
                                        onChange={this.handleFilterByPriority}
                                    >
                                        <option selected disabled={true}>Select Priority</option>
                                        <option value={1}>Low</option>
                                        <option value={2}>Medium</option>
                                        <option value={3}>High</option>
                                        <option value={4}>Urgent</option>
                                    </select>
                                </div>
                            :   null
                        }
                    </div>
                </form>
                <ReactTable
                    columns={columns}
                    data={this.state.filterData}
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