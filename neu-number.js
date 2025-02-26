const styles = `
:host {
  display: inline-grid;
  grid-template-columns: repeat(2, auto);
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
  grid-column: 1 / span 2;
  grid-row-start: 2;
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
  font-weight: 500;
  white-space: nowrap;
}

.trailing {
  justify-self: flex-end;
}

:host(:state(inline)) {
  align-items: center;
  column-gap: var(--small);
  grid-template-columns: min-content max-content min-content;
}

:host(:state(inline)) input {
  grid-column: unset;
  grid-row-start: unset;
}

:host(:state(disabled)) input {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--darker);
  cursor: not-allowed;
}

:host(:state(small)) input {
  height: var(--control-small);
  min-height: unset;
}
`

class NeuNumber extends HTMLElement {
  static observedAttributes = [
    'autofocus',
    'disabled',
    'inline',
    'leading',
    'max',
    'min',
    'placeholder',
    'small',
    'step',
    'trailing',
    'value'
  ]

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.leadingLabel = document.createElement('label')
    this.leadingLabel.classList.add('leading')
    root.appendChild(this.leadingLabel)

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'number')
    this.input.addEventListener('input', (event) => {
      this.dispatchEvent(new Event('change'))
    })
    root.appendChild(this.input)

    this.trailingLabel = document.createElement('label')
    this.trailingLabel.classList.add('trailing')
    root.appendChild(this.trailingLabel)

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
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
      case 'inline':
        if (newValue !== null) this._internals.states.add('inline')
        else this._internals.states.delete('inline')
        break
      case 'leading':
        this.leadingLabel.textContent = newValue
        break
      case 'max':
      case 'min':
      case 'placeholder':
      case 'step':
        this.input.setAttribute(name, newValue)
        break
      case 'small':
        if (newValue !== null) this._internals.states.add('small')
        else this._internals.states.delete('small')
        break
      case 'trailing':
        this.trailingLabel.textContent = newValue
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
    if (this.input.value) return Number(this.input.value)
  }

  set value(newValue) {
    this.input.value = newValue
  }
}

customElements.define('neu-number', NeuNumber)
