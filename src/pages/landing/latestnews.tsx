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
        <section className="relative w-full max-w-[1440px] h-[584px] bg-[#fcee0a]">
          <div className="h-[584px] bg-[url(/bg-elements.svg)] relative bg-[100%_100%]">
            <h1 className="absolute top-[63px] left-[60px] font-bold text-[#ff003c] text-[80px] tracking-[0] leading-[normal] font-['Space_Grotesk',Helvetica]">
              LATEST NEWS
            </h1>
    
            <div className="flex gap-5 absolute top-[166px] left-[60px]">
              {newsCards.map((card) => (
                <Card
                  key={card.id}
                  className="w-[427px] h-[297px] bg-[url(/frame-5.svg)] bg-[100%_100%] border-0 relative"
                >
                  <CardContent className="p-0">
                    <img
                      className="w-[417px] h-[197px] mt-1.5 ml-1.5 object-cover"
                      alt="Meka Human"
                      src={card.image}
                    />
                    <p className="absolute w-[389px] top-[218px] left-5 font-semibold text-white text-[15px] tracking-[0] leading-[normal] font-['Open_Sans',Helvetica]">
                      {card.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
          <img
  className="w-full h-[27px] relative -top-3"
  style={{ transform: 'rotate(180deg)' }}
  alt="Section separator"
  src="/section-seperator.svg"
/>
        </section>

       
      </>
    );
  };