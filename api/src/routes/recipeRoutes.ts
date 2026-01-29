import { Router } from "express";

const recipeRoutes = Router();

recipeRoutes.route("/").get((req, res) => {
  res.json({ message: "Get all recipes" });
});

/**
 * GET /recipe/favorites
 * Get favorite recipes
 * We can filter favorite recipes here or in frontend
 * as favorites are also part of profile output
 */
recipeRoutes.route("favorites").get((req, res) => {
  res.json({ message: "Get favorite recipes, not implemented yet in backend" });
});

export default recipeRoutes;
