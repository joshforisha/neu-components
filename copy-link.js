const styles = `
:host {
  align-items: center;
  background-color: var(--tint);
  border: var(--border);
  border-radius: var(--tiny);
  display: flex;
  justify-content: space-between;
}

button {
  background-color: var(--gray-light);
  border-bottom-right-radius: var(--tiny);
  border-left: var(--border);
  border-top-right-radius: var(--tiny);
  border-width: 0 0 0 var(--thin);
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  padding: var(--tiny) var(--small);
}

code {
  padding: 0 var(--tiny);
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
    })
    root.appendChild(button)
  }
}

customElements.define('copy-link', CopyLink)
