import { categoriesMock } from "../mocks/categories.mock";
import { chefsMock } from "../mocks/chefs.mock";

import { useState } from "react";


/* =======================
   UI CLASSES
======================= */

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

const textareaBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

const selectBase =
  "w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

/* =======================
   PAGE
======================= */

const CreateRecipe = () => {
  const [ingredients, setIngredients] = useState([
    { title: "", quantity: "", unit: "" },
  ]);

  const [steps, setSteps] = useState([
    { number: "", title: "", image: "", description: "" },
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page title */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold">Create new recipe</h1>
        <p className="mt-2 text-sm text-(--text-muted)">
          Add a new recipe to the Culinaire collection
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-3xl border border-black/10 bg-white px-8 py-10">
        {/* MAIN INFORMATION */}
        <Section title="Main information">
          <input className={inputBase} placeholder="Recipe title" />
          <input className={inputBase} placeholder="Recipe image" />

          <select className={selectBase}>
            <option value="">Recipe creator</option>
            {chefsMock.map((chef) => (
              <option key={chef.id} value={chef.id}>
                {chef.name}
              </option>
            ))}
          </select>

          <select className={selectBase}>
            <option value="">Recipe category</option>
            {categoriesMock.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>

          <textarea
            rows={3}
            className={textareaBase}
            placeholder="Recipe description"
          />
        </Section>

        {/* RECIPE DETAILS */}
        <Section title="Recipe details">
          <input className={inputBase} placeholder="Total time" />
          <input className={inputBase} placeholder="Cuisine" />
          <input className={inputBase} placeholder="Difficulty" />
          <input className={inputBase} placeholder="Servings" />
        </Section>

        {/* INGREDIENTS */}
        <Section title="Ingredients">
          {ingredients.map((_, index) => (
            <div key={index} className="flex gap-4">
              <input
                className={inputBase}
                placeholder="Ingredient title"
              />
              <input className={inputBase} placeholder="Quantity" />
              <select className={selectBase}>
                <option>Unit</option>
                <option>g</option>
                <option>ml</option>
                <option>pcs</option>
              </select>

              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="text-black/40"
                  onClick={() =>
                    setIngredients((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="ml-auto mt-4 rounded-xl border border-(--accent-olive) px-4 py-2 text-sm text-(--accent-olive)"
            onClick={() =>
              setIngredients((prev) => [
                ...prev,
                { title: "", quantity: "", unit: "" },
              ])
            }
          >
            + Add ingredient
          </button>
        </Section>

        {/* COOKING STEPS */}
        <Section title="Cooking steps">
          {steps.map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/10 p-6"
            >
              <div className="mb-4 flex gap-4">
                <input
                  className={inputBase}
                  placeholder="Step number"
                />
                <input
                  className={inputBase}
                  placeholder="Step title"
                />

                {steps.length > 1 && (
                  <button
                    type="button"
                    className="text-black/40"
                    onClick={() =>
                      setSteps((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                className={inputBase}
                placeholder="Step image"
              />

              <textarea
                rows={3}
                className={`${textareaBase} mt-4`}
                placeholder="Step description"
              />
            </div>
          ))}

          <button
            type="button"
            className="ml-auto mt-4 rounded-xl border border-(--accent-olive) px-4 py-2 text-sm text-(--accent-olive)"
            onClick={() =>
              setSteps((prev) => [
                ...prev,
                { number: "", title: "", image: "", description: "" },
              ])
            }
          >
            + Add step
          </button>
        </Section>

        {/* SUBMIT */}
        <button
          type="button"
          className="mx-auto mt-10 block w-64 rounded-xl bg-(--accent-olive) py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
        >
          Save recipe
        </button>
      </div>
    </div>
  );
};

export default CreateRecipe;

/* =======================
   HELPERS
======================= */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-12">
    <h3 className="mb-6 text-center text-lg font-medium">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);
