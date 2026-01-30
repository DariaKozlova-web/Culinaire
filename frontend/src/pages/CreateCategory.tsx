//import useAuth from "@/contexts/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

import { createCategory } from "../data/categories";

type FormData = Omit<Category, "_id">;

const CreateCategory = () => {
  //const { user } = useAuth();
  const navigate = useNavigate();
  const [{ name, url, image }, setForm] = useState<FormData>({
    name: "",
    url: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!name || !url || !image) {
        throw new Error("All fields are required");
      }
      setLoading(true);
      const newCategory: Category = await createCategory({
        name,
        url,
        image,
      });
      console.log(newCategory);
      setForm({ name: "", url: "", image: "" });
      navigate("/categories");
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="A name for your category"
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url"
          name="url"
          value={url}
          onChange={handleChange}
          placeholder="A url for your category"
        />
      </div>
      <div>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          name="image"
          value={image}
          onChange={handleChange}
          placeholder="A image for your category"
        />
      </div>
      <button type="submit" disabled={loading}>
        Create category
      </button>
    </form>
  );
};

export default CreateCategory;
