export function previewCollections(items, expanded) {
  return expanded ? items : items.slice(0, 4)
}
