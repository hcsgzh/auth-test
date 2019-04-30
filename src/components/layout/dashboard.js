import React ,{Component, Fragment} from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
	AppBar, Toolbar, IconButton, Typography,Hidden, Drawer, List, ListItem, ListItemText, ListItemIcon, CssBaseline, MenuList, MenuItem, Divider, Button
} from '@material-ui/core';

import Collapse from '@material-ui/core/Collapse';

import { Menu } from '@material-ui/icons';

import DashboardIcon from '@material-ui/icons/Dashboard';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import StarBorder from '@material-ui/icons/StarBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import BusinessIcon from '@material-ui/icons/Business';
import BubbleChart from "@material-ui/icons/BubbleChart";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../context';
import {compose} from 'recompose';

import logo from "../../assets/img/hugh-opt-logo.png";


// style

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  logo: {
    position: "relative",
    padding: "5px 5px",
    zIndex: "4",
    display:'inline-flex',
    "&:after": {
      //content: '""',
      position: "absolute",
      //bottom: "0",

      //height: "1px",
      //right: "15px",
      width: "calc(100% - 60px)",
      //backgroundColor: "rgba(180, 180, 180, 0.3)"
    }
  },
  logoImage: {
    width: "60px",
    display: "inline-block",
    maxHeight: "30px",
    marginLeft: "10px",
    marginRight: "15px"
  },
  img: {
    width: "65px",
    //top: "10px",
    position: "absolute",
    verticalAlign: "middle",
    border: "0"
  },
  logoText: {
  	marginTop: '12px'
  },
  button: {
    margin: theme.spacing.unit,
  },
  flex: {
  	flex:1
  }
});



//style


/**
<Typography variant="h5" component="h2">
	                Operator
	            </Typography>
**/

class Dashboard extends Component {
	 state = {
	    mobileOpen: false,
	    open_1: true,
	    open_2: true
	  };

	  handleDrawerToggle = () => {
	    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
	  };

	  handleOpen_1Click = () => {
	    this.setState(state => ({ open_1: !state.open_1 }));
	  };
	  handleOpen_2Click = () => {
	    this.setState(state => ({ open_2: !state.open_2 }));
	  };

	render(){
		const { classes, location: { pathname }, children, onLogout } = this.props;

		const { mobileOpen } = this.state

	    const drawer = (
	      <div>
	      <Hidden xsDown>
	      	<div className={classes.toolbar} >
	      		<div className={classes.logo}>
	      		<div className={classes.logoImage}>
		          <img src={logo} alt="logo" className={classes.img} />
		        </div>
	            <Typography variant="h5" className={classes.logoText}>
	                OPERATOR
	            </Typography>
	            </div>
	      	</div>
	      	<Divider />
	      </Hidden>


	        
	        <MenuList>
	        	<ListItem button onClick={this.handleOpen_1Click}>
		          <ListItemIcon>
		            <DashboardIcon />
		          </ListItemIcon>
		          <ListItemText inset primary="Overview" />
		          {this.state.open_1 ? <ExpandLess /> : <ExpandMore />}
		        </ListItem>
	        	<Collapse in={this.state.open_1} timeout="auto" unmountOnExit>
		          <List component="div" disablePadding>
		              <MenuItem className={classes.nested} component={Link} to="/dash/serverpool" selected={'/dash/serverpool'===pathname}>
		        		Server Pools
		        	  </MenuItem>
		        	  <MenuItem className={classes.nested} component={Link} to="/dash/role" selected={'/dash/role'===pathname}>
		        		Role
		        	  </MenuItem>
		          </List>
		        </Collapse>
		        <Divider />
		        <ListItem button onClick={this.handleOpen_2Click}>
		          <ListItemIcon>
		            <ListIcon />
		          </ListItemIcon>
		          <ListItemText inset primary="Provisioning" />
		          {this.state.open_2 ? <ExpandLess /> : <ExpandMore />}
		        </ListItem>
	        	<Collapse in={this.state.open_2} timeout="auto" unmountOnExit>
		          <List component="div" disablePadding>
		            <MenuItem className={classes.nested} component={Link} to="/dash/provision" selected={'/dash/provision'===pathname}>
		        		Provision
		        	</MenuItem>
		          </List>
		        </Collapse>
		        <Divider />
	        	<ListItem button onClick={this.handleOpen_2Click}>
		          <ListItemIcon>
		            <BubbleChart />
		          </ListItemIcon>
		          <ListItemText inset primary="Tenancy" />
		          {this.state.open_2 ? <ExpandLess /> : <ExpandMore />}
		        </ListItem>
	        	<Collapse in={this.state.open_2} timeout="auto" unmountOnExit>
		          <List component="div" disablePadding>
		            <MenuItem className={classes.nested} component={Link} to="/dash/tenant" selected={'/dash/tenant'===pathname}>
		        		Tenant Management
		        	</MenuItem>
		          </List>
		        </Collapse>
		        <Divider />
                <ListItem button onClick={this.handleOpen_2Click}>
		          <ListItemIcon>
		            <DeviceHubIcon />
		          </ListItemIcon>
		          <ListItemText inset primary="Dynamo" />
		          {this.state.open_2 ? <ExpandLess /> : <ExpandMore />}
		        </ListItem>
	        	<Collapse in={this.state.open_2} timeout="auto" unmountOnExit>
		          <List component="div" disablePadding>
		            <MenuItem className={classes.nested} component={Link} to="/dash/dynamo" selected={'/dash/dynamo'===pathname}>
		        		Dynamic Model
		        	</MenuItem>
		          </List>
		        </Collapse>
	        </MenuList>
	      </div>
	    );

		return <Fragment>
				<CssBaseline />
				<div className={classes.root}>
			        
			        <AppBar position="absolute" className={classes.appBar}>
			          <Toolbar>
			            <IconButton
			              color="inherit"
			              aria-label="Open drawer"
			              onClick={this.handleDrawerToggle}
			              className={classes.menuButton}
			            >
			              <MenuIcon />
			            </IconButton>
			            <Typography variant="h6" color="inherit" noWrap className={classes.flex}>
			              TnT Matrix
			            </Typography>
			            <Button variant="contained" color="secondary" className={classes.button} component={Link} to="/" onClick ={()=> onLogout()}>
					        Logout
					    </Button>
			          </Toolbar>
			        </AppBar>
			        <nav className={classes.drawer}>
			          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
			          <Hidden smUp implementation="css">
			            <Drawer
			              container={this.props.container}
			              variant="temporary"
			              open={mobileOpen}
			              onClose={this.handleDrawerToggle}
			              classes={{
			                paper: classes.drawerPaper,
			              }}
			              ModalProps={{
			                keepMounted: true, // Better open performance on mobile.
			              }}
			            >
			              {drawer}
			            </Drawer>
			          </Hidden>
			          <Hidden xsDown implementation="css">
			            <Drawer
			              classes={{
			                paper: classes.drawerPaper,
			              }}
			              variant="permanent"
			              open
			            >
			              {drawer}
			            </Drawer>
			          </Hidden>
			        </nav>
			        <main className={classes.content}>
			          <div className={classes.toolbar} />
			          {children}
			        </main>
			      </div>
		      </Fragment>
	}
}


export default compose(
	withContext,
	withRouter,
	withStyles(styles)
	)(Dashboard)