import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';

export const useMicroAnimations = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const hoverSpring = useSpring({
    transform: isHovered 
      ? 'translateY(-2px) scale(1.02)' 
      : 'translateY(0px) scale(1)',
    boxShadow: isHovered
      ? '0 8px 25px rgba(0,0,0,0.15)'
      : '0 2px 10px rgba(0,0,0,0.1)',
    config: { tension: 300, friction: 20 }
  });

  const pressSpring = useSpring({
    transform: isPressed 
      ? 'scale(0.95)' 
      : 'scale(1)',
    config: { tension: 500, friction: 30 }
  });

  const fadeInSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 200, friction: 20 }
  });

  const slideInSpring = useSpring({
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { tension: 200, friction: 20 }
  });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return {
    hoverSpring,
    pressSpring,
    fadeInSpring,
    slideInSpring,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    AnimatedDiv: animated.div,
    AnimatedButton: animated.button
  };
};