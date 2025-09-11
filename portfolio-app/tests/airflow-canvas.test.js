// T003: Airflow Canvas Test - DAG visualization canvas tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WorkflowCanvas } from '../src/components/WorkflowCanvas.js'
import { TaskNode } from '../src/components/TaskNode.js'

describe('Airflow Canvas - DAG Visualization', () => {
  let container
  let canvas

  beforeEach(() => {
    // Create a container element for the canvas
    container = document.createElement('div')
    container.id = 'test-canvas'
    document.body.appendChild(container)
  })

  describe('Canvas Initialization', () => {
    it('should create a workflow canvas with proper structure', () => {
      canvas = new WorkflowCanvas('test-canvas')
      
      expect(canvas.container).toBe(container)
      expect(canvas.tasks).toBeInstanceOf(Map)
      expect(canvas.groups).toBeInstanceOf(Map)
      expect(canvas.connections).toBeInstanceOf(Array)
    })

    it('should initialize with toolbar and canvas elements', () => {
      canvas = new WorkflowCanvas('test-canvas')
      
      const toolbar = container.querySelector('.workflow-toolbar')
      const canvasEl = container.querySelector('.workflow-canvas')
      const connectionsLayer = container.querySelector('.connections-layer')
      const tasksLayer = container.querySelector('.tasks-layer')
      
      expect(toolbar).toBeTruthy()
      expect(canvasEl).toBeTruthy()
      expect(connectionsLayer).toBeTruthy()
      expect(tasksLayer).toBeTruthy()
    })

    it('should handle missing container gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      canvas = new WorkflowCanvas('non-existent-container')
      
      expect(consoleSpy).toHaveBeenCalledWith('Canvas container not found')
      consoleSpy.mockRestore()
    })
  })

  describe('Task Node Management', () => {
    beforeEach(() => {
      canvas = new WorkflowCanvas('test-canvas')
    })

    it('should add task nodes to the canvas', () => {
      const task = new TaskNode('test-task', 'Test Task', 'education', 'success')
      const result = canvas.addTask(task, 100, 200)
      
      expect(result).toBe(task)
      expect(canvas.tasks.get('test-task')).toEqual({
        task,
        x: 100,
        y: 200
      })
    })

    it('should render task nodes in the tasks layer', () => {
      const task = new TaskNode('test-task', 'Test Task', 'education', 'success')
      canvas.addTask(task, 100, 200)
      
      const taskElement = container.querySelector('#task-test-task')
      expect(taskElement).toBeTruthy()
      expect(taskElement.style.left).toBe('100px')
      expect(taskElement.style.top).toBe('200px')
    })

    it('should handle multiple task nodes', () => {
      const task1 = new TaskNode('task-1', 'Task 1', 'education', 'success')
      const task2 = new TaskNode('task-2', 'Task 2', 'experience', 'running')
      
      canvas.addTask(task1, 100, 100)
      canvas.addTask(task2, 300, 100)
      
      expect(canvas.tasks.size).toBe(2)
      expect(container.querySelectorAll('.task-node')).toHaveLength(2)
    })
  })

  describe('Task Connections', () => {
    beforeEach(() => {
      canvas = new WorkflowCanvas('test-canvas')
      
      // Add two tasks to connect
      const task1 = new TaskNode('task-1', 'Task 1', 'education', 'success')
      const task2 = new TaskNode('task-2', 'Task 2', 'experience', 'pending')
      
      canvas.addTask(task1, 100, 100)
      canvas.addTask(task2, 300, 100)
    })

    it('should create connections between tasks', () => {
      canvas.addConnection('task-1', 'task-2')
      
      expect(canvas.connections).toEqual([{
        from: 'task-1',
        to: 'task-2'
      }])
    })

    it('should draw SVG connections between tasks', () => {
      canvas.addConnection('task-1', 'task-2')
      
      const connections = container.querySelectorAll('.task-connection')
      expect(connections).toHaveLength(1)
      
      const line = connections[0]
      expect(line.tagName.toLowerCase()).toBe('line')
      expect(line.getAttribute('class')).toBe('task-connection')
    })

    it('should handle invalid connections gracefully', () => {
      // Try to connect non-existent tasks
      canvas.addConnection('non-existent-1', 'non-existent-2')
      
      // Should not crash, but no connection should be drawn
      const connections = container.querySelectorAll('.task-connection')
      expect(connections).toHaveLength(0)
    })
  })

  describe('Portfolio DAG Creation', () => {
    beforeEach(() => {
      canvas = new WorkflowCanvas('test-canvas')
    })

    it('should create the main portfolio workflow', () => {
      canvas.createPortfolioDAG()
      
      // Check that main tasks are created
      expect(canvas.tasks.get('edu')).toBeTruthy()
      expect(canvas.tasks.get('exp')).toBeTruthy()
      expect(canvas.tasks.get('skills')).toBeTruthy()
      expect(canvas.tasks.get('projects')).toBeTruthy()
    })

    it('should create proper task flow dependencies', () => {
      canvas.createPortfolioDAG()
      
      // Check connections follow the expected flow
      const expectedConnections = [
        { from: 'edu', to: 'exp' },
        { from: 'exp', to: 'skills' },
        { from: 'skills', to: 'projects' }
      ]
      
      expectedConnections.forEach(expected => {
        expect(canvas.connections).toContainEqual(expected)
      })
    })

    it('should position tasks in proper DAG layout', () => {
      canvas.createPortfolioDAG()
      
      const eduTask = canvas.tasks.get('edu')
      const expTask = canvas.tasks.get('exp')
      const skillsTask = canvas.tasks.get('skills')
      const projectsTask = canvas.tasks.get('projects')
      
      // Tasks should be positioned left-to-right
      expect(eduTask.x).toBeLessThan(expTask.x)
      expect(expTask.x).toBeLessThan(skillsTask.x)
      expect(skillsTask.x).toBeLessThan(projectsTask.x)
      
      // Tasks should be at same Y level
      expect(eduTask.y).toBe(expTask.y)
      expect(expTask.y).toBe(skillsTask.y)
      expect(skillsTask.y).toBe(projectsTask.y)
    })
  })

  describe('Canvas Controls', () => {
    beforeEach(() => {
      canvas = new WorkflowCanvas('test-canvas')
    })

    it('should have zoom controls', () => {
      const zoomIn = container.querySelector('#zoom-in')
      const zoomOut = container.querySelector('#zoom-out')
      const fitScreen = container.querySelector('#fit-screen')
      
      expect(zoomIn).toBeTruthy()
      expect(zoomOut).toBeTruthy() 
      expect(fitScreen).toBeTruthy()
    })

    it('should handle zoom in functionality', () => {
      const canvasEl = container.querySelector('.workflow-canvas')
      const zoomInBtn = container.querySelector('#zoom-in')
      
      // Initial state
      expect(canvasEl.style.transform).toBe('')
      
      // Trigger zoom in
      zoomInBtn.click()
      
      // Should apply scale transform
      expect(canvasEl.style.transform).toContain('scale(1.2)')
    })

    it('should handle zoom out functionality', () => {
      const canvasEl = container.querySelector('.workflow-canvas')
      const zoomInBtn = container.querySelector('#zoom-in')
      const zoomOutBtn = container.querySelector('#zoom-out')
      
      // Set initial zoom by zooming in first
      zoomInBtn.click() // This should set scale to 1.2
      
      // Trigger zoom out
      zoomOutBtn.click()
      
      // Should reduce scale to 1.2 * 0.8 = 0.96
      expect(canvasEl.style.transform).toContain('scale(0.96)')
    })

    it('should reset zoom with fit to screen', () => {
      const canvasEl = container.querySelector('.workflow-canvas')
      const fitScreenBtn = container.querySelector('#fit-screen')
      
      // Set some zoom
      canvasEl.style.transform = 'scale(2)'
      
      // Trigger fit to screen
      fitScreenBtn.click()
      
      // Should reset to scale(1)
      expect(canvasEl.style.transform).toBe('scale(1)')
    })
  })

  describe('DAG Refresh', () => {
    beforeEach(() => {
      canvas = new WorkflowCanvas('test-canvas')
    })

    it('should have refresh functionality', () => {
      const refreshBtn = container.querySelector('#refresh-dag')
      expect(refreshBtn).toBeTruthy()
    })

    it('should recreate DAG on refresh', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const refreshBtn = container.querySelector('#refresh-dag')
      
      // Initial state - no tasks
      expect(canvas.tasks.size).toBe(0)
      
      // Trigger refresh
      refreshBtn.click()
      
      // Should recreate portfolio DAG
      expect(consoleSpy).toHaveBeenCalledWith('Refreshing Portfolio DAG...')
      expect(canvas.tasks.size).toBeGreaterThan(0)
      
      consoleSpy.mockRestore()
    })
  })
})
