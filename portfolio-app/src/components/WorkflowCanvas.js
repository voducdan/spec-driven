// Enhanced Airflow-inspired Workflow Canvas Component
import { TaskNode } from './TaskNode.js'
import { TaskGroup } from './TaskGroup.js'
import { portfolioData } from '../data/portfolio-data.js'

export class WorkflowCanvas {
  constructor(containerId) {
    console.log(`🎨 WorkflowCanvas constructor called with containerId: ${containerId}`)
    
    this.container = document.getElementById(containerId)
    if (!this.container) {
      console.error(`❌ Container with id '${containerId}' not found in DOM`)
      throw new Error(`Container element '${containerId}' not found`)
    }
    
    console.log('✅ Container found, initializing properties...')
    this.tasks = new Map()
    this.groups = new Map()
    this.connections = []
    
    // Set canvas dimensions to full viewport with extra height for task groups
    this.canvasWidth = window.innerWidth
    this.canvasHeight = Math.max(window.innerHeight - 80, 1200) // Ensure minimum height for task groups
    
    this.scale = 1
    this.pan = { x: 0, y: 0 }
    this.isDragging = false
    this.selectedTask = null
    this.animationQueue = []
    this.isAnimating = false
    this.isPanning = false
    this.draggedTask = null
    this.dragOffset = { x: 0, y: 0 }
    
    // Handle window resize
    this.handleResize = () => {
      this.canvasWidth = window.innerWidth
      this.canvasHeight = Math.max(window.innerHeight - 80, 1200) // Ensure minimum height for task groups
      this.updateCanvasSize()
    }
    window.addEventListener('resize', this.handleResize)
    
    console.log('🚀 Calling init method...')
    this.init()
    console.log('✅ WorkflowCanvas constructor completed successfully')
  }

  init() {
    console.log('🎯 WorkflowCanvas init() method started')
    
    if (!this.container) {
      const error = 'Canvas container not found in init()'
      console.error('❌', error)
      throw new Error(error)
    }

    // Create debug overlay for scroll tracking
    this.createDebugOverlay()
    this.positionMismatches = 0

    console.log('📝 Setting container innerHTML...')
    this.container.innerHTML = `
      <div class="airflow-header-controls">
        <div class="left-controls">
          <button id="play-dag" class="control-btn primary" title="Run DAG">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
            </svg>
            <span>Run</span>
          </button>
          <button id="pause-dag" class="control-btn" title="Pause DAG">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
              <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
            </svg>
          </button>
          <button id="stop-dag" class="control-btn" title="Stop DAG">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="3" y="3" width="10" height="10" fill="currentColor"/>
            </svg>
          </button>
          <div class="control-divider"></div>
          <button id="zoom-in" class="control-btn" title="Zoom In">🔍+</button>
          <button id="zoom-out" class="control-btn" title="Zoom Out">🔍-</button>
          <button id="fit-screen" class="control-btn" title="Fit to Screen">📱</button>
          <button id="center-dag" class="control-btn" title="Center DAG">🎯</button>
          <button id="refresh-dag" class="control-btn" title="Refresh">🔄</button>
        </div>
        
        <div class="right-controls">
          <div class="task-status-summary">
            <h3>Task status count here</h3>
            <div class="status-counts">
              <div class="status-item">
                <span class="status-dot completed"></span>
                <span class="status-text">Completed: <span id="success-count">0</span></span>
              </div>
              <div class="status-item">
                <span class="status-dot running"></span>
                <span class="status-text">In Progress: <span id="running-count">0</span></span>
              </div>
              <div class="status-item">
                <span class="status-dot failed"></span>
                <span class="status-text">Failed: <span id="failed-count">0</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="workflow-canvas" id="canvas">
        <svg class="connections-layer" width="${this.canvasWidth}" height="${this.canvasHeight}">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
            <marker id="arrowhead-success" markerWidth="10" markerHeight="7" 
             refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
            </marker>
            <marker id="arrowhead-running" markerWidth="10" markerHeight="7" 
             refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Task connections will be drawn here -->
        </svg>
        <div class="tasks-layer">
          <!-- Task nodes and groups will be rendered here -->
        </div>
      </div>
    `

    console.log('🔍 Querying DOM elements...')
    this.canvas = this.container.querySelector('#canvas')
    this.connectionsLayer = this.container.querySelector('.connections-layer')
    this.tasksLayer = this.container.querySelector('.tasks-layer')

    // Verify all critical elements are found
    if (!this.canvas) {
      throw new Error('Canvas element not found after DOM update')
    }
    if (!this.connectionsLayer) {
      throw new Error('Connections layer not found after DOM update')
    }
    if (!this.tasksLayer) {
      throw new Error('Tasks layer not found after DOM update')
    }
    
    console.log('✅ All DOM elements found successfully')
    console.log('🎧 Setting up event listeners...')
    this.setupEventListeners()
    
    console.log('🖱️ Setting up pan and zoom...')
    this.setupPanAndZoom()
    
    console.log('✅ WorkflowCanvas init() completed successfully')
  }

  setupEventListeners() {
    // DAG Control buttons
    this.container.querySelector('#play-dag')?.addEventListener('click', () => this.runDAG())
    this.container.querySelector('#pause-dag')?.addEventListener('click', () => this.pauseDAG())
    this.container.querySelector('#stop-dag')?.addEventListener('click', () => this.stopDAG())

    // Zoom and view controls
    this.container.querySelector('#zoom-in')?.addEventListener('click', () => this.zoom(1.2))
    this.container.querySelector('#zoom-out')?.addEventListener('click', () => this.zoom(0.8))
    this.container.querySelector('#fit-screen')?.addEventListener('click', () => this.fitToScreen())
    this.container.querySelector('#center-dag')?.addEventListener('click', () => this.centerDAG())
    
    // Layout controls
    this.container.querySelector('#layout-horizontal')?.addEventListener('click', () => this.setLayout('horizontal'))
    this.container.querySelector('#layout-vertical')?.addEventListener('click', () => this.setLayout('vertical'))
    this.container.querySelector('#auto-layout')?.addEventListener('click', () => {
      console.log('🎯 Enhanced Auto Layout button clicked')
      this.autoLayoutTasks()
      this.fitToScreen()
      this.updateStats() // Update stats after auto-layout
      console.log('✅ Enhanced auto-layout completed')
    })
    this.container.querySelector('#toggle-groups')?.addEventListener('click', () => this.toggleGroups())
    this.container.querySelector('#refresh-dag')?.addEventListener('click', () => this.refresh())
    
    // Sidebar toggle (footer button)
    this.container.querySelector('#toggle-sidebar')?.addEventListener('click', () => {
      // For now, just show an alert or console log since we don't have a sidebar
      console.log('Details toggle clicked - sidebar functionality can be added later')
    })

    // Enhanced scroll handling for smooth scaling
    const tasksLayer = this.tasksLayer || this.container.querySelector('.tasks-layer')
    if (tasksLayer) {
      tasksLayer.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false })
      console.log('✅ Enhanced wheel listener for zoom attached to tasks layer')
    } else {
      // Fallback to canvas scroll
      this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false })
      console.log('✅ Fallback wheel listener for zoom attached to canvas')
    }
  }

  setupPanAndZoom() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e)); // End drag if mouse leaves canvas
  }

  handleMouseDown(event) {
    const target = event.target.closest('.task-node');
    if (target && target.dataset.id) {
        // Dragging a task
        const taskId = target.dataset.id;
        const taskData = this.tasks.get(taskId);
        if (taskData) {
            this.draggedTask = taskData;
            this.isDragging = true;

            const canvasRect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;

            // Task position in unscaled/unpanned coordinates
            const taskX = taskData.x;
            const taskY = taskData.y;

            // Convert to view coordinates (with pan and scale)
            const viewX = taskX * this.scale + this.pan.x;
            const viewY = taskY * this.scale + this.pan.y;

            this.dragOffset.x = mouseX - viewX;
            this.dragOffset.y = mouseY - viewY;
        }
    } else {
        // Panning the canvas
        this.isPanning = true;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  handleMouseMove(event) {
      if (this.isDragging && this.draggedTask) {
          event.preventDefault();
          const canvasRect = this.canvas.getBoundingClientRect();
          const mouseX = event.clientX - canvasRect.left;
          const mouseY = event.clientY - canvasRect.top;

          // New view position
          const newViewX = mouseX - this.dragOffset.x;
          const newViewY = mouseY - this.dragOffset.y;

          // Convert back to model coordinates
          const newX = (newViewX - this.pan.x) / this.scale;
          const newY = (newViewY - this.pan.y) / this.scale;

          this.updateTaskPosition(this.draggedTask.task.id, newX, newY);
          this.redrawConnections();
      } else if (this.isPanning) {
          event.preventDefault();
          const dx = event.clientX - this.lastMousePosition.x;
          const dy = event.clientY - this.lastMousePosition.y;

          this.pan.x += dx;
          this.pan.y += dy;

          this.updateCanvasTransform();
          this.lastMousePosition = { x: event.clientX, y: event.clientY };
      }
  }

  handleMouseUp(event) {
      this.isDragging = false;
      this.isPanning = false;
      this.draggedTask = null;
  }

  handleWheel(event) {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    this.zoom(zoomFactor, { x: mouseX, y: mouseY });
  }

  addTask(task, x, y) {
    if (!this.tasksLayer) {
      console.error('❌ Tasks layer not available for adding task:', task.id)
      this.tasksLayer = this.container.querySelector('.tasks-layer')
      if (!this.tasksLayer) {
        throw new Error('Tasks layer container not found in DOM')
      }
    }
    
    console.log(`🎯 Adding task "${task.title}" at position (${x}, ${y})`)
    this.tasks.set(task.id, { task, x, y })
    const taskElement = task.render(x, y)
    this.tasksLayer.appendChild(taskElement)
    
    // Add click handler for sidebar updates
    taskElement.addEventListener('click', () => this.selectTask(task))
    
    // Log the task element for debugging
    console.log(`✅ Task "${task.title}" element created:`, taskElement)
    console.log(`📍 Task position: left=${taskElement.style.left}, top=${taskElement.style.top}`)
    
    this.updateStats()
    return task
  }

  addGroup(group, x, y) {
    if (!this.tasksLayer) {
      console.error('❌ Tasks layer not available for adding group:', group.id)
      this.tasksLayer = this.container.querySelector('.tasks-layer')
      if (!this.tasksLayer) {
        throw new Error('Tasks layer container not found in DOM')
      }
    }
    
    this.groups.set(group.id, { group, x, y })
    const groupElement = group.render(x, y)
    this.tasksLayer.appendChild(groupElement)
    return group
  }

  selectTask(task) {
    // Update task selection (highlight selected task)
    this.selectedTask = task
    
    // Highlight selected task
    document.querySelectorAll('.task-node.selected').forEach(node => {
      node.classList.remove('selected')
    })
    task.element?.classList.add('selected')
    
    // Show detailed view or modal instead of sidebar
    if (task.showDetailedView) {
      task.showDetailedView()
    }
    
    console.log('Task selected:', task.title)
  }

  updateSidebar(task) {
    // Sidebar removed - this method is kept for compatibility
    // but doesn't do anything in the new layout
    console.log('updateSidebar called for task:', task.title, '- No sidebar in new layout')
  }

  addConnection(fromTaskId, toTaskId, animated = false) {
    this.connections.push({ from: fromTaskId, to: toTaskId })
    this.drawConnection(fromTaskId, toTaskId, animated)
  }

  drawConnection(fromTaskId, toTaskId, animated = false) {
    const fromData = this.tasks.get(fromTaskId)
    const toData = this.tasks.get(toTaskId)

    if (!fromData || !toData) {
      console.warn(`⚠️ Cannot draw connection: missing task data for ${fromTaskId} -> ${toTaskId}`)
      return
    }

    if (!this.connectionsLayer) {
      console.error('❌ Connections layer not available for drawing connection')
      return
    }

    const fromTask = fromData.task
    const toTask = toData.task

    // Apply pan and scale to connection points
    const fromX = (fromData.x + 200) * this.scale + this.pan.x;
    const fromY = (fromData.y + 40) * this.scale + this.pan.y;
    const toX = toData.x * this.scale + this.pan.x;
    const toY = (toData.y + 40) * this.scale + this.pan.y;

    try {
      // Create SVG line for straight connection (for test compatibility)
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', fromX)
      line.setAttribute('y1', fromY)
      line.setAttribute('x2', toX)
      line.setAttribute('y2', toY)
      line.setAttribute('class', 'task-connection')
      line.setAttribute('stroke', this.getConnectionColor(fromTask.status))
      line.setAttribute('stroke-width', '2')
      line.setAttribute('marker-end', `url(#arrowhead-${fromTask.status})`)
      
      if (animated) {
        line.style.strokeDasharray = '5,5'
        line.style.animation = 'drawConnection 1s ease-out forwards'
      }

      this.connectionsLayer.appendChild(line)
      console.log(`✅ Connection drawn: ${fromTaskId} -> ${toTaskId}`)
    } catch (svgError) {
      console.error(`❌ Failed to create SVG connection line:`, svgError)
    }
  }

  getConnectionColor(status) {
    const colors = {
      success: '#10b981',
      running: '#f59e0b',
      pending: '#6b7280',
      failed: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  createPortfolioDAG() {
    console.log('🚀 Starting portfolio DAG creation...')
    
    return new Promise((resolve, reject) => {
      try {
        this.clearCanvas()
        
        const dagData = portfolioData.dagStructure
        console.log('📊 DAG data loaded:', dagData)
        
        if (!dagData || !dagData.tasks) {
          throw new Error('DAG structure not found in portfolio data')
        }

        // Create main tasks from portfolio data
        console.log(`📝 Creating ${dagData.tasks.length} tasks...`)
        dagData.tasks.forEach((taskData, index) => {
          console.log(`Creating task ${index + 1}: ${taskData.title}`)
          try {
            const task = new TaskNode(
              taskData.id, 
              taskData.title, 
              taskData.type, 
              taskData.status,
              taskData.description,
              taskData.position,
              taskData.details // Pass the details object
            )
            
            task.dependencies = taskData.dependencies || []
            this.addTask(task, taskData.position.x, taskData.position.y)
            console.log(`✅ Task "${taskData.title}" created successfully`)
          } catch (taskError) {
            console.error(`❌ Failed to create task "${taskData.title}":`, taskError)
            // Continue with other tasks instead of failing completely
          }
        })

        // Create task groups
        if (dagData.taskGroups && dagData.taskGroups.length > 0) {
          console.log(`📦 Creating ${dagData.taskGroups.length} task groups...`)
          dagData.taskGroups.forEach((groupData, index) => {
            try {
              console.log(`Creating group ${index + 1}: ${groupData.title}`)
              const group = new TaskGroup(
                groupData.id,
                groupData.title,
                groupData.tasks || [],
                groupData.collapsed
              )
              this.addGroup(group, groupData.position.x, groupData.position.y)
              console.log(`✅ Group "${groupData.title}" created successfully`)
            } catch (groupError) {
              console.error(`❌ Failed to create group "${groupData.title}":`, groupError)
              // Continue with other groups
            }
          })
        }

        // Create connections based on dependencies
        console.log('🔗 Creating task connections...')
        dagData.tasks.forEach(taskData => {
          if (taskData.dependencies && taskData.dependencies.length > 0) {
            taskData.dependencies.forEach(depId => {
              try {
                console.log(`Adding connection: ${depId} -> ${taskData.id}`)
                this.addConnection(depId, taskData.id, true)
                console.log(`✅ Connection created: ${depId} -> ${taskData.id}`)
              } catch (connectionError) {
                console.error(`❌ Failed to create connection ${depId} -> ${taskData.id}:`, connectionError)
                // Continue with other connections
              }
            })
          }
        })

        this.updateStats()
        this.updateDAGStatus()
        
        console.log('✅ Portfolio DAG created successfully!')
        
        // Auto-layout tasks to prevent overlaps and center the DAG
        setTimeout(() => {
          this.autoLayoutTasks()
          this.scrollToShowAllComponents() // Use scroll-based centering
          this.updateStats() // Update stats again after layout
          console.log('🎯 Auto-layout completed and components centered')
          
          // Add debugging info about the scrollable area
          setTimeout(() => {
            const tasksLayer = this.tasksLayer || this.container.querySelector('.tasks-layer')
            if (tasksLayer) {
              console.log('📏 Tasks layer dimensions after layout:')
              console.log(`  - Client size: ${tasksLayer.clientWidth}x${tasksLayer.clientHeight}`)
              console.log(`  - Scroll size: ${tasksLayer.scrollWidth}x${tasksLayer.scrollHeight}`)
              console.log(`  - Current scroll: ${tasksLayer.scrollLeft}, ${tasksLayer.scrollTop}`)
              console.log(`  - Can scroll: ${tasksLayer.scrollWidth > tasksLayer.clientWidth || tasksLayer.scrollHeight > tasksLayer.clientHeight}`)
              console.log(`  - Task count: ${this.tasks.size}`)
              
              // Try a test scroll to verify the event fires
              console.log('🧪 Testing scroll event by scrolling 50px...')
              tasksLayer.scrollBy(50, 50)
            }
          }, 500)
          
          resolve()
        }, 200)
        
      } catch (error) {
        console.error('❌ Error creating portfolio DAG:', error)
        reject(error)
      }
    })
  }

  clearCanvas() {
    // Ensure DOM elements are available
    if (!this.tasksLayer) {
      console.warn('Tasks layer not found, reinitializing...')
      this.tasksLayer = this.container.querySelector('.tasks-layer')
    }
    if (!this.connectionsLayer) {
      console.warn('Connections layer not found, reinitializing...')
      this.connectionsLayer = this.container.querySelector('.connections-layer')
    }

    if (this.tasksLayer) {
      this.tasksLayer.innerHTML = ''
    }
    
    if (this.connectionsLayer) {
      const defs = this.connectionsLayer.querySelector('defs')
      this.connectionsLayer.innerHTML = defs ? defs.outerHTML : ''
    }
    
    this.tasks.clear()
    this.groups.clear()
    this.connections = []
  }

  runDAG() {
    console.log('Running Portfolio DAG...')
    this.updateDAGStatus('running')
    this.animateDAGExecution()
  }

  pauseDAG() {
    console.log('Pausing Portfolio DAG...')
    this.updateDAGStatus('paused')
    this.isAnimating = false
  }

  stopDAG() {
    console.log('Stopping Portfolio DAG...')
    this.updateDAGStatus('stopped')
    this.isAnimating = false
    // Reset all task statuses
    this.tasks.forEach(({ task }) => {
      task.updateStatus('pending')
    })
  }

  animateDAGExecution() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    const executionOrder = this.getExecutionOrder()
    
    executionOrder.forEach((taskId, index) => {
      setTimeout(() => {
        const taskData = this.tasks.get(taskId)
        if (taskData && this.isAnimating) {
          const task = taskData.task
          task.updateStatus('running')
          task.pulse()
          
          // Simulate task completion
          setTimeout(() => {
            if (this.isAnimating) {
              task.updateStatus('success')
              this.updateConnections(taskId)
            }
          }, 1000 + Math.random() * 2000)
        }
      }, index * 500)
    })
    
    setTimeout(() => {
      if (this.isAnimating) {
        this.updateDAGStatus('success')
        this.isAnimating = false
      }
    }, executionOrder.length * 500 + 3000)
  }

  getExecutionOrder() {
    // Simple topological sort for task execution order
    const visited = new Set()
    const order = []
    
    const visit = (taskId) => {
      if (visited.has(taskId)) return
      visited.add(taskId)
      
      const taskData = this.tasks.get(taskId)
      
      if (taskData) {
        taskData.task.dependencies.forEach(depId => visit(depId))
        order.push(taskId)
      }
    }
    
    this.tasks.forEach((_, taskId) => visit(taskId))
    return order
  }

  updateConnections(taskId) {
    // Update connection colors based on task status
    this.connections.forEach(conn => {
      if (conn.from === taskId) {
        const path = this.connectionsLayer.querySelector(`path[data-from="${taskId}"]`)
        if (path) {
          path.setAttribute('stroke', this.getConnectionColor('success'))
          path.setAttribute('marker-end', 'url(#arrowhead-success)')
        }
      }
    })
  }

  updateDAGStatus(status = null) {
    const indicator = this.container.querySelector('#dag-status-indicator')
    const text = this.container.querySelector('#dag-status-text')
    
    if (!status) {
      // Auto-determine status based on tasks
      const taskStatuses = Array.from(this.tasks.values()).map(({ task }) => task.status)
      if (taskStatuses.includes('running')) {
        status = 'running'
      } else if (taskStatuses.includes('failed')) {
        status = 'failed'
      } else if (taskStatuses.every(s => s === 'success')) {
        status = 'success'
      } else {
        status = 'pending'
      }
    }
    
    if (indicator) {
      indicator.className = `status-indicator ${status}`
    } else {
      console.warn('⚠️ DAG status indicator element not found')
    }
    
    if (text) {
      text.textContent = `Portfolio DAG - ${status.charAt(0).toUpperCase() + status.slice(1)}`
    } else {
      console.warn('⚠️ DAG status text element not found')
    }
  }

  updateStats() {
    console.log('📊 Updating task statistics...')
    
    const taskCount = this.tasks.size
    const successCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'success').length
    const runningCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'running').length
    const failedCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'failed').length
    
    console.log(`📈 Stats: Total=${taskCount}, Success=${successCount}, Running=${runningCount}, Failed=${failedCount}`)
    
    // Update with error handling
    const taskCountEl = this.container.querySelector('#task-count')
    const successCountEl = this.container.querySelector('#success-count')
    const runningCountEl = this.container.querySelector('#running-count')
    const failedCountEl = this.container.querySelector('#failed-count')
    
    if (taskCountEl) {
      taskCountEl.textContent = taskCount
      console.log('✅ Updated task count:', taskCount)
    } else {
      console.warn('⚠️ Task count element not found')
    }
    
    if (successCountEl) {
      successCountEl.textContent = successCount
      console.log('✅ Updated success count:', successCount)
    } else {
      console.warn('⚠️ Success count element not found')
    }
    
    if (runningCountEl) {
      runningCountEl.textContent = runningCount
      console.log('✅ Updated running count:', runningCount)
    } else {
      console.warn('⚠️ Running count element not found')
    }
    
    if (failedCountEl) {
      failedCountEl.textContent = failedCount
      console.log('✅ Updated failed count:', failedCount)
    } else {
      console.warn('⚠️ Failed count element not found')
    }
  }

  zoom(factor, center = null) {
    const oldScale = this.scale;
    this.scale *= factor;
    this.scale = Math.max(0.1, Math.min(3, this.scale));

    if (center) {
      // Adjust pan to zoom around the mouse pointer
      this.pan.x = center.x - (center.x - this.pan.x) * (this.scale / oldScale);
      this.pan.y = center.y - (center.y - this.pan.y) * (this.scale / oldScale);
    }
    
    this.updateCanvasTransform();
    this.redrawConnections();
  }

  updateCanvasTransform() {
    if (this.tasksLayer) {
      const transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`
      this.tasksLayer.style.transform = transform
      this.tasksLayer.style.transformOrigin = '0 0';
    }
  }

  fitToScreen() {
    // Reset scale and pan for connections layer only
    this.scale = 1
    this.pan = { x: 0, y: 0 }
    this.updateCanvasTransform()
    
    // Scroll to show all components initially
    this.scrollToShowAllComponents()
  }

  centerDAG() {
    // For scroll-based scaling, we scroll to center all components
    this.scrollToShowAllComponents()
  }
  
  scrollToShowAllComponents() {
    // Calculate bounds of all tasks and groups
    const taskPositions = Array.from(this.tasks.values()).map(({ x, y }) => ({ x, y }))
    const groupPositions = Array.from(this.groups.values()).map(({ x, y }) => ({ x, y }))
    const allPositions = [...taskPositions, ...groupPositions]
    
    if (allPositions.length === 0) return
    
    const bounds = {
      minX: Math.min(...allPositions.map(p => p.x)),
      maxX: Math.max(...allPositions.map(p => p.x)),
      minY: Math.min(...allPositions.map(p => p.y)),
      maxY: Math.max(...allPositions.map(p => p.y))
    }
    
    // Calculate center of all content
    const contentCenterX = (bounds.minX + bounds.maxX) / 2
    const contentCenterY = (bounds.minY + bounds.maxY) / 2
    
    // Get tasks layer dimensions
    const tasksLayer = this.tasksLayer
    if (!tasksLayer) return
    
    const viewportWidth = tasksLayer.clientWidth
    const viewportHeight = tasksLayer.clientHeight
    
    // Calculate scroll position to center the content
    const scrollLeft = Math.max(0, contentCenterX - viewportWidth / 2)
    const scrollTop = Math.max(0, contentCenterY - viewportHeight / 2)
    
    // Scroll to center all components
    tasksLayer.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: 'smooth'
    })
    
    console.log(`🎯 Scrolled to center all components: center=(${contentCenterX}, ${contentCenterY}), scroll=(${scrollLeft}, ${scrollTop})`)
  }

  setLayout(layout) {
    if (layout === 'vertical') {
      // Rearrange tasks vertically
      let currentY = 100
      const taskArray = Array.from(this.tasks.values())
      taskArray.forEach(({ task }, index) => {
        const newY = currentY + index * 150
        this.updateTaskPosition(task.id, 400, newY)
      })
    } else {
      // Default horizontal layout
      this.createPortfolioDAG()
    }
    this.redrawConnections()
  }

  updateTaskPosition(taskId, x, y) {
    const taskData = this.tasks.get(taskId)
    if (taskData) {
      taskData.x = x
      taskData.y = y
      taskData.task.element.style.left = `${x}px`
      taskData.task.element.style.top = `${y}px`
    }
  }

  redrawConnections() {
    // Clear existing connections
    const defs = this.connectionsLayer.querySelector('defs')
    this.connectionsLayer.innerHTML = defs.outerHTML
    
    // Redraw all connections
    this.connections.forEach(conn => {
      this.drawConnection(conn.from, conn.to)
    })
  }

  toggleGroups() {
    this.groups.forEach(({ group }) => {
      group.toggle()
    })
  }

  toggleSidebar() {
    // Sidebar removed in new layout - method kept for compatibility
    console.log('toggleSidebar called - No sidebar in new Airflow layout')
  }

  runTask(taskId) {
    const taskData = this.tasks.get(taskId)
    if (taskData) {
      taskData.task.updateStatus('running')
      taskData.task.pulse()
      
      setTimeout(() => {
        taskData.task.updateStatus('success')
        this.updateStats()
      }, 2000)
    }
  }

  showTaskLogs(taskId) {
    const taskData = this.tasks.get(taskId)
    if (taskData) {
      taskData.task.showLogs()
    }
  }

  refresh() {
    console.log('🔄 Refreshing Portfolio DAG...')
    this.createPortfolioDAG()
    this.scrollToShowAllComponents() // Use scroll-based centering
    // Force stats update after refresh
    setTimeout(() => {
      this.updateStats()
      console.log('📊 Stats forcefully updated after refresh')
    }, 500)
  }

  updateCanvasSize() {
    // Update the SVG connections layer size
    const connectionsLayer = this.container.querySelector('.connections-layer')
    if (connectionsLayer) {
      connectionsLayer.setAttribute('width', this.canvasWidth)
      connectionsLayer.setAttribute('height', this.canvasHeight)
    }
    
    // Update the canvas container size
    const canvas = this.container.querySelector('.workflow-canvas')
    if (canvas) {
      canvas.style.width = `${this.canvasWidth}px`
      canvas.style.height = `${this.canvasHeight}px`
    }
    
    // Redraw connections if they exist
    if (this.connections.length > 0) {
      this.redrawConnections()
    }
  }

  // Enhanced overlap detection with better collision resolution
  detectAndResolveOverlapsEnhanced() {
    const taskArray = Array.from(this.tasks.values())
    const taskWidth = 240
    const taskHeight = 150
    const minSpacing = 60
    const resolvedOverlaps = new Set()
    
    for (let i = 0; i < taskArray.length; i++) {
      for (let j = i + 1; j < taskArray.length; j++) {
        const task1 = taskArray[i]
        const task2 = taskArray[j]
        
        // Check if tasks overlap
        const xOverlap = Math.abs(task1.x - task2.x) < (taskWidth + minSpacing)
        const yOverlap = Math.abs(task1.y - task2.y) < (taskHeight + minSpacing)
        
        if (xOverlap && yOverlap) {
          const overlapKey = `${Math.min(i, j)}-${Math.max(i, j)}`
          if (!resolvedOverlaps.has(overlapKey)) {
            console.warn(`⚠️ Enhanced overlap resolution between "${task1.task.title}" and "${task2.task.title}"`)
            
            // Smart resolution: move task with fewer dependencies
            const task1Dependencies = this.getTaskDependencies(task1.task.id).length
            const task2Dependencies = this.getTaskDependencies(task2.task.id).length
            
            let taskToMove = task2Dependencies <= task1Dependencies ? task2 : task1
            let staticTask = taskToMove === task2 ? task1 : task2
            
            // Calculate best direction to move (prefer right/down to maintain flow)
            const deltaX = taskToMove.x - staticTask.x
            const deltaY = taskToMove.y - staticTask.y
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              // Move horizontally
              taskToMove.x = staticTask.x + (deltaX > 0 ? (taskWidth + minSpacing) : -(taskWidth + minSpacing))
            } else {
              // Move vertically
              taskToMove.y = Math.max(80, staticTask.y + (deltaY > 0 ? (taskHeight + minSpacing) : -(taskHeight + minSpacing)))
            }
            
            // Update the task element position with animation
            if (taskToMove.task.element) {
              taskToMove.task.element.style.left = `${taskToMove.x}px`
              taskToMove.task.element.style.top = `${taskToMove.y}px`
            }
            
            resolvedOverlaps.add(overlapKey)
            console.log(`📍 Smart repositioned "${taskToMove.task.title}" to avoid overlap: (${taskToMove.x}, ${taskToMove.y})`)
          }
        }
      }
    }
  }

  // Helper method to get task dependencies
  getTaskDependencies(taskId) {
    return this.connections.filter(conn => conn.to === taskId)
  }

  // Enhanced method to auto-layout tasks with smart spacing and overlap prevention
  autoLayoutTasks() {
    console.log('🎨 Auto-layouting tasks with enhanced spacing...')
    
    const taskArray = Array.from(this.tasks.values())
    const taskWidth = 240 // Increased width for better spacing
    const taskHeight = 150 // Increased height for better spacing
    const horizontalSpacing = 80 // Increased horizontal gap
    const verticalSpacing = 40 // Increased vertical gap
    const startX = 150 // Increased buffer from left edge
    const startY = 150 // Increased buffer from top edge
    
    // Group tasks by their dependency level (topological layers)
    const levels = this.getTaskLevels()
    const maxTasksInLevel = Math.max(...Object.values(levels).map(tasks => tasks.length))
    
    // Position main tasks first
    Object.entries(levels).forEach(([level, taskIds]) => {
      const levelNum = parseInt(level)
      const tasksInLevel = taskIds.length
      
      // Calculate total height needed for this level
      const totalLevelHeight = (tasksInLevel - 1) * (taskHeight + verticalSpacing)
      const levelStartY = startY + (maxTasksInLevel * (taskHeight + verticalSpacing) / 2) - (totalLevelHeight / 2)
      
      taskIds.forEach((taskId, index) => {
        const taskData = this.tasks.get(taskId)
        if (taskData) {
          // Calculate position based on level and index within level
          const x = startX + (levelNum * (taskWidth + horizontalSpacing))
          const y = Math.max(startY, levelStartY + (index * (taskHeight + verticalSpacing)))
          
          // Update task position
          taskData.x = x
          taskData.y = y
          
          if (taskData.task.element) {
            taskData.task.element.style.left = `${x}px`
            taskData.task.element.style.top = `${y}px`
            
            // Add smooth transition for repositioning
            taskData.task.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }
          
          console.log(`📍 Enhanced positioning "${taskData.task.title}" at level ${levelNum}: (${x}, ${y})`)
        }
      })
    })
    
    // Position task groups below the main tasks
    this.positionTaskGroupsBelowTasks()
    
    // Apply final overlap detection and resolution
    this.detectAndResolveOverlapsEnhanced()
    
    // Redraw connections after repositioning
    setTimeout(() => {
      this.redrawConnections()
    }, 100)
  }

  // New method to position task groups below main tasks
  positionTaskGroupsBelowTasks() {
    console.log('📦 Positioning task groups far below main tasks...')
    
    // Find the lowest Y position of all tasks
    const taskPositions = Array.from(this.tasks.values())
    const maxTaskY = taskPositions.length > 0 ? Math.max(...taskPositions.map(({ y }) => y)) : 0
    const groupStartY = maxTaskY + 400 // Much more spacing below tasks (increased from 200 to 400)
    
    const groupArray = Array.from(this.groups.values())
    const groupWidth = 280
    const groupSpacing = 100
    const startX = 170 // Increased buffer from left edge
    
    groupArray.forEach(({ group }, index) => {
      const x = startX + (index % 3) * (groupWidth + groupSpacing) // 3 groups per row
      const y = groupStartY + Math.floor(index / 3) * 200 // More vertical spacing between rows (increased from 150 to 200)
      
      // Update group data position
      const groupData = this.groups.get(group.id)
      if (groupData) {
        groupData.x = x
        groupData.y = y
      }
      
      if (group.element) {
        group.element.style.left = `${x}px`
        group.element.style.top = `${y}px`
        group.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }
      
      console.log(`📦 Positioned group "${group.title}" far below at (${x}, ${y})`)
    })
  }

  // Get task levels based on dependencies (topological sort by levels)
  getTaskLevels() {
    const levels = {}
    const visited = new Set()
    
    const getLevel = (taskId) => {
      if (visited.has(taskId)) {
        return levels[taskId] || 0
      }
      
      visited.add(taskId)
      const taskData = this.tasks.get(taskId)
      
      if (!taskData || !taskData.task.dependencies || taskData.task.dependencies.length === 0) {
        levels[taskId] = 0
        return 0
      }
      
      const maxDepLevel = Math.max(...taskData.task.dependencies.map(depId => getLevel(depId)))
      levels[taskId] = maxDepLevel + 1
      return maxDepLevel + 1
    }
    
    // Calculate levels for all tasks
    this.tasks.forEach((_, taskId) => getLevel(taskId))
    
    // Group tasks by level
    const levelGroups = {}
    Object.entries(levels).forEach(([taskId, level]) => {
      if (!levelGroups[level]) {
        levelGroups[level] = []
      }
      levelGroups[level].push(taskId)
    })
    
    return levelGroups
  }

  createDebugOverlay() {
    // Create a debug overlay to show scroll and position information
    const debugOverlay = document.createElement('div')
    debugOverlay.id = 'scroll-debug-overlay'
    debugOverlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      pointer-events: none;
    `
    debugOverlay.innerHTML = `
      <h4 style="margin: 0 0 10px 0; color: #3b82f6;">Scroll Debug</h4>
      <div id="debug-scroll-pos">Scroll: (0, 0)</div>
      <div id="debug-viewport-center">Center: (0, 0)</div>
      <div id="debug-task-count">Tasks: 0</div>
      <div id="debug-position-status">Position Status: OK</div>
    `
    document.body.appendChild(debugOverlay)
    this.debugOverlay = debugOverlay
  }

  updateDebugOverlay(scrollLeft, scrollTop, centerX, centerY) {
    if (!this.debugOverlay) return
    
    const scrollPosEl = this.debugOverlay.querySelector('#debug-scroll-pos')
    const centerEl = this.debugOverlay.querySelector('#debug-viewport-center')
    const taskCountEl = this.debugOverlay.querySelector('#debug-task-count')
    const statusEl = this.debugOverlay.querySelector('#debug-position-status')
    
    if (scrollPosEl) scrollPosEl.textContent = `Scroll: (${scrollLeft}, ${scrollTop})`
    if (centerEl) centerEl.textContent = `Center: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`
    if (taskCountEl) taskCountEl.textContent = `Tasks: ${this.tasks.size}`
    if (statusEl) statusEl.textContent = `Position Status: ${this.positionMismatches > 0 ? 'MISMATCH' : 'OK'}`
  }
}

// Make the instance available globally for button callbacks
window.WorkflowCanvas = WorkflowCanvas
