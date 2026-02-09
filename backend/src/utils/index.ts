export * from './auth.ts';
export { default as cloudinary } from './cloudinary.ts';
export * from './recipeCloudinaryCleanup.ts';
export * from './categoryCloudinaryCleanup.ts';
export * from './chefCloudinaryCleanup.ts';
export * from './chefCloudinaryCleanup.ts';
export * from './generatePDFShoplist.ts';

export const coerceString = (val: unknown) => (Array.isArray(val) ? val[0] : val);

export const parseJSONArray = (val: unknown) => {
  const v = coerceString(val);
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};
