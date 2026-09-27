function setOpen(toggle, nav, open) {
  nav.classList.toggle('is-open', open)
  toggle.setAttribute('aria-expanded', String(open))
  toggle.textContent = open ? '關閉' : '選單'
}

function setupCurrentSection(nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')]
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  if (sections.length === 0) return

  const mark = (id) => {
    for (const link of links) {
      const current = link.getAttribute('href') === `#${id}`
      if (current) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) mark(visible.target.id)
    },
    { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4, 0.75] },
  )

  for (const section of sections) observer.observe(section)
}

function setupScrolledHeader() {
  const header = document.querySelector('.site-header')
  if (!header) return
  const paint = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  paint()
  window.addEventListener('scroll', paint, { passive: true })
}

export function setupNav(toggle, nav) {
  document.documentElement.dataset.enhanced = 'true'
  setOpen(toggle, nav, false)
  setupCurrentSection(nav)
  setupScrolledHeader()

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
