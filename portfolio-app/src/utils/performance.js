// Performance Optimization Utilities for Airflow Portfolio
// Optimizes canvas rendering, animations, and interactions for smooth 60fps experience

export class PerformanceOptimizer {
  constructor() {
    this.rafCallbacks = new Set()
    this.isOptimizing = false
    this.frameId = null
    this.performanceMetrics = {
      frameTime: [],
      renderTime: [],
      lastFrameTime: performance.now()
    }
    this.throttledFunctions = new Map()
    this.observers = new Map()
  }

  // Animation Frame Management
  requestOptimizedFrame(callback) {
    this.rafCallbacks.add(callback)
    
    if (!this.frameId) {
      this.frameId = requestAnimationFrame((timestamp) => {
        this.processFrame(timestamp)
      })
    }
  }

  processFrame(timestamp) {
    const frameTime = timestamp - this.performanceMetrics.lastFrameTime
    this.performanceMetrics.lastFrameTime = timestamp
    this.performanceMetrics.frameTime.push(frameTime)
    
    // Keep only last 60 frames for metrics
    if (this.performanceMetrics.frameTime.length > 60) {
      this.performanceMetrics.frameTime.shift()
    }

    const startTime = performance.now()

    // Execute all queued callbacks
    this.rafCallbacks.forEach(callback => {
      try {
        callback(timestamp)
      } catch (error) {
        console.error('Error in RAF callback:', error)
      }
    })

    const renderTime = performance.now() - startTime
    this.performanceMetrics.renderTime.push(renderTime)
    
    if (this.performanceMetrics.renderTime.length > 60) {
      this.performanceMetrics.renderTime.shift()
    }

    this.rafCallbacks.clear()
    this.frameId = null

    // Schedule next frame if needed
    if (this.rafCallbacks.size > 0) {
      this.frameId = requestAnimationFrame((timestamp) => {
        this.processFrame(timestamp)
      })
    }
  }

  // Canvas Optimization
  optimizeCanvas(canvas, context) {
    // Enable hardware acceleration hints
    canvas.style.willChange = 'transform'
    
    // Optimize context settings
    if (context && context.imageSmoothingEnabled !== undefined) {
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
    }

    // Add performance-optimized event listeners
    this.addOptimizedCanvasEvents(canvas)
    
    return {
      canvas,
      context,
      optimized: true
    }
  }

  addOptimizedCanvasEvents(canvas) {
    // Throttled resize handler
    const throttledResize = this.throttle(() => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }, 16) // ~60fps

    window.addEventListener('resize', throttledResize, { passive: true })
    
    // Initial sizing
    throttledResize()
  }

  // SVG Connection Optimization
  optimizeSVGConnections(svgElement) {
    // Enable CSS containment for better performance
    svgElement.style.contain = 'layout style paint'
    
    // Use efficient rendering hints
    svgElement.style.shapeRendering = 'optimizeSpeed'
    svgElement.style.textRendering = 'optimizeSpeed'
    
    // Batch SVG updates
    return this.createSVGBatcher(svgElement)
  }

  createSVGBatcher(svgElement) {
    let pendingUpdates = []
    let updateScheduled = false

    const flushUpdates = () => {
      if (pendingUpdates.length === 0) return

      // Batch DOM updates
      const fragment = document.createDocumentFragment()
      
      pendingUpdates.forEach(update => {
        if (update.type === 'add') {
          fragment.appendChild(update.element)
        } else if (update.type === 'remove') {
          update.element.remove()
        } else if (update.type === 'update') {
          Object.assign(update.element, update.props)
        }
      })

      if (fragment.children.length > 0) {
        svgElement.appendChild(fragment)
      }

      pendingUpdates = []
      updateScheduled = false
    }

    return {
      addConnection: (element) => {
        pendingUpdates.push({ type: 'add', element })
        this.scheduleUpdate(flushUpdates)
      },
      removeConnection: (element) => {
        pendingUpdates.push({ type: 'remove', element })
        this.scheduleUpdate(flushUpdates)
      },
      updateConnection: (element, props) => {
        pendingUpdates.push({ type: 'update', element, props })
        this.scheduleUpdate(flushUpdates)
      }
    }
  }

  scheduleUpdate(callback) {
    if (!this.updateScheduled) {
      this.updateScheduled = true
      this.requestOptimizedFrame(callback)
    }
  }

  // DOM Manipulation Optimization
  batchDOMUpdates(updates) {
    return new Promise(resolve => {
      this.requestOptimizedFrame(() => {
        const fragment = document.createDocumentFragment()
        
        updates.forEach(update => {
          if (update.type === 'create') {
            const element = document.createElement(update.tag)
            Object.assign(element, update.props || {})
            if (update.innerHTML) element.innerHTML = update.innerHTML
            fragment.appendChild(element)
          }
        })

        if (fragment.children.length > 0 && updates[0].parent) {
          updates[0].parent.appendChild(fragment)
        }

        resolve()
      })
    })
  }

  // Event Throttling
  throttle(func, delay) {
    const key = func.toString()
    
    if (this.throttledFunctions.has(key)) {
      return this.throttledFunctions.get(key)
    }

    let timeoutId = null
    let lastExecTime = 0

    const throttledFunc = (...args) => {
      const currentTime = performance.now()
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = performance.now()
        }, delay - (currentTime - lastExecTime))
      }
    }

    this.throttledFunctions.set(key, throttledFunc)
    return throttledFunc
  }

  // Debouncing for expensive operations
  debounce(func, delay) {
    let timeoutId = null
    
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }

  // Intersection Observer for lazy loading
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, entry)
        }
      })
    }, { ...defaultOptions, ...options })

    const observerId = Math.random().toString(36)
    this.observers.set(observerId, observer)

    return {
      observe: (element) => observer.observe(element),
      unobserve: (element) => observer.unobserve(element),
      disconnect: () => {
        observer.disconnect()
        this.observers.delete(observerId)
      }
    }
  }

  // Lazy load task details
  lazyLoadTaskDetails(taskElement) {
    const observer = this.createIntersectionObserver((element) => {
      // Load detailed content when task comes into view
      if (!element.dataset.detailsLoaded) {
        this.requestOptimizedFrame(() => {
          this.loadTaskDetails(element)
          element.dataset.detailsLoaded = 'true'
        })
      }
    })

    observer.observe(taskElement)
    return observer
  }

  loadTaskDetails(taskElement) {
    // Simulate loading detailed task information
    const detailsContainer = taskElement.querySelector('.task-details')
    if (detailsContainer && !detailsContainer.innerHTML.trim()) {
      detailsContainer.innerHTML = '<div class="loading">Loading details...</div>'
      
      // Simulate async loading
      setTimeout(() => {
        detailsContainer.innerHTML = '<div class="details-loaded">Details loaded!</div>'
      }, 100)
    }
  }

  // Memory Management
  cleanupResources() {
    // Cancel any pending animations
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    // Clear callbacks
    this.rafCallbacks.clear()

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()

    // Clear throttled functions cache
    this.throttledFunctions.clear()

    // Clear performance metrics
    this.performanceMetrics = {
      frameTime: [],
      renderTime: [],
      lastFrameTime: performance.now()
    }
  }

  // Performance Monitoring
  getPerformanceMetrics() {
    const frameTime = this.performanceMetrics.frameTime
    const renderTime = this.performanceMetrics.renderTime

    if (frameTime.length === 0) return null

    const avgFrameTime = frameTime.reduce((a, b) => a + b, 0) / frameTime.length
    const avgRenderTime = renderTime.reduce((a, b) => a + b, 0) / renderTime.length
    const fps = 1000 / avgFrameTime

    return {
      averageFrameTime: avgFrameTime.toFixed(2),
      averageRenderTime: avgRenderTime.toFixed(2),
      currentFPS: fps.toFixed(1),
      targetFPS: 60,
      performanceScore: Math.min(100, (fps / 60) * 100).toFixed(1),
      memoryUsage: this.getMemoryUsage()
    }
  }

  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      }
    }
    return 'Memory API not available'
  }

  // GPU Detection and Optimization
  detectGPUCapabilities() {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      return { webgl: false, accelerated: false }
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    let renderer = 'Unknown'
    
    if (debugInfo) {
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }

    return {
      webgl: true,
      renderer,
      accelerated: !renderer.includes('Software'),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
    }
  }

  // Adaptive Quality Based on Performance
  adaptQualitySettings() {
    const metrics = this.getPerformanceMetrics()
    if (!metrics) return 'high'

    const fps = parseFloat(metrics.currentFPS)
    
    if (fps >= 55) return 'high'
    if (fps >= 40) return 'medium'
    return 'low'
  }

  applyQualitySettings(quality) {
    const settings = {
      high: {
        animationDuration: 300,
        particleCount: 50,
        shadowQuality: 'high',
        antialiasing: true
      },
      medium: {
        animationDuration: 200,
        particleCount: 25,
        shadowQuality: 'medium',
        antialiasing: true
      },
      low: {
        animationDuration: 100,
        particleCount: 10,
        shadowQuality: 'low',
        antialiasing: false
      }
    }

    return settings[quality] || settings.medium
  }

  // Auto-optimization
  startAutoOptimization() {
    const checkInterval = 2000 // Check every 2 seconds

    setInterval(() => {
      const quality = this.adaptQualitySettings()
      const settings = this.applyQualitySettings(quality)
      
      // Apply settings to document
      document.documentElement.style.setProperty('--animation-duration', settings.animationDuration + 'ms')
      
      // Emit optimization event
      window.dispatchEvent(new CustomEvent('performanceOptimization', {
        detail: { quality, settings }
      }))
    }, checkInterval)
  }
}

// Utility functions for common optimizations
export const performanceUtils = {
  // Optimize task animations
  createOptimizedTaskAnimation(element, keyframes, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    }

    // Use CSS animations for better performance
    const animationName = 'task-anim-' + Math.random().toString(36).substr(2, 9)
    
    const styleSheet = document.styleSheets[0]
    const keyframeRule = `@keyframes ${animationName} {
      ${Object.entries(keyframes).map(([key, value]) => 
        `${key} { ${Object.entries(value).map(([prop, val]) => `${prop}: ${val}`).join('; ')} }`
      ).join(' ')}
    }`
    
    styleSheet.insertRule(keyframeRule, styleSheet.cssRules.length)
    
    element.style.animation = `${animationName} ${options.duration || defaultOptions.duration}ms ${options.easing || defaultOptions.easing} ${options.fill || defaultOptions.fill}`
    
    return new Promise(resolve => {
      element.addEventListener('animationend', resolve, { once: true })
    })
  },

  // Optimize scroll handling
  createOptimizedScrollHandler(callback) {
    let ticking = false
    
    return function optimizedScroll(e) {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback(e)
          ticking = false
        })
        ticking = true
      }
    }
  },

  // Batch style changes
  batchStyleChanges(elements, styles) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        elements.forEach(element => {
          Object.assign(element.style, styles)
        })
        resolve()
      })
    })
  }
}

// Create and export singleton instance
export const performanceOptimizer = new PerformanceOptimizer()

// Auto-start optimization monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceOptimizer.startAutoOptimization()
  })
}
