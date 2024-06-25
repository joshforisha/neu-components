const styles = `
:host {
  --background-color: var(--gray-light);
}

label {
  display: flex;

  .indicator
    background-color: var(--background-color);
    border: var(--border);
    border-radius: var(--medium);
    height: calc(var(--control) / 2);
    width: var(--control);
  }
}
`

class NeuToggle extends HTMLElement {
  static observedAttributes = ['label']

  constructor() {
    super()

    this.label = document.createElement('label')
    this.labelText = document.createElement('span')
    this.indicator = document.createElement('div')
    this.indicator.classList.add('indicator')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.label.appendChild(this.indicator)
    this.label.appendChild(this.labelText)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.labelText.textContent = newValue
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-toggle', NeuToggle)
