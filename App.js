/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import Sound from "react-native-sound";

setUpdateIntervalForType(SensorTypes.accelerometer, 50);

// Enable playback in silence mode
Sound.setCategory("Playback");

// Load the sound file 'whoosh.mp3' from the app bundle
// See notes below about preloading sounds within initialization code below.
const click = new Sound("click.mp3", Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log("failed to load the sound", error);
    return;
  }
  // loaded successfully
  console.log(
    "duration in seconds: " +
      click.getDuration() +
      "number of channels: " +
      click.getNumberOfChannels()
  );

  // Play the sound with an onEnd callback
  click.play(success => {
    if (success) {
      console.log("successfully finished playing");
    } else {
      console.log("playback failed due to audio decoding errors");
    }
  });
});

click.setVolume(0.4);

type Props = {};
export default class App extends Component<Props> {
  state = {
    x: 0,
    y: 0,
    sign: true
  };

  componentDidMount() {
    console.log("mounted");
    console.log(this.state);

    setTimeout(() => {
      click.play();
    }, 1000);

    // App.js
    accelerometer.subscribe(({ x, y }) => {
      let sign = this.state.sign;

      if (Math.abs(y) > 0.1) {
        if (y > 0) {
          sign = false;
        } else if (y < 0) {
          sign = true;
        }
      }

      if (sign !== this.state.sign) this.triggerClick();

      this.setState({
        x,
        y,
        sign
      });
    });
  }

  triggerClick() {
    click.play();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fringe Elements V</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
