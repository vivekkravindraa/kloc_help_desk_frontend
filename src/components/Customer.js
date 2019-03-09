import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import decodeToken from '../helpers/token';
import Navigation from './Navigation';
import '../App.css';

export default class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: !!decodeToken(),
        }
    }

    render() {
        return this.state.isLoggedIn
        ?
        (
            <div className="container">
                <Navigation />
            </div>
            
        )
        :   <Redirect to="/login" />
    }
}