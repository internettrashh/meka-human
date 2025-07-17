import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useConnection, useActiveAddress } from "@arweave-wallet-kit/react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "MINT", path: "/mint" },
  { label: "RARITY", path: "/rarity" },
  { label: "MEKA CITY", path: "/mekacity" },
  { label: "SOCIALS", path: "/socials" },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connected, connect, disconnect } = useConnection();
  const address = useActiveAddress();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active item based on current route
  const getActiveItem = () => {
    if (location.pathname === "/") {
      return "HOME"; // No nav item should be active on landing page
    }
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : "HOME";
  };

  const activeItem = getActiveItem();

  const handleNavClick = (itemPath: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(itemPath);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleWalletClick = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  // Helper function to truncate wallet address for display
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

      return (
      <div className="fixed top-0 left-0 w-full z-50 lg:bg-transparent bg-[#121211]/95 backdrop-blur-sm lg:backdrop-blur-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="relative h-[58px] sm:h-[70px] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <div className="w-[150px] sm:w-[180px] lg:w-[239px] h-[40px] sm:h-[50px] lg:h-[58px] bg-[url(/logo.svg)] bg-contain bg-no-repeat bg-left" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex max-w-none w-auto">
            <ul className="flex items-center gap-6 xl:gap-[39px]">
              {navItems.map((item, index) => (
                <li key={index} className="flex flex-col items-center gap-1">
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(item.path, e)}
                    className={`relative w-fit font-['Advent_Pro',Helvetica] font-bold text-sm xl:text-base tracking-[0.80px] leading-normal whitespace-nowrap cursor-pointer transition-colors ${
                      activeItem === item.label ? "text-[#f8ee02]" : "text-[#c4c4c4] hover:text-[#f8ee02]"
                    } [text-shadow:0px_4px_14px_#8e8801]`}
                  >
                    {item.label}
                  </a>
                  {activeItem === item.label ? (
                    <div className="inline-flex items-start gap-[5px] relative flex-[0_0_auto] shadow-[0px_4px_14px_#8e8801]">
                      <img className="relative w-[22px] h-[1.5px]" alt="Line" src="/line-1.svg" />
                      <img className="relative w-1 h-[1.5px]" alt="Line" src="/line-3.svg" />
                      <img className="relative w-[22px] h-[1.5px]" alt="Line" src="/line-1.svg" />
                    </div>
                  ) : (
                    <div className="relative w-[58px] h-px shadow-[0px_4px_14px_#8e8801]" />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Wallet Button */}
          <div className="hidden sm:flex w-[140px] lg:w-[172px] h-[40px] lg:h-[45px]">
            <button 
              onClick={handleWalletClick}
              className="relative w-full h-full p-0 bg-transparent border-none cursor-pointer"
            >
              <img
                className="absolute w-full h-[90%] top-0 left-0 object-contain"
                alt="Wallet button background"
                src="/group-1.png"
              />
              <div className="absolute bottom-1 right-4 font-['Advent_Pro',Helvetica] font-medium text-white text-[5px] lg:text-[5.3px] tracking-[0.26px] leading-normal whitespace-nowrap">
                R25
              </div>
              <div className="absolute top-1/2 left-4 lg:left-6 transform -translate-y-1/2 font-['Advent_Pro',Helvetica] font-bold text-white text-xs lg:text-base tracking-[0.80px] leading-normal whitespace-nowrap">
                {connected && address ? truncateAddress(address) : "Connect"}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#121211]/98 backdrop-blur-sm border-t border-gray-800">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Navigation Items */}
              <nav>
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.path}
                        onClick={(e) => handleNavClick(item.path, e)}
                        className={`block font-['Advent_Pro',Helvetica] font-bold text-lg tracking-[0.80px] leading-normal cursor-pointer transition-colors ${
                          activeItem === item.label ? "text-[#f8ee02]" : "text-[#c4c4c4]"
                        } [text-shadow:0px_4px_14px_#8e8801]`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Wallet Button */}
              <div className="pt-4 border-t border-gray-800">
                <button 
                  onClick={handleWalletClick}
                  className="relative w-full max-w-[200px] h-[45px] p-0 bg-transparent border-none cursor-pointer"
                >
                  <img
                    className="absolute w-full h-[42px] top-0 left-0 object-contain"
                    alt="Wallet button background"
                    src="/group-1.png"
                  />
                  <div className="absolute bottom-1 right-8 font-['Advent_Pro',Helvetica] font-medium text-white text-[5.3px] tracking-[0.26px] leading-normal whitespace-nowrap">
                    R25
                  </div>
                  <div className="absolute top-1/2 left-6 transform -translate-y-1/2 font-['Advent_Pro',Helvetica] font-bold text-white text-base tracking-[0.80px] leading-normal whitespace-nowrap">
                    {connected && address ? truncateAddress(address) : "Connect Wallet"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 