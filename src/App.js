import React, { useRef, useState, useEffect, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange, green } from "@material-ui/core/colors";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function App({ settings }) {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: orange,
      background: green
    },

  });


  const useStyles = makeStyles(theme => ({
    details: {
      // display: "flex",
      // flexDirection: "column"
    },
    button: {
      backgroundColor: settings?.color ?? "#1a237e"
    },
    cardContainer: {
      backgroundColor: settings?.color ?? "#1a237e"
    },
    iconButton: {
      backgroundColor: 'transparent !important',
      '&:hover': {
        backgroundColor: `rgb(255,183,77, 0.6) !important`,
        transition: 'all 500ms'
      }
    },

    controls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    playIcon: {
      fontSize: 50
    },
    toggler: {
      position: "fixed",
      top: "40vh",
      right: "1rem",
      backgroundColor: `${orange[500]} !important`,
    },
    title: {
      textAlign: "center",
      color: "#FFFFFF"
    }
  }));

  const classes = useStyles();
  const audio = useRef(null);
  const [playerState, setPlayerState] = useState({
    playing: false,
    loading: false
  });


  const [open, setOpen] = useState(true);
  const [volume, setVolume] = useState(0.4);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    return () => {
      pause();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(() => {
      audio.current.volume = newValue;
      return newValue;
    });
  };

  const togglePlay = () => {
    if (playerState.playing) {
      pause();
    } else {
      play();
    }
  };

  const play = () => {
    if (audio.current) {
      audio.current.play().then(_ => {
        // Autoplay started!
        setPlayerState({ ...playerState, playing: true });

      }).catch(error => {
        console.log("Couldn't start autoplay", error);
      });
    }
  }

  const pause = () => {
    if (audio.current) {
      audio.current.pause();
      setPlayerState({ ...playerState, playing: false });
    }
  }

  const onLoadStart = () => {
    setPlayerState({ ...playerState, loading: true });
  }

  const onLoadedData = () => {
    setPlayerState({ ...playerState, loading: false });
  }


  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>
        <div>
          <Fab
            size="large"
            className={classes.toggler}
            color="primary"
            variant="extended"
            onClick={handleClickOpen}
          >
            <Icon color="action" fontSize="large">radio</Icon>
          </Fab>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            maxWidth="xs"
          >
            <Card className={classes.cardContainer}>
              <CardContent>
                <Grid container spacing={2} justify="center" alignItems="center">
                  <Grid item xs={12}>
                    <Typography
                      className={classes.title}
                      component="h5"
                      variant="h5"
                    >
                      Live Radio Streaming
                    </Typography>
                    <audio
                      volume={volume}
                      src={settings?.url ?? "https://newcovenant.radioca.st/stream"}
                      ref={ref => (audio.current = ref)}
                      onCanPlay={play}
                      onLoadStart={onLoadStart}
                      onLoadedData={onLoadedData}
                    ></audio>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={2}
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item md={6} xs={12} className={classes.controls}>
                        <IconButton className={classes.iconButton} aria-label="previous">
                          {theme.direction === "rtl" ? (
                            <Icon>skip_next</Icon>
                          ) : (
                              <Icon>skip_previous</Icon>
                            )}
                        </IconButton>
                        <IconButton className={classes.iconButton} aria-label="play/pause" onClick={togglePlay}>
                          <Icon className={classes.playIcon}>
                            {playerState.playing ? "pause" : "play_arrow"}
                          </Icon>
                        </IconButton>

                        <IconButton className={classes.iconButton} aria-label="next">
                          {theme.direction === "rtl" ? (
                            <Icon>skip_previous</Icon>
                          ) : (
                              <Icon>skip_next</Icon>
                            )}
                        </IconButton>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Grid
                          container
                          spacing={1}
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <Icon>
                              {volume === 0.0 ? "volume_off" : "volume_down"}{" "}
                            </Icon>
                          </Grid>
                          <Grid item xs>
                            <Slider
                              min={0}
                              max={1}
                              step={0.05}
                              value={volume}
                              onChange={handleVolumeChange}
                              aria-labelledby="continuous-slider"
                            />
                          </Grid>
                          <Grid item>
                            <Icon>volume_up</Icon>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Dialog>
        </div>
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}

export default App;
