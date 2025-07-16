import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { TextScramble } from "../../components/ui/text-scramble";

const featureList = [
  "Unique traits and modular rarity",
  "Community-driven lore",
  "Ecosystem perks and future expansion",
];

export const HeroArea = () => {
  const navigate = useNavigate();

  const handleCheckEligibility = () => {
    navigate('/mint');
  };

  return (
    <div className="relative w-full h-[899px] bg-[#121211] overflow-hidden">
      <div className="relative w-full h-[900px]">
        {/* Background images - full width */}
        <div className="absolute w-full h-[900px] top-0 opacity-25">
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

        {/* Main hero image - centered */}
        <img
          className="absolute w-[1024px] h-[899px] top-0 left-1/2 transform -translate-x-1/2 object-cover"
          alt="Image"
          src="/image-18.png"
        />

        {/* Content container - centered with max width */}
        <div className="relative w-full max-w-[1440px] h-full mx-auto">
          <div>
            <Card 
              className="absolute w-[339px] h-[111px] top-[711px] left-1/2 transform -translate-x-1/2 border-none bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleCheckEligibility}
            >
              <CardContent className="p-0">
                <div className="absolute top-[91px] left-[44px] font-['Advent_Pro',Helvetica] font-bold text-white text-base tracking-[0.80px] leading-normal whitespace-nowrap">
                  <TextScramble text="MEKA NFT MINTING IS LIVE!" />
                </div>
                <div className="absolute w-[338px] h-[81px] top-0 left-0">
                  <div className="absolute top-[71px] left-[161px] font-['Advent_Pro',Helvetica] font-medium text-white text-[8px] tracking-[0.40px] leading-normal">
                    <TextScramble text="MK ID" />
                  </div>
                  <img
                    className="absolute w-[336px] h-[77px] top-0.5 left-0.5"
                    alt="Glitch"
                    src="/glitch.svg"
                  />
                  <img
                    className="absolute w-[336px] h-[77px] top-0 left-0"
                    alt="Subtract"
                    src="/subtract.svg"
                  />
                  <div className="absolute top-[22px] left-[85px] font-['Advent_Pro',Helvetica] font-bold text-white text-[27px] tracking-[1.35px] leading-normal whitespace-nowrap">
                    <TextScramble text="MINT NOW" hover={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex max-w-screen-xl w-[1057px] items-start justify-between absolute top-[524px] left-1/2 transform -translate-x-1/2">
            <div className="relative w-[411px] mt-[-1.00px] font-['Space_Grotesk',Helvetica] font-normal text-gray-300 text-sm tracking-[0] leading-5">
              <TextScramble text="Meka Humans return with a new evolution — Meka IDs." />
              <br />
              <TextScramble text="Each one is a unique, on-chain identity forged from rare traits, rogue tech, and data-driven soul." />
            </div>

            <div className="relative self-stretch w-[389.33px] ml-[-4.16px]" />

            <div className="relative w-fit mt-[-1.00px] ml-[-4.16px] font-['Space_Grotesk',Helvetica] font-normal text-gray-300 text-sm text-right tracking-[0] leading-5">
              {featureList.map((feature, index) => (
                <React.Fragment key={index}>
                  <TextScramble text={feature} />
                  {index < featureList.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};