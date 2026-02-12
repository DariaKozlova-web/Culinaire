import { UserIcon } from "@/components/icons/UserIcon";
import useAuth from "@/contexts/useAuth";
import { updateProfile } from "@/data/profile";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";

export type ProfileForm = Pick<User, "name"> & {
  // Add any additional fields needed for the form
  image: string;
};

function MyProfile() {
  const { user, setUser } = useAuth();
  const initialForm = {
    name: "",
    image: "",
  };
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState<ProfileForm>(initialForm);

  useEffect(() => {
    setForm({ name: user?.name || "", image: "" });
    setImagePreview(user?.image || "");
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const onText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file?.name || "" }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(user?.image || "");
    }
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const updatedUser = await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setUser(updatedUser);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create recipe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-center text-3xl font-semibold">My Profile</h1>
        <p className="mt-2 text-center text-sm text-(--text-muted)">
          Update your personal information
        </p>

        <div className="mt-8 flex justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="object-fit-cover aspect-square max-h-40 w-auto items-center rounded-full"
            />
          ) : (
            <UserIcon className="max-h-40 w-auto rounded-xl object-cover" />
          )}
        </div>

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

        <form onSubmit={onSubmit} className="ui-surface mt-8 p-8 shadow-sm">
          <div className="space-y-4">
            <input
              className="ui-input"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={onText}
              required
            />

            {/* File upload (English) */}
            <div className="flex items-center gap-3">
              <input
                className="ui-input"
                placeholder="Profile image"
                value={form.image}
                readOnly
              />
              <label className="shrink-0 cursor-pointer rounded-xl border border-(--accent-olive) px-4 py-3 text-sm text-(--accent-olive) transition-colors hover:border-(--accent-wine) hover:text-(--accent-wine)">
                Upload
                <input
                  type="file"
                  name="image"
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
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default MyProfile;
