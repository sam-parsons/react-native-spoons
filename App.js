import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity
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

export default class App extends Component {
  state = {
    y: 0,
    sign: true,
    values: [],
    angleY: 0,
    pressed: false,
    threshold: 0.2
  };

  componentDidMount() {
    accelerometer.subscribe(({ y }) => {
      let sign = this.state.sign;
      const threshold = Math.abs(y) > this.state.threshold;
      if (y > this.state.angleY && threshold) {
        sign = false;
      } else if (threshold) {
        sign = true;
      }
      let values = this.state.values;
      values.push(y);
      if (sign !== this.state.sign && values.length > 6 && this.state.pressed) {
        this.triggerClick();
        values = [];
      }
      this.setState({
        y,
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
        source={require("./assets/spoon.png")}
        style={styles.container}
        imageStyle={{ resizeMode: "contain" }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Spoons</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPressIn={this.onPressIn.bind(this)}
          onPressOut={this.onPressOut.bind(this)}
        >
          <Text style={styles.hold}>Hold With Thumb</Text>
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
    backgroundColor: "#F5FCFF",
    width: "100%",
    height: "100%",
    marginTop: "5%"
  },
  button: {
    position: "absolute",
    bottom: 150,
    height: 70,
    width: "80%",
    alignItems: "center",
    backgroundColor: "#BBB",
    opacity: 0.75,
    padding: 10,
    justifyContent: "center",
    borderRadius: 50
  },
  hold: {
    fontSize: 30,
    fontFamily: "Cochin",
    opacity: 1
  },
  titleText: {
    fontSize: 40,
    fontFamily: "Cochin"
  },
  titleContainer: {
    position: "absolute",
    left: 15,
    top: 200,
    alignItems: "flex-end"
  }
});
