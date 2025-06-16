import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full min-h-screen bg-[#121211] overflow-hidden ${className}`}>
      <div className="relative w-full min-h-screen">
        {/* Background images with opacity - full width and height */}
        <div className="absolute inset-0 opacity-25">
          <div className="relative w-full h-full">
            <img
              className="absolute w-[602px] h-full top-0 right-0 object-cover"
              alt="Group"
              src="/group-4.png"
            />
            <img
              className="absolute w-[572px] h-full top-0 left-0 object-cover"
              alt="Group"
              src="/group-6.png"
            />
            <img
              className="absolute w-[880px] h-full top-0 left-1/2 transform -translate-x-1/2 object-cover"
              alt="Group"
              src="/group-5.png"
            />
          </div>
        </div>
        
        {/* Content container - properly centered and full height */}
        <div className="relative w-full min-h-screen flex justify-center">
          <div className="w-full max-w-[1440px] relative min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};