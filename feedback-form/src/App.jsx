import FeedbackForm from './components/FeedbackForm'

const NEXT_STEPS = [
  {
    title: 'Saved to your course’s feedback log',
    detail: 'The course lead and programme team read every entry.',
  },
  {
    title: 'A confirmation lands in your inbox',
    detail: 'Usually within a minute, with a reference number.',
  },
  {
    title: 'Ratings of 1 or 2 get a follow-up',
    detail: 'Someone from the team contacts you within two working days.',
  },
]

export default function App() {
  return (
    <div className="page">
      <header className="masthead">
        <a className="wordmark" href="/">
          <span className="wordmark__mark" aria-hidden="true">H</span>
          Harbourline Academy
        </a>
        <span className="masthead__meta">Student feedback</span>
      </header>

      <main className="layout">
        <div className="intro">
          <p className="eyebrow">End-of-course survey</p>
          <h1 className="intro__title">
            How did the course{' '}
            <span className="nowrap">
              <em>actually</em> go?
            </span>
          </h1>
          <p className="intro__lede">
            Tell us what worked and what didn’t. Honest feedback is how the next intake gets a
            better course, and low scores are followed up, not filed away.
          </p>
        </div>

        <FeedbackForm />

        <aside className="steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="steps__title">
            After you submit
          </h2>
          <ol className="steps__list">
            {NEXT_STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="steps__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="steps__item-title">{step.title}</p>
                  <p className="steps__item-detail">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </main>

      <footer className="footer">
        <p>Harbourline Academy · Cape Town</p>
        <p>Questions about this form? Email support@harbourline.example</p>
      </footer>
    </div>
  )
}
