import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';
import Fade from '@material-ui/core/Fade';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';

import { PublicService } from '../services/Public';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        check-in-tegracion
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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

export default () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [successMessage, setSuccessMessage] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [customerName, setCustomerName] = React.useState('');
  const [customerValue, setCustomerValue] = React.useState(null);

  const [formData, updateFormData] = React.useState({
    taxNumber: "",
    customer: ""
  });

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value
    });
  };

  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    await PublicService.fetchCustomers()
      .then(res => {
        setCustomers(res);
      })
      .catch(err => {
        setMessageError(err.message)
      });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await PublicService.NewSign(formData)
      .then(results => {
        setMessageError(false);
        let movType = results.type === "egress" ? "Salida " : "Entrada ";
        setSuccessMessage(movType + " registrada para " + results.employee.firstName + " " + results.employee.lastName);
        setSuccess(true);
      })
      .catch(err => {
        setMessageError(err.message)
      });
    setLoading(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <QueryBuilderIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nueva fichada
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          {messageError && <FormHelperText>{messageError}</FormHelperText>}
          {success && <FormHelperText>{successMessage}</FormHelperText>}
          <Autocomplete
            id="combo-box-demo"
            options={customers}
            onChange={(event, newValue) => {
              updateFormData({
                ...formData,
                // Trimming any whitespace
                'customer': newValue ? newValue.id : false
              });
              setCustomerValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setCustomerName(newInputValue);
            }}
            value={customerValue}
            inputValue={customerName}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Empresa" variant="outlined" />}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handleChange}
            id="legajo"
            label="CUIL"
            name="taxNumber"
            autoComplete="CUIL"
            autoFocus
          />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              Registrar
          </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}