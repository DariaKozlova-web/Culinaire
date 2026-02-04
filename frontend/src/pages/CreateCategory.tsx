import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import {
  createCategory,
  getCategoryById,
  updateCategoryById,
} from "../data/categories";
import type { CategoryCreateForm } from "../types/categoryForm";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-olive)] dark:border-white/10 dark:bg-transparent";

function makeSlug(v: string) {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const initialForm: CategoryCreateForm = {
  name: "",
  url: "", // slug
  image: null,
};

const CreateCategory = () => {
  const topRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState<CategoryCreateForm>(initialForm);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (isEditMode && id) {
      (async () => {
        try {
          const category = await getCategoryById(id);
          setForm({
            name: category.name || "",
            url: category.url || "",
            image: category.image || "",
          });
        } catch (error) {
          console.error("Error fetching category:", error);
        } finally {
          setSubmitting(false);
        }
      })();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (!form.name.trim()) return;
    if (slugTouched) return;

    const slug = makeSlug(form.name);
    setForm((p) => ({ ...p, url: slug }));
  }, [form.name, slugTouched]);

  const setField = <K extends keyof CategoryCreateForm>(
    key: K,
    value: CategoryCreateForm[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const onText =
    (key: keyof CategoryCreateForm) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setField(key, e.target.value as CategoryCreateForm[typeof key]);
    };

  const onSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setField("url", e.target.value);
  };

  const onMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setField("image", f);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSubmitting(true);

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("url", form.url);
      if (form.image) fd.append("image", form.image);

      if (isEditMode && id) {
        const updatedCategory = await updateCategoryById(id, fd);

        console.log("Category updated:", updatedCategory);

        setSuccess("Category updated successfully!");
      } else {
        const newCategory = await createCategory(fd);

        console.log("Category created:", newCategory);

        setSuccess("Category created successfully!");
      }

      scrollToTop();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create category");
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-center text-3xl font-semibold">
          Create new category
        </h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          Add a new category to the Culinaire collection
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
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm dark:border-white/10 dark:bg-transparent"
        >
          <div className="space-y-4">
            <label htmlFor="name" className="sr-only">
              Category title
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              type="text"
              onChange={onText("name")}
              placeholder="Category title"
              className={inputBase}
            />
            <label htmlFor="url" className="sr-only">
              Category slug (url)
            </label>
            <input
              id="url"
              name="url"
              value={form.url}
              type="text"
              onChange={onSlugChange}
              placeholder="Category slug (url)"
              className={inputBase}
            />
            <p className="-mt-2 ml-2 text-xs text-(--text-muted)">
              Tip: slug should be unique and stable (changing it later may
              create a new Cloudinary folder).
            </p>
            <div className="flex items-center gap-3">
              <input
                className={inputBase}
                placeholder="Category image"
                value={
                  form.image instanceof File
                    ? form.image.name
                    : typeof form.image === "string"
                      ? form.image
                      : ""
                }
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
          </div>
          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="min-w-70 rounded-xl bg-(--accent-olive) px-10 py-4 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
