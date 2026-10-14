/** One embedded viewer; map buttons replace only its document. */
const frame = document.getElementById('live-demo-frame')

if (frame) {
  const buttons = Array.from(document.querySelectorAll('[data-demo-map]'))
  const description = document.getElementById('live-demo-description')
  const separate = document.getElementById('live-demo-open')

  function showChoice(button) {
    for (const item of buttons) {
      const selected = item === button
      item.classList.toggle('is-active', selected)
      item.setAttribute('aria-pressed', String(selected))
    }
    frame.title = `ASCII Engine live demo — ${button.textContent}`
    description.textContent = button.dataset.demoDescription
    separate.href = button.dataset.demoOpen
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return
      showChoice(button)
      frame.src = button.dataset.demoUrl
    })
  }

  // On Pages the child shares the origin; reloads keep its surrounding controls in sync.
  // Local README previews embed the public origin; their buttons still switch its URL.
  frame.addEventListener('load', () => {
    try {
      const id = new URL(frame.contentWindow.location.href).searchParams.get('area')
      const button = buttons.find(item => item.dataset.demoMap === id)
      if (button) showChoice(button)
    } catch {
      // Reading a cross-origin preview is unavailable; the chosen button remains current.
    }
  })
}
