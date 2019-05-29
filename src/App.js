import React from 'react'
import history from './history'
import Table from './Table'
import PropTypes from "prop-types";
import { BrowserRouter, Router, Route, Link, Switch, Redirect } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            problems: []
        }
        this.handleInput = React.createRef();
        this.go = this.go.bind(this)
        this.checkHandle()
    }

    checkHandle() {
        const l = window.location
        if (l.search) {
            console.log(l)
            var q = {};
            l.search.slice(1).split('&').forEach(function(v) {
                var a = v.split('=');
                q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
            });
            if (q.handle !== undefined) {
                const handle = q.handle
                window.history.replaceState(null, null,
                    l.origin + '/codeforces-unsolved/' + handle
                );
                history.push(handle)
            }
        }
    }

    componentDidMount() {
        const href = window.location.pathname
        const handle = href.substring(href.lastIndexOf('/') + 1)
        this.handleInput.current.value = handle
    }

    async go() {
        const handle = this.handleInput.current.value
        console.log(handle)
        history.push(handle)
    }

    handleKeyPress = (event) => {
        if(event.key == 'Enter'){
            this.go()
        }
    }

    render() {
        return <main>
                    <aside>
                        <input placeholder="Type your handle" type="text" ref={this.handleInput} onKeyPress={this.handleKeyPress}></input>
                        <button type="submit" onClick={this.go} className="buttonload" id="main_button">
                        <span id="main_button_text">{this.state.isLoading ? '' : 'OK'}</span>{this.state.isLoading ? <i className="fa fa-circle-o-notch fa-spin" id="loading_spinner"></i> : null }
                        </button>
                        <div className="separator"></div>
                        <a href="https://github.com/Hapsidra/codeforces-unsolved">GitHub</a>
                    </aside>
                    <Router history={history}>
                        <Switch>
                            <Route path="/codeforces-unsolved/:handle" component={Table} />
                            <Route exact path="/" render={() => (
                                <Redirect to="/codeforces-unsolved/"/>
                            )}/>
                        </Switch>
                    </Router>
                </main>
    }
}

export default App;