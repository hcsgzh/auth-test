import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from './context';
import Home from './Home';
import Realms from './components/views/realms';
import PrivateHome from "./components/views/protectedapp";
import NotFound from './components/views/404';
import CssBaseline from '@material-ui/core/CssBaseline';




//const App = props => <h1>Hello</h1>;

//throw new Error('Something went wrong');

class App extends React.Component {

	state = {
		auth: {
			headers:{
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST'
		}
	};

	getAuth= (method) => {
		this.state.auth.method = method;
		//document.cookie;
		// get all the cookies
		let cookie = document.cookie.split('; ').reduce((acc, c) => {
			const [key, val] = c.split('='); 
			acc[key] = val; 
			return acc;
		}, {});
		console.log('cookie acc : ',cookie);
		// read the cookies, if there is a signature, then add the auth header and delete the signature from cookies.
		if(cookie.signature){
			console.log('signature is received!! ', cookie.signature);
			this.state.auth.headers.authorization = 'Bearer ' + cookie.signature;


			console.log('delete the signature from the cookie');

			let d = new Date(); //Create an date object
			d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
			let expires = "expires=" + d.toGMTString(); //Compose the expirartion date
			document.cookie = 'signature'+"="+"; "+expires;//Set the cookie with name and the expiration date
		}
		return this.state.auth;
	};

	onSelectRealm = (id) => {
		// TODO: get keycloak token and internal token
		//       go to home page or redirect to home page from server

		console.log('onClick realm: '+ id);
		
	}
	logout = () =>{
		console.log('logout ... ');
		window.location.href = "/auth/logout";
	}

	getContext = () => ({
		...this.state,
		onSelectRealm: this.onSelectRealm,
		getAuth: this.getAuth,
		logout: this.logout,
	})

	render() {
		return (
			<Provider value={this.getContext()}>
			<CssBaseline />
			<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Realms}/>
				<Route path="/app" exact component={PrivateHome}/>
				<Route path="/dash" component={Home}/>
				<Route component={NotFound}/>
			</Switch>
			</BrowserRouter>
			</Provider>
		);
	}
}

export default App;