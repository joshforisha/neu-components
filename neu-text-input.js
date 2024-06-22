const styles = `
input {
  border: var(--border);
  border-radius: var(--medium);
  box-shadow: var(--shadow);
  display: block;
  font: inherit;
  font-weight: 400;
  margin-top: var(--tiny);
  min-height: var(--control);
  outline: none;
  padding: 0 var(--medium);
  width: 100%;
}

label {
  font-weight: 500;
}
`

class NeuTextInput extends HTMLElement {
  static observedAttributes = ['label', 'placeholder']

  constructor() {
    super()

    this.label = document.createElement('label')
    this.input = document.createElement('input')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    root.appendChild(this.label)
    this.label.appendChild(this.input)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.label.textContent = newValue
        break
      case 'placeholder':
        this.input.setAttribute('placeholder', newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-text-input', NeuTextInput)
