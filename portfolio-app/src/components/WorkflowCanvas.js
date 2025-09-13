// Enhanced Airflow-inspired Workflow Canvas Component
import { TaskNode } from './TaskNode.js'
import { TaskGroup } from './TaskGroup.js'
import { portfolioData } from '../data/portfolio-data.js'

export class WorkflowCanvas {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw new Error(`Container element '${containerId}' not found`)
    }
    
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
    this.groupsVisible = true // Groups are visible by default
    
    // Handle window resize
    this.handleResize = () => {
      this.canvasWidth = window.innerWidth
      this.canvasHeight = Math.max(window.innerHeight - 80, 1200) // Ensure minimum height for task groups
      this.updateCanvasSize()
    }
    window.addEventListener('resize', this.handleResize)
    
    this.init()
  }

  init() {
    
    if (!this.container) {
      const error = 'Canvas container not found in init()'
      throw new Error(error)
    }

    // Create debug overlay for scroll tracking
    this.positionMismatches = 0

    this.container.innerHTML = `
      <div class="airflow-header-controls">
        <div class="left-controls">
          <button id="play-dag" class="control-btn primary" title="Run DAG">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 2l10 6-10 6V2z" fill="currentColor"/>
            </svg>
            <span>Run</span>
          </button>
          <div class="control-divider"></div>
          <button id="fit-screen" class="control-btn" title="Fit to Screen">📱</button>
        </div>
        
        <div class="center-info">
          <div class="personal-info">
            <h2 class="name">VO DUC DAN - DATA ENGINEER</h2>
            <div class="contact-details">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>Binh Thanh district, Ho Chi Minh city</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span>0972184325</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <span>voducdand99@gmail.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🌐</span>
                <a href="https://voducdan.github.io/spec-driven/" target="_blank">Portfolio</a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="right-controls">
          <div class="task-status-summary">
            <h3>🌟 Portfolio DAG</h3>
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
        <!-- SVG connections layer positioned OUTSIDE the transformed tasks-layer -->
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
          <g id="connections-group">
            <!-- Task connections will be drawn here -->
          </g>
        </svg>
        <div class="tasks-layer">
          <!-- Task nodes and groups will be rendered here -->
        </div>
      </div>
    `

    this.canvas = this.container.querySelector('#canvas')
    this.tasksLayer = this.container.querySelector('.tasks-layer')
    this.connectionsLayer = this.container.querySelector('.connections-layer')
    this.connectionsGroup = this.container.querySelector('#connections-group');

    // Verify the SVG is now outside the tasks-layer

    // Log canvas dimensions for debugging

    // Verify all critical elements are found
    if (!this.canvas) {
      throw new Error('Canvas element not found after DOM update')
    }
    if (!this.tasksLayer) {
      throw new Error('Tasks layer not found after DOM update')
    }
    if (!this.connectionsLayer) {
      throw new Error('Connections layer not found after DOM update')
    }
    if (!this.connectionsGroup) {
      throw new Error('Connections group not found after DOM update')
    }
    
    // Log SVG element details
    
    this.setupEventListeners()
    
    this.setupPanAndZoom()
    
    // Store instance on canvas element for debugging
    this.canvas.workflowInstance = this;
    
    // Expose comprehensive debug function globally
    window.debugWorkflow = () => this.comprehensiveDebug()
    window.addTestLine = () => this.addTestLine()
    window.debugConnections = () => this.debugDrawConnections()
    window.testConnections = () => this.testConnectionsVisibility()
    window.inspectSVG = inspectSVG
    
    
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
      this.autoLayoutTasks()
      this.fitToScreen()
      this.updateStats() // Update stats after auto-layout
    })
    this.container.querySelector('#toggle-groups')?.addEventListener('click', () => this.toggleGroups())
    this.container.querySelector('#refresh-dag')?.addEventListener('click', () => this.refresh())
    this.container.querySelector('#simple-view')?.addEventListener('click', () => {
      if (window.showSimpleView) {
        window.showSimpleView()
      } else {
      }
    })
    
    // Sidebar toggle (footer button)
    this.container.querySelector('#toggle-sidebar')?.addEventListener('click', () => {
      // For now, just show an alert or console log since we don't have a sidebar
    })

    // The wheel listener for zoom should be on the main canvas to ensure it
    // always captures events, regardless of child element transformations.
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false })

    // Attach scroll listener to the tasks layer since that's where scrolling happens
    this.tasksLayer.addEventListener('scroll', () => this.handleScroll())
  }

  handleScroll() {
    if (!this.tasksLayer) return

    const scrollLeft = this.tasksLayer.scrollLeft
    const scrollTop = this.tasksLayer.scrollTop
    const viewportWidth = this.tasksLayer.clientWidth
    const viewportHeight = this.tasksLayer.clientHeight
    const centerX = scrollLeft + viewportWidth / 2
    const centerY = scrollTop + viewportHeight / 2

    const maxDistance = Math.max(viewportWidth, viewportHeight) / 2
    const minScale = 0.7
    const maxScale = 1.0

    this.tasks.forEach(({ task, x, y }) => {
      if (task.element) {
        const taskCenterX = x + task.element.offsetWidth / 2
        const taskCenterY = y + task.element.offsetHeight / 2
        const distance = Math.sqrt(
          Math.pow(centerX - taskCenterX, 2) + Math.pow(centerY - taskCenterY, 2)
        )

        let scale
        if (distance >= maxDistance) {
          scale = minScale
        } else {
          // Calculate scale linearly from maxScale to minScale
          scale = maxScale - (distance / maxDistance) * (maxScale - minScale)
        }
        
        task.setScale(scale)
      }
    })

    // Update debug overlay if it exists
    this.updateDebugOverlay(scrollLeft, scrollTop, centerX, centerY)
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
        // Start dragging a task
        this.isDragging = true;
        this.draggedTask = target.dataset.id;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };

    } else {
        // Start panning the canvas
        this.isPanning = true;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  handleMouseMove(event) {
      if (this.isDragging && this.draggedTask) {
        const dx = (event.clientX - this.lastMousePosition.x) / this.scale;
        const dy = (event.clientY - this.lastMousePosition.y) / this.scale;

        const taskData = this.tasks.get(this.draggedTask);
        if (taskData) {
          taskData.x += dx;
          taskData.y += dy;
          
          // Update the visual position of the HTML element directly
          taskData.task.updatePosition(taskData.x, taskData.y);
          
          // Redraw connections to follow the node
          this.redrawAllConnections();
        }

        this.lastMousePosition = { x: event.clientX, y: event.clientY };

      } else if (this.isPanning) {
        // Panning the canvas
        const dx = event.clientX - this.lastMousePosition.x;
        const dy = event.clientY - this.lastMousePosition.y;
        this.pan.x += dx;
        this.pan.y += dy;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
        this.updateCanvasTransform();
      }
  }

  handleMouseUp(event) {
      if (this.isDragging) {
        // The model is already updated, so we just need to finalize
        this.calculateGroupBounds();
        this.redrawAllConnections();
      }
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
      this.tasksLayer = this.container.querySelector('.tasks-layer')
      if (!this.tasksLayer) {
        throw new Error('Tasks layer container not found in DOM')
      }
    }
    
    this.tasks.set(task.id, { task, x, y })
    const taskElement = task.render(x, y)
    this.tasksLayer.appendChild(taskElement)
    
    // Add hover listeners to manage blur effect
    taskElement.addEventListener('mouseenter', () => this.handleTaskHover(task.id, true));
    taskElement.addEventListener('mouseleave', () => this.handleTaskHover(task.id, false));

    // Add click handler for sidebar updates
    taskElement.addEventListener('click', () => this.selectTask(task))
    
    // Log the task element for debugging
    
    this.updateStats()
    return task
  }

  handleTaskHover(taskId, isHovering) {
    this.tasks.forEach((taskData, id) => {
      if (id !== taskId) {
        taskData.task.element.classList.toggle('blur', isHovering);
      }
    });
  }

  addGroup(group, x, y) {
    if (!this.tasksLayer) {
      this.tasksLayer = this.container.querySelector('.tasks-layer')
      if (!this.tasksLayer) {
        throw new Error('Tasks layer container not found in DOM')
      }
    }
    
    this.groups.set(group.id, { group, x, y })
    const groupElement = group.render(x, y)
    this.tasksLayer.appendChild(groupElement)
    group.updatePosition(x,y);
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
  }

  updateSidebar(task) {
    // Sidebar removed - this method is kept for compatibility
    // but doesn't do anything in the new layout
  }

  addConnection(fromTaskId, toTaskId, animated = false) {
    this.connections.push({ from: fromTaskId, to: toTaskId, animated });
  }

  drawConnection(fromTaskId, toTaskId, animated = false, label = '') {
    
    const fromData = this.tasks.get(fromTaskId) || this.groups.get(fromTaskId);
    const toData = this.tasks.get(toTaskId) || this.groups.get(toTaskId);

    if (!fromData || !toData) {
      return;
    }

    const fromNode = fromData.task || fromData.group;
    const toNode = toData.task || toData.group;

    const fromElement = fromNode.element;
    const toElement = toNode.element;

    if (!fromElement || !toElement) {
      return;
    }

    // Enhanced coordinate calculation that accounts for different element types
    const isFromGroup = !!fromData.group; // fromData came from this.groups.get()
    const isToGroup = !!toData.group; // toData came from this.groups.get()
    
    // Calculate connection points based on model dimensions
    let fromX, fromY, toX, toY;
    
    // Use CSS-defined dimensions instead of getBoundingClientRect to avoid coordinate system mismatch
    let fromWidth, fromHeight, toWidth, toHeight;
    
    if (isFromGroup) {
      // Use group dimensions
      fromWidth = fromData.group.width || 280;
      fromHeight = fromData.group.height || 150;
    } else {
      // Use task node dimensions from CSS (220px width, 130px min-height from style.css)
      fromWidth = 220;
      fromHeight = 130;
    }
    
    if (isToGroup) {
      // Use group dimensions
      toWidth = toData.group.width || 280;
      toHeight = toData.group.height || 150;
    } else {
      // Use task node dimensions from CSS
      toWidth = 220;
      toHeight = 130;
    }
    
    // Connection points: from right edge center to left edge center
    // Account for task border (2px) to ensure connections touch the actual visual edge
    const borderWidth = 2;
    
    fromX = fromData.x + fromWidth - borderWidth;  // Right edge of source element (inside border)
    fromY = fromData.y + (fromHeight / 2);  // Vertical center of source element
    
    toX = toData.x + borderWidth;  // Left edge of target element (inside border)
    toY = toData.y + (toHeight / 2);  // Vertical center of target element


    // Enhanced path generation with better routing
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = this.generateSmartConnectionPath(fromX, fromY, toX, toY, fromData, toData);
    const d = pathData.path;
    const connectionType = pathData.type;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', this.getConnectionColor(fromNode.status));
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    path.setAttribute('data-from', fromTaskId);
    path.setAttribute('data-to', toTaskId);
    path.setAttribute('class', `task-connection connection-${connectionType}`);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    // Add special styling for group connections
    const fromIsGroup = !!fromData.group; // use same logic as above
    const toIsGroup = !!toData.group;
    
    if (fromIsGroup) {
      path.classList.add('connection-group-source');
    }
    if (toIsGroup) {
      path.classList.add('connection-group-target');
    }

    // ENHANCED COLOR DIFFERENTIATION: Apply experience-specific CSS classes for better visual distinction
    if (connectionType === 'experience-project-clear') {
      const fromTaskId = fromData.task?.id || fromData.id;
      
      switch (fromTaskId) {
        case 'exp-momo':
          path.classList.add('connection-exp-momo');
          break;
        case 'exp-amanotes':
          path.classList.add('connection-exp-amanotes');
          break;
        case 'exp-fpt':
          path.classList.add('connection-exp-fpt');
          break;
        case 'exp-acb':
          path.classList.add('connection-exp-acb');
          break;
        default:
      }
    }

    const status = fromNode.status || 'pending';
    
    // Add appropriate marker
    const markers = this.connectionsLayer.querySelectorAll('marker');
    const markerIds = Array.from(markers).map(m => m.id);
    
    if (status === 'pending') {
      if (markerIds.includes('arrowhead')) {
        path.setAttribute('marker-end', 'url(#arrowhead)');
      }
    } else {
      const statusMarker = `arrowhead-${status}`;
      if (markerIds.includes(statusMarker)) {
        path.setAttribute('marker-end', `url(#${statusMarker})`);
      } else if (markerIds.includes('arrowhead')) {
        path.setAttribute('marker-end', 'url(#arrowhead)');
      }
    }

    if (animated) {
      path.classList.add('animated-connection');
    }

    // Add label if provided
    if (label) {
      this.addConnectionLabel(fromX, fromY, toX, toY, label);
    }

    try {
      if (!this.connectionsGroup) {
        return;
      }
      
      this.connectionsGroup.appendChild(path);
      
    } catch (svgError) {
    }
  }

  // Enhanced path generation with smart routing and connection clarity improvements
  generateSmartConnectionPath(fromX, fromY, toX, toY, fromData, toData) {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
    // PRIORITY 2: For direct connections (very short distances), use straight lines
    if (distance < 150) {
      return {
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
        type: 'direct'
      };
    }
    
    // PRIORITY 3: For normal forward connections, use smooth curve
    const controlOffset = Math.min(Math.abs(deltaX) * 0.4, 150);
    const controlY1 = fromY;
    const controlY2 = toY;
    
    return {
      path: `M ${fromX} ${fromY} C ${fromX + controlOffset} ${controlY1} ${toX - controlOffset} ${controlY2} ${toX} ${toY}`,
      type: 'curved'
    };
  }

  // NEW METHOD: Check if connection is experience → project
  isExperienceToProjectConnection(fromData, toData) {
    const fromIsExperience = fromData.task?.type === 'experience' || fromData.type === 'experience';
    const toIsProject = toData.task?.type === 'projects' || toData.type === 'projects';
    return fromIsExperience && toIsProject;
  }

  // NEW METHOD: Generate clear routing for experience → project connections with ZERO overlap
  generateClearExperienceProjectPath(fromX, fromY, toX, toY, fromData, toData) {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const fromTaskId = fromData.task?.id || fromData.id;
    
    // Create completely separate routing corridors to eliminate overlap
    let routingStrategy;
    
    switch (fromTaskId) {
      case 'exp-momo':
        // MoMo (y:150) - High dramatic curve going way above all tasks
        routingStrategy = {
          type: 'high-arc',
          peakY: fromY - 200, // Go 200px above starting point
          controlX1: fromX + 200,
          controlX2: toX - 200,
          description: 'High arc route - well above all other connections'
        };
        break;
      case 'exp-amanotes':
        // Amanotes (y:300) - Medium-high curve using left routing corridor  
        routingStrategy = {
          type: 'left-corridor',
          peakY: fromY - 100,
          controlX1: fromX + 100, // Less horizontal extension
          controlX2: toX - 300, // Route further left before turning
          description: 'Left corridor route - avoids center overlap'
        };
        break;
      case 'exp-fpt':
        // FPT (y:450) - Medium-low curve using right routing corridor
        routingStrategy = {
          type: 'right-corridor', 
          peakY: fromY + 100,
          controlX1: fromX + 300, // Route further right first
          controlX2: toX - 100, // Less horizontal extension at end
          description: 'Right corridor route - separate from left routes'
        };
        break;
      case 'exp-acb':
        // ACB (y:600) - Low dramatic curve going way below
        routingStrategy = {
          type: 'low-arc',
          peakY: fromY + 200, // Go 200px below starting point
          controlX1: fromX + 200,
          controlX2: toX - 200,
          description: 'Low arc route - well below all other connections'
        };
        break;
      default:
        // Default strategy for unknown tasks
        routingStrategy = {
          type: 'default',
          peakY: fromY + (deltaY > 0 ? 100 : -100),
          controlX1: fromX + 150,
          controlX2: toX - 150,
          description: 'Default routing'
        };
    }
    
    // Generate path using the routing strategy
    const { peakY, controlX1, controlX2, type, description } = routingStrategy;
    
    // Create a cubic Bézier curve that uses the routing corridor
    // This ensures each connection has its own "highway" and won't overlap
    const path = `M ${fromX} ${fromY} C ${controlX1} ${peakY} ${controlX2} ${peakY} ${toX} ${toY}`;
    
    
    return {
      path: path,
      type: 'experience-project-clear'
    };
  }

  // Add connection labels for complex flows
  addConnectionLabel(fromX, fromY, toX, toY, label) {
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', midY - 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'connection-label');
    text.setAttribute('font-size', '11px');
    text.setAttribute('fill', '#666');
    text.textContent = label;
    
    // Add text to DOM first to get proper bounding box
    this.connectionsGroup.appendChild(text);
    
    // Add background rectangle for readability
    const bbox = text.getBBox();
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', bbox.x - 3);
    rect.setAttribute('y', bbox.y - 1);
    rect.setAttribute('width', bbox.width + 6);
    rect.setAttribute('height', bbox.height + 2);
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke', '#ddd');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('rx', '3');
    rect.setAttribute('class', 'connection-label-bg');
    
    // Insert rectangle before text
    this.connectionsGroup.insertBefore(rect, text);
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

  // Enhanced connection handling for different types
  isGroupToGroupConnection(fromData, toData) {
    // Check if both from and to are groups (data came from this.groups.get())
    return !!fromData.group && !!toData.group;
  }

  isTaskToGroupConnection(fromData, toData) {
    // Check if from is a task and to is a group
    return !!fromData.task && !!toData.group;
  }

  isGroupToTaskConnection(fromData, toData) {
    // Check if from is a group and to is a task
    return !!fromData.group && !!toData.task;
  }

  // Enhanced method to create all types of connections
  createAllConnections() {
    
    // Clear existing connections first
    this.clearConnections();
    
    let connectionCount = 0;
    
    this.connections.forEach((conn, index) => {
      const fromData = this.tasks.get(conn.from) || this.groups.get(conn.from);
      const toData = this.tasks.get(conn.to) || this.groups.get(conn.to);
      
      if (fromData && toData) {
        // Determine connection type and style accordingly
        let connectionClass = 'task-connection';
        let strokeWidth = '3';
        let strokeStyle = '';
        
        if (this.isGroupToGroupConnection(fromData, toData)) {
          // Skip group-to-group connections entirely
          return; // Skip this connection
        } else if (this.isTaskToGroupConnection(fromData, toData)) {
        } else if (this.isGroupToTaskConnection(fromData, toData)) {
        } else {
        }
        
        this.drawConnection(conn.from, conn.to, conn.animated, conn.label);
        connectionCount++;
      } else {
      }
    });
    
  }

  createPortfolioDAG() {
    
    return new Promise((resolve, reject) => {
      try {
        this.clearCanvas();
        
        const dagData = portfolioData.dagStructure;
        
        if (!dagData || !dagData.tasks) {
          throw new Error('DAG structure not found in portfolio data');
        }

        // Create tasks and groups from the unified task list
        dagData.tasks.forEach((itemData, index) => {
          try {
            if (itemData.isGroup) {
              const group = new TaskGroup(
                itemData.id,
                itemData.title,
                [], // Task IDs can be associated later if needed
                false // Initial collapsed state
              );
              group.dependencies = itemData.dependencies || [];
              this.addGroup(group, itemData.position.x, itemData.position.y);
            } else {
              const task = new TaskNode(
                itemData.id, 
                itemData.title, 
                itemData.type, 
                itemData.status,
                itemData.description,
                itemData.position,
                itemData.details
              );
              task.dependencies = itemData.dependencies || [];
              task.group = itemData.group; // Assign group to task
              this.addTask(task, itemData.position.x, itemData.position.y);
            }
          } catch (itemError) {
          }
        });

        // Calculate group bounds after all tasks are created
        this.calculateGroupBounds();

        // Create connections based on dependencies
        let connectionCount = 0;
        dagData.tasks.forEach(itemData => {
          if (itemData.dependencies && itemData.dependencies.length > 0) {
            itemData.dependencies.forEach(dep => {
              let fromId, label = '';
              
              if (typeof dep === 'object') {
                fromId = dep.from;
                label = dep.label || '';
              } else {
                fromId = dep;
              }
              
              this.connections.push({ from: fromId, to: itemData.id, animated: false, label: label });
              connectionCount++;
            });
          }
        });


        // Add a test line to verify SVG is working
        this.addTestLine();

        // Defer connection drawing to ensure all elements are rendered and laid out
        requestAnimationFrame(() => {
          
          // Add visual indicator that connections are being processed
          const indicator = document.createElement('div')
          indicator.id = 'connection-debug-indicator'
          indicator.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9); color: white; padding: 20px;
            border-radius: 8px; z-index: 10000; font-family: monospace;
            border: 2px solid #3b82f6;
          `
          indicator.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 10px;">🔗</div>
              <div><strong>Drawing SVG Connections...</strong></div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">Fix Applied: SVG outside tasks-layer</div>
            </div>
          `
          document.body.appendChild(indicator)
          
          // Add comprehensive debugging before drawing connections
          this.comprehensiveDebug()
          
          this.redrawAllConnections();
          this.updateStats();
          this.updateDAGStatus();
          
          // Remove indicator and show results
          setTimeout(() => {
            document.body.removeChild(indicator)
            
            const pathCount = this.connectionsGroup?.querySelectorAll('path').length || 0
            
            if (pathCount === 0) {
              this.createTestElements()
            }
          }, 1000)
        });
        
        
        // Expose test functions globally for debugging
        window.testKingConnection = () => this.testKingConnection();
        window.workflowCanvas = this;
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  addTestLine() {
    if (this.connectionsGroup) {
      // Clear any existing test line
      const existingTestLine = this.connectionsGroup.querySelector('#test-line');
      if (existingTestLine) {
        existingTestLine.remove();
      }
      
      const testPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      testPath.setAttribute('d', 'M 100 100 L 400 200');
      testPath.setAttribute('stroke', '#ff0000');
      testPath.setAttribute('stroke-width', '6');
      testPath.setAttribute('fill', 'none');
      testPath.setAttribute('id', 'test-line');
      testPath.setAttribute('class', 'task-connection');
      testPath.setAttribute('stroke-linecap', 'round');
      
      this.connectionsGroup.appendChild(testPath);
      
      // Verify it was added and get its properties
      const testLine = this.connectionsGroup.querySelector('#test-line');
      if (testLine) {
        const testRect = testLine.getBoundingClientRect();
      }
    } else {
    }
  }

  // Method to manually trigger connection drawing for debugging
  debugDrawConnections() {
    
    this.connections.forEach((conn, index) => {
      const fromExists = this.tasks.has(conn.from) || this.groups.has(conn.from);
      const toExists = this.tasks.has(conn.to) || this.groups.has(conn.to);
    });
    
    this.redrawAllConnections();
  }

  // Debug function to test specific connections
  testKingConnection() {
    
    const kingData = this.tasks.get('king') || this.groups.get('king');
    const eduData = this.tasks.get('group-education') || this.groups.get('group-education');
    
    
    if (kingData && eduData) {
      this.drawConnection('king', 'group-education', false, 'test connection');
    } else {
    }
  }

  // ENHANCED COMPREHENSIVE DEBUGGING FUNCTION
  comprehensiveDebug() {
    
    // 1. Check container hierarchy
    
    // 2. Check SVG element state
    if (this.connectionsLayer) {
      const svgRect = this.connectionsLayer.getBoundingClientRect()
    }
    
    // 3. Check connections group
    if (this.connectionsGroup) {
      const groupRect = this.connectionsGroup.getBoundingClientRect()
      
      // Check each path in detail
      const paths = this.connectionsGroup.querySelectorAll('path')
      paths.forEach((path, index) => {
        const pathRect = path.getBoundingClientRect()
        const computedStyle = getComputedStyle(path)
      })
    }
    
    // 4. Check task positions
    this.tasks.forEach((taskData, taskId) => {
      const element = taskData.task.element
      if (element) {
        const rect = element.getBoundingClientRect()
        const style = getComputedStyle(element)
      }
    })
    
    // 5. Check canvas container positioning
    const canvasRect = this.canvas.getBoundingClientRect()
    const canvasStyle = getComputedStyle(this.canvas)
    
    const tasksLayerRect = this.tasksLayer.getBoundingClientRect()
    const tasksLayerStyle = getComputedStyle(this.tasksLayer)
    
    // 6. Test coordinate calculation manually
    if (this.connections.length > 0) {
      const testConn = this.connections[0]
      const fromData = this.tasks.get(testConn.from) || this.groups.get(testConn.from)
      const toData = this.tasks.get(testConn.to) || this.groups.get(testConn.to)
      
      if (fromData && toData) {
        const fromElement = fromData.task?.element || fromData.group?.element
        const toElement = toData.task?.element || toData.group?.element
        
        if (fromElement && toElement) {
          const fromRect = fromElement.getBoundingClientRect()
          const toRect = toElement.getBoundingClientRect()
          const canvasRect = this.tasksLayer.getBoundingClientRect()
          
          
          const fromX = (fromRect.left - canvasRect.left) + fromRect.width
          const fromY = (fromRect.top - canvasRect.top) + fromRect.height / 2
          const toX = toRect.left - canvasRect.left
          const toY = (toRect.top - canvasRect.top) + toRect.height / 2
          
        }
      }
    }
    
    // 7. Create a test visible element to verify SVG is working
    this.createTestElements()
    
  }

  // Create test elements to verify SVG rendering
  createTestElements() {
    if (!this.connectionsGroup) return
    
    // Remove any existing test elements
    this.connectionsGroup.querySelectorAll('[data-test]').forEach(el => el.remove())
    
    // Test 1: Simple red line
    const testLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    testLine1.setAttribute('x1', '50')
    testLine1.setAttribute('y1', '50')
    testLine1.setAttribute('x2', '200')
    testLine1.setAttribute('y2', '100')
    testLine1.setAttribute('stroke', '#ff0000')
    testLine1.setAttribute('stroke-width', '3')
    testLine1.setAttribute('data-test', 'line')
    this.connectionsGroup.appendChild(testLine1)
    
    // Test 2: Simple circle
    const testCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    testCircle.setAttribute('cx', '100')
    testCircle.setAttribute('cy', '150')
    testCircle.setAttribute('r', '20')
    testCircle.setAttribute('fill', '#00ff00')
    testCircle.setAttribute('data-test', 'circle')
    this.connectionsGroup.appendChild(testCircle)
    
    // Test 3: Path
    const testPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    testPath.setAttribute('d', 'M 300 50 Q 400 100 300 150')
    testPath.setAttribute('stroke', '#0000ff')
    testPath.setAttribute('stroke-width', '4')
    testPath.setAttribute('fill', 'none')
    testPath.setAttribute('data-test', 'path')
    this.connectionsGroup.appendChild(testPath)
    
    
    // Check if they're visible
    setTimeout(() => {
      const testElements = this.connectionsGroup.querySelectorAll('[data-test]')
      testElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
      })
    }, 100)
  }

  // COMPREHENSIVE TEST FUNCTION - Can be called from browser console
  testConnectionsVisibility() {
    
    // 1. Clear any existing connections and test elements
    this.clearConnections()
    
    // 2. Verify DOM structure is correct
    
    // 3. Add visible test elements
    this.createTestElements()
    
    // 4. Test coordinate calculation with current task positions
    const taskIds = Array.from(this.tasks.keys())
    if (taskIds.length >= 2) {
      const task1Id = taskIds[0]
      const task2Id = taskIds[1]
      
      const task1Data = this.tasks.get(task1Id)
      const task2Data = this.tasks.get(task2Id)
      
      if (task1Data && task2Data) {
        const elem1 = task1Data.task.element
        const elem2 = task2Data.task.element
        
        if (elem1 && elem2) {
          const rect1 = elem1.getBoundingClientRect()
          const rect2 = elem2.getBoundingClientRect()
          const canvasRect = this.canvas.getBoundingClientRect()
          
          
          const fromX = (rect1.left - canvasRect.left) + rect1.width
          const fromY = (rect1.top - canvasRect.top) + rect1.height / 2
          const toX = rect2.left - canvasRect.left
          const toY = (rect2.top - canvasRect.top) + rect2.height / 2
          
          
          // Draw a test connection
          const testPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          const d = `M ${fromX} ${fromY} L ${toX} ${toY}`
          testPath.setAttribute('d', d)
          testPath.setAttribute('stroke', '#ff0000')
          testPath.setAttribute('stroke-width', '6')
          testPath.setAttribute('fill', 'none')
          testPath.setAttribute('id', 'test-connection')
          testPath.setAttribute('data-test', 'connection')
          
          this.connectionsGroup.appendChild(testPath)
        }
      }
    }
    
    // 5. Force redraw all actual connections
    this.redrawAllConnections()
    
    // 6. Final verification
    setTimeout(() => {
      const allPaths = this.connectionsGroup.querySelectorAll('path')
      const testPaths = this.connectionsGroup.querySelectorAll('[data-test]')
      const realPaths = allPaths.length - testPaths.length
      
      
      allPaths.forEach((path, index) => {
        const rect = path.getBoundingClientRect()
        const isVisible = rect.width > 0 && rect.height > 0
      })
      
    }, 500)
  }

  calculateGroupBounds() {
    this.groups.forEach((groupData, groupId) => {
      const tasksInGroup = Array.from(this.tasks.values()).filter(
        (taskData) => taskData.task.group === groupId
      );

      if (tasksInGroup.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        tasksInGroup.forEach((taskData) => {
          const taskElement = taskData.task.element;
          if (taskElement) {
            minX = Math.min(minX, taskData.x);
            minY = Math.min(minY, taskData.y);
            maxX = Math.max(maxX, taskData.x + taskElement.offsetWidth);
            maxY = Math.max(maxY, taskData.y + taskElement.offsetHeight);
          }
        });

        const padding = 60; // Increased padding for more space
        const groupX = minX - padding;
        const groupY = minY - padding;
        const groupWidth = maxX - minX + 2 * padding;
        const groupHeight = maxY - minY + 2 * padding;

        groupData.x = groupX;
        groupData.y = groupY;
        groupData.group.width = groupWidth;
        groupData.group.height = groupHeight;

        groupData.group.updatePosition(groupX, groupY);
        groupData.group.updateSize(groupWidth, groupHeight);
      }
    });
  }

  redrawAllConnections(retryCount = 0) {
    
    const MAX_RETRIES = 5;
    if (retryCount > MAX_RETRIES) {
      return;
    }

    // Check if at least one task element has been rendered
    const tasksReady = Array.from(this.tasks.values()).some(
      (t) => t.task.element && t.task.element.offsetWidth > 0
    );


    if (!tasksReady && this.tasks.size > 0) {
      requestAnimationFrame(() => this.redrawAllConnections(retryCount + 1));
      return;
    }

    this.clearConnections();
    
    this.connections.forEach((conn, index) => {
      this.drawConnection(conn.from, conn.to, conn.animated, conn.label);
    });
    
  }

  clearConnections() {
    if (this.connectionsGroup) {
      const pathCount = this.connectionsGroup.querySelectorAll('path').length;
      
      // Log what's being cleared for debugging
      const paths = this.connectionsGroup.querySelectorAll('path');
      paths.forEach((path, index) => {
      });
      
      this.connectionsGroup.innerHTML = '';
      
      // Verify clearing worked
      const remainingPaths = this.connectionsGroup.querySelectorAll('path').length;
    } else {
    }
  }

  clearCanvas() {
    // Ensure DOM elements are available
    if (!this.tasksLayer) {
      this.tasksLayer = this.container.querySelector('.tasks-layer')
    }
    if (!this.connectionsLayer) {
      this.connectionsLayer = this.container.querySelector('.connections-layer')
    }
    if (!this.connectionsGroup) {
      this.connectionsGroup = this.container.querySelector('#connections-group')
    }

    if (this.tasksLayer) {
      this.tasksLayer.innerHTML = ''
    }
    
    if (this.connectionsGroup) {
      this.connectionsGroup.innerHTML = ''
    }
    
    this.tasks.clear()
    this.groups.clear()
    this.connections = []
  }

  runDAG() {
    this.updateDAGStatus('running')
    this.animateDAGExecution()
  }

  pauseDAG() {
    this.updateDAGStatus('paused')
    this.isAnimating = false
  }

  stopDAG() {
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
    }
    
    if (text) {
      text.textContent = `Portfolio DAG - ${status.charAt(0).toUpperCase() + status.slice(1)}`
    } else {
    }
  }

  updateStats() {
    
    const taskCount = this.tasks.size
    const successCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'success').length
    const runningCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'running').length
    const failedCount = Array.from(this.tasks.values()).filter(({ task }) => task.status === 'failed').length
    
    
    // Update with error handling
    const taskCountEl = this.container.querySelector('#task-count')
    const successCountEl = this.container.querySelector('#success-count')
    const runningCountEl = this.container.querySelector('#running-count')
    const failedCountEl = this.container.querySelector('#failed-count')
    
    if (taskCountEl) {
      taskCountEl.textContent = taskCount
    } else {
    }
    
    if (successCountEl) {
      successCountEl.textContent = successCount
    } else {
    }
    
    if (runningCountEl) {
      runningCountEl.textContent = runningCount
    } else {
    }
    
    if (failedCountEl) {
      failedCountEl.textContent = failedCount
    } else {
    }
  }

  zoom(factor, center = null) {
    const centerPoint = center || { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    
    const oldScale = this.scale;
    const newScale = Math.max(0.2, Math.min(this.scale * factor, 3));
    
    // Adjust pan to zoom towards the mouse pointer
    this.pan.x = centerPoint.x - (centerPoint.x - this.pan.x) * (newScale / oldScale);
    this.pan.y = centerPoint.y - (centerPoint.y - this.pan.y) * (newScale / oldScale);
    
    this.scale = newScale;
    
    this.updateCanvasTransform();
  }

  updateCanvasTransform() {
    // Apply the transform to the tasks layer
    this.tasksLayer.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    
    // ENHANCED: Apply same transform to connections layer for synchronization
    this.connectionsLayer.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    
    // Redraw connections with updated coordinates after a short delay
    setTimeout(() => {
      this.redrawAllConnections();
    }, 10);
  }

  fitToScreen() {
    if (this.tasks.size === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    this.tasks.forEach(taskData => {
        minX = Math.min(minX, taskData.x);
        minY = Math.min(minY, taskData.y);
        maxX = Math.max(maxX, taskData.x + 150); // Approx task width
        maxY = Math.max(maxY, taskData.y + 50);  // Approx task height
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth <= 0 || contentHeight <= 0) return;

    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;

    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    this.scale = Math.min(scaleX, scaleY) * 0.9; // Use 90% of scale to add padding

    // Center the content
    const scaledContentWidth = contentWidth * this.scale;
    const scaledContentHeight = contentHeight * this.scale;

    this.pan.x = (canvasWidth - scaledContentWidth) / 2 - minX * this.scale;
    this.pan.y = (canvasHeight - scaledContentHeight) / 2 - minY * this.scale;

    this.updateCanvasTransform();
  }

  centerDAG() {
    if (this.tasks.size === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    this.tasks.forEach(taskData => {
        minX = Math.min(minX, taskData.x);
        minY = Math.min(minY, taskData.y);
        maxX = Math.max(maxX, taskData.x + 150); // Approx task width
        maxY = Math.max(maxY, taskData.y + 50);  // Approx task height
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth <= 0 || contentHeight <= 0) return;

    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;

    // Center the content without changing scale
    const scaledContentWidth = contentWidth * this.scale;
    const scaledContentHeight = contentHeight * this.scale;

    this.pan.x = (canvasWidth - scaledContentWidth) / 2 - minX * this.scale;
    this.pan.y = (canvasHeight - scaledContentHeight) / 2 - minY * this.scale;

    this.updateCanvasTransform();
  }

  toggleSidebar() {
    // Sidebar removed in new layout - method kept for compatibility
  }

  runTask(taskId) {
    const taskData = this.tasks.get(taskId)
    if (taskData) {
      taskData.task.updateStatus('running')
      taskData.task.pulse()
      
      setTimeout(() => {
        taskData.task.updateStatus('success')
        taskData.task.pulse()
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
    this.createPortfolioDAG()
    this.scrollToShowAllComponents() // Use scroll-based centering
    // Force stats update after refresh
    setTimeout(() => {
      this.updateStats()
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
              taskToMove.y = Math.max(80, staticTask.y + (taskHeight + minSpacing))
            }
            
            // Update the task element position with animation
            if (taskToMove.task.element) {
              // FIXED: Use updatePosition for consistency
              taskToMove.task.updatePosition(taskToMove.x, taskToMove.y)
            }
            
            resolvedOverlaps.add(overlapKey)
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
            // FIXED: Use updatePosition for consistency
            taskData.task.updatePosition(x, y)
            
            // Add smooth transition for repositioning
            taskData.task.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }
          
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
        // FIXED: Use updatePosition for consistency
        group.updatePosition(x, y)
        group.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }
      
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

  toggleGroups() {
    
    // Find all group elements
    const groupElements = document.querySelectorAll('.task-node[data-is-group="true"]');
    const groupNodes = Array.from(this.tasks.values()).filter(taskData => taskData.task && taskData.task.isGroup);
    
    
    // Toggle visibility state
    if (!this.groupsVisible) {
      this.groupsVisible = true;
    } else {
      this.groupsVisible = !this.groupsVisible;
    }
    
    // Apply visibility changes
    groupElements.forEach(element => {
      if (this.groupsVisible) {
        element.style.display = 'block';
        element.style.opacity = '1';
      } else {
        element.style.display = 'none';
        element.style.opacity = '0';
      }
    });
    
    // Update connections since group visibility affects connections
    this.redrawAllConnections();
    
  }
}

// Make the instance available globally for button callbacks
window.WorkflowCanvas = WorkflowCanvas

// Global debugging functions
window.debugConnections = function() {
  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.workflowInstance) {
    canvas.workflowInstance.debugDrawConnections();
  } else {
  }
}

window.addTestLine = function() {
  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.workflowInstance) {
    canvas.workflowInstance.addTestLine();
  } else {
  }
}

window.inspectSVG = function() {
  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.workflowInstance) {
    const instance = canvas.workflowInstance;
    const svg = instance.connectionsLayer;
    const group = instance.connectionsGroup;
    
    
    const paths = group.querySelectorAll('path');
    paths.forEach((path, index) => {
        d: path.getAttribute('d'),
        stroke: path.getAttribute('stroke'),
        strokeWidth: path.getAttribute('stroke-width'),
        boundingRect: path.getBoundingClientRect()
      });
    });
  } else {
  }
}
