// Accessibility Features for Airflow-Inspired Portfolio
// WCAG 2.1 AA compliant features including ARIA labels, keyboard navigation, and screen reader support

export class AccessibilityManager {
  constructor() {
    this.focusableElements = new Set()
    this.keyboardHandlers = new Map()
    this.announcements = []
    this.currentFocusIndex = -1
    this.isKeyboardUser = false
    this.screenReaderMode = false
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    this.init()
  }

  init() {
    this.setupKeyboardDetection()
    this.setupScreenReaderDetection()
    this.setupMotionPreferences()
    this.setupGlobalKeyboardHandlers()
    this.createAriaLiveRegion()
  }

  // Keyboard Detection and Navigation
  setupKeyboardDetection() {
    document.addEventListener('keydown', (e) => {
      this.isKeyboardUser = true
      document.body.classList.add('keyboard-user')
    })

    document.addEventListener('mousedown', () => {
      this.isKeyboardUser = false
      document.body.classList.remove('keyboard-user')
    })
  }

  setupGlobalKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          this.handleTabNavigation(e)
          break
        case 'Escape':
          this.handleEscape(e)
          break
        case 'Enter':
        case ' ':
          this.handleActivation(e)
          break
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowNavigation(e)
          break
      }
    })
  }

  handleTabNavigation(e) {
    const focusableElements = this.getFocusableElements()
    
    if (focusableElements.length === 0) return

    if (e.shiftKey) {
      // Shift + Tab (backwards)
      if (document.activeElement === focusableElements[0]) {
        e.preventDefault()
        focusableElements[focusableElements.length - 1].focus()
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === focusableElements[focusableElements.length - 1]) {
        e.preventDefault()
        focusableElements[0].focus()
      }
    }
  }

  handleEscape(e) {
    // Close modals, dropdowns, etc.
    const modal = document.querySelector('.modal.show, .task-modal.show')
    if (modal) {
      e.preventDefault()
      this.closeModal(modal)
    }

    // Clear focus from search or input fields
    if (document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur()
    }
  }

  handleActivation(e) {
    const target = e.target
    
    // Handle custom interactive elements
    if (target.hasAttribute('data-action')) {
      e.preventDefault()
      this.triggerAction(target)
    }

    // Handle task nodes
    if (target.closest('.task-node')) {
      e.preventDefault()
      this.activateTaskNode(target.closest('.task-node'))
    }
  }

  handleArrowNavigation(e) {
    const container = e.target.closest('.workflow-canvas, .portfolio-section')
    if (!container) return

    const navigableItems = container.querySelectorAll('.task-node, .task-group, .action-btn')
    const currentIndex = Array.from(navigableItems).indexOf(document.activeElement)
    
    if (currentIndex === -1) return

    let nextIndex = currentIndex
    
    switch (e.key) {
      case 'ArrowUp':
        nextIndex = Math.max(0, currentIndex - 1)
        break
      case 'ArrowDown':
        nextIndex = Math.min(navigableItems.length - 1, currentIndex + 1)
        break
      case 'ArrowLeft':
        nextIndex = Math.max(0, currentIndex - 1)
        break
      case 'ArrowRight':
        nextIndex = Math.min(navigableItems.length - 1, currentIndex + 1)
        break
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault()
      navigableItems[nextIndex].focus()
    }
  }

  // Focus Management
  getFocusableElements() {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '.task-node',
      '.task-group',
      '[data-action]'
    ].join(', ')

    return Array.from(document.querySelectorAll(selector))
      .filter(el => {
        return !el.hidden && 
               el.offsetWidth > 0 && 
               el.offsetHeight > 0 &&
               window.getComputedStyle(el).visibility !== 'hidden'
      })
  }

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', trapHandler)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', trapHandler)
    }
  }

  // ARIA and Screen Reader Support
  setupScreenReaderDetection() {
    // Detect if screen reader is likely being used
    const isScreenReader = (
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis ||
      window.screen.width === 0 ||
      window.screen.height === 0
    )

    if (isScreenReader) {
      this.screenReaderMode = true
      document.body.classList.add('screen-reader-mode')
    }
  }

  createAriaLiveRegion() {
    const liveRegion = document.createElement('div')
    liveRegion.id = 'aria-live-region'
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.style.position = 'absolute'
    liveRegion.style.left = '-10000px'
    liveRegion.style.width = '1px'
    liveRegion.style.height = '1px'
    liveRegion.style.overflow = 'hidden'
    
    document.body.appendChild(liveRegion)
    this.liveRegion = liveRegion
  }

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return

    this.liveRegion.setAttribute('aria-live', priority)
    this.liveRegion.textContent = message

    // Clear after announcement
    setTimeout(() => {
      this.liveRegion.textContent = ''
    }, 1000)

    // Log announcement for debugging
    console.log(`🔊 Announced: ${message}`)
  }

  // Task Node Accessibility
  makeTaskNodeAccessible(taskNode, taskData) {
    // Add ARIA attributes
    taskNode.setAttribute('role', 'button')
    taskNode.setAttribute('tabindex', '0')
    taskNode.setAttribute('aria-label', this.generateTaskAriaLabel(taskData))
    taskNode.setAttribute('aria-describedby', `task-${taskData.id}-description`)
    
    // Add status information
    taskNode.setAttribute('aria-expanded', taskData.isExpanded ? 'true' : 'false')
    
    // Create description element
    this.createTaskDescription(taskNode, taskData)
    
    // Add keyboard interaction
    this.addTaskKeyboardHandlers(taskNode, taskData)
    
    // Update status changes
    this.observeTaskStatusChanges(taskNode, taskData)
  }

  generateTaskAriaLabel(taskData) {
    const status = taskData.status || 'pending'
    const type = taskData.type || 'task'
    const dependencies = taskData.dependencies?.length || 0
    
    let label = `${taskData.title}, ${type} task, status: ${status}`
    
    if (dependencies > 0) {
      label += `, depends on ${dependencies} other task${dependencies > 1 ? 's' : ''}`
    }
    
    if (taskData.description) {
      label += `, ${taskData.description}`
    }
    
    return label
  }

  createTaskDescription(taskNode, taskData) {
    const descriptionId = `task-${taskData.id}-description`
    let description = document.getElementById(descriptionId)
    
    if (!description) {
      description = document.createElement('div')
      description.id = descriptionId
      description.className = 'sr-only'
      taskNode.appendChild(description)
    }
    
    let descText = `Task ${taskData.title} is currently ${taskData.status}.`
    
    if (taskData.dependencies?.length > 0) {
      descText += ` This task depends on: ${taskData.dependencies.join(', ')}.`
    }
    
    if (taskData.executionTime) {
      descText += ` Last execution took ${taskData.executionTime} milliseconds.`
    }
    
    description.textContent = descText
  }

  addTaskKeyboardHandlers(taskNode, taskData) {
    taskNode.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          this.activateTaskNode(taskNode)
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            this.showTaskDetails(taskData)
          }
          break
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            this.runTask(taskData)
          }
          break
      }
    })
  }

  observeTaskStatusChanges(taskNode, taskData) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newStatus = this.extractStatusFromClasses(taskNode.className)
          if (newStatus !== taskData.status) {
            taskData.status = newStatus
            this.updateTaskAccessibility(taskNode, taskData)
            this.announce(`Task ${taskData.title} status changed to ${newStatus}`)
          }
        }
      })
    })

    observer.observe(taskNode, { attributes: true, attributeFilter: ['class'] })
  }

  extractStatusFromClasses(className) {
    const statusClasses = ['status-pending', 'status-running', 'status-success', 'status-failed']
    const foundStatus = statusClasses.find(cls => className.includes(cls))
    return foundStatus ? foundStatus.replace('status-', '') : 'pending'
  }

  updateTaskAccessibility(taskNode, taskData) {
    taskNode.setAttribute('aria-label', this.generateTaskAriaLabel(taskData))
    this.createTaskDescription(taskNode, taskData)
  }

  // Modal Accessibility
  makeModalAccessible(modal, title) {
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.setAttribute('aria-labelledby', 'modal-title')
    
    // Create or update title
    let titleElement = modal.querySelector('#modal-title')
    if (!titleElement) {
      titleElement = document.createElement('h2')
      titleElement.id = 'modal-title'
      titleElement.className = 'modal-title'
      modal.querySelector('.modal-content').prepend(titleElement)
    }
    titleElement.textContent = title
    
    // Add close button if not present
    let closeButton = modal.querySelector('.modal-close')
    if (!closeButton) {
      closeButton = document.createElement('button')
      closeButton.className = 'modal-close'
      closeButton.setAttribute('aria-label', 'Close dialog')
      closeButton.innerHTML = '&times;'
      modal.querySelector('.modal-header').appendChild(closeButton)
    }
    
    // Setup focus trap
    const releaseFocusTrap = this.trapFocus(modal)
    
    // Return cleanup function
    return releaseFocusTrap
  }

  closeModal(modal) {
    modal.classList.remove('show')
    this.announce('Dialog closed')
    
    // Return focus to trigger element if available
    const trigger = document.querySelector('[data-modal-trigger]')
    if (trigger) {
      trigger.focus()
    }
  }

  // Motion Preferences
  setupMotionPreferences() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const updateMotionPreference = (mq) => {
      this.reducedMotion = mq.matches
      document.body.classList.toggle('reduced-motion', mq.matches)
      
      if (mq.matches) {
        this.disableAnimations()
      } else {
        this.enableAnimations()
      }
    }
    
    updateMotionPreference(mediaQuery)
    mediaQuery.addListener(updateMotionPreference)
  }

  disableAnimations() {
    const style = document.createElement('style')
    style.id = 'reduced-motion-styles'
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `
    document.head.appendChild(style)
  }

  enableAnimations() {
    const style = document.getElementById('reduced-motion-styles')
    if (style) {
      style.remove()
    }
  }

  // Color Contrast and Theme Support
  checkColorContrast(foreground, background) {
    // Convert hex to RGB
    const getRGB = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [r, g, b]
    }
    
    // Calculate relative luminance
    const getLuminance = ([r, g, b]) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const fgLuminance = getLuminance(getRGB(foreground))
    const bgLuminance = getLuminance(getRGB(background))
    
    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                    (Math.min(fgLuminance, bgLuminance) + 0.05)
    
    return {
      ratio: contrast,
      AA: contrast >= 4.5,
      AAA: contrast >= 7
    }
  }

  // Skip Links
  addSkipLinks() {
    const skipLinks = document.createElement('div')
    skipLinks.className = 'skip-links'
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#sidebar" class="skip-link">Skip to sidebar</a>
    `
    
    document.body.insertBefore(skipLinks, document.body.firstChild)
    
    // Add corresponding IDs if they don't exist
    this.ensureSkipTargets()
  }

  ensureSkipTargets() {
    const targets = [
      { id: 'main-content', selector: 'main, .workflow-container, #app' },
      { id: 'navigation', selector: 'nav, .workflow-toolbar' },
      { id: 'sidebar', selector: '.portfolio-sidebar, #sidebar' }
    ]
    
    targets.forEach(({ id, selector }) => {
      if (!document.getElementById(id)) {
        const element = document.querySelector(selector)
        if (element) {
          element.id = id
        }
      }
    })
  }

  // Utility Functions
  activateTaskNode(taskNode) {
    const taskId = taskNode.id?.replace('task-', '')
    this.announce(`Activated task: ${taskNode.getAttribute('aria-label')}`)
    
    // Trigger click event for existing functionality
    taskNode.click()
  }

  triggerAction(element) {
    const action = element.getAttribute('data-action')
    this.announce(`Triggered action: ${action}`)
    
    // Trigger click event for existing functionality
    element.click()
  }

  showTaskDetails(taskData) {
    this.announce(`Showing details for task: ${taskData.title}`)
  }

  runTask(taskData) {
    this.announce(`Running task: ${taskData.title}`)
  }

  // Error Handling
  reportAccessibilityError(error, context) {
    console.error('Accessibility Error:', error, 'Context:', context)
    this.announce('An accessibility error occurred. Please try again or use alternative navigation.')
  }

  // Initialization for existing elements
  initializeAccessibility() {
    // Add skip links
    this.addSkipLinks()
    
    // Make existing task nodes accessible
    document.querySelectorAll('.task-node').forEach((node, index) => {
      const taskData = {
        id: node.id?.replace('task-', '') || `task-${index}`,
        title: node.querySelector('.task-title')?.textContent || 'Unknown Task',
        status: this.extractStatusFromClasses(node.className),
        type: 'task'
      }
      this.makeTaskNodeAccessible(node, taskData)
    })
    
    // Make existing modals accessible
    document.querySelectorAll('.modal').forEach(modal => {
      const title = modal.querySelector('.modal-title, h2, h3')?.textContent || 'Dialog'
      this.makeModalAccessible(modal, title)
    })
    
    this.announce('Portfolio accessibility features initialized')
  }
}

// Utility functions for common accessibility tasks
export const accessibilityUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix = 'a11y') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element) => {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.getAttribute('aria-hidden') !== 'true'
  },
  
  // Add screen reader only text
  addScreenReaderText: (element, text) => {
    const srText = document.createElement('span')
    srText.className = 'sr-only'
    srText.textContent = text
    element.appendChild(srText)
  },
  
  // Format time for screen readers
  formatTimeForScreenReader: (milliseconds) => {
    const seconds = Math.round(milliseconds / 1000)
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
  }
}

// Create and export singleton instance
export const accessibilityManager = new AccessibilityManager()

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      accessibilityManager.initializeAccessibility()
    })
  } else {
    accessibilityManager.initializeAccessibility()
  }
}
