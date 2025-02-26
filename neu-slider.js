const styles = `
:host {
  width: 100%;
}

input {
  appearance: none;
  background-color: inherit;
  cursor: pointer;
  margin: var(--tiny) 0 0;
  width: 100%;

  &::-webkit-slider-container {
    height: var(--large);
  }

  &::-webkit-slider-runnable-track {
    background-color: var(--light);
    border: var(--border);
    border-radius: var(--small);
    height: var(--medium);
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--white);
    border: var(--border);
    border-radius: 50%;
    cursor: pointer;
    height: var(--control-small);
    margin-top: calc(0px - 0.4rem);
    width: var(--control-small);
  }
}

label {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-weight: 500;

  & > span {
    display: flex;
    flex-basis: 50%;

    &:last-of-type {
      justify-content: flex-end;
    }
  }
}

:host(:state(disabled)) input {
  cursor: not-allowed;

  &::-webkit-slider-thumb {
    cursor: not-allowed;
  }
}

:host(:state(disabled)) label {
  color: var(--darker);
  cursor: not-allowed;
}

@media screen and (hover: hover) {
  input::-webkit-slider-thumb {
    transition: background-color var(--fast);
  }
}
`

class NeuSlider extends HTMLElement {
  static observedAttributes = [
    'disabled',
    'leading',
    'max',
    'min',
    'step',
    'trailing',
    'value'
  ]

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    const style = document.createElement('style')
    style.textContent = styles

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'range')

    this.label = document.createElement('label')

    this.leadingText = document.createElement('span')
    this.label.appendChild(this.leadingText)

    this.trailingText = document.createElement('span')
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.input)

    root.appendChild(style)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
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
      case 'max':
      case 'min':
      case 'step':
        this.input.setAttribute(name, newValue)
        break
      case 'trailing':
        this.trailingText.textContent = newValue
        break
      case 'value':
        this.value = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }

  connectedCallback() {
    this.dispatchEvent(new Event('connected'))
  }

  get value() {
    return Number(this.input.value)
  }

  set value(newValue) {
    this.input.value = newValue
    this.dispatchEvent(new Event('input'))
  }
}

customElements.define('neu-slider', NeuSlider)
