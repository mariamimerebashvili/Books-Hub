import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from './Icons.jsx'

/** Site-wide search: submits to the catalog section on the home page. */
export default function SearchBox({ autoFocus = false, onDone }) {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function submit(e) {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}#products` : '/#products')
    setValue('')
    onDone?.()
  }

  return (
    <form className="search-form" role="search" onSubmit={submit}>
      <SearchIcon />
      <input
        className="input"
        type="search"
        placeholder="მოძებნე წიგნი ან ლექსი…"
        aria-label="ძებნა"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  )
}
