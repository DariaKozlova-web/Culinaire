export * from './auth.ts';
export { default as cloudinary } from './cloudinary.ts';
export * from './recipeCloudinaryCleanup.ts';
export * from './categoryCloudinaryCleanup.ts';

export const coerceString = (val: unknown) => (Array.isArray(val) ? val[0] : val);
