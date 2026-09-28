import { CircleAlert } from 'lucide-react'
import { RATING_LABELS } from '../data/courses'

const SCORES = [1, 2, 3, 4, 5]

// Real radio inputs underneath, so arrow keys and screen readers work
// without any extra code. The labels are what get styled as the scale.
export default function RatingInput({ value, error, onChange, onBlur, disabled }) {
  const errorId = error ? 'rating-error' : undefined

  return (
    <fieldset
      className={`field rating ${error ? 'field--invalid' : ''}`}
      aria-describedby={errorId}
      disabled={disabled}
    >
      <legend className="field__head rating__legend">
        <span className="field__label">
          <span className="field__number" aria-hidden="true">04</span>
          Overall rating
        </span>
        <span className="rating__readout" aria-hidden="true">
          {value ? `${value} · ${RATING_LABELS[value]}` : 'Not rated yet'}
        </span>
      </legend>

      <div className="rating__scale">
        {SCORES.map((score) => (
          <div className="rating__option" key={score}>
            <input
              type="radio"
              id={`rating-${score}`}
              name="rating"
              value={score}
              checked={value === String(score)}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(error)}
            />
            <label htmlFor={`rating-${score}`}>
              <span className="rating__score" aria-hidden="true">{score}</span>
              <span className="visually-hidden">
                {score}, {RATING_LABELS[score]}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="rating__ends" aria-hidden="true">
        <span>Poor</span>
        <span>Excellent</span>
      </div>

      {error && (
        <p className="field__error" id={errorId}>
          <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  )
}
