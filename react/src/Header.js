
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";
import {LinkContainer} from "react-router-bootstrap";


export class Header extends React.Component {

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/app">Construction Monitoring</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavItem>
                            <LinkContainer to="/app">
                                <NavLink>Home</NavLink>
                            </LinkContainer>
                        </NavItem>
                        <NavItem>
                            <LinkContainer to="/app/siteModels">
                                <NavLink>Site Models</NavLink>
                            </LinkContainer>
                        </NavItem>
                        <NavItem>
                            <LinkContainer to="/app/monitoringNodes">
                                <NavLink>Monitoring Nodes</NavLink>
                            </LinkContainer>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;