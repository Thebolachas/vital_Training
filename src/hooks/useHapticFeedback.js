import { useSpring, animated } from '@react-spring/web';
import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useHapticFeedback = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const [successSpring, setSuccessSpring] = useSpring(() => ({
    scale: 1,
    rotateZ: 0,
    config: { tension: 300, friction: 10 }
  }));

  const [errorSpring, setErrorSpring] = useSpring(() => ({
    x: 0,
    config: { tension: 500, friction: 10 }
  }));

  const triggerSuccess = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setSuccessSpring.start({
      scale: [1, 1.15, 1],
      rotateZ: [0, 3, -3, 0],
      config: { duration: 600 }
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#4CAF50', '#8BC34A', '#CDDC39']
    });

    playSuccessSound();
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, setSuccessSpring]);

  const triggerError = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (navigator.vibrate) {
      navigator.vibrate([80]);
    }

    setErrorSpring.start({
      x: [0, -10, 10, -8, 8, -5, 5, 0],
      config: { duration: 400 }
    });

    playErrorSound();
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, setErrorSpring]);

  const triggerAchievement = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });

      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });
    }, 250);

    playAchievementSound();
  }, []);

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playErrorSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playAchievementSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [261.63, 329.63, 392.00];
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.5);

        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.5);
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  return {
    triggerSuccess,
    triggerError,
    triggerAchievement,
    successSpring,
    errorSpring,
    AnimatedDiv: animated.div,
    isAnimating
  };
};