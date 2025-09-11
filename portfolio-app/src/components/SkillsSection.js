// Airflow-inspired Skills Section Component
import { portfolioData } from '../data/portfolio-data.js'

export class SkillsSection {
  constructor() {
    this.data = portfolioData.skills
    this.element = null
    this.taskStatus = 'success'
    this.activeCategory = null
  }

  render() {
    const section = document.createElement('section')
    section.className = 'portfolio-section skills-section'
    section.id = 'skills'

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title-row">
          <h2 class="section-title">
            <span class="section-icon">⚡</span>
            Technical Skills
            <span class="task-status-badge status-${this.taskStatus}">
              <span class="status-indicator"></span>
              Mastered
            </span>
          </h2>
          <div class="section-controls">
            <button class="section-btn" data-action="expand">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 8l5 5 5-5H3z" fill="currentColor"/>
              </svg>
            </button>
            <button class="section-btn" data-action="matrix">🔲</button>
            <button class="section-btn" data-action="proficiency">📊</button>
          </div>
        </div>
        <div class="section-meta">
          <span class="execution-time">Average Proficiency: ${this.getAverageProficiency()}%</span>
          <span class="dependency-info">Dependencies: Education, Experience</span>
        </div>
      </div>

      <div class="section-content">
        <div class="skills-overview">
          ${this.renderSkillsOverview()}
        </div>
        
        <div class="skills-detailed">
          ${this.renderSkillCategories()}
        </div>

        <div class="skills-matrix" style="display: none;">
          ${this.renderSkillsMatrix()}
        </div>

        <div class="proficiency-chart" style="display: none;">
          ${this.renderProficiencyChart()}
        </div>
        
        <div class="section-stats">
          <div class="stat-item">
            <span class="stat-label">Categories</span>
            <span class="stat-value">${Object.keys(this.data).length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Skills</span>
            <span class="stat-value">${this.getTotalSkills()}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Expert Level</span>
            <span class="stat-value">${this.getExpertCount()}</span>
          </div>
        </div>
      </div>
    `

    this.addEventListeners(section)
    this.element = section
    return section
  }

  renderSkillsOverview() {
    return `
      <div class="skills-summary">
        <h3>Skills Portfolio Summary</h3>
        <div class="skills-grid">
          ${Object.entries(this.data).map(([key, skill]) => `
            <div class="skill-category-card" data-category="${key}">
              <div class="card-header">
                <h4>${skill.category}</h4>
                <span class="proficiency-badge proficiency-${this.getProficiencyLevel(skill.proficiency)}">
                  ${skill.proficiency}%
                </span>
              </div>
              <div class="skill-preview">
                ${skill.items.slice(0, 3).map(item => `
                  <span class="skill-tag">${item}</span>
                `).join('')}
                ${skill.items.length > 3 ? `<span class="more-count">+${skill.items.length - 3}</span>` : ''}
              </div>
              <div class="skill-progress-bar">
                <div class="progress-fill" style="width: ${skill.proficiency}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderSkillCategories() {
    return Object.entries(this.data).map(([key, skill]) => `
      <div class="skill-category" data-category="${key}">
        <div class="category-header">
          <h4>${skill.category}</h4>
          <div class="category-meta">
            <span class="proficiency-score">${skill.proficiency}% Proficiency</span>
            <span class="status-indicator ${skill.status}"></span>
          </div>
        </div>
        
        <div class="category-content">
          <div class="skills-list">
            ${skill.items.map((item, index) => `
              <div class="skill-item" style="animation-delay: ${index * 100}ms">
                <span class="skill-name">${item}</span>
                <div class="skill-level">
                  <div class="level-bars">
                    ${this.renderSkillLevel(this.getIndividualSkillLevel(item))}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="category-actions">
            <button class="action-btn" onclick="this.closest('.skills-section').skillsSection.showSkillDetails('${key}')">
              View Details
            </button>
            <button class="action-btn" onclick="this.closest('.skills-section').skillsSection.showSkillProjects('${key}')">
              Related Projects
            </button>
          </div>
        </div>
      </div>
    `).join('')
  }

  renderSkillsMatrix() {
    const categories = Object.keys(this.data)
    const skills = Object.values(this.data).flatMap(cat => cat.items)
    
    return `
      <div class="matrix-container">
        <h3>Skills Interaction Matrix</h3>
        <div class="matrix-grid">
          <div class="matrix-header">
            <div class="matrix-cell header-cell"></div>
            ${categories.map(cat => `
              <div class="matrix-cell header-cell">${cat}</div>
            `).join('')}
          </div>
          ${categories.map(rowCat => `
            <div class="matrix-row">
              <div class="matrix-cell row-header">${rowCat}</div>
              ${categories.map(colCat => `
                <div class="matrix-cell data-cell ${this.getMatrixRelation(rowCat, colCat)}">
                  ${this.getMatrixValue(rowCat, colCat)}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderProficiencyChart() {
    const maxProficiency = Math.max(...Object.values(this.data).map(s => s.proficiency))
    
    return `
      <div class="chart-container">
        <h3>Proficiency Levels</h3>
        <div class="bar-chart">
          ${Object.entries(this.data).map(([key, skill]) => `
            <div class="chart-bar">
              <div class="bar-container">
                <div class="bar-fill" style="height: ${(skill.proficiency / maxProficiency) * 100}%">
                  <span class="bar-value">${skill.proficiency}%</span>
                </div>
              </div>
              <div class="bar-label">${skill.category.split(' ')[0]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderSkillLevel(level) {
    return Array.from({length: 5}, (_, i) => 
      `<div class="level-bar ${i < level ? 'filled' : ''}"></div>`
    ).join('')
  }

  getIndividualSkillLevel(skillName) {
    // Assign skill levels based on knowledge (this could be data-driven)
    const expertSkills = ['Python', 'Apache Airflow', 'GCP', 'Kubernetes', 'Docker', 'ClickHouse']
    const advancedSkills = ['Apache Spark', 'SQL', 'Data Modeling', 'Git', 'Linux']
    
    if (expertSkills.includes(skillName)) return 5
    if (advancedSkills.includes(skillName)) return 4
    return 3 // Default to intermediate
  }

  addEventListeners(section) {
    section.skillsSection = this

    // Control buttons
    const expandBtn = section.querySelector('[data-action="expand"]')
    const matrixBtn = section.querySelector('[data-action="matrix"]')
    const proficiencyBtn = section.querySelector('[data-action="proficiency"]')

    expandBtn.addEventListener('click', () => this.toggleExpand())
    matrixBtn.addEventListener('click', () => this.toggleMatrix())
    proficiencyBtn.addEventListener('click', () => this.toggleProficiencyChart())

    // Skill category interactions
    section.querySelectorAll('.skill-category-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category
        this.selectCategory(category)
      })
    })

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

  toggleMatrix() {
    const matrix = this.element.querySelector('.skills-matrix')
    const detailed = this.element.querySelector('.skills-detailed')
    const chart = this.element.querySelector('.proficiency-chart')
    
    chart.style.display = 'none'
    detailed.style.display = 'none'
    
    const isVisible = matrix.style.display !== 'none'
    matrix.style.display = isVisible ? 'none' : 'block'
    if (!isVisible) detailed.style.display = 'block'
  }

  toggleProficiencyChart() {
    const chart = this.element.querySelector('.proficiency-chart')
    const detailed = this.element.querySelector('.skills-detailed')
    const matrix = this.element.querySelector('.skills-matrix')
    
    matrix.style.display = 'none'
    detailed.style.display = 'none'
    
    const isVisible = chart.style.display !== 'none'
    chart.style.display = isVisible ? 'none' : 'block'
    if (!isVisible) detailed.style.display = 'block'
  }

  selectCategory(category) {
    // Remove previous selections
    this.element.querySelectorAll('.skill-category-card.selected').forEach(card => {
      card.classList.remove('selected')
    })
    
    // Highlight selected category
    const selectedCard = this.element.querySelector(`[data-category="${category}"]`)
    selectedCard.classList.add('selected')
    
    this.activeCategory = category
    
    // Scroll to detailed view
    const detailedCategory = this.element.querySelector(`.skill-category[data-category="${category}"]`)
    detailedCategory.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Highlight the detailed category temporarily
    detailedCategory.classList.add('highlighted')
    setTimeout(() => detailedCategory.classList.remove('highlighted'), 2000)
  }

  showSkillDetails(categoryKey) {
    const skill = this.data[categoryKey]
    if (!skill) return

    const modal = this.createModal('Skill Category Details', `
      <div class="skill-details-content">
        <h3>${skill.category}</h3>
        <div class="proficiency-display">
          <div class="proficiency-circle">
            <div class="circle-progress" style="--progress: ${skill.proficiency}%">
              <span class="percentage">${skill.proficiency}%</span>
            </div>
          </div>
          <div class="proficiency-info">
            <p><strong>Proficiency Level:</strong> ${this.getProficiencyLabel(skill.proficiency)}</p>
            <p><strong>Status:</strong> ${skill.status}</p>
          </div>
        </div>
        
        <h4>All Skills in this Category:</h4>
        <div class="detailed-skills-grid">
          ${skill.items.map(item => `
            <div class="detailed-skill-item">
              <span class="skill-name">${item}</span>
              <div class="skill-experience">${this.getSkillExperience(item)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  showSkillProjects(categoryKey) {
    const skill = this.data[categoryKey]
    const relatedProjects = this.getRelatedProjects(skill.items)
    
    const modal = this.createModal('Related Projects', `
      <div class="related-projects-content">
        <h3>Projects using ${skill.category}</h3>
        <div class="projects-list">
          ${relatedProjects.map(project => `
            <div class="project-card">
              <h4>${project.title}</h4>
              <p>${project.description}</p>
              <div class="project-skills">
                ${project.technologies.filter(tech => 
                  skill.items.some(skillItem => 
                    skillItem.toLowerCase().includes(tech.toLowerCase()) ||
                    tech.toLowerCase().includes(skillItem.toLowerCase())
                  )
                ).map(tech => `<span class="tech-tag highlighted">${tech}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  getRelatedProjects(skillItems) {
    return portfolioData.projects.filter(project => 
      project.technologies.some(tech => 
        skillItems.some(skill => 
          skill.toLowerCase().includes(tech.toLowerCase()) ||
          tech.toLowerCase().includes(skill.toLowerCase())
        )
      )
    )
  }

  createModal(title, content) {
    const modal = document.createElement('div')
    modal.className = 'skills-modal'
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

  // Utility methods
  getAverageProficiency() {
    const values = Object.values(this.data).map(s => s.proficiency)
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }

  getTotalSkills() {
    return Object.values(this.data).reduce((total, skill) => total + skill.items.length, 0)
  }

  getExpertCount() {
    return Object.values(this.data).filter(skill => skill.proficiency >= 90).length
  }

  getProficiencyLevel(proficiency) {
    if (proficiency >= 90) return 'expert'
    if (proficiency >= 75) return 'advanced'
    if (proficiency >= 60) return 'intermediate'
    return 'beginner'
  }

  getProficiencyLabel(proficiency) {
    const level = this.getProficiencyLevel(proficiency)
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  getSkillExperience(skillName) {
    // This could be enhanced with actual experience data
    const expertSkills = ['Python', 'Apache Airflow', 'GCP']
    if (expertSkills.includes(skillName)) {
      return '3+ years'
    }
    return '2+ years'
  }

  getMatrixRelation(rowCat, colCat) {
    if (rowCat === colCat) return 'self'
    
    const synergies = {
      'technical-programming': 'high',
      'technical-dataTools': 'high',
      'programming-dataTools': 'medium',
      'cloud-technical': 'high',
      'databases-dataTools': 'high'
    }
    
    const key = `${rowCat}-${colCat}` 
    const reverseKey = `${colCat}-${rowCat}`
    
    return synergies[key] || synergies[reverseKey] || 'low'
  }

  getMatrixValue(rowCat, colCat) {
    if (rowCat === colCat) return '100%'
    
    const relation = this.getMatrixRelation(rowCat, colCat)
    const values = { high: '85%', medium: '60%', low: '30%' }
    
    return values[relation] || '30%'
  }

  onSectionClick() {
    this.element.classList.add('highlighted')
    
    this.element.dispatchEvent(new CustomEvent('sectionSelected', {
      detail: { 
        section: 'skills', 
        status: this.taskStatus,
        data: this.data 
      }
    }))

    setTimeout(() => {
      this.element.classList.remove('highlighted')
    }, 2000)
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
      newStatus === 'success' ? 'Mastered' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
  }
}
