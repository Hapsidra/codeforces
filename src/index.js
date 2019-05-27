import React from 'react'
import PropTypes from "prop-types";
import { BrowserRouter, Router, Route, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import history from './history'

class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            problems: []
        }
    }

    componentDidMount() {
        if (this.props.match != undefined) {
            const handle = this.props.match.params.handle;
            this.search(handle)
        }
    }

    async search(handle) {
        console.log(handle)
        if (handle.length > 0) {
            this.setState({
                isLoading: true
            })
            const response = await fetch('https://codeforces.com/api/user.status?handle=' + handle)
            const json = await response.json()
            var problems = json.result;
            var solved = {};
            var unsolved = {};
            for(var i = 0;i<problems.length;i++){
                if (problems[i].verdict === 'OK') {
                    solved[problems[i].problem.contestId + problems[i].problem.index] = problems[i];
                }
            }
            for(var i = 0;i<problems.length;i++){
                if (solved[problems[i].problem.contestId + problems[i].problem.index] == null) {
                    unsolved[problems[i].problem.contestId + problems[i].problem.index] = problems[i];
                }
            }
            var a = []
            for (var number in unsolved) {
                a.push(unsolved[number])
            }
            a.sort(function(a, b) {
                var r1 = a.problem.rating
                var r2 = b.problem.rating
                if (r1 == undefined) {
                    r1 = 10e5
                }
                if (r2 == undefined) {
                    r2 = 10e5
                }
                return r1 - r2;
              })
            console.log(a)
            this.setState({
                isLoading: false,
                problems: a
            })
        } else {
            this.setState({
                problems: []
            })
        }
    }

    render() {
        return <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Name</th>
                                <th>Tags</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {this.state.problems.map((item, index)=> {
                                const problem = item.problem
                                const link = "https://codeforces.com/contest/"+item.contestId+"/problem/"+problem.index
                                const tags = problem.tags;
                                var tagsStr = ''
                                for(var i = 0; i < tags.length; i++)
                                    tagsStr += tags[i] + (i != tags.length - 1 ? ", " : "");

                                return <tr key={index}>
                                    <td><a target='_blank' href={link}>{problem.contestId + problem.index}</a></td>
                                    <td><a target='_blank' href={link}>{problem.name}</a></td>
                                    <td>{tagsStr}</td>
                                    <td>{problem.rating}</td>
                                    </tr>
                            })}
                        </tbody>
                    </table>
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            problems: []
        }
        this.handleInput = React.createRef();
        this.go = this.go.bind(this)
    }

    componentDidMount() {
        const handle = window.location.pathname.substr(1, window.location.pathname.length - 1)
        this.handleInput.current.value = handle
    }

    async go() {
        const handle = this.handleInput.current.value
        history.push('/' + handle)
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
                        <Route path="/:handle" component={Table} />
                    </Router>
                </main>
    }
}
const container = document.getElementById('app')
ReactDOM.render(<App/>, container)
