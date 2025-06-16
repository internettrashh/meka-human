import React from "react";
import { TextScramble } from "../../components/ui/text-scramble";
import { Button } from "../../components/ui/button";



const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`rounded-xl ${className}`} {...props} />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export const MekaHumanIntro = () => {
  const mekaDescription = [
    "In the year 2207, humanity no longer exists in its original form.",
    "What remains are Meka Humans — cyber-organic vessels encoded with the fractured memories of a dying civilization. Each is unique, built from scrap tech, black market enhancements, and old-world emotion mapped into neural cores.",
    "But identity is no longer static.",
    "Every Meka is a canvas — its face swappable, its eyes programmable, its jacket detachable — yet the core remains: a digital soul encoded in the blockchain.",
  ];

  return (
    <section className="relative w-full min-h-[766px] bg-[#fcee0a] overflow-hidden">
      <div className="relative h-full bg-[url('https://c.animaapp.com/mar1utdu2hzvVC/img/bg-elements.svg')] bg-cover">
        {/* Top Section Separator */}
        <img
          className="w-full h-[27px]"
          alt="Section separator"
          src="https://c.animaapp.com/mar1utdu2hzvVC/img/section-seperator.svg"
        />

        <div className="container mx-auto px-4 pt-[114px] max-w-[1266px]">
          <h1 className="font-bold text-black text-[40px] md:text-[80px] [font-family:'Space_Grotesk',Helvetica] leading-tight">
            MEKA HUMAN
          </h1>

          <div className="flex flex-col md:flex-row gap-12 mt-[35px]">
            <div className="flex flex-col gap-5 max-w-[573px]">
              <div className="flex flex-col gap-2.5">
                <h2 className="font-bold text-black text-[20px] md:text-[26px] tracking-[1.30px] [font-family:'Space_Grotesk',Helvetica]">
                  THE SYNTHETIC AWAKENING
                </h2>
                <img
                  className="w-full max-w-[573px] h-[7px]"
                  alt="Line separator"
                  src="https://c.animaapp.com/mar1utdu2hzvVC/img/line-seperator.svg"
                />
              </div>

              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="[font-family:'Open_Sans',Helvetica] font-normal text-black text-base md:text-lg leading-[27px]">
                    {mekaDescription.map((paragraph, index) => (
                      <React.Fragment key={index}>
                        <p>{paragraph}</p>
                        {index < mekaDescription.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              className="w-full md:w-[596px] h-[300px] md:h-[392px] mt-10 md:mt-[43px] bg-[url('https://c.animaapp.com/mar1utdu2hzvVC/img/subtract.png')] bg-cover bg-center rounded-xl"
              aria-label="Meka Human character illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const MekaCity = () => {
  return (
    <div className="min-h-screen bg-[#121211]">
      {/* Meka Human Intro Section */}
      <MekaHumanIntro />
      
      {/* Section Divider */}
      <img
        className="w-full h-[27px]"
        alt="Section separator"
        src="https://c.animaapp.com/mar1utdu2hzvVC/img/section-seperator.svg"
      />

      {/* Hero Section */}
      <div className="relative w-full h-[56.25rem] overflow-hidden">
        {/* Background Image */}
        <img
          src="/meka-city-bg.png"
          alt="Meka City Background"
          className="absolute w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative max-w-[90rem] mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-[3.5rem] md:text-[5rem] font-['Advent_Pro'] font-bold text-white mb-6">
            <TextScramble text="MEKA CITY" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-[40rem] font-['Space_Grotesk']">
            <TextScramble text="A digital metropolis where Meka Humans thrive, trade, and shape the future of the ecosystem." />
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[90rem] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#1A1A1A] p-8 rounded-lg">
            <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
              <img src="/feature1-icon.svg" alt="Feature 1" className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Advent_Pro'] font-bold text-white mb-4">
              <TextScramble text="Digital Marketplace" />
            </h3>
            <p className="text-gray-400 font-['Space_Grotesk']">
              <TextScramble text="Trade your Meka IDs, accessories, and digital assets in our secure marketplace." />
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#1A1A1A] p-8 rounded-lg">
            <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
              <img src="/feature2-icon.svg" alt="Feature 2" className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Advent_Pro'] font-bold text-white mb-4">
              <TextScramble text="Community Hub" />
            </h3>
            <p className="text-gray-400 font-['Space_Grotesk']">
              <TextScramble text="Connect with other Meka Humans, join events, and participate in community governance." />
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#1A1A1A] p-8 rounded-lg">
            <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
              <img src="/feature3-icon.svg" alt="Feature 3" className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Advent_Pro'] font-bold text-white mb-4">
              <TextScramble text="Exclusive Perks" />
            </h3>
            <p className="text-gray-400 font-['Space_Grotesk']">
              <TextScramble text="Access special events, airdrops, and unique opportunities reserved for Meka Humans." />
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-[#1A1A1A] py-20">
        <div className="max-w-[90rem] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-['Advent_Pro'] font-bold text-white mb-6">
            <TextScramble text="COMING SOON" />
          </h2>
          <p className="text-xl text-gray-300 max-w-[40rem] mx-auto font-['Space_Grotesk']">
            <TextScramble text="Meka City is under construction. Join our community to be the first to know when we launch." />
          </p>
          <button className="mt-8 px-8 py-4 bg-[#F8EE02] text-black font-['Advent_Pro'] font-bold rounded-lg hover:bg-[#E6DC00] transition-colors">
            <TextScramble text="JOIN DISCORD" />
          </button>
        </div>
      </div>
    </div>
  );
}; 


export const About = () => {
  const mekaDescription = [
    "In the year 2207, humanity no longer exists in its original form.",
    "What remains are Meka Humans — cyber-organic vessels encoded with the fractured memories of a dying civilization. Each is unique, built from scrap tech, black market enhancements, and old-world emotion mapped into neural cores.",
    "But identity is no longer static.",
    "Every Meka is a canvas — its face swappable, its eyes programmable, its jacket detachable — yet the core remains: a digital soul encoded in the blockchain.",
  ];

  return (
    <section className="relative w-full h-auto bg-[#fcee0a]">
      <div className="relative h-auto bg-[url(/bg-elements.svg)] bg-cover bg-center">
        {/* Full Width Section Separator */}
        <img
          className="w-full h-[27px] object-cover object-center"
          alt="Section separator"
          src="/section-seperator.svg"
        />

        <div className="w-full flex justify-center py-16 sm:py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Left Content Column */}
            <div className="flex flex-col max-w-full lg:max-w-[573px] lg:flex-shrink-0">
              <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] text-black [font-family:'Space_Grotesk',Helvetica] tracking-tight mb-8 lg:mb-12">
                MEKA HUMAN
              </h1>

              <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex flex-col gap-3 lg:gap-4">
                  <h2 className="font-bold text-xl sm:text-2xl lg:text-[26px] text-black [font-family:'Space_Grotesk',Helvetica] tracking-[1.30px]">
                    THE SYNTHETIC AWAKENING
                  </h2>
                  <div className="w-full max-w-[573px]">
                    <img
                      className="w-full h-[7px] object-contain"
                      alt="Line separator"
                      src="/line-seperator.svg"
                    />
                  </div>
                </div>

                <div className="[font-family:'Open_Sans',Helvetica] font-normal text-black text-base sm:text-lg leading-[27px] max-w-[573px]">
                  {mekaDescription.map((paragraph, index) => (
                    <React.Fragment key={index}>
                      <p>{paragraph}</p>
                      {index < mekaDescription.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="flex justify-center lg:justify-end lg:flex-shrink-0 mt-8 lg:mt-0">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:w-[500px] lg:h-[392px] xl:w-[596px] bg-[url(/subtract.png)] bg-cover bg-center rounded-xl"
                    aria-label="Meka Human visual representation"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};






export const MekaIDs = () => {
  return (
    <main className="relative w-full h-auto bg-[#121211] overflow-hidden">
      <div className="relative h-auto py-16 sm:py-20 lg:py-24">
        {/* Background graphics with opacity */}
        <div className="absolute inset-0 opacity-10">
          <div className="relative h-full w-full">
            <img
              className="absolute w-[601px] h-[600px] top-0 right-0 lg:right-[-50px] xl:right-[-100px] object-cover"
              alt="Background graphic right"
              src="/group-4.png"
            />
            <img
              className="absolute w-[572px] h-[600px] top-0 left-0 object-cover"
              alt="Background graphic left"
              src="/group-6.png"
            />
            <img
              className="absolute w-[880px] h-[500px] top-[50px] left-1/2 transform -translate-x-1/2 lg:left-[280px] lg:transform-none object-cover"
              alt="Background graphic center"
              src="/group-5.png"
            />
          </div>
        </div>

        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left side - Image */}
          <div className="relative flex-1 order-2 lg:order-1">
            <div className="w-full h-[400px] lg:h-full flex items-center justify-center lg:justify-start">
              <img
                className="w-full max-w-[981px] h-auto lg:h-[500px] lg:absolute lg:top-[62px] lg:left-0 object-cover"
                alt="Meka characters"
                src="/image.png"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2 py-12 lg:py-0">
            <div className="w-full max-w-[535px] px-4 sm:px-6 lg:px-8">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="flex flex-col items-start gap-6 lg:gap-9 pt-6 px-0">
                  {/* Header section */}
                  <div className="flex flex-col items-start gap-4 lg:gap-5 w-full">
                    <h1 className="w-full font-['Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-[35px] tracking-[1.75px] leading-normal">
                      MEKA IDs: THE SECOND REBIRTH
                    </h1>
                    <div className="w-full">
                      <img 
                        className="w-full h-[7px] object-contain" 
                        alt="Line separator"
                        src="/line-seperator.svg"
                      />
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="flex flex-col items-start gap-8 lg:gap-[50px] w-full">
                    <p className="w-full font-['Open_Sans',Helvetica] font-normal text-[#fcee0a] text-base sm:text-lg leading-[28px] lg:leading-[30px]">
                      Meka IDs are not just new models — they're a continuation of
                      consciousness.
                      <br />
                      <br />
                      They emerge from the smog-choked underbelly of Meka City,
                      refined in illegal factories, minted in dark net
                      marketplaces, and coded to evolve. What began as wearable
                      shells are now full-fledged identities: smarter, sleeker,
                      and forged with rare components.
                    </p>

                    {/* Button section */}
                    <div className="relative w-full max-w-[339px]">
                      <div className="relative w-[338px] h-[81px]">
                        <Button
                          className="w-[336px] h-[77px] p-0 bg-transparent border-none relative hover:opacity-80 transition-opacity"
                          style={{
                            backgroundImage: `url('/subtract.svg')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          <img
                            className="absolute w-full h-full top-0.5 left-0.5"
                            alt="Button glitch effect"
                            src="/glitch.svg"
                          />
                          <span className="relative font-['Space_Grotesk',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-[27px] tracking-[1.35px] z-10">
                            CHECK RARITY
                          </span>
                          <span className="absolute bottom-2 left-[158px] font-['Space_Grotesk',Helvetica] font-medium text-white text-[8px] tracking-[0.40px]">
                            MK ID
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};