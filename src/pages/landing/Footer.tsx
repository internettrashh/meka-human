import { ArrowRightIcon } from "lucide-react";

export const Footer = ()=> {
  const footerLinks = [
    { text: "MINT MEKA ID", href: "#" },
    { text: "CHECK YOUR NFT RARITY", href: "#" },
    { text: "VISIT MEKA CITY", href: "#" },
  ];

  return (
    <footer className="relative w-full max-w-[1440px] h-auto py-16 bg-[#fcee0a] overflow-hidden">
      <div className="absolute w-full top-0 left-0">
        <img
          className="w-full h-[26px]"
          alt="Section separator"
          src="https://c.animaapp.com/mbg7p9gbkzvGg0/img/section-seperator.svg"
        />
      </div>

      <div className="flex justify-center mt-20 mb-16">
        <div className="flex flex-wrap gap-20 items-center">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="flex gap-4 items-center hover:opacity-80 transition-opacity"
            >
              <span className="font-medium text-black text-lg tracking-[0.90px] font-['Space_Grotesk',Helvetica]">
                {link.text}
              </span>
              <ArrowRightIcon className="w-[26px] h-[14.73px]" />
            </a>
          ))}
        </div>
      </div>

      <div className="flex justify-center px-4">
        <p className="max-w-[656px] font-['Open_Sans',Helvetica] font-normal text-black text-sm text-center tracking-[0.70px]">
          Meka Humans™ and Meka IDs™ are fictional characters and part of an
          original creative universe. This project is not affiliated with,
          endorsed by, or associated with any existing brand, product, or
          entity. All content is for artistic and entertainment purposes only.
          Not financial advice.
        </p>
      </div>
    </footer>
  );
};
