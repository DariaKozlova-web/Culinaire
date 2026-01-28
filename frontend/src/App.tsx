import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout.tsx";
import Authentication from "./pages/Authentication.tsx";
import Category from "./pages/Category.tsx";
import Chef from "./pages/Chef.tsx";
import CreateCategory from "./pages/CreateCategory.tsx";
import CreateChef from "./pages/CreateChef.tsx";
import CreateRecipe from "./pages/CreateRecipe.tsx";
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
            <Route path="add-category" element={<CreateCategory />} />
            <Route path="add-chef" element={<CreateChef />} />
            <Route path="add-recipe" element={<CreateRecipe />} />
            <Route path="authentication" element={<Authentication />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
