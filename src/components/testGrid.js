import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../context';
import Network from '../system/networkManagement';

class TestGrid extends Component {
    state ={
        data:null
    }

    async componentDidMount(){
        let data = await Network.fetch('/test/get-testdata-sync', 'GET');
        this.setState({ data });
        console.log('fetch result: ', data);
    }

    render (){
        const {data} = this.state;
        console.log('test grid data: ', data);
        return (
            data? <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.data.data.map(item => (
                        <tr key= {item.id}>
                            <td>{item.name}</td>
                            <td>{item.company}</td>
                            <td>{item.email}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>: <div><h1>data loading...</h1></div>);
    }
}

export default withContext(( TestGrid )) 