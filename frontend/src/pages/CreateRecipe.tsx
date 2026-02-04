import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { getAllCategories } from "../data/categories";
import { getAllChefs } from "../data/chefs";
import { createRecipe } from "../data/recipes";
import type { Category } from "../types/category";
import type { Chef } from "../types/chef";
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
  url: "", // slug
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
  const topRef = useRef<HTMLDivElement | null>(null);

  const successTimerRef = useRef<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // so that the title doesn't overwrite the slug if the admin changes it manually
  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState<RecipeCreateForm>(initialForm);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingLists(true);
        const [cats, ch] = await Promise.all([
          getAllCategories(),
          getAllChefs(),
        ]);
        if (!ignore) {
          setCategories(cats);
          setChefs(ch);
        }
      } catch (e) {
        if (!ignore)
          setError(e instanceof Error ? e.message : "Failed to fetch");
      } finally {
        if (!ignore) setLoadingLists(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // Autogenerate slug from title ONLY if the admin did not enter the slug manually
  useEffect(() => {
    if (!form.title.trim()) return;
    if (slugTouched) return;

    const slug = makeSlug(form.title);
    setForm((p) => ({ ...p, url: slug }));
  }, [form.title, slugTouched]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
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
    if (!form.imageFile) return false;

    const badIngredient = form.ingredients.some(
      (i) => !i.title.trim() || !i.quantity.trim() || !i.unit.trim(),
    );
    if (badIngredient) return false;

    const badStep = form.instructions.some(
      (s) => !s.number.trim() || !s.title.trim() || !s.description.trim(),
    );
    if (badStep) return false;

    return true;
  }, [form]);

  const setField = <K extends keyof RecipeCreateForm>(
    key: K,
    value: RecipeCreateForm[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const onText =
    (key: keyof RecipeCreateForm) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setField(key, e.target.value as RecipeCreateForm[typeof key]);
    };

  // slug input handler (Note that the admin changed the slug manually)
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

  const updateIngredient = (
    idx: number,
    key: "title" | "quantity" | "unit",
    value: string,
  ) => {
    setForm((p) => {
      const next = [...p.ingredients];
      next[idx] = { ...next[idx], [key]: value };
      return { ...p, ingredients: next };
    });
  };

  const removeIngredient = (idx: number) => {
    setForm((p) => {
      const next = p.ingredients.filter((_, i) => i !== idx);
      return {
        ...p,
        ingredients: next.length
          ? next
          : [{ title: "", quantity: "", unit: "" }],
      };
    });
  };

  // STEPS
  const addStep = () => {
    setForm((p) => {
      const nextNumber = String(p.instructions.length + 1);
      return {
        ...p,
        instructions: [
          ...p.instructions,
          { number: nextNumber, title: "", description: "", imageFile: null },
        ],
      };
    });
  };

  const updateStep = (
    idx: number,
    key: "number" | "title" | "description",
    value: string,
  ) => {
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
        next.length
          ? next
          : [{ number: "1", title: "", description: "", imageFile: null }]
      ).map((s, i) => ({ ...s, number: String(i + 1) }));
      return { ...p, instructions: normalized };
    });
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
      fd.append("url", form.url);
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
          })),
        ),
      );

      // files
      if (form.imageFile) fd.append("image", form.imageFile);
      form.instructions.forEach((s) => {
        if (s.imageFile) fd.append("instructionImages", s.imageFile);
      });

      await createRecipe(fd);

      setSuccess("Recipe created successfully!");
      scrollToTop();

      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => {
        setSuccess("");
      }, 3000);

      setForm(initialForm);
      setSlugTouched(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create recipe");
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full" ref={topRef}>
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-center text-3xl font-semibold">
          Create new recipe
        </h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          Add a new recipe to the Culinaire collection
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
            />

            {/* ✅ SLUG / URL */}
            <input
              className={inputBase}
              placeholder="Recipe slug (url)"
              value={form.url}
              onChange={onSlugChange}
              required
            />
            <p className="-mt-2 ml-2 text-xs text-(--text-muted)">
              Tip: slug should be unique and stable (changing it later may
              create a new Cloudinary folder).
            </p>

            {/* File upload (English) */}
            <div className="flex items-center gap-3">
              <input
                className={inputBase}
                placeholder="Recipe image"
                value={form.imageFile?.name ?? ""}
                readOnly
              />
              <label className="shrink-0 cursor-pointer rounded-xl border border-(--accent-olive) px-4 py-3 text-sm text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onMainImage}
                />
              </label>
            </div>

            <select
              className={inputBase}
              value={form.chefId}
              onChange={onText("chefId")}
              disabled={loadingLists}
              required
            >
              <option value="">
                {loadingLists ? "Loading chefs..." : "Recipe creator"}
              </option>
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
              disabled={loadingLists}
              required
            >
              <option value="">
                {loadingLists ? "Loading categories..." : "Recipe category"}
              </option>
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
              />
              <input
                className={inputBase}
                placeholder="Cuisine"
                value={form.cuisine}
                onChange={onText("cuisine")}
                required
              />
              <input
                className={inputBase}
                placeholder="Difficulty"
                value={form.level}
                onChange={onText("level")}
                required
              />
              <input
                className={inputBase}
                placeholder="Servings"
                value={form.service}
                onChange={onText("service")}
                required
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
                    onChange={(e) =>
                      updateIngredient(idx, "title", e.target.value)
                    }
                    required
                  />
                  <input
                    className={`${inputBase} col-span-3`}
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(idx, "quantity", e.target.value)
                    }
                    required
                  />
                  <input
                    className={`${inputBase} col-span-2`}
                    placeholder="Unit"
                    value={ing.unit}
                    onChange={(e) =>
                      updateIngredient(idx, "unit", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="col-span-1 flex items-center justify-center rounded-xl border border-black/10 text-lg hover:border-(--accent-wine) dark:border-white/10"
                    aria-label="Remove ingredient"
                    title="Remove ingredient"
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
                className="rounded-xl border border-(--accent-olive) px-5 py-3 text-sm font-medium text-(--accent-olive) hover:border-(--accent-wine) hover:text-(--accent-wine)"
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
              {form.instructions.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
                >
                  <div className="grid grid-cols-12 gap-3">
                    <input
                      className={`${inputBase} col-span-2`}
                      placeholder="Step #"
                      value={s.number}
                      onChange={(e) =>
                        updateStep(idx, "number", e.target.value)
                      }
                      required
                    />
                    <input
                      className={`${inputBase} col-span-9`}
                      placeholder="Step title"
                      value={s.title}
                      onChange={(e) => updateStep(idx, "title", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="col-span-1 flex items-center justify-center rounded-xl border border-black/10 text-lg hover:border-(--accent-wine) dark:border-white/10"
                      aria-label="Remove step"
                      title="Remove step"
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
                          onChange={(e) =>
                            updateStepImage(idx, e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>

                    <textarea
                      className={`${inputBase} col-span-12 min-h-30 resize-none`}
                      placeholder="Step description"
                      value={s.description}
                      onChange={(e) =>
                        updateStep(idx, "description", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={addStep}
                className="rounded-xl border border-(--accent-olive) px-5 py-3 text-sm font-medium text-(--accent-olive) hover:border-(--accent-wine) hover:text-(--accent-wine)"
              >
                + Add step
              </button>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="min-w-70 rounded-xl bg-(--accent-olive) px-10 py-4 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
