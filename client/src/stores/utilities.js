export function cursorTakePaginatedFieldPolicy(sorting = true) {
  return {
    keyArgs: false,
    merge(existing, incoming, { args = {}, readField }) {
      const merged = existing ? existing.slice(0) : [];
      // Obtain a Set of all existing item IDs.
      const existingIdSet = new Set(
        merged.map(item => readField("id", item)));
      // Remove incoming items already present in the existing data.
      incoming = incoming.filter(
        item => !existingIdSet.has(readField("id", item)));
      // Find the index of the item just before the incoming page of items.
      const afterIndex = merged.findIndex(
        item => args?.cursor === readField("id", item));
      if (afterIndex >= 0) {
        // If we found afterIndex, insert incoming after that index.
        merged.splice(afterIndex + 1, 0, ...incoming);
      } else {
        // Otherwise insert incoming at the end of the existing data.
        merged.push(...incoming);
      }
      if(sorting) merged.sort((a, b) => new Date(readField('createdAt', b)).valueOf() - new Date(readField('createdAt', a)).valueOf());
      return merged
    },
  };
}