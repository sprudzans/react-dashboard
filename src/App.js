import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Login from "./components/Login";
import Header from "./components/Parts/Header";
import Dashboard from "./components/Dashboard";
import LineOne from "./components/LineOne";
import LineTwo from "./components/LineTwo";

export default class App extends React.Component {
    validateToken() {
        if (!localStorage.getItem("token")) {
            return (
                    <Login/>
                )
        } else {
            return (
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/">
                            <Header/>
                            <Dashboard/>
                        </Route>
                        <Route exact path="/line1">
                            <Header/>
                            <LineOne/>
                        </Route>
                        <Route exact path="/line2">
                            <Header/>
                            <LineTwo/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            )
        }
    }

    render() {
        return (
            <div className="App">
                {this.validateToken()}
            </div>
        );
    }
}
