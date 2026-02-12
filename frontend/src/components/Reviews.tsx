import { useAuth } from "@/contexts";
import { createReview, getReviews } from "@/data/reviews";
import type { Review } from "@/types/review";
import { useEffect, useState } from "react";

export const Reviews = ({ recipeId }: { recipeId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, authLoading } = useAuth();
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getReviews(recipeId);
        setReviews(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    })();
  }, [recipeId]);

  const onSaveReview = async () => {
    if (!user || authLoading) return;
    if (!newReview.comment.trim()) return;
    try {
      setSavingReview(true);
      const formData = new FormData();
      formData.append("comment", newReview.comment.trim());
      formData.append("rating", String(newReview.rating));
      const review = await createReview(recipeId, formData);
      setReviews((prev) => [review, ...prev]);
      setNewReview({ comment: "", rating: 0 });
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="text-sm text-(--text-muted)">Loading reviews…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-center text-3xl font-semibold text-(--text-title)">
        User Reviews
      </h2>

      <div className="mx-auto mt-8 max-w-xl">
        {reviews.length > 0 && (
          <div className="mb-5 space-y-3">
            {reviews.map((review) => (
              <div
                key={review.createdAt.toString()}
                className="flex items-start justify-between gap-4 rounded-2xl border border-(--border-soft) bg-transparent px-4 py-3 text-sm text-(--text-body)"
              >
                <div>
                  <div className="whitespace-pre-wrap">{review.comment}</div>
                  <div className="mt-2 text-xs text-(--text-muted)">
                    {new Date(review.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder={
            user ? "Write your reviews here..." : "Login to write reviews"
          }
          disabled={!user || authLoading}
          className="ui-input min-h-35 px-4 py-3 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
          title={!user ? "Login required" : ""}
        />

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onSaveReview}
            disabled={
              !user || authLoading || !newReview.comment.trim() || savingReview
            }
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-2.5 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
            title={!user ? "Login required" : ""}
          >
            {savingReview ? "Saving..." : "Save review"}
          </button>
        </div>
      </div>
    </>
  );
};
