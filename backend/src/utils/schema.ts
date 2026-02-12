/**
 * utils for schema parsing and coercion
 */

/**
 * Coerces a value to a string. If the value is an array, it takes the first element.
 * This is useful for handling form data where fields can be submitted as arrays.
 *
 * @param val The value to coerce.
 * @returns The coerced string value.
 */
export const coerceString = (val: unknown) => (Array.isArray(val) ? val[0] : val);

/**
 * Parses a JSON array from a string. If the value is not a string, it returns the value as is.
 *
 * @param val The value to parse.
 * @returns The parsed JSON array or the original value if parsing fails.
 */
export const parseJSONArray = (val: unknown) => {
  const v = coerceString(val);
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};
