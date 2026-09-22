import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="gymbuddy-logo-container">
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-[#171717] border border-[#262626] shadow-sm group overflow-hidden`}
      >
        {/* Subtle ambient glow on icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C7FF3D]/10 to-transparent opacity-60" />
        
        {/* Stylized Modern "G" + Movement/Companion vector */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 relative z-10"
        >
          {/* Outer dynamic G curve */}
          <path
            d="M26 12.5C24.2 9.5 20.8 7.5 17 7.5C11.2 7.5 6.5 12.2 6.5 18C6.5 23.8 11.2 28.5 17 28.5C22.2 28.5 26.5 24.7 27.3 19.8H17.5"
            stroke="#F5F5F5"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic athletic companion movement dot / pulse */}
          <circle cx="26" cy="12.5" r="2.2" fill="#C7FF3D" />
          <path
            d="M17.5 19.8H26.5"
            stroke="#C7FF3D"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-center font-bold tracking-tight">
          <span className={`text-[#F5F5F5] ${textSizes[size]}`}>Gym</span>
          <span className={`text-[#C7FF3D] ${textSizes[size]}`}>Buddy</span>
        </div>
      )}
    </div>
  );
};
