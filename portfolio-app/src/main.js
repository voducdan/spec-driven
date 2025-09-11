import './style.css'
import { WorkflowCanvas } from './components/WorkflowCanvas.js'
import { portfolioData } from './data/portfolio-data.js'

// Add global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
})

// Enhanced portfolio initialization with full DAG visualization
async function initPortfolio() {
  console.log('🚀 Starting full portfolio initialization with DAG...')
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('App container not found')
    return
  }

  // Remove loading screen
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    console.log('🗑️ Removing loading screen...')
    loadingScreen.remove()
  }

  try {
    // Full-screen DAG visualization layout
    document.body.innerHTML = `
      <div class="dag-fullscreen-container">
        <header class="dag-header">
          <div class="dag-title">
            <h1>Portfolio DAG - ${portfolioData.personal.name}</h1>
            <span class="dag-subtitle">Interactive Data Engineering Portfolio</span>
          </div>
          <div class="dag-status-container">
            <div class="dag-status-grid">
              <div class="status-card total">
                <span class="status-icon">📊</span>
                <span class="status-label">Total Tasks</span>
                <span class="status-value" id="task-count">0</span>
              </div>
              <div class="status-card success">
                <span class="status-icon">✅</span>
                <span class="status-label">Completed</span>
                <span class="status-value" id="success-count">0</span>
              </div>
              <div class="status-card running">
                <span class="status-icon">🔄</span>
                <span class="status-label">In Progress</span>
                <span class="status-value" id="running-count">0</span>
              </div>
              <div class="status-card failed">
                <span class="status-icon">❌</span>
                <span class="status-label">Issues</span>
                <span class="status-value" id="failed-count">0</span>
              </div>
            </div>
          </div>
          <div class="dag-controls">
            <button class="btn-secondary" onclick="window.location.reload()">🔄 Refresh</button>
            <button class="btn-secondary" onclick="window.print()">📄 Print</button>
          </div>
        </header>
        
        <div class="dag-canvas-fullscreen">
          <div id="workflow-canvas"></div>
        </div>
      </div>
    `

    console.log('✅ DAG layout created, initializing WorkflowCanvas...')

    // Initialize the WorkflowCanvas
    const canvas = new WorkflowCanvas('workflow-canvas')
    
    // Store canvas reference globally for debugging
    window.portfolioCanvas = canvas
    
    console.log('📊 Creating portfolio DAG...')
    await canvas.createPortfolioDAG()
    
    console.log('🎯 Centering DAG view...')
    canvas.centerDAG()
    
    console.log('✅ Portfolio DAG initialization completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during portfolio initialization:', error)
    
    // Fallback to simple portfolio view
    document.body.innerHTML = `
      <div class="error-message">
        <h3>🚨 Portfolio Loading Error</h3>
        <p>There was an issue loading the interactive DAG visualization.</p>
        <p>Error: ${error.message}</p>
        <button class="btn-primary" onclick="window.location.reload()">Try Again</button>
      </div>
    `
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPortfolio())
} else {
  initPortfolio()
}
