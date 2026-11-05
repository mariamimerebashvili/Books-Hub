import { buildTree } from '../api.js'

/** <option>s for a category <select>, indented by depth. `exclude` hides a subtree. */
export function categoryOptions(categories, exclude) {
  const out = []
  const walk = (nodes, depth) => {
    for (const n of nodes) {
      if (n.id === exclude) continue
      out.push(<option key={n.id} value={n.id}>{`${'— '.repeat(depth)}${n.name}`}</option>)
      walk(n.children, depth + 1)
    }
  }
  walk(buildTree(categories), 0)
  return out
}
