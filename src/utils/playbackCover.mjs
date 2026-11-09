export function selectCourseCover(id, icon, covers) {
  return covers[id + '-frame-20261109'] ?? covers[id + '-catalogue-20261102'] ?? covers[id] ?? covers['topic-' + icon]
}
