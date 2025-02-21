const styles = `
:host {
  --background-color: var(--white);

  background-color: var(--background-color);
  border-radius: var(--thin);
  border: var(--border);
  box-sizing: border-box;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
  text-decoration: none;
}

a, b, em, h1, h2, h3, h4, h5 {
  color: var(--unfade);
  font-weight: 700;
}

.heading {
  color: var(--unfade);
  font-size: 1.25rem;
  font-weight: 700;
  padding: var(--small);
}

[slot="content"] {
  * {
    padding: var(--small);
  }

  p {
    margin: var(--small);
    padding: 0;

    &:first-child {
      margin-top: 0;
    }
  }
}
`

class NeuCard extends HTMLElement {
  static observedAttributes = ['color', 'heading']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.content = document.createElement('div')
    this.content.setAttribute('slot', 'content')
    this.content.innerHTML = this.innerHTML
    root.appendChild(this.content)

    const observer = new MutationObserver(() => {
      this.content.innerHTML = this.innerHTML
    })
    observer.observe(this, {
      childList: true,
      subtree: true
    })

    this.heading = document.createElement('span')
    this.heading.classList.add('heading')
    root.prepend(this.heading)

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        if (newValue !== null) {
          this.style.setProperty('--background-color', `var(--${newValue})`)
        } else {
          this.style.setProperty('--background-color', 'var(--white)')
        }
        break
      case 'heading':
        this.heading.textContent = this.getAttribute('heading')
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-card', NeuCard)
