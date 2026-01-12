import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProgressIndicator = ({ progressStatus }) => {
  if (!progressStatus || progressStatus.progressScore === undefined) return null;
  
  const progressPercent = Math.min(100, Math.max(0, progressStatus.progressScore * 50));
  const progressColor = progressStatus.isDangerouslyBehind ? '#FF5252' : 
                       progressStatus.isBehindSchedule ? '#FF9800' : '#4CAF50';
  
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[
          styles.fill, 
          { 
            width: `${progressPercent}%`,
            backgroundColor: progressColor,
          }
        ]} />
      </View>
      <Text style={styles.text}>
        Progress: {(progressStatus.progressScore * 100).toFixed(0)}%
      </Text>
      
      {progressStatus.isDangerouslyBehind && (
        <View style={styles.warning}>
          <Ionicons name="warning" size={16} color="white" />
          <Text style={styles.warningText}>
            Speed up! {Math.ceil(progressStatus.timeUntilStagnation / 1000)}s
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  bar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  warning: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  warningText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProgressIndicator;