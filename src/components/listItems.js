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
import { Link } from "react-router-dom";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';


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
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem button component={Link} to="/panel">

        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />

      </ListItem>
      <ListItem button component={Link} to="/panel/facturas">
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Facturas" />
      </ListItem>
      <ListItem button component={Link} to="/panel/empleados">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Empleados" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes" />
        {open ? <ExpandLess /> : <ExpandMore />}

      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested} component={Link} to="/panel/reporte-empleados">
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary="Horas trabajadas" />
          </ListItem>
          <ListItem button className={classes.nested} component={Link} to="/panel/reporte-horas">
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary="Fichadas" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button component={Link} to="/panel/aprobaciones">
        <ListItemIcon>
          <ThumbUpIcon />
        </ListItemIcon>
        <ListItemText primary="Aprobaciones" />
      </ListItem>
    </div>
  );
}