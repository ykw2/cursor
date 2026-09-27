function setOpen(toggle, nav, open) {
  nav.classList.toggle('is-open', open)
  toggle.setAttribute('aria-expanded', String(open))
  toggle.textContent = open ? '關閉' : '選單'
}

function setupScrollState(nav) {
  const header = document.querySelector('.site-header')
  const links = [...nav.querySelectorAll('a[href^="#"]')]
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  const mark = (id) => {
    for (const link of links) {
      const current = id && link.getAttribute('href') === `#${id}`
      if (current) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }

  const paint = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8)
    const line = window.scrollY + window.innerHeight * 0.45
    let current = ''
    for (const section of sections) {
      if (section.offsetTop <= line) current = section.id
    }
    mark(current)
  }

  paint()
  window.addEventListener('scroll', paint, { passive: true })
}

export function setupNav(toggle, nav) {
  document.documentElement.dataset.enhanced = 'true'
  setOpen(toggle, nav, false)
  setupScrollState(nav)

  toggle.addEventListener('click', () => {
    setOpen(toggle, nav, !nav.classList.contains('is-open'))
  })

  nav.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return
    // 同一輪點擊裡立刻藏起選單，瀏覽器會取消連結的捲動。
    window.setTimeout(() => setOpen(toggle, nav, false), 0)
  })

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return
    if (nav.contains(event.target) || toggle.contains(event.target)) return
    setOpen(toggle, nav, false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(toggle, nav, false)
  })
}
