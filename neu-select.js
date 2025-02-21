const styles = `
:host {
  position: relative;
  width: 100%;
}

label {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;

  & > span {
    display: flex;
    flex-basis: 50%;

    &.leading {
      font-weight: 500;
    }

    &.trailing {
      justify-content: flex-end;
    }
  }
}

select {
  appearance: none;
  background-color: var(--tint);
  cursor: pointer;
  font: inherit;
  min-height: var(--control);
  outline: none;
  padding: 0 var(--small);
  position: relative;
  transition: background-color var(--slow);
  width: 100%;

  &:active {
    background-color: var(--white);
  }
}

.indicator {
  bottom: 0.8rem;
  opacity: 0.75;
  pointer-events: none;
  position: absolute;
  right: var(--medium);
  transform: rotate(90deg);
}
`

class NeuSelect extends HTMLElement {
  static observedAttributes = ['disabled', 'leading', 'trailing']

  constructor() {
    super()

    const root = this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.label = document.createElement('label')
    this.leadingText = document.createElement('span')
    this.leadingText.classList.add('leading')
    this.trailingText = document.createElement('span')
    this.trailingText.classList.add('trailing')
    this.label.appendChild(this.leadingText)
    this.label.appendChild(this.trailingText)
    root.appendChild(this.label)

    this.select = document.createElement('select')
    this.select.innerHTML = this.innerHTML
    root.appendChild(this.select)

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
          this.select.setAttribute('disabled', '')
        } else {
          this.select.removeAttribute('disabled')
        }
        break
      case 'leading':
        this.leadingText.textContent = newValue
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
}

customElements.define('neu-select', NeuSelect)
