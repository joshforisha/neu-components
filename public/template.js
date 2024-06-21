const styles = `
:host {
}
`

class Neu extends HTMLElement {
  static observedAttributes = ['color']

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    shadowRoot.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-', Neu)
