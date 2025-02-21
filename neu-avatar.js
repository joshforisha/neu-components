const styles = `
:host {
  align-items: center;
  background-color: red;
  border-radius: var(--thin);
  border: var(--border);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow: hidden;
  transition: all var(--slow);
  transition-property: background-color, border-radius;
}

:host(:state(rounded)) {
  border-radius: 50%;
}

:host(:state(rounded)) img {
  border-radius: 50%;
}

:host(:state(themed)) {
  padding: var(--thin);
}

img {
  height: 100%;
  width: 100%;
}
`

class NeuAvatar extends HTMLElement {
  static observedAttributes = ['alt', 'color', 'round', 'size', 'src']

  constructor() {
    super()
    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.image = document.createElement('img')
    root.appendChild(this.image)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'alt':
      case 'src':
        this.image.setAttribute(name, newValue)
        break
      case 'color':
        if (newValue === null) {
          this._internals.states.delete('themed')
        } else {
          this.style.backgroundColor = `var(--${newValue}-medium)`
          this._internals.states.add('themed')
        }
        break
      case 'size':
        this.style.height = `${newValue}px`
        this.style.width = `${newValue}px`
        break
      case 'round':
        if (newValue === null) this._internals.states.delete('rounded')
        else this._internals.states.add('rounded')
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-avatar', NeuAvatar)
