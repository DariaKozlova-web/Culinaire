import { MainLayout, ProtectedOnlyAdmin, ProtectedOnlyGuest } from "@/layouts";
import { BrowserRouter, Route, Routes } from "react-router";

import AllCategories from "./pages/AllCategories.tsx";
import AllChefs from "./pages/AllChefs.tsx";
import AllRecipes from "./pages/AllRecipes.tsx";
import Authentication from "./pages/Authentication.tsx";
import Recipes from "./pages/Recipes.tsx";
import Chef from "./pages/Chef.tsx";
import CreateCategory from "./pages/CreateCategory.tsx";
import CreateChef from "./pages/CreateChef.tsx";
import CreateRecipe from "./pages/CreateRecipe.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Favorites from "./pages/Favorites.tsx";
import Home from "./pages/Home.tsx";
import MyProfile from "./pages/MyProfile.tsx";
import NotFound from "./pages/NotFound.tsx";
import RecipePage from "./pages/Recipe.tsx";
import DashboardHome from "./pages/DashboardHome.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipe/:slug" element={<RecipePage />} />
            <Route path="chef/:slug" element={<Chef />} />

            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome/>}/>
              {/* admin */}
              <Route element={<ProtectedOnlyAdmin />}>
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
                <Route
                  path="categories/:id/edit"
                  element={<CreateCategory />}
                />
              </Route>
              {/* user */}
              <Route element={<ProtectedOnlyGuest />}>
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
