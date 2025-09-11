export function createProjects(projects) {
  const projectsSection = document.createElement('section')
  projectsSection.classList.add('projects')

  const title = document.createElement('h2')
  title.textContent = 'Projects'
  projectsSection.appendChild(title)

  const projectsList = document.createElement('ul')

  projects.forEach(project => {
    const projectItem = document.createElement('li')
    const projectTitle = document.createElement('h3')
    projectTitle.textContent = project.title

    const projectDescription = document.createElement('p')
    projectDescription.textContent = project.description

    const projectLink = document.createElement('a')
    projectLink.href = project.link
    projectLink.textContent = 'View Project'
    projectLink.target = '_blank'

    projectItem.appendChild(projectTitle)
    projectItem.appendChild(projectDescription)
    projectItem.appendChild(projectLink)
    projectsList.appendChild(projectItem)
  })

  projectsSection.appendChild(projectsList)
  return projectsSection
}
