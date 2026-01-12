import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RoadLines = ({ offset }) => {
  const lines = [];
  const lineSpacing = 60;
  const lineCount = Math.ceil(SCREEN_WIDTH / lineSpacing) + 2;
  
  for (let i = 0; i < lineCount; i++) {
    const x = (i * lineSpacing + offset) % (SCREEN_WIDTH + lineSpacing);
    lines.push(
      <View
        key={`line-${i}`}
        style={[styles.line, { left: x }]}
      />
    );
  }
  
  return <>{lines}</>;
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    top: '60%',
    width: 40,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    opacity: 0.8,
  },
});

export default RoadLines;