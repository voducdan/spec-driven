// Enhanced Airflow-inspired Task Group Component
import { TaskNode } from './TaskNode.js'

export class TaskGroup {
  constructor(id, title, tasks = [], collapsed = false) {
    this.id = id
    this.title = title
    this.tasks = Array.isArray(tasks) ? tasks : []
    this.isExpanded = !collapsed
    this.element = null
    this.animationDuration = 300
    this.taskNodes = []
  }

  addTask(task) {
    if (typeof task === 'string') {
      // If task is a string ID, create a simple task node
      this.tasks.push(task)
    } else {
      // If task is a TaskNode object
      this.tasks.push(task)
    }
  }

  render(x, y) {
    const group = document.createElement('div')
    group.className = `task-group ${this.isExpanded ? 'expanded' : 'collapsed'}`
    group.id = `group-${this.id}`
    group.style.left = `${x}px`
    group.style.top = `${y}px`
    group.style.transformOrigin = 'top left'
    group.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`

    const progress = this.getProgress()
    
    const header = document.createElement('div')
    header.className = 'group-header'
    header.innerHTML = `
      <button class="expand-toggle" title="${this.isExpanded ? 'Collapse' : 'Expand'} group">
        <span class="toggle-icon">${this.isExpanded ? '▼' : '▶'}</span>
      </button>
      <div class="group-info">
        <span class="group-title">${this.title}</span>
        <span class="task-count">${this.tasks.length} task${this.tasks.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="group-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
        <span class="progress-text">${progress.completed}/${progress.total}</span>
      </div>
      <div class="group-status">
        <span class="status-indicator ${this.getGroupStatus()}"></span>
      </div>
    `

    const content = document.createElement('div')
    content.className = 'group-content'
    content.style.maxHeight = this.isExpanded ? `${this.tasks.length * 80 + 20}px` : '0px'
    content.style.overflow = 'hidden'
    content.style.transition = `max-height ${this.animationDuration}ms ease-in-out`

    // Render tasks within group
    this.renderTasks(content)

    group.appendChild(header)
    group.appendChild(content)

    // Add event listeners
    this.addEventListeners(group)

    this.element = group
    return group
  }

  renderTasks(container) {
    this.taskNodes = []
    
    this.tasks.forEach((task, index) => {
      let taskNode
      
      if (typeof task === 'string') {
        // Create a simple task node from string
        taskNode = this.createSimpleTaskNode(task, index)
      } else if (task instanceof TaskNode) {
        // Use existing TaskNode
        taskNode = task
      } else {
        // Create TaskNode from object
        taskNode = new TaskNode(
          task.id || `${this.id}-task-${index}`,
          task.title || task,
          task.type || 'generic',
          task.status || 'pending'
        )
      }

      const taskElement = this.createGroupTaskElement(taskNode, index)
      container.appendChild(taskElement)
      this.taskNodes.push(taskNode)
    })
  }

  createSimpleTaskNode(taskTitle, index) {
    return new TaskNode(
      `${this.id}-${index}`,
      taskTitle,
      this.getTaskType(taskTitle),
      this.getTaskStatus(taskTitle)
    )
  }

  createGroupTaskElement(taskNode, index) {
    const taskElement = document.createElement('div')
    taskElement.className = `group-task-item status-${taskNode.status}`
    taskElement.style.animationDelay = `${index * 50}ms`
    
    taskElement.innerHTML = `
      <div class="task-item-content">
        <span class="task-item-icon">${taskNode.getIcon()}</span>
        <div class="task-item-info">
          <span class="task-item-title">${taskNode.title}</span>
          <span class="task-item-type">${taskNode.type}</span>
        </div>
        <div class="task-item-status">
          <span class="status-indicator ${taskNode.status}"></span>
          <span class="status-text">${taskNode.getStatusText()}</span>
        </div>
        <div class="task-item-actions">
          <button class="task-action-btn" title="View Details" data-action="view">
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M8 2C4.5 2 1.8 4.1 1 8c.8 3.9 3.5 6 7 6s6.2-2.1 7-6c-.8-3.9-3.5-6-7-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </button>
          <button class="task-action-btn" title="Run Task" data-action="run">
            <svg width="12" height="12" viewBox="0 0 16 16">
              <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    `

    // Add click handlers
    taskElement.addEventListener('click', (e) => {
      if (!e.target.closest('.task-action-btn')) {
        this.selectTask(taskNode)
      }
    })

    taskElement.querySelectorAll('.task-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = btn.dataset.action
        this.handleTaskAction(taskNode, action)
      })
    })

    return taskElement
  }

  addEventListeners(group) {
    const toggleBtn = group.querySelector('.expand-toggle')
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.toggle()
    })

    // Group header click (excluding toggle button)
    const header = group.querySelector('.group-header')
    header.addEventListener('click', (e) => {
      if (!e.target.closest('.expand-toggle')) {
        this.onGroupClick()
      }
    })

    // Hover effects
    group.addEventListener('mouseenter', () => this.onHover())
    group.addEventListener('mouseleave', () => this.onHoverEnd())
  }

  toggle() {
    this.isExpanded = !this.isExpanded
    
    if (!this.element) return
    
    const content = this.element.querySelector('.group-content')
    const toggleIcon = this.element.querySelector('.toggle-icon')
    const toggleBtn = this.element.querySelector('.expand-toggle')
    
    if (this.isExpanded) {
      this.element.classList.remove('collapsed')
      this.element.classList.add('expanded')
      if (content) {
        content.style.maxHeight = `${this.tasks.length * 80 + 20}px`
      }
      if (toggleIcon) {
        toggleIcon.textContent = '▼'
      }
      if (toggleBtn) {
        toggleBtn.title = 'Collapse group'
      }
      
      // Animate tasks in
      this.animateTasksIn()
    } else {
      this.element.classList.remove('expanded')
      this.element.classList.add('collapsed')
      if (content) {
        content.style.maxHeight = '0px'
      }
      if (toggleIcon) {
        toggleIcon.textContent = '▶'
      }
      if (toggleBtn) {
        toggleBtn.title = 'Expand group'
      }
    }

    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('groupToggled', {
      detail: { group: this, expanded: this.isExpanded }
    }))
  }

  animateTasksIn() {
    const taskItems = this.element.querySelectorAll('.group-task-item')
    taskItems.forEach((item, index) => {
      item.style.opacity = '0'
      item.style.transform = 'translateX(-20px)'
      
      setTimeout(() => {
        item.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out'
        item.style.opacity = '1'
        item.style.transform = 'translateX(0)'
      }, index * 50)
    })
  }

  onGroupClick() {
    console.log(`Group ${this.id} clicked`)
    this.highlight()
  }

  onHover() {
    this.element.style.transform = 'scale(1.02)'
    this.element.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
  }

  onHoverEnd() {
    this.element.style.transform = 'scale(1)'
    this.element.style.boxShadow = ''
  }

  highlight() {
    this.element.classList.add('highlighted')
    setTimeout(() => {
      this.element.classList.remove('highlighted')
    }, 2000)
  }

  selectTask(taskNode) {
    // Remove previous selections
    this.element.querySelectorAll('.group-task-item.selected').forEach(item => {
      item.classList.remove('selected')
    })

    // Add selection to clicked task
    const taskElement = Array.from(this.element.querySelectorAll('.group-task-item'))
      .find(item => item.querySelector('.task-item-title').textContent === taskNode.title)
    
    if (taskElement) {
      taskElement.classList.add('selected')
    }

    // Dispatch selection event
    this.element.dispatchEvent(new CustomEvent('taskSelected', {
      detail: { task: taskNode, group: this }
    }))
  }

  handleTaskAction(taskNode, action) {
    switch (action) {
      case 'view':
        taskNode.showDetailedView()
        break
      case 'run':
        this.runTask(taskNode)
        break
      case 'logs':
        taskNode.showLogs()
        break
      default:
        console.log(`Unknown action: ${action} for task: ${taskNode.title}`)
    }
  }

  runTask(taskNode) {
    taskNode.updateStatus('running')
    taskNode.pulse()
    
    if (!this.element) return
    
    // Update the group task item status
    const taskElement = Array.from(this.element.querySelectorAll('.group-task-item'))
      .find(item => {
        const titleEl = item.querySelector('.task-item-title')
        return titleEl && titleEl.textContent === taskNode.title
      })
    
    if (taskElement) {
      taskElement.className = `group-task-item status-running`
      const statusIndicator = taskElement.querySelector('.status-indicator')
      const statusText = taskElement.querySelector('.status-text')
      if (statusIndicator) {
        statusIndicator.className = 'status-indicator running'
      }
      if (statusText) {
        statusText.textContent = 'Running'
      }
    }

    // Simulate task completion
    setTimeout(() => {
      taskNode.updateStatus('success')
      if (taskElement) {
        taskElement.className = `group-task-item status-success`
        const statusIndicator = taskElement.querySelector('.status-indicator')
        const statusText = taskElement.querySelector('.status-text')
        if (statusIndicator) {
          statusIndicator.className = 'status-indicator success'
        }
        if (statusText) {
          statusText.textContent = 'Completed'
        }
      }
      this.updateProgress()
    }, 1000 + Math.random() * 2000)
  }

  updateProgress() {
    const progress = this.getProgress()
    const progressFill = this.element.querySelector('.progress-fill')
    const progressText = this.element.querySelector('.progress-text')
    const statusIndicator = this.element.querySelector('.group-status .status-indicator')
    
    if (progressFill) {
      progressFill.style.width = `${progress.percentage}%`
    }
    
    if (progressText) {
      progressText.textContent = `${progress.completed}/${progress.total}`
    }
    
    if (statusIndicator) {
      statusIndicator.className = `status-indicator ${this.getGroupStatus()}`
    }
  }

  getProgress() {
    const completed = this.taskNodes.filter(task => task.status === 'success').length
    const running = this.taskNodes.filter(task => task.status === 'running').length
    const failed = this.taskNodes.filter(task => task.status === 'failed').length
    
    return {
      completed,
      running,
      failed,
      total: this.taskNodes.length,
      percentage: this.taskNodes.length > 0 ? (completed / this.taskNodes.length) * 100 : 0,
    }
  }

  getGroupStatus() {
    const progress = this.getProgress()
    
    if (progress.failed > 0) {
      return 'failed'
    } else if (progress.running > 0) {
      return 'running'
    } else if (progress.completed === progress.total && progress.total > 0) {
      return 'success'
    } else {
      return 'pending'
    }
  }

  getTaskType(taskTitle) {
    const title = taskTitle.toLowerCase()
    if (title.includes('degree') || title.includes('university') || title.includes('education')) {
      return 'education'
    } else if (title.includes('experience') || title.includes('job') || title.includes('work')) {
      return 'experience'
    } else if (title.includes('skill') || title.includes('programming') || title.includes('technical')) {
      return 'skills'
    } else if (title.includes('project') || title.includes('build') || title.includes('develop')) {
      return 'projects'
    } else if (title.includes('cert') || title.includes('certificate')) {
      return 'certifications'
    }
    return 'generic'
  }

  getTaskStatus(taskTitle) {
    // For demo purposes, assign some realistic statuses
    const title = taskTitle.toLowerCase()
    if (title.includes('current') || title.includes('latest')) {
      return 'running'
    } else if (title.includes('failed') || title.includes('error')) {
      return 'failed'
    } else if (title.includes('completed') || title.includes('degree') || title.includes('cert')) {
      return 'success'
    }
    return Math.random() > 0.7 ? 'pending' : 'success'
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

  // Bulk operations
  expandAll() {
    if (!this.isExpanded) {
      this.toggle()
    }
  }

  collapseAll() {
    if (this.isExpanded) {
      this.toggle()
    }
  }

  runAllTasks() {
    this.taskNodes.forEach((task, index) => {
      setTimeout(() => {
        this.runTask(task)
      }, index * 500)
    })
  }

  pauseAllTasks() {
    this.taskNodes.forEach(task => {
      if (task.status === 'running') {
        task.updateStatus('pending')
      }
    })
    this.updateProgress()
  }

  resetAllTasks() {
    this.taskNodes.forEach(task => {
      task.updateStatus('pending')
    })
    this.updateProgress()
  }
}
