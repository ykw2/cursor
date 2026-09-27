const STORAGE_KEY = 'paper-notes'
const MAX_NOTES = 20
const MAX_LENGTH = 120

const timeFormat = new Intl.DateTimeFormat('zh-TW', {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function normalize(entry) {
  if (!entry || typeof entry.id !== 'string' || typeof entry.text !== 'string') return null
  const text = entry.text.trim().slice(0, MAX_LENGTH)
  const createdAt = Number(entry.createdAt)
  if (!text || !Number.isFinite(createdAt)) return null
  return { id: entry.id, text, createdAt }
}

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    const seen = new Set()
    return parsed
      .map(normalize)
      .filter((note) => {
        if (!note || seen.has(note.id)) return false
        seen.add(note.id)
        return true
      })
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_NOTES)
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
  const hint = root.querySelector('#note-hint')
  const length = root.querySelector('#note-length')
  let notes = loadNotes()

  function showError(message) {
    error.hidden = !message
    error.textContent = message || ''
    input.setAttribute('aria-invalid', message ? 'true' : 'false')
  }

  function updateLength() {
    const used = input.value.length
    length.textContent = `${used}/${MAX_LENGTH}`
    length.classList.toggle('is-full', used >= MAX_LENGTH)
  }

  function updateHint(notice) {
    const left = MAX_NOTES - notes.length
    hint.textContent =
      notice ||
      (left === 0
        ? '已滿 20 則。再記一則會拿掉最舊的。'
        : `還可以記 ${left} 則，只存在這台瀏覽器。`)
  }

  function render(notice) {
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
      remove.setAttribute('aria-label', `刪除「${note.text}」`)
      remove.addEventListener('click', () => {
        const previous = notes
        notes = notes.filter((entry) => entry.id !== note.id)
        try {
          persist(notes)
          showError('')
        } catch {
          notes = previous
          showError('這台瀏覽器現在無法保存記事。')
        }
        render()
      })

      item.append(text, time, remove)
      list.append(item)
    }

    updateHint(notice)
  }

  input.addEventListener('input', () => {
    updateLength()
    if (input.value.trim()) showError('')
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const text = input.value.trim()
    if (!text) {
      showError('先寫一點內容。')
      input.focus()
      return
    }

    const previous = notes
    const overflow = previous.length >= MAX_NOTES
    const next = [{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...previous].slice(0, MAX_NOTES)

    try {
      persist(next)
      notes = next
      showError('')
      input.value = ''
      updateLength()
      render(overflow ? '已滿 20 則，最舊的一則已拿掉。' : '')
    } catch {
      notes = previous
      showError('這台瀏覽器現在無法保存記事。')
      render()
    }
  })

  updateLength()
  render()
}
