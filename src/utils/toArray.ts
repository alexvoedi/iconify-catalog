/**
 * Converts an object to an array of objects with a specified identifier.
 *
 * @template T - The type of the object values.
 * @template K - The type of the identifier key.
 * @param {Record<string, T>} obj - The object to convert.
 * @param {K} identifier - The key to use as the identifier in the resulting array.
 */
export function toArray<T, K extends string>(obj: Record<string, T>, identifier: K = 'id' as K) {
  return Object.entries(obj).map(([id, value]) => ({
    [identifier]: id,
    ...value,
  })) as Array<{ [key in K]: string } & T>
}
