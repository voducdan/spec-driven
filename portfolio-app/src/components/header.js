function createHeader() {
  const header = document.createElement('header')
  header.classList.add('header')

  const nav = document.createElement('nav')
  const ul = document.createElement('ul')

  const links = ['Home', 'About', 'Projects', 'Contact']
  links.forEach(link => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = `#${link.toLowerCase()}`
    a.textContent = link
    li.appendChild(a)
    ul.appendChild(li)
  })

  nav.appendChild(ul)
  header.appendChild(nav)

  return header
}

export { createHeader }
