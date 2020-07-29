import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DashboardService } from '../../../services/Dashboard';
import Chart from '../../../components/Chart';
import Fichadas from '../../../components/Fichadas';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import { format, compareAsc } from 'date-fns'
import Title from '../../../components/Title';

import CircularProgress from '@material-ui/core/CircularProgress';
export default () => {

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [isLoaded, setLoaded] = React.useState(true);
  const [employeeNumber, setEmployee] = React.useState(0);
  const [messageError, setMessageError] = React.useState(false);

  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchEmployees()
      .then(res => {
        setEmployee(res.length);
      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }

  return (

    <React.Fragment>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Actual Employees */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Title>Empleados activos</Title>
            {isLoaded ?
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '5vh' }}
              ><CircularProgress size={24} /></Grid> :
              <div>
                <Typography component="p" variant="h4">
                  {employeeNumber}
                </Typography>
                <Typography color="textSecondary" className={classes.depositContext}>
                  al {format(new Date(), "dd 'de' MMM, yyyy")}
                </Typography>
                <div>
                  <Link color="primary" to="/panel/empleados">Ver detalle</Link>
                </div></div>
            }
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Fichadas />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
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
