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
  ImageBackground,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert
} from "react-native";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import Sound from "react-native-sound";

setUpdateIntervalForType(SensorTypes.accelerometer, 250);
setUpdateIntervalForType(SensorTypes.gyroscope, 250);

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
    pressed: false,
    modal: false
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

  infoPress() {
    console.log("info pressed");
  }

  setModalVisible(visible) {
    this.setState({ modal: visible });
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
        <View style={styles.leftButton}>
          <Text
            style={styles.infoTitle}
            onPress={() => {
              this.setModalVisible(!this.state.modal);
            }}
          >
            i
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modal);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
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
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  leftButton: {
    position: "absolute",
    right: 25,
    top: 15,
    backgroundColor: "#ddd",
    height: 50,
    width: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  infoTitle: {
    fontFamily: "Courier",
    color: "#AAA",
    fontSize: 32,
    fontWeight: "400",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1
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
