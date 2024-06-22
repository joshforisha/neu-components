const styles = `
:host {
  align-items: center;
  background-color: var(--gray);
  border-radius: var(--tiny);
  border: var(--border);
  box-shadow: var(--shadow);
  cursor: pointer;
  display: flex;
  font-weight: 700;
  justify-content: center;
  min-height: var(--control);
  padding: 0 var(--medium);
  position: relative;
}

@media screen and (hover: hover) {
  :host::after {
    border: var(--border-thin);
    border-radius: inherit;
    content: "";
    display: block;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: all var(--slow);
    transition-property: height, opacity, width;
    width: 100%;
    z-index: 1;
  }

  :host(:hover)::after {
    height: calc(100% - var(--small));
    opacity: 1;
    width: calc(100% - var(--small));
  }
}
`

function backgroundColor(colorName) {
  if (colorName === 'white') return 'var(--white)'
  return `var(--${colorName}-medium)`
}

class NeuButton extends HTMLElement {
  static observedAttributes = ['color', 'round']

  constructor() {
    super()
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = this.innerHTML

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.backgroundColor = backgroundColor(newValue)
        break
      case 'round':
        this.style.borderRadius =
          newValue !== null ? 'var(--large)' : 'var(--tiny)'
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-button', NeuButton)
