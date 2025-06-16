import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full max-w-[1440px] h-[899px] bg-[#121211] overflow-hidden ${className}`}>
      <div className="relative w-[1774px] h-[900px] left-[-182px]">
        <div className="absolute w-[1774px] h-[900px] top-0 left-0 opacity-25">
          <div className="relative w-[1440px] h-[899px] left-[182px]">
            <img
              className="absolute w-[602px] h-[899px] top-0 left-[838px]"
              alt="Group"
              src="/group-4.png"
            />
            <img
              className="absolute w-[572px] h-[899px] top-0 left-0"
              alt="Group"
              src="/group-6.png"
            />
            <img
              className="absolute w-[880px] h-[743px] top-[156px] left-[257px]"
              alt="Group"
              src="/group-5.png"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};