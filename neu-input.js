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
  display: inline-grid;
  grid-template-columns: repeat(2, auto);
  width: 100%;
}

label span {
  font-weight: 500;
  white-space: nowrap;
}

.trailing {
  justify-self: flex-end;
}

:host(:state(inline)) label {
  align-items: center;
  column-gap: var(--small);
  grid-template-columns: min-content max-content min-content;
}

:host(:state(inline)) input {
  grid-column: unset;
  grid-row-start: unset;
}

:host(:state(disabled)) input {
  color: var(--darkest);
  cursor: not-allowed;
}

:host(:state(disabled)) label span {
  color: var(--darker);
  cursor: not-allowed;
}

:host(:state(small)) input {
  height: var(--control-small);
  min-height: unset;
}
`

class NeuInput extends HTMLElement {
  static observedAttributes = [
    'autofocus',
    'disabled',
    'inline',
    'leading',
    'placeholder',
    'trailing',
    'value'
  ]

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    const label = document.createElement('label')
    this.leadingSpan = document.createElement('span')
    this.leadingSpan.classList.add('leading')
    label.appendChild(this.leadingSpan)

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'text')
    this.input.addEventListener('input', (event) => {
      this.dispatchEvent(new Event('change'))
    })
    label.appendChild(this.input)

    this.trailingSpan = document.createElement('span')
    this.trailingSpan.classList.add('trailing')
    label.appendChild(this.trailingSpan)
    root.appendChild(label)

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
        this.leadingSpan.textContent = newValue
        break
      case 'placeholder':
        this.input.setAttribute(name, newValue)
        break
      case 'trailing':
        this.trailingSpan.textContent = newValue
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
