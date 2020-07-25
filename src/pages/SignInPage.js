import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useHistory } from "react-router-dom";
import { authenticationService } from '../services/Auth';

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
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  wrapper: {
    position: 'relative',
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
  let history = useHistory();

  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [formData, updateFormData] = React.useState({
    identifier: "",
    password: ""
  });

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value
    });
  };

  
  React.useEffect(() => {
    if(authenticationService.user()){
      console.log(authenticationService.user())
      console.log("en login ok")
      history.push("/panel");
    }
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await authenticationService.login(formData.identifier, formData.password)
      .then(user => {
        console.log("Redirijo a home privada");
        history.push("/panel");
      })
      .catch(err => {
        setLoading(false)
        setMessageError(err)
      });
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            {messageError && <FormHelperText>{messageError}</FormHelperText>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="identifier"
              autoComplete="email"
              onChange={handleChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
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
                Ingresar
          </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}