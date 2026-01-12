import React from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Make sure yPosition and shakeAnim are Animated.Value objects
const Player = ({ yPosition, shakeAnim, isMoving, isSliding, speed }) => {
  // Add safety checks
  if (!yPosition || !shakeAnim) {
    console.log('Player: Missing animation values', { yPosition, shakeAnim });
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.playerContainer, 
        { 
          transform: [
            { translateY: yPosition || new Animated.Value(0) },
            { translateX: shakeAnim || new Animated.Value(0) },
          ],
        }
      ]}
    >
      {/* Simple runner graphic */}
      <View style={styles.runner}>
        {/* Head */}
        <View style={styles.head} />
        
        {/* Body */}
        <View style={styles.body} />
        
        {/* Legs */}
        <View style={[
          styles.leg,
          styles.legLeft,
          isMoving && styles.legRunningLeft
        ]} />
        <View style={[
          styles.leg,
          styles.legRight,
          isMoving && styles.legRunningRight
        ]} />
        
        {/* Arms */}
        <View style={[
          styles.arm,
          styles.armLeft,
          isMoving && styles.armRunningLeft
        ]} />
        <View style={[
          styles.arm,
          styles.armRight,
          isMoving && styles.armRunningRight
        ]} />
      </View>
      
      {/* Status indicators */}
      {isSliding && (
        <View style={styles.slideEffect}>
          <Text style={styles.slideText}>SLIDING!</Text>
        </View>
      )}
      
      {isMoving && (
        <View style={styles.speedEffect}>
          <Text style={styles.speedText}>{Math.round(speed)}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 25,
    width: 50,
    height: 85,
    alignItems: 'center',
  },
  runner: {
    width: 50,
    height: 85,
    alignItems: 'center',
    position: 'relative',
  },
  head: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  body: {
    width: 20,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  leg: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 25,
    backgroundColor: '#FFFFFF',
  },
  legLeft: {
    left: 10,
  },
  legRight: {
    right: 10,
  },
  legRunningLeft: {
    transform: [{ rotate: '-25deg' }],
  },
  legRunningRight: {
    transform: [{ rotate: '25deg' }],
  },
  arm: {
    position: 'absolute',
    top: 10,
    width: 6,
    height: 28,
    backgroundColor: '#FFFFFF',
  },
  armLeft: {
    left: -8,
  },
  armRight: {
    right: -8,
  },
  armRunningLeft: {
    transform: [{ rotate: '-135deg' }],
  },
  armRunningRight: {
    transform: [{ rotate: '135deg' }],
  },
  slideEffect: {
    position: 'absolute',
    top: -30,
    backgroundColor: 'rgba(255, 82, 82, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  slideText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  speedEffect: {
    position: 'absolute',
    bottom: -28,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  speedText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default Player;