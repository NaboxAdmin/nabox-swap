
export const createIndexSet = (data) =>
  data.reduce(
    (acc, item) => ({
      lastIndex: acc.lastIndex + item.length,
      built: acc.built.concat([[acc.lastIndex, acc.lastIndex + item.length]])
    }),
    { lastIndex: 0, built: [] }
  ).built;

export const mergeFromIndexSet = (arr, indexes) =>
  indexes.map(([before, after]) => arr.slice(before, after));

export const removeOverSizedChunks = (
  callsLength,
  chunkSizes
) => {
  const hasOverSizedChunks = chunkSizes.some(
    (chunkSize) => chunkSize > callsLength
  );
  if (!hasOverSizedChunks) return chunkSizes;

  const noOverSizedChunks = chunkSizes.filter(
    (chunkSize) => chunkSize < callsLength
  );
  return [callsLength, ...noOverSizedChunks];
};
