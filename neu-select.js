const styles = `
:host {
  margin: 0;
  position: relative;
}

button {
  align-items: center;
  background-color: var(--white);
  border: var(--border);
  border-radius: var(--medium);
  box-shadow: var(--shadow);
  cursor: pointer;
  display: flex;
  font: inherit;
  font-weight: 500;
  gap: var(--small);
  justify-content: center;
  min-height: var(--control);
  padding: 0 var(--small);
  transition: border-radius var(--slow);

  &::after {
    content: "❯";
    display: block;
    font-size: 1.125em;
    line-height: 1;
    opacity: 0.5;
    transform: rotate(90deg);
    transition: transform var(--slow);
  }
}

menu {
  list-style-type: none;
  opacity: 0;
  padding: calc(var(--small) + var(--tiny)) 0 0;
  pointer-events: none;
  position: absolute;
  top: calc(0px + var(--medium) + var(--small));
  transition: opacity var(--slow);
  width: calc(100% + var(--tiny));

  li {
    align-items: center;
    background-color: var(--white);
    border-top: var(--border);
    border-left: var(--border);
    border-right: var(--border);
    box-shadow: var(--shadow);
    cursor: pointer;
    display: flex;
    justify-content: center;
    min-height: var(--control);
    padding: 0 var(--small);
    position: relative;
    width: calc(100% - var(--medium) - var(--small));
    z-index: 10;

    &:first-child {
      border-top-left-radius: var(--small);
      border-top-right-radius: var(--small);
    }

    &:last-child {
      border-bottom-left-radius: var(--small);
      border-bottom-right-radius: var(--small);
      border-bottom: var(--border);
    }

    span {
      width: 100%;
    }
  }
}

@media screen and (hover: hover) {
  menu li::after {
    border: var(--border-thin);
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

  menu li:hover::after {
    height: calc(100% - var(--small));
    opacity: 1;
    width: calc(100% - var(--small));
  }

  :host(:hover) button::after {
    transform: rotate(270deg);
  }

  :host(:hover) menu {
    opacity: 1;
    pointer-events: auto;
  }
}
`

class NeuSelect extends HTMLElement {
  static observedAttributes = ['options', 'placeholder']

  constructor() {
    super()

    this.anchor = document.createElement('button')
    this.menu = document.createElement('menu')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    root.appendChild(this.anchor)
    root.appendChild(this.menu)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'options':
        this.parseOptions(newValue)
        break
      case 'placeholder':
        if (!this.selection) {
          this.anchor.textContent = newValue
        }
        break
      default:
        console.warn(`Attribute ${name} has changed from "${oldValue}" to "${newValue}"`)
    }
  }

  parseOptions(options) {
    this.options = options.split(',').map((o) => o.trim())
    this.menu.innerHTML = ''
    for (const option of this.options) {
      const item = document.createElement('li')
      item.setAttribute('value', option)
      const text = document.createElement('span')
      text.textContent = option
      item.appendChild(text)
      this.menu.appendChild(item)
    }
  }
}

customElements.define('neu-select', NeuSelect)
