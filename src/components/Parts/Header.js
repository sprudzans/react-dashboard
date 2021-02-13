import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";

export default class Header extends React.Component {
    render(){
        return (
            <Container fluid>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">React-Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Общие показатели</Nav.Link>
                            <Nav.Link href="/line1">Линия 1</Nav.Link>
                            <Nav.Link href="/line2">Линия 2</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        )
    }
}