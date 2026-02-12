import type { Review } from "@/types/review";
import { serverURL } from "@/utils";

export async function getReviews(recipeId: string): Promise<Review[]> {
  const res = await fetch(`${serverURL}/reviews/${recipeId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch reviews");
  }
  return res.json();
}

export async function createReview(
  recipeId: string,
  formData: FormData,
): Promise<Review> {
  const res = await fetch(`${serverURL}/reviews/${recipeId}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create recipe");
  }

  return res.json();
}
