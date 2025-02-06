const styles = `
:host {
  --accent-color: var(--gray-dark);
  --background-color: var(--white);

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
  padding: var(--small);
  position: relative;
  width: 100%;
  text-decoration: none;
}

.block[href] {
  cursor: pointer;

  .heading {
    color: var(--accent-color);
  }
}

.block > a, b, em, h1, h2, h3, h4, h5 {
  color: var(--accent-color);
  font-weight: 700;
}

.heading {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 var(--tiny);
}

p {
  margin: 0;

  &:not(:first-of-type) {
    margin-top: var(--small);
  }
}

@media screen and (hover: hover) {
  .block[href]::after {
    align-self: center;
    border: var(--border-thin);
    border-radius: inherit;
    content: "";
    display: block;
    height: 100%;
    margin: auto;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: all var(--slow);
    transition-property: height, opacity, width;
    width: 100%;
    z-index: 1;
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
    root.appendChild(this.block)

    this.heading = document.createElement('span')
    this.heading.classList.add('heading')

    this.block.innerHTML = this.innerHTML
    this.block.prepend(this.heading)

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
        console.log(newValue)
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
