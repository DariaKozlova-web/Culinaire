import { useState } from "react";
import { useNavigate } from "react-router";

import { createChef } from "../data/chefs";

const CreateChef = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    url: "",
    image: "",
    description: "",
    signature: "",
    restaurant_name: "",
    restaurant_address: "",
  });

  const [openingHours, setOpeningHours] = useState<string[]>([""]);

  const {
    name,
    url,
    image,
    description,
    signature,
    restaurant_name,
    restaurant_address,
  } = form;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHourChange = (index: number, value: string) => {
    const updatedHours = [...openingHours];
    updatedHours[index] = value;
    setOpeningHours(updatedHours);
  };

  const addHourField = () => {
    setOpeningHours([...openingHours, ""]);
  };

  const removeHourField = (index: number) => {
    if (openingHours.length > 1) {
      setOpeningHours(openingHours.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const allFieldsFilled = Object.values(form).every(
        (value) => value.trim() !== "",
      );

      const validHours = openingHours.filter((h) => h.trim() !== "");

      if (!allFieldsFilled || validHours.length === 0) {
        throw new Error("All fields are required");
      }

      setLoading(true);

      const chefData: Omit<Chef, "_id"> = {
        name,
        url,
        image,
        description,
        signature,
        restaurant: {
          name: restaurant_name,
          address: restaurant_address,
          openingHours: openingHours.filter((h) => h.trim() !== ""),
        },
      };

      const newChef = await createChef(chefData);

      console.log("Chef created:", newChef);

      setForm({
        name: "",
        url: "",
        image: "",
        description: "",
        signature: "",
        restaurant_name: "",
        restaurant_address: "",
      });

      setOpeningHours([""]);

      navigate("/chefs");
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
      <div className="flex flex-col gap-2">
        {openingHours.map((hour, index) => (
          <div key={index} className="flex gap-2">
            <label htmlFor={`hour_${index}`} className="sr-only">
              Opening Hour {index + 1}
            </label>
            <input
              id={`hour_${index}`}
              value={hour}
              onChange={(e) => handleHourChange(index, e.target.value)}
              placeholder="Mon-Fri: 09:00 - 20:00"
              className="flex-1 rounded border p-2"
            />
            <button
              type="button"
              onClick={() => removeHourField(index)}
              className="rounded bg-red-100 px-3 text-red-600 hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHourField}
          className="flex items-center gap-1 self-start font-bold text-blue-600 hover:underline"
        >
          <span>+</span> Add time slot
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded bg-green-600 p-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create chef"}
      </button>
    </form>
  );
};

export default CreateChef;
