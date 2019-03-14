import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Comment, Segment, Grid, Label } from 'semantic-ui-react';
// import { Checkbox } from 'semantic-ui-react';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import steve from '../images/steve.jpg';
import Navigation from './Navigation';
import '../App.css';

export default class SingleTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketData: {},
            newObj: {},
            commentsData: [],
            images: [],
            ticketsAssigned: [],
            userId: decodeToken() ? decodeToken()._id : null,
            commentId: '',
            role: '',
            reply: '',
            createdDate: '',
            createdTime: '',
            comment: '',
            edited: '',
            checkStatus: '',
            ticketStatus: '',
            ticketPriority: null,
            editMode: false,
            replyMode: false,
            collapsed: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        axios.get(`${baseURL}/tickets/${id}`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        ticketData: response.data.ticket,
                        createdDate: response.data.ticket.createdAt.slice(0, 10),
                        createdTime: response.data.ticket.createdAt.slice(11, 19),
                        images: response.data.ticket.attachImages,
                        checkStatus: response.data.ticket.ticketStatus,
                        ticketStatus: response.data.ticket.ticketStatus[0].toUpperCase() + response.data.ticket.ticketStatus.slice(1),
                        ticketPriority: response.data.ticket.ticketPriority,
                        ticketsAssigned: response.data.ticket.ticketsAssigned,
                        role: response.data.role
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: { ...this.state.error, statusCode: error.response.status, message: error.message }
                }))
            })
        this.getComments(id);
    }

    getComments = (id) => {
        axios.get(`${baseURL}/tickets/${id}/comments`, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                if (response) {
                    this.setState({
                        commentsData: response.data.comment,
                        comment: ''
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    commentsData: []
                })
            })
    }

    getPriority = (priority) => {
        if (Number(priority) === 1) {
            return 'Low'
        } else if (Number(priority) === 2) {
            return 'Medium'
        } else if (Number(priority) === 3) {
            return 'High'
        } else if (Number(priority) === 4) {
            return 'Urgent'
        }
    }

    commentHandle = (e) => {
        this.setState({
            comment: e.target.value,
            editMode: '',
            replyMode: ''
        })
    }
    addCommentHandle = (e) => {
        e.preventDefault();

        let formData = {
            content: this.state.comment,
            ticketId: this.state.ticketData._id
        }

        if (this.state.comment !== '') {
            axios.post(`${baseURL}/comments`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
                .then((response) => {
                    this.setState({
                        newObj: response.data.comment[response.data.comment.length - 1]
                    })
                    let newData = [];
                    newData.push(this.state.newObj)
                    this.setState({
                        commentsData: this.state.commentsData.concat(newData),
                        comment: ''
                    })
                })
                .catch((error) => {
                    this.setState(() => ({
                        error: {
                            ...this.state.error,
                            statusCode: error.response.status,
                            message: `Unable to add comment! Please try again.`
                        }
                    }))
                })
        }
    }

    statusHandle = (e) => {
        let status = e.target.value;
        let formData = { ticketStatus: status }

        axios.put(`${baseURL}/tickets/${this.state.ticketData._id}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                this.setState({
                    ticketData: response.data,
                    checkStatus: response.data.ticketStatus,
                    ticketStatus: response.data.ticketStatus[0].toUpperCase() + response.data.ticketStatus.slice(1)
                })
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status,
                        message: error.message,
                    }
                }))
            })
    }
    priorityHandle = (e) => {
        let priority = e.target.value;
        let formData = { ticketPriority: Number(priority) }

        axios.put(`${baseURL}/tickets/${this.state.ticketData._id}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                this.setState({
                    ticketData: response.data,
                    ticketPriority: response.data.ticketPriority.toString()
                })
            })
            .catch((error) => {
                this.setState(() => ({
                    error: {
                        ...this.state.error,
                        statusCode: error.response.status,
                        message: error.message,
                    }
                }))
            })
    }

    handleMouseOver = (e) => {
        e.target.height = 300;
        e.target.width = 300;
    }
    handleMouseLeave = (e) => {
        e.target.height = 100;
        e.target.width = 100;
    }

    handleEditComment = (id, content) => {
        this.setState({
            commentId: id,
            edited: content,
            editMode: true,
            replyMode: false,
            reply: ''
        })
    }
    handleEditCancel = () => {
        this.setState({
            commentId: '',
            editMode: false,
            reply: ''
        })
    }

    handleEdit = (e) => { this.setState({ edited: e.target.value }) }
    handleCommentSubmit = (id, e) => {
        e.preventDefault();

        let formData = {
            content: this.state.edited,
            ticketId: this.state.ticketData._id
        }

        axios.put(`${baseURL}/comments/${id}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        editMode: false,
                        commentsData: response.data.comment
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: { ...this.state.error, statusCode: error.response.status, message: error.message }
                }))
            })
    }
    handleSubCommentSubmit = (com, sub, e) => {
        e.preventDefault();

        let formData = {
            subContent: this.state.edited,
            ticketId: this.state.ticketData._id
        }

        axios.put(`${baseURL}/comments/${com}/sub_comments/${sub}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        editMode: false,
                        commentsData: response.data.comment
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: { ...this.state.error, statusCode: error.response.status, message: error.message }
                }))
            })
    }

    handleReplyComment = (id) => {
        this.setState({
            commentId: id,
            replyMode: true,
            editMode: false
        })
    }
    handleReplyCancel = () => {
        this.setState({
            commentId: '',
            replyMode: false,
            reply: ''
        })
    }

    handleReply = (e) => { this.setState({ reply: e.target.value }) }
    handleReplySubmit = (id, e) => {
        e.preventDefault();

        let formData = {
            subContent: this.state.reply,
            ticketId: this.state.ticketData._id,
            parentId: id
        }

        if (this.state.reply.length > 0) {
            axios.post(`${baseURL}/comments/${id}/sub_commmets?parentId=${id}`, formData, { headers: { 'x-auth': localStorage.getItem('x-auth') } })
                .then((response) => {
                    if (response.data) {
                        this.setState({
                            replyMode: false,
                            reply: ''
                        })
                        this.getComments(this.state.ticketData._id)
                    }
                })
                .catch((error) => {
                    this.setState(() => ({
                        error: { ...this.state.error, statusCode: error.response.status, message: error.message }
                    }))
                })
        }
    }

    // handleCheckbox = (e, { checked }) => this.setState({ collapsed: checked })

    render() {
        if (!decodeToken() || (decodeToken()._id === null)) {
            return <Redirect to="/login" />
        }
        return (
            <div className="container">
                <Navigation />
                <form>
                    <h2 style={{ textAlign: "center" }}>Ticket information</h2>
                    <div>
                        <Grid.Column>
                            <Segment raised>
                                <Label as='a' color='blue' ribbon>Created On</Label>
                                <p>{this.state.createdDate} at {this.state.createdTime}</p>
                                <Label as='a' color='blue' ribbon>Ticket ID</Label>
                                <p>{this.state.ticketData._id}</p>
                                <Label as='a' color='blue' ribbon>Subject</Label>
                                <p>{this.state.ticketData.subject}</p>
                                <Label as='a' color='blue' ribbon>Description</Label>
                                <p>{this.state.ticketData.description}</p>
                                <Label as='a' color='blue' ribbon>Status</Label>
                                <p>{this.state.ticketStatus === 'Assigned' ? 'Processing' : this.state.ticketStatus}</p>
                                {
                                    this.state.role === 'admin' || this.state.role === 'moderator'
                                        ?
                                        (
                                            <div>
                                                <Label as='a' color='blue' ribbon>Priority</Label>
                                                <p>{this.getPriority(this.state.ticketPriority)}</p>
                                            </div>
                                        )
                                        : null
                                }
                            </Segment>
                            {
                                this.state.images.length > 0 ?
                                    <Segment raised>
                                        <Label as='a' color='orange' ribbon>Images</Label>
                                        {
                                            this.state.images.map((index) => {
                                                return (
                                                    <img
                                                        key={index}
                                                        src={index}
                                                        onMouseOver={this.handleMouseOver}
                                                        onMouseLeave={this.handleMouseLeave}
                                                        height={100}
                                                        width={100}
                                                        alt=""
                                                    />
                                                )
                                            })  
                                        }
                                    </Segment>
                                :   null
                            }
                        </Grid.Column>
                    </div>
                </form>
                {
                    this.state.role === 'admin' || this.state.role === 'moderator' || this.state.role === 'customer'
                    ?
                    (
                        <Segment>
                            <div>
                                <label>Change Status: </label>
                                <select className="custom-select custom-select-sm" onChange={this.statusHandle}>
                                    <option selected disabled>Select Status</option>
                                    <option
                                        value="open"
                                        disabled={this.state.role === 'customer' ? true : false}
                                    >
                                        Open
                                </option>
                                    <option
                                        value="assigned"
                                        disabled={this.state.role === 'customer' ? true : false}
                                    >
                                        Processing
                                </option>
                                    <option
                                        value="pending"
                                        disabled={this.state.role === 'customer' ? true : false}
                                    >
                                        Pending
                                </option>
                                    <option
                                        value="resolved"
                                        disabled={this.state.role === 'customer' ? true : false}
                                    >
                                        Resolved
                                </option>
                                    <option
                                        value="closed"
                                        disabled={this.state.role === 'moderator' ? true : false}
                                    >
                                        Closed
                                </option>
                                    <option
                                        value="open"
                                        disabled={this.state.role === 'moderator' ? true : false}
                                    >
                                        Re-Open
                                </option>
                                </select>
                            </div>
                            {
                                this.state.role === 'customer'
                                ?
                                null
                                :
                                (
                                    <div>
                                        <label>Change Priority: </label>
                                        <select
                                            className="custom-select custom-select-sm"
                                            onChange={this.priorityHandle}
                                        >
                                            <option selected disabled>Select Priority</option>
                                            <option value={1}>Low</option>
                                            <option value={2}>Medium</option>
                                            <option value={3}>High</option>
                                            <option value={4}>Urgent</option>
                                        </select>
                                    </div>
                                )
                            }
                        </Segment>
                    )
                    : null
                }
                {
                    this.state.checkStatus === 'closed'
                    ?
                    null
                    :
                    (
                        this.state.ticketsAssigned.length !== 0
                        ?
                        (
                            <div>
                                <label>Write Comment:</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="comment here.."
                                    maxLength={1000}
                                    value={this.state.comment}
                                    onChange={this.commentHandle}
                                >
                                </textarea>
                                <Button
                                    positive
                                    onClick={this.addCommentHandle}
                                >
                                    Submit Comment
                                </Button>
                                {
                                    decodeToken().role === 'admin' && (
                                        <Link to="/tickets">Go Back</Link>
                                    )
                                }
                                {
                                    decodeToken().role === 'customer' && (
                                        <Link to="/my_tickets">Go Back</Link>
                                    )
                                }
                                {
                                    decodeToken().role === 'moderator' && (
                                        <Link to="/moderator_tickets">Go Back</Link>
                                    )
                                }
                            </div>
                        )
                        : null
                    )
                }
                {
                    this.state.ticketsAssigned.length > 0 ?
                    (
                        <h4
                            style={{
                                visibility: this.state.ticketsAssigned.length !== 0 ? 'visible' : 'hidden'
                            }}
                        >
                            {this.state.commentsData.length > 1 ? 'Comments' : 'Comment'}: {this.state.commentsData.length}
                        </h4>
                    )
                    : null
                }
                {/* {
                    this.state.commentsData.length > 0 ?
                    (
                        <div>
                            <Checkbox label='Collapse comments' onChange={this.handleCheckbox} />
                        </div>
                    )
                    :   null
                } */}
                {
                    this.state.commentsData.length > 0 ?
                        this.state.commentsData.map((com, index) => {
                            return (
                                <Segment key={index}>
                                    {
                                        this.state.editMode && this.state.commentId === com._id
                                        ?
                                        (
                                            <Comment.Group>
                                                <Comment>
                                                    <Comment.Avatar as='a' src={steve} />
                                                    <Comment.Content>
                                                        <Comment.Author as='a'>{com.userId.firstName[0].toUpperCase() + com.userId.firstName.slice(1)}</Comment.Author>
                                                        <Comment.Text>
                                                            <textarea
                                                                type="text"
                                                                className="form-control"
                                                                maxLength={1000}
                                                                value={this.state.edited}
                                                                onChange={this.handleEdit}
                                                            >
                                                            </textarea>
                                                        </Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                            </Comment.Group>
                                        )
                                        :
                                        (
                                            <Comment.Group>
                                                <Comment>
                                                    <Comment.Avatar as='a' src={steve} />
                                                    <Comment.Content>
                                                        <Comment.Author as='a'>{com.userId.firstName[0].toUpperCase() + com.userId.firstName.slice(1)}</Comment.Author>
                                                        <Comment.Text>{com.content}</Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                            </Comment.Group>
                                        )
                                    }
                                    {
                                        this.state.replyMode && this.state.commentId === com._id
                                        ?
                                        (
                                            <textarea
                                                type="text"
                                                rows={2}
                                                maxLength={1000}
                                                className="form-control"
                                                placeholder="reply here.."
                                                value={this.state.reply}
                                                onChange={this.handleReply}
                                                style={{ marginBottom: 14 }}
                                            >
                                            </textarea>
                                        )
                                        : null
                                    }
                                    {
                                        com.userId._id === this.state.userId && this.state.ticketStatus !== 'Closed'
                                        ?
                                        this.state.editMode && this.state.replyMode && this.state.commentId === com._id
                                            ? null
                                            :
                                            (
                                                <Button content='Edit' labelPosition='left' icon='edit' size='mini' onClick={this.handleEditComment.bind(this, com._id, com.content)} primary />
                                            )
                                        : null
                                    }
                                    {
                                        (this.state.replyMode && this.state.editMode && this.state.commentId === com._id) || (this.state.ticketStatus === 'Closed')
                                        ? null
                                        :
                                        (
                                            <Button content='Reply' labelPosition='left' icon='reply' size='mini' onClick={this.handleReplyComment.bind(this, com._id)} primary />
                                        )
                                    }
                                    {
                                        com.userId._id === this.state.userId
                                        ?
                                        this.state.editMode && this.state.commentId === com._id
                                            ?
                                            (
                                                <Button.Group size="mini">
                                                    <Button
                                                        onClick={this.handleEditCancel}
                                                    >
                                                        Don't Edit
                                                    </Button>
                                                    <Button.Or />
                                                    <Button
                                                        positive
                                                        onClick={this.handleCommentSubmit.bind(this, com._id)}
                                                    >
                                                        Submit Comment
                                                    </Button>
                                                </Button.Group>
                                            )
                                            :
                                            null
                                        :
                                        null
                                    }
                                    {
                                        this.state.replyMode && this.state.commentId === com._id
                                        ?
                                        (
                                            <Button.Group size="mini">
                                                <Button
                                                    onClick={this.handleReplyCancel}
                                                >
                                                    Don't Reply
                                                </Button>
                                                <Button.Or />
                                                <Button
                                                    positive
                                                    onClick={this.handleReplySubmit.bind(this, com._id)}
                                                >
                                                    Submit Reply
                                                </Button>
                                            </Button.Group>
                                        )
                                        :
                                        null
                                    }
                                    {
                                        com.subComment.length > 0 ?
                                            com.subComment.map((sub, index) => {
                                                return (
                                                    <Segment
                                                        key={index}
                                                        style={{
                                                            paddingLeft: "100px"
                                                        }}
                                                    >
                                                        {
                                                            this.state.editMode && this.state.commentId === sub._id
                                                            ?
                                                            (
                                                                <Comment.Group>
                                                                    <Comment>
                                                                        <Comment.Avatar as='a' src={steve} />
                                                                        <Comment.Content>
                                                                            <Comment.Author as='a'>{sub.userId.firstName[0].toUpperCase() + sub.userId.firstName.slice(1)}</Comment.Author>
                                                                            <Comment.Text>
                                                                                <textarea
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    maxLength={1000}
                                                                                    value={this.state.edited}
                                                                                    onChange={this.handleEdit}
                                                                                >
                                                                                </textarea>
                                                                            </Comment.Text>
                                                                        </Comment.Content>
                                                                    </Comment>
                                                                </Comment.Group>
                                                            )
                                                            :
                                                            (
                                                                // <Comment.Group collapsed={this.state.collapsed}>
                                                                <Comment.Group>
                                                                    <Comment>
                                                                        <Comment.Avatar as='a' src={steve} />
                                                                        <Comment.Content>
                                                                            <Comment.Author as='a'>{sub.userId.firstName[0].toUpperCase() + sub.userId.firstName.slice(1)}</Comment.Author>
                                                                            <Comment.Text>{sub.subContent}</Comment.Text>
                                                                        </Comment.Content>
                                                                    </Comment>
                                                                </Comment.Group>
                                                                // </Comment.Group>
                                                            )
                                                        }
                                                        {
                                                            this.state.replyMode && this.state.commentId === sub._id
                                                            ?
                                                            (
                                                                <textarea
                                                                    type="text"
                                                                    rows={2}
                                                                    maxLength={1000}
                                                                    className="form-control"
                                                                    placeholder="reply here.."
                                                                    value={this.state.reply}
                                                                    onChange={this.handleReply}
                                                                    style={{ marginBottom: 14 }}
                                                                >
                                                                </textarea>
                                                            )
                                                            : null
                                                        }
                                                        {
                                                            sub.userId._id === this.state.userId && this.state.ticketStatus !== 'Closed'
                                                            ?
                                                            this.state.editMode && this.state.replyMode && this.state.commentId === sub._id
                                                                ?
                                                                null
                                                                :
                                                                (
                                                                    <Button content='Edit' labelPosition='left' icon='edit' size='mini' onClick={this.handleEditComment.bind(this, sub._id, sub.subContent)} primary />
                                                                )
                                                            :   null
                                                        }
                                                        {
                                                            (this.state.replyMode && this.state.editMode && this.state.commentId === sub._id) || (this.state.ticketStatus === 'Closed')
                                                            ?
                                                            null
                                                            :
                                                            (
                                                                <Button content='Reply' labelPosition='left' icon='reply' size='mini' onClick={this.handleReplyComment.bind(this, sub._id)} primary />
                                                            )
                                                        }
                                                        {
                                                            sub.userId._id === this.state.userId
                                                            ?
                                                            this.state.editMode && this.state.commentId === sub._id
                                                                ?
                                                                (
                                                                    <Button.Group size="mini">
                                                                        <Button
                                                                            onClick={this.handleEditCancel}
                                                                        >
                                                                            Don't Edit
                                                                        </Button>
                                                                        <Button.Or />
                                                                        <Button
                                                                            positive
                                                                            onClick={this.handleSubCommentSubmit.bind(this, com._id, sub._id)}
                                                                        >
                                                                            Submit Comment
                                                                        </Button>
                                                                    </Button.Group>
                                                                )
                                                                :
                                                                null
                                                            :
                                                            null
                                                        }
                                                        {
                                                            this.state.replyMode && this.state.commentId === sub._id
                                                            ?
                                                            (
                                                                <Button.Group size="mini">
                                                                    <Button
                                                                        onClick={this.handleReplyCancel}
                                                                    >
                                                                        Don't Reply
                                                                    </Button>
                                                                    <Button.Or />
                                                                    <Button
                                                                        positive
                                                                        onClick={this.handleReplySubmit.bind(this, sub.parentId)}
                                                                    >
                                                                        Submit Reply
                                                                    </Button>
                                                                </Button.Group>
                                                            )
                                                            :
                                                            null
                                                        }
                                                    </Segment>
                                                )
                                            })
                                            : null
                                    }
                                </Segment>
                            )
                        })
                        : null
                }
            </div>
        )
    }
}