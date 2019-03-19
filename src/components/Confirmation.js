import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../base_url';
import qs from 'query-string';
import '../App.css';

export default class Confirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmed: false,
            error: {
                statusCode: '',
                message: ''
            }
        }
    }

    componentDidMount() {
        let temporaryToken = qs.parse(this.props.location.search);
        axios.put(`${baseURL}/users/confirmation?temp=${temporaryToken.temp}`)
        .then((response) => {
            if(response.data && response.status === 200) {
                this.setState({
                    isConfirmed: true
                })
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

    render() {
        return (
            <div className="container" style={{textAlign:"center"}}>
            {
                this.state.isConfirmed ?
                (
                    <div
                        style={{ 
                        textAlign: "center",
                            visibility: this.state.isConfirmed ? 'visible' : 'hidden'}}
                        className="alert alert-success"
                        role="alert"
                    >
                    Email has been verified! <Link to="/login">Click here to Login.</Link>
                    </div>
                )
                :   null
            }
            </div>
        )
    }
}