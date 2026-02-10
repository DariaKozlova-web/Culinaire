import About from "../components/About.tsx";
import Banner from "../components/Banner.tsx";
import CTASection from "../components/CTASection.tsx";
import Categories from "../components/Categories.tsx";
import Chefs from "../components/Chefs.tsx";
import RecipesSection from "../components/RecipesSection.tsx";

function Home() {
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
