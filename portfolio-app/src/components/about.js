export function createAbout() {
  const aboutSection = document.createElement('section')
  aboutSection.classList.add('about')

  const heading = document.createElement('h2')
  heading.textContent = 'About Me'

  const paragraph = document.createElement('p')
  paragraph.textContent =
    'This is the about section where you can provide information about yourself or your organization.'

  aboutSection.appendChild(heading)
  aboutSection.appendChild(paragraph)

  return aboutSection
}
