import React from 'react';
import { useMicroAnimations } from '../hooks/useMicroAnimations';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const {
    hoverSpring,
    pressSpring,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    AnimatedButton: SpringButton
  } = useMicroAnimations();

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <SpringButton
      style={{ ...hoverSpring, ...pressSpring }}
      onMouseEnter={!disabled ? handleMouseEnter : undefined}
      onMouseLeave={!disabled ? handleMouseLeave : undefined}
      onMouseDown={!disabled ? handleMouseDown : undefined}
      onMouseUp={!disabled ? handleMouseUp : undefined}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        font-semibold rounded-lg transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      <motion.span
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {children}
      </motion.span>
    </SpringButton>
  );
};

export default AnimatedButton;