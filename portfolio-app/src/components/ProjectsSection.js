// Airflow-inspired Projects Section Component
import { portfolioData } from '../data/portfolio-data.js'

export class ProjectsSection {
  constructor() {
    this.data = portfolioData.projects
    this.certifications = portfolioData.certifications
    this.element = null
    this.taskStatus = 'success'
    this.activeFilter = 'all'
    this.activeView = 'grid'
  }

  render() {
    const section = document.createElement('section')
    section.className = 'portfolio-section projects-section'
    section.id = 'projects'

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title-row">
          <h2 class="section-title">
            <span class="section-icon">🚀</span>
            Portfolio Projects & Certifications
            <span class="task-status-badge status-${this.taskStatus}">
              <span class="status-indicator"></span>
              Delivered
            </span>
          </h2>
          <div class="section-controls">
            <button class="section-btn" data-action="expand">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 8l5 5 5-5H3z" fill="currentColor"/>
              </svg>
            </button>
            <button class="section-btn" data-action="filter">🔍</button>
            <button class="section-btn" data-action="view">📋</button>
            <button class="section-btn" data-action="timeline">⏰</button>
          </div>
        </div>
        <div class="section-meta">
          <span class="execution-time">Portfolio: ${this.data.length} Projects + ${this.certifications.length} Certifications</span>
          <span class="dependency-info">Dependencies: Skills, Experience</span>
        </div>
      </div>

      <div class="section-content">
        <div class="projects-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="projects">Projects</button>
          <button class="filter-btn" data-filter="certifications">Certifications</button>
          <button class="filter-btn" data-filter="momo">MoMo</button>
          <button class="filter-btn" data-filter="airflow">Airflow</button>
        </div>

        <div class="view-toggle">
          <button class="view-btn active" data-view="grid">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" fill="currentColor"/>
              <rect x="9" y="1" width="6" height="6" fill="currentColor"/>
              <rect x="1" y="9" width="6" height="6" fill="currentColor"/>
              <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
            </svg>
            Grid
          </button>
          <button class="view-btn" data-view="list">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="3" width="12" height="2" fill="currentColor"/>
              <rect x="2" y="7" width="12" height="2" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="2" fill="currentColor"/>
            </svg>
            List
          </button>
          <button class="view-btn" data-view="pipeline">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <circle cx="3" cy="8" r="2" fill="currentColor"/>
              <circle cx="8" cy="8" r="2" fill="currentColor"/>
              <circle cx="13" cy="8" r="2" fill="currentColor"/>
              <line x1="5" y1="8" x2="6" y2="8" stroke="currentColor" stroke-width="2"/>
              <line x1="10" y1="8" x2="11" y2="8" stroke="currentColor" stroke-width="2"/>
            </svg>
            Pipeline
          </button>
        </div>

        <div class="projects-container">
          <div class="projects-grid ${this.activeView}">
            ${this.renderProjects()}
          </div>
          
          <div class="certifications-grid">
            ${this.renderCertifications()}
          </div>
        </div>

        <div class="projects-timeline" style="display: none;">
          ${this.renderProjectsTimeline()}
        </div>
        
        <div class="section-stats">
          <div class="stat-item">
            <span class="stat-label">Projects</span>
            <span class="stat-value">${this.data.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Technologies</span>
            <span class="stat-value">${this.getUniqueTechnologies().length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Certifications</span>
            <span class="stat-value">${this.certifications.length}</span>
          </div>
        </div>
      </div>
    `

    this.addEventListeners(section)
    this.element = section
    return section
  }

  renderProjects() {
    return this.data.map(project => `
      <div class="project-card" data-type="project" data-company="${project.company?.toLowerCase() || ''}" data-tech="${project.technologies.join(' ').toLowerCase()}">
        <div class="project-header">
          <div class="project-meta">
            <h3 class="project-title">${project.title}</h3>
            ${project.company ? `<span class="project-company">${project.company}</span>` : ''}
          </div>
          <div class="project-status">
            <span class="status-indicator ${project.status}"></span>
            <span class="status-text">${this.getStatusText(project.status)}</span>
          </div>
        </div>
        
        <div class="project-description">
          <p>${project.description}</p>
        </div>
        
        <div class="project-highlights">
          <h4>Key Achievements:</h4>
          <ul>
            ${project.highlights.slice(0, 2).map(highlight => `<li>${highlight}</li>`).join('')}
            ${project.highlights.length > 2 ? `<li><em>+${project.highlights.length - 2} more achievements</em></li>` : ''}
          </ul>
        </div>
        
        <div class="project-technologies">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <div class="project-actions">
          <button class="action-btn primary" onclick="this.closest('.projects-section').projectsSection.showProjectDetails('${project.id}')">
            View Details
          </button>
          <button class="action-btn" onclick="this.closest('.projects-section').projectsSection.showProjectArchitecture('${project.id}')">
            Architecture
          </button>
          <button class="action-btn" onclick="this.closest('.projects-section').projectsSection.runProjectDemo('${project.id}')">
            🚀 Demo
          </button>
        </div>
      </div>
    `).join('')
  }

  renderCertifications() {
    return `
      <div class="certifications-container" data-type="certifications">
        <h3 class="certifications-title">
          <span class="section-icon">🏆</span>
          Professional Certifications
        </h3>
        <div class="certifications-list">
          ${this.certifications.map(cert => `
            <div class="certification-card">
              <div class="cert-header">
                <h4 class="cert-name">${cert.name}</h4>
                <span class="cert-year">${cert.year}</span>
              </div>
              <div class="cert-issuer">
                <strong>${cert.issuer}</strong>
              </div>
              <div class="cert-status">
                <span class="status-indicator ${cert.status}"></span>
                <span class="status-text">Certified</span>
              </div>
              <div class="cert-actions">
                <button class="action-btn" onclick="this.closest('.projects-section').projectsSection.showCertDetails('${cert.id}')">
                  View Certificate
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderProjectsTimeline() {
    // Sort projects by company/timeline
    const timelineData = [...this.data].reverse()
    
    return `
      <div class="timeline-container">
        <h3>Project Development Timeline</h3>
        <div class="timeline">
          ${timelineData.map((project, index) => `
            <div class="timeline-item" style="animation-delay: ${index * 100}ms">
              <div class="timeline-marker">
                <span class="timeline-number">${index + 1}</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>${project.title}</h4>
                  ${project.company ? `<span class="timeline-company">${project.company}</span>` : ''}
                </div>
                <p class="timeline-description">${project.description.substring(0, 120)}...</p>
                <div class="timeline-tech">
                  ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag small">${tech}</span>`).join('')}
                </div>
                <div class="timeline-impact">
                  <strong>Impact:</strong> ${project.highlights[0]}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  addEventListeners(section) {
    section.projectsSection = this

    // Control buttons
    const expandBtn = section.querySelector('[data-action="expand"]')
    const filterBtn = section.querySelector('[data-action="filter"]')
    const viewBtn = section.querySelector('[data-action="view"]')
    const timelineBtn = section.querySelector('[data-action="timeline"]')

    expandBtn.addEventListener('click', () => this.toggleExpand())
    filterBtn.addEventListener('click', () => this.toggleFilterPanel())
    viewBtn.addEventListener('click', () => this.cycleView())
    timelineBtn.addEventListener('click', () => this.toggleTimeline())

    // Filter buttons
    section.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setFilter(btn.dataset.filter))
    })

    // View buttons
    section.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setView(btn.dataset.view))
    })

    // Section interaction
    section.addEventListener('click', (e) => {
      if (!e.target.closest('.section-controls') && !e.target.closest('.action-btn')) {
        this.onSectionClick()
      }
    })
  }

  setFilter(filter) {
    this.activeFilter = filter
    
    // Update filter button states
    this.element.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter)
    })
    
    // Filter project cards
    this.element.querySelectorAll('.project-card, .certifications-container').forEach(card => {
      const shouldShow = this.shouldShowItem(card, filter)
      card.style.display = shouldShow ? 'block' : 'none'
      
      if (shouldShow) {
        card.style.animation = 'fadeInUp 0.3s ease-out'
      }
    })
  }

  shouldShowItem(item, filter) {
    if (filter === 'all') return true
    
    const type = item.dataset.type
    if (filter === 'projects') return type === 'project'
    if (filter === 'certifications') return type === 'certifications'
    
    // Technology or company filters
    const company = item.dataset.company || ''
    const tech = item.dataset.tech || ''
    
    return company.includes(filter) || tech.includes(filter)
  }

  setView(view) {
    this.activeView = view
    
    // Update view button states
    this.element.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view)
    })
    
    // Update grid class
    const grid = this.element.querySelector('.projects-grid')
    grid.className = `projects-grid ${view}`
  }

  cycleView() {
    const views = ['grid', 'list', 'pipeline']
    const currentIndex = views.indexOf(this.activeView)
    const nextView = views[(currentIndex + 1) % views.length]
    this.setView(nextView)
  }

  toggleTimeline() {
    const timeline = this.element.querySelector('.projects-timeline')
    const container = this.element.querySelector('.projects-container')
    
    const isVisible = timeline.style.display !== 'none'
    
    timeline.style.display = isVisible ? 'none' : 'block'
    container.style.display = isVisible ? 'block' : 'none'
  }

  toggleFilterPanel() {
    const filters = this.element.querySelector('.projects-filters')
    filters.classList.toggle('expanded')
  }

  toggleExpand() {
    const content = this.element.querySelector('.section-content')
    const isExpanded = content.style.display !== 'none'
    
    content.style.display = isExpanded ? 'none' : 'block'
    
    const expandBtn = this.element.querySelector('[data-action="expand"]')
    expandBtn.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
  }

  showProjectDetails(projectId) {
    const project = this.data.find(p => p.id === projectId)
    if (!project) return

    const modal = this.createModal('Project Details', `
      <div class="project-details-content">
        <div class="project-header-modal">
          <h3>${project.title}</h3>
          ${project.company ? `<span class="company-badge">${project.company}</span>` : ''}
          <span class="status-badge status-${project.status}">${this.getStatusText(project.status)}</span>
        </div>
        
        <div class="project-description-full">
          <h4>Project Overview</h4>
          <p>${project.description}</p>
        </div>
        
        <div class="project-achievements">
          <h4>Key Achievements & Impact</h4>
          <ul>
            ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
          </ul>
        </div>
        
        <div class="project-tech-stack">
          <h4>Technology Stack</h4>
          <div class="tech-grid">
            ${project.technologies.map(tech => `
              <div class="tech-item">
                <span class="tech-name">${tech}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  showProjectArchitecture(projectId) {
    const project = this.data.find(p => p.id === projectId)
    if (!project) return

    const architecture = this.generateArchitectureDiagram(project)
    
    const modal = this.createModal('Project Architecture', `
      <div class="architecture-content">
        <h3>${project.title} - System Architecture</h3>
        <div class="architecture-diagram">
          ${architecture}
        </div>
        <div class="architecture-notes">
          <h4>Architecture Highlights</h4>
          <ul>
            ${this.getArchitectureNotes(project).map(note => `<li>${note}</li>`).join('')}
          </ul>
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  generateArchitectureDiagram(project) {
    // Generate a simple architecture diagram based on technologies
    const components = this.getArchitectureComponents(project)
    
    return `
      <div class="arch-diagram">
        ${components.map((component, index) => `
          <div class="arch-component" style="animation-delay: ${index * 200}ms">
            <div class="component-icon">${component.icon}</div>
            <div class="component-name">${component.name}</div>
            <div class="component-type">${component.type}</div>
          </div>
        `).join('')}
        <div class="arch-connections">
          ${this.generateConnections(components)}
        </div>
      </div>
    `
  }

  getArchitectureComponents(project) {
    const components = []
    
    if (project.technologies.includes('Kubernetes')) {
      components.push({ name: 'Kubernetes', type: 'Orchestration', icon: '☸️' })
    }
    if (project.technologies.includes('Apache Airflow')) {
      components.push({ name: 'Airflow', type: 'Workflow', icon: '🌊' })
    }
    if (project.technologies.includes('Apache Spark')) {
      components.push({ name: 'Spark', type: 'Processing', icon: '⚡' })
    }
    if (project.technologies.includes('ClickHouse')) {
      components.push({ name: 'ClickHouse', type: 'Database', icon: '🏠' })
    }
    if (project.technologies.includes('GCP')) {
      components.push({ name: 'Google Cloud', type: 'Cloud Platform', icon: '☁️' })
    }
    
    return components
  }

  generateConnections(components) {
    // Simple connection lines between components
    return components.map((_, index) => {
      if (index < components.length - 1) {
        return `<div class="connection-line" style="animation-delay: ${(index + components.length) * 200}ms"></div>`
      }
      return ''
    }).join('')
  }

  getArchitectureNotes(project) {
    const notes = {
      'proj-1': [
        'Kubernetes-native deployment with auto-scaling capabilities',
        'GitOps workflow for continuous deployment',
        'Advanced scheduling and resource management',
        'Multi-tenant architecture with isolated workloads'
      ],
      'proj-2': [
        'Event-driven architecture with Kubernetes operators',
        'Secure secret management and access control',
        'Horizontal scaling based on workload demands',
        'Real-time monitoring and alerting'
      ],
      'proj-3': [
        'Stream processing with low-latency requirements',
        'Data deduplication and consistency guarantees',
        'Materialized views for performance optimization',
        'Real-time analytics and dashboarding'
      ]
    }
    
    return notes[project.id] || ['Scalable and maintainable architecture', 'Cloud-native design principles']
  }

  runProjectDemo(projectId) {
    const project = this.data.find(p => p.id === projectId)
    if (!project) return

    // Simulate running a project demo
    const demoBtn = event.target
    demoBtn.textContent = '🚀 Running...'
    demoBtn.disabled = true
    
    setTimeout(() => {
      demoBtn.textContent = '✅ Demo Complete'
      this.showDemoResults(project)
      
      setTimeout(() => {
        demoBtn.textContent = '🚀 Demo'
        demoBtn.disabled = false
      }, 3000)
    }, 2000)
  }

  showDemoResults(project) {
    const modal = this.createModal('Demo Results', `
      <div class="demo-results">
        <h3>${project.title} - Demo Results</h3>
        <div class="demo-metrics">
          <div class="metric">
            <span class="metric-label">Execution Time</span>
            <span class="metric-value">${Math.random() * 5 + 1}s</span>
          </div>
          <div class="metric">
            <span class="metric-label">Success Rate</span>
            <span class="metric-value">100%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Performance</span>
            <span class="metric-value">Excellent</span>
          </div>
        </div>
        <div class="demo-logs">
          <h4>Demo Execution Log</h4>
          <div class="log-output">
            <div class="log-line">[INFO] Initializing ${project.title} demo...</div>
            <div class="log-line">[INFO] Loading project configuration...</div>
            <div class="log-line">[SUCCESS] Demo environment ready</div>
            <div class="log-line">[INFO] Executing main workflow...</div>
            <div class="log-line">[SUCCESS] ${project.highlights[0]}</div>
            <div class="log-line">[SUCCESS] Demo completed successfully</div>
          </div>
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  showCertDetails(certId) {
    const cert = this.certifications.find(c => c.id === certId)
    if (!cert) return

    const modal = this.createModal('Certification Details', `
      <div class="cert-details-content">
        <div class="cert-badge-large">
          <h3>${cert.name}</h3>
          <div class="cert-issuer-large">${cert.issuer}</div>
          <div class="cert-year-large">${cert.year}</div>
        </div>
        
        <div class="cert-info">
          <h4>Certification Overview</h4>
          <p>This certification validates expertise in ${cert.name.split(' ').slice(-2).join(' ')} technologies and best practices.</p>
          
          <h4>Skills Validated</h4>
          <ul>
            ${this.getCertificationSkills(cert).map(skill => `<li>${skill}</li>`).join('')}
          </ul>
        </div>
      </div>
    `)
    
    document.body.appendChild(modal)
    setTimeout(() => modal.classList.add('show'), 10)
  }

  getCertificationSkills(cert) {
    const skills = {
      'cert-1': [
        'ClickHouse database design and optimization',
        'Query performance tuning and indexing strategies',
        'Real-time analytics and aggregation pipelines',
        'Cluster management and scaling'
      ],
      'cert-2': [
        'Advanced SQL query optimization',
        'Complex joins and window functions',
        'Database performance analysis',
        'Data modeling and normalization'
      ],
      'cert-3': [
        'Google Cloud data engineering services',
        'BigQuery optimization and best practices',
        'Cloud storage and data lake architecture',
        'Serverless data processing with Cloud Functions'
      ]
    }
    
    return skills[cert.id] || ['Professional expertise in certified technology']
  }

  createModal(title, content) {
    const modal = document.createElement('div')
    modal.className = 'projects-modal'
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

  getStatusText(status) {
    const statusTexts = {
      success: 'Completed',
      running: 'In Progress',
      pending: 'Planned',
      failed: 'On Hold'
    }
    return statusTexts[status] || status
  }

  getUniqueTechnologies() {
    const allTech = new Set()
    this.data.forEach(project => {
      project.technologies.forEach(tech => allTech.add(tech))
    })
    return Array.from(allTech)
  }

  onSectionClick() {
    this.element.classList.add('highlighted')
    
    this.element.dispatchEvent(new CustomEvent('sectionSelected', {
      detail: { 
        section: 'projects', 
        status: this.taskStatus,
        data: { projects: this.data, certifications: this.certifications }
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
      newStatus === 'success' ? 'Delivered' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
  }
}
