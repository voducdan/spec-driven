import './style.css'
import { WorkflowCanvas } from './components/WorkflowCanvas.js'
import { portfolioData } from './data/portfolio-data.js'
import { workflowState } from './utils/workflow-state.js'
import { performanceOptimizer } from './utils/performance.js'
import { accessibilityManager } from './utils/accessibility.js'

// Initialize the Airflow-inspired portfolio
async function initPortfolio() {
  console.log('🚀 Starting portfolio initialization...')
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('App container not found')
    return
  }

  // Don't remove loading screen immediately - keep it until everything is ready
  console.log('⏸️ Keeping loading screen until initialization complete...')

  app.innerHTML = `
    <div class="portfolio-container">
      <header class="airflow-header">
        <div class="header-content">
          <h1>${portfolioData.personal.name}</h1>
          <p class="title">${portfolioData.personal.title}</p>
          <p class="subtitle">Interactive Portfolio DAG</p>
        </div>
        <div class="dag-info">
          <span class="dag-status running">●</span>
          <span>Portfolio DAG Running</span>
        </div>
      </header>
      
      <main class="workflow-container">
        <div id="workflow-canvas" class="canvas-wrapper">
          <!-- Airflow workflow visualization will be rendered here -->
        </div>
        
        <div class="portfolio-sidebar">
          <div class="dag-controls">
            <h3>DAG Controls</h3>
            <button id="run-dag" class="btn-primary">▶ Run Portfolio DAG</button>
            <button id="pause-dag" class="btn-secondary">⏸ Pause</button>
            <button id="refresh-dag" class="btn-secondary">🔄 Refresh</button>
          </div>
          
          <div class="task-legend">
            <h4>Task Status</h4>
            <div class="legend-item">
              <span class="status-dot success"></span>
              <span>Completed</span>
            </div>
            <div class="legend-item">
              <span class="status-dot running"></span>
              <span>In Progress</span>
            </div>
            <div class="legend-item">
              <span class="status-dot pending"></span>
              <span>Pending</span>
            </div>
            <div class="legend-item">
              <span class="status-dot failed"></span>
              <span>Failed</span>
            </div>
          </div>
        </div>
      </main>
      
      <footer class="portfolio-footer">
        <p>Built with Airflow-inspired DAG visualization | ${new Date().getFullYear()}</p>
      </footer>
    </div>
  `

  // Initialize the workflow canvas
  try {
    console.log('🎯 Initializing workflow canvas...')
    await initWorkflowCanvas()
    console.log('✅ Portfolio initialization complete!')
    
    // Now remove loading screen after successful initialization
    const loadingScreen = document.querySelector('.loading-screen')
    if (loadingScreen) {
      console.log('🗑️ Removing loading screen after successful initialization...')
      loadingScreen.remove()
    }
  } catch (error) {
    console.error('❌ Failed to initialize workflow canvas:', error)
    
    // Remove loading screen and show error
    const loadingScreen = document.querySelector('.loading-screen')
    if (loadingScreen) {
      loadingScreen.remove()
    }
    
    showError(error)
  }
}

async function initWorkflowCanvas() {
  console.log('🎯 Starting workflow canvas initialization...')
  
  // Ensure the canvas container exists
  const canvasContainer = document.getElementById('workflow-canvas')
  if (!canvasContainer) {
    throw new Error('Workflow canvas container not found')
  }
  
  console.log('📦 Creating WorkflowCanvas...')
  const canvas = new WorkflowCanvas('workflow-canvas')

  if (!canvas) {
    throw new Error('Failed to create WorkflowCanvas instance')
  }

  console.log('🎨 WorkflowCanvas created successfully')
  
  // Initialize performance optimization if available
  try {
    if (performanceOptimizer && typeof performanceOptimizer.optimizeCanvas === 'function') {
      if (canvas.canvas && canvas.context) {
        performanceOptimizer.optimizeCanvas(canvas.canvas, canvas.context)
        console.log('⚡ Performance optimization applied')
      }
    }
  } catch (perfError) {
    console.warn('⚠️ Performance optimization failed:', perfError)
  }

  // Create the portfolio DAG
  console.log('🏗️ Creating portfolio DAG...')
  canvas.createPortfolioDAG()
  console.log('✅ Portfolio DAG created successfully!')

  // Setup control buttons
  setupDagControls(canvas)

  // Initialize workflow state
  if (workflowState && typeof workflowState.loadState === 'function') {
    workflowState.loadState()
  }
  
  console.log('✅ Workflow Canvas initialized successfully!')
}

function showError(error) {
  console.error('❌ Portfolio error:', error)
  
  const canvasContainer = document.getElementById('workflow-canvas')
  if (canvasContainer) {
    canvasContainer.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 40px; color: #dc2626;">
        <h3>Error Loading Portfolio</h3>
        <p>There was an issue loading the portfolio visualization.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="location.reload()" class="btn-primary" style="margin-top: 20px;">Retry</button>
      </div>
    `
  }
}

function setupDagControls(canvas) {
  const runBtn = document.getElementById('run-dag')
  const pauseBtn = document.getElementById('pause-dag')
  const refreshBtn = document.getElementById('refresh-dag')

  runBtn?.addEventListener('click', () => {
    console.log('Running Portfolio DAG...')
    runBtn.textContent = '⏳ Running...'
    runBtn.disabled = true

    // Simulate DAG execution
    setTimeout(() => {
      runBtn.textContent = '✅ Completed'
      setTimeout(() => {
        runBtn.textContent = '▶ Run Portfolio DAG'
        runBtn.disabled = false
      }, 2000)
    }, 3000)
  })

  pauseBtn?.addEventListener('click', () => {
    console.log('Pausing Portfolio DAG...')
  })

  refreshBtn?.addEventListener('click', () => {
    console.log('Refreshing Portfolio DAG...')
    canvas.refresh()
  })
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPortfolio())
} else {
  initPortfolio()
}
