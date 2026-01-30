import About from "../components/About.tsx";
import Banner from "../components/Banner.tsx";
import Categories from "../components/Categories.tsx";
import Chefs from "../components/Chefs.tsx";
import CTASection from "../components/CTASection.tsx";
import Recipes from "../components/Recipes.tsx";

function Home() {
  return (
    <>
      <Banner />
      <Categories />
      <About />
      <Recipes />
      <Chefs />
      <CTASection/>
    </>
  );
}

export default Home;
