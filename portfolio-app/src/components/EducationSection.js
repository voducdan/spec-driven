// Airflow-inspired Education Section Component
import { portfolioData } from '../data/portfolio-data.js'

export class EducationSection {
  constructor() {
    this.data = portfolioData.education
    this.element = null
    this.taskStatus = 'success' // This section is completed
  }

  render() {
    const section = document.createElement('section')
    section.className = 'portfolio-section education-section'
    section.id = 'education'

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title-row">
          <h2 class="section-title">
            <span class="section-icon">🎓</span>
            Education Foundation
            <span class="task-status-badge status-${this.taskStatus}">
              <span class="status-indicator"></span>
              Completed
            </span>
          </h2>
          <div class="section-controls">
            <button class="section-btn" data-action="expand">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 8l5 5 5-5H3z" fill="currentColor"/>
              </svg>
            </button>
            <button class="section-btn" data-action="logs">📊</button>
          </div>
        </div>
        <div class="section-meta">
          <span class="execution-time">Duration: 4 years 2 months</span>
          <span class="dependency-info">Dependencies: None</span>
        </div>
      </div>

      <div class="section-content">
        <div class="education-timeline">
          ${this.renderEducationItems()}
        </div>
        
        <div class="section-stats">
          <div class="stat-item">
            <span class="stat-label">GPA</span>
            <span class="stat-value">7.3/10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Duration</span>
            <span class="stat-value">4+ years</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Field</span>
            <span class="stat-value">Information Technology</span>
          </div>
        </div>

        <div class="task-logs" style="display: none;">
          <h4>Education Task Logs</h4>
          <div class="log-entries">
            <div class="log-entry log-info">
              <span class="log-time">2017-08-01 09:00:00</span>
              <span class="log-level">[INFO]</span>
              <span class="log-message">Started Bachelor's program at HCM University of Science</span>
            </div>
            <div class="log-entry log-success">
              <span class="log-time">2021-10-15 16:00:00</span>
              <span class="log-level">[SUCCESS]</span>
              <span class="log-message">Successfully completed Bachelor Information Technology with GPA 7.3/10</span>
            </div>
          </div>
        </div>
      </div>
    `

    this.addEventListeners(section)
    this.element = section
    return section
  }

  renderEducationItems() {
    return this.data.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <h3 class="institution">${edu.institution}</h3>
          <span class="duration">${edu.year}</span>
        </div>
        <div class="education-details">
          <p class="degree"><strong>${edu.degree}</strong></p>
          <p class="field">Field: ${edu.field}</p>
          <p class="gpa">GPA: ${edu.gpa}</p>
          <p class="description">${edu.details}</p>
        </div>
        <div class="education-status">
          <span class="status-indicator ${edu.status}"></span>
          <span class="status-text">${edu.status === 'success' ? 'Completed' : edu.status}</span>
        </div>
      </div>
    `).join('')
  }

  addEventListeners(section) {
    // Expand/collapse functionality
    const expandBtn = section.querySelector('[data-action="expand"]')
    expandBtn.addEventListener('click', () => this.toggleExpand())

    // Logs functionality
    const logsBtn = section.querySelector('[data-action="logs"]')
    logsBtn.addEventListener('click', () => this.toggleLogs())

    // Section interaction
    section.addEventListener('click', (e) => {
      if (!e.target.closest('.section-controls')) {
        this.onSectionClick()
      }
    })
  }

  toggleExpand() {
    const content = this.element.querySelector('.section-content')
    const isExpanded = content.style.display !== 'none'
    
    content.style.display = isExpanded ? 'none' : 'block'
    
    const expandBtn = this.element.querySelector('[data-action="expand"]')
    expandBtn.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
  }

  toggleLogs() {
    const logs = this.element.querySelector('.task-logs')
    const isVisible = logs.style.display !== 'none'
    
    logs.style.display = isVisible ? 'none' : 'block'
  }

  onSectionClick() {
    // Highlight the section temporarily
    this.element.classList.add('highlighted')
    
    // Dispatch custom event for DAG integration
    this.element.dispatchEvent(new CustomEvent('sectionSelected', {
      detail: { 
        section: 'education', 
        status: this.taskStatus,
        data: this.data 
      }
    }))

    setTimeout(() => {
      this.element.classList.remove('highlighted')
    }, 2000)
  }

  // Animation methods for DAG integration
  pulse() {
    if (this.element) {
      this.element.style.animation = 'pulse 1s ease-in-out'
      setTimeout(() => {
        this.element.style.animation = ''
      }, 1000)
    }
  }

  updateTaskStatus(newStatus) {
    this.taskStatus = newStatus
    const badge = this.element.querySelector('.task-status-badge')
    badge.className = `task-status-badge status-${newStatus}`
    badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
  }
}
