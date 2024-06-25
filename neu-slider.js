const styles = `
:host {
  --thumb-color: var(--gray);
  --thumb-hover-color: var(--white);
  --track-color: var(--light);

  width: 100%;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  gap: var(--tiny);

  input {
    appearance: none;
    background-color: inherit;
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
      height: calc(var(--control) / 2);
      margin-top: calc(0px - var(--small));
      width: calc(var(--control) / 2);
    }
  }
}

@media screen and (hover: hover) {
  input::-webkit-slider-thumb {
    transition: background-color var(--fast);
  }

  input::-webkit-slider-thumb:hover {
    background-color: var(--thumb-hover-color);
  }
}
`

class NeuSlider extends HTMLElement {
  static observedAttributes = ['color', 'label', 'max', 'min', 'step']

  static thumbColor(colorName) {
    if (colorName === 'white') return 'var(--white)'
    return `var(--${colorName}-medium)`
  }

  static trackColor(colorName) {
    if (colorName === 'white') return 'var(--light)'
    return `var(--${colorName}-light)`
  }

  constructor() {
    super()

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'range')
    this.input.addEventListener('input', (event) => {
      this.value = event.target.value
    })

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
      case 'color':
        this.style.setProperty('--track-color', NeuSlider.trackColor(newValue ?? 'white'))
        this.style.setProperty('--thumb-color', NeuSlider.thumbColor(newValue ?? 'white'))
        break
      case 'label':
        this.labelText.textContent = newValue
        break
      case 'max':
      case 'min':
      case 'step':
        this.input.setAttribute(name, newValue)
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-slider', NeuSlider)
