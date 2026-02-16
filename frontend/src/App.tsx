import { MainLayout, ProtectedOnlyAdmin, ProtectedOnlyUser } from "@/layouts";
import { BrowserRouter, Route, Routes } from "react-router";

import About from "./pages/About.tsx";
import AllCategories from "./pages/AllCategories.tsx";
import AllChefs from "./pages/AllChefs.tsx";
import AllRecipes from "./pages/AllRecipes.tsx";
import Authentication from "./pages/Authentication.tsx";
import Chef from "./pages/Chef.tsx";
import Chefs from "./pages/Chefs.tsx";
import Contact from "./pages/Contact.tsx";
import CreateCategory from "./pages/CreateCategory.tsx";
import CreateChef from "./pages/CreateChef.tsx";
import CreateRecipe from "./pages/CreateRecipe.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import DashboardHome from "./pages/DashboardHome.tsx";
import Favorites from "./pages/Favorites.tsx";
import Home from "./pages/Home.tsx";
import MyProfile from "./pages/MyProfile.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import Recipe from "./pages/Recipe.tsx";
import Recipes from "./pages/Recipes.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipe/:slug" element={<Recipe />} />
            <Route path="chefs" element={<Chefs />} />
            <Route path="about" element={<About />} />
            <Route path="chef/:slug" element={<Chef />} />
            <Route path="contact" element={<Contact />} />
            <Route path="policy" element={<PrivacyPolicy />} />

            <Route element={<ProtectedOnlyUser />}>
              <Route path="dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                {/* admin */}
                <Route element={<ProtectedOnlyAdmin />}>
                  {/* create */}
                  <Route
                    path="create-recipe"
                    element={<CreateRecipe key="create-recipe" />}
                  />
                  <Route
                    path="create-chef"
                    element={<CreateChef key="create-chef" />}
                  />
                  <Route
                    path="create-category"
                    element={<CreateCategory key="create-category" />}
                  />

                  {/* admin lists */}
                  <Route path="recipes" element={<AllRecipes />} />
                  <Route path="chefs" element={<AllChefs />} />
                  <Route path="categories" element={<AllCategories />} />

                  {/* edit */}
                  <Route
                    path="recipes/:id/edit"
                    element={<CreateRecipe key="edit-recipe" />}
                  />
                  <Route
                    path="chefs/:id/edit"
                    element={<CreateChef key="edit-chef" />}
                  />
                  <Route
                    path="categories/:id/edit"
                    element={<CreateCategory key="edit-category" />}
                  />
                </Route>
                {/* user */}

                <Route path="my-profile" element={<MyProfile />} />
                <Route path="favorites" element={<Favorites />} />
              </Route>
            </Route>
            <Route
              path="register"
              element={<Authentication showLoginForm={false} />}
            />
            <Route
              path="login"
              element={<Authentication showLoginForm={true} />}
            />
            <Route
              path="authentication"
              element={<Authentication showLoginForm={false} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
