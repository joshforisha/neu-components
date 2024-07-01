const styles = `
:host {
  --thumb-color: var(--white);
  --track-color: var(--tint);

  width: 100%;
}

input {
  appearance: none;
  background-color: inherit;
  cursor: pointer;
  margin: 0;
  width: 100%;

  &::-webkit-slider-container {
    height: var(--large);
  }

  &::-webkit-slider-runnable-track {
    background-color: var(--track-color);
    border: var(--border-thin);
    border-radius: var(--small);
    height: var(--small);
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--thumb-color);
    border: var(--border);
    border-radius: 50%;
    cursor: pointer;
    height: var(--control-small);
    margin-top: calc(0px - 0.75rem);
    width: var(--control-small);
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

@media screen and (hover: hover) {
  input::-webkit-slider-thumb {
    transition: background-color var(--fast);
  }
}
`

class NeuSlider extends HTMLElement {
  static observedAttributes = ['color', 'leading', 'max', 'min', 'step', 'trailing', 'value']

  constructor() {
    super()

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'range')
    this.input.addEventListener('input', (event) => {
      this.value = event.target.value
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

    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.input)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--track-color', `var(--${newValue}-light)`)
        this.style.setProperty('--thumb-color', `var(--${newValue}-medium)`)
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
        this.input.value = newValue
        this.value = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-slider', NeuSlider)
