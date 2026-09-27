const STORAGE_KEY = 'paper-notes'
const MAX_NOTES = 20

const timeFormat = new Intl.DateTimeFormat('zh-TW', {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((note) => note && typeof note.text === 'string' && note.id)
  } catch {
    return []
  }
}

function persist(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function setupNotes(root) {
  const form = root.querySelector('#note-form')
  const input = root.querySelector('#note-input')
  const list = root.querySelector('#note-list')
  const empty = root.querySelector('#note-empty')
  const error = root.querySelector('#note-error')
  let notes = loadNotes()

  function showError(message) {
    error.hidden = !message
    error.textContent = message || ''
  }

  function render() {
    list.replaceChildren()
    empty.hidden = notes.length > 0

    for (const note of notes) {
      const item = document.createElement('li')
      item.className = 'note'

      const text = document.createElement('p')
      text.textContent = note.text

      const time = document.createElement('time')
      const created = new Date(note.createdAt)
      time.dateTime = created.toISOString()
      time.textContent = timeFormat.format(created)

      const remove = document.createElement('button')
      remove.type = 'button'
      remove.textContent = '刪除'
      remove.addEventListener('click', () => {
        notes = notes.filter((entry) => entry.id !== note.id)
        try {
          persist(notes)
          showError('')
        } catch {
          showError('這台瀏覽器現在無法保存記事。')
        }
        render()
      })

      item.append(text, time, remove)
      list.append(item)
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const text = input.value.trim()
    if (!text) {
      showError('先寫一點內容。')
      input.focus()
      return
    }

    notes = [
      { id: crypto.randomUUID(), text, createdAt: Date.now() },
      ...notes,
    ].slice(0, MAX_NOTES)

    try {
      persist(notes)
      showError('')
      input.value = ''
    } catch {
      notes = notes.slice(1)
      showError('這台瀏覽器現在無法保存記事。')
    }
    render()
  })

  render()
}
