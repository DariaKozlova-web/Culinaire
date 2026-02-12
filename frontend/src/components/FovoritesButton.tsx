import { useAuth } from "@/contexts";
import { updateProfileField } from "@/data/profile";
import type { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
}

export const FavoritesButton = ({ recipe }: Props) => {
  const { user, authLoading, setUser } = useAuth();
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    if (!recipe) return;
    if (user && user.favorites?.includes(recipe._id)) {
      setIsInFavorites(true);
    } else {
      setIsInFavorites(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, user?.favorites]);

  const onFavoritesClick = () => {
    if (!user || !recipe) return;
    let favorites = user.favorites || [];
    if (isInFavorites) {
      favorites = favorites.filter((id) => id !== recipe._id);
    } else {
      favorites.push(recipe._id);
    }
    updateProfileField("favorites", favorites, setUser);
  };

  return (
    <button
      type="button"
      disabled={!user || authLoading}
      onClick={onFavoritesClick}
      className="mt-7 inline-flex cursor-pointer items-center justify-center rounded-xl bg-(--accent-olive) px-8 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
      title={!user ? "Login required" : ""}
    >
      {isInFavorites ? "Remove from favorites" : "Add to favorites"}
    </button>
  );
};
