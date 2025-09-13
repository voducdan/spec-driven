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
    
    // Transform properties
    this.scale = 1
    this.hoverScale = 1
  }

  addDependency(taskId) {
    this.dependencies.push(taskId)
  }

  updatePosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.applyTransform();
  }

  render(x = this.position.x, y = this.position.y) {
    const node = document.createElement('div');
    node.className = `task-node task-${this.type} status-${this.status}`;
    node.id = `task-${this.id}`;
    node.dataset.id = this.id; // Add data-id for easier selection
    
    // Position is handled by transform. Set base position at 0,0.
    node.style.position = 'absolute';
    node.style.left = '0px';
    node.style.top = '0px';
    
    this.element = node;
    
    // Set initial position
    this.position.x = x;
    this.position.y = y;

    node.style.transformOrigin = 'top left';
    node.style.transition = `transform 0.1s ease-out`;

    node.innerHTML = `
      <div class="task-header">
        <span class="task-icon">${this.getIcon()}</span>
        <span class="task-title">${this.title}</span>
      </div>
      <div class="task-status">
        <span class="status-indicator"></span>
        <span class="status-text">${this.getStatusText()}</span>
      </div>
    `;

    // Add event listeners
    this.addEventListeners(node);
    
    this.element = node;
    
    // Apply initial transform
    this.applyTransform();
    
    return node;
  }

  addEventListeners(node) {
    // Main click handler for showing the modal
    node.addEventListener('click', (e) => {
      // e.stopPropagation();
      this.showDetailedView();
    });

    // Hover effects
    node.addEventListener('mouseenter', () => this.onHover());
    node.addEventListener('mouseleave', () => this.onHoverEnd());
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
    if (!this.details) return '<p>No details available for this task.</p>';

    let detailsHtml = `<h1>${this.title}</h1>`;

    if (this.details) {
      detailsHtml += '<h2>Details:</h2>';
      for (const [key, value] of Object.entries(this.details)) {
        if (Array.isArray(value)) {
          detailsHtml += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}:</h3><ul>`;
          value.forEach(item => {
            detailsHtml += `<li>${item}</li>`;
          });
          detailsHtml += '</ul>';
        } else if (typeof value === 'object' && value !== null) {
          detailsHtml += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}:</h3>`;
          for (const [subKey, subValue] of Object.entries(value)) {
            detailsHtml += `<p><strong>${subKey}:</strong> ${subValue}</p>`;
          }
        } else {
          detailsHtml += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`;
        }
      }
    }
    
    return detailsHtml;
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
    this.hoverScale = 1.05
    this.applyTransform()
    this.element.style.zIndex = '1000'
  }

  onHoverEnd() {
    this.hoverScale = 1
    this.applyTransform()
  }

  setScale(scale) {
    this.scale = scale
    this.applyTransform()
  }

  applyTransform() {
    if (this.element) {
      const finalScale = this.scale * this.hoverScale;
      const x = this.position?.x || 0;
      const y = this.position?.y || 0;
      // Set transform origin to top-left to prevent position shifts during scaling
      this.element.style.transformOrigin = 'top left';
      // Combine position and scale transforms
      this.element.style.transform = `translate(${x}px, ${y}px) scale(${finalScale})`;
    }
  }

  showDetailedView() {
    const modal = document.createElement('div');
    modal.className = 'task-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'task-modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-button';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    };
    
    modalContent.innerHTML = this.renderDetails();
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Trigger the show animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);

    // Close modal on outside click
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300);
      }
    };
  }

  showLogs() {
    console.log(`--- Logs for ${this.title} ---`);
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
