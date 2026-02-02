import { useEffect, useState } from "react";
import { Link } from "react-router";

import { deleteChefById, getAllChefs } from "../data/chefs";

function AllChefs() {
  const [loading, setLoading] = useState(true);
  const [chefs, setChefs] = useState<Chef[]>([]);

  const handleDeleteChef = async (id: string) => {
    await deleteChefById(id);
    const updatedChefs = await getAllChefs();
    setChefs(updatedChefs);
  };

  useEffect(() => {
    (async () => {
      try {
        const fetchedAllChefs: Chef[] = await getAllChefs();
        setChefs(fetchedAllChefs);
      } catch (error: unknown) {
        const message = (error as { message: string }).message;
        console.log("An error occurred while fetching the chefs", message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return "Loading...";

  return (
    <div className="">
      <h1 className="mb-5 text-3xl font-bold text-(--text-title)">All Chefs</h1>
      {chefs.length === 0 ? (
        <div>
          <p>No chefs available.</p>
          <Link
            to="/dashboard/create-chef"
            className="mt-5 block text-blue-600"
          >
            Create chef
          </Link>
        </div>
      ) : (
        <div>
          {chefs.map((chef) => (
            <div
              key={chef._id}
              className="flex items-center justify-between border-b border-gray-600 py-5"
            >
              <div className="">{chef.name}</div>

              <div className="flex items-center gap-4">
                <Link
                  to={`/dashboard/chefs/${chef._id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteChef(chef._id)}
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
export default AllChefs;
