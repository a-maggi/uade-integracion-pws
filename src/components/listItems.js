import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import { Link, useLocation } from "react-router-dom";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import HistoryIcon from '@material-ui/icons/History';
import List from '@material-ui/core/List';

import { authenticationService } from '../services/Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


export default () => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const [user, setUser] = React.useState(authenticationService.user);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem button component={Link} to="/panel" selected={location.pathname == '/panel' ? true : false}>

        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />

      </ListItem>
      {(user.user.role.name == "Administrator") &&
        <ListItem button component={Link} to="/panel/facturas" selected={location.pathname == '/panel/facturas' ? true : false}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Facturas" />
        </ListItem>
      }
      {(user.user.role.name == "Administrator") &&
        <ListItem button component={Link} to="/panel/empleados" selected={location.pathname == '/panel/empleados' ? true : false}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Empleados" />
        </ListItem>
      }
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {(user.user.role.name == "Administrator") &&
            <ListItem button className={classes.nested} component={Link} to="/panel/reporte-empleados" selected={location.pathname == '/panel/reporte-empleados' ? true : false}>
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText primary="Horas trabajadas" />
            </ListItem>
          }
          <ListItem button className={classes.nested} component={Link} to="/panel/reporte-horas" selected={location.pathname == '/panel/reporte-horas' ? true : false}>
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary="Fichadas" />
          </ListItem>

        </List>
      </Collapse>
      {(user.user.role.name == "Administrator") &&
        <ListItem button component={Link} to="/panel/aprobaciones" selected={location.pathname == '/panel/aprobaciones' ? true : false}>
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText primary="Aprobaciones" />
        </ListItem>
      }
      {(user.user.role.name == "Authenticated") &&
        <ListItem button component={Link} to="/panel/licencias" selected={location.pathname == '/panel/licencias' ? true : false}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Licencias" />
        </ListItem>
      }
    </div>
  );
}