import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GameOverScreen = ({ gameData, highScore, onRestart }) => {
  const isNewHighScore = gameData.score > highScore;
  const progress = gameData.progressStatus;
  
  let gameOverReason = 'Caught moving on red light!';
  if (progress?.isDangerouslyBehind && progress?.isStagnating) {
    gameOverReason = 'Eliminated for lack of progress!';
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>GAME OVER</Text>
        <Text style={styles.reason}>{gameOverReason}</Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{gameData.score}</Text>
          </View>
          
          <View style={styles.stat}>
            <Ionicons name="flag" size={20} color="#4CAF50" />
            <Text style={styles.statLabel}>Gates</Text>
            <Text style={styles.statValue}>{gameData.gatesPassed}</Text>
          </View>
          
          <View style={styles.stat}>
            <Ionicons name="trending-up" size={20} color="#2196F3" />
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{gameData.internalDifficulty}</Text>
          </View>
        </View>
        
        {progress && (
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progress: {(progress.progressScore * 100).toFixed(0)}%
            </Text>
            <Text style={styles.progressSubtext}>
              Required: 6 gates per minute
            </Text>
          </View>
        )}
        
        {isNewHighScore && (
          <View style={styles.highScoreAlert}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.highScoreText}>NEW HIGH SCORE!</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.restartText}>PLAY AGAIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  card: {
    backgroundColor: '#222',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#FF5252',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    color: '#FF5252',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reason: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
    width: '30%',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressSubtext: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  highScoreAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  highScoreText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  restartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameOverScreen;