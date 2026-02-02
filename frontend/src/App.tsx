import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout.tsx";
import AllCategories from "./pages/AllCategories.tsx";
import AllChefs from "./pages/AllChefs.tsx";
import AllRecipes from "./pages/AllRecipes.tsx";
import Authentication from "./pages/Authentication.tsx";
import Category from "./pages/Category.tsx";
import Chef from "./pages/Chef.tsx";
import CreateCategory from "./pages/CreateCategory.tsx";
import CreateChef from "./pages/CreateChef.tsx";
import CreateRecipe from "./pages/CreateRecipe.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MyProfile from "./pages/MyProfile.tsx";
import Favourites from "./pages/Favourites.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Recipe from "./pages/Recipe.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="recipe/:slug" element={<Recipe />} />
            <Route path="chef/:slug" element={<Chef />} />
            {/* <Route path="categories" element={<CreateCategory />} />
            <Route path="chefs" element={<CreateChef />} />
            <Route path="recipes" element={<CreateRecipe />} /> */}

            <Route path="dashboard" element={<Dashboard />}>
              {/* create */}
              <Route path="create-recipe" element={<CreateRecipe />} />
              <Route path="create-chef" element={<CreateChef />} />
              <Route path="create-category" element={<CreateCategory />} />

              {/* admin lists */}
              <Route path="recipes" element={<AllRecipes />} />
              <Route path="chefs" element={<AllChefs />} />
              <Route path="categories" element={<AllCategories />} />

              {/* edit */}
              <Route path="recipes/:id/edit" element={<CreateRecipe />} />
              <Route path="chefs/:id/edit" element={<CreateChef />} />
              <Route path="categories/:id/edit" element={<CreateCategory />} />

              {/* user */}
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="favourites" element={<Favourites />} />
            </Route>

            <Route path="authentication" element={<Authentication />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
