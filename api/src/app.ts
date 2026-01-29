import cors from "cors";
import express from "express";
import "#db";
import { authenticate, errorHandler, isAdmin } from "#middlewares";
import { profileRoutes, recipeRoutes } from "#routes";

const app = express();
const port = process.env.PORT || 8000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/admin", authenticate, isAdmin, (req, res) => {
  res.json("you are an admin");
});

app.use("/profile", profileRoutes);
app.use("/recipe", recipeRoutes);

app.use("/*splat", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);
app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`),
);
