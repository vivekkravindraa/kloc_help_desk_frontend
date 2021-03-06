import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import ReactTable from 'react-table';
import Rodal from 'rodal';
import '../App.css';
import 'rodal/lib/rodal.css';

const Loader = require('react-loader');

export default class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignTo: '',
            filterBy: '',
            search: '',
            ticketId: '',
            userId: decodeToken() ? decodeToken()._id : null,
            ticketsData: [],
            filterData: [],
            moderators: [],
            selected: {},
            selectAll: 0,
            isArchived: false,
            isVisible: false,
            isUnassigned: false,
            visible: false,
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
        this.getModerators()
    }

    getAll = () => {
        axios.get(`${baseURL}/tickets`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
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

    getUnassigned = () => {
        axios.get(`${baseURL}/tickets/filter_unassigned_tickets`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                if(response.data.length > 0) {
                    this.setState({
                        ticketsData: response.data,
                        filterData: response.data,
                        isUnassigned: true,
                        isVisible: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    ticketsData: [],
                    filterData: [],
                    isUnassigned: false
                })
            })
    }

    getAssigned = () => {
        axios.get(`${baseURL}/tickets/filter_assigned_tickets`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
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

    getModerators = () => {
        axios.get(`${baseURL}/users?user=moderator`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                this.setState({
                    moderators: response.data
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

    getPriority = (priority) => {
        if (Number(priority) === 1) {
            return 'Low';
        } else if (Number(priority) === 2) {
            return 'Medium';
        } else if (Number(priority) === 3) {
            return 'High';
        } else if (Number(priority) === 4) {
            return 'Urgent';
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
        if (e.target.value === 'all') {
            this.setState({
                filterBy: e.target.value,
                isUnassigned: false,
                isVisible: false,
            })
            return this.getAll();
        } else if (e.target.value === 'assigned') {
            this.setState({
                filterBy: e.target.value,
                isUnassigned: false,
                isVisible: false,
            })
            return this.getAssigned();
        } else if (e.target.value === 'unassigned') {
            this.setState({
                isVisible: false
            })
            return this.getUnassigned();
        } else {
            this.setState({
                filterBy: e.target.value,
                isUnassigned: false,
                isVisible: false
            })
        }
    }

    handleFilterByStatus = (e) => {
        let value = e.target.value;
        axios.get(`${baseURL}/tickets/filter_by_status?ticketStatus=${value}&filterTickets=all`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
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
        axios.get(`${baseURL}/tickets/filter_by_priority?ticketPriority=${value}&filterTickets=all`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
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

    show = (id) => { this.setState({ visible: true, ticketId: id }); }
    hide = () => { this.setState({ visible: false, ticketId: '' }); }

    handleDeleteTicket = (id) => {
        axios.delete(`${baseURL}/tickets/${id}/archive`,{headers: { 'x-auth': localStorage.getItem('x-auth')}})
            .then((response) => {
                this.setState({
                    isArchived: true,
                    visible: false,
                    ticketId: ''
                })
                this.getAll()
            })
            .catch((error) => {
                this.setState({
                    ticketsData: [],
                    filterData: []
                })
            })
    }

    toggleRow = (id) => {
        const newSelected = Object.assign({}, this.state.selected);
        newSelected[id] = !this.state.selected[id];
        this.setState({
            selected: newSelected,
            selectAll: 2
        });
    }

    toggleSelectAll = () => {
        let newSelected = {};

        if (this.state.selectAll === 0) {
            this.state.filterData.forEach(x => {
                newSelected[x._id] = true;
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
    }

    handleAssignTo = (e) => {
        let assignTo = e.target.value;
        this.setState({
            assignTo: assignTo
        })
    }

    handleAssign = (e) => {
        e.preventDefault();

        let selected = this.state.selected;
        let local = [];

        if (selected !== {}) {
            for (let key in selected) {
                if (selected[key] === true) {
                    local.push(key)
                }
            }
        }

        let formData = {
            tickets: local,
            user: this.state.assignTo
        }

        if (this.state.selected !== {} && this.state.assignTo !== '') {
            axios.post(`${baseURL}/tickets/ticket_assign`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
                .then((response) => {
                    this.setState({
                        isAssigned: true,
                        assignTo: '',
                        selected: {},
                        selectAll: 0
                    })
                    this.getUnassigned();
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

    render() {
        if (!decodeToken() || (decodeToken().role !== 'admin') || (decodeToken()._id === null)) {
            return <Redirect to="/login" />
        }

        const columns = [
            {
                id: "checkbox",
                accessor: "",
                Cell: ({ original }) => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={this.state.selected[original._id] === true}
                            onChange={() => this.toggleRow(original._id)}
                        />
                    );
                },
                Header: x => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            disabled
                            checked={this.state.selectAll === 1}
                            ref={input => {
                                if (input) {
                                    input.indeterminate = this.state.selectAll === 2;
                                }
                            }}
                            onChange={() => this.toggleSelectAll()}
                        />
                    );
                },
                sortable: false,
                resizable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" },
                show: this.state.isVisible ? true : false
            },
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
                    pathname: `/tickets/${props.original._id}`,
                    state: {
                        userId: `${this.state.userId}`
                    }
                }}>View Ticket</Link>,
                sortable: false,
                resizable: false,
                width: 100,
                maxWidth: 100,
                minWidth: 100,
                style: { textAlign: "center" }
            },
            {
                Header: "Delete",
                Cell: props => {
                    return (
                        <button
                            className="btn btn-sm"
                            style={{ backgroundColor: "red", color: "#fefefe" }}
                            onClick={() => {
                                this.show(props.original._id)
                            }}
                        >
                        Delete
                        </button>
                    )
                },
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
                <Rodal visible={this.state.visible} onClose={this.hide}>
                    <p>Are you sure you want to delete this ticket ?</p>
                    <Button
                        negative
                        onClick={ this.handleDeleteTicket.bind(this, this.state.ticketId) }
                    >
                        <Icon name='archive' />
                        Yes
                    </Button>
                </Rodal>
                <form>
                    <h2 style={{ textAlign: "center" }}>All tickets</h2>
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
                                Successfully deleted the ticket!
                            </div>
                        )
                        :   null
                    }
                    <div className="form-inline">
                        <div className="search-subject">
                            <label>Search by Subject:</label>
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                value={this.state.search}
                                placeholder="Search.."
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div className="select-filters">
                            <label>Select Filters:</label>
                            <select
                                className="custom-select custom-select-sm"
                                onChange={this.handleSelectFilters}
                            >
                                <option value="all">All Tickets</option>
                                <option value="status">Filter By Status</option>
                                <option value="priority">Filter By Priority</option>
                                <option value="assigned">Assigned Tickets</option>
                                <option value="unassigned">Unassigned Tickets</option>
                            </select>
                        </div>
                        {
                            this.state.filterBy === 'status'
                            ?
                            <div className="filter-by-status">
                                <label>Filter by Status:</label>
                                <select
                                    className="custom-select custom-select-sm"
                                    onChange={this.handleFilterByStatus}
                                >
                                    <option selected disabled={true}>Select Status</option>
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
                            <div className="filter-by-priority">
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
                        {
                            this.state.filterData.length > 0 && this.state.isUnassigned
                            ?
                                <div className="assign-to">
                                    <label>Assign To:</label>
                                    <select
                                        className="custom-select custom-select-sm"
                                        onChange={this.handleAssignTo}
                                    >
                                        <option selected disabled>Select Asignee</option>
                                        {
                                            this.state.moderators.length > 0 ?
                                            (
                                                this.state.moderators.map((mode, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={mode._id}
                                                        >
                                                        {mode.email}
                                                        </option>
                                                    )
                                                })
                                            )
                                            :   null
                                        }
                                    </select>
                                    <button
                                        style={{ backgroundColor: "yellowgreen", color: "black", border: 0 }}
                                        className="btn btn-secondary btn-sm"
                                        onClick={this.handleAssign}
                                    >
                                        Assign
                                    </button>
                                </div>
                            :   null
                        }
                    </div>
                </form>
                <ReactTable
                    className="all-tickets-table"
                    columns={columns}
                    data={this.state.filterData}
                    defaultPageSize={5}
                    noDataText="No data found!"
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