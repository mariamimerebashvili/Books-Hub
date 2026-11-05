import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap section">
      <div className="empty">
        <h2>გვერდი ვერ მოიძებნა</h2>
        <Link className="btn" to="/">მთავარზე დაბრუნება</Link>
      </div>
    </div>
  )
}
