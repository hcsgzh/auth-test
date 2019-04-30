import React, { Component } from 'react';

import Network from '../system/networkManagement';

class SortGrid extends Component {

    constructor(props){
        super(props);
        this.handleHeaderClick = this.handleHeaderClick.bind(this);

    }

    state ={
        data:null,
        sort: null
    }

    async componentDidMount(){
        let data = await Network.fetch('/test/get-testdata-sync', 'GET');
        this.setState({ data });
        console.log('fetch result: ', data);
    }

    sortData(data, sort){
        if(sort){
            const { dataIndex, direction } = sort;
            const dir = direction === 'ASC' ? 1: -1;

            return data.slice().sort((A, B) =>{
                const a = A[ dataIndex ];
                const b = B[ dataIndex ];

                if(a > b){
                    return 1 * dir;
                }

                if(a < b){
                    return -1*dir;
                }

                return 0;
            });
        }

        return data;
    }

    getSort(dataIndex, sort){
        return sort && sort.dataIndex === dataIndex ?
        ` (${sort.direction})` : null;
    }

    handleHeaderClick = (dataIndex) =>{
        const { sort } = this.state;

        const direction = sort && sort.dataIndex === dataIndex ?
        (sort.direction === 'ASC' ? 'DESC' : 'ASC') : 'ASC';

        this.setState({
            sort: {
                dataIndex, direction
            }
        });
    }

    render () {
        const { data, sort } = this.state;

        return (
            data? <table>
                <thead>
                    <tr>
                        <th onClick={()=>this.handleHeaderClick('name')}>Name{this.getSort('name', sort)}</th>
                        <th onClick={()=>this.handleHeaderClick('company')}>Company{this.getSort('company', sort)}</th>
                        <th onClick={()=>this.handleHeaderClick('email')}>Email{this.getSort('email', sort)}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.sortData(data.data.data, sort).map(item => (
                            <tr key= {item.id}>
                                <td>{item.name}</td>
                                <td>{item.company}</td>
                                <td>{item.email}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>: <div><h1>data loading...</h1></div>
        );
    }
}



export default SortGrid;