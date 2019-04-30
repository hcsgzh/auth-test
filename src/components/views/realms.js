import React,{Component} from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../context';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import logo from "../../assets/img/hugh-opt-logo3.png";

import Network from '../../system/networkManagement';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    //paddingBottom: theme.spacing.unit * 2,
    width: 'auto',
    marginTop:'100px',
    display: 'inline-block',
    verticalAlign: "middle",
  },
  center: {
    textAlign: "center",//'-webkit-center'
    //marginTop:'auto',
    //marginBottom:'auto',
  }

});

class Realms extends Component {

	state ={
    realms:null
  }

  async componentDidMount(){
    //let realms = await (await fetch('/auth/getrealms', this.props.getAuth('GET'))).json();

    // call & wait for the result
    //let realms = await Network.fetch('/auth/getrealms', this.props.getAuth('GET'));
    let realms = await Network.fetch('/auth/getrealms', 'GET');
    realms = realms&&realms.data;
    this.setState({realms});

    // call & display first, won't wait for the reault
    // let realms;
    // Network.fetch('/auth/getrealms', this.props.getAuth('GET')).then(
    //   data =>{

    //     setTimeout(()=>{

    //       console.log('get realms: ', data);
    //       this.realms = data&&data.data;
    //       console.log('... realms : ', this.realms);
    //       this.setState({realms: this.realms});
  
    //     },3000);
    //   }
    // );

    //console.log(realms);
    

    //console.log('cookies : ', document.cookie);



    //fetch('http://localhost:3004/writers')
    //.then(res => res.json())
    //.then(writers => this.setState({writers}))
  }

  //href="#contained-buttons"
  //component={Link} to="/dash/serverpool"

  render(){
  	const {realms} = this.state;
    const {classes,onSelectRealm} =this.props;
    console.log('realm page render: ',this.state);
  	return realms?<div className={classes.center}>

           <Paper className={classes.root} elevation={1} xs={12} sm={12} md={8}>
              {/* <img src={logo} alt="logo" /> */}
              <Typography variant="h5" component="h2" style={{display:'flex'}}>
                Login:
              </Typography>
              <Divider />
              <List component="nav">
                {realms.map(({id, name})=><ListItem key={id} button component="a" href={`/auth/login?realm=${name}`} onClick ={()=> onSelectRealm(id)}>
                                  {id===1?<ListItemIcon >
                                    <StarIcon color='secondary'/>
                                  </ListItemIcon>:null}
                                  <ListItemText inset primary={name} />
                                </ListItem>
                )}
              </List>
            </Paper>
        	</div>: <div><h2>Loading...</h2></div>
  }
}



export default withContext(withStyles(styles)( Realms )) 