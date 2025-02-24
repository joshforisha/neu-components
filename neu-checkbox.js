const styles = `
:host {
  --indicator-color: var(--black);
}

input {
  align-items: center;
  appearance: none;
  background-color: var(--fade);
  border: var(--border);
  border-radius: var(--small);
  color: var(--indicator-color);
  cursor: pointer;
  display: flex;
  font: inherit;
  height: var(--control-small);
  justify-content: center;
  margin: 0;
  transition: background-color var(--fast);
  width: var(--control-small);

  &::after {
    content: "✓";
    font-size: 1.25rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--fast);
  }

  &:checked {
    &::after {
      opacity: 1;
    }
  }
}

label {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  gap: var(--small);
}

:host(:state(disabled)) {
  border-color: var(--gray-dark);
  color: var(--gray-dark);
}

:host(:state(disabled)) input {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--shade);
  cursor: not-allowed;
}
`

class NeuCheckbox extends HTMLElement {
  static observedAttributes = ['checked', 'color', 'disabled', 'label', 'name']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'checkbox')
    this.input.addEventListener('change', (event) => {
      this.dispatchEvent(new Event('change'))
    })

    this.label = document.createElement('label')
    this.labelText = document.createElement('span')

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.label.appendChild(this.input)
    this.label.appendChild(this.labelText)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--indicator-color', `var(--${newValue})`)
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
      case 'label':
        this.labelText.textContent = newValue
        break
      case 'checked':
      case 'name':
        this.input.setAttribute(name, newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }

  get checked() {
    return this.input.checked
  }
}

customElements.define('neu-checkbox', NeuCheckbox)
