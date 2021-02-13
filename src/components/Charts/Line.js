import React from "react";
import Chart from "react-google-charts";

export default class Line extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                ['x', 'y', 'z'],
            ]
        }
    }
    componentDidMount() {
        switch(this.props.type){
            case "graph":
                let data = [['День', 'Созданных', 'Выполненных'],]
                //    Получаем массив дат всех задач
                Array.from(
                    new Set(
                        this.props.tickets.map(item => item.created_at.slice(0, 10)).sort()
                    ) // дальше перебираем массив открытых тикетов по датам
                ).forEach(day => {

                    let closed = this.props.tickets.filter(ticket => ticket.status === 2 || ticket.status === 3),
                        inWork = this.props.tickets.filter(ticket => ticket.created_at.slice(0, 10) === day).length,
                        completed = closed.filter(ticket => ticket.last_updated_at.slice(0, 10) === day).length
                    data.push([
                        day,
                        inWork,
                        completed,
                    ])
                })
                this.setState({data: data})
                break;
            default:
                break;
        }

    }

    render() {
        return(
            <Chart
                chartType="LineChart"
                loader={<div>Загрузка...</div>}
                data={this.state.data}
                options={{
                    series: {
                        1: { curveType: 'function' },
                    },
                    legend: {position: 'none'}
                }}
                rootProps={{ 'data-testid': '2' }}
            />
        )
    }
}