import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
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
  
  // Track touch state
  const [isTouching, setIsTouching] = useState(false);
  
  // Sound refs
  const greenSound = useRef(new Audio.Sound());
  const redSound = useRef(new Audio.Sound());
  const lastSignalRef = useRef(null);
  
  // Animation refs
  const animationFrame = useRef(null);
  const lastUpdateTime = useRef(0);
  const [roadOffset, setRoadOffset] = useState(0);

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

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
      
      await greenSound.current.loadAsync(require('./assets/green-light.mp3'));
      await redSound.current.loadAsync(require('./assets/red-light.mp3'));
    } catch (error) {
      // Audio setup error - silent fail
    }
  };

  const cleanupAudio = async () => {
    try {
      await greenSound.current.unloadAsync();
      await redSound.current.unloadAsync();
    } catch (error) {
      // Audio cleanup error - silent fail
    }
  };

  const playSound = async (soundRef, rate = 1.0) => {
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setRateAsync(rate, true);
      await soundRef.current.playAsync();
    } catch (error) {
      // Sound play error - silent fail
    }
  };

  const stopSound = async (soundRef) => {
    try {
      await soundRef.current.stopAsync();
    } catch (error) {
      // Sound stop error - silent fail
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
      // Storage load error - silent fail
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
      // Storage save error - silent fail
    }
  };

  const gameLoop = (timestamp) => {
    if (!lastUpdateTime.current) {
      lastUpdateTime.current = timestamp;
    }
    
    const deltaTime = (timestamp - lastUpdateTime.current) / 16;
    lastUpdateTime.current = timestamp;
    
    // Update game engine
    gameEngine.current.update(deltaTime);
    
    // Get updated state
    const state = gameEngine.current.getGameState();
    
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
    setIsTouching(true);
    gameEngine.current.startMoving();
  };

  const handlePressOut = () => {
    setIsTouching(false);
    gameEngine.current.stopMoving();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a1a1a"
        translucent={false}
        hidden={false}
      />
      
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gameArea: {
    flex: 1,
  },
});