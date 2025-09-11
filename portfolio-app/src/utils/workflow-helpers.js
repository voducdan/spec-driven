// Workflow helper utilities for Airflow-inspired portfolio
export const workflowHelpers = {
  // Task status management
  taskStatuses: {
    PENDING: 'pending',
    RUNNING: 'running',
    SUCCESS: 'success',
    FAILED: 'failed',
    SKIPPED: 'skipped',
  },

  // Calculate task dependencies and execution order
  calculateExecutionOrder(tasks) {
    const visited = new Set()
    const visiting = new Set()
    const result = []

    function visit(taskId) {
      if (visiting.has(taskId)) {
        throw new Error(`Circular dependency detected involving task: ${taskId}`)
      }

      if (visited.has(taskId)) {
        return
      }

      visiting.add(taskId)

      const task = tasks.find(t => t.id === taskId)
      if (task && task.dependencies) {
        task.dependencies.forEach(depId => visit(depId))
      }

      visiting.delete(taskId)
      visited.add(taskId)
      result.push(taskId)
    }

    tasks.forEach(task => {
      if (!visited.has(task.id)) {
        visit(task.id)
      }
    })

    return result
  },

  // Generate SVG path for task connections
  generateConnectionPath(from, to, type = 'direct') {
    const fromX = from.x + 200 // Task width
    const fromY = from.y + 30 // Task height center
    const toX = to.x
    const toY = to.y + 30

    switch (type) {
      case 'curved': {
        const midX = (fromX + toX) / 2
        return `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`
      }

      case 'step': {
        const stepX = fromX + 50
        return `M ${fromX} ${fromY} L ${stepX} ${fromY} L ${stepX} ${toY} L ${toX} ${toY}`
      }

      default: // direct
        return `M ${fromX} ${fromY} L ${toX} ${toY}`
    }
  },

  // Animate task state transitions
  animateTaskTransition(taskElement, fromStatus, toStatus) {
    taskElement.classList.add('transitioning')
    taskElement.classList.remove(`status-${fromStatus}`)

    setTimeout(() => {
      taskElement.classList.add(`status-${toStatus}`)
      taskElement.classList.remove('transitioning')
    }, 300)
  },

  // Calculate DAG layout using force-directed positioning
  calculateLayout(tasks, _groups = []) {
    const positions = new Map()

    // Simple layered layout based on dependencies
    const layers = this.calculateLayers(tasks)
    const layerHeight = 150
    const layerWidth = 400 // Horizontal spacing between dependency layers

    layers.forEach((layer, layerIndex) => {
      const y = 100 + layerIndex * layerHeight
      
      // Calculate spacing to distribute tasks evenly across the layer
      const baseX = 100 + layerIndex * layerWidth // Different x-coordinate for each layer
      const spacingBetweenTasks = 300 // Spacing between tasks in the same layer
      
      layer.forEach((taskId, taskIndex) => {
        const x = baseX + taskIndex * spacingBetweenTasks
        positions.set(taskId, { x, y })
      })
    })

    return positions
  },

  // Group tasks into layers based on dependencies
  calculateLayers(tasks) {
    const layers = []
    const taskMap = new Map(tasks.map(t => [t.id, t]))
    const visited = new Set()
    const layerMap = new Map()

    function calculateTaskLayer(taskId) {
      if (layerMap.has(taskId)) {
        return layerMap.get(taskId)
      }

      if (visited.has(taskId)) {
        // Circular dependency - assign to layer 0
        layerMap.set(taskId, 0)
        return 0
      }

      visited.add(taskId)
      const task = taskMap.get(taskId)
      
      if (!task || !task.dependencies || task.dependencies.length === 0) {
        layerMap.set(taskId, 0)
        return 0
      }

      let maxDepLayer = -1
      for (const depId of task.dependencies) {
        const depLayer = calculateTaskLayer(depId)
        maxDepLayer = Math.max(maxDepLayer, depLayer)
      }

      const taskLayer = maxDepLayer + 1
      layerMap.set(taskId, taskLayer)
      return taskLayer
    }

    // Calculate layers for all tasks
    tasks.forEach(task => {
      calculateTaskLayer(task.id)
    })

    // Group tasks by layer
    layerMap.forEach((layer, taskId) => {
      if (!layers[layer]) {
        layers[layer] = []
      }
      layers[layer].push(taskId)
    })

    // Remove empty layers
    return layers.filter(layer => layer && layer.length > 0)
  },

  // Simulate DAG execution
  simulateExecution(tasks, onStatusChange) {
    const executionOrder = this.calculateExecutionOrder(tasks)
    let currentIndex = 0

    function executeNext() {
      if (currentIndex >= executionOrder.length) {
        console.log('Portfolio DAG execution completed!')
        return
      }

      const taskId = executionOrder[currentIndex]
      const task = tasks.find(t => t.id === taskId)

      if (task) {
        // Set to running
        task.status = 'running'
        onStatusChange?.(taskId, 'running')

        // Simulate task execution time
        const executionTime = Math.random() * 2000 + 1000 // 1-3 seconds

        setTimeout(() => {
          // Random success/failure (mostly success for portfolio)
          const success = Math.random() > 0.1 // 90% success rate
          task.status = success ? 'success' : 'failed'
          onStatusChange?.(taskId, task.status)

          currentIndex++
          executeNext()
        }, executionTime)
      }
    }

    executeNext()
  },

  // Export DAG to Airflow Python code
  exportToAirflow(tasks, dagId = 'portfolio_dag') {
    const pythonCode = `
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator

default_args = {
    'owner': 'dan_vo',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    '${dagId}',
    default_args=default_args,
    description='Dan Vo Portfolio DAG',
    schedule_interval=None,
    catchup=False
)

# Define tasks
${tasks
  .map(
    task => `
${task.id} = DummyOperator(
    task_id='${task.id}',
    dag=dag
)`
  )
  .join('')}

# Set dependencies
${tasks
  .map(task =>
    task.dependencies && task.dependencies.length > 0
      ? `${task.id}.set_upstream([${task.dependencies.join(', ')}])`
      : ''
  )
  .filter(Boolean)
  .join('\n')}
`

    return pythonCode
  },
}
