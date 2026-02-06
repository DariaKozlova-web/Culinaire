import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { createChef, getChefById, updateChefById } from "../data/chefs";
import type { Chef } from "../types/chef";
import type { ChefCreateForm } from "../types/chefForm";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-olive)] dark:border-white/10 dark:bg-transparent";

function makeSlug(v: string) {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const initialForm: ChefCreateForm = {
  name: "",
  url: "", // slug
  city: "",
  cuisine: "",
  description: "",
  story: [""],
  signature: "",
  restaurant: {
    name: "",
    address: "",
    openingHours: "",
    closed: "",
  },
  imageFile: null,
};

const CreateChef = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement | null>(null);

  const [loadingChef, setLoadingChef] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState<ChefCreateForm>(initialForm);

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
        setLoadingChef(true);
        setError("");

        const chef: Chef = await getChefById(id);

        if (ignore) return;

        setForm({
          name: chef.name || "",
          url: chef.url || "",
          city: chef.city || "",
          cuisine: chef.cuisine || "",
          description: chef.description || "",
          story: chef.story || [],
          signature: chef.signature || "",
          restaurant: {
            name: chef.restaurant.name || "",
            address: chef.restaurant.address || "",
            openingHours: chef.restaurant.openingHours || "",
            closed: chef.restaurant.closed || "",
          },
          imageFile: null, // In Edit, by default, we don't select a new file.
        });

        setExistingMainImage(chef.image ?? "");

        // so that the title does not overwrite the slug after loading
        setSlugTouched(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch chef");
        scrollToTop();
      } finally {
        setLoadingChef(false);
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
    if (!form.city.trim()) return false;
    if (!form.cuisine.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.signature.trim()) return false;

    const badStory = form.story.some((i) => !i.trim());
    if (badStory) return false;

    const badStep =
      !form.restaurant.name?.trim() ||
      !form.restaurant.address?.trim() ||
      !form.restaurant.openingHours?.trim() ||
      !form.restaurant.closed?.trim();
    if (badStep) return false;

    // IMPORTANT:
    // create -> main image required
    // edit -> main image can stay the same (existingMainImage)
    if (!isEdit && !form.imageFile) return false;
    if (isEdit && !form.imageFile && !existingMainImage) return false;

    return true;
  }, [form, isEdit, existingMainImage]);

  const setField = <K extends keyof ChefCreateForm>(
    key: K,
    value: ChefCreateForm[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const onText =
    (key: keyof ChefCreateForm) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setField(key, e.target.value as ChefCreateForm[typeof key]);
    };

  const onSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setField("url", e.target.value);
  };

  const onMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setField("imageFile", f);
  };

  // Story items
  const addStoryItem = () => {
    setForm((p) => ({
      ...p,
      story: [...p.story, ""],
    }));
  };
  const updateStoryItem = (idx: number, value: string) => {
    setForm((p) => {
      const next = [...p.story];
      next[idx] = value;
      return { ...p, story: next };
    });
  };

  const removeStoryItem = (idx: number) => {
    setForm((p) => {
      const next = p.story.filter((_, i) => i !== idx);
      return {
        ...p,
        story: next.length > 0 ? next : [""],
      };
    });
  };

  const updateRestaurant = (
    key: keyof ChefCreateForm["restaurant"],
    value: string,
  ) => {
    setForm((p) => ({
      ...p,
      restaurant: {
        ...p.restaurant,
        [key]: value,
      },
    }));
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
      fd.append("city", form.city);
      fd.append("cuisine", form.cuisine);
      fd.append("description", form.description);
      fd.append("signature", form.signature);

      //json
      const cleanStory = form.story.filter((s) => s.trim() !== "");
      fd.append("story", JSON.stringify(cleanStory));
      fd.append("restaurant", JSON.stringify(form.restaurant));

      // files
      if (form.imageFile) fd.append("image", form.imageFile);

      if (isEdit && id) {
        await updateChefById(id, fd);
        setSuccess("Chef updated successfully!");
      } else {
        await createChef(fd);
        setSuccess("Chef created successfully!");
      }

      scrollToTop();

      // after create - clean the form
      if (!isEdit) {
        setForm(initialForm);
        setSlugTouched(false);
        setExistingMainImage("");
      } else {
        // return to chef list
        navigate("/dashboard/chefs");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create chefs");
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-center text-3xl font-semibold">
          {isEdit ? "Edit chef" : "Create new chef"}
        </h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          {isEdit
            ? "Update chef details and image"
            : "Add a new chef to the Culinaire collection"}
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
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Main information
          </h3>

          <div className="space-y-4">
            <label htmlFor="name" className="sr-only">
              Chef name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={inputBase}
              placeholder="Chef name"
              value={form.name}
              onChange={onText("name")}
              required
              disabled={loadingChef}
            />
            <label htmlFor="url" className="sr-only">
              Chef slug (url)
            </label>
            <input
              id="url"
              name="url"
              type="text"
              className={inputBase}
              placeholder="Chef slug (url)"
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
                className={inputBase}
                placeholder="Chef image"
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
                  alt="chef preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}
            {isEdit && !form.imageFile && existingMainImage && (
              <p className="-mt-1 ml-2 text-xs text-(--text-muted)">
                Current main image will stay unless you upload a new one.
              </p>
            )}

            <label htmlFor="city" className="sr-only">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className={inputBase}
              placeholder="City"
              value={form.city}
              onChange={onText("city")}
              required
              disabled={loadingChef}
            />
            <label htmlFor="cuisine" className="sr-only">
              Cuisine
            </label>
            <input
              id="cuisine"
              name="cuisine"
              type="text"
              className={inputBase}
              placeholder="Cuisine"
              value={form.cuisine}
              onChange={onText("cuisine")}
              required
              disabled={loadingChef}
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={inputBase}
              placeholder="Description"
              value={form.description}
              onChange={onText("description")}
              required
              disabled={loadingChef}
            />
            <label htmlFor="signature" className="sr-only">
              Signature
            </label>
            <textarea
              id="signature"
              name="signature"
              className={inputBase}
              placeholder="Signature"
              value={form.signature}
              onChange={onText("signature")}
              required
              disabled={loadingChef}
            />
          </div>

          <div className="mt-12">
            <div className="space-y-3">
              {form.story.map((value, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3">
                  <label htmlFor={`story_${idx}`} className="sr-only">
                    Story
                  </label>
                  <input
                    id={`story_${idx}`}
                    type="text"
                    className={`${inputBase} col-span-11`}
                    placeholder="Story"
                    value={value}
                    onChange={(e) => updateStoryItem(idx, e.target.value)}
                    required
                    disabled={loadingChef}
                  />
                  <button
                    type="button"
                    onClick={() => removeStoryItem(idx)}
                    className="col-span-1 flex items-center justify-center rounded-xl border border-black/10 text-lg hover:border-(--accent-wine) disabled:opacity-50 dark:border-white/10"
                    aria-label="Remove story item"
                    title="Remove story item"
                    disabled={loadingChef}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={addStoryItem}
                className="rounded-xl border border-(--accent-olive) px-5 py-3 text-sm font-medium text-(--accent-olive) hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:opacity-50"
                disabled={loadingChef}
              >
                + Add story item
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Restaurant Details
            </h3>

            <div className="space-y-4">
              <label htmlFor="restaurant_name" className="sr-only">
                Restaurat name
              </label>
              <input
                id="restaurant_name"
                name="restaurant_name"
                type="text"
                className={inputBase}
                placeholder="Restaurat name"
                value={form.restaurant.name}
                onChange={(e) => updateRestaurant("name", e.target.value)}
                required
                disabled={loadingChef}
              />
              <label htmlFor="restaurant_address" className="sr-only">
                Restaurat address
              </label>
              <input
                id="restaurant_address"
                name="restaurant_address"
                type="text"
                className={inputBase}
                placeholder="Restaurant address"
                value={form.restaurant.address}
                onChange={(e) => updateRestaurant("address", e.target.value)}
                required
                disabled={loadingChef}
              />
              <div className="grid grid-cols-2 gap-3">
                <label htmlFor="restaurant_opening_hours" className="sr-only">
                  Opening hours
                </label>
                <input
                  id="restaurant_opening_hours"
                  name="restaurant_opening_hours"
                  type="text"
                  className={inputBase}
                  placeholder="Opening hours"
                  value={form.restaurant.openingHours}
                  onChange={(e) =>
                    updateRestaurant("openingHours", e.target.value)
                  }
                  required
                  disabled={loadingChef}
                />
                <label htmlFor="restaurant_closed" className="sr-only">
                  Closed
                </label>
                <input
                  id="restaurant_closed"
                  name="restaurant_closed"
                  type="text"
                  className={inputBase}
                  placeholder="Closed"
                  value={form.restaurant.closed}
                  onChange={(e) => updateRestaurant("closed", e.target.value)}
                  required
                  disabled={loadingChef}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="min-w-70 rounded-xl bg-(--accent-olive) px-10 py-4 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save chef"}
            </button>
          </div>

          {isEdit && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard/chefs")}
                className="text-sm text-(--accent-olive) hover:text-(--accent-wine)"
              >
                ← Back to chefs
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateChef;
