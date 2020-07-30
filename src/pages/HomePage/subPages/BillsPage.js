import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DashboardService } from '../../../services/Dashboard';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));


export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [messageError, setMessageError] = React.useState(false);

  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchBills()
      .then(res => {
        console.log(123);
        setRows(res)
      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }

  return (
    <Paper className={classes.paper}>
      <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Facturas
      </Typography>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Periodo inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Vencimiento</TableCell>
              <TableCell align="right">Estado</TableCell>
              <TableCell align="right">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.periodStart}</TableCell>
                <TableCell>{row.periodEnd}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell align="right">{row.charged}</TableCell>
                <TableCell align="right">{row.charged}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}