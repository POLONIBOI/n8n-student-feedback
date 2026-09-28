import { useState } from 'react'
import { ArrowRight, CircleAlert, LoaderCircle } from 'lucide-react'
import Field from './Field'
import RatingInput from './RatingInput'
import SuccessPanel from './SuccessPanel'
import { COURSES } from '../data/courses'
import { FIELD_ORDER, MESSAGE_MAX, validateField, validateForm } from '../utils/validation'
import { submitFeedback } from '../api/submitFeedback'

const EMPTY_FORM = { name: '', email: '', course: '', rating: '', message: '' }

export default function FeedbackForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')
  const [submission, setSubmission] = useState(null)

  function updateError(field, value) {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))

    // Only re-check as they type once the field has already shown an error,
    // otherwise people get told off halfway through their email address.
    if (touched[name]) updateError(name, value)
  }

  function handleBlur(event) {
    const { name } = event.target
    // A radio's value is its own score even when it isn't checked,
    // so read the rating from state instead of from the event.
    const value = name === 'rating' ? values.rating : event.target.value
    setTouched((prev) => ({ ...prev, [name]: true }))
    updateError(name, value)
  }

  function focusField(field) {
    const target =
      field === 'rating'
        ? document.querySelector('input[name="rating"]:checked') ?? document.getElementById('rating-1')
        : document.getElementById(field)
    target?.focus()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'submitting') return

    const formErrors = validateForm(values)
    setErrors(formErrors)
    setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])))

    const firstInvalid = FIELD_ORDER.find((field) => formErrors[field])
    if (firstInvalid) {
      setSubmitError('')
      focusField(firstInvalid)
      return
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      course: values.course,
      rating: Number(values.rating),
      message: values.message.trim(),
    }

    setStatus('submitting')
    setSubmitError('')

    try {
      const data = await submitFeedback(payload)
      setSubmission({ ...payload, reference: data.reference, message: data.message })
      setStatus('success')
    } catch (err) {
      // If n8n rejected specific fields, show them inline as well as in the banner.
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }))
      }
      setSubmitError(err.message)
      setStatus('error')
    }
  }

  function handleReset() {
    setValues(EMPTY_FORM)
    setErrors({})
    setTouched({})
    setSubmitError('')
    setSubmission(null)
    setStatus('idle')
  }

  if (status === 'success' && submission) {
    return (
      <section className="panel" aria-label="Feedback submitted">
        <SuccessPanel submission={submission} onReset={handleReset} />
      </section>
    )
  }

  const isSubmitting = status === 'submitting'
  const messageLength = values.message.trim().length

  return (
    <section className="panel" aria-labelledby="form-title">
      <div className="panel__head">
        <h2 id="form-title" className="panel__title">
          Your feedback
        </h2>
        <p className="panel__meta">All fields required</p>
      </div>

      {submitError && (
        <div className="banner banner--error" role="alert">
          <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
          <div>
            <p className="banner__title">Your feedback wasn’t sent</p>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__row">
          <Field id="name" number="01" label="Full name" error={touched.name && errors.name}>
            {(aria) => (
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Thandiwe Mokoena"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                {...aria}
              />
            )}
          </Field>

          <Field
            id="email"
            number="02"
            label="Email address"
            hint="We’ll send your confirmation here."
            error={touched.email && errors.email}
          >
            {(aria) => (
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                {...aria}
              />
            )}
          </Field>
        </div>

        <Field id="course" number="03" label="Course" error={touched.course && errors.course}>
          {(aria) => (
            <select
              id="course"
              name="course"
              className={values.course ? '' : 'is-empty'}
              value={values.course}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              {...aria}
            >
              <option value="" disabled>
                Select the course you took
              </option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          )}
        </Field>

        <RatingInput
          value={values.rating}
          error={touched.rating && errors.rating}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />

        <Field
          id="message"
          number="05"
          label="What should we know?"
          hint="What worked, what didn’t, and anything you’d change."
          error={touched.message && errors.message}
          aside={
            <span className={`counter ${messageLength > MESSAGE_MAX ? 'counter--over' : ''}`}>
              {messageLength} / {MESSAGE_MAX}
            </span>
          }
        >
          {(aria) => (
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="The project weeks were the best part, but the API module felt rushed…"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              {...aria}
            />
          )}
        </Field>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="spin" size={18} strokeWidth={2} aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Submit feedback
                <ArrowRight className="btn__arrow" size={18} strokeWidth={2} aria-hidden="true" />
              </>
            )}
          </button>
          <p className="form__fineprint">
            Takes about two minutes. We only use your email to confirm this submission.
          </p>
        </div>
      </form>
    </section>
  )
}
