const styles = `
:host {
  margin: 0;
  position: relative;
  width: 100%;
}

button {
  align-items: center;
  background-color: var(--white);
  border: var(--border);
  border-radius: var(--medium);
  color: var(--shade);
  cursor: pointer;
  display: flex;
  font: inherit;
  font-style: italic;
  gap: var(--small);
  justify-content: space-between;
  min-height: var(--control);
  padding: 0 var(--small);
  transition: border-radius var(--slow);
  width: 100%;

  &::after {
    content: "❯";
    display: block;
    font-size: 1.125em;
    font-style: normal;
    line-height: 1;
    opacity: 0.5;
    transform: rotate(90deg);
    transition: transform var(--slow);
  }
}

label {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;

  & > span {
    display: flex;
    flex-basis: 50%;

    &:first-of-type {
      font-weight: 500;
    }

    &:last-of-type {
      justify-content: flex-end;
    }
  }
}

menu {
  background-color: #f004;
  border-radius: var(--small);
  list-style-type: none;
  margin-top: var(--thin);
  min-width: min-content;
  opacity: 0;
  padding: 0;
  pointer-events: none;
  position: absolute;
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

:host(:state(disabled)) button {
  color: #0003;
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--shade);
  cursor: not-allowed;
}

:host(:state(open)) menu li::after {
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

:host(:state(selected)) button {
  color: var(--black);
  font-style: normal;
}

:host(:state(open)) menu li:hover::after {
  height: calc(100% - var(--small));
  opacity: 1;
  width: calc(100% - var(--small));
}

:host(:state(open)) button::after {
  transform: rotate(270deg);
}

:host(:state(open)) menu {
  opacity: 1;
  pointer-events: auto;
}
`

class NeuSelect extends HTMLElement {
  static observedAttributes = [
    'disabled',
    'leading',
    'options',
    'placeholder',
    'trailing'
  ]

  constructor() {
    super()

    this._internals = this.attachInternals()
    this.addEventListener('click', (event) => {
      event.preventDefault()
      if (this._internals.states.has('disabled')) return

      if (this._internals.states.has('open')) {
        this._internals.states.delete('open')
      } else {
        this._internals.states.add('open')
      }
    })

    this.anchor = document.createElement('button')

    this.label = document.createElement('label')
    this.leadingText = document.createElement('span')
    this.trailingText = document.createElement('span')

    this.menu = document.createElement('menu')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    this.label.appendChild(this.anchor)
    root.appendChild(this.label)
    root.appendChild(this.menu)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        if (newValue !== null) {
          this._internals.states.add('disabled')
        } else {
          this._internals.states.delete('disabled')
        }
        break
      case 'leading':
        this.leadingText.textContent = newValue
        break
      case 'options':
        this.parseOptions(newValue)
        break
      case 'placeholder':
        if (!this.selection) {
          this.anchor.textContent = newValue
        }
        break
      case 'trailing':
        this.trailingText.textContent = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
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

      item.addEventListener('click', (event) => {
        event.stopPropagation()
        const value = item.getAttribute('value')
        this._internals.states.add('selected')
        this.value = value
        this.anchor.textContent = value
        this._internals.states.delete('open')
        this.dispatchEvent(new Event('change'))
      })

      this.menu.appendChild(item)
    }
  }
}

customElements.define('neu-select', NeuSelect)
