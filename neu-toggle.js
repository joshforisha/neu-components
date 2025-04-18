const styles = `
:host {
  --indicated-color: var(--lighter);

  align-items: center;
  display: flex;
  gap: var(--small);
}

.handle {
  background-color: var(--white);
  border: var(--border);
  border-radius: 50%;
  height: calc(1.25 * var(--medium));
  transform: translateX(1px);
  transition: all var(--slow);
  transition-property: background-color, transform;
  width: calc(1.25 * var(--medium));
}

.indicator {
  align-items: center;
  background-color: var(--light);
  border: var(--border);
  border-radius: var(--large);
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: var(--control-small);
  transition: background-color var(--slow);
  width: var(--control);
}

label {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  gap: var(--small);
  white-space: nowrap;
}

:host(:state(disabled)) .handle {
  background-color: var(--light);
}

:host(:state(disabled)) .indicator {
  cursor: not-allowed;
}

:host(:state(disabled)) label {
  color: var(--darker);
  cursor: not-allowed;
}

:host(:state(toggled)) .indicator {
  background-color: var(--indicated-color);
}

:host(:state(toggled)) .handle {
  transform: translateX(calc(var(--medium) + 7px));
}
`

class NeuToggle extends HTMLElement {
  static observedAttributes = ['color', 'disabled', 'label', 'toggled']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.addEventListener('click', () => {
      if (!this._internals.states.has('disabled')) {
        this.toggleAttribute('toggled')
      }
    })

    this.indicator = document.createElement('div')
    this.indicator.classList.add('indicator')
    root.appendChild(this.indicator)

    this.handle = document.createElement('div')
    this.handle.classList.add('handle')
    this.indicator.appendChild(this.handle)

    this.label = document.createElement('label')
    root.appendChild(this.label)

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'color':
        this.style.setProperty('--indicated-color', `var(--${newValue})`)
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
