import React from 'react';
import { Router, Link, Route } from 'react-router-dom';
import '../App.css';

const GettingStarted = () => {
    return (
        <div>
            <h6>Getting Started</h6>
        </div>
    )
}

const Configuration = () => {
    return (
        <div>
            <h6>Configuration</h6>
        </div>
    )
}

const ManageUsers = () => {
    return (
        <div>
            <h6>Manage Users</h6>
        </div>
    )
}

const ManageIssues = () => {
    return (
        <div>
            <h6>Manage Issues</h6>
        </div>
    )
}

const ManageNotifications = () => {
    return (
        <div>
            <h6>Manage Notifications</h6>
        </div>
    )
}

const ReportIssues = () => {
    return (
        <div>
            <h6>Report Issues</h6>
        </div>
    )
}

const Help = ({match}) => {
    return (
        <Router>
            <div style={{ display: "flex" }}>
                <div style={{
                    padding: "10px",
                    width: "20%",
                    background: "#f0f0f0"
                }}>
                    <ul style={{listStyleType: "none", padding: 0}}>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/getting_started`}>Getting Started</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/configuration`}>Configuration</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/manage_users`}>Manage Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/manage_issues`}>Manage Issues</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/manage_notifications`}>Manage Notifications</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`${match.url}/report_issues`}>Report Issues</Link>
                        </li>
                    </ul>
                </div>
                
                <Route path={`${match.path}/getting_started`} component={GettingStarted} />
                <Route path={`${match.path}/configuration`} component={Configuration} />
                <Route path={`${match.path}/manage_users`} component={ManageUsers} />
                <Route path={`${match.path}/manage_issues`} component={ManageIssues} />
                <Route path={`${match.path}/manage_notifications`} component={ManageNotifications} />
                <Route path={`${match.path}/report_issues`} component={ReportIssues} />
            </div>
        </Router>
    )
}

export default Help;