import { useEffect, useRef } from 'react'
import { Check, RotateCcw } from 'lucide-react'

export default function SuccessPanel({ submission, onReset }) {
  const headingRef = useRef(null)

  // Move focus here so screen reader users hear the confirmation straight away.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const firstName = submission.name.trim().split(/\s+/)[0]
  const lowRating = Number(submission.rating) <= 2

  return (
    <div className="success" role="status">
      <div className="success__mark" aria-hidden="true">
        <Check size={22} strokeWidth={2.5} />
      </div>

      <p className="eyebrow">
        Received{submission.reference ? ` · Ref ${submission.reference}` : ''}
      </p>

      <h2 className="success__title" tabIndex={-1} ref={headingRef}>
        Thanks, {firstName}.
      </h2>

      <p className="success__message">
        {submission.message ??
          'Thank you for your feedback! Your response has been received successfully.'}
      </p>

      <dl className="success__summary">
        <div>
          <dt>Course</dt>
          <dd>{submission.course}</dd>
        </div>
        <div>
          <dt>Your rating</dt>
          <dd>{submission.rating} / 5</dd>
        </div>
        <div>
          <dt>Confirmation sent to</dt>
          <dd>{submission.email}</dd>
        </div>
      </dl>

      {lowRating && (
        <p className="success__note">
          Sorry the course fell short. Your course lead will get in touch within two working days
          to hear more.
        </p>
      )}

      <button type="button" className="btn btn--ghost" onClick={onReset}>
        <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
        Submit another response
      </button>
    </div>
  )
}
