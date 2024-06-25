const styles = `
`

class Neu extends HTMLElement {
  static observedAttributes = []

  constructor() {
    super()
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-', Neu)
