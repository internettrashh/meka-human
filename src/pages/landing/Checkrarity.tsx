import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/seperator";
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );
  export const CheckRarity = ()=> {
    return (
      <main className="relative w-full h-[806px] bg-[#121211] overflow-hidden">
        <div className="relative w-full h-full">
          {/* Background graphics with opacity */}
          <div className="absolute w-full h-[802px] top-0 left-0 opacity-10">
            <div className="relative h-[802px]">
              <img
                className="absolute w-[601px] h-[802px] top-0 right-0"
                alt="Background graphic right"
                src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-4.png"
              />
              <img
                className="absolute w-[572px] h-[802px] top-0 left-0"
                alt="Background graphic left"
                src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-6.png"
              />
              <img
                className="absolute w-[880px] h-[646px] top-[156px] left-[257px]"
                alt="Background graphic center"
                src="https://c.animaapp.com/mbg7fn10VFbJBP/img/group-5.png"
              />
            </div>
          </div>
  
          {/* Main character image */}
          <img
            className="absolute w-[981px] h-[744px] top-[62px] left-0 object-cover"
            alt="Meka characters"
            src="https://c.animaapp.com/mbg7fn10VFbJBP/img/image.png"
          />
  
          {/* Content section */}
          <section className="flex flex-col items-start gap-9 absolute top-[142px] left-[843px] max-w-[535px]">
            {/* Header section */}
            <div className="flex flex-col items-start gap-5 w-full">
              <h1 className="w-full font-['Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-[35px] tracking-[1.75px] leading-normal">
                MEKA IDs: THE SECOND REBIRTH
              </h1>
              <Separator className="w-full h-[7px] bg-[url('https://c.animaapp.com/mbg7fn10VFbJBP/img/line-seperator.svg')] bg-no-repeat bg-cover" />
            </div>
  
            {/* Content and CTA section */}
            <div className="flex flex-col items-start gap-[50px] w-full">
              <p className="w-full font-['Open_Sans',Helvetica] font-normal text-[#fcee0a] text-lg leading-[30px]">
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
              <div className="relative w-[339px] h-[111px]">
                <div className="relative w-[338px] h-[81px]">
                  <span className="absolute top-[71px] left-[158px] font-['Space_Grotesk',Helvetica] font-medium text-white text-[8px] tracking-[0.40px] leading-normal">
                    MK ID
                  </span>
                  <Card className="absolute w-[336px] h-[77px] top-0 left-0 border-0 bg-transparent">
                    <CardContent className="p-0">
                      <img
                        className="absolute w-[336px] h-[77px] top-0.5 left-0.5"
                        alt="Glitch effect"
                        src="https://c.animaapp.com/mbg7fn10VFbJBP/img/glitch.svg"
                      />
                      <img
                        className="absolute w-[336px] h-[77px] top-0 left-0"
                        alt="Button background"
                        src="https://c.animaapp.com/mbg7fn10VFbJBP/img/subtract.svg"
                      />
                      <Button className="absolute top-0 left-0 w-[336px] h-[77px] bg-transparent hover:bg-transparent border-0 font-['Space_Grotesk',Helvetica] font-bold text-white text-[27px] tracking-[1.35px]">
                        CHECK RARITY
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  };
  