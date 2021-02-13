import React from "react";
import {Card, Col, Container, Row, Spinner} from "react-bootstrap";
import Bar from "../Charts/Bar";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            inWorkTickets: [],
            users: []
        }

        this.usedeskAPI = "SECRETURL";
        this.inWorkTickets = [];
        this.token = localStorage.getItem("token");
    }

    componentDidMount(){
        fetch(`${this.usedeskAPI}users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'api_token': this.token,
                'group_id': "17",
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.setState({users: result});
            })


        fetch(`${this.usedeskAPI}tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'api_token': this.token,
                'fgroup': "17",
                'fstatus': "1, 5, 6, 8",
                "offset": this.state.offset
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.inWorkTickets = this.inWorkTickets.concat(result)
                if (result.length === 100) {
                    this.setState({offset: this.state.offset + 1})
                    this.componentDidMount()
                } else {
                    console.log(this.inWorkTickets)
                    this.setState({inWorkTickets: this.inWorkTickets});
                }
            })
    }


    render(){
        if(this.state.inWorkTickets.length === 0){
            return(
                <Container fluid>
                    <Spinner animation="border" />
                </Container>
            )
        } else {
            return (
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <Card>
                                <Card.Header>Тикеты первой линии</Card.Header>
                                <Card.Body>
                                    <Bar tickets={this.state.inWorkTickets} users={this.state.users} type={"online"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <Card.Header>SLA</Card.Header>
                                <Card.Body>
                                    <Bar tickets={this.state.inWorkTickets} type={"sla"} users={this.state.users}/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}