import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, buildTree } from './api.js'

const CatalogContext = createContext({ categories: [], tree: [], byId: new Map() })

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const value = useMemo(() => ({
    categories,
    tree: buildTree(categories),
    byId: new Map(categories.map((c) => [c.id, c])),
  }), [categories])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)

export const TYPE_LABELS = { book: 'ზღაპარი', poem: 'ლექსი' }
