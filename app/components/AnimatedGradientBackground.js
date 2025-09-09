import React from 'react';

const AnimatedGradientBackground = () => {
  return (
    <div
      className="
        absolute inset-0 -z-10 min-h-screen w-full
        bg-gradient-to-r from-yellow-100 via-blue-200 to-pink-950
        bg-[length:400%_400%]
        animate-(--animate-gradient)
      "
    ></div>
  );
};

export default AnimatedGradientBackground;