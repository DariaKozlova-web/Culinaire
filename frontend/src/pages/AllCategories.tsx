import { useEffect, useState } from "react";
import { Link } from "react-router";

import { deleteCategoryById, getAllCategories } from "../data/categories";

function AllCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleDeleteCategory = async (id: string) => {
    await deleteCategoryById(id);
    const updatedCategories = await getAllCategories();
    setCategories(updatedCategories);
  };

  useEffect(() => {
    (async () => {
      try {
        const fetchedAllCategories: Category[] = await getAllCategories();
        setCategories(fetchedAllCategories);
      } catch (error: unknown) {
        const message = (error as { message: string }).message;
        console.log("An error occurred while fetching the categories", message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return "Loading...";

  return (
    <div className="">
      <h1 className="mb-5 text-3xl font-bold text-(--text-title)">
        All Categories
      </h1>
      {categories.length === 0 ? (
        <div>
          <p>No categories available.</p>
          <Link
            to="/dashboard/create-category"
            className="mt-5 block text-blue-600"
          >
            Create category
          </Link>
        </div>
      ) : (
        <div>
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between border-b border-gray-600 py-5"
            >
              <div className="">{category.name}</div>

              <div className="flex items-center gap-4">
                <Link
                  to={`/dashboard/categories/${category._id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category._id)}
                  className="cursor-pointer text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AllCategories;
