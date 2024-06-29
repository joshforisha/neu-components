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
  font-size: 1.25em;
  font-weight: 700;
}

p {
  font-style: italic;
  margin: 0;
}
`

class NeuLink extends HTMLElement {
  constructor() {
    super()

    this._internals = this.attachInternals()
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    if (this.hasAttribute('color')) {
      const colorName = this.getAttribute('color')
      this.style.setProperty('--background-color', `var(--${colorName}-light)`)
      this.style.setProperty('--label-color', `var(--${colorName}-dark)`)
    }

    if (this.hasAttribute('external')) {
      this._internals.states.add('external')
    }

    if (this.hasAttribute('href')) {
      this._internals.states.add('link')
      this.addEventListener('click', () => {
        window.open(this.getAttribute('href'), this.hasAttribute('external') ? '_blank' : '_self')
      })
    }

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    const label = document.createElement('label')
    label.textContent = this.getAttribute('label')
    root.appendChild(label)

    const description = document.createElement('p')
    description.textContent = this.textContent
    root.appendChild(description)
  }
}

customElements.define('neu-link', NeuLink)
