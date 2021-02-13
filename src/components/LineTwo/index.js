import React from "react";
import {Card, Col, Container, Row, Spinner} from "react-bootstrap";
import Bar from "../Charts/Bar";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            allTickets: [],
            users: []
        }

        this.usedeskAPI = "SECRETURL";
        this.allTickets = [];
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
                'group_id': "41",
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
                'fgroup': "41",
                'fstatus': "1, 5, 6, 8",
                "offset": this.state.offset
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.allTickets = this.allTickets.concat(result)
                if (result.length === 100) {
                    this.setState({offset: this.state.offset + 1})
                    this.componentDidMount()
                } else {
                    console.log(this.allTickets)
                    this.setState({allTickets: this.allTickets});
                }
            })
    }


    render(){
        if(this.state.allTickets.length === 0){
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
                                <Card.Header>Тикеты второй линии</Card.Header>
                                <Card.Body>
                                    <Bar tickets={this.state.allTickets} users={this.state.users} type={"online"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}