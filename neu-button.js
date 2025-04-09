const styles = `
:host {
  --background-color: var(--gray);

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

:host(:state(disabled)) {
  color: var(--darker);
  cursor: not-allowed;
}

:host(:state(small)) {
  height: var(--control-small);
  min-height: unset;
  padding: 0 var(--small);
}

@media screen and (hover: hover) {
  :host::after {
    border: var(--border);
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

  :host(:not(:state(disabled)):active) {
    box-shadow: var(--shadow-collapsed);
    left: var(--tiny);
    top: var(--tiny);
  }

  :host(:not(:state(disabled)):hover)::after {
    height: calc(100% - var(--small));
    opacity: 1;
    width: calc(100% - var(--small));
  }
}
`

class NeuButton extends HTMLElement {
  static observedAttributes = ['color', 'disabled', 'round', 'small']

  constructor() {
    super()

    this.stylesheet = document.createElement('style')
    this.stylesheet.textContent = styles

    this.content = document.createElement('slot')
    this.content.innerHTML = this.innerHTML
    this.innerHTML = ''

    this._internals = this.attachInternals()

    this.addEventListener(
      'click',
      (event) => {
        if (this._internals.states.has('disabled')) {
          event.preventDefault()
          event.stopPropagation()
          return
        }

        if (this.hasAttribute('href')) {
          event.stopPropagation()
          window.open(
            this.getAttribute('href'),
            this.hasAttribute('external') ? '_blank' : '_self'
          )
        }
      },
      true
    )

    const root = this.attachShadow({ mode: 'open' })
    root.appendChild(this.stylesheet)
    root.append(this.content)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--background-color', `var(--${newValue})`)
        break
      case 'disabled':
        if (newValue !== null) {
          this._internals.states.add('disabled')
        } else {
          this._internals.states.delete('disabled')
        }
        break
      case 'round':
        this.style.borderRadius =
          newValue !== null ? 'var(--large)' : 'var(--tiny)'
        break
      case 'small':
        if (newValue !== null) {
          this._internals.states.add('small')
        } else {
          this._internals.states.delete('small')
        }
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }

  get textContent() {
    return this.content.textContent
  }

  set textContent(newValue) {
    this.content.textContent = newValue
  }
}

customElements.define('neu-button', NeuButton)
