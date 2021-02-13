import React from "react";
import {Container, Row, Col, Button, Form} from "react-bootstrap";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.url = "SECRETURL";
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault()
        try {
            fetch(`${this.url}token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
                .then(response => response.json())
                .then((r) => {
                    if (r.error) {
                        alert(r.error)
                    }
                    localStorage.setItem("token", r.token);
                    window.location.reload();
                })
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col lg={{span: 4, offset: 4}} className={"my-4"}>
                        <Form name="login" onSubmit={(e) => this.handleSubmit(e)}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="Email" className="form-label">Email</Form.Label>
                                <Form.Control type="email" placeholder="Укажите email" name="email" className="form-control" value={this.state.email} onChange={this.handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="Password" className="form-label">Пароль</Form.Label>
                                <Form.Control type="password" placeholder="Введите пароль" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} required />
                            </Form.Group>
                            <Button type="submit" className="btn btn-primary">Войти</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}