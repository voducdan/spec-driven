export function createHero() {
  const heroSection = document.createElement('section')
  heroSection.classList.add('hero')

  const welcomeMessage = document.createElement('h1')
  welcomeMessage.textContent = 'Welcome to My Portfolio'

  const callToAction = document.createElement('p')
  callToAction.textContent = 'Discover my work and get in touch!'

  const actionButton = document.createElement('a')
  actionButton.href = '#contact'
  actionButton.textContent = 'Contact Me'
  actionButton.classList.add('btn')

  heroSection.appendChild(welcomeMessage)
  heroSection.appendChild(callToAction)
  heroSection.appendChild(actionButton)

  return heroSection
}
