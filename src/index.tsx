import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import HomePage from './components/HomePage/HomePage';
import ThanksPage from './components/ThanksPage/ThanksPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute path="/virtual-visit">
            <VideoApp />
          </PrivateRoute>
          <Route path="/thanks">
            <ThanksPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
