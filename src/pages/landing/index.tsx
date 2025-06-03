import { HeroArea } from "./Heroarea";
import { About } from "./Aboutproject";
import { LatestNews } from "./latestnews";
import { CheckRarity } from "./Checkrarity";
import { Footer } from "./Footer";

export const Landing = () => {
  return (
    <>
      <HeroArea />
      <About />
      <LatestNews />
      <CheckRarity />
      <Footer />
    </>
  );
}; 