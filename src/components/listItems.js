import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Link } from "react-router-dom";

export const mainListItems = (
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
    <ListItem button component={Link} to="/panel/reportes">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reportes" />
    </ListItem>
    <ListItem button component={Link} to="/panel/aprobaciones">
      <ListItemIcon>
        <ThumbUpIcon />
      </ListItemIcon>
      <ListItemText primary="Aprobaciones" />
    </ListItem>
  </div>
);