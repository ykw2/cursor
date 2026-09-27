const STORAGE_KEY = 'midautumn-card'
const MAX_LENGTH = 80
const DEFAULT_NAME = '想見面的人'
const DEFAULT_MESSAGE = '願團圓的桌子，今年不再空一席。'

function loadCard() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      name: typeof parsed.name === 'string' ? parsed.name.slice(0, 20) : '',
      message: typeof parsed.message === 'string' ? parsed.message.slice(0, MAX_LENGTH) : '',
    }
  } catch {
    return { name: '', message: '' }
  }
}

export function setupGreeting(root) {
  const nameInput = root.querySelector('#wish-name')
  const messageInput = root.querySelector('#wish-message')
  const nameOut = root.querySelector('#card-name')
  const messageOut = root.querySelector('#card-message')
  const length = root.querySelector('#wish-length')
  const presets = [...root.querySelectorAll('[data-preset]')]
  const saved = loadCard()

  nameInput.value = saved.name
  messageInput.value = saved.message

  function paint() {
    const name = nameInput.value.trim()
    const message = messageInput.value.trim()
    nameOut.textContent = name || DEFAULT_NAME
    messageOut.textContent = message || DEFAULT_MESSAGE
    length.textContent = `${messageInput.value.length}/${MAX_LENGTH}`
    for (const button of presets) {
      button.setAttribute('aria-pressed', String(button.dataset.preset === messageInput.value))
    }
  }

  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: nameInput.value, message: messageInput.value }),
      )
    } catch {
      /* 無法寫入時，賀卡仍留在這一頁 */
    }
  }

  root.querySelector('#wish-form').addEventListener('input', () => {
    paint()
    save()
  })

  for (const button of presets) {
    button.addEventListener('click', () => {
      messageInput.value = button.dataset.preset
      paint()
      save()
      messageInput.focus()
    })
  }

  paint()
}
