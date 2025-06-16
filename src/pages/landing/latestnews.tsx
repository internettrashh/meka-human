import { Card } from "../../components/ui/card";
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );

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
                    <Card
                      key={card.id}
                      className="w-full max-w-[427px] h-[297px] bg-[url(/frame-5.svg)] bg-cover bg-center border-0 relative mx-auto"
                    >
                      <CardContent className="p-0">
                        <img
                          className="w-[calc(100%-10px)] h-[197px] mt-1.5 ml-1.5 object-cover rounded-t-lg"
                          alt="Meka Human"
                          src={card.image}
                        />
                        <p className="absolute w-[calc(100%-40px)] top-[218px] left-5 font-semibold text-white text-sm sm:text-[15px] tracking-[0] leading-normal font-['Open_Sans',Helvetica]">
                          {card.content}
                        </p>
                      </CardContent>
                    </Card>
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