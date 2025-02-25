const styles = `
:host {
  width: 100%;
}

input {
  background-color: var(--light);
  border: var(--border);
  border-radius: var(--small);
  box-sizing: border-box;
  color: inherit;
  cursor: text;
  font: inherit;
  font-weight: 400;
  min-height: var(--control);
  outline: none;
  padding: 0 var(--small);
  transition: background-color var(--fast);
  width: 100%;

  &:focus {
    background-color: var(--lighter);
  }

  &::placeholder {
    font-style: italic;
    color: var(--darker);
  }
}

label {
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

:host(:state(disabled)) input {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--shade);
  cursor: not-allowed;
}
`

class NeuInput extends HTMLElement {
  static observedAttributes = [
    'autofocus',
    'disabled',
    'leading',
    'placeholder',
    'trailing',
    'value'
  ]

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.input = document.createElement('input')
    this.input.addEventListener('input', (event) => {
      this.dispatchEvent(new Event('change'))
    })

    this.label = document.createElement('label')
    this.leadingText = document.createElement('span')
    this.trailingText = document.createElement('span')

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.input.setAttribute('type', 'text')

    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.input)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'autofocus':
        if (newValue !== null) {
          this.input.setAttribute('autofocus', '')
        } else {
          this.input.removeAttribute('autofocus')
        }
        break
      case 'disabled':
        if (newValue !== null) {
          this.input.setAttribute('disabled', '')
          this._internals.states.add('disabled')
        } else {
          this.input.removeAttribute('disabled')
          this._internals.states.delete('disabled')
        }
        break
      case 'leading':
        this.leadingText.textContent = newValue
        break
      case 'placeholder':
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

  get value() {
    return this.input.value
  }

  set value(newValue) {
    this.input.value = newValue
  }
}

customElements.define('neu-input', NeuInput)
