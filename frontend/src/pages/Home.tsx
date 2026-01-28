import About from "../components/About.tsx";
import Banner from "../components/Banner.tsx";
import Categories from "../components/Categories.tsx";
import Chefs from "../components/Chefs.tsx";
import Recipes from "../components/Recipes.tsx";

function Home() {
  return (
    <>
      <Banner />
      <br />
      <Categories />
      <br />
      <About />
      <br />
      <Recipes />
      <br />
      <Chefs />
    </>
  );
}

export default Home;
