import React from "react";
import Chart from "react-google-charts";

export default class Column extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                ['x', 'y'],
            ]
        }

    }

    componentDidMount() {
        let data = []
        switch (this.props.type){
            case "month":
                data = [['День', 'Количество задач',],]
                //    Получаем массив дат всех задач
                Array.from(
                    new Set(
                        this.props.tickets.map(item => item.created_at.slice(0, 10)).sort()
                    ) // дальше перебираем массив открытых тикетов по датам
                ).forEach(day => {
                    data.push([day, this.props.tickets.filter(ticket => ticket.created_at.slice(0, 10) === day).length])
                })
                this.setState({data: data})
                break;
            case "day":
                let dayTickets = this.props.tickets.filter(item => item.created_at.slice(0,10) === this.props.day)
                data = [['Час', 'Количество задач',],]
                // Получаем массив часов всех задач за сегодня
                Array.from(
                    new Set(
                        dayTickets.map(item => item.created_at.slice(11, 13)).sort()
                    ) // дальше перебираем массив тикетов за сегодня по часам
                ).forEach(hour => {
                        data.push([
                            parseInt(hour)+3, // usedesk возвращает время на три часа раньше
                            dayTickets.filter(item => item.created_at.slice(0, 10) === this.props.day)
                                .filter(ticket => ticket.created_at.slice(11, 13) === hour).length
                        ])
                })
                this.setState({data: data})
                break;
            default:
                break;
        }

    }

    render() {
        return (
            <Chart chartType="ColumnChart" loader={<div>Загрузка...</div>} data={this.state.data} options={{
                isStacked: true,
                legend: {position: 'none'},
            }}/>
        )
    }
}