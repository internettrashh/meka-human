import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/seperator";
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );
  export const CheckRarity = ()=> {
    return (
      <main className="relative w-full min-h-[600px] lg:min-h-[806px] bg-[#121211] overflow-hidden">
        {/* Background graphics with opacity */}
        <div className="absolute inset-0 opacity-10">
          <div className="relative h-full w-full">
            <img
              className="absolute w-[300px] sm:w-[400px] md:w-[500px] lg:w-[601px] h-full top-0 right-0 object-cover"
              alt="Background graphic right"
              src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-4.png"
            />
            <img
              className="absolute w-[280px] sm:w-[350px] md:w-[450px] lg:w-[572px] h-full top-0 left-0 object-cover"
              alt="Background graphic left"
              src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-6.png"
            />
            <img
              className="absolute w-[500px] sm:w-[600px] md:w-[700px] lg:w-[880px] h-[400px] lg:h-[646px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
              alt="Background graphic center"
              src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-5.png"
            />
          </div>
        </div>

        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[806px]">
         {/* Left side - Image */}
<div className="relative flex-1 order-2 lg:order-1">
  <div className="w-full h-[300px] sm:h-[400px] lg:h-full flex items-center justify-center lg:justify-start">
    <img
      className="object-cover h-auto lg:h-[500px] lg:absolute lg:bottom-0 lg:left-0 w-full sm:max-w-[600px] lg:max-w-none"
      alt="Meka characters"
      src="https://c.animaapp.com/mbg7fn10VFbJBP/img/image.png"
    />
  
</div>

          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex items-start lg:items-center justify-center order-1 lg:order-2 py-8 lg:py-0">
            <div className="w-full max-w-[535px] px-4 sm:px-6 lg:px-8 mt-20 sm:mt-12 lg:mt-0">
              <section className="flex flex-col items-start gap-6 lg:gap-9">
                {/* Header section */}
                <div className="flex flex-col items-start gap-4 lg:gap-5 w-full">
                  <h1 className="w-full font-['Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-[35px] tracking-[1.75px] leading-normal">
                    MEKA IDs: THE SECOND REBIRTH
                  </h1>
                  <Separator className="w-full h-[7px] bg-[url('https://c.animaapp.com/mbg7fn10VFbJBP/img/line-seperator.svg')] bg-no-repeat bg-cover" />
                </div>

                {/* Content and CTA section */}
                <div className="flex flex-col items-start gap-12 sm:gap-16 lg:gap-[50px] w-full">
                  <p className="w-full font-['Open_Sans',Helvetica] font-normal text-[#fcee0a] text-base sm:text-lg leading-[28px] lg:leading-[30px]">
                    Meka IDs are not just new models — they're a continuation of
                    consciousness.
                    <br />
                    <br />
                    They emerge from the smog-choked underbelly of Meka City, refined
                    in illegal factories, minted in dark net marketplaces, and coded
                    to evolve. What began as wearable shells are now full-fledged
                    identities: smarter, sleeker, and forged with rare components.
                  </p>

                  {/* Custom button with glitch effect */}
                  <div className="relative w-full max-w-[339px] mt-12 sm:mt-8 lg:mt-0">
                    <div className="relative w-full max-w-[338px] h-[81px]">
                      <Card className="w-full max-w-[336px] h-[77px] border-0 bg-transparent relative">
                        <CardContent className="p-0">
                          <img
                            className="absolute w-full h-full top-0.5 left-0.5 object-contain"
                            alt="Glitch effect"
                            src="https://c.animaapp.com/mbg7fn10VFbJBP/img/glitch.svg"
                          />
                          <img
                            className="absolute w-full h-full top-0 left-0 object-contain"
                            alt="Button background"
                            src="https://c.animaapp.com/mbg7fn10VFbJBP/img/subtract.svg"
                          />
                          <Button className="absolute top-0 left-0 w-full h-[77px] bg-transparent hover:bg-transparent border-0 font-['Space_Grotesk',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-[27px] tracking-[1.35px]">
                            CHECK RARITY
                          </Button>
                          <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 lg:left-[158px] lg:transform-none font-['Space_Grotesk',Helvetica] font-medium text-white text-[8px] tracking-[0.40px] leading-normal">
                            MK ID
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  };
  