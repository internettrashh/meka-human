const navItems = [
  { label: "MINT", path: "/" },
  { label: "RARITY", path: "/rarity" },
  { label: "MEKA CITY", path: "/meka-city" },
  { label: "AIRDROP (SOON)", path: "/airdrop" },
  { label: "SOCIALS", path: "/socials" },
];

export const Navigation = () => {
  // Since we're on a single page, we'll just highlight the first item (MINT) as active
  const currentPath = "/";

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="relative h-[58px] flex items-center justify-between">
          <a href="/">
            <div
              className="w-[239px] h-[58px] bg-[url(/logo.svg)] bg-cover bg-[50%_50%]"
            />
          </a>

          <nav className="max-w-none w-auto">
            <ul className="flex items-center gap-[39px]">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center gap-1"
                >
                  <a
                    href={item.path}
                    className={`relative w-fit mt-[-1.00px] font-['Advent_Pro',Helvetica] font-bold text-base tracking-[0.80px] leading-normal whitespace-nowrap ${
                      currentPath === item.path ? "text-[#f8ee02]" : "text-[#c4c4c4]"
                    } [text-shadow:0px_4px_14px_#8e8801]`}
                  >
                    {item.label}
                  </a>
                  {currentPath === item.path ? (
                    <div className="inline-flex items-start gap-[5px] relative flex-[0_0_auto] mb-[-1.00px] shadow-[0px_4px_14px_#8e8801]">
                      <img
                        className="relative w-[22px] h-[1.5px] mt-[-1.50px]"
                        alt="Line"
                        src="/line-1.svg"
                      />
                      <img
                        className="relative w-1 h-[1.5px] mt-[-1.50px]"
                        alt="Line"
                        src="/line-3.svg"
                      />
                      <img
                        className="relative w-[22px] h-[1.5px] mt-[-1.50px]"
                        alt="Line"
                        src="/line-1.svg"
                      />
                    </div>
                  ) : (
                    <div className="relative w-[58px] h-px mb-[-1.00px] shadow-[0px_4px_14px_#8e8801]" />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-[172px] h-[45px] mt-5">
            <button className="relative w-[168px] h-[45px] p-0 bg-transparent border-none cursor-pointer">
              <img
                className="absolute w-[168px] h-[42px] top-0 left-0"
                alt="Group"
                src="/group-1.png"
              />
              <div className="absolute top-[39px] left-36 font-['Advent_Pro',Helvetica] font-medium text-white text-[5.3px] tracking-[0.26px] leading-normal whitespace-nowrap">
                R25
              </div>
              <div className="absolute top-[11px] left-9 font-['Advent_Pro',Helvetica] font-bold text-white text-base tracking-[0.80px] leading-normal whitespace-nowrap">
                Connect Wallet
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 