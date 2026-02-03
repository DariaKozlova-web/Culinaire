const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export async function createRecipe(formData: FormData) {
  const res = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create recipe');
  }

  return res.json();
}

export async function getAllRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function getRandomRecipes(limit = 3) {
  const res = await fetch(`${API_URL}/recipes/random?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch random recipes');
  return res.json();
}