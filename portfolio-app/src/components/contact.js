export function createContact() {
  const contactSection = document.createElement('section')
  contactSection.classList.add('contact')

  const contactHeading = document.createElement('h2')
  contactHeading.textContent = 'Contact Me'
  contactSection.appendChild(contactHeading)

  const contactForm = document.createElement('form')
  contactForm.setAttribute('action', '#')
  contactForm.setAttribute('method', 'POST')

  const nameLabel = document.createElement('label')
  nameLabel.setAttribute('for', 'name')
  nameLabel.textContent = 'Name:'
  contactForm.appendChild(nameLabel)

  const nameInput = document.createElement('input')
  nameInput.setAttribute('type', 'text')
  nameInput.setAttribute('id', 'name')
  nameInput.setAttribute('name', 'name')
  nameInput.setAttribute('required', true)
  contactForm.appendChild(nameInput)

  const emailLabel = document.createElement('label')
  emailLabel.setAttribute('for', 'email')
  emailLabel.textContent = 'Email:'
  contactForm.appendChild(emailLabel)

  const emailInput = document.createElement('input')
  emailInput.setAttribute('type', 'email')
  emailInput.setAttribute('id', 'email')
  emailInput.setAttribute('name', 'email')
  emailInput.setAttribute('required', true)
  contactForm.appendChild(emailInput)

  const messageLabel = document.createElement('label')
  messageLabel.setAttribute('for', 'message')
  messageLabel.textContent = 'Message:'
  contactForm.appendChild(messageLabel)

  const messageTextarea = document.createElement('textarea')
  messageTextarea.setAttribute('id', 'message')
  messageTextarea.setAttribute('name', 'message')
  messageTextarea.setAttribute('required', true)
  contactForm.appendChild(messageTextarea)

  const submitButton = document.createElement('button')
  submitButton.setAttribute('type', 'submit')
  submitButton.textContent = 'Send Message'
  contactForm.appendChild(submitButton)

  contactSection.appendChild(contactForm)
  return contactSection
}
