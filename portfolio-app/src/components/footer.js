export function createFooter() {
  const footer = document.createElement('footer')
  footer.classList.add('footer')

  const copyright = document.createElement('p')
  copyright.textContent = '© 2023 Your Name. All rights reserved.'

  const socialLinks = document.createElement('div')
  socialLinks.classList.add('social-links')

  const githubLink = document.createElement('a')
  githubLink.href = 'https://github.com/yourusername'
  githubLink.textContent = 'GitHub'
  socialLinks.appendChild(githubLink)

  const linkedinLink = document.createElement('a')
  linkedinLink.href = 'https://linkedin.com/in/yourusername'
  linkedinLink.textContent = 'LinkedIn'
  socialLinks.appendChild(linkedinLink)

  footer.appendChild(copyright)
  footer.appendChild(socialLinks)

  return footer
}
