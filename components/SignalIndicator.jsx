import React from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const SignalIndicator = ({ signal, signalPattern, soundSpeed, gameData, pulseAnim }) => {
  const isGreen = signal === 'green';
  const timeRemaining = gameData.timeUntilNextSignal || 0;
  const seconds = Math.max(0, timeRemaining / 1000);
  
  // Round to 2 decimal places, but show integer when whole number
  const displaySeconds = seconds >= 10 ? 
    Math.floor(seconds) : // Show integer for >= 10 seconds
    seconds.toFixed(2);   // Show 2 decimal places for < 10 seconds
  
  let signalText = isGreen ? 'GO!' : 'STOP!';
  let signalColor = isGreen ? '#4CAF50' : '#FF5252';
  let accentColor = isGreen ? '#66BB6A' : '#FF7043';
  
  if (signalPattern === 'flash') {
    signalText = 'FLASH!';
    signalColor = '#FF9800';
    accentColor = '#FFB74D';
  }
  
  // Calculate percentage for time remaining indicator
  const totalCycleTime = gameData.greenTime + gameData.redTime || 5000;
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalCycleTime) * 100));
  
  // Determine urgency based on time remaining
  const isUrgent = seconds < 3;
  const isWarning = seconds < 5;
  
  return (
    <Animated.View 
      style={[
        styles.signalContainer, 
        { 
          backgroundColor: signalColor,
          transform: [{ scale: pulseAnim }],
          borderColor: accentColor,
        }
      ]}
    >
      {/* Time remaining progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
      
      <View style={styles.signalContent}>
        <Text style={styles.signalText}>{signalText}</Text>
        
        {/* Main timer display */}
        <View style={[
          styles.timerContainer,
          isUrgent && styles.urgentTimer,
          isWarning && styles.warningTimer
        ]}>
          <Text style={[
            styles.timerText,
            isUrgent && styles.urgentTimerText
          ]}>
            {displaySeconds}
            <Text style={styles.timerUnit}>s</Text>
          </Text>
          <Text style={styles.timerLabel}>remaining</Text>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.soundIndicator}>
            <Ionicons name="volume-high" size={14} color="white" />
            <Text style={styles.soundText}>
              {soundSpeed.toFixed(2)}x
            </Text>
          </View>
          
          <View style={styles.cycleInfo}>
            <Ionicons 
              name={isGreen ? "walk" : "hand-left"} 
              size={12} 
              color="rgba(255,255,255,0.8)" 
            />
            <Text style={styles.cycleInfoText}>
              {(isGreen ? gameData.greenTime/1000 : gameData.redTime/1000).toFixed(1)}s
            </Text>
          </View>
        </View>
      </View>
      
      {/* Corner accent */}
      <View style={[styles.cornerAccent, { backgroundColor: accentColor }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  signalContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 160,
    width: width * 0.8,
    maxWidth: 300,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 20,
  },
  signalContent: {
    alignItems: 'center',
    width: '100%',
  },
  signalText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  timerText: {
    color: 'white',
    fontSize: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  urgentTimer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  warningTimer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  urgentTimerText: {
    color: '#FFF',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerUnit: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 2,
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  soundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  soundText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cycleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cycleInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default SignalIndicator;