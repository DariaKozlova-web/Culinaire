import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { createChef, getChefById, updateChefById } from "../data/chefs";

const CreateChef = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    url: "",
    image: "",
    city: "",
    cuisine: "",
    description: "",
    signature: "",
    restaurant_name: "",
    restaurant_address: "",
    opening_hours: "",
    closed: "",
  });

  const [story, setStory] = useState<string[]>([""]);

  const {
    name,
    url,
    image,
    city,
    cuisine,
    description,
    signature,
    restaurant_name,
    restaurant_address,
    opening_hours,
    closed,
  } = form;

  useEffect(() => {
    if (isEditMode && id) {
      (async () => {
        try {
          const chef = await getChefById(id);
          setForm({
            name: chef.name,
            url: chef.url,
            image: chef.image,
            city: chef.city,
            cuisine: chef.cuisine,
            description: chef.description,
            signature: chef.signature,
            restaurant_name: chef.restaurant.name,
            restaurant_address: chef.restaurant.address,
            opening_hours: chef.restaurant.openingHours,
            closed: chef.restaurant.closed,
          });
          setStory(chef.story || [""]);
        } catch (error) {
          console.error("Error fetching chef:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStoryChange = (index: number, value: string) => {
    const updatedStory = [...story];
    updatedStory[index] = value;
    setStory(updatedStory);
  };

  const addStoryField = () => {
    setStory([...story, ""]);
  };

  const removeStoryField = (index: number) => {
    if (story.length > 1) {
      setStory(story.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const allFieldsFilled = Object.values(form).every(
        (value) => value.trim() !== "",
      );

      const validStory = story.filter((h) => h.trim() !== "");

      if (!allFieldsFilled || validStory.length === 0) {
        throw new Error("All fields are required");
      }

      setLoading(true);

      const chefData: Omit<Chef, "_id"> = {
        name,
        url,
        image,
        city,
        cuisine,
        description,
        story: story.filter((h) => h.trim() !== ""),
        signature,
        restaurant: {
          name: restaurant_name,
          address: restaurant_address,
          openingHours: opening_hours,
          closed: closed,
        },
      };

      if (isEditMode && id) {
        const updatedChef = await updateChefById(id, chefData);

        console.log("Chef updated:", updatedChef);
      } else {
        const newChef = await createChef(chefData);

        console.log("Chef created:", newChef);
      }

      navigate("/dashboard/chefs");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An error occurred");
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
      <label htmlFor="city" className="sr-only">
        City
      </label>
      <input
        id="city"
        name="city"
        value={city}
        type="text"
        onChange={handleChange}
        placeholder="City"
        className="rounded border p-2"
      />
      <label htmlFor="cuisine" className="sr-only">
        Cuisine
      </label>
      <input
        id="cuisine"
        name="cuisine"
        value={cuisine}
        type="text"
        onChange={handleChange}
        placeholder="Cuisine"
        className="rounded border p-2"
      />
      <label htmlFor="description" className="sr-only">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={description}
        onChange={handleChange}
        placeholder="Description"
        className="rounded border p-2"
      />
      <div className="flex flex-col gap-2">
        {story.map((s, index) => (
          <div key={index} className="flex gap-2">
            <label htmlFor={`hour_${index}`} className="sr-only">
              Opening Hour {index + 1}
            </label>
            <input
              id={`hour_${index}`}
              value={s}
              onChange={(e) => handleStoryChange(index, e.target.value)}
              placeholder="Story"
              className="flex-1 rounded border p-2"
            />
            <button
              type="button"
              onClick={() => removeStoryField(index)}
              className="rounded bg-red-100 px-3 text-red-600 hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStoryField}
          className="flex items-center gap-1 self-start font-bold text-blue-600 hover:underline"
        >
          <span>+</span> Add story item
        </button>
      </div>
      <label htmlFor="signature" className="sr-only">
        Signature
      </label>
      <textarea
        id="signature"
        name="signature"
        value={signature}
        onChange={handleChange}
        placeholder="Signature"
        className="rounded border p-2"
      />
      <label htmlFor="restaurant_name" className="sr-only">
        Restaurant name
      </label>
      <input
        id="restaurant_name"
        name="restaurant_name"
        value={restaurant_name}
        type="text"
        onChange={handleChange}
        placeholder="Restaurant name"
        className="rounded border p-2"
      />
      <label htmlFor="restaurant_address" className="sr-only">
        Restaurant address
      </label>
      <input
        id="restaurant_address"
        name="restaurant_address"
        value={restaurant_address}
        type="text"
        onChange={handleChange}
        placeholder="Restaurant address"
        className="rounded border p-2"
      />
      <label htmlFor="opening_hours" className="sr-only">
        Opening time
      </label>
      <input
        id="opening_hours"
        name="opening_hours"
        value={opening_hours}
        type="text"
        onChange={handleChange}
        placeholder="Opening time"
        className="rounded border p-2"
      />
      <label htmlFor="closed" className="sr-only">
        Closed time
      </label>
      <input
        id="closed"
        name="closed"
        value={closed}
        type="text"
        onChange={handleChange}
        placeholder="Closed time"
        className="rounded border p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-6 cursor-pointer rounded bg-green-600 p-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create chef"}
      </button>
    </form>
  );
};

export default CreateChef;
