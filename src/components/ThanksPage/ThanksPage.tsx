import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAppState } from '../../state';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as VTOCLogo } from './logo.svg';
import Typography from '@material-ui/core/Typography';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vtocLogo: {
    width: '75%',
    display: 'block',
    marginBottom: '1.5em',
  },
  thanks: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '& h6': {
      fontWeight: '400',
      paddingBottom: '1.5em',
    },
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  reconnect: {},
});

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
});

export default function LoginPage() {
  const classes = useStyles();
  const reconnectAble =
    window.sessionStorage.getItem('token') &&
    window.sessionStorage.getItem('identity') &&
    window.sessionStorage.getItem('roomName');
  const reconnectURL = `${window.origin}/virtual-visit?token=${window.sessionStorage.getItem(
    'token'
  )}&identity=${window.sessionStorage.getItem('identity')}&roomName=${window.sessionStorage.getItem('roomName')}`;

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <div className={classes.thanks}>
          <VTOCLogo className={classes.vtocLogo} />

          <Typography variant="h6" color="textSecondary">
            You have left the virtual visit.
          </Typography>

          <div className={classes.actions}>
            {reconnectAble && (
              <Button variant="contained" color="primary" href={reconnectURL} className={classes.reconnect}>
                Reconnect
              </Button>
            )}
          </div>
        </div>
      </Grid>
    </ThemeProvider>
  );
}