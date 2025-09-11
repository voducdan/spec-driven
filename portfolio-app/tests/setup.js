// Test setup file for Vitest
import { expect, beforeEach } from 'vitest'

// Global test setup
beforeEach(() => {
  // Clear the DOM before each test
  document.body.innerHTML = ''
  
  // Reset any global state
  if (window.portfolio) {
    delete window.portfolio
  }
})

// Custom matchers
expect.extend({
  toBeValidTaskNode(received) {
    const pass = received && 
                 received.id && 
                 received.title && 
                 received.type && 
                 received.status
    
    return {
      pass,
      message: () => pass 
        ? `Expected ${received} not to be a valid task node`
        : `Expected ${received} to be a valid task node with id, title, type, and status`
    }
  },
  
  toHaveValidDAGStructure(received) {
    const pass = received && 
                 Array.isArray(received.tasks) && 
                 received.tasks.length > 0 &&
                 received.tasks.every(task => 
                   task.id && task.type && task.status
                 )
    
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to have valid DAG structure`
        : `Expected ${received} to have valid DAG structure with tasks array`
    }
  }
})

// Mock browser APIs that might not be available in test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock SVG methods
global.SVGElement = class SVGElement {
  getBBox() {
    return { width: 100, height: 50, x: 0, y: 0 }
  }
}
