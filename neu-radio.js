const styles = `
:host {
  --indicated-color: var(--lighter);
}

input {
  align-items: center;
  appearance: none;
  background-color: var(--light);
  border: var(--border);
  border-radius: 50%;
  color: var(--black);
  cursor: pointer;
  display: flex;
  font: inherit;
  height: 1.5rem;
  justify-content: center;
  margin: 0;
  transition: background-color var(--fast);
  width: 1.5rem;

  &::after {
    background-color: var(--black);
    border-radius: 50%;
    content: "";
    height: 0.75rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--fast);
    width: 0.75rem;
  }

  &:checked {
    background-color: var(--indicated-color);

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
  border-color: var(--gray);
  color: var(--gray);
}

:host(:state(disabled)) input {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--shade);
  cursor: not-allowed;
}
`

class NeuRadio extends HTMLElement {
  static observedAttributes = ['color', 'disabled', 'label', 'name']

  static selections = {}

  static toggle(radio) {
    const name = radio.getAttribute('name')
    if (name) {
      if (this.selections[name]) this.selections[name].checked = false
      this.selections[name] = radio
    }
  }

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'radio')
    this.input.addEventListener('change', (event) => {
      NeuRadio.toggle(this.input)
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
        this.style.setProperty('--indicated-color', `var(--${newValue})`)
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

customElements.define('neu-radio', NeuRadio)
