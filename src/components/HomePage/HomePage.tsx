import React from 'react';
import { styled, Theme, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as VTOCLogo } from './logo.svg';
import Typography from '@material-ui/core/Typography';

import useHeight from '../../hooks/useHeight/useHeight';
import useRoomState from '../../hooks/useRoomState/useRoomState';

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
    },
  },
});

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default function LoginPage() {
  const classes = useStyles();
  //const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height }}>
      <Grid container justify="center" className={classes.container}>
        <div className={classes.thanks}>
          <VTOCLogo className={classes.vtocLogo} />

          <Typography variant="h6" color="textSecondary">
            VTOC FastTrack Video
          </Typography>
        </div>
      </Grid>
    </Container>
  );
}

// export default function LoginPage() {
//   const classes = useStyles();

//   return (
//     <ThemeProvider theme={theme}>
//       <Grid container justify="center" alignItems="flex-start" className={classes.container}>
//         <div className={classes.thanks}>
//           <VTOCLogo className={classes.vtocLogo} />

//           <Typography variant="h6" color="textSecondary">
//             VTOC FastTrack Video
//           </Typography>
//         </div>
//       </Grid>
//     </ThemeProvider>
//   );
// }
