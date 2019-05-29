import React from 'react'
import history from './history'

class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            problems: []
        }
    }

    componentDidMount() {
        const handle = this.props.match.params.handle;
        this.search(handle)
        history.listen((location, action) => {
            const handle = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
            this.search(handle)
            console.log('handle changed: ' + location + " " + action)
        })
    }

    async search(handle) {
        console.log(handle)
        if (handle.length > 0) {
            this.setState({
                isLoading: true
            })
            try {
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
            } catch (e) {
                console.log(e)
                this.setState({
                    isLoading: false,
                    problems: []
                })
            }
        } else {
            this.setState({
                problems: []
            })
        }
    }

    render() {
        if (this.state.isLoading) {
            return 'Loading...'
        }
        if (this.state.problems.length == 0) {
            return 'empty'
        }
        return <table>
                        <thead>
                            <tr>
                                <th>#</th>
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

export default Table;