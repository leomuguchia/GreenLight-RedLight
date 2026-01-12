import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GameHeader = ({ score, highScore, gatesPassed, internalDifficulty, gateStreak }) => {
  return (
    <View style={styles.header}>
      <View style={styles.scoreBox}>
        <Ionicons name="trophy" size={16} color="#FFD700" />
        <Text style={styles.highScore}>BEST: {highScore}</Text>
      </View>
      
      <View style={styles.middleHeader}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreLabel}>SCORE</Text>
      </View>
      
      <View style={styles.statsBox}>
        <View style={styles.statBadge}>
          <Ionicons name="flag" size={12} color="#4CAF50" />
          <Text style={styles.statValue}>{gatesPassed}</Text>
        </View>
        <View style={styles.statBadge}>
          <Ionicons name="trending-up" size={12} color="#2196F3" />
          <Text style={styles.statValue}>Lvl {internalDifficulty}</Text>
        </View>
        {gateStreak > 0 && (
          <View style={styles.statBadge}>
            <Ionicons name="flame" size={12} color="#FF5252" />
            <Text style={styles.statValue}>{gateStreak}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD70033',
  },
  highScore: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  middleHeader: {
    alignItems: 'center',
  },
  score: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#888',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: -2,
  },
  statsBox: {
    flexDirection: 'row',
    gap: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  statValue: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default GameHeader;