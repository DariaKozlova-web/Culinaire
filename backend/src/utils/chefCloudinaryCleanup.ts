import cloudinary from './cloudinary.ts';

export async function deleteChefFolder(slug: string) {
  const folder = `culinaire/chefs/${slug}`;

  // 1) Delete all resources in the folder
  await cloudinary.api.delete_resources_by_prefix(folder);

  // 2) Delete the folder itself
  await cloudinary.api.delete_folder(folder);
}
