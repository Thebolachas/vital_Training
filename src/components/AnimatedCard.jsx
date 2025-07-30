import React from 'react';
import { useMicroAnimations } from '../hooks/useMicroAnimations';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  onClick, 
  className = '', 
  delay = 0,
  ...props 
}) => {
  const {
    hoverSpring,
    fadeInSpring,
    handleMouseEnter,
    handleMouseLeave,
    AnimatedDiv
  } = useMicroAnimations();

  return (
    <AnimatedDiv
      style={{ ...fadeInSpring, ...hoverSpring }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 transition-all duration-200 border border-gray-100
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatedDiv>
  );
};

export default AnimatedCard;