import React from "react";
import Chart from "react-google-charts";

export default class Pie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [['x', 'y'],]
        }
        this.statusName = {
            1: 'Открыт',
            5: 'На удержании',
            6: 'В ожидании',
            8: 'Новый'
        }

        this.arr = []
    }

    componentDidMount(){
        switch (this.props.type){
            case "statuses":
                this.arr = [['Задач', 'по'],]
                Array.from(
                    new Set(
                        this.props.tickets.map(ticket => ticket.status).sort()
                    )
                ).forEach(item => {
                    this.arr.push([
                        this.statusName[item],
                        this.props.tickets.filter(elem => elem.status === item).length]);
                })
                this.setState({data: this.arr})
                break;
            case "hold":
                this.arr = [['Ждем ответ от', 'кол-во задач'],]
                let hold = this.props.tickets.filter(ticket => ticket.status === 5 && ticket.ticket_fields.some(field => field.id === 46)),
                    org = {
                    "CODE": "CODENAME", 
                };
                Array.from(
                    new Set(
                        hold.map(item => item.ticket_fields.filter(elem => elem.id === 46)[0].value)
                    ) //
                ).forEach( reason => {
                    if(reason !== null){
                        this.arr.push(
                            [
                                org[reason],
                                hold.filter(ticket => ticket.ticket_fields.some(field => field.id === 46 && field.value === reason)).length
                            ]
                        )
                    }
                })
                this.setState({data: this.arr})
                break;
        }
    }

    render() {
        return(
            <Chart
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={this.state.data}
                options={{
                    legend: {position: 'none'},
                }}
            />
        )
    }
}

