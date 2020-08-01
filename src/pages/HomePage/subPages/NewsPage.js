import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
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
import Modal from '@material-ui/core/Modal';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { authenticationService } from '../../../services/Auth';

import { green } from '@material-ui/core/colors';
const { REACT_APP_apiBank } = process.env;

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  margin: {
    marginBottom: theme.spacing(5),
  },
  textField: {
    display: 'block',
  },
  form: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
  const [isLoaded, setLoaded] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [messageError, setMessageError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [successCreate, setSuccessCreate] = React.useState(false);
  const [errorCreate, setErrorCreate] = React.useState(false);
  const [user, setUser] = React.useState(authenticationService.user);

  const [formData, updateFormData] = React.useState({
    periodStart: "",
    periodEnd: "",
  });

  React.useEffect(() => {

  }, []);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    setLoaded(true);
    await DashboardService.creatBills(formData)
      .then(res => {
        setSuccess(true);
      })
      .catch(err => {
        setError(true);
      });
      setLoaded(false);
      e.preventDefault();
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
    setSuccess(false);
  };



  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">Novedades para liquidación</Typography>
        </Toolbar>
        <TableContainer component={Paper}>
          <form className={classes.form} onSubmit={onSubmit}>
            <TextField
              id="date"
              label="Fecha desde"
              type="date"
              name="periodStart"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
              className={clsx(classes.margin, classes.textField)}
            />
            <TextField
              id="date"
              label="Fecha desde"
              type="date"
              name="periodEnd"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
              className={clsx(classes.margin, classes.textField)}
            />
            <div className={classes.wrapper}>
              <Button
                type="submit"
                
                variant="contained"
                color="primary"
                disabled={isLoaded}
                className={classes.submit}
              >
                Enviar
          </Button>
              {isLoaded && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </form>
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