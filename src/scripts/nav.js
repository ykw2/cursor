export function setupNav(toggle, nav) {
  document.documentElement.dataset.enhanced = 'true'
  toggle.setAttribute('aria-expanded', 'false')

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(open))
  })

  nav.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return
    // 同一輪點擊裡立刻藏起選單，瀏覽器會取消連結的捲動。
    window.setTimeout(() => {
      nav.classList.remove('is-open')
      toggle.setAttribute('aria-expanded', 'false')
    }, 0)
  })
}
