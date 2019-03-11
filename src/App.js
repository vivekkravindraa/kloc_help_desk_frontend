import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import logo from './images/logo.jpg';

import Admin from './components/Admin';
import Application from './components/Application';
import AssignedTickets from './components/AssignedTickets';
import Confirmation from './components/Confirmation';
import Customer from './components/Customer';
import ForgotPassword from './components/ForgotPassword';
import Form from './components/Form';
import Help from './components/Help';
import Invite from './components/Invite';
import Login from './components/Login';
import ManageApplication from './components/ManageApplication';
import Moderator from './components/Moderator';
import ModeratorTickets from './components/ModeratorTickets';
import MyTickets from './components/MyTickets';
import Profile from './components/Profile';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Search from './components/Search';
import Signup from './components/Signup';
import SingleTicket from './components/SingleTicket';
import Tickets from './components/Tickets';
import Users from './components/Users';

const Home = () => (
    <div className="container" style={{ textAlign: "center" }}>
        <h2>Welcome to KLoc Helpdesk!</h2>
        <u><Link style={{ fontSize: 20, color:"darkblue" }} to="/login">Login</Link></u>
    </div>
)

const NotFound = () => (
    <div className="container" style={{ textAlign: "center" }}>
        <h4>The path that you're trying to access does not exist!</h4>
        <Link to="/login">Go to Login</Link>
    </div>
)

const App = () => {
    return (
        <Router>
            <div className="container-fluid">
                <nav className="navbar navbar-light bg-basic">
                    <ul className="nav" style={{ "listStyleType":"none"}}>
                        <span className="navbar-brand">
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt=""
                            />
                        </span>
                    </ul>
                </nav>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/application" component={Application} />
                    <Route path="/assigned_tickets" component={AssignedTickets} />
                    <Route path="/confirmation" component={Confirmation} />
                    <Route path="/customer" component={Customer} />
                    <Route path="/forgot_password" component={ForgotPassword} />
                    <Route path="/form" component={Form} />
                    <Route path="/help" component={Help} />
                    <Route path="/invite" component={Invite} />
                    <Route path="/login" component={Login} />
                    <Route path="/manage_application" component={ManageApplication} />
                    <Route path="/my_tickets" component={MyTickets} />
                    <Route path="/moderator" component={Moderator} />
                    <Route path="/moderator_tickets" component={ModeratorTickets} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/register" component={Register} />
                    <Route path="/reset_password/:tempToken" component={ResetPassword} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/search" component={Search} />
                    <Route exact path="/tickets/:id" component={SingleTicket} />
                    <Route exact path="/tickets" component={Tickets} />
                    <Route path="/users" component={Users} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    )
}

export default App;