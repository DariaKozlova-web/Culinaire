import { useState } from "react";
import { useNavigate } from "react-router";

import { createCategory } from "../data/categories";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    url: "",
    image: "",
  });

  const { name, url, image } = form;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!name || !url || !image) {
        throw new Error("All fields are required");
      }

      setLoading(true);

      const newCategory = await createCategory({ name, url, image });

      console.log("Category created:", newCategory);

      setForm({
        name: "",
        url: "",
        image: "",
      });

      navigate("/categories");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded bg-white p-6 shadow"
    >
      <label htmlFor="name" className="sr-only">
        Name
      </label>
      <input
        id="name"
        name="name"
        value={name}
        type="text"
        onChange={handleChange}
        placeholder="Name"
        className="rounded border p-2"
      />
      <label htmlFor="url" className="sr-only">
        URL
      </label>
      <input
        id="url"
        name="url"
        value={url}
        type="text"
        onChange={handleChange}
        placeholder="URL"
        className="rounded border p-2"
      />
      <label htmlFor="image" className="sr-only">
        Image
      </label>
      <input
        id="image"
        name="image"
        value={image}
        type="text"
        onChange={handleChange}
        placeholder="Image"
        className="rounded border p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded bg-green-600 p-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create category"}
      </button>
    </form>
  );
};

export default CreateCategory;
