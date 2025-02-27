const styles = `
:host {
  width: 100%;
}

input {
  appearance: none;
  background-color: inherit;
  cursor: pointer;
  grid-column: 1 / span 2;
  grid-row-start: 2;
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
  cursor: default;
  display: inline-grid;
  grid-template-columns: repeat(2, auto);
  width: 100%;

  & > span {
    display: flex;
    flex-basis: 50%;
    font-weight: 500;

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

    const label = document.createElement('label')

    this.leadingSpan = document.createElement('span')
    label.appendChild(this.leadingSpan)

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'range')
    label.appendChild(this.input)

    this.trailingSpan = document.createElement('span')
    label.appendChild(this.trailingSpan)
    root.appendChild(label)

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
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
        this.leadingSpan.textContent = newValue
        break
      case 'max':
      case 'min':
      case 'step':
        this.input.setAttribute(name, newValue)
        break
      case 'trailing':
        this.trailingSpan.textContent = newValue
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
