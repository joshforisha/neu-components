const styles = `
:host {
  --background-color: var(--white);
  --label-color: var(--gray-dark);

  background-color: var(--background-color);
  border-radius: var(--thin);
  border: var(--border);
  box-shadow: var(--shadow);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: var(--tiny) var(--small);
}

:host(:state(link)) {
  cursor: pointer;
}

:host(:state(external)) label::after {
  content: "➭";
  margin-left: var(--tiny);
  opacity: 0.5;
}

label {
  color: var(--label-color);
  cursor: pointer;
  font-size: 1.25em;
  font-weight: 700;
}

p {
  font-style: italic;
  margin: 0;
}
`

class NeuLink extends HTMLElement {
  static observedAttributes = ['color', 'external', 'href', 'label']

  constructor() {
    super()

    this._internals = this.attachInternals()
    this.onClick = () => {
      window.open(this.getAttribute('href'), this.hasAttribute('external') ? '_blank' : '_self')
    }
    this.description = document.createElement('p')
    this.label = document.createElement('label')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    root.appendChild(this.label)

    this.description.textContent = this.textContent
    root.appendChild(this.description)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--background-color', `var(--${newValue}-light)`)
        this.style.setProperty('--label-color', `var(--${newValue}-dark)`)
        break
      case 'external':
        if (newValue !== null) {
          this._internals.states.add('external')
        } else {
          this._internals.states.delete('external')
        }
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
      case 'label':
        this.label.textContent = newValue
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }
}

customElements.define('neu-link', NeuLink)
