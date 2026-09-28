const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL
const TIMEOUT_MS = 15000

export class SubmitError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message)
    this.name = 'SubmitError'
    this.fieldErrors = fieldErrors
  }
}

export async function submitFeedback(payload) {
  if (!WEBHOOK_URL) {
    throw new SubmitError(
      'This form isn’t connected to the workflow yet. Add VITE_N8N_WEBHOOK_URL to the .env file and restart the dev server.',
    )
  }

  // n8n can hang if the workflow stalls, so give up after 15 seconds.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response
  try {
    response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new SubmitError('The server took too long to respond. Please try again in a moment.')
    }
    throw new SubmitError('We couldn’t reach the feedback service. Check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }

  const data = await response.json().catch(() => null)

  // Our workflow always replies with { ok, message }. Anything else
  // (404 from an inactive webhook, 500 from a failed node) gets a plain message.
  if (!response.ok || data?.ok === false) {
    const fieldErrors = {}
    for (const error of data?.errors ?? []) {
      if (error.field) fieldErrors[error.field] = error.message
    }

    const message =
      data?.ok === false && data.message
        ? data.message
        : `Something went wrong on our side (error ${response.status}). Your feedback wasn’t saved, so please try again.`

    throw new SubmitError(message, fieldErrors)
  }

  return data ?? {}
}
