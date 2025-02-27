const styles = `
:host {
  background-color: var(--light);
  border: var(--border);
  border-radius: var(--tiny);
  display: flex;
  justify-content: space-between;
}

button {
  background-color: var(--lighter);
  border-bottom-right-radius: var(--tiny);
  border-left: var(--border);
  border-top-right-radius: var(--tiny);
  border-width: 0 0 0 1px;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  min-width: 4.5rem;
  padding: var(--tiny) var(--small);
  transition: background-color var(--slow);

  &.copied {
    background-color: var(--green);
    transition: background-color var(--fast);
  }

  &:not(.copied):hover {
    background-color: var(--white);
  }
}

code {
  padding: var(--tiny);
}
`

class CopyLink extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = styles
    root.appendChild(style)

    const link = document.createElement('code')
    link.textContent = this.getAttribute('url')
    root.appendChild(link)

    const button = document.createElement('button')
    button.textContent = 'Copy'
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(this.getAttribute('url'))
      button.classList.add('copied')
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = 'Copy'
        button.classList.remove('copied')
      }, 1000)
    })
    root.appendChild(button)
  }
}

customElements.define('copy-link', CopyLink)
