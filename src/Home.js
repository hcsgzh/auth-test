import React,{Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from "./components/views/404";
import Dashboard  from './components/layout/dashboard';

import TestGrid from './components/testGrid';
import TestSortGrid from './components/testSortGrid';

export default class extends Component {

	state ={
    //writers:[]
  }

  async componentDidMount(){
    //const writers = await (await fetch('http://localhost:3004/writers?_embed=texts')).json();

    //console.log(writers);

    //this.setState({writers});
    //fetch('http://localhost:3004/writers')
    //.then(res => res.json())
    //.then(writers => this.setState({writers}))
  }

  render(){
    //const { writers } = this.state;
    return <Dashboard>
          <Switch>
          <Route path="/dash/serverpool" exact render={()=><div>Server Pool</div>}/>
          <Route path="/dash/server" exact component={ TestGrid }/>
          <Route path="/dash/server/serverdetails" render={()=><div>server details </div>}/>
          <Route path="/dash/tenant" render={()=><div>Tenants</div>}/>
          <Route path="/dash/role" component={ TestSortGrid }/>
          <Route path="/dash/contributor" render={()=><div>Contributor</div>}/>
          <Route path="/dash/provision" render={()=><div>Provision</div>}/>
          <Route path="/dash/dynamo" render={()=><div>Dynamic Model</div>}/>
          <Route component={NotFound}/>
          </Switch>
        </Dashboard>
  }
	
}