import React, { ChangeEvent, useState, FormEvent } from 'react';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IntroContainer from '../IntroContainer/IntroContainer';
import Typography from '@material-ui/core/Typography';

import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
  gutterBottom: {
    marginBottom: '1em',
  },
  passcodeContainer: {
    minHeight: '120px',
  },
  submitButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  reconnectContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function ThanksPage() {
  const classes = useStyles();
  const reconnectAble =
    window.sessionStorage.getItem('token') &&
    window.sessionStorage.getItem('identity') &&
    window.sessionStorage.getItem('roomName');
  const reconnectURL = `${window.origin}/virtual-visit?token=${window.sessionStorage.getItem(
    'token'
  )}&identity=${window.sessionStorage.getItem('identity')}&roomName=${window.sessionStorage.getItem('roomName')}`;

  const history = useHistory();
  const location = useLocation<{ from: Location }>();

  return (
    <IntroContainer>
      <div className={classes.reconnectContainer}>
        <Typography variant="h6" className={classNames({ [classes.gutterBottom]: true, [classes.title]: true })}>
          You have disconnected from the virtual visit.
        </Typography>

        {reconnectAble && (
          <Button variant="contained" color="primary" href={reconnectURL}>
            Reconnect
          </Button>
        )}
      </div>
    </IntroContainer>
  );
}
