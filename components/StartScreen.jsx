import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StartScreen = ({ highScore, maxGatesReached, onStartGame }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>RED LIGHT</Text>
        <Text style={styles.title}>GREEN LIGHT</Text>
        <Text style={styles.subtitle}>Squid Game Challenge</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statValue}>{highScore}</Text>
          <Text style={styles.statLabel}>High Score</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flag" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{maxGatesReached}</Text>
          <Text style={styles.statLabel}>Best Gates</Text>
        </View>
      </View>
      
      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>HOW TO PLAY</Text>
        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.ruleText}>Press & hold to run on GREEN LIGHT</Text>
        </View>
        <View style={styles.ruleItem}>
          <Ionicons name="close-circle" size={16} color="#FF5252" />
          <Text style={styles.ruleText}>Release on RED LIGHT to stop</Text>
        </View>
        <View style={styles.ruleItem}>
          <Ionicons name="flag" size={16} color="#2196F3" />
          <Text style={styles.ruleText}>Pass gates for bonus points</Text>
        </View>
        <View style={styles.ruleItem}>
          <Ionicons name="warning" size={16} color="#FF9800" />
          <Text style={styles.ruleText}>Keep up with progress requirement</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
        <Ionicons name="play" size={22} color="white" />
        <Text style={styles.startButtonText}>START GAME</Text>
      </TouchableOpacity>
      
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>FEATURES</Text>
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Ionicons name="volume-high" size={14} color="#4CAF50" />
            <Text style={styles.featureText}>Dynamic Sound</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up" size={14} color="#2196F3" />
            <Text style={styles.featureText}>Adaptive AI</Text>
          </View>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.feature}>
            <Ionicons name="flash" size={14} color="#FF9800" />
            <Text style={styles.featureText}>Patterns</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="stats-chart" size={14} color="#FF5252" />
            <Text style={styles.featureText}>Progress Track</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    color: '#FF5252',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  rulesBox: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  rulesTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  ruleText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    gap: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    width: '100%',
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  featuresTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  feature: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '45%',
  },
  featureText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default StartScreen;