import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home";
import { Rarity } from "./pages/Rarity";
import { MekaCity } from "./pages/MekaCity";

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rarity" element={<Rarity />} />
        <Route path="/meka-city" element={<MekaCity />} />
        <Route path="/airdrop" element={<div>Coming Soon</div>} />
        <Route path="/socials" element={<div>Socials Page</div>} />
      </Routes>
    </Layout>
  );
}; 