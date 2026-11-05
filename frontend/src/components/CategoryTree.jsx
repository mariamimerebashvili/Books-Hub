import { useEffect, useRef, useState } from 'react'
import { ChevronIcon } from './Icons.jsx'

function descendants(node) {
  return node.children.flatMap((c) => [c.id, ...descendants(c)])
}

/** Path of nodes from a root down to `id` (inclusive), or null. */
function findPath(nodes, id, trail = []) {
  for (const node of nodes) {
    const path = [...trail, node]
    if (node.id === id) return path
    const found = findPath(node.children, id, path)
    if (found) return found
  }
  return null
}

/**
 * Toggles a category in a selection where a selected parent implies all of its
 * descendants. Unchecking an implied child expands the parent into its other branches.
 */
export function toggleCategory(tree, selected, id) {
  const next = new Set(selected)
  const path = findPath(tree, id) || []
  const node = path[path.length - 1]
  if (!node) return next
  const ancestorIndex = path.findIndex((n) => n.id !== id && next.has(n.id))

  if (next.has(id)) {
    next.delete(id)
  } else if (ancestorIndex !== -1) {
    next.delete(path[ancestorIndex].id)
    for (let i = ancestorIndex; i < path.length - 1; i++) {
      for (const child of path[i].children) if (child.id !== path[i + 1].id) next.add(child.id)
    }
  } else {
    next.add(id)
    for (const d of descendants(node)) next.delete(d)
  }
  return next
}

function TreeNode({ node, selected, implied, onToggle }) {
  const checked = implied || selected.has(node.id)
  const partial = !checked && descendants(node).some((d) => selected.has(d))
  const [open, setOpen] = useState(partial)
  const box = useRef(null)

  useEffect(() => {
    if (box.current) box.current.indeterminate = partial
  }, [partial])

  return (
    <li>
      <div className="tree-row">
        {node.children.length > 0 ? (
          <button
            type="button"
            className="tree-toggle"
            aria-expanded={open}
            aria-label={open ? 'დაკეცვა' : 'გაშლა'}
            onClick={() => setOpen(!open)}
          ><ChevronIcon /></button>
        ) : <span className="tree-spacer" />}
        <label className="check">
          <input ref={box} type="checkbox" checked={checked} onChange={() => onToggle(node.id)} />
          {node.name}
        </label>
      </div>
      {open && node.children.length > 0 && (
        <ul className="tree">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} selected={selected} implied={checked} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function CategoryTree({ tree, selected, onChange }) {
  return (
    <ul className="tree">
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          selected={selected}
          implied={false}
          onToggle={(id) => onChange(toggleCategory(tree, selected, id))}
        />
      ))}
    </ul>
  )
}
