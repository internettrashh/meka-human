import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { TextScramble } from "../../components/ui/text-scramble";

const featureList = [
  "Unique traits and modular rarity",
  "Community-driven lore",
  "Ecosystem perks and future expansion",
];

export const HeroArea = () => {
  return (
    <div className="relative w-full max-w-[1440px] h-[899px] bg-[#121211] overflow-hidden">
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

        <img
          className="absolute w-[1024px] h-[899px] top-0 left-[395px] object-cover"
          alt="Image"
          src="/image-18.png"
        />

        <div>
          <Card className="absolute w-[339px] h-[111px] top-[711px] left-[749px] border-none bg-transparent">
            <CardContent className="p-0">
              <div className="absolute top-[91px] left-[74px] font-['Advent_Pro',Helvetica] font-bold text-white text-base tracking-[0.80px] leading-normal whitespace-nowrap">
                <TextScramble text="WHITELIST CHECKER IS LIVE!" />
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
                <div className="absolute top-[22px] left-[68px] font-['Advent_Pro',Helvetica] font-bold text-white text-[27px] tracking-[1.35px] leading-normal whitespace-nowrap">
                  <TextScramble text="CHECK ELIGIBILITY" hover={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex max-w-screen-xl w-[1057px] items-start justify-between absolute top-[524px] left-[374px]">
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
  );
};