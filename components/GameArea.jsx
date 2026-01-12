import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Text, // Added Text import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import all components properly
import SignalIndicator from './SignalIndicator';
import Player from './Player';
import RoadLines from './RoadLines';
import ProgressIndicator from './ProgressIndicator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameArea = ({
  roadOffset,
  signal,
  signalPattern,
  isMoving,
  isSliding,
  speed,
  soundSpeed,
  progressStatus,
  gameData,
  onPressIn,
  onPressOut,
}) => {
  const [playerYAnim] = useState(new Animated.Value(SCREEN_HEIGHT * 0.7));
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [pulseAnim] = useState(new Animated.Value(1)); // <-- ADD THIS LINE
  const [isPressing, setIsPressing] = useState(false);
  
  const handleTouchStart = () => {
    setIsPressing(true);
    if (onPressIn) {
      onPressIn();
    }
  };

  const handleTouchEnd = () => {
    setIsPressing(false);
    if (onPressOut) {
      onPressOut();
    }
  };

  useEffect(() => {
    if (isMoving && !isSliding) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(playerYAnim, {
            toValue: SCREEN_HEIGHT * 0.7 - 5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(playerYAnim, {
            toValue: SCREEN_HEIGHT * 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      playerYAnim.stopAnimation();
      playerYAnim.setValue(SCREEN_HEIGHT * 0.7);
    }

    if (isSliding) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMoving, isSliding]);

  return (
    <TouchableWithoutFeedback
      onPressIn={handleTouchStart}
      onPressOut={handleTouchEnd}
      delayPressIn={0}
      delayPressOut={0}
    >
      <View style={styles.container}>
        <View style={styles.road}>
          <RoadLines offset={roadOffset} />
          
          <Player
            yPosition={playerYAnim}
            shakeAnim={shakeAnim}
            isMoving={isMoving}
            isSliding={isSliding}
            speed={speed}
          />
          
          <SignalIndicator
            signal={signal}
            signalPattern={signalPattern}
            soundSpeed={soundSpeed}
            gameData={gameData}
            pulseAnim={pulseAnim} // <-- PASS IT HERE
          />
          
          <ProgressIndicator progressStatus={progressStatus} />
          
          {/* Simple debug indicator */}
          <View style={styles.debugOverlay}>
            <View style={[
              styles.debugIndicator,
              { backgroundColor: isPressing ? '#4CAF50' : '#FF5252' }
            ]}>
              <Text style={styles.debugText}>
                {isPressing ? 'HOLD' : '---'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  road: {
    flex: 1,
    backgroundColor: '#151515',
    position: 'relative',
    overflow: 'hidden',
  },
  debugOverlay: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  debugIndicator: {
    width: 50,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GameArea;