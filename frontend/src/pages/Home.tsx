import About from "../components/About.tsx";
import Banner from "../components/Banner.tsx";
import CTASection from "../components/CTASection.tsx";
import Categories from "../components/Categories.tsx";
import Chefs from "../components/Chefs.tsx";
import RecipesSection from "../components/RecipesSection.tsx";
import { usePageMeta } from "@/hooks/useTitle";

function Home() {
  usePageMeta({
    title: "Elevated Home Cooking",
    description:
      "Culinaire brings refined, restaurant-style recipes to your home kitchen — with clear steps, chef profiles, and inspiration for special dinners.",
    image: "/og-default.png",
  });
  return (
    <>
      <Banner />
      <Categories />
      <Chefs />
      <About />
      <RecipesSection />
      <CTASection />
    </>
  );
}

export default Home;
