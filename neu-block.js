const styles = `
:host {
  --accent-color: var(--gray-dark);
  --background-color: var(--white);

  background-color: var(--background-color);
  border-radius: var(--thin);
  border: var(--border);
  box-shadow: var(--shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: var(--small);
  width: 100%;
}

:host(:state(link)) {
  cursor: pointer;
}

:host(:state(external)) .heading::after {
  content: "➭";
  margin-left: var(--tiny);
  opacity: 0.5;
}

a, b, em, h1, h2, h3, h4, h5 {
  color: var(--accent-color);
  font-weight: 700;
}

.heading {
  color: var(--accent-color);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 var(--tiny);
}

p {
  margin: 0;
}
`

class NeuBlock extends HTMLElement {
  static observedAttributes = ['color', 'external', 'heading', 'href']

  constructor() {
    super()

    this._internals = this.attachInternals()
    this.onClick = () => {
      window.open(
        this.getAttribute('href'),
        this.hasAttribute('external') ? '_blank' : '_self'
      )
    }

    this.heading = document.createElement('span')
    this.heading.classList.add('heading')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = this.innerHTML

    root.prepend(this.heading)

    const style = document.createElement('style')
    style.textContent = styles
    root.prepend(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        if (newValue !== null) {
          this.style.setProperty('--accent-color', `var(--${newValue}-dark)`)
          this.style.setProperty(
            '--background-color',
            `var(--${newValue}-light)`
          )
        } else {
          this.style.setProperty('--accent-color', 'var(--gray-dark)')
          this.style.setProperty('--background-color', 'var(--white)')
        }
        break
      case 'external':
        if (newValue !== null) {
          this._internals.states.add('external')
        } else {
          this._internals.states.delete('external')
        }
        break
      case 'heading':
        this.heading.textContent = this.getAttribute('heading')
        break
      case 'href':
        if (newValue !== null) {
          this._internals.states.add('link')
          this.addEventListener('click', this.onClick)
        } else {
          this._internals.states.delete('link')
          this.removeEventListener('click', this.onClick)
        }
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-block', NeuBlock)
