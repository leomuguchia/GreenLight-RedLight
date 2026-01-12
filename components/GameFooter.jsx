// components/GameFooter.js - optional update
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GameFooter = ({ signal, soundSpeed, isTouching }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {signal === 'green' ? '🎵 HOLD TO RUN 🎵' : '🎵 RELEASE TO STOP 🎵'}
      </Text>
      <Text style={styles.soundSpeed}>
        Sound Speed: {soundSpeed.toFixed(2)}x
      </Text>
      {/* Optional: Show touch status for debugging */}
      {/* <Text style={styles.touchStatus}>
        Touch: {isTouching ? 'PRESSING' : 'RELEASED'}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  soundSpeed: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  touchStatus: {
    color: '#FF9800',
    fontSize: 10,
    marginTop: 2,
  },
});

export default GameFooter;