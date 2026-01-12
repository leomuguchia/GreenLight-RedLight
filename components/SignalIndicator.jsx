import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignalIndicator = ({ signal, signalPattern, soundSpeed, gameData, pulseAnim }) => {
  const isGreen = signal === 'green';
  const timeRemaining = gameData.timeUntilNextSignal || 0;
  const seconds = Math.max(0, timeRemaining / 1000).toFixed(1);
  
  let signalText = isGreen ? 'GO!' : 'STOP!';
  let signalColor = isGreen ? '#4CAF50' : '#FF5252';
  
  if (signalPattern === 'flash') {
    signalText = 'FLASH!';
    signalColor = '#FF9800';
  }
  
  return (
    <Animated.View 
      style={[
        styles.signalContainer, 
        { 
          backgroundColor: signalColor,
          transform: [{ scale: pulseAnim }],
        }
      ]}
    >
      <View style={styles.signalContent}>
        <Text style={styles.signalText}>{signalText}</Text>
        <Text style={styles.signalTimer}>{seconds}s</Text>
        
        <View style={styles.soundIndicator}>
          <Ionicons name="volume-high" size={12} color="white" />
          <Text style={styles.soundText}>
            {soundSpeed.toFixed(2)}x
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  signalContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signalContent: {
    alignItems: 'center',
  },
  signalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signalTimer: {
    color: 'white',
    fontSize: 11,
    opacity: 0.9,
    marginTop: 2,
  },
  soundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  soundText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3,
  },
});

export default SignalIndicator;