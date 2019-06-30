/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Button
} from "react-native";
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
    angleY: 0,
    pressed: false
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

      if (sign !== this.state.sign && values.length > 6 && this.state.pressed) {
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

  onPressIn() {
    this.setState({ pressed: true });
  }

  onPressOut() {
    this.setState({ pressed: false });
  }

  render() {
    return (
      <ImageBackground
        source={require("./assets/spoon.jpg")}
        style={{ width: "100%", height: "100%" }}
        imageStyle={{ resizeMode: "contain" }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Play</Text>
          <Text style={styles.titleText}>Spoons!</Text>
        </View>
        <View style={styles.leftButton}>
          <Button
            title="info"
            color="white"
            fontSize="22"
            accessibilityLabel="Learn more info"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPressIn={this.onPressIn.bind(this)}
          onPressOut={this.onPressOut.bind(this)}
        >
          <Text> Hold With Thumb</Text>
        </TouchableOpacity>
      </ImageBackground>
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
  button: {
    position: "absolute",
    bottom: 100,
    height: 70,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    justifyContent: "center"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  leftButton: {
    position: "absolute",
    right: 35,
    top: 70,
    backgroundColor: "gray",
    height: 70,
    width: 70,
    borderRadius: 40,
    justifyContent: "center"
  },
  titleText: {
    fontSize: 30,
    fontFamily: "Iowan Old Style"
  },
  titleContainer: {
    position: "absolute",
    left: 15,
    top: 70,
    alignItems: "flex-end"
  }
});
