import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';
import Fade from '@material-ui/core/Fade';

import FormHelperText from '@material-ui/core/FormHelperText';
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
  const [isManual, setManual] = React.useState(false);
  const [messageError, seMessageError] = React.useState(false);
  const [formData, updateFormData] = React.useState({
    taxNumber: "",
    type: "entry",
    fechaHora: ""
  });

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = await fetch('https://integracion-apps.herokuapp.com/signeds', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const results = await data.json();
    console.log(results);
    if(results.statusCode > 300)
      seMessageError(results.message)

    setLoading(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nueva entrada
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
        { messageError && <FormHelperText>{messageError}</FormHelperText>  }
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handleChange}
            id="legajo"
            label="Legajo"
            name="taxNumber"
            autoComplete="legajo"
            autoFocus
          />

          <Fade in={isManual}>
            <TextField
              id="datetime-local"
              label="Fecha"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              className={classes.textField}
              onChange={handleChange}
              name="fechaHora"
              InputLabelProps={{
                shrink: true,
              }}
            /></Fade>
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
          <Grid container>
            <Grid item xs>
              <Fade in={!isManual}>
                <Link href="#" variant="body2" onClick={() => setManual(true)}>
                  Ingresar registro manual?
              </Link>
              </Fade>
              <Fade in={isManual}>
                <Link href="#" variant="body2" onClick={() => setManual(false)}>
                  Cancelar <Close style={{ fontSize: 14, verticalAlign: "middle" }}></Close>
                </Link>
              </Fade>
            </Grid>
            
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}