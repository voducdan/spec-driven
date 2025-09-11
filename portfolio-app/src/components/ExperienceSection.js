// Airflow-inspired Experience Section Component
import { portfolioData } from '../data/portfolio-data.js'

export class ExperienceSection {
  constructor() {
    this.data = portfolioData.experience
    this.element = null
    this.taskStatus = 'running' // Current job is ongoing
  }

  render() {
    const section = document.createElement('section')
    section.className = 'portfolio-section experience-section'
    section.id = 'experience'

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title-row">
          <h2 class="section-title">
            <span class="section-icon">💼</span>
            Professional Experience
            <span class="task-status-badge status-${this.taskStatus}">
              <span class="status-indicator"></span>
              ${this.taskStatus === 'running' ? 'In Progress' : 'Completed'}
            </span>
          </h2>
          <div class="section-controls">
            <button class="section-btn" data-action="expand">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 8l5 5 5-5H3z" fill="currentColor"/>
              </svg>
            </button>
            <button class="section-btn" data-action="logs">📊</button>
            <button class="section-btn" data-action="timeline">⏰</button>
          </div>
        </div>
        <div class="section-meta">
          <span class="execution-time">Total Experience: 3+ years</span>
          <span class="dependency-info">Dependencies: Education</span>
        </div>
      </div>

      <div class="section-content">
        <div class="experience-timeline">
          ${this.renderExperienceItems()}
        </div>
        
        <div class="section-stats">
          <div class="stat-item">
            <span class="stat-label">Companies</span>
            <span class="stat-value">${this.data.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Current Role</span>
            <span class="stat-value">Data Engineer</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tech Stack</span>
            <span class="stat-value">${this.getTechCount()}+ Technologies</span>
          </div>
        </div>

        <div class="experience-timeline-view" style="display: none;">
          ${this.renderTimelineView()}
        </div>

        <div class="task-logs" style="display: none;">
          <h4>Experience Task Logs</h4>
          <div class="log-entries">
            ${this.renderLogEntries()}
          </div>
        </div>
      </div>
    `

    this.addEventListeners(section)
    this.element = section
    return section
  }

  renderExperienceItems() {
    return this.data.map((exp, index) => `
      <div class="experience-item ${exp.id === 'exp-1' ? 'current' : ''}">
        <div class="experience-header">
          <div class="company-info">
            <h3 class="company">${exp.company}</h3>
            <span class="position">${exp.position}</span>
          </div>
          <div class="duration-info">
            <span class="duration">${exp.duration}</span>
            <span class="status-indicator ${exp.status}"></span>
          </div>
        </div>
        
        <div class="experience-details">
          <div class="responsibilities">
            <h4>Key Responsibilities:</h4>
            <ul>
              ${exp.responsibilities.slice(0, 3).map(resp => `<li>${resp}</li>`).join('')}
              ${exp.responsibilities.length > 3 ? `<li><em>+${exp.responsibilities.length - 3} more...</em></li>` : ''}
            </ul>
          </div>
          
          <div class="technologies">
            <h4>Technologies Used:</h4>
            <div class="tech-stack">
              ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="experience-actions">
          <button class="action-btn" onclick="this.closest('.experience-section').experienceSection.showFullDetails('${exp.id}')">
            View Details
          </button>
          <button class="action-btn" onclick="this.closest('.experience-section').experienceSection.showAchievements('${exp.id}')">
            Achievements
          </button>
        </div>
      </div>
    `).join('')
  }

  renderTimelineView() {
    const timelineData = this.data.map(exp => {
      const startDate = this.parseDate(exp.duration.split(' - ')[0])
      const endDate = exp.duration.includes('Present') ? new Date() : this.parseDate(exp.duration.split(' - ')[1])
      return { ...exp, startDate, endDate }
    }).sort((a, b) => a.startDate - b.startDate)

    return `
      <div class="timeline-container">
        <h4>Career Timeline</h4>
        <div class="timeline">
          ${timelineData.map(exp => `
            <div class="timeline-item">
              <div class="timeline-date">${exp.duration}</div>
              <div class="timeline-content">
                <h5>${exp.company}</h5>
                <p>${exp.position}</p>
                <div class="timeline-tech">${exp.technologies.slice(0, 3).join(', ')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderLogEntries() {
    const logs = []
    this.data.forEach(exp => {
      logs.push({
        time: this.parseDate(exp.duration.split(' - ')[0]),
        level: 'info',
        message: `Started position as ${exp.position} at ${exp.company}`
      })
      
      if (!exp.duration.includes('Present')) {
        logs.push({
          time: this.parseDate(exp.duration.split(' - ')[1]),
          level: 'success',
          message: `Completed tenure at ${exp.company}`
        })
      }
    })

    return logs.sort((a, b) => b.time - a.time).map(log => `
      <div class="log-entry log-${log.level}">
        <span class="log-time">${this.formatLogTime(log.time)}</span>
        <span class="log-level">[${log.level.toUpperCase()}]</span>
        <span class="log-message">${log.message}</span>
      </div>
    `).join('')
  }

  getTechCount() {
    const allTech = new Set()
    this.data.forEach(exp => {
      exp.technologies.forEach(tech => allTech.add(tech))
    })
    return allTech.size
  }

  addEventListeners(section) {
    // Store reference for button callbacks
    section.experienceSection = this

    // Expand/collapse functionality
    const expandBtn = section.querySelector('[data-action="expand"]')
    expandBtn.addEventListener('click', () => this.toggleExpand())

    // Logs functionality
    const logsBtn = section.querySelector('[data-action="logs"]')
    logsBtn.addEventListener('click', () => this.toggleLogs())

    // Timeline functionality
    const timelineBtn = section.querySelector('[data-action="timeline"]')
    timelineBtn.addEventListener('click', () => this.toggleTimeline())

    // Section interaction
    section.addEventListener('click', (e) => {
      if (!e.target.closest('.section-controls') && !e.target.closest('.action-btn')) {
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
    const timeline = this.element.querySelector('.experience-timeline-view')
    
    // Hide timeline if showing
    timeline.style.display = 'none'
    
    const isVisible = logs.style.display !== 'none'
    logs.style.display = isVisible ? 'none' : 'block'
  }

  toggleTimeline() {
    const timeline = this.element.querySelector('.experience-timeline-view')
    const logs = this.element.querySelector('.task-logs')
    
    // Hide logs if showing
    logs.style.display = 'none'
    
    const isVisible = timeline.style.display !== 'none'
    timeline.style.display = isVisible ? 'none' : 'block'
  }

  showFullDetails(expId) {
    const exp = this.data.find(e => e.id === expId)
    if (!exp) return

    const modal = this.createModal('Experience Details', `
      <div class="experience-modal-content">
        <h3>${exp.company} - ${exp.position}</h3>
        <p><strong>Duration:</strong> ${exp.duration}</p>
        
        <h4>All Responsibilities:</h4>
        <ul>
          ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
        </ul>
        
        <h4>Technologies & Tools:</h4>
        <div class="tech-grid">
          ${exp.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  showAchievements(expId) {
    const exp = this.data.find(e => e.id === expId)
    if (!exp) return

    // Generate some achievements based on the company
    const achievements = this.generateAchievements(exp)
    
    const modal = this.createModal('Key Achievements', `
      <div class="achievements-content">
        <h3>${exp.company} Achievements</h3>
        <ul class="achievements-list">
          ${achievements.map(achievement => `
            <li class="achievement-item">
              <span class="achievement-icon">🏆</span>
              ${achievement}
            </li>
          `).join('')}
        </ul>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  generateAchievements(exp) {
    const achievements = {
      'MoMo': [
        'Scaled Airflow platform to handle 3,000+ DAGs with P90 latency < 15 seconds',
        'Increased report update frequency from daily to 5-minute intervals',
        'Implemented lakehouse architecture reducing data processing costs by 30%',
        'Led infrastructure-as-code initiatives improving deployment efficiency'
      ],
      'Amanotes': [
        'Designed scalable data models for gaming event analytics',
        'Implemented automated data pipeline for partner integration',
        'Optimized DBT transformations reducing processing time by 40%'
      ],
      'FPT Software': [
        'Built robust ETL pipelines for large-scale data warehouse',
        'Contributed to data infrastructure design and optimization',
        'Mentored junior developers on data engineering best practices'
      ],
      'Asia Commercial Bank (ACB)': [
        'Implemented data lineage tracking system',
        'Optimized data crawling processes for analytical systems',
        'Maintained critical data infrastructure with 99.9% uptime'
      ]
    }
    
    return achievements[exp.company] || ['Contributed to data engineering initiatives']
  }

  createModal(title, content) {
    const modal = document.createElement('div')
    modal.className = 'experience-modal'
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `

    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal))
    modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal(modal))
    
    return modal
  }

  closeModal(modal) {
    modal.classList.remove('show')
    setTimeout(() => {
      document.body.removeChild(modal)
    }, 300)
  }

  onSectionClick() {
    this.element.classList.add('highlighted')
    
    this.element.dispatchEvent(new CustomEvent('sectionSelected', {
      detail: { 
        section: 'experience', 
        status: this.taskStatus,
        data: this.data 
      }
    }))

    setTimeout(() => {
      this.element.classList.remove('highlighted')
    }, 2000)
  }

  parseDate(dateStr) {
    // Handle various date formats
    const cleaned = dateStr.trim()
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/')
      return new Date(parseInt(parts[1]) + 2000, parseInt(parts[0]) - 1)
    }
    return new Date()
  }

  formatLogTime(date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

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
    badge.querySelector('span:last-child').textContent = 
      newStatus === 'running' ? 'In Progress' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
  }
}
