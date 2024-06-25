const styles = `
:host {
  --checked-color: var(--white);
}

label {
  align-items: center;
  display: inline-flex;
  font-weight: 500;
  gap: var(--tiny);

  input {
    align-items: center;
    appearance: none;
    background-color: var(--light);
    border: var(--border);
    border-radius: var(--small);
    cursor: pointer;
    display: flex;
    font: inherit;
    height: calc(var(--control) / 2);
    justify-content: center;
    margin: 0;
    transition: background-color var(--fast);
    width: calc(var(--control) / 2);

    &::after {
      content: "✓";
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--fast);
    }

    &:checked {
      background-color: var(--checked-color);

      &::after {
        opacity: 1;
      }
    }
  }
}
`

class NeuCheckbox extends HTMLElement {
  static observedAttributes = ['checked', 'color', 'label', 'name']

  static checkedColor(colorName) {
    if (colorName === 'white') return 'var(--white)'
    return `var(--${colorName}-medium)`
  }

  constructor() {
    super()

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'checkbox')

    this.label = document.createElement('label')
    this.labelText = document.createElement('span')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

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
        this.style.setProperty('--checked-color', NeuCheckbox.checkedColor(newValue ?? 'white'))
        break
      case 'label':
        this.labelText.textContent = newValue
        break
      case 'checked':
      case 'name':
        this.input.setAttribute(name, newValue)
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-checkbox', NeuCheckbox)
