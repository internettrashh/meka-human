import { Landing } from "./pages/landing";
import { Layout } from "./Layout/Layout";
import { Route, Routes } from "react-router-dom";
import RarityPage from "./pages/rarity";
import MekacityPage from "./pages/mekacity";
import SocialsPage from "./pages/socials";
import WhitelistCheck from "./pages/mint/whitelistcheck";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mint" element={<WhitelistCheck />} />
        <Route path="/rarity" element={<RarityPage />} />
        <Route path="/mekacity" element={<MekacityPage />} />
        <Route path="/socials" element={<SocialsPage />} />
      </Routes>
    </Layout>
  );
}


export default App;
