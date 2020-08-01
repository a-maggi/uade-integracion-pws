import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DashboardService } from '../../../services/Dashboard';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
const { REACT_APP_apiBank } = process.env;

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));


const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});



export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [messageError, setMessageError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    setLoaded(true);
    await DashboardService.fetchBills()
      .then(res => {
        setRows(res)
      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }


  const onPayout = async (id, accountFrom, accountTo, amount, concept) => {
    const dataJson = {
      accountId: accountFrom,
      destinationAccount: accountTo,
      amount: amount,
      description: concept
    };

    var formBody = [];
    for (var property in dataJson) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(dataJson[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const requestOptions = {
      method: 'POST',
      body: formBody,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    let response = await fetch(`${REACT_APP_apiBank}/movements/transfer`, requestOptions);
    let data = await response.json();

    DashboardService.setApproveBill(id)
      .then(res => {
        setSuccess(true);
        fetchService();
      })
      .catch(err => {
        setError(true);
      });
      
  }



  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
    setSuccess(false);
  };



  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            {
              row.charged ? 'Pagada' :
                <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={() => onPayout(row._id, 35, 56, (row.bill_elements).reduce((a, b) => a + b.cost, 0), row.customer.name + " " + row.periodStart + "-" + row.periodEnd)}>
                  Pagar
              </Button>
            }
          </TableCell>
          <TableCell>{row.periodStart}</TableCell>
          <TableCell>{row.periodEnd}</TableCell>
          <TableCell align="right">{row.dueDate}</TableCell>
          <TableCell align="right">{(row.bill_elements).reduce((a, b) => a + b.cost, 0)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Detalle
              </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dias</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Valor ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.bill_elements.map((rowBills) => (
                      <TableRow key={rowBills._id}>
                        <TableCell>{rowBills.certifiedDays}</TableCell>
                        <TableCell>{rowBills.type}</TableCell>
                        <TableCell align="right">{rowBills.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Facturas
      </Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          {isLoaded ?
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '10vh' }}
            >
              <CircularProgress size={24} />
            </Grid> :
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Estado</TableCell>
                  <TableCell>Periodo inicio</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell align="right">Vencimiento</TableCell>
                  <TableCell align="right">Valor ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row._id} row={row} />
                ))}
              </TableBody>
            </Table>
          }
        </TableContainer>
      </Paper>


      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          Factura pagada con exito.
      </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">
          La factura no se pudo pagar.
      </Alert>
      </Snackbar>

    </React.Fragment>
  );
}