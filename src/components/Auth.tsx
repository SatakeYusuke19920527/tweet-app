import React, { useState } from 'react';
import styles from './Auth.module.css';
import { auth, provider, storage } from '../util/firebase';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
  Link,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import CameraIcon from '@material-ui/icons/Camera';
import EmailIcon from '@material-ui/icons/Email';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
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
}));

const Auth: React.FC<{}> = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const classes = useStyles();
  const signInGoogle = async () => {
    await auth
      .signInWithPopup(provider)
      .then(function (usr) {
        alert('login success' + usr.user?.displayName);
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('エラー発生');
        console.log('code : ', errorCode);
        console.log('message : ', errorMessage);
      });
  };
  const signInEmailAndPassword = async () => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        console.log(user.user?.displayName, 'さんおかえりなさい。');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('code : ', errorCode);
        console.log('message : ', errorMessage);
      });
  };

  const signUpEmailAndPassword = async () => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user.user?.displayName, 'さんようこそ！');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('code : ', errorCode);
        console.log('message : ', errorMessage);
      });
  };
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
            {isLogin ? 'LogIn' : 'SignUp'}
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => setEmail(e.target.value)}
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
            value={password}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signInEmailAndPassword}
          >
            {isLogin ? 'LogIn' : 'SignUp'}
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <span>Forgot Password?</span>
            </Grid>
            <Grid item xs={6}>
              <span>{isLogin ? 'Create new Account' : 'back to login'}</span>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={signInGoogle}
          >
            Google Sign In
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
