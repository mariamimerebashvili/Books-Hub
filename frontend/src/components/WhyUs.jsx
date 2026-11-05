const REASONS = [
  {
    tone: 'gold',
    title: 'უსაფრთხო და კეთილი შინაარსი',
    text: 'თითოეული ზღაპარი ბავშვებს ასწავლის სიკეთეს, მეგობრობას, მზრუნველობასა და სიყვარულს — ასაკის შესაბამისად.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M8.5 14.5s1.2 1.8 3.5 1.8 3.5-1.8 3.5-1.8" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth="3" />
      </svg>
    ),
  },
  {
    tone: 'pink',
    title: 'ლამაზი ილუსტრაციები',
    text: 'ფერადი, თბილი ილუსტრაციები, რომლებიც პატარა მკითხველს ისტორიაში ითრევს და წარმოსახვას უვითარებს.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L11 15.8 8.2 13z" /><path d="M7.5 14.5c-2 0-3.5 1.5-3.5 3.5 0 1-.5 2-1.5 2.5 3 1 7 .5 7.5-3" />
      </svg>
    ),
  },
  {
    tone: 'gold',
    title: 'ინდივიდუალური ლექსები',
    text: 'შეუკვეთე ლექსი შენი პატარასთვის — მისი სახელით, ასაკითა და საყვარელი თემით. მზად იქნება 2 საათში.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 4c-8 1-13 6-14 14l-2 2" /><path d="M6 18c4 0 9-3 11-8" /><path d="M10 10h5" />
      </svg>
    ),
  },
]

// Only real parent reviews belong here: { quote, name, detail, photo? }.
// The block stays hidden while the list is empty.
const TESTIMONIALS = []

export default function WhyUs() {
  const review = TESTIMONIALS[0]
  return (
    <section className="wrap section why">
      <div className="why-head">
        <span className="chip cream">რატომ გვირჩევენ მშობლები</span>
        <h2>ზრუნვა თითოეულ გვერდზე</h2>
        <p className="muted">ჩვენი მიზანია შევქმნათ თბილი, მეგობრული და ბავშვებისთვის უსაფრთხო საკითხავი გამოცდილება.</p>
      </div>
      <div className="why-grid">
        {REASONS.map((r, i) => (
          <article key={r.title} className="why-card" style={{ animationDelay: `${i * 80}ms` }}>
            <span className={`why-icon ${r.tone}`}>{r.icon}</span>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </article>
        ))}
      </div>
      {review && (
        <figure className="review">
          {review.photo && <img src={review.photo} alt="" />}
          <div>
            <blockquote>„{review.quote}“</blockquote>
            <figcaption><strong>{review.name}</strong>{review.detail && ` • ${review.detail}`}</figcaption>
          </div>
          <span className="stars" aria-label="5 ვარსკვლავი">★★★★★</span>
        </figure>
      )}
    </section>
  )
}
