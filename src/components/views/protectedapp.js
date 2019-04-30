import React, {Component} from 'react';
import { withContext } from '../../context';


class PrivateHome extends Component {


    render(){
        console.log('render private home ', this.props);
        return (<div>
            <h2>Home is protected.</h2>
            <div>
                <p>This is private information.</p>
            </div>
            <button onClick={()=>this.props.logout()}>Logout</button>
            </div>)
    }
}


export default withContext( PrivateHome );