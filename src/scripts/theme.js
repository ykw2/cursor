const STORAGE_KEY = 'paper-theme'

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function paint(button, theme) {
  document.documentElement.dataset.theme = theme
  const isDark = theme === 'dark'
  button.setAttribute('aria-pressed', String(isDark))
  button.textContent = isDark ? '淺色' : '深色'
}

export function setupTheme(button) {
  paint(button, currentTheme())

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark'
    paint(button, next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* 無法寫入時仍切換這一頁的外觀 */
    }
  })
}
