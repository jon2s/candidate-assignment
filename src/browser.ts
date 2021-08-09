import install from '@layer0/prefetch/window/install'
import installDevtools from '@layer0/devtools/install'

async function lateLoadContent() {
  const url = '/content' + window.location.pathname
  const res = await fetch(url)
  const html = await res.text()
  const root = document.createElement('html')
  root.innerHTML = html
  const elements = Array.from(document.querySelectorAll('[data-moov-replace]'))
  const personalizedElements = Array.from(root.querySelectorAll('[data-moov-replace]'))

  for (let i = 0; i < personalizedElements.length; i++) {
    const el = personalizedElements[i]

    for (let { name, value } of Array.from(el.attributes)) {
      elements[i].setAttribute(name, value)
    }

    elements[i].innerHTML = el.innerHTML
  }
}

document.addEventListener('DOMContentLoaded', function () {

  installDevtools()

  // @ts-ignore
  install({
    includeCacheMisses: true,
    watch: [
      {
        selector: 'a[href^="https://www.slumberland.com"]',
        callback: el => {
          el.setAttribute('href', el.getAttribute('href').replace(/.*www\.slumberland\.com/, ''))
        }
      },
      // Removing placeholder hero image
      // There will be no need for this kind of workarounds in production
      {
        selector: '#main .widget-component.image-widget>div>img[src]',
        callback: el => {
          setTimeout(() => {document.querySelector('.mw-home-hero').remove()}, 1000)
        }
      },
    ]
  })

  // if (window.location.pathname.indexOf('/content') !== 0) {
  //   lateLoadContent()
  // }

})
