import React, { useRef, useState } from "react";
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

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: orange
  }
});

const useStyles = makeStyles(theme => ({
  details: {
    // display: "flex",
    // flexDirection: "column"
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
    right: "1rem"
  },
  title: {
    textAlign: "center"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function App() {
  const classes = useStyles();
  const audio = useRef(null);
  const [playerState, setPlayerState] = useState({
    playing: false
  });

  const [open, setOpen] = React.useState(true);
  const [volume, setVolume] = React.useState(0.4);

  const handleClickOpen = () => {
    setOpen(true);
  };

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
      audio.current.pause();
      setPlayerState({ ...playerState, playing: false });
    } else {
      audio.current.play();
      setPlayerState({ ...playerState, playing: true });
    }
  };

  if (audio.current) {
    console.log(audio.current.currentTime);
  }

  return (
    <ThemeProvider theme={theme}>
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
          <Card>
            <CardContent>
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography
                    className={classes.title}
                    component="h5"
                    variant="h5"
                  >
                    {/* <Icon fontSize="large">radio</Icon> */}
                    Live Radio Streaming
                  </Typography>
                  <audio
                    volume={volume}
                    src="http://protostar.shoutca.st:8780/stream"
                    ref={ref => (audio.current = ref)}
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
                      <IconButton aria-label="previous">
                        {theme.direction === "rtl" ? (
                          <Icon>skip_next</Icon>
                        ) : (
                          <Icon>skip_previous</Icon>
                        )}
                      </IconButton>
                      <IconButton aria-label="play/pause" onClick={togglePlay}>
                        <Icon className={classes.playIcon}>
                          {playerState.playing ? "pause" : "play_arrow"}
                        </Icon>
                      </IconButton>

                      <IconButton aria-label="next">
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
    </ThemeProvider>
  );
}

export default App;
