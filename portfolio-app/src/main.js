import './style.css'

// Add global error handling with detailed logging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
  console.error('Stack:', e.error?.stack)
  console.error('File:', e.filename, 'Line:', e.lineno)
  
  // Show error to user if loading fails
  showErrorMessage('JavaScript Error', e.error?.message || 'Unknown error occurred')
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
  showErrorMessage('Loading Error', 'Failed to load portfolio components')
})

// Import components with error handling
let WorkflowCanvas, portfolioData

async function loadComponents() {
  try {
    console.log('🔄 Loading portfolio components...')
    
    const [canvasModule, dataModule] = await Promise.all([
      import('./components/WorkflowCanvas.js'),
      import('./data/portfolio-data.js')
    ])
    
    WorkflowCanvas = canvasModule.WorkflowCanvas
    portfolioData = dataModule.portfolioData
    
    console.log('✅ Components loaded successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to load components:', error)
    showErrorMessage('Component Loading Error', `Failed to load portfolio components: ${error.message}`)
    return false
  }
}

function showErrorMessage(title, message) {
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="loading-content">
        <div class="airflow-logo" style="color: #ef4444;">❌</div>
        <h2 style="color: #ef4444;">${title}</h2>
        <p style="margin: 1rem 0; color: #6b7280;">${message}</p>
        <button onclick="window.location.reload()" style="
          background: #3b82f6; 
          color: white; 
          border: none; 
          padding: 0.5rem 1rem; 
          border-radius: 4px; 
          cursor: pointer;
          font-size: 0.9rem;
        ">🔄 Retry</button>
      </div>
    `
  }
}

// Enhanced portfolio initialization with full DAG visualization
async function initPortfolio() {
  console.log('🚀 Starting full portfolio initialization with DAG...')
  
  // First, try to load components
  const componentsLoaded = await loadComponents()
  if (!componentsLoaded) {
    return // Error already shown by loadComponents
  }
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('App container not found')
    showErrorMessage('Setup Error', 'Application container not found')
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

    // Initialize the WorkflowCanvas with error handling
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
      <div class="error-message" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #1e3a8a, #3b82f6);
        color: white;
      ">
        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; backdrop-filter: blur(10px);">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">🚨 Portfolio Loading Error</h2>
          <p style="margin-bottom: 1rem;">There was an issue loading the interactive DAG visualization.</p>
          <p style="margin-bottom: 2rem; font-family: monospace; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 4px;">
            Error: ${error.message}
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="window.location.reload()" style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 1rem;
            ">🔄 Try Again</button>
            <a href="mailto:voducdand99@gmail.com" style="
              background: #10b981; 
              color: white; 
              text-decoration: none;
              padding: 0.75rem 1.5rem; 
              border-radius: 6px; 
              font-size: 1rem;
            ">📧 Contact</a>
          </div>
        </div>
      </div>
    `
  }
}

// Initialize when DOM is ready with timeout fallback
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM Content Loaded - Starting initialization...')
    initPortfolio()
  })
} else {
  console.log('📱 DOM Already Ready - Starting initialization...')
  initPortfolio()
}

// Emergency fallback - if nothing happens in 15 seconds, show error
setTimeout(() => {
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    console.error('🚨 Emergency timeout - Portfolio failed to load')
    showErrorMessage('Timeout Error', 'Portfolio took too long to load. This may be due to slow network or script errors.')
  }
}, 15000)
