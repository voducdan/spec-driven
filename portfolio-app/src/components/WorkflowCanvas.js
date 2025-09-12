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
    this.groupsVisible = true // Groups are visible by default
    
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

    console.log('🔍 Querying DOM elements...')
    this.canvas = this.container.querySelector('#canvas')
    this.tasksLayer = this.container.querySelector('.tasks-layer')
    this.connectionsLayer = this.container.querySelector('.connections-layer')
    this.connectionsGroup = this.container.querySelector('#connections-group');

    // Verify the SVG is now outside the tasks-layer
    console.log('🏗️ DOM Structure Verification:')
    console.log(`  - SVG parent: ${this.connectionsLayer.parentElement.className}`)
    console.log(`  - Tasks layer parent: ${this.tasksLayer.parentElement.className}`)
    console.log(`  - Are SVG and tasks-layer siblings? ${this.connectionsLayer.parentElement === this.tasksLayer.parentElement}`)

    // Log canvas dimensions for debugging
    console.log(`📐 Canvas dimensions: ${this.canvasWidth} x ${this.canvasHeight}`);

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
    console.log(`🎨 SVG element details:`);
    console.log(`  - Width attribute: ${this.connectionsLayer.getAttribute('width')}`);
    console.log(`  - Height attribute: ${this.connectionsLayer.getAttribute('height')}`);
    console.log(`  - Computed width: ${this.connectionsLayer.clientWidth}`);
    console.log(`  - Computed height: ${this.connectionsLayer.clientHeight}`);
    console.log(`  - BoundingClientRect: ${JSON.stringify(this.connectionsLayer.getBoundingClientRect())}`);
    
    console.log('✅ All DOM elements found successfully')
    console.log('🎧 Setting up event listeners...')
    this.setupEventListeners()
    
    console.log('🖱️ Setting up pan and zoom...')
    this.setupPanAndZoom()
    
    // Store instance on canvas element for debugging
    this.canvas.workflowInstance = this;
    
    // Expose comprehensive debug function globally
    window.debugWorkflow = () => this.comprehensiveDebug()
    window.addTestLine = () => this.addTestLine()
    window.debugConnections = () => this.debugDrawConnections()
    window.testConnections = () => this.testConnectionsVisibility()
    window.inspectSVG = inspectSVG
    
    console.log('🔧 Debug functions exposed: window.debugWorkflow(), window.addTestLine(), window.debugConnections(), window.testConnections(), window.inspectSVG()')
    
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

    // The wheel listener for zoom should be on the main canvas to ensure it
    // always captures events, regardless of child element transformations.
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false })
    console.log('✅ Wheel listener for zoom attached to canvas')
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
    
    // Add hover listeners to manage blur effect
    taskElement.addEventListener('mouseenter', () => this.handleTaskHover(task.id, true));
    taskElement.addEventListener('mouseleave', () => this.handleTaskHover(task.id, false));

    // Add click handler for sidebar updates
    taskElement.addEventListener('click', () => this.selectTask(task))
    
    // Log the task element for debugging
    console.log(`✅ Task "${task.title}" element created:`, taskElement)
    console.log(`📍 Task position: left=${taskElement.style.left}, top=${taskElement.style.top}`)
    
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
      console.error('❌ Tasks layer not available for adding group:', group.id)
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
    this.connections.push({ from: fromTaskId, to: toTaskId, animated });
  }

  drawConnection(fromTaskId, toTaskId, animated = false, label = '') {
    console.log(`🔗 Attempting to draw connection: ${fromTaskId} -> ${toTaskId}`);
    
    const fromData = this.tasks.get(fromTaskId) || this.groups.get(fromTaskId);
    const toData = this.tasks.get(toTaskId) || this.groups.get(toTaskId);

    if (!fromData || !toData) {
      console.warn(`Task data not found for connection: ${fromTaskId} -> ${toTaskId}`);
      return;
    }

    const fromNode = fromData.task || fromData.group;
    const toNode = toData.task || toData.group;

    const fromElement = fromNode.element;
    const toElement = toNode.element;

    if (!fromElement || !toElement) {
      console.warn(`Task element not found for connection: ${fromTaskId} -> ${toTaskId}`);
      return;
    }

    // ENHANCED: Use model coordinates directly (no transform multiplication)
    // SVG now follows the same transform as tasks layer, so coordinates should match
    const fromX = fromData.x + 240; // Right edge (task width = 240)
    const fromY = fromData.y + 75;  // Vertical center (task height = 150/2)
    const toX = toData.x;           // Left edge  
    const toY = toData.y + 75;      // Vertical center

    console.log(`📊 ENHANCED Connection coordinates: from(${fromX.toFixed(1)}, ${fromY.toFixed(1)}) to(${toX.toFixed(1)}, ${toY.toFixed(1)})`);
    console.log(`🔄 Transform: scale=${this.scale.toFixed(2)}, pan=(${this.pan.x.toFixed(1)}, ${this.pan.y.toFixed(1)})`);
    console.log(`📍 Model positions: from(${fromData.x}, ${fromData.y}) to(${toData.x}, ${toData.y})`);

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
    const fromIsGroup = fromData.isGroup === true;
    const toIsGroup = toData.isGroup === true;
    
    if (fromIsGroup) {
      path.classList.add('connection-group-source');
    }
    if (toIsGroup) {
      path.classList.add('connection-group-target');
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
        console.error('❌ Connections group not found!');
        return;
      }
      
      this.connectionsGroup.appendChild(path);
      console.log(`✅ Enhanced connection added: ${fromTaskId} -> ${toTaskId}`);
      
    } catch (svgError) {
      console.error(`❌ Failed to create SVG connection line:`, svgError);
    }
  }

  // Enhanced path generation with smart routing
  generateSmartConnectionPath(fromX, fromY, toX, toY, fromData, toData) {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // For short distances, use direct line
    if (distance < 150) {
      return {
        path: `M ${fromX} ${fromY} L ${toX} ${toY}`,
        type: 'direct'
      };
    }
    
    // For connections that go backwards or have large Y differences, use stepped path
    if (deltaX < 0 || Math.abs(deltaY) > 200) {
      const midX = fromX + Math.max(50, Math.abs(deltaX) * 0.3);
      return {
        path: `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`,
        type: 'stepped'
      };
    }
    
    // For normal forward connections, use smooth curve
    const controlOffset = Math.min(Math.abs(deltaX) * 0.4, 150);
    const controlY1 = fromY;
    const controlY2 = toY;
    
    return {
      path: `M ${fromX} ${fromY} C ${fromX + controlOffset} ${controlY1} ${toX - controlOffset} ${controlY2} ${toX} ${toY}`,
      type: 'curved'
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
    return (fromData.group && toData.group) || 
           (this.groups.has(fromData.from) && this.groups.has(toData.to));
  }

  isTaskToGroupConnection(fromData, toData) {
    return (!fromData.group && toData.group) || 
           (!this.groups.has(fromData.from) && this.groups.has(toData.to));
  }

  isGroupToTaskConnection(fromData, toData) {
    return (fromData.group && !toData.group) || 
           (this.groups.has(fromData.from) && !this.groups.has(toData.to));
  }

  // Enhanced method to create all types of connections
  createAllConnections() {
    console.log('🔗 Creating all connection types...');
    
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
          connectionClass += ' group-connection';
          strokeWidth = '4';
          strokeStyle = '6 3'; // dashed
          console.log(`🏢 Drawing group-to-group connection: ${conn.from} -> ${conn.to}`);
        } else if (this.isTaskToGroupConnection(fromData, toData)) {
          console.log(`📋 Drawing task-to-group connection: ${conn.from} -> ${conn.to}`);
        } else if (this.isGroupToTaskConnection(fromData, toData)) {
          console.log(`🏢📋 Drawing group-to-task connection: ${conn.from} -> ${conn.to}`);
        } else {
          console.log(`📋📋 Drawing task-to-task connection: ${conn.from} -> ${conn.to}`);
        }
        
        this.drawConnection(conn.from, conn.to, conn.animated, conn.label);
        connectionCount++;
      } else {
        console.warn(`⚠️ Connection ${conn.from} -> ${conn.to} skipped - missing data`);
      }
    });
    
    console.log(`✅ Created ${connectionCount} connections of various types`);
  }

  createPortfolioDAG() {
    console.log('🚀 Starting portfolio DAG creation...');
    
    return new Promise((resolve, reject) => {
      try {
        this.clearCanvas();
        
        const dagData = portfolioData.dagStructure;
        console.log('📊 DAG data loaded:', dagData);
        
        if (!dagData || !dagData.tasks) {
          throw new Error('DAG structure not found in portfolio data');
        }

        // Create tasks and groups from the unified task list
        console.log(`📝 Creating ${dagData.tasks.length} tasks and groups...`);
        dagData.tasks.forEach((itemData, index) => {
          console.log(`Creating item ${index + 1}: ${itemData.title}`);
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
              console.log(`✅ Group "${itemData.title}" created successfully`);
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
              console.log(`✅ Task "${itemData.title}" created successfully`);
            }
          } catch (itemError) {
            console.error(`❌ Failed to create item "${itemData.title}":`, itemError);
          }
        });

        // Calculate group bounds after all tasks are created
        this.calculateGroupBounds();

        // Create connections based on dependencies
        console.log('🔗 Creating task connections...');
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
              console.log(`📍 Connection ${connectionCount}: ${fromId} -> ${itemData.id} ${label ? `(${label})` : ''}`);
            });
          }
        });

        console.log(`📊 Total connections created: ${this.connections.length}`);

        // Add a test line to verify SVG is working
        this.addTestLine();

        // Defer connection drawing to ensure all elements are rendered and laid out
        requestAnimationFrame(() => {
          console.log('🎬 Running deferred connection drawing...')
          
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
            
            console.log('🔍 Post-draw verification:')
            const pathCount = this.connectionsGroup?.querySelectorAll('path').length || 0
            console.log(`📊 Total paths in DOM: ${pathCount}`)
            
            // Show success/failure notification
            const result = document.createElement('div')
            result.style.cssText = `
              position: fixed; top: 20px; right: 20px; 
              background: ${pathCount > 0 ? '#10b981' : '#ef4444'}; color: white;
              padding: 15px; border-radius: 8px; z-index: 10000;
              font-family: monospace; max-width: 300px;
            `
            result.innerHTML = `
              <div style="font-weight: bold;">
                ${pathCount > 0 ? '✅ CONNECTIONS DRAWN!' : '❌ NO CONNECTIONS'}
              </div>
              <div style="font-size: 12px; margin-top: 5px;">
                ${pathCount > 0 ? `${pathCount} paths created successfully` : 'Check console for debugging info'}
              </div>
              <div style="font-size: 11px; margin-top: 5px; opacity: 0.8;">
                ${pathCount > 0 ? 'SVG positioning fix working' : 'Run window.testConnections() to debug'}
              </div>
            `
            document.body.appendChild(result)
            
            // Auto-remove notification after 5 seconds
            setTimeout(() => {
              if (document.body.contains(result)) {
                document.body.removeChild(result)
              }
            }, 5000)
            
            if (pathCount === 0) {
              console.log('⚠️ No paths found after drawing - attempting manual test draw')
              this.createTestElements()
            }
          }, 1000)
        });
        
        console.log('✅ Portfolio DAG created successfully!');
        resolve();
      } catch (error) {
        console.error('❌ Fatal error during portfolio DAG creation:', error);
        reject(error);
      }
    });
  }

  addTestLine() {
    console.log('🧪 Adding test line to verify SVG functionality');
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
      console.log('✅ Test line added to connections group');
      
      // Verify it was added and get its properties
      const testLine = this.connectionsGroup.querySelector('#test-line');
      console.log(`🔍 Test line found in DOM: ${!!testLine}`);
      if (testLine) {
        const testRect = testLine.getBoundingClientRect();
        console.log(`📦 Test line bounding rect: ${JSON.stringify(testRect)}`);
        console.log(`📍 Test line d attribute: ${testLine.getAttribute('d')}`);
        console.log(`🎨 Test line computed style stroke: ${getComputedStyle(testLine).stroke}`);
      }
    } else {
      console.error('❌ Cannot add test line - connectionsGroup not found');
    }
  }

  // Method to manually trigger connection drawing for debugging
  debugDrawConnections() {
    console.log('🐛 Manual debug connection drawing triggered');
    console.log(`📊 Available tasks: ${Array.from(this.tasks.keys()).join(', ')}`);
    console.log(`📊 Available groups: ${Array.from(this.groups.keys()).join(', ')}`);
    console.log(`📊 Defined connections: ${this.connections.length}`);
    
    this.connections.forEach((conn, index) => {
      console.log(`🔗 Connection ${index + 1}: ${conn.from} -> ${conn.to}`);
      const fromExists = this.tasks.has(conn.from) || this.groups.has(conn.from);
      const toExists = this.tasks.has(conn.to) || this.groups.has(conn.to);
      console.log(`  - From exists: ${fromExists}, To exists: ${toExists}`);
    });
    
    this.redrawAllConnections();
  }

  // ENHANCED COMPREHENSIVE DEBUGGING FUNCTION
  comprehensiveDebug() {
    console.log('🔍 === COMPREHENSIVE SVG CONNECTION DEBUG ===')
    
    // 1. Check container hierarchy
    console.log('📂 Container hierarchy:')
    console.log('  this.container:', this.container)
    console.log('  this.canvas:', this.canvas)
    console.log('  this.tasksLayer:', this.tasksLayer)
    console.log('  this.connectionsLayer:', this.connectionsLayer)
    console.log('  this.connectionsGroup:', this.connectionsGroup)
    
    // 2. Check SVG element state
    if (this.connectionsLayer) {
      console.log('🎨 SVG Layer Analysis:')
      const svgRect = this.connectionsLayer.getBoundingClientRect()
      console.log(`  Dimensions: ${this.connectionsLayer.getAttribute('width')} x ${this.connectionsLayer.getAttribute('height')}`)
      console.log(`  Client size: ${this.connectionsLayer.clientWidth} x ${this.connectionsLayer.clientHeight}`)
      console.log(`  BoundingRect:`, svgRect)
      console.log(`  Visibility: ${getComputedStyle(this.connectionsLayer).visibility}`)
      console.log(`  Display: ${getComputedStyle(this.connectionsLayer).display}`)
      console.log(`  Opacity: ${getComputedStyle(this.connectionsLayer).opacity}`)
      console.log(`  Z-index: ${getComputedStyle(this.connectionsLayer).zIndex}`)
      console.log(`  Position: ${getComputedStyle(this.connectionsLayer).position}`)
      console.log(`  Transform: ${getComputedStyle(this.connectionsLayer).transform}`)
    }
    
    // 3. Check connections group
    if (this.connectionsGroup) {
      console.log('🎯 Connections Group Analysis:')
      const groupRect = this.connectionsGroup.getBoundingClientRect()
      console.log(`  BoundingRect:`, groupRect)
      console.log(`  Children count: ${this.connectionsGroup.children.length}`)
      console.log(`  Paths count: ${this.connectionsGroup.querySelectorAll('path').length}`)
      
      // Check each path in detail
      const paths = this.connectionsGroup.querySelectorAll('path')
      paths.forEach((path, index) => {
        const pathRect = path.getBoundingClientRect()
        const computedStyle = getComputedStyle(path)
        console.log(`    Path ${index + 1}:`)
        console.log(`      d: ${path.getAttribute('d')}`)
        console.log(`      stroke: ${path.getAttribute('stroke')}`)
        console.log(`      stroke-width: ${path.getAttribute('stroke-width')}`)
        console.log(`      BoundingRect:`, pathRect)
        console.log(`      Computed stroke: ${computedStyle.stroke}`)
        console.log(`      Computed stroke-width: ${computedStyle.strokeWidth}`)
        console.log(`      Computed visibility: ${computedStyle.visibility}`)
        console.log(`      Computed opacity: ${computedStyle.opacity}`)
        console.log(`      Total length: ${path.getTotalLength && path.getTotalLength()}`)
      })
    }
    
    // 4. Check task positions
    console.log('📍 Task Positions Analysis:')
    this.tasks.forEach((taskData, taskId) => {
      const element = taskData.task.element
      if (element) {
        const rect = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        console.log(`  ${taskId}:`)
        console.log(`    BoundingRect:`, rect)
        console.log(`    Transform: ${style.transform}`)
        console.log(`    Position: ${style.position}`)
        console.log(`    Z-index: ${style.zIndex}`)
      }
    })
    
    // 5. Check canvas container positioning
    console.log('🏠 Canvas Container Analysis:')
    const canvasRect = this.canvas.getBoundingClientRect()
    const canvasStyle = getComputedStyle(this.canvas)
    console.log(`  Canvas BoundingRect:`, canvasRect)
    console.log(`  Canvas transform: ${canvasStyle.transform}`)
    console.log(`  Canvas position: ${canvasStyle.position}`)
    console.log(`  Canvas overflow: ${canvasStyle.overflow}`)
    
    const tasksLayerRect = this.tasksLayer.getBoundingClientRect()
    const tasksLayerStyle = getComputedStyle(this.tasksLayer)
    console.log(`  TasksLayer BoundingRect:`, tasksLayerRect)
    console.log(`  TasksLayer transform: ${tasksLayerStyle.transform}`)
    console.log(`  TasksLayer position: ${tasksLayerStyle.position}`)
    console.log(`  TasksLayer overflow: ${tasksLayerStyle.overflow}`)
    
    // 6. Test coordinate calculation manually
    console.log('🧮 Manual Coordinate Test:')
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
          
          console.log(`  Test connection: ${testConn.from} -> ${testConn.to}`)
          console.log(`  From element rect:`, fromRect)
          console.log(`  To element rect:`, toRect)
          console.log(`  Canvas rect:`, canvasRect)
          
          const fromX = (fromRect.left - canvasRect.left) + fromRect.width
          const fromY = (fromRect.top - canvasRect.top) + fromRect.height / 2
          const toX = toRect.left - canvasRect.left
          const toY = (toRect.top - canvasRect.top) + toRect.height / 2
          
          console.log(`  Calculated coordinates: from(${fromX}, ${fromY}) to(${toX}, ${toY})`)
        }
      }
    }
    
    // 7. Create a test visible element to verify SVG is working
    console.log('🧪 Creating test visible elements...')
    this.createTestElements()
    
    console.log('✅ === DEBUG COMPLETE ===')
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
    
    console.log('🎨 Test elements created: line, circle, path')
    
    // Check if they're visible
    setTimeout(() => {
      const testElements = this.connectionsGroup.querySelectorAll('[data-test]')
      testElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
        console.log(`  Test element ${index + 1} (${element.getAttribute('data-test')}):`, rect)
      })
    }, 100)
  }

  // COMPREHENSIVE TEST FUNCTION - Can be called from browser console
  testConnectionsVisibility() {
    console.log('🧪 === COMPREHENSIVE CONNECTION VISIBILITY TEST ===')
    
    // 1. Clear any existing connections and test elements
    this.clearConnections()
    
    // 2. Verify DOM structure is correct
    console.log('🏗️ DOM Structure Check:')
    console.log(`  SVG parent: ${this.connectionsLayer.parentElement.className}`)
    console.log(`  Tasks layer parent: ${this.tasksLayer.parentElement.className}`)
    console.log(`  Are they siblings? ${this.connectionsLayer.parentElement === this.tasksLayer.parentElement}`)
    
    // 3. Add visible test elements
    console.log('🎨 Adding test elements...')
    this.createTestElements()
    
    // 4. Test coordinate calculation with current task positions
    console.log('📍 Testing coordinate calculations:')
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
          
          console.log(`  Task ${task1Id} rect:`, rect1)
          console.log(`  Task ${task2Id} rect:`, rect2)
          console.log(`  Canvas rect:`, canvasRect)
          
          const fromX = (rect1.left - canvasRect.left) + rect1.width
          const fromY = (rect1.top - canvasRect.top) + rect1.height / 2
          const toX = rect2.left - canvasRect.left
          const toY = (rect2.top - canvasRect.top) + rect2.height / 2
          
          console.log(`  Calculated connection: (${fromX}, ${fromY}) -> (${toX}, ${toY})`)
          
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
          console.log('✅ Test connection drawn')
        }
      }
    }
    
    // 5. Force redraw all actual connections
    console.log('🔄 Redrawing all actual connections...')
    this.redrawAllConnections()
    
    // 6. Final verification
    setTimeout(() => {
      const allPaths = this.connectionsGroup.querySelectorAll('path')
      const testPaths = this.connectionsGroup.querySelectorAll('[data-test]')
      const realPaths = allPaths.length - testPaths.length
      
      console.log(`📊 Final count: ${allPaths.length} total paths (${realPaths} real, ${testPaths.length} test)`)
      
      allPaths.forEach((path, index) => {
        const rect = path.getBoundingClientRect()
        const isVisible = rect.width > 0 && rect.height > 0
        console.log(`  Path ${index + 1}: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'} - ${path.getAttribute('d')}`)
      })
      
      console.log('✅ === TEST COMPLETE ===')
    }, 500)
  }

  calculateGroupBounds() {
    console.log('📏 Calculating group bounds...');
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
        console.log(`✅ Group "${groupData.group.title}" bounds calculated:`, { x: groupX, y: groupY, width: groupWidth, height: groupHeight });
      }
    });
  }

  redrawAllConnections(retryCount = 0) {
    console.log(`🎨 redrawAllConnections called (attempt ${retryCount + 1})`);
    
    const MAX_RETRIES = 5;
    if (retryCount > MAX_RETRIES) {
      console.error("❌ Max retries reached. Could not draw connections because task elements have no dimensions.");
      return;
    }

    // Check if at least one task element has been rendered
    const tasksReady = Array.from(this.tasks.values()).some(
      (t) => t.task.element && t.task.element.offsetWidth > 0
    );

    console.log(`📋 Tasks ready check: ${tasksReady}, total tasks: ${this.tasks.size}, total connections: ${this.connections.length}`);

    if (!tasksReady && this.tasks.size > 0) {
      console.warn(`🎨 Task elements not ready. Retrying connection draw... (Attempt ${retryCount + 1})`);
      requestAnimationFrame(() => this.redrawAllConnections(retryCount + 1));
      return;
    }

    this.clearConnections();
    console.log(`🧹 Connections cleared. Drawing ${this.connections.length} connections...`);
    
    this.connections.forEach((conn, index) => {
      console.log(`🔗 Drawing connection ${index + 1}/${this.connections.length}: ${conn.from} -> ${conn.to}`);
      this.drawConnection(conn.from, conn.to, conn.animated, conn.label);
    });
    
    console.log(`✅ redrawAllConnections completed`);
  }

  clearConnections() {
    if (this.connectionsGroup) {
      const pathCount = this.connectionsGroup.querySelectorAll('path').length;
      console.log(`🧹 Clearing ${pathCount} existing connections`);
      
      // Log what's being cleared for debugging
      const paths = this.connectionsGroup.querySelectorAll('path');
      paths.forEach((path, index) => {
        console.log(`  Removing path ${index + 1}: ${path.getAttribute('d')}`);
      });
      
      this.connectionsGroup.innerHTML = '';
      console.log(`✅ Connections cleared`);
      
      // Verify clearing worked
      const remainingPaths = this.connectionsGroup.querySelectorAll('path').length;
      console.log(`📊 Remaining paths after clear: ${remainingPaths}`);
    } else {
      console.error('❌ Cannot clear connections - connectionsGroup not found');
    }
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
    if (!this.connectionsGroup) {
      console.warn('Connections group not found, reinitializing...')
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
    console.log('🎯 DAG centered successfully');
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
              taskToMove.y = Math.max(80, staticTask.y + (taskHeight + minSpacing))
            }
            
            // Update the task element position with animation
            if (taskToMove.task.element) {
              // FIXED: Use updatePosition for consistency
              taskToMove.task.updatePosition(taskToMove.x, taskToMove.y)
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
            // FIXED: Use updatePosition for consistency
            taskData.task.updatePosition(x, y)
            
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
        // FIXED: Use updatePosition for consistency
        group.updatePosition(x, y)
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

  toggleGroups() {
    console.log('🔄 Toggling group visibility...');
    
    // Find all group elements
    const groupElements = document.querySelectorAll('.task-node[data-is-group="true"]');
    const groupNodes = Array.from(this.tasks.values()).filter(taskData => taskData.task && taskData.task.isGroup);
    
    console.log(`Found ${groupElements.length} group elements and ${groupNodes.length} group nodes`);
    
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
    
    console.log(`✅ Groups ${this.groupsVisible ? 'shown' : 'hidden'}`);
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
    console.error('No workflow instance found');
  }
}

window.addTestLine = function() {
  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.workflowInstance) {
    canvas.workflowInstance.addTestLine();
  } else {
    console.error('No workflow instance found');
  }
}

window.inspectSVG = function() {
  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.workflowInstance) {
    const instance = canvas.workflowInstance;
    const svg = instance.connectionsLayer;
    const group = instance.connectionsGroup;
    
    console.log('=== SVG Inspection ===');
    console.log('SVG element:', svg);
    console.log('SVG dimensions:', svg.getAttribute('width'), 'x', svg.getAttribute('height'));
    console.log('SVG computed size:', svg.clientWidth, 'x', svg.clientHeight);
    console.log('SVG bounding rect:', svg.getBoundingClientRect());
    console.log('Connections group:', group);
    console.log('Paths in group:', group.querySelectorAll('path').length);
    
    const paths = group.querySelectorAll('path');
    paths.forEach((path, index) => {
      console.log(`Path ${index + 1}:`, {
        d: path.getAttribute('d'),
        stroke: path.getAttribute('stroke'),
        strokeWidth: path.getAttribute('stroke-width'),
        boundingRect: path.getBoundingClientRect()
      });
    });
  } else {
    console.error('No workflow instance found');
  }
}
