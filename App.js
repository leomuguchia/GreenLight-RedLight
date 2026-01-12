import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

// Components
import GameHeader from './components/GameHeader';
import GameFooter from './components/GameFooter';
import GameArea from './components/GameArea';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';

// Engine
import { RedLightGreenLightEngine } from './components/engine';

// Constants
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants/layouts';

export default function App() {
  const gameEngine = useRef(new RedLightGreenLightEngine());
  
  // Game state
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gatesPassed, setGatesPassed] = useState(0);
  const [maxGatesReached, setMaxGatesReached] = useState(0);
  const [signal, setSignal] = useState('green');
  const [signalPattern, setSignalPattern] = useState('normal');
  const [isMoving, setIsMoving] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [internalDifficulty, setInternalDifficulty] = useState(1);
  const [gateStreak, setGateStreak] = useState(0);
  const [progressStatus, setProgressStatus] = useState(null);
  const [soundSpeed, setSoundSpeed] = useState(1.0);
  const [gameData, setGameData] = useState({});
  
  // Track touch state (for UI feedback only, engine tracks internally)
  const [isTouching, setIsTouching] = useState(false);
  
  // Sound refs
  const greenSound = useRef(new Audio.Sound());
  const redSound = useRef(new Audio.Sound());
  const lastSignalRef = useRef(null);
  
  // Animation refs
  const animationFrame = useRef(null);
  const lastUpdateTime = useRef(0);
  const [roadOffset, setRoadOffset] = useState(0);

  // Load high score and setup audio
  useEffect(() => {
    loadHighScore();
    setupAudio();
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      cleanupAudio();
    };
  }, []);

  // REMOVED: useEffect for updateTouchState - engine tracks touch internally

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
      
      // Load sounds
      await greenSound.current.loadAsync(require('./assets/green-light.mp3'));
      await redSound.current.loadAsync(require('./assets/red-light.mp3'));
    } catch (error) {
      console.log('Error setting up audio:', error);
    }
  };

  const cleanupAudio = async () => {
    try {
      await greenSound.current.unloadAsync();
      await redSound.current.unloadAsync();
    } catch (error) {
      console.log('Error cleaning up audio:', error);
    }
  };

  const playSound = async (soundRef, rate = 1.0) => {
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setRateAsync(rate, true);
      await soundRef.current.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const stopSound = async (soundRef) => {
    try {
      await soundRef.current.stopAsync();
    } catch (error) {
      console.log('Error stopping sound:', error);
    }
  };

  const handleSoundEvents = (state) => {
    const { signal, signalChanged, soundSpeed } = state;
    
    if (signalChanged) {
      if (signal === 'green') {
        playSound(greenSound, soundSpeed);
        lastSignalRef.current = 'green';
      } else {
        playSound(redSound, soundSpeed);
        lastSignalRef.current = 'red';
      }
    }
    
    if (signalPattern === 'flash' && lastSignalRef.current !== 'flash') {
      setTimeout(() => playSound(redSound, 1.5), 50);
      lastSignalRef.current = 'flash';
    }
  };

  const loadHighScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem('rlgl_highscore');
      const savedGates = await AsyncStorage.getItem('rlgl_maxgates');
      if (savedScore) setHighScore(parseInt(savedScore));
      if (savedGates) setMaxGatesReached(parseInt(savedGates));
    } catch (e) {
      console.log('Error loading data:', e);
    }
  };

  const saveHighScore = async (score, gates) => {
    try {
      if (score > highScore) {
        await AsyncStorage.setItem('rlgl_highscore', score.toString());
        setHighScore(score);
      }
      if (gates > maxGatesReached) {
        await AsyncStorage.setItem('rlgl_maxgates', gates.toString());
        setMaxGatesReached(gates);
      }
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const gameLoop = (timestamp) => {
  if (!lastUpdateTime.current) {
    lastUpdateTime.current = timestamp;
  }
  
  const deltaTime = (timestamp - lastUpdateTime.current) / 16;
  lastUpdateTime.current = timestamp;
  
  // Debug: Log before update
  console.log('=== BEFORE ENGINE UPDATE ===');
  console.log(`UI Signal: ${signal} (${signalPattern})`);
  console.log(`Is touching: ${isTouching}`);
  console.log(`Is moving: ${isMoving}`);
  
  // Update game engine
  gameEngine.current.update(deltaTime);
  
  // Get updated state
  const state = gameEngine.current.getGameState();
  
  // Debug: Log after update
  console.log('=== AFTER ENGINE UPDATE ===');
  console.log(`Engine Signal: ${state.signal} (${state.signalPattern})`);
  console.log(`Engine State: ${state.state}`);
  console.log(`Engine isTouching: ${state.isTouching}`);
  console.log(`Engine isMoving: ${state.isMoving}`);
  
  // Handle sound events
  handleSoundEvents(state);
  
  // Update React state
  setGameState(state.state);
  setSignal(state.signal);
  setSignalPattern(state.signalPattern);
  setScore(state.score);
  setGatesPassed(state.gatesPassed);
  setMaxGatesReached(state.maxGatesReached);
  setIsMoving(state.isMoving);
  setIsSliding(state.isSliding);
  setSpeed(state.speed);
  setInternalDifficulty(state.internalDifficulty);
  setGateStreak(state.gateStreak);
  setProgressStatus(state.progressStatus);
  setSoundSpeed(state.soundSpeed);
  setGameData(state);
  
  // Update visual offset
  setRoadOffset(-state.position % SCREEN_WIDTH);
  
  // Check for game over
  if (state.state === 'gameOver') {
    console.log('🎮 GAME OVER REASON:');
    console.log(`   Final Signal: ${state.signal}`);
    console.log(`   Was touching: ${state.isTouching}`);
    console.log(`   Was moving: ${state.isMoving}`);
    console.log(`   Position: ${state.position}`);
    console.log(`   Gates: ${state.gatesPassed}`);
    
    saveHighScore(state.score, state.maxGatesReached);
    cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    
    // Reset touch state
    setIsTouching(false);
    
    // Stop all sounds
    stopSound(greenSound);
    stopSound(redSound);
    lastSignalRef.current = null;
  } else if (state.state === 'running') {
    animationFrame.current = requestAnimationFrame(gameLoop);
  }
};

  const startGame = async () => {
    // Reset touch state
    setIsTouching(false);
    
    // Stop any playing sounds
    await Promise.all([
      stopSound(greenSound),
      stopSound(redSound),
    ]);
    
    // Start game
    gameEngine.current.startGame();
    lastUpdateTime.current = 0;
    animationFrame.current = requestAnimationFrame(gameLoop);
  };

  const handlePressIn = () => {
    console.log('🟢 App: Touch STARTED');
    setIsTouching(true);
    gameEngine.current.startMoving();
  };

  const handlePressOut = () => {
    console.log('🔴 App: Touch ENDED');
    setIsTouching(false);
    gameEngine.current.stopMoving();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {gameState === 'running' && (
        <GameHeader
          score={score}
          highScore={highScore}
          gatesPassed={gatesPassed}
          internalDifficulty={internalDifficulty}
          gateStreak={gateStreak}
        />
      )}
      
      <View style={styles.gameArea}>
        {gameState === 'running' ? (
          <GameArea
            roadOffset={roadOffset}
            signal={signal}
            signalPattern={signalPattern}
            isMoving={isMoving}
            isSliding={isSliding}
            speed={speed}
            soundSpeed={soundSpeed}
            progressStatus={progressStatus}
            gameData={gameData}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            isTouching={isTouching}
          />
        ) : gameState === 'idle' ? (
          <StartScreen
            highScore={highScore}
            maxGatesReached={maxGatesReached}
            onStartGame={startGame}
          />
        ) : (
          <GameOverScreen
            gameData={gameData}
            highScore={highScore}
            onRestart={startGame}
          />
        )}
      </View>
      
      {gameState === 'running' && (
        <GameFooter
          signal={signal}
          soundSpeed={soundSpeed}
          isTouching={isTouching}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gameArea: {
    flex: 1,
  },
});