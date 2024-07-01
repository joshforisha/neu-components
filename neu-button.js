const styles = `
:host {
  --background-color: var(--gray-medium);

  align-items: center;
  background-color: var(--background-color);
  border-radius: var(--tiny);
  border: var(--border);
  box-shadow: var(--shadow);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-weight: 700;
  justify-content: center;
  left: 0;
  min-height: var(--control);
  padding: 0 var(--medium);
  position: relative;
  top: 0;
  transition: all var(--fast);
  transition-property: box-shadow, left, top;
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

  :host(:active) {
    box-shadow: var(--shadow-collapsed);
    left: var(--tiny);
    top: var(--tiny);
  }

  :host(:hover)::after {
    height: calc(100% - var(--small));
    opacity: 1;
    width: calc(100% - var(--small));
  }
}
`

class NeuButton extends HTMLElement {
  static observedAttributes = ['color', 'href', 'round']

  constructor() {
    super()

    this._internals = this.attachInternals()

    this.addEventListener('click', (event) => {
      if (this.hasAttribute('href')) {
        event.stopPropagation()
        window.open(this.getAttribute('href'), this.hasAttribute('external') ? '_blank' : '_self')
      }
    }, true)
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
        this.style.setProperty('--background-color', `var(--${newValue}-medium)`)
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
