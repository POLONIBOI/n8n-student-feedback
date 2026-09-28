// The n8n workflow checks the same rules again, so keep the two in sync.
export const MESSAGE_MIN = 10
export const MESSAGE_MAX = 1000

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Order matters: the first invalid field in this list gets focus on submit.
export const FIELD_ORDER = ['name', 'email', 'course', 'rating', 'message']

export function validateField(field, value) {
  const text = typeof value === 'string' ? value.trim() : ''

  switch (field) {
    case 'name':
      if (!text) return 'Please enter your name.'
      if (text.length < 2) return 'That name looks too short.'
      return ''

    case 'email':
      if (!text) return 'Please enter your email address.'
      if (!EMAIL_PATTERN.test(text)) return 'That email address doesn’t look right. Check for typos.'
      return ''

    case 'course':
      return text ? '' : 'Choose the course you’re giving feedback on.'

    case 'rating':
      return text ? '' : 'Pick a rating from 1 to 5.'

    case 'message':
      if (!text) return 'Tell us a little about your experience.'
      if (text.length < MESSAGE_MIN) return `Please write at least ${MESSAGE_MIN} characters.`
      if (text.length > MESSAGE_MAX) return `Please keep it under ${MESSAGE_MAX} characters.`
      return ''

    default:
      return ''
  }
}

export function validateForm(values) {
  const errors = {}
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}
