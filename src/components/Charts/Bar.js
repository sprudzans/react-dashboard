import React from "react";
import Chart from "react-google-charts";

export default class Bar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

        this.arr = []
    }

    componentDidMount(){
        switch (this.props.type){
            case "sla":
                this.arr = [['Имя', 'Просрочен SLA']];
                let slaTickets = this.props.tickets.filter(item => item.tags.filter(tag => tag.name === "Просрочен sla").length > 0);
                console.log(slaTickets)
                Array.from(
                    new Set(
                        slaTickets.map(ticket => ticket.assignee_id)
                    )
                ).forEach(
                    assignee_id => {
                        if(assignee_id !== null){
                            if(slaTickets.filter(ticket => ticket.assignee_id === assignee_id).length > 0){
                                this.arr.push([
                                    this.props.users.filter(user => user.id === assignee_id)[0].name,
                                    slaTickets.filter(ticket => ticket.assignee_id === assignee_id).length,
                                ])
                            }
                        }
                    }
                )
                this.setState({data: this.arr})
                break;
            case "urgent":
                this.arr = [['Имя', 'Срочных тикетов']];
                let urgentTickets = this.props.tickets.filter(item => item.subject.includes('Срочно'))
                Array.from(
                    new Set(
                        urgentTickets.map(ticket => ticket.assignee_id)
                    )
                ).forEach(
                    assignee_id => {
                        if(assignee_id !== null){
                            if(urgentTickets.filter(ticket => ticket.assignee_id === assignee_id).length > 0){
                                this.arr.push([
                                    this.props.users.filter(user => user.id === assignee_id)[0].name,
                                    urgentTickets.filter(ticket => ticket.assignee_id === assignee_id).length,
                                ])
                            }
                        }
                    }
                )
                this.setState({data: this.arr})
                break;
            case "alerts":
                this.arr = [['Имя','НСПК', 'Алерты'],];
                let alertsTickets = this.props.tickets.filter(ticket => ticket.ticket_fields.some(field => field.id === 15 && field.value === "471" || field.value === "476"));

                Array.from(
                    new Set(
                        alertsTickets.map(ticket => ticket.assignee_id)
                    )
                ).forEach(assignee_id => {
                    if(assignee_id !== null){
                        this.arr.push([
                            this.props.users.filter(user => user.id === assignee_id)[0].name,
                            alertsTickets.filter(ticket => ticket.ticket_fields.some(field => field.value === "471") && ticket.assignee_id === assignee_id).length,
                            alertsTickets.filter(ticket => ticket.ticket_fields.some(field => field.value === "476") && ticket.assignee_id === assignee_id).length,
                        ])
                    }
                })
                this.setState({data: this.arr})
                break;
            case "online":
                let data = [['Имя', 'Открыт', 'На удержании','В ожидании']];
                Array.from(
                    new Set(
                        this.props.tickets.map(ticket => ticket.assignee_id)
                    )
                ).forEach(
                    assignee_id => {
                        if(assignee_id !== null){
                            let tickets = this.props.tickets.filter(ticket => ticket.assignee_id === assignee_id),
                                open = tickets.filter(ticket => ticket.status === 1).length,
                                hold = tickets.filter(ticket => ticket.status === 5).length,
                                pending = tickets.filter(ticket => ticket.status === 6).length;

                            if(open !== 0 || hold !== 0 || pending !== 0){
                                data.push([
                                    this.props.users.filter(user => user.id === assignee_id)[0].name,
                                    open,
                                    hold,
                                    pending])
                            }
                        }
                    }
                )
                this.setState({data: data})
            default:
                break;
        }
    }

    render() {
        return ( <Chart
            chartType="BarChart"
            loader={<div>Загрузка...</div>}
            data={this.state.data}
            options={{
                isStacked: true,
                legend: {position: 'none'},
            }}/> )
    }
}