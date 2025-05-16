import React from "react";
import { Navigation } from "../Navigation/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#121211]">
      <Navigation />
      <main className="relative pt-[58px]">
        {children}
      </main>
    </div>
  );
}; 