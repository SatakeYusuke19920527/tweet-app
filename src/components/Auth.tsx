import React, { useState } from 'react';
import styles from './Auth.module.css';
import { auth, provider, storage } from '../util/firebase';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/userSlice';

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
  modeText: {
    color: 'blue',
    cursor: 'pointer',
  },
}));

const Auth: React.FC<{}> = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const classes = useStyles();
  const dispatch = useDispatch();

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = '';
    }
  };

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
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signUpEmailAndPassword = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = '';
    if (avatarImage) {
      const S =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('');
      const fileName = randomChar + '_' + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref('avatars').child(fileName).getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: name,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: name,
        photoUrl: url,
      })
    );
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
            {isLogin ? 'LogIn' : 'Register'}
          </Typography>
          {isLogin ? null : (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => setName(e.target.value)}
              />
              <Box textAlign="center">
                <IconButton color="secondary" aria-label="add an alarm">
                  <label>
                    <AccountCircleIcon
                      fontSize="large"
                      className={
                        avatarImage
                          ? styles.login_addIconLoaded
                          : styles.login_addIcon
                      }
                    />
                    <input
                      className={styles.login_hiddenIcon}
                      type="file"
                      onChange={onChangeImageHandler}
                    />
                  </label>
                </IconButton>
              </Box>
            </>
          )}
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
            disabled={
              isLogin
                ? !email || password.length < 6
                : !name || !email || password.length < 6 || !avatarImage
            }
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            startIcon={<EmailIcon />}
            onClick={
              isLogin
                ? async () => {
                    try {
                      await signInEmailAndPassword();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
                : async () => {
                    try {
                      await signUpEmailAndPassword();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
            }
          >
            {isLogin ? 'LogIn' : 'Register'}
          </Button>
          <Grid container spacing={2}>
            <Grid item xs>
              <span className={classes.modeText}>Forgot Password?</span>
            </Grid>
            <Grid item>
              <span
                onClick={() => setIsLogin(!isLogin)}
                className={classes.modeText}
              >
                {isLogin ? 'Create new Account' : 'Back to login'}
              </span>
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
