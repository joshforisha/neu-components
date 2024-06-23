const styles = `
:host {
  border-radius: var(--thin);
  border: var(--border-thin);
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  padding: var(--thin);
  transition: all var(--slow);
  transition-property: background-color, border-radius;
}

img {
  border-radius: inherit;
}
`

class NeuAvatar extends HTMLElement {
  static observedAttributes = ['alt', 'color', 'round', 'size', 'src']

  static backgroundColor(colorName) {
    if (colorName === 'white') return 'var(--white)'
    return `var(--${colorName}-medium)`
  }

  constructor() {
    super()
    this.image = document.createElement('img')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    root.appendChild(this.image)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'alt':
      case 'src':
        this.image.setAttribute(name, newValue)
        break
      case 'color':
        this.style.backgroundColor = NeuAvatar.backgroundColor(newValue)
        break
      case 'size':
        this.style.height = `calc(${newValue}px + 2 * var(--thin) + var(--thin))`
        this.style.width = `calc(${newValue}px + 2 * var(--thin) + var(--thin))`
        this.image.setAttribute('height', newValue)
        this.image.setAttribute('width', newValue)
        break
      case 'round':
        if (newValue !== null) {
          this.style.borderRadius = '50%'
        } else {
          this.style.borderRadius = 'var(--thin)'
        }
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-avatar', NeuAvatar)
