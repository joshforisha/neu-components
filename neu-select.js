const styles = `
:host {
  display: block;
  position: relative;
  width: 100%;
}

label {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-weight: 500;

  & > span {
    display: flex;
    flex-basis: 50%;

    &.trailing {
      justify-content: flex-end;
    }
  }
}

select {
  appearance: none;
  background-color: var(--light);
  border-radius: var(--small);
  border: var(--border);
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 400;
  min-height: var(--control);
  outline: none;
  padding: 0 var(--small);
  position: relative;
  transition: background-color var(--slow);
  width: 100%;
}

.indicator {
  bottom: 0.8rem;
  color: var(--darker);
  pointer-events: none;
  position: absolute;
  right: var(--medium);
  transform: rotate(90deg);
}

:host(:not(:state(disabled))) select:active {
  background-color: var(--lighter);
}

:host(:state(disabled)) label {
  cursor: not-allowed;
}

:host(:state(disabled)) label span {
  color: var(--darker);
}

:host(:state(disabled)) select {
  color: var(--darkest);
  cursor: not-allowed;
}
`

class NeuSelect extends HTMLElement {
  static observedAttributes = ['disabled', 'leading', 'trailing']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    const label = document.createElement('label')

    this.leadingSpan = document.createElement('span')
    this.leadingSpan.classList.add('leading')
    label.appendChild(this.leadingSpan)

    this.trailingSpan = document.createElement('span')
    this.trailingSpan.classList.add('trailing')
    label.appendChild(this.trailingSpan)

    this.select = document.createElement('select')
    this.select.innerHTML = this.innerHTML
    this.select.addEventListener('change', () => {
      this.dispatchEvent(new Event('change'))
    })
    label.appendChild(this.select)
    root.appendChild(label)

    const indicator = document.createElement('span')
    indicator.classList.add('indicator')
    indicator.textContent = '❯'
    root.appendChild(indicator)

    const observer = new MutationObserver(() => {
      this.select.innerHTML = this.innerHTML
    })
    observer.observe(this, {
      childList: true,
      subtree: true
    })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        if (newValue !== null) {
          this._internals.states.add('disabled')
          this.select.setAttribute('disabled', '')
        } else {
          this._internals.states.delete('disabled')
          this.select.removeAttribute('disabled')
        }
        break
      case 'leading':
        this.leadingSpan.textContent = newValue
        break
      case 'trailing':
        this.trailingSpan.textContent = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }

  get value() {
    return this.select.options[this.select.selectedIndex].value
  }
}

customElements.define('neu-select', NeuSelect)
