const styles = `
:host {
  --unfocused-color: var(--tint);
  --focused-color: var(--white);

  width: 100%;
}

textarea {
  background-color: var(--unfocused-color);
  border: var(--border);
  border-radius: var(--medium);
  box-sizing: border-box;
  font: inherit;
  font-weight: 400;
  min-height: var(--control);
  outline: none;
  padding: var(--small);
  transition: background-color var(--fast);
  width: 100%;

  &:focus {
    background-color: var(--focused-color);
  }

  &::placeholder {
    font-style: italic;
    color: var(--shade);
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
`

class NeuTextarea extends HTMLElement {
  static observedAttributes = ['leading', 'placeholder', 'trailing']

  constructor() {
    super()

    this.label = document.createElement('label')
    this.leadingText = document.createElement('span')
    this.trailingText = document.createElement('span')
    this.textarea = document.createElement('textarea')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.textarea)
    root.appendChild(this.label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'leading':
        this.leadingText.textContent = newValue
        break
      case 'placeholder':
      case 'type':
        this.textarea.setAttribute(name, newValue)
        break
      case 'trailing':
        this.trailingText.textContent = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-textarea', NeuTextarea)
