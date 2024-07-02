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
  display: flex;
  flex-wrap: wrap;

  & > span {
    display: flex;
    flex-basis: 50%;

    &:first-of-type {
      font-weight: 500;
    }

    &:last-of-type {
      justify-content: flex-end;
    }
  }
}
`

class NeuInput extends HTMLElement {
  static observedAttributes = [
    'leading',
    'max',
    'min',
    'placeholder',
    'step',
    'trailing',
    'value'
  ]

  constructor() {
    super()

    this.input = document.createElement('input')
    this.input.addEventListener('input', (event) => {
      this.value = event.target.value
      this.dispatchEvent(new Event('change'))
    })

    this.label = document.createElement('label')
    this.leadingText = document.createElement('span')
    this.trailingText = document.createElement('span')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.input.setAttribute('type', this.getAttribute('type') ?? 'text')

    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.input)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'leading':
        this.leadingText.textContent = newValue
        break
      case 'max':
      case 'min':
      case 'placeholder':
      case 'step':
      case 'type':
        this.input.setAttribute(name, newValue)
        break
      case 'trailing':
        this.trailingText.textContent = newValue
        break
      case 'value':
        this.input.setAttribute('value', newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-input', NeuInput)
