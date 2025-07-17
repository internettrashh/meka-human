
import React from "react";

export const LatestNews = () => {
    // Data for news cards to enable mapping
    const newsCards = [
      {
        id: 1,
        image: "/rectangle-3-2.png",
        content:
          "Get ready, Meka IDs officially drop in June 2025. The next evolution of identity is almost here. Gear up for a multi-phase mint and unlock your place.",
      },
      {
        id: 2,
        image: "/rectangle-3-2.png",
        content:
          "As part of our ecosystem perks, all ARNS holders will receive 50% off during Phase 2 of the Meka IDs mint. Make sure your wallets are ready!",
      },
      {
        id: 3,
        image: "/rectangle-3-2.png",
        content:
          "Loyalty is rewarded. All original Meka Human holders will receive 1 free mint per wallet in Phase 1. You paved the way — now claim your next evolution.",
      },
    ];
  
    return (
      <>
        <section className="relative w-full min-h-[584px] bg-[#fcee0a]">
          <div className="relative min-h-[584px] bg-[url(/bg-elements.svg)] bg-cover bg-center">
            
            {/* Content Container - Centered with max width */}
            <div className="w-full flex justify-center py-16 sm:py-20 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
                
                {/* Title */}
                <h1 className="font-bold text-[#ff003c] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] tracking-[0] leading-normal font-['Space_Grotesk',Helvetica] mb-8 lg:mb-12">
                  LATEST NEWS
                </h1>
        
                {/* News Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {newsCards.map((card) => (
                    <div
                      key={card.id}
                      className="w-full max-w-[427px] h-[297px] bg-[url(/frame-5.svg)] bg-cover bg-center relative mx-auto"
                    >
                      <div className="p-0 h-full flex flex-col">
                        <img
                          className="w-[calc(100%-12px)] h-[197px] mt-1.5 ml-1.5 mr-1.5 object-cover rounded-xl flex-shrink-0"
                          alt="Meka Human"
                          src={card.image}
                        />
                        <div className="flex-1 px-5 py-2 flex items-start">
                          <p className="font-semibold text-white text-xs sm:text-sm tracking-[0] leading-tight font-['Open_Sans',Helvetica] max-h-[60px] overflow-hidden">
                            {card.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
          
          {/* Full Width Section Separator */}
          <img
            className="w-full h-[27px] object-cover object-center"
            style={{ transform: 'rotate(180deg)' }}
            alt="Section separator"
            src="/section-seperator.svg"
          />
        </section>

       
      </>
    );
  };