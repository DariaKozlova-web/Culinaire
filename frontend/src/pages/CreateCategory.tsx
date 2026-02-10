import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  createCategory,
  getCategoryById,
  updateCategoryById,
} from "../data/categories";
import type { Category } from "../types/category";
import type { CategoryCreateForm } from "../types/categoryForm";

// const inputBase =
//   "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-olive)] dark:border-white/10 dark:bg-transparent";

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
  imageFile: null,
};

const CreateCategory = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement | null>(null);

  const [loadingCategory, setLoadingCategory] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState<CategoryCreateForm>(initialForm);

  // for previewing current images when editing
  const [existingMainImage, setExistingMainImage] = useState<string>("");

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!isEdit || !id) return;

    let ignore = false;

    (async () => {
      try {
        setLoadingCategory(true);
        setError("");

        const category: Category = await getCategoryById(id);

        if (ignore) return;

        setForm({
          name: category.name || "",
          url: category.url || "",
          imageFile: null, // In Edit, by default, we don't select a new file.
        });

        setExistingMainImage(category.image ?? "");

        // so that the title does not overwrite the slug after loading
        setSlugTouched(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch category");
        scrollToTop();
      } finally {
        setLoadingCategory(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isEdit, id]);

  // Autogenerate slug from title ONLY if admin did not enter slug manually
  useEffect(() => {
    if (!form.name.trim()) return;
    if (slugTouched) return;

    const slug = makeSlug(form.name);
    setForm((p) => ({ ...p, url: slug }));
  }, [form.name, slugTouched]);

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.url.trim()) return false;

    // IMPORTANT:
    // create -> main image required
    // edit -> main image can stay the same (existingMainImage)
    if (!isEdit && !form.imageFile) return false;
    if (isEdit && !form.imageFile && !existingMainImage) return false;

    return true;
  }, [form, isEdit, existingMainImage]);

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
    setField("imageFile", f);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSubmitting(true);

      const fd = new FormData();

      // text
      fd.append("name", form.name);
      fd.append("url", form.url);

      // files
      if (form.imageFile) fd.append("image", form.imageFile);

      if (isEdit && id) {
        await updateCategoryById(id, fd);
        setSuccess("Category updated successfully!");
      } else {
        await createCategory(fd);
        setSuccess("Category created successfully!");
      }

      scrollToTop();

      // after create - clean the form
      if (!isEdit) {
        setForm(initialForm);
        setSlugTouched(false);
        setExistingMainImage("");
      } else {
        // return to category list
        navigate("/dashboard/categories");
      }
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
          {isEdit ? "Edit category" : "Create new category"}
        </h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          {isEdit
            ? "Update category details and image"
            : "Add a new category to the Culinaire collection"}
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

        <form onSubmit={handleSubmit} className="ui-surface mt-8 p-8 shadow-sm">
          <div className="space-y-4">
            <label htmlFor="name" className="sr-only">
              Category title
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="ui-input"
              placeholder="Category name"
              value={form.name}
              onChange={onText("name")}
              required
              disabled={loadingCategory}
            />
            <label htmlFor="url" className="sr-only">
              Category slug (url)
            </label>
            <input
              id="url"
              name="url"
              type="text"
              className="ui-input"
              placeholder="Category slug (url)"
              value={form.url}
              onChange={onSlugChange}
              required
              disabled={isEdit}
              readOnly={isEdit}
            />
            <p className="-mt-2 ml-2 text-xs text-(--text-muted)">
              Tip: slug should be unique and stable (changing it later may
              create a new Cloudinary folder).
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="preview" className="sr-only">
                Preview
              </label>
              <input
                id="preview"
                name="preview"
                className="ui-input"
                placeholder="Category image"
                value={form.imageFile?.name ?? ""}
                readOnly
              />
              <label
                htmlFor="image"
                className="shrink-0 cursor-pointer rounded-xl border border-(--accent-olive) px-4 py-3 text-sm text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)"
              >
                Upload
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onMainImage}
                />
              </label>
            </div>

            {(form.imageFile || existingMainImage) && (
              <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                <img
                  src={
                    form.imageFile
                      ? URL.createObjectURL(form.imageFile)
                      : existingMainImage
                  }
                  alt="Category preview"
                  className="h-150 w-full object-cover"
                />
              </div>
            )}
            {isEdit && !form.imageFile && existingMainImage && (
              <p className="-mt-1 ml-2 text-xs text-(--text-muted)">
                Current main image will stay unless you upload a new one.
              </p>
            )}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit || submitting || loadingCategory}
              className="min-w-70 cursor-pointer rounded-xl bg-(--accent-olive) px-10 py-4 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Save category"}
            </button>
          </div>

          {isEdit && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard/categories")}
                className="cursor-pointer text-sm text-(--accent-olive) hover:text-(--accent-wine)"
              >
                ← Back to categories
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
