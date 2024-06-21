const styles = `
:host {
  align-items: center;
  background-color: var(--gray);
  border-radius: var(--tiny);
  border: var(--border);
  cursor: pointer;
  box-shadow: var(--shadow);
  display: inline-flex;
  font-weight: 700;
  min-height: var(--control);
  padding: 0 var(--medium);
}
`

function backgroundColor(colorName) {
  if (colorName === 'white') return 'var(--white)'
  return `var(--${colorName}-medium)`
}

class NeuButton extends HTMLElement {
  static observedAttributes = ['color']

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = this.innerHTML

    const style = document.createElement('style')
    style.textContent = styles
    shadowRoot.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.backgroundColor = backgroundColor(newValue)
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-button', NeuButton)
