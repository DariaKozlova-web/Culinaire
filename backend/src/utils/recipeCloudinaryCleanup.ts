import cloudinary from './cloudinary.ts';

export async function deleteRecipeFolder(slug: string) {
  const folder = `culinaire/recipes/${slug}`;

  // 1) Delete all resources in the folder
  // Cloudinary API: delete_resources_by_prefix deletes by public_id prefix
  // Our public_id values ​​are `${slug}-main`, `${slug}-step1`, etc.
  await cloudinary.api.delete_resources_by_prefix(folder);

  // In some accounts, you need to first delete the resources, then delete the folder
  // 2) Delete the folder itself
  await cloudinary.api.delete_folder(folder);
}
