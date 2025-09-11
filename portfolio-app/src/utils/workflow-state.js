// Workflow State Management for Airflow-inspired Portfolio
// Centralized state management for task states, transitions, and DAG execution

export class WorkflowStateManager {
  constructor() {
    this.tasks = new Map()
    this.connections = new Map()
    this.dagStatus = 'pending'
    this.executionHistory = []
    this.listeners = new Map()
    this.isExecuting = false
  }

  // Task State Management
  addTask(taskId, initialState = 'pending', metadata = {}) {
    this.tasks.set(taskId, {
      id: taskId,
      status: initialState,
      metadata,
      lastUpdated: Date.now(),
      dependencies: metadata.dependencies || [],
      executions: []
    })
    this.emit('taskAdded', { taskId, state: initialState })
  }

  updateTaskStatus(taskId, newStatus, details = {}) {
    const task = this.tasks.get(taskId)
    if (!task) {
      console.warn(`Task ${taskId} not found`)
      return false
    }

    const oldStatus = task.status
    task.status = newStatus
    task.lastUpdated = Date.now()
    task.executions.push({
      timestamp: Date.now(),
      status: newStatus,
      details
    })

    this.emit('taskStatusChanged', {
      taskId,
      oldStatus,
      newStatus,
      task: { ...task }
    })

    this.updateDAGStatus()
    return true
  }

  getTaskStatus(taskId) {
    const task = this.tasks.get(taskId)
    return task ? task.status : null
  }

  getAllTasks() {
    return Array.from(this.tasks.values())
  }

  getTasksByStatus(status) {
    return this.getAllTasks().filter(task => task.status === status)
  }

  // Connection Management
  addConnection(fromTaskId, toTaskId) {
    const connectionId = `${fromTaskId}->${toTaskId}`
    this.connections.set(connectionId, {
      from: fromTaskId,
      to: toTaskId,
      status: 'pending'
    })
  }

  updateConnectionStatus(fromTaskId, toTaskId, status) {
    const connectionId = `${fromTaskId}->${toTaskId}`
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.status = status
      this.emit('connectionStatusChanged', { connectionId, status })
    }
  }

  // DAG State Management
  updateDAGStatus() {
    const tasks = this.getAllTasks()
    if (tasks.length === 0) {
      this.dagStatus = 'pending'
      return
    }

    const statusCounts = {
      pending: 0,
      running: 0,
      success: 0,
      failed: 0
    }

    tasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1
    })

    let newStatus = 'pending'
    if (statusCounts.failed > 0) {
      newStatus = 'failed'
    } else if (statusCounts.running > 0) {
      newStatus = 'running'
    } else if (statusCounts.success === tasks.length) {
      newStatus = 'success'
    } else if (statusCounts.success > 0) {
      newStatus = 'partial'
    }

    if (newStatus !== this.dagStatus) {
      const oldStatus = this.dagStatus
      this.dagStatus = newStatus
      this.emit('dagStatusChanged', { oldStatus, newStatus })
    }
  }

  getDAGStatus() {
    return this.dagStatus
  }

  // Task Execution Logic
  async executeDAG() {
    if (this.isExecuting) {
      console.warn('DAG is already executing')
      return false
    }

    this.isExecuting = true
    this.emit('dagExecutionStarted')

    try {
      const executionOrder = this.calculateExecutionOrder()
      
      for (const batch of executionOrder) {
        await this.executeBatch(batch)
      }

      this.emit('dagExecutionCompleted', { success: true })
    } catch (error) {
      console.error('DAG execution failed:', error)
      this.emit('dagExecutionCompleted', { success: false, error })
    } finally {
      this.isExecuting = false
    }
  }

  async executeBatch(taskIds) {
    const promises = taskIds.map(taskId => this.executeTask(taskId))
    await Promise.all(promises)
  }

  async executeTask(taskId) {
    const task = this.tasks.get(taskId)
    if (!task) return

    // Check if dependencies are satisfied
    const dependenciesSatisfied = this.areDependenciesSatisfied(taskId)
    if (!dependenciesSatisfied) {
      console.warn(`Dependencies not satisfied for task ${taskId}`)
      return
    }

    this.updateTaskStatus(taskId, 'running', { startTime: Date.now() })

    // Simulate task execution
    const executionTime = Math.random() * 2000 + 500 // 0.5-2.5 seconds
    const shouldSucceed = Math.random() > 0.1 // 90% success rate

    await new Promise(resolve => setTimeout(resolve, executionTime))

    const newStatus = shouldSucceed ? 'success' : 'failed'
    this.updateTaskStatus(taskId, newStatus, {
      endTime: Date.now(),
      executionTime
    })
  }

  areDependenciesSatisfied(taskId) {
    const task = this.tasks.get(taskId)
    if (!task || !task.dependencies) return true

    return task.dependencies.every(depId => {
      const depTask = this.tasks.get(depId)
      return depTask && depTask.status === 'success'
    })
  }

  calculateExecutionOrder() {
    const tasks = this.getAllTasks()
    const batches = []
    const processed = new Set()
    
    while (processed.size < tasks.length) {
      const currentBatch = []
      
      for (const task of tasks) {
        if (processed.has(task.id)) continue
        
        const dependenciesMet = task.dependencies.every(depId => 
          processed.has(depId)
        )
        
        if (dependenciesMet) {
          currentBatch.push(task.id)
        }
      }
      
      if (currentBatch.length === 0) {
        console.error('Circular dependency detected or orphaned tasks')
        break
      }
      
      currentBatch.forEach(taskId => processed.add(taskId))
      batches.push(currentBatch)
    }
    
    return batches
  }

  // State Persistence
  saveState() {
    const state = {
      tasks: Array.from(this.tasks.entries()),
      connections: Array.from(this.connections.entries()),
      dagStatus: this.dagStatus,
      executionHistory: this.executionHistory,
      timestamp: Date.now()
    }
    
    localStorage.setItem('portfolioWorkflowState', JSON.stringify(state))
    return state
  }

  loadState() {
    try {
      const savedState = localStorage.getItem('portfolioWorkflowState')
      if (!savedState) return false

      const state = JSON.parse(savedState)
      
      this.tasks = new Map(state.tasks)
      this.connections = new Map(state.connections)
      this.dagStatus = state.dagStatus
      this.executionHistory = state.executionHistory || []
      
      this.emit('stateLoaded', state)
      return true
    } catch (error) {
      console.error('Failed to load workflow state:', error)
      return false
    }
  }

  clearState() {
    this.tasks.clear()
    this.connections.clear()
    this.dagStatus = 'pending'
    this.executionHistory = []
    this.isExecuting = false
    
    localStorage.removeItem('portfolioWorkflowState')
    this.emit('stateCleared')
  }

  // Event System
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  // Utility Methods
  getExecutionStats() {
    const tasks = this.getAllTasks()
    return {
      total: tasks.length,
      pending: this.getTasksByStatus('pending').length,
      running: this.getTasksByStatus('running').length,
      success: this.getTasksByStatus('success').length,
      failed: this.getTasksByStatus('failed').length,
      completion: tasks.length > 0 ? this.getTasksByStatus('success').length / tasks.length : 0
    }
  }

  getTaskExecutionHistory(taskId) {
    const task = this.tasks.get(taskId)
    return task ? task.executions : []
  }

  resetAllTasks() {
    for (const [taskId] of this.tasks) {
      this.updateTaskStatus(taskId, 'pending')
    }
    this.emit('allTasksReset')
  }

  validateDAG() {
    const issues = []
    
    // Check for circular dependencies
    const visited = new Set()
    const recursionStack = new Set()
    
    const hasCycle = (taskId) => {
      if (recursionStack.has(taskId)) {
        issues.push(`Circular dependency detected involving task: ${taskId}`)
        return true
      }
      
      if (visited.has(taskId)) return false
      
      visited.add(taskId)
      recursionStack.add(taskId)
      
      const task = this.tasks.get(taskId)
      if (task && task.dependencies) {
        for (const depId of task.dependencies) {
          if (hasCycle(depId)) return true
        }
      }
      
      recursionStack.delete(taskId)
      return false
    }
    
    for (const [taskId] of this.tasks) {
      if (!visited.has(taskId)) {
        hasCycle(taskId)
      }
    }
    
    // Check for missing dependencies
    for (const [taskId, task] of this.tasks) {
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          if (!this.tasks.has(depId)) {
            issues.push(`Task ${taskId} depends on non-existent task: ${depId}`)
          }
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    }
  }
}

// Create and export a singleton instance
export const workflowState = new WorkflowStateManager()

// Export individual status constants for convenience
export const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  SKIPPED: 'skipped'
}

export const DAGStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  PARTIAL: 'partial'
}
