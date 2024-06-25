const styles = `
:host {
  --unfocused-color: var(--tint);
  --focused-color: var(--white);

  width: 100%;
}

input {
  background-color: var(--unfocused-color);
  border: var(--border);
  border-radius: var(--medium);
  box-sizing: border-box;
  font: inherit;
  font-weight: 400;
  margin-top: var(--tiny);
  min-height: var(--control);
  outline: none;
  padding: 0 var(--small);
  transition: background-color var(--fast);
  width: 100%;

  &:focus {
    background-color: var(--focused-color);
  }

  &::placeholder {
    font-style: italic;
    color: var(--shade);
  }
}

label {
  cursor: pointer;
  diplay: flex;
  flex-direction: column;
  font-weight: 500;
}
`

class NeuInput extends HTMLElement {
  static observedAttributes = ['label', 'placeholder']

  constructor() {
    super()

    this.input = document.createElement('input')
    this.input.setAttribute('type', this.getAttribute('type') ?? 'text')

    this.label = document.createElement('label')
    this.labelText = document.createElement('span')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.label.appendChild(this.labelText)
    this.label.appendChild(this.input)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.labelText.textContent = newValue
        break
      case 'placeholder':
      case 'type':
        this.input.setAttribute(name, newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-input', NeuInput)
