import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

type Category = {
  _id: string;
  name: string;
  url: string;
  image: string;
};

type Chef = {
  _id: string;
  name: string; // если у тебя другое поле (firstName/lastName) — скажи, подстрою
  url: string;
  image: string;
};

type Ingredient = {
  title: string;
  quantity: string;
  unit: string;
};

type Step = {
  number: string;
  title: string;
  description: string;
  imageFile: File | null; // файл шага
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputBase =
  "w-full rounded-xl border border-black/15 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 py-3 text-sm outline-none " +
  "placeholder:text-black/40 dark:placeholder:text-white/40 " +
  "focus:border-(--accent-olive) focus:ring-2 focus:ring-(--accent-olive)/20";

const sectionTitle = "text-center text-xl md:text-2xl font-[Philosopher] font-bold";

export default function CreateRecipe() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);

  // main form fields
  const [title, setTitle] = useState("");
  const url = useMemo(() => slugify(title), [title]);

  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [chefId, setChefId] = useState("");

  const [totalTime, setTotalTime] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [level, setLevel] = useState("");
  const [service, setService] = useState("");

  // images
  const [mainImage, setMainImage] = useState<File | null>(null);

  // ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { title: "", quantity: "", unit: "" }
  ]);

  // steps
  const [steps, setSteps] = useState<Step[]>([
    { number: "1", title: "", description: "", imageFile: null }
  ]);

  // fetch categories/chefs
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [catRes, chefRes] = await Promise.all([
          fetch(`${API_BASE}/categories`, { credentials: "include" }),
          fetch(`${API_BASE}/chefs`, { credentials: "include" })
        ]);

        if (!catRes.ok) throw new Error("Failed to load categories");
        if (!chefRes.ok) throw new Error("Failed to load chefs");

        const cats = (await catRes.json()) as Category[];
        const chs = (await chefRes.json()) as Chef[];

        if (!ignore) {
          setCategories(cats);
          setChefs(chs);
        }
      } catch (e) {
        if (!ignore) {
          setServerError(e instanceof Error ? e.message : "Something went wrong");
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // --- ingredients handlers ---
  function updateIngredient(index: number, key: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { title: "", quantity: "", unit: "" }]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  // --- steps handlers ---
  function updateStep(index: number, key: keyof Omit<Step, "imageFile">, value: string) {
    setSteps((prev) =>
      prev.map((st, i) => (i === index ? { ...st, [key]: value } : st))
    );
  }

  function setStepFile(index: number, file: File | null) {
    setSteps((prev) => prev.map((st, i) => (i === index ? { ...st, imageFile: file } : st)));
  }

  function addStep() {
    setSteps((prev) => {
      const nextNumber = String(prev.length + 1);
      return [...prev, { number: nextNumber, title: "", description: "", imageFile: null }];
    });
  }

  function removeStep(index: number) {
    setSteps((prev) => {
      if (prev.length === 1) return prev;

      const next = prev.filter((_, i) => i !== index);
      // перенумеруем красиво 1..n
      return next.map((s, i) => ({ ...s, number: String(i + 1) }));
    });
  }

  function onMainImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setMainImage(file);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    // минимальная фронт-валидация, чтобы не ловить лишние 400
    if (!title.trim()) return setServerError("Title is required");
    if (!categoryId) return setServerError("Category is required");
    if (!chefId) return setServerError("Chef is required");
    if (!mainImage) return setServerError("Main image is required");

    setLoading(true);
    try {
      const fd = new FormData();

      // strings
      fd.append("title", title);
      fd.append("url", url);
      fd.append("description", description);

      fd.append("categoryId", categoryId);
      fd.append("chefId", chefId);

      fd.append("totalTime", totalTime);
      fd.append("level", level);
      fd.append("cuisine", cuisine);
      fd.append("service", service);

      // arrays as JSON string
      fd.append("ingredients", JSON.stringify(ingredients));
      fd.append(
        "instructions",
        JSON.stringify(
          steps.map((s) => ({
            number: s.number,
            title: s.title,
            description: s.description
          }))
        )
      );

      // files
      fd.append("image", mainImage);
      steps.forEach((s) => {
        if (s.imageFile) fd.append("instructionImages", s.imageFile);
      });

      const res = await fetch(`${API_BASE}/recipes`, {
        method: "POST",
        body: fd,
        credentials: "include"
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const msg =
          payload?.message ??
          "Failed to create recipe. Check backend logs and request payload.";
        throw new Error(msg);
      }

      // success reset
      setTitle("");
      setDescription("");
      setCategoryId("");
      setChefId("");
      setTotalTime("");
      setLevel("");
      setCuisine("");
      setService("");
      setMainImage(null);
      setIngredients([{ title: "", quantity: "", unit: "" }]);
      setSteps([{ number: "1", title: "", description: "", imageFile: null }]);

      // если хочешь — можно редиректнуть на список рецептов в dashboard
      // navigate("/dashboard/all-recipes");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl pb-24">
      {/* Page header */}
      <div className="text-center">
        <h1 className="font-[Philosopher] text-3xl font-bold md:text-4xl">
          Create new recipe
        </h1>
        <p className="mt-2 text-sm text-(--text-muted)">
          Add a new recipe to the Culinaire collection
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={onSubmit}
        className="mt-10 rounded-3xl border border-black/10 bg-white/60 p-10 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
      >
        {serverError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {serverError}
          </div>
        )}

        {/* MAIN INFORMATION */}
        <h2 className={sectionTitle}>Main information</h2>

        <div className="mt-8 space-y-4">
          <input
            className={inputBase}
            placeholder="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* image */}
          <label className="block">
            <div className={`${inputBase} flex items-center justify-between gap-3`}>
              <span className="text-black/50 dark:text-white/50">Recipe image</span>
              <input
                type="file"
                accept="image/*"
                onChange={onMainImageChange}
                className="text-xs file:mr-3 file:rounded-lg file:border file:border-black/15 file:bg-white file:px-3 file:py-2 file:text-xs file:font-medium file:text-black/70
                           dark:file:border-white/15 dark:file:bg-white/10 dark:file:text-white/80"
              />
            </div>
          </label>

          {/* chef */}
          <div className="relative">
            <select
              className={`${inputBase} appearance-none pr-10`}
              value={chefId}
              onChange={(e) => setChefId(e.target.value)}
            >
              <option value="">Recipe creator</option>
              {chefs.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40">
              ▾
            </span>
          </div>

          {/* category */}
          <div className="relative">
            <select
              className={`${inputBase} appearance-none pr-10`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Recipe category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40">
              ▾
            </span>
          </div>

          <input
            className={inputBase}
            placeholder="Recipe description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* RECIPE DETAILS */}
        <h2 className={`${sectionTitle} mt-14`}>Recipe details</h2>

        <div className="mt-8 space-y-4">
          <input
            className={inputBase}
            placeholder="Total time"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
          />
          <input
            className={inputBase}
            placeholder="Cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
          <input
            className={inputBase}
            placeholder="Difficulty"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
          <input
            className={inputBase}
            placeholder="Servings"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div>

        {/* INGREDIENTS */}
        <h2 className={`${sectionTitle} mt-16`}>Ingredients</h2>

        <div className="mt-8 space-y-4">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-3">
              <input
                className={`${inputBase} flex-1 min-w-[240px]`}
                placeholder="Ingredient title"
                value={ing.title}
                onChange={(e) => updateIngredient(idx, "title", e.target.value)}
              />

              <input
                className={`${inputBase} w-28`}
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
              />

              <div className="relative w-28">
                <input
                  className={`${inputBase} pr-8`}
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35">
                  ▾
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="rounded-xl px-3 py-2 text-black/40 transition hover:text-(--accent-wine) dark:text-white/40"
                aria-label="Remove ingredient"
                title="Remove"
              >
                ✕
              </button>

              {/* add button inline, как у тебя на макете справа */}
              {idx === 0 && (
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="inline-flex items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
                  >
                    + Add ingredient
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* COOKING STEPS */}
        <h2 className={`${sectionTitle} mt-16`}>Cooking Steps</h2>

        <div className="mt-8 space-y-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-black/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <input
                  className={`${inputBase} w-28`}
                  placeholder="Step number"
                  value={s.number}
                  onChange={(e) => updateStep(idx, "number", e.target.value)}
                />
                <input
                  className={`${inputBase} flex-1`}
                  placeholder="Step title"
                  value={s.title}
                  onChange={(e) => updateStep(idx, "title", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="rounded-xl px-3 py-2 text-black/40 transition hover:text-(--accent-wine) dark:text-white/40"
                  aria-label="Remove step"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <label className="block">
                  <div className={`${inputBase} flex items-center justify-between gap-3`}>
                    <span className="text-black/50 dark:text-white/50">Step image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setStepFile(idx, e.target.files?.[0] ?? null)}
                      className="text-xs file:mr-3 file:rounded-lg file:border file:border-black/15 file:bg-white file:px-3 file:py-2 file:text-xs file:font-medium file:text-black/70
                                 dark:file:border-white/15 dark:file:bg-white/10 dark:file:text-white/80"
                    />
                  </div>
                </label>
              </div>

              <textarea
                className={`${inputBase} mt-4 min-h-[120px] resize-none`}
                placeholder="Step description"
                value={s.description}
                onChange={(e) => updateStep(idx, "description", e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-3 text-sm font-semibold text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
            >
              + Add step
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-12 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-[260px] rounded-xl bg-(--accent-olive) text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}




// import { categoriesMock } from "../mocks/categories.mock";
// import { chefsMock } from "../mocks/chefs.mock";

// import { useState } from "react";


// /* =======================
//    UI CLASSES
// ======================= */

// const inputBase =
//   "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

// const textareaBase =
//   "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

// const selectBase =
//   "w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-(--accent-olive)";

// /* =======================
//    PAGE
// ======================= */

// const CreateRecipe = () => {
//   const [ingredients, setIngredients] = useState([
//     { title: "", quantity: "", unit: "" },
//   ]);

//   const [steps, setSteps] = useState([
//     { number: "", title: "", image: "", description: "" },
//   ]);

//   return (
//     <div className="mx-auto max-w-3xl">
//       {/* Page title */}
//       <div className="mb-10 text-center">
//         <h1 className="text-2xl font-semibold">Create new recipe</h1>
//         <p className="mt-2 text-sm text-(--text-muted)">
//           Add a new recipe to the Culinaire collection
//         </p>
//       </div>

//       {/* Form card */}
//       <div className="rounded-3xl border border-black/10 bg-white px-8 py-10">
//         {/* MAIN INFORMATION */}
//         <Section title="Main information">
//           <input className={inputBase} placeholder="Recipe title" />
//           <input className={inputBase} placeholder="Recipe image" />

//           <select className={selectBase}>
//             <option value="">Recipe creator</option>
//             {chefsMock.map((chef) => (
//               <option key={chef.id} value={chef.id}>
//                 {chef.name}
//               </option>
//             ))}
//           </select>

//           <select className={selectBase}>
//             <option value="">Recipe category</option>
//             {categoriesMock.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.title}
//               </option>
//             ))}
//           </select>

//           <textarea
//             rows={3}
//             className={textareaBase}
//             placeholder="Recipe description"
//           />
//         </Section>

//         {/* RECIPE DETAILS */}
//         <Section title="Recipe details">
//           <input className={inputBase} placeholder="Total time" />
//           <input className={inputBase} placeholder="Cuisine" />
//           <input className={inputBase} placeholder="Difficulty" />
//           <input className={inputBase} placeholder="Servings" />
//         </Section>

//         {/* INGREDIENTS */}
//         <Section title="Ingredients">
//           {ingredients.map((_, index) => (
//             <div key={index} className="flex gap-4">
//               <input
//                 className={inputBase}
//                 placeholder="Ingredient title"
//               />
//               <input className={inputBase} placeholder="Quantity" />
//               <select className={selectBase}>
//                 <option>Unit</option>
//                 <option>g</option>
//                 <option>ml</option>
//                 <option>pcs</option>
//               </select>

//               {ingredients.length > 1 && (
//                 <button
//                   type="button"
//                   className="text-black/40"
//                   onClick={() =>
//                     setIngredients((prev) =>
//                       prev.filter((_, i) => i !== index)
//                     )
//                   }
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             className="ml-auto mt-4 rounded-xl border border-(--accent-olive) px-4 py-2 text-sm text-(--accent-olive)"
//             onClick={() =>
//               setIngredients((prev) => [
//                 ...prev,
//                 { title: "", quantity: "", unit: "" },
//               ])
//             }
//           >
//             + Add ingredient
//           </button>
//         </Section>

//         {/* COOKING STEPS */}
//         <Section title="Cooking steps">
//           {steps.map((_, index) => (
//             <div
//               key={index}
//               className="rounded-2xl border border-black/10 p-6"
//             >
//               <div className="mb-4 flex gap-4">
//                 <input
//                   className={inputBase}
//                   placeholder="Step number"
//                 />
//                 <input
//                   className={inputBase}
//                   placeholder="Step title"
//                 />

//                 {steps.length > 1 && (
//                   <button
//                     type="button"
//                     className="text-black/40"
//                     onClick={() =>
//                       setSteps((prev) =>
//                         prev.filter((_, i) => i !== index)
//                       )
//                     }
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>

//               <input
//                 className={inputBase}
//                 placeholder="Step image"
//               />

//               <textarea
//                 rows={3}
//                 className={`${textareaBase} mt-4`}
//                 placeholder="Step description"
//               />
//             </div>
//           ))}

//           <button
//             type="button"
//             className="ml-auto mt-4 rounded-xl border border-(--accent-olive) px-4 py-2 text-sm text-(--accent-olive)"
//             onClick={() =>
//               setSteps((prev) => [
//                 ...prev,
//                 { number: "", title: "", image: "", description: "" },
//               ])
//             }
//           >
//             + Add step
//           </button>
//         </Section>

//         {/* SUBMIT */}
//         <button
//           type="button"
//           className="mx-auto mt-10 block w-64 rounded-xl bg-(--accent-olive) py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine)"
//         >
//           Save recipe
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateRecipe;

// /* =======================
//    HELPERS
// ======================= */

// const Section = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className="mb-12">
//     <h3 className="mb-6 text-center text-lg font-medium">
//       {title}
//     </h3>
//     <div className="space-y-4">{children}</div>
//   </div>
// );
