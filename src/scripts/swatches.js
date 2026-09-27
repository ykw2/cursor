export function setupSwatches() {
  const tokens = [...document.querySelectorAll('.token-value')]

  const paint = () => {
    const styles = getComputedStyle(document.documentElement)
    for (const token of tokens) {
      const name = token.dataset.token
      const value = styles.getPropertyValue(name).trim()
      if (value) token.textContent = value
    }
  }

  paint()
  new MutationObserver(paint).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
}
