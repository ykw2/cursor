export function setupNav(toggle, nav) {
  document.documentElement.dataset.enhanced = 'true'
  toggle.setAttribute('aria-expanded', 'false')

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(open))
  })

  nav.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return
    nav.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
  })
}
