import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Icon } from 'semantic-ui-react';
import logo from './images/logo.jpg';

import Admin from './components/Admin';
import Application from './components/Application';
import AssignedTickets from './components/AssignedTickets';
import Confirmation from './components/Confirmation';
import Chatbot from './components/Chatbot';
import Customer from './components/Customer';
import ForgotPassword from './components/ForgotPassword';
import Form from './components/Form';
import Invite from './components/Invite';
import Login from './components/Login';
import ManageApplication from './components/ManageApplication';
import Moderator from './components/Moderator';
import ModeratorTickets from './components/ModeratorTickets';
import MyTickets from './components/MyTickets';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Search from './components/Search';
import Signup from './components/Signup';
import SingleTicket from './components/SingleTicket';
import Tickets from './components/Tickets';
import Users from './components/Users';

const Home = () => (
    <div className="container">
        <h2>Welcome to KLoc Helpdesk!</h2>
        <Icon name='sign-in' />
        <u>
            <Link style={{ fontSize: 20, color: "darkblue" }} to="/login">
                Login
            </Link>
        </u>
        <Chatbot />
    </div>
)

const NotFound = () => (
    <div className="container" style={{ textAlign: "center" }}>
        <h4>The path that you're trying to access does not exist!</h4>
        <Link to="/login">Go to Login</Link>
    </div>
)

const Help = ({ match }) => {
    return (
        <div className="container">
            <Navigation />
            
            <Tabs forceRenderTabPanel>
                <TabList>
                    <Tab>
                        <Link className="nav-link" to={`${match.url}/getting_started`}>Getting Started</Link>
                    </Tab>
                    <Tab>
                        <Link className="nav-link" to={`${match.url}/manage_profile`}>Manage Profile</Link>
                    </Tab>
                    <Tab>
                        <Link className="nav-link" to={`${match.url}/report_issues`}>Report Issues</Link>
                    </Tab>
                </TabList>
                <TabPanel>
                    <p>A kleptomaniacal, lazy, cigar-smoking, heavy-drinking robot who is Fry's best friend. Built in Tijuana, Mexico, he is the Planet Express Ship's cook.</p>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Bender_Rodriguez.png/220px-Bender_Rodriguez.png" alt="Bender Bending Rodriguez" />
                </TabPanel>
                <TabPanel>
                    <p>Many times great-nephew of Fry. CEO and owner of Planet Express delivery company. Tenured professor of Mars University.</p>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/FuturamaProfessorFarnsworth.png/175px-FuturamaProfessorFarnsworth.png" alt="Professor Hubert J. Farnsworth" />
                </TabPanel>
                <TabPanel>
                    <p>Alien from Decapod 10. Planet Express' staff doctor and steward. Has a medical degree and Ph.D in art history.</p>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Dr_John_Zoidberg.png/200px-Dr_John_Zoidberg.png" alt="Doctor John Zoidberg" />
                </TabPanel>
            </Tabs>

            <Switch>
                <Route path={`${match.path}/getting_started`} />
                <Route path={`${match.path}/manage_profile`} />
                <Route path={`${match.path}/report_issues`} />
            </Switch>
        </div>
    )
}

const App = () => {
    return (
        <Router>
            <div className="container-fluid">
                <nav className="navbar navbar-light bg-basic">
                    <ul className="nav" style={{ listStyleType: "none" }}>
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