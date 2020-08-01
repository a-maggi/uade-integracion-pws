import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MainListItems from '../../components/listItems';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { authenticationService } from '../../services/Auth';
import { useHistory } from "react-router-dom";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Hidden from '@material-ui/core/Hidden';
import HomePage from "./subPages/HomePage"
import NewsPage from "./subPages/NewsPage"
import EmployeesPage from "./subPages/EmployeesPage"
import HoursPage from "./subPages/HoursPage"
import HoursByEmployeePage from "./subPages/HoursByEmployeePage"
import ApprovalsPage from "./subPages/ApprovalsPage"
import BillsPage from "./subPages/BillsPage"
import LicencesPage from "./subPages/LicencesPage"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

export default (props) => {
  const { window } = props;
  let match = useRouteMatch();
  let history = useHistory();
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(false);
  const [user, setUser] = React.useState(authenticationService.user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const openUser = Boolean(anchorEl);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogout = () => {
    handleClose();
    setUser(false)
    authenticationService.logout();
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  }

  React.useEffect(() => {
    // setUser(authenticationService.user);
    setLoaded(true);
    if (!user || user == null) history.push('/');




  }, []);


  React.useEffect(() => {
    if (!user) history.push('/');
  }, [user]);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          {user && (
            <div>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Typography>{user.user.username}	&nbsp;</Typography>
                <AccountCircle />
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openUser}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={open}
          >
            <div className={classes.toolbar} />
            <Divider />
            <List><MainListItems></MainListItems></List>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            open
          >
             <div className={classes.toolbar} />
              <Divider />
            <List><MainListItems></MainListItems></List>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Switch>
            <Route path={`${match.path}/facturas`}>
              <BillsPage></BillsPage>
            </Route>
            <Route path={`${match.path}/reporte-empleados`}>
              <HoursByEmployeePage></HoursByEmployeePage>
            </Route>
            <Route path={`${match.path}/reporte-horas`}>
              <HoursPage></HoursPage>
            </Route>
            <Route path={`${match.path}/empleados`}>
              <EmployeesPage></EmployeesPage>
            </Route>
            <Route path={`${match.path}/aprobaciones`}>
              <ApprovalsPage></ApprovalsPage>
            </Route>
            <Route path={`${match.path}/licencias`}>
              <LicencesPage></LicencesPage>
            </Route>
            <Route path={`${match.path}/novedades`}>
              <NewsPage></NewsPage>
            </Route>
            <Route path={match.path}>
              <HomePage></HomePage>
            </Route>
          </Switch>


          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar,
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#f5f5f5'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));
