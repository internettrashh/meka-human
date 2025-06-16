import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full min-h-[899px] bg-[#121211] overflow-hidden ${className}`}>
      <div className="relative w-full min-h-[900px]">
        {/* Background images with opacity - full width */}
        <div className="absolute inset-0 opacity-25">
          <div className="relative w-full h-full">
            <img
              className="absolute w-[602px] h-[899px] top-0 right-0"
              alt="Group"
              src="/group-4.png"
            />
            <img
              className="absolute w-[572px] h-[899px] top-0 left-0"
              alt="Group"
              src="/group-6.png"
            />
            <img
              className="absolute w-[880px] h-[743px] top-[156px] left-1/2 transform -translate-x-1/2"
              alt="Group"
              src="/group-5.png"
            />
          </div>
        </div>
        
        {/* Content container - properly centered */}
        <div className="relative w-full min-h-[900px] flex justify-center">
          <div className="w-full max-w-[1440px] relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};