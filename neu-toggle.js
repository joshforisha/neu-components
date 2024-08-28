const styles = `
:host {
  --handle-color: var(--white);
  --toggled-color: var(--gray-light);
  --untoggled-color: var(--tint);

  align-items: center;
  cursor: pointer;
  display: flex;
  gap: var(--small);
}

.handle {
  background-color: var(--handle-color);
  border: var(--border-thin);
  border-radius: 50%;
  height: calc(1.5 * var(--medium));
  transform: translateX(1px);
  transition: all var(--slow);
  transition-property: background-color, transform;
  width: calc(1.5 * var(--medium));
}

.indicator {
  align-items: center;
  background-color: var(--untoggled-color);
  border: var(--border);
  border-radius: var(--large);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  height: var(--control-small);
  transition: background-color var(--slow);
  width: var(--control);
}

label {
  cursor: pointer;
  font-weight: 500;
}

:host(:state(disabled)) .indicator {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--shade);
  cursor: not-allowed;
}

:host(:state(toggled)) .indicator {
  background-color: var(--toggled-color);
}

:host(:state(toggled)) .handle {
  background-color: var(--untoggled-color);
  transform: translateX(calc(var(--medium) + 1px));
}
`

class NeuToggle extends HTMLElement {
  static observedAttributes = ['color', 'disabled', 'label', 'toggled']

  constructor() {
    super()

    this._internals = this.attachInternals()

    this.addEventListener('click', () => {
      if (!this._internals.states.has('disabled')) {
        this.toggleAttribute('toggled')
      }
    })

    this.handle = document.createElement('div')
    this.handle.classList.add('handle')

    this.indicator = document.createElement('div')
    this.indicator.classList.add('indicator')

    this.label = document.createElement('label')
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    this.indicator.appendChild(this.handle)
    root.appendChild(this.indicator)
    root.appendChild(this.label)

    this.dispatchEvent(new Event('connected'))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--handle-color', `var(--${newValue}-medium)`)
        this.style.setProperty('--toggled-color', `var(--${newValue}-medium)`)
        break
      case 'disabled':
        if (newValue === null) this._internals.states.delete('disabled')
        else this._internals.states.add('disabled')
        break
      case 'label':
        this.label.textContent = newValue
        break
      case 'toggled':
        if (newValue === null) this._internals.states.delete('toggled')
        else this._internals.states.add('toggled')
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('neu-toggle', NeuToggle)
