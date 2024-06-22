const styles = `
:host {
  border: var(--border-thin);
  border-radius: var(--thin);
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
        this.style.backgroundColor = `var(--${newValue}-medium)`
        break
      case 'size':
        this.style.height = `${newValue}px`
        this.style.width = `${newValue}px`
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
