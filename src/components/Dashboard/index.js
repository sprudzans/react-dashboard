import React from "react";
import {Card, Col, Container, Row, Spinner} from "react-bootstrap";
import Line from "../Charts/Line";
import Column from "../Charts/Column"
import Pie from "../Charts/Pie"
import Bar from "../Charts/Bar";
import Moment from 'moment'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            offset2: 0,
            users: [],
            allTickets: [],
            inWorkTickets: [],
        }

        this.usedeskAPI = "SECRETURL";
        this.allTickets = [];
        this.inWorkTickets = [];
        this.token = localStorage.getItem("token");

        this.currentTime = Moment().format('YYYY-MM-DD')
        this.lastTime = Moment(this.currentTime).subtract(30, 'days').format('YYYY-MM-DD')
    }

    componentDidMount(){
        this.getUsers()
        this.getAllTickets()
        this.getInWorkTickets()
    }

    getUsers(){
        fetch(`${this.usedeskAPI}users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'api_token': this.token,
                'group_id': "10",
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.setState({users: result});
            })
    }

    getAllTickets(){
        fetch(`${this.usedeskAPI}tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'api_token': this.token,
                'fchannel': "10",
                'created_after': this.lastTime,
                "offset": this.state.offset
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.allTickets = this.allTickets.concat(result)
                if (result.length === 100) {
                    this.setState({offset: this.state.offset + 1})
                    this.getAllTickets()
                } else {
                    console.log(this.allTickets)
                    this.setState({allTickets: this.allTickets});
                }
            })
    }

    getInWorkTickets(){
        fetch(`${this.usedeskAPI}tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'api_token': this.token,
                'fchannel': "10",
                'fstatus': "1, 5, 6, 8",
                "offset": this.state.offset2
            })
        })
            .then(r => r.json())
            .then((result) => {
                this.inWorkTickets = this.inWorkTickets.concat(result)
                if (result.length === 100) {
                    this.setState({offset2: this.state.offset2 + 1})
                    this.getInWorkTickets()
                } else {
                    this.setState({inWorkTickets: this.inWorkTickets});
                }
            })
    }

    render(){
        if(this.state.allTickets.length === 0){
            return(
                <Container fluid>
                    <div className={"loader"}>
                        <h1>Загрузка тикетов...</h1>
                        <Spinner animation="border"/>
                    </div>
                </Container>
            )
        } else {
            return (
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <Card>
                                <Card.Header>Все тикеты за месяц (созданные/выполненные)</Card.Header>
                                <Card.Body>
                                    <Line tickets={this.state.allTickets} type={"graph"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <Card.Header>Тикеты в работе по дням создания за месяц</Card.Header>
                                <Card.Body>
                                    <Column tickets={this.state.inWorkTickets} type={"month"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <Card.Header>Тикеты в работе по часам создания за день</Card.Header>
                                <Card.Body>
                                    <Column tickets={this.state.inWorkTickets} type={"day"} day={this.currentTime}/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col lg={2}>
                            <Card>
                                <Card.Header>Тикеты по статусам</Card.Header>
                                <Card.Body>
                                    <Pie tickets={this.state.inWorkTickets} type={"statuses"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={2}>
                            <Card>
                                <Card.Header>На удержании</Card.Header>
                                <Card.Body>
                                    <Pie tickets={this.state.inWorkTickets} type={"hold"}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={2}>
                            <Card>
                                <Card.Header>Срочные</Card.Header>
                                <Card.Body>
                                    <Bar tickets={this.state.inWorkTickets} type={"urgent"} users={this.state.users}/>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={2}>
                            <Card>
                                <Card.Header>Обработка алертов</Card.Header>
                                <Card.Body>
                                    <Bar tickets={this.state.inWorkTickets} type={"alerts"} users={this.state.users}/>
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
                    <hr/>
                </Container>
            )
        }
    }
}