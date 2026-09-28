import { CircleAlert } from 'lucide-react'

// Wraps a single input with its numbered label, hint and error message.
// `children` is a render function so the input can pick up the right aria props.
export default function Field({ id, number, label, hint, error, aside, className = '', children }) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${className}`}>
      <div className="field__head">
        <label className="field__label" htmlFor={id}>
          <span className="field__number" aria-hidden="true">{number}</span>
          {label}
        </label>
        {aside}
      </div>

      {children({ 'aria-invalid': Boolean(error), 'aria-describedby': messageId })}

      {error ? (
        <p className="field__error" id={messageId}>
          <CircleAlert size={15} strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={messageId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
