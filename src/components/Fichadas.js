import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { DashboardService } from '../services/Dashboard';

import { format, subDays } from 'date-fns'

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();

  const [messageError, setMessageError] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(true);
  const [data, setData] = React.useState(false);

  React.useEffect(() => {
    fetch();
  }, []);


  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchHours({
      employee: '',
      dateFrom: format(subDays(new Date(), 1), "yyyy-MM-dd"),
      dateTo: format(subDays(new Date(),-2), "yyyy-MM-dd")
    })
      .then(res => {
        setData(res);

      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }


  return (
    <React.Fragment>
      <Title>Fichadas recientes</Title>
      {isLoaded ?
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        ><CircularProgress size={24} /></Grid> :
        data.length > 0 ? 
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell align="right">Horas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{ format(new Date(row.createdAt), "dd 'de' MMM, yyyy") }</TableCell>
                <TableCell>{row.employee.firstName}</TableCell>
                <TableCell>{row.employee.lastName}</TableCell>
                <TableCell align="right">{  Math.round(row.hoursInCompany / 60  * 100)/100  } hs</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : <div>Sin fichadas registradas.</div>}
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          Ver más fichadas
        </Link>
      </div>
    </React.Fragment>
  );
}