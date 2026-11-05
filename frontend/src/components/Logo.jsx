export default function Logo({ className = 'brand-mark' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#E11A45" />
      <path d="M22 6c-7 1-12 7-13 16l-2 4 2-1c2-1 3-3 3-3 6 0 10-5 10-16z" fill="#EFECD7" />
      <path d="M9 25c3-7 7-12 12-17" stroke="#E11A45" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
