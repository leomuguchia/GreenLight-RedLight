// engine.jsx - FIXED WITH INITIAL 4-SECOND GREEN

// Constants
const PLAYER = {
  BASE_SPEED: 8,
  MAX_SPEED: 30,
  ACCELERATION: 0.8,
  DECELERATION: 3.0,
  SLIDE_DECAY: 0.3,
  MIN_SPEED: 1,
  SLIDE_THRESHOLD: 5,
};

const SIGNAL = {
  INITIAL_GREEN: 4000, // 4 seconds for first green
  MIN_GREEN: 1500,
  MAX_GREEN: 5000,
  MIN_RED: 1000,
  MAX_RED: 4000,
  FLASH_DURATION: 250,
  GREEN_SOUND_DURATION: 1000,
  RED_SOUND_DURATION: 1000,
};

const GATE = {
  BASE_DISTANCE: 1500,
  MIN_DISTANCE: 800,
  WIDTH_NORMAL: 80,
  WIDTH_NARROW: 40,
  VISIBLE_RANGE: 2000,
};

const PROGRESS = {
  MIN_GATES_PER_MINUTE: 6,
  WARNING_THRESHOLD: 0.7,
  CHECK_INTERVAL: 5000,
  GRACE_PERIOD: 5000,
  MAX_STAGNATION_TIME: 10000,
};

// Sound timing calculator
class SoundTimingCalculator {
  static calculateSoundSpeed(signal, duration) {
    const targetSoundDuration = signal === 'green' 
      ? SIGNAL.GREEN_SOUND_DURATION 
      : SIGNAL.RED_SOUND_DURATION;
    
    const availableTime = duration - 200;
    
    if (availableTime >= targetSoundDuration) {
      return 1.0;
    } else {
      const speedMultiplier = targetSoundDuration / availableTime;
      return Math.min(2.5, Math.max(0.8, speedMultiplier));
    }
  }
  
  static getSoundTiming(signal, duration) {
    const soundSpeed = this.calculateSoundSpeed(signal, duration);
    return {
      soundSpeed: soundSpeed,
      shouldPlaySound: true,
      soundDelay: 0,
    };
  }
}

// Progress Pressure System
class ProgressPressureSystem {
  constructor() {
    this.gameStartTime = Date.now();
    this.lastProgressCheck = Date.now();
    this.lastGatePassedTime = Date.now();
    this.gatesPassedSinceLastCheck = 0;
    this.currentProgressScore = 1.0;
    this.progressWarningActive = false;
    this.progressDangerActive = false;
    this.stagnationWarningActive = false;
  }
  
  reset() {
    this.gameStartTime = Date.now();
    this.lastProgressCheck = Date.now();
    this.lastGatePassedTime = Date.now();
    this.gatesPassedSinceLastCheck = 0;
    this.currentProgressScore = 1.0;
    this.progressWarningActive = false;
    this.progressDangerActive = false;
    this.stagnationWarningActive = false;
  }
  
  update(gatesPassed, gameTime) {
    const now = Date.now();
    const timeSinceLastCheck = now - this.lastProgressCheck;
    
    if (timeSinceLastCheck >= PROGRESS.CHECK_INTERVAL) {
      this.checkProgress(gatesPassed, gameTime);
      this.lastProgressCheck = now;
    }
    
    this.checkStagnation(now);
    
    return this.getProgressStatus();
  }
  
  checkProgress(totalGatesPassed, gameTime) {
    const minutesPlayed = Math.max(0.5, gameTime / 60000);
    const requiredGates = Math.floor(PROGRESS.MIN_GATES_PER_MINUTE * minutesPlayed);
    
    const progressRatio = totalGatesPassed / Math.max(1, requiredGates);
    this.currentProgressScore = Math.min(2.0, progressRatio);
    
    this.progressWarningActive = this.currentProgressScore < PROGRESS.WARNING_THRESHOLD;
    this.progressDangerActive = this.currentProgressScore < 0.5;
    
    this.gatesPassedSinceLastCheck = 0;
  }
  
  checkStagnation(now) {
    const timeSinceLastGate = now - this.lastGatePassedTime;
    const gracePeriodOver = now - this.gameStartTime > PROGRESS.GRACE_PERIOD;
    
    if (gracePeriodOver && timeSinceLastGate > PROGRESS.MAX_STAGNATION_TIME) {
      this.stagnationWarningActive = true;
    } else {
      this.stagnationWarningActive = false;
    }
  }
  
  recordGatePassed() {
    this.lastGatePassedTime = Date.now();
    this.gatesPassedSinceLastCheck++;
  }
  
  getProgressStatus() {
    const now = Date.now();
    const timeSinceLastGate = now - this.lastGatePassedTime;
    const timeUntilStagnation = Math.max(0, PROGRESS.MAX_STAGNATION_TIME - timeSinceLastGate);
    const nextCheckIn = Math.max(0, PROGRESS.CHECK_INTERVAL - (now - this.lastProgressCheck));
    
    return {
      progressScore: this.currentProgressScore,
      isBehindSchedule: this.progressWarningActive,
      isDangerouslyBehind: this.progressDangerActive,
      isStagnating: this.stagnationWarningActive,
      timeSinceLastGate,
      timeUntilStagnation,
      nextCheckIn,
      requiredGatesPerMinute: PROGRESS.MIN_GATES_PER_MINUTE,
    };
  }
  
  shouldForceGameOver() {
    return this.progressDangerActive && this.stagnationWarningActive;
  }
}

// LIC Algorithm
class LICAlgorithm {
  constructor() {
    this.playerPatterns = {
      reactionTime: [],
      stopDistance: [],
      speedPatterns: [],
      gatePerformance: [],
    };
    this.adaptiveLevel = 1;
  }

  reset() {
    this.playerPatterns = {
      reactionTime: [],
      stopDistance: [],
      speedPatterns: [],
      gatePerformance: [],
    };
    this.adaptiveLevel = 1;
  }

  calculateDifficultyAdjustments() {
    const base = this.adaptiveLevel;
    return {
      signalUnpredictability: Math.min(0.8, base * 0.15),
      flashFrequency: Math.min(0.4, base * 0.1),
      flashDeception: Math.min(0.6, base * 0.12),
      narrowGateChance: Math.min(0.5, base * 0.08),
      slipperyGateChance: Math.min(0.4, base * 0.07),
      momentumMultiplier: 1 + (base * 0.1),
      slipChance: Math.min(0.3, base * 0.06),
    };
  }
}

// Main Game Engine - WITH FIXED INITIAL TIMING
export class RedLightGreenLightEngine {
  constructor() {
    this.lic = new LICAlgorithm();
    this.progressSystem = new ProgressPressureSystem();
    this.reset();
  }

  reset() {
    // Core state
    this.state = 'idle';
    this.signal = 'green';
    this.isMoving = false;
    this.isSliding = false;
    this.isTouching = false;
    
    // Player state
    this.speed = PLAYER.BASE_SPEED;
    this.position = 0;
    this.slideMomentum = 0;
    
    // Game progress
    this.score = 0;
    this.gatesPassed = 0;
    this.maxGatesReached = 0;
    this.totalDistance = 0;
    this.gameStartTime = Date.now();
    this.totalPlayTime = 0;
    
    // Gate system
    this.gates = [];
    this.nextGateId = 1;
    this.lastGateDistance = GATE.BASE_DISTANCE;
    
    // Signal system
    this.signalStartTime = Date.now();
    this.currentSignalDuration = SIGNAL.INITIAL_GREEN; // Use INITIAL_GREEN
    this.signalPattern = 'normal';
    this.nextSignalTime = Date.now() + SIGNAL.INITIAL_GREEN; // 4 seconds for first green
    
    // Sound timing
    this.soundTiming = {
      soundSpeed: 1.0,
      shouldPlaySound: true,
      soundDelay: 0,
    };
    
    // Difficulty metrics
    this.internalDifficulty = 1;
    this.gateStreak = 0;
    
    // Progress pressure system
    this.progressSystem.reset();
    this.progressStatus = null;
    
    // Track last signal for sound triggering
    this.lastSignal = null;
  }

  update(deltaTime) {
    if (this.state !== 'running') return;

    const now = Date.now();
    this.totalPlayTime = now - this.gameStartTime;
    
    // Update progress pressure
    this.updateProgressPressure();
    
    // Check for forced game over
    if (this.progressSystem.shouldForceGameOver()) {
      this.state = 'gameOver';
      return;
    }
    
    // Update signal
    this.updateSignal(now);
    
    // Update movement
    this.updateMovement(deltaTime);
    
    // Update gates
    this.updateGates();
    
    // Update score
    this.updateScore();
  }
  
  updateProgressPressure() {
    this.progressStatus = this.progressSystem.update(
      this.gatesPassed,
      this.totalPlayTime
    );
  }

  updateSignal(now) {
    if (now >= this.nextSignalTime) {
      this.switchSignal();
    }
  }

  switchSignal() {
    const now = Date.now();
    const wasGreen = this.signal === 'green';
    
    // Toggle signal
    this.signal = wasGreen ? 'red' : 'green';
    this.signalStartTime = now;
    
    // CRITICAL FIX: Don't check immediately on signal switch
    // The 200ms grace period is already in a setTimeout
    // We'll let the setTimeout handle the check
    
    // Calculate duration (use normal durations after initial green)
    const licAdjustments = this.lic.calculateDifficultyAdjustments();
    
    if (this.signal === 'green') {
      const baseGreen = SIGNAL.MIN_GREEN + (SIGNAL.MAX_GREEN - SIGNAL.MIN_GREEN) * 
                       (1 - this.internalDifficulty * 0.1);
      const variation = (Math.random() - 0.5) * baseGreen * 0.3 * licAdjustments.signalUnpredictability;
      this.currentSignalDuration = Math.max(800, baseGreen + variation);
    } else {
      const baseRed = SIGNAL.MIN_RED + (SIGNAL.MAX_RED - SIGNAL.MIN_RED) * 
                     (this.internalDifficulty * 0.08);
      const variation = Math.random() * baseRed * 0.4 * licAdjustments.signalUnpredictability;
      this.currentSignalDuration = baseRed + variation;
    }
    
    this.nextSignalTime = now + this.currentSignalDuration;
    this.signalPattern = 'normal';
    
    // Calculate sound timing
    this.calculateSoundTiming();
    
    // Check for elimination after 200ms grace period (only for green->red switches)
    if (wasGreen && this.signal === 'red') {
      setTimeout(() => {
        if (this.state !== 'running') return;
        
        if (this.isTouching) {
          this.state = 'gameOver';
          return;
        }
        
        if (this.slideMomentum > PLAYER.SLIDE_THRESHOLD) {
          this.state = 'gameOver';
          return;
        }
      }, 200);
    }
    
    // Random deceptive signals
    if (this.signal === 'red' && Math.random() < licAdjustments.flashFrequency) {
      this.triggerRedFlash();
    }
  }
  
  calculateSoundTiming() {
    const timing = SoundTimingCalculator.getSoundTiming(
      this.signal, 
      this.currentSignalDuration
    );
    this.soundTiming = timing;
  }

  triggerRedFlash() {
    const originalSignal = this.signal;
    const originalNextTime = this.nextSignalTime;
    const originalSoundTiming = { ...this.soundTiming };
    
    this.signal = 'red';
    this.signalPattern = 'flash';
    
    setTimeout(() => {
      if (this.state !== 'running') return;
      
      if (this.isMoving || this.slideMomentum > PLAYER.SLIDE_THRESHOLD) {
        this.state = 'gameOver';
        return;
      }
      
      this.signal = originalSignal;
      this.signalPattern = 'normal';
      this.nextSignalTime = originalNextTime;
      this.soundTiming = originalSoundTiming;
    }, SIGNAL.FLASH_DURATION);
  }

  updateMovement(deltaTime) {
    const licAdjustments = this.lic.calculateDifficultyAdjustments();
    
    // Check for illegal movement on red light
    if (this.signal === 'red' && this.isTouching) {
      this.state = 'gameOver';
      return;
    }
    
    if (this.signal === 'red' && this.slideMomentum > PLAYER.SLIDE_THRESHOLD) {
      this.state = 'gameOver';
      return;
    }
    
    // Green light movement
    if (this.signal === 'green' && this.isTouching) {
      this.isMoving = true;
      this.speed = Math.min(
        PLAYER.MAX_SPEED,
        this.speed + PLAYER.ACCELERATION * deltaTime
      );
      
      const distance = this.speed * deltaTime;
      this.position += distance;
      this.totalDistance += distance;
      
    } else if (this.signal === 'green' && !this.isTouching) {
      this.isMoving = false;
      if (this.speed > PLAYER.BASE_SPEED) {
        this.speed = Math.max(
          PLAYER.BASE_SPEED,
          this.speed - PLAYER.DECELERATION * deltaTime
        );
      }
    }
    
    // Handle slide momentum
    if (this.isSliding) {
      this.slideMomentum *= PLAYER.SLIDE_DECAY;
      this.position += this.slideMomentum * deltaTime;
      
      if (this.slideMomentum < PLAYER.MIN_SPEED) {
        this.isSliding = false;
        this.slideMomentum = 0;
        this.speed = PLAYER.BASE_SPEED;
      }
    }
  }

  updateGates() {
    this.gates = this.gates.filter(gate => {
      const distanceToGate = gate.distance - this.position;
      
      if (Math.abs(distanceToGate) < 30 && !gate.passed) {
        this.passGate(gate);
        gate.passed = true;
      }
      
      return distanceToGate > -GATE.VISIBLE_RANGE;
    });
    
    const lastGate = this.gates.length > 0 
      ? this.gates[this.gates.length - 1]
      : { distance: 0 };
    
    if (lastGate.distance - this.position < 500) {
      this.generateGate();
    }
  }

  generateGate() {
    const licAdjustments = this.lic.calculateDifficultyAdjustments();
    
    let distance = this.position + this.lastGateDistance;
    
    const progressMultiplier = this.progressStatus ? 
      Math.max(0.5, 1 - (this.progressStatus.progressScore * 0.1)) : 0.9;
    
    const distanceReduction = Math.max(
      0.5,
      1 - (this.internalDifficulty * 0.04) * progressMultiplier
    );
    
    this.lastGateDistance *= distanceReduction;
    this.lastGateDistance = Math.max(GATE.MIN_DISTANCE, this.lastGateDistance);
    
    let gateType = 'normal';
    let gateWidth = GATE.WIDTH_NORMAL;
    
    const roll = Math.random();
    
    if (roll < licAdjustments.narrowGateChance) {
      gateType = 'narrow';
      gateWidth = GATE.WIDTH_NARROW;
    } else if (roll < licAdjustments.narrowGateChance + licAdjustments.slipperyGateChance) {
      gateType = 'slippery';
    }
    
    const gate = {
      id: this.nextGateId++,
      distance: distance,
      type: gateType,
      width: gateWidth,
      passed: false,
    };
    
    this.gates.push(gate);
  }

  passGate(gate) {
    this.gatesPassed++;
    this.gateStreak++;
    
    this.progressSystem.recordGatePassed();
    
    let multiplier = 1;
    if (gate.type === 'narrow') multiplier *= 1.5;
    if (gate.type === 'slippery') multiplier *= 2;
    
    const speedBonus = Math.min(2, this.speed / PLAYER.BASE_SPEED);
    multiplier *= speedBonus;
    
    const streakBonus = Math.min(3, 1 + (this.gateStreak * 0.1));
    multiplier *= streakBonus;
    
    if (this.progressStatus && this.progressStatus.progressScore > 1.2) {
      multiplier *= 1.2;
    }
    
    const gateScore = Math.floor(100 * multiplier * this.internalDifficulty);
    this.score += gateScore;
    
    if (this.gatesPassed % 5 === 0) {
      this.internalDifficulty++;
      this.gateStreak = 0;
    }
    
    if (this.gatesPassed > this.maxGatesReached) {
      this.maxGatesReached = this.gatesPassed;
    }
  }

  updateScore() {
    const distanceScore = Math.floor(this.totalDistance / 10);
    this.score = Math.max(this.score, distanceScore);
    
    if (this.progressStatus && this.progressStatus.progressScore > 1.0) {
      const progressBonus = Math.floor((this.progressStatus.progressScore - 1.0) * 10);
      this.score += progressBonus;
    }
  }

  startMoving() {
    if (this.state !== 'running') return;
    
    this.isTouching = true;
    
    if (this.signal === 'red') {
      this.state = 'gameOver';
      return;
    }
    
    this.isMoving = true;
  }

  stopMoving() {
    this.isTouching = false;
    this.isMoving = false;
    
    if (this.speed > PLAYER.BASE_SPEED * 1.5) {
      this.isSliding = true;
      this.slideMomentum = this.speed * 0.6;
    }
  }

  startGame() {
    this.reset();
    this.state = 'running';
    this.gameStartTime = Date.now();
    this.signalStartTime = Date.now();
    this.nextSignalTime = Date.now() + SIGNAL.INITIAL_GREEN; // 4 seconds
    this.calculateSoundTiming();
  }

  getGameState() {
    const now = Date.now();
    
    const signalChanged = this.signal !== this.lastSignal;
    if (signalChanged) {
      this.lastSignal = this.signal;
    }
    
    return {
      state: this.state,
      signal: this.signal,
      signalChanged: signalChanged,
      signalPattern: this.signalPattern,
      isMoving: this.isMoving,
      isTouching: this.isTouching,
      isSliding: this.isSliding,
      speed: this.speed,
      position: this.position,
      slideMomentum: this.slideMomentum,
      score: this.score,
      gatesPassed: this.gatesPassed,
      maxGatesReached: this.maxGatesReached,
      internalDifficulty: this.internalDifficulty,
      gateStreak: this.gateStreak,
      gates: [...this.gates],
      timeUntilNextSignal: Math.max(0, this.nextSignalTime - now),
      currentSignalDuration: this.currentSignalDuration,
      
      soundTiming: { ...this.soundTiming },
      shouldPlaySound: this.soundTiming.shouldPlaySound,
      soundSpeed: this.soundTiming.soundSpeed,
      
      progressStatus: this.progressStatus ? { ...this.progressStatus } : null,
      totalPlayTime: this.totalPlayTime,
      requiredGatesPerMinute: PROGRESS.MIN_GATES_PER_MINUTE,
    };
  }
}