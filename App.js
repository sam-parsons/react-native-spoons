/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import Sound from "react-native-sound";

setUpdateIntervalForType(SensorTypes.accelerometer, 5);
setUpdateIntervalForType(SensorTypes.gyroscope, 5);

// Enable playback in silence mode
Sound.setCategory("Playback");

// Load the click sound from the app bundle
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
    z: 0,
    sign: true,
    values: [],
    angleY: 0
  };

  componentDidMount() {
    accelerometer.subscribe(({ x, y, z }) => {
      let sign = this.state.sign;

      if (y > this.state.angleY) {
        sign = false;
      } else {
        sign = true;
      }

      let values = this.state.values;
      values.push(y);

      if (sign !== this.state.sign && values.length > 6) {
        this.triggerClick();

        console.log(this.state.values);
        values = [];
      }

      this.setState({
        x,
        y,
        z,
        sign,
        values
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
