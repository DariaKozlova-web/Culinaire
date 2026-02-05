import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getAllCategories } from "../data/categories";
import { getAllChefs } from "../data/chefs";
import { createRecipe, getRecipeById, updateRecipeById } from "../data/recipes";

import type { Category } from "../types/category";
import type { Chef } from "../types/chef";
import type { Recipe } from "../types/recipe";
import type { RecipeCreateForm } from "../types/recipeForm";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-olive)] dark:border-white/10 dark:bg-transparent";

function makeSlug(v: string) {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const initialForm: RecipeCreateForm = {
  title: "",
  url: "",
  categoryId: "",
  chefId: "",
  description: "",
  totalTime: "",
  level: "",
  cuisine: "",
  service: "",
  imageFile: null,
  ingredients: [{ title: "", quantity: "", unit: "" }],
  instructions: [{ number: "1", title: "", description: "", imageFile: null }],
};

export default function CreateRecipe() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState<RecipeCreateForm>(initialForm);

  // for previewing current images when editing
  const [existingMainImage, setExistingMainImage] = useState<string>("");
  const [existingStepImages, setExistingStepImages] = useState<string[]>([]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // loading categories + chefs
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingLists(true);
        const [cats, ch] = await Promise.all([getAllCategories(), getAllChefs()]);
        if (!ignore) {
          setCategories(cats);
          setChefs(ch);
        }
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Failed to fetch");
      } finally {
        if (!ignore) setLoadingLists(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // loading recipe for edit
  useEffect(() => {
    if (!isEdit || !id) return;

    let ignore = false;

    (async () => {
      try {
        setLoadingRecipe(true);
        setError("");

        const recipe: Recipe = await getRecipeById(id);

        if (ignore) return;

        // categoryId / chefId can be a populated object or a string
        const categoryId =
          typeof recipe.categoryId === "string" ? recipe.categoryId : recipe.categoryId?._id ?? "";
        const chefId =
          typeof recipe.chefId === "string" ? recipe.chefId : recipe.chefId?._id ?? "";

        setForm({
          title: recipe.title ?? "",
          url: recipe.url ?? "",
          categoryId,
          chefId,
          description: recipe.description ?? "",
          totalTime: recipe.totalTime ?? "",
          level: (recipe.level as RecipeCreateForm["level"]) ?? "",
          cuisine: recipe.cuisine ?? "",
          service: recipe.service ?? "",
          imageFile: null, // In Edit, by default, we don't select a new file.
          ingredients: recipe.ingredients?.length
            ? recipe.ingredients.map((i) => ({
                title: i.title ?? "",
                quantity: i.quantity ?? "",
                unit: i.unit ?? "",
              }))
            : [{ title: "", quantity: "", unit: "" }],
          instructions: recipe.instructions?.length
            ? recipe.instructions.map((s, idx) => ({
                number: s.number ? String(s.number) : String(idx + 1),
                title: s.title ?? "",
                description: s.description ?? "",
                imageFile: null, // new file not selected
              }))
            : [{ number: "1", title: "", description: "", imageFile: null }],
        });

        setExistingMainImage(recipe.image ?? "");
        setExistingStepImages(
          (recipe.instructions ?? []).map((s) => (s.image ? String(s.image) : ""))
        );

        // so that the title does not overwrite the slug after loading
        setSlugTouched(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch recipe");
        scrollToTop();
      } finally {
        setLoadingRecipe(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isEdit, id]);

  // Autogenerate slug from title ONLY if admin did not enter slug manually
  useEffect(() => {
    if (!form.title.trim()) return;
    if (slugTouched) return;

    const slug = makeSlug(form.title);
    setForm((p) => ({ ...p, url: slug }));
  }, [form.title, slugTouched]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const canSubmit = useMemo(() => {
    if (!form.title.trim()) return false;
    if (!form.url.trim()) return false;
    if (!form.categoryId) return false;
    if (!form.chefId) return false;
    if (!form.description.trim()) return false;
    if (!form.totalTime.trim()) return false;
    if (!form.level.trim()) return false;
    if (!form.cuisine.trim()) return false;
    if (!form.service.trim()) return false;

    // IMPORTANT:
    // create -> main image required
    // edit -> main image can stay the same (existingMainImage)
    if (!isEdit && !form.imageFile) return false;
    if (isEdit && !form.imageFile && !existingMainImage) return false;

    const badIngredient = form.ingredients.some(
      (i) => !i.title.trim() || !i.quantity.trim() || !i.unit.trim()
    );
    if (badIngredient) return false;

    const badStep = form.instructions.some(
      (s) => !s.number.trim() || !s.title.trim() || !s.description.trim()
    );
    if (badStep) return false;

    return true;
  }, [form, isEdit, existingMainImage]);

  const setField = <K extends keyof RecipeCreateForm>(key: K, value: RecipeCreateForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const onText =
    (key: keyof RecipeCreateForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setField(key, e.target.value as RecipeCreateForm[typeof key]);
    };

  const onSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setField("url", e.target.value);
  };

  // INGREDIENTS
  const addIngredient = () => {
    setForm((p) => ({
      ...p,
      ingredients: [...p.ingredients, { title: "", quantity: "", unit: "" }],
    }));
  };

  const updateIngredient = (idx: number, key: "title" | "quantity" | "unit", value: string) => {
    setForm((p) => {
      const next = [...p.ingredients];
      next[idx] = { ...next[idx], [key]: value };
      return { ...p, ingredients: next };
    });
  };

  const removeIngredient = (idx: number) => {
    setForm((p) => {
      const next = p.ingredients.filter((_, i) => i !== idx);
      return { ...p, ingredients: next.length ? next : [{ title: "", quantity: "", unit: "" }] };
    });
  };

  // STEPS
  const addStep = () => {
    setForm((p) => {
      const nextNumber = String(p.instructions.length + 1);
      return {
        ...p,
        instructions: [...p.instructions, { number: nextNumber, title: "", description: "", imageFile: null }],
      };
    });

    // Synchronize the array of previews (so that the index doesn't move)
    setExistingStepImages((prev) => [...prev, ""]);
  };

  const updateStep = (idx: number, key: "number" | "title" | "description", value: string) => {
    setForm((p) => {
      const next = [...p.instructions];
      next[idx] = { ...next[idx], [key]: value };
      return { ...p, instructions: next };
    });
  };

  const updateStepImage = (idx: number, file: File | null) => {
    setForm((p) => {
      const next = [...p.instructions];
      next[idx] = { ...next[idx], imageFile: file };
      return { ...p, instructions: next };
    });
  };

  const removeStep = (idx: number) => {
    setForm((p) => {
      const next = p.instructions.filter((_, i) => i !== idx);
      const normalized = (
        next.length ? next : [{ number: "1", title: "", description: "", imageFile: null }]
      ).map((s, i) => ({ ...s, number: String(i + 1) }));
      return { ...p, instructions: normalized };
    });

    setExistingStepImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // MAIN IMAGE
  const onMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setField("imageFile", f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      const fd = new FormData();

      // text
      fd.append("title", form.title);
     if(!isEdit){
       fd.append("url", form.url);
     }
      fd.append("categoryId", form.categoryId);
      fd.append("chefId", form.chefId);
      fd.append("description", form.description);
      fd.append("totalTime", form.totalTime);
      fd.append("level", form.level);
      fd.append("cuisine", form.cuisine);
      fd.append("service", form.service);

      // json
      fd.append("ingredients", JSON.stringify(form.ingredients));
      fd.append(
        "instructions",
        JSON.stringify(
          form.instructions.map((s) => ({
            number: s.number,
            title: s.title,
            description: s.description,
          }))
        )
      );

      // files
      if (form.imageFile) fd.append("image", form.imageFile);

      //the order is important (index -> step)
      form.instructions.forEach((s) => {
        if (s.imageFile) fd.append("instructionImages", s.imageFile);
      });

      if (isEdit && id) {
        await updateRecipeById(id, fd);
        setSuccess("Recipe updated successfully!");
      } else {
        await createRecipe(fd);
        setSuccess("Recipe created successfully!");
      }

      scrollToTop();

      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => setSuccess(""), 3000);

      // after create - clean the form
      if (!isEdit) {
        setForm(initialForm);
        setSlugTouched(false);
        setExistingMainImage("");
        setExistingStepImages([]);
      } else {
        // return to recipe list
        navigate("/dashboard/recipes");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : isEdit ? "Failed to update recipe" : "Failed to create recipe");
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full" ref={topRef}>
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-center text-3xl font-semibold">
          {isEdit ? "Edit recipe" : "Create new recipe"}
        </h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          {isEdit ? "Update recipe details and images" : "Add a new recipe to the Culinaire collection"}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm dark:border-white/10 dark:bg-transparent"
        >
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Main information
          </h3>

          <div className="space-y-4">
            <input
              className={inputBase}
              placeholder="Recipe title"
              value={form.title}
              onChange={onText("title")}
              required
              disabled={loadingRecipe}
            />

            <input
              className={inputBase}
              placeholder="Recipe slug (url)"
              value={form.url}
              onChange={onSlugChange}
              required
              disabled={isEdit}
              readOnly={isEdit}
            />
            <p className="-mt-2 ml-2 text-xs text-(--text-muted)">
              Tip: slug should be stable. Changing it may create a new Cloudinary folder for this recipe.
            </p>

            {/* Main image upload + preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  className={inputBase}
                  placeholder="Recipe image"
                  value={form.imageFile?.name ?? ""}
                  readOnly
                />
                <label className="shrink-0 cursor-pointer rounded-xl border border-(--accent-olive) px-4 py-3 text-sm text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={onMainImage} />
                </label>
              </div>

              {(form.imageFile || existingMainImage) && (
                <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                  <img
                    src={form.imageFile ? URL.createObjectURL(form.imageFile) : existingMainImage}
                    alt="Recipe preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
              {isEdit && !form.imageFile && existingMainImage && (
                <p className="-mt-1 ml-2 text-xs text-(--text-muted)">
                  Current main image will stay unless you upload a new one.
                </p>
              )}
            </div>

            <select
              className={inputBase}
              value={form.chefId}
              onChange={onText("chefId")}
              disabled={loadingLists || loadingRecipe}
              required
            >
              <option value="">{loadingLists ? "Loading chefs..." : "Recipe creator"}</option>
              {chefs.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className={inputBase}
              value={form.categoryId}
              onChange={onText("categoryId")}
              disabled={loadingLists || loadingRecipe}
              required
            >
              <option value="">{loadingLists ? "Loading categories..." : "Recipe category"}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              className={`${inputBase} min-h-24 resize-none`}
              placeholder="Recipe description"
              value={form.description}
              onChange={onText("description")}
              required
              disabled={loadingRecipe}
            />
          </div>

          <div className="mt-12">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Recipe details
            </h3>

            <div className="space-y-4">
              <input
                className={inputBase}
                placeholder="Total time"
                value={form.totalTime}
                onChange={onText("totalTime")}
                required
                disabled={loadingRecipe}
              />
              <input
                className={inputBase}
                placeholder="Cuisine"
                value={form.cuisine}
                onChange={onText("cuisine")}
                required
                disabled={loadingRecipe}
              />
              <input
                className={inputBase}
                placeholder="Difficulty"
                value={form.level}
                onChange={onText("level")}
                required
                disabled={loadingRecipe}
              />
              <input
                className={inputBase}
                placeholder="Servings"
                value={form.service}
                onChange={onText("service")}
                required
                disabled={loadingRecipe}
              />
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Ingredients
            </h3>

            <div className="space-y-3">
              {form.ingredients.map((ing, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3">
                  <input
                    className={`${inputBase} col-span-6`}
                    placeholder="Ingredient title"
                    value={ing.title}
                    onChange={(e) => updateIngredient(idx, "title", e.target.value)}
                    required
                    disabled={loadingRecipe}
                  />
                  <input
                    className={`${inputBase} col-span-3`}
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                    required
                    disabled={loadingRecipe}
                  />
                  <input
                    className={`${inputBase} col-span-2`}
                    placeholder="Unit"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                    required
                    disabled={loadingRecipe}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="col-span-1 flex items-center justify-center rounded-xl border border-black/10 text-lg hover:border-(--accent-wine) dark:border-white/10 disabled:opacity-50"
                    aria-label="Remove ingredient"
                    title="Remove ingredient"
                    disabled={loadingRecipe}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={addIngredient}
                className="rounded-xl border border-(--accent-olive) px-5 py-3 text-sm font-medium text-(--accent-olive) hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:opacity-50"
                disabled={loadingRecipe}
              >
                + Add ingredient
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Cooking Steps
            </h3>

            <div className="space-y-5">
              {form.instructions.map((s, idx) => {
                const previewUrl =
                  s.imageFile ? URL.createObjectURL(s.imageFile) : existingStepImages[idx] || "";

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
                  >
                    <div className="grid grid-cols-12 gap-3">
                      <input
                        className={`${inputBase} col-span-2`}
                        placeholder="Step #"
                        value={s.number}
                        onChange={(e) => updateStep(idx, "number", e.target.value)}
                        required
                        disabled={loadingRecipe}
                      />
                      <input
                        className={`${inputBase} col-span-9`}
                        placeholder="Step title"
                        value={s.title}
                        onChange={(e) => updateStep(idx, "title", e.target.value)}
                        required
                        disabled={loadingRecipe}
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="col-span-1 flex items-center justify-center rounded-xl border border-black/10 text-lg hover:border-(--accent-wine) dark:border-white/10 disabled:opacity-50"
                        aria-label="Remove step"
                        title="Remove step"
                        disabled={loadingRecipe}
                      >
                        ×
                      </button>

                      <div className="col-span-12 flex items-center gap-3">
                        <input
                          className={inputBase}
                          placeholder="Step image"
                          value={s.imageFile?.name ?? ""}
                          readOnly
                        />
                        <label className="shrink-0 cursor-pointer rounded-xl border border-(--accent-olive) px-4 py-3 text-sm text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => updateStepImage(idx, e.target.files?.[0] ?? null)}
                            disabled={loadingRecipe}
                          />
                        </label>
                      </div>

                      {previewUrl && (
                        <div className="col-span-12 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                          <img src={previewUrl} alt={`Step ${idx + 1}`} className="h-40 w-full object-cover" />
                        </div>
                      )}

                      {isEdit && !s.imageFile && existingStepImages[idx] && (
                        <p className="col-span-12 -mt-1 ml-2 text-xs text-(--text-muted)">
                          Current step image will stay unless you upload a new one.
                        </p>
                      )}

                      <textarea
                        className={`${inputBase} col-span-12 min-h-30 resize-none`}
                        placeholder="Step description"
                        value={s.description}
                        onChange={(e) => updateStep(idx, "description", e.target.value)}
                        required
                        disabled={loadingRecipe}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={addStep}
                className="rounded-xl border border-(--accent-olive) px-5 py-3 text-sm font-medium text-(--accent-olive) hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:opacity-50"
                disabled={loadingRecipe}
              >
                + Add step
              </button>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit || submitting || loadingRecipe}
              className="min-w-70 rounded-xl bg-(--accent-olive) px-10 py-4 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Save recipe"}
            </button>
          </div>

          {isEdit && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard/recipes")}
                className="text-sm text-(--accent-olive) hover:text-(--accent-wine)"
              >
                ← Back to recipes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
