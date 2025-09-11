// Airflow-inspired Task Node Component with Enhanced Interactivity
import { portfolioData } from '../data/portfolio-data.js'

export class TaskNode {
  constructor(id, title, type, status = 'pending', description = '', position = { x: 0, y: 0 }, details = null) {
    this.id = id
    this.title = title
    this.type = type // 'education', 'experience', 'skills', 'projects', 'certifications'
    this.status = status // 'pending', 'running', 'success', 'failed'
    this.description = description
    this.position = position
    this.details = details // New property for detailed information
    this.dependencies = []
    this.element = null
    this.isExpanded = false
    this.animationDuration = 300
  }

  addDependency(taskId) {
    this.dependencies.push(taskId)
  }

  render(x = this.position.x, y = this.position.y) {
    const node = document.createElement('div')
    node.className = `task-node task-${this.type} status-${this.status}`
    node.id = `task-${this.id}`
    node.style.left = `${x}px`
    node.style.top = `${y}px`
    node.style.transform = 'scale(0)'
    node.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`

    node.innerHTML = `
      <div class="task-header">
        <span class="task-icon">${this.getIcon()}</span>
        <span class="task-title">${this.title}</span>
        <span class="task-expand-btn ${this.isExpanded ? 'expanded' : ''}" aria-label="Expand task">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 3l4 5H4l4-5z" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <div class="task-status">
        <span class="status-indicator"></span>
        <span class="status-text">${this.getStatusText()}</span>
      </div>
      ${this.description ? `<div class="task-description">${this.description}</div>` : ''}
      <div class="task-details ${this.isExpanded ? 'expanded' : 'collapsed'}">
        ${this.renderDetails()}
      </div>
      <div class="task-actions">
        <button class="action-btn view-btn" title="View Details">
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path d="M8 2C4.5 2 1.8 4.1 1 8c.8 3.9 3.5 6 7 6s6.2-2.1 7-6c-.8-3.9-3.5-6-7-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
          </svg>
        </button>
        <button class="action-btn logs-btn" title="View Logs">
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h8v2H2v-2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    `

    // Add event listeners
    this.addEventListeners(node)
    
    this.element = node
    
    // Animate in
    setTimeout(() => {
      node.style.transform = 'scale(1)'
    }, 50)
    
    return node
  }

  addEventListeners(node) {
    // Main click handler
    node.addEventListener('click', (e) => {
      if (!e.target.closest('.action-btn') && !e.target.closest('.task-expand-btn')) {
        this.onClick()
      }
    })

    // Expand/collapse handler
    const expandBtn = node.querySelector('.task-expand-btn')
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.toggleExpand()
    })

    // Action button handlers
    const viewBtn = node.querySelector('.view-btn')
    const logsBtn = node.querySelector('.logs-btn')
    
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showDetailedView()
    })
    
    logsBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showLogs()
    })

    // Hover effects
    node.addEventListener('mouseenter', () => this.onHover())
    node.addEventListener('mouseleave', () => this.onHoverEnd())
  }

  getIcon() {
    const icons = {
      education: '🎓',
      experience: '💼',
      skills: '⚡',
      projects: '🚀',
      certifications: '🏆'
    }
    return icons[this.type] || '📋'
  }

  getStatusText() {
    const statusTexts = {
      pending: 'Pending',
      running: 'In Progress',
      success: 'Completed',
      failed: 'Failed'
    }
    return statusTexts[this.status] || this.status
  }

  renderDetails() {
    const data = this.getPortfolioData()
    if (!data) return '<p>No details available</p>'

    switch (this.type) {
      case 'education':
        return this.renderEducationDetails(data)
      case 'experience':
        return this.renderExperienceDetails(data)
      case 'skills':
        return this.renderSkillsDetails(data)
      case 'projects':
        return this.renderProjectsDetails(data)
      case 'certifications':
        return this.renderCertificationsDetails(data)
      default:
        return '<p>Details not available</p>'
    }
  }

  renderEducationDetails(education) {
    return education.map(edu => `
      <div class="detail-item">
        <h4>${edu.institution}</h4>
        <p><strong>${edu.degree}</strong> in ${edu.field}</p>
        <p><em>${edu.year}</em> | GPA: ${edu.gpa || 'N/A'}</p>
      </div>
    `).join('')
  }

  renderExperienceDetails(experience) {
    return experience.slice(0, 2).map(exp => `
      <div class="detail-item">
        <h4>${exp.company}</h4>
        <p><strong>${exp.position}</strong></p>
        <p><em>${exp.duration}</em></p>
        <p class="tech-stack">${exp.technologies.slice(0, 3).join(', ')}${exp.technologies.length > 3 ? '...' : ''}</p>
      </div>
    `).join('')
  }

  renderSkillsDetails(skills) {
    return Object.entries(skills).slice(0, 3).map(([key, skill]) => `
      <div class="detail-item">
        <h4>${skill.category}</h4>
        <div class="skill-bar">
          <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
        </div>
        <p class="skill-items">${skill.items.slice(0, 3).join(', ')}${skill.items.length > 3 ? '...' : ''}</p>
      </div>
    `).join('')
  }

  renderProjectsDetails(projects) {
    return projects.slice(0, 2).map(project => `
      <div class="detail-item">
        <h4>${project.title}</h4>
        <p>${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
        <p class="tech-stack">${project.technologies.slice(0, 3).join(', ')}</p>
      </div>
    `).join('')
  }

  renderCertificationsDetails(certifications) {
    return certifications.map(cert => `
      <div class="detail-item">
        <h4>${cert.name}</h4>
        <p><strong>${cert.issuer}</strong></p>
        <p><em>${cert.year}</em></p>
      </div>
    `).join('')
  }

  getPortfolioData() {
    switch (this.type) {
      case 'education':
        return portfolioData.education
      case 'experience':
        return portfolioData.experience
      case 'skills':
        return portfolioData.skills
      case 'projects':
        return portfolioData.projects
      case 'certifications':
        return portfolioData.certifications
      default:
        return null
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded
    
    if (!this.element) return
    
    const details = this.element.querySelector('.task-details')
    const expandBtn = this.element.querySelector('.task-expand-btn')
    
    if (details) {
      if (this.isExpanded) {
        details.classList.remove('collapsed')
        details.classList.add('expanded')
      } else {
        details.classList.remove('expanded')
        details.classList.add('collapsed')
      }
    }
    
    if (expandBtn) {
      if (this.isExpanded) {
        expandBtn.classList.add('expanded')
      } else {
        expandBtn.classList.remove('expanded')
      }
    }
  }

  onClick() {
    console.log(`Task ${this.id} clicked:`, this)
    // Show alert for tests and debugging
    alert(`Task: ${this.title}\nType: ${this.type}\nStatus: ${this.status}`)
    this.toggleExpand()
    this.highlightDependencies()
  }

  highlightDependencies() {
    // Remove existing highlights
    document.querySelectorAll('.task-node.highlighted').forEach(node => {
      node.classList.remove('highlighted')
    })

    // Highlight this node and its dependencies
    this.element.classList.add('highlighted')
    this.dependencies.forEach(depId => {
      const depNode = document.querySelector(`#task-${depId}`)
      if (depNode) {
        depNode.classList.add('highlighted')
      }
    })

    // Remove highlights after 3 seconds
    setTimeout(() => {
      document.querySelectorAll('.task-node.highlighted').forEach(node => {
        node.classList.remove('highlighted')
      })
    }, 3000)
  }

  onHover() {
    this.element.style.transform = 'scale(1.05)'
    this.element.style.zIndex = '1000'
  }

  onHoverEnd() {
    this.element.style.transform = 'scale(1)'
    this.element.style.zIndex = 'auto'
  }

  showDetailedView() {
    const modal = this.createModal()
    document.body.appendChild(modal)
    
    // Animate modal in
    setTimeout(() => {
      modal.classList.add('show')
    }, 10)
  }

  createModal() {
    const modal = document.createElement('div')
    modal.className = 'task-modal'
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${this.getIcon()} ${this.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="task-info">
            <p><strong>Type:</strong> ${this.type}</p>
            <p><strong>Status:</strong> ${this.getStatusText()}</p>
            <p><strong>Dependencies:</strong> ${this.dependencies.length > 0 ? this.dependencies.join(', ') : 'None'}</p>
          </div>
          <div class="task-content">
            ${this.renderFullDetails()}
          </div>
        </div>
      </div>
    `

    // Add close functionality
    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal))
    modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal(modal))
    
    return modal
  }

  renderFullDetails() {
    const data = this.getPortfolioData()
    if (!data) return '<p>No details available</p>'

    switch (this.type) {
      case 'education':
        return data.map(edu => `
          <div class="full-detail-item">
            <h3>${edu.institution}</h3>
            <p><strong>${edu.degree}</strong> in ${edu.field}</p>
            <p><em>${edu.year}</em> | GPA: ${edu.gpa || 'N/A'}</p>
            <p>${edu.details}</p>
          </div>
        `).join('')
      case 'experience':
        return data.map(exp => `
          <div class="full-detail-item">
            <h3>${exp.company}</h3>
            <p><strong>${exp.position}</strong> | <em>${exp.duration}</em></p>
            <h4>Responsibilities:</h4>
            <ul>${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}</ul>
            <h4>Technologies:</h4>
            <div class="tech-tags">${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>
          </div>
        `).join('')
      case 'skills':
        return Object.entries(data).map(([key, skill]) => `
          <div class="full-detail-item">
            <h3>${skill.category}</h3>
            <div class="skill-bar-full">
              <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
              <span class="skill-percentage">${skill.proficiency}%</span>
            </div>
            <div class="skill-items-full">${skill.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}</div>
          </div>
        `).join('')
      case 'projects':
        return data.map(project => `
          <div class="full-detail-item">
            <h3>${project.title}</h3>
            ${project.company ? `<p><strong>Company:</strong> ${project.company}</p>` : ''}
            <p>${project.description}</p>
            <h4>Key Highlights:</h4>
            <ul>${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>
            <h4>Technologies:</h4>
            <div class="tech-tags">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>
          </div>
        `).join('')
      case 'certifications':
        return data.map(cert => `
          <div class="full-detail-item">
            <h3>${cert.name}</h3>
            <p><strong>Issuer:</strong> ${cert.issuer}</p>
            <p><strong>Year:</strong> ${cert.year}</p>
          </div>
        `).join('')
      default:
        return '<p>Details not available</p>'
    }
  }

  closeModal(modal) {
    modal.classList.remove('show')
    setTimeout(() => {
      document.body.removeChild(modal)
    }, 300)
  }

  showLogs() {
    const logData = this.generateLogData()
    const modal = document.createElement('div')
    modal.className = 'task-modal logs-modal'
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>📊 Task Logs: ${this.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="logs-container">
            ${logData.map(log => `
              <div class="log-entry log-${log.level}">
                <span class="log-time">${log.time}</span>
                <span class="log-level">[${log.level.toUpperCase()}]</span>
                <span class="log-message">${log.message}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `

    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal))
    modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal(modal))
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  generateLogData() {
    const now = new Date()
    const logs = [
      { time: this.formatTime(new Date(now - 5000)), level: 'info', message: `Task ${this.id} initialized successfully` },
      { time: this.formatTime(new Date(now - 3000)), level: 'info', message: `Dependencies checked: ${this.dependencies.join(', ') || 'none'}` },
      { time: this.formatTime(new Date(now - 1000)), level: 'success', message: `Task ${this.id} execution completed` },
      { time: this.formatTime(now), level: 'info', message: `Status: ${this.status}` }
    ]
    
    if (this.status === 'failed') {
      logs.push({ time: this.formatTime(now), level: 'error', message: 'Task execution failed - check configuration' })
    }
    
    return logs
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  updateStatus(newStatus) {
    this.status = newStatus
    if (this.element) {
      this.element.className = `task-node task-${this.type} status-${newStatus}`
      const statusTextEl = this.element.querySelector('.status-text')
      if (statusTextEl) {
        statusTextEl.textContent = this.getStatusText()
      }
    }
  }

  // Animation methods
  pulse() {
    if (this.element) {
      this.element.style.animation = 'pulse 1s ease-in-out'
      setTimeout(() => {
        this.element.style.animation = ''
      }, 1000)
    }
  }

  shake() {
    if (this.element) {
      this.element.style.animation = 'shake 0.5s ease-in-out'
      setTimeout(() => {
        this.element.style.animation = ''
      }, 500)
    }
  }
}
