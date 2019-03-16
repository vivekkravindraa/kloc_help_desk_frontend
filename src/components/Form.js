import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import decodeToken from '../helpers/token';
import Recaptcha from 'react-recaptcha';
import { siteKey } from '../site_key';
import Navigation from './Navigation';
import '../App.css';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: this.props.location.state.appId,
            userId: decodeToken() ? decodeToken()._id : null,
            appName: this.props.location.state.appName,
            ticketEmail: decodeToken() ? decodeToken().email : null,
            store: '',
            subject: '',
            description: '',
            minSubject: '',
            minDescription: '',
            recipients: [],
            images: [],
            imageNames: [],
            files: [],
            filesList: [],
            ticketData: {},
            loaded: 0,
            subjectChars: 0,
            descriptionChars: 0,
            isLoaded: false,
            isUploaded: false,
            isVerified: false,
            isNotVerified: false,
            isGenerated: false,
            isVisible: false,
            isSuccess: false,
            isEmpty: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    handleTicketEmail = (e) => { this.setState({ ticketEmail: e.target.value }) }
    // handleStore = (e) => { this.setState({ store: e.target.value }) }
    
    handleSubject = (e) => {
        this.setState({ 
            subject: e.target.value,
            subjectChars: e.target.value.length,
            isEmpty: false,
            minSubject: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleDescription = (e) => {
        this.setState({
            description: e.target.value,
            descriptionChars: e.target.value.length,
            isEmpty: false,
            minDescription: '',
            error: {
                statusCode: '',
                message: ''
            }
        })
    }

    handleMinSubject = () => {
        if(this.state.subject.length < 10) {
            this.setState({
                minSubject: 'Should be at least 10 characters!'
            })
        }
    }

    handleMinDescription = () => {
        if(this.state.description.length < 10) {
            this.setState({
                minDescription: 'Should be at least 10 characters!'
            })
        }
    }
    
    handleRecipients = (e) => { this.setState({ recipients: e.target.value }) }
    onloadRecaptcha = () => { this.setState({ isLoaded: true }) }
    verifyCallback = (token) => {
        if(token) {
            this.setState({ isVerified: true, isNotVerified: false }) 
        } else {
            this.setState({ isVerified: false, isNotVerified: true })
        }
    }

    handleSelectedFile = (e) => {
        let files = e.target.files;

        if(files.length > 0) {
            this.setState({
                isVisible: true,
                isSuccess: false,
                isUploaded: false,
                imageNames: [],
                errorMsg: ''
            })
            
            let fileNames = [];
            let local = [];

            for(let i = 0; i < files.length; i++) {
                let object = {};
                object = files[i];
                local.push(object); 
                
                fileNames.push(`${files[i].name}`);
                this.setState({
                    files: this.state.files.concat(fileNames)
                })
            }
            this.setState({
                filesList: local
            })
        }
    }

    handleRemoveFile = (index) => {
        this.state.files.splice(index,1);
        this.state.filesList.splice(index,1);
    }

    handleFileUpload = () => {
        let fd = new FormData();
        let files = this.state.filesList;

        if(files.length === 0) {
            this.setState({ isUploading: false })
        } else if(files.length > 0) {
            this.setState({
                imageNames: this.state.imageNames.concat(this.state.files),
                isUploading: true,
                errorMsg: ''
            })

            for(let i = 0; i < files.length; i++) {
                fd.append('image', files[i]);
            }

            axios.post(`${baseURL}/tickets/image_upload`, fd, {
                onUploadProgress: progressEvent => {
                    this.setState({
                        loaded: (Math.round((progressEvent.loaded * 100) / progressEvent.total))
                    })
                }
            }, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                fd = {}
                this.setState({
                    images: this.state.images.concat(response.data.locationArray),
                    isSuccess: true,
                    isUploaded: true,
                    isUploading: false,
                    isVisible: false,
                    files: []
                })
            })
            .catch((error) => {
                this.setState(() => ({
                    error: { ...this.state.error,
                        statusCode: error.response.status,
                        message: `* Unable to upload the file(s)! * Select only valid file formats.`
                    },
                    isUploading: false
                }))
            })
        }
    }

    handleTicketGeneration = (e) => {
        e.preventDefault();

        if(!this.state.isVerified) {
            this.setState({ isNotVerified: true })
        } else if (this.state.subject === '' || this.state.description === '') {
            this.setState({ isEmpty: true })
        } else if (this.state.subject !== '' && this.state.description !== '' && this.state.isVerified) {

            let recipientsMails = this.state.recipients.length > 0 ? this.state.recipients.split(',') : [];

            let formData = {
                applicationId: this.state.appId,
                userId: this.state.userId,
                subject: this.state.subject,
                description: this.state.description,
                recipients: recipientsMails,
                attachImages: this.state.images
            }
            
            axios.post(`${baseURL}/tickets`, formData, {headers: {'x-auth': localStorage.getItem('x-auth')}})
            .then((response) => {
                if(response) {
                    this.setState({
                        ticketData: response.data,
                        isGenerated: true
                    })
                }
            })
            .catch((error) => {
                this.setState(() => ({
                    error: { ...this.state.error,
                        statusCode: error.response.status,
                        message: `Unable to generate ticket! Please try again.`
                    }
                }))
            })
        }
    }

    render() {
        if(!decodeToken() || (decodeToken()._id === null) || (decodeToken().email === null)) {
            return <Redirect to="/login" />
        }
        
        let loaded = Math.round(this.state.loaded,2) + '%';

        return this.state.isGenerated
            ?
            (
                <div className="container">
                <Navigation />
                    <div 
                        className="alert alert-success"
                        role="alert"
                        style={{ textAlign: "center" }}
                    >
                    Ticket has been raised. Please check your mailbox. If not found, check the spam folder.
                    </div>
                </div>
            ) 
            :
            (
                <div className="container">
                <Navigation />
                {
                    !this.state.isLoaded ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: !this.state.isLoaded ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                        Make sure you're connected to a good internet / wait until the captcha loads.
                        </div>
                    )
                    :   null
                }
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
                        Please fill all mandataory * fields!
                        </div>
                    )
                    :   null
                }
                {
                    this.state.isNotVerified ?
                    (
                        <div
                            style={{
                                textAlign: "center",
                                visibility: this.state.isNotVerified ? 'visible' : 'hidden'
                            }}
                            className="alert alert-warning"
                            role="alert"
                        >
                        Verify captcha and confirm that you're not a bot!
                        </div>
                    )
                    :   null
                }
                <form>
                    <h2 style={{"textAlign":"center"}}>Issue ticket</h2>
                    <div className="row">
                        <div className="form-group col">
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.appName}
                                placeholder="Application"
                                disabled
                            />
                        </div>
                        <div className="form-group col">
                            <input
                                type="email"
                                className="form-control"
                                value={this.state.ticketEmail}
                                placeholder="Email"
                                onChange={this.handleTicketEmail}
                                disabled
                            />
                        </div>
                    </div>
                    {/* <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.store}
                            placeholder="Store *"
                            onChange={this.handleStore}
                            disabled
                        />
                    </div> */}
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.subject}
                            placeholder="Subject *"
                            onChange={this.handleSubject}
                            onBlur={this.handleMinSubject}
                            minLength="10"
                            maxLength="50"
                        />
                        <small>50 / {50 - this.state.subjectChars} characters remaining. </small>
                        <span className="badge badge-danger">{this.state.minSubject}</span>
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            rows="3"
                            value={this.state.description}
                            placeholder="Description *"
                            onChange={this.handleDescription}
                            onBlur={this.handleMinDescription}
                            minLength="10"
                            maxLength="1000"
                        >
                        </textarea>
                        <small>1000 / {1000 - this.state.descriptionChars} characters remaining. </small>
                        <span className="badge badge-danger">{this.state.minDescription}</span>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.recipients}
                            placeholder="Recipients - Optional"
                            onChange={this.handleRecipients}
                            multiple
                        />
                        <small>Ex: john@abc.com,stephen@xyz.com</small>
                    </div>
                    <div className="input-group mb-2">
                        <label className="custom-file-label">Choose file</label>
                        <input
                            type="file"
                            className="custom-file-input"
                            onChange={this.handleSelectedFile}
                            disabled={this.state.isUploading ? true : false}
                            accept=".png,.jpg,.jpeg,.gif,.pdf"
                            multiple
                        />
                        <small>Allowed file formats: *.jpg, *.jpeg, *.gif, *.png, *.pdf</small>
                    </div>
                    {
                        this.state.isVisible
                        ?
                            this.state.files.length > 0
                            ?   this.state.files.map((file,index) => {
                                    return (
                                        <li key={index} style={{listStyleType: "none"}}>
                                            {`${file} `}
                                            <Link to="#"
                                                style={{
                                                    visibility: `${
                                                        this.state.isUploading
                                                        ?   'hidden'
                                                        :   'visible'
                                                    }`
                                                }}
                                                onClick={this.handleRemoveFile.bind(this, index, file)}
                                            >
                                            {this.state.isUploading || this.state.isUploaded ? null : 'Remove'}
                                            </Link>
                                        </li>
                                    )
                                })
                            :   null
                        :   null
                    }
                    {
                        !this.state.isSuccess ?
                            this.state.files.length > 0
                            ?   
                                this.state.isUploading
                                ?
                                (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={this.state.isUploading ? true : false}
                                    >
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span> Uploading.. </span>
                                        <span className="badge badge-light">{this.state.files.length}</span>
                                    </button>
                                )
                                :
                                (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={this.state.isUploading ? true : false}
                                        onClick={this.handleFileUpload}
                                    >
                                        <span> Upload </span>
                                        <span className="badge badge-light">{this.state.files.length}</span>
                                    </button>
                                )
                            :
                            null
                        :   
                            this.state.imageNames.length > 0
                            ?   
                                this.state.imageNames.map((file,index) => {
                                    return (
                                        <li key={index} style={{listStyleType: "none"}}>
                                            {`${file} `}
                                        </li>
                                    )
                                })
                            :
                            null
                    }
                    {
                        this.state.isUploading
                        ?
                        (
                            <div className="form-group">
                                <span className="badge badge-basic">
                                    Please wait while the files are being uploaded...
                                </span>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{ width: loaded }}
                                    >
                                    {Math.round(this.state.loaded,2)}%
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        this.state.isSuccess
                        ?   
                            <span className="badge badge-success">
                                Successfully uploaded!
                            </span>
                        :   null
                    }
                    <div className="g-recaptcha" data-sitekey={siteKey}> 
                        <Recaptcha
                            sitekey={siteKey}
                            render='explicit'
                            onloadCallback={this.onloadRecaptcha}
                            verifyCallback={this.verifyCallback}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            style={{backgroundColor:"yellowgreen",color:"black",border:0}}
                            onClick={this.handleTicketGeneration}
                            className="btn btn-secondary btn-lg btn-block"
                        >
                        Generate
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}