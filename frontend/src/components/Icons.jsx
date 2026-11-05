const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const SearchIcon = () => <svg {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const MenuIcon = () => <svg {...base}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
export const CloseIcon = () => <svg {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
export const ArrowIcon = () => <svg {...base} width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const ChevronIcon = () => <svg {...base} strokeWidth={2.5}><path d="m9 6 6 6-6 6" /></svg>
export const FilterIcon = () => <svg {...base} width="18" height="18"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
export const ChatIcon = () => (
  <svg {...base} width="18" height="18"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
)
