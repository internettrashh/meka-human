import { ArrowRightIcon } from "lucide-react";

export const Footer = ()=> {
  const footerLinks = [
    { text: "MINT MEKA ID", href: "#" },
    { text: "CHECK YOUR NFT RARITY", href: "#" },
    { text: "VISIT MEKA CITY", href: "#" },
  ];

  return (
    <footer className="relative w-full bg-[#fcee0a] overflow-hidden">
      {/* Full Width Section Separator */}
      <img
        className="w-full h-[26px] object-cover object-center"
        alt="Section separator"
        src="https://c.animaapp.com/mbg7p9gbkzvGg0/img/section-seperator.svg"
      />

      {/* Content Container - Centered with max width */}
      <div className="w-full flex justify-center py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          
          {/* Footer Links */}
          <div className="flex justify-center mb-12 lg:mb-16">
            <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 lg:gap-20 items-center justify-center">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex gap-3 lg:gap-4 items-center hover:opacity-80 transition-opacity"
                >
                  <span className="font-medium text-black text-base sm:text-lg tracking-[0.90px] font-['Space_Grotesk',Helvetica] text-center">
                    {link.text}
                  </span>
                  <ArrowRightIcon className="w-[22px] sm:w-[26px] h-[12px] sm:h-[14.73px] flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Text */}
          <div className="flex justify-center">
            <p className="max-w-[656px] font-['Open_Sans',Helvetica] font-normal text-black text-xs sm:text-sm text-center tracking-[0.70px] leading-relaxed">
              Meka Humans™ and Meka IDs™ are fictional characters and part of an
              original creative universe. This project is not affiliated with,
              endorsed by, or associated with any existing brand, product, or
              entity. All content is for artistic and entertainment purposes only.
              Not financial advice.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
