const styles = `
:host {
  --background-color: var(--light);

  display: block;
  width: 100%;
}

.block[target="_blank"] .heading::after {
  content: "➭";
  margin-left: var(--tiny);
  opacity: 0.5;
}

.block {
  background-color: var(--background-color);
  border-radius: var(--thin);
  border: var(--border);
  box-shadow: var(--shadow);
  box-sizing: border-box;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: relative;
  top: 0;
  width: 100%;
  text-decoration: none;
  transition: all var(--slow);
  transition-property: box-shadow, left, top;
}

.block[href] {
  cursor: pointer;

  .heading {
    color: var(--darkest);
  }
}

.block > a, b, em, h1, h2, h3, h4, h5 {
  color: var(--darkest);
  font-weight: 700;
}

.heading {
  font-size: 1.25rem;
  font-weight: 700;
  padding: var(--small);
}

[slot="content"] {
  & > * {
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

@media screen and (hover: hover) {
  .block[href]::after {
    align-self: center;
    border: var(--border);
    border-radius: inherit;
    content: "";
    display: block; height: 100%;
    margin: auto;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: all var(--slow);
    transition-property: height, opacity, width;
    width: 100%;
    z-index: 1;
  }

  .block[href]:not(:state(disabled)):active {
    box-shadow: var(--shadow-collapsed);
    left: var(--tiny);
    top: var(--tiny);
  }

  .block[href]:hover::after {
    height: calc(100% - var(--small));
    opacity: 1;
    width: calc(100% - var(--small));
  }
}
`

class NeuBlock extends HTMLElement {
  static observedAttributes = ['color', 'external', 'heading', 'href']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.block = document.createElement('a')
    this.block.classList.add('block')

    this.content = document.createElement('div')
    this.content.setAttribute('slot', 'content')
    this.content.innerHTML = this.innerHTML
    this.block.appendChild(this.content)

    const observer = new MutationObserver(() => {
      this.content.innerHTML = this.innerHTML
    })
    observer.observe(this, {
      childList: true,
      subtree: true
    })

    this.heading = document.createElement('span')
    this.heading.classList.add('heading')
    this.block.prepend(this.heading)

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
    root.appendChild(this.block)
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
      case 'external':
        if (newValue !== null) {
          this.block.setAttribute('target', '_blank')
        } else {
          this.block.removeAttribute('target')
        }
        break
      case 'heading':
        this.heading.textContent = this.getAttribute('heading')
        break
      case 'href':
        if (newValue !== null) {
          this.block.setAttribute('href', newValue)
        } else {
          this.block.removeAttribute('href')
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
