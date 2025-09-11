// Minimal Portfolio App - Progressive Loading Test
import './style.css'

console.log('🚀 Minimal portfolio app starting...')

// Test 1: Basic initialization
function initBasicPortfolio() {
  console.log('🎯 Starting basic portfolio initialization...')
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('❌ App container not found')
    return
  }

  // Remove loading screen immediately
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    console.log('🗑️ Removing loading screen...')
    loadingScreen.style.opacity = '0'
    setTimeout(() => {
      loadingScreen.remove()
      console.log('✅ Loading screen removed')
    }, 500)
  }

  // Show basic portfolio structure
  app.innerHTML = `
    <div class="portfolio-container" style="padding: 20px; font-family: Arial, sans-serif;">
      <header class="airflow-header" style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #017cee; margin: 0;">Dan Vo - Data Engineer</h1>
        <p style="color: #666; margin: 10px 0;">Interactive Portfolio DAG</p>
        <div style="color: #10b981;">● Portfolio DAG Running</div>
      </header>
      
      <main style="max-width: 1200px; margin: 0 auto;">
        <div id="workflow-canvas" style="background: #f8f9fa; border: 2px dashed #ccc; padding: 40px; text-align: center; border-radius: 8px;">
          <h2 style="color: #666;">Workflow Canvas</h2>
          <p>Loading portfolio visualization...</p>
          <button id="test-canvas" style="background: #017cee; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Test Canvas Loading
          </button>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <button id="next-step" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
            Next: Load WorkflowCanvas
          </button>
        </div>
      </main>
    </div>
  `

  // Add event listeners
  document.getElementById('test-canvas')?.addEventListener('click', () => {
    console.log('🧪 Testing canvas loading...')
    const canvas = document.getElementById('workflow-canvas')
    canvas.innerHTML = `
      <h2 style="color: #10b981;">✅ Canvas Test Successful</h2>
      <p>Basic DOM manipulation is working.</p>
    `
  })

  document.getElementById('next-step')?.addEventListener('click', () => {
    console.log('➡️ Loading next step...')
    loadWorkflowCanvas()
  })

  console.log('✅ Basic portfolio initialized successfully!')
}

// Test 2: Load WorkflowCanvas
async function loadWorkflowCanvas() {
  try {
    console.log('🔄 Loading WorkflowCanvas component...')
    
    const canvasContainer = document.getElementById('workflow-canvas')
    canvasContainer.innerHTML = '<p>Loading WorkflowCanvas...</p>'
    
    // Import WorkflowCanvas
    const { WorkflowCanvas } = await import('./components/WorkflowCanvas.js')
    console.log('✅ WorkflowCanvas imported successfully')
    
    // Create instance
    const canvas = new WorkflowCanvas('workflow-canvas')
    console.log('✅ WorkflowCanvas instance created')
    
    canvasContainer.innerHTML = `
      <h2 style="color: #10b981;">✅ WorkflowCanvas Loaded</h2>
      <p>WorkflowCanvas component is working.</p>
      <button id="next-step-2" style="background: #f59e0b; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
        Next: Load Portfolio Data
      </button>
    `
    
    document.getElementById('next-step-2')?.addEventListener('click', () => {
      loadPortfolioData(canvas)
    })
    
  } catch (error) {
    console.error('❌ Error loading WorkflowCanvas:', error)
    const canvasContainer = document.getElementById('workflow-canvas')
    canvasContainer.innerHTML = `
      <h2 style="color: #dc2626;">❌ WorkflowCanvas Failed</h2>
      <p>Error: ${error.message}</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: left; font-size: 12px;">${error.stack}</pre>
      <button onclick="location.reload()" style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
        Reload
      </button>
    `
  }
}

// Test 3: Load Portfolio Data
async function loadPortfolioData(canvas) {
  try {
    console.log('📊 Loading portfolio data...')
    
    const canvasContainer = document.getElementById('workflow-canvas')
    canvasContainer.innerHTML = '<p>Loading portfolio data...</p>'
    
    // Import portfolio data
    const { portfolioData } = await import('./data/portfolio-data.js')
    console.log('✅ Portfolio data imported successfully')
    console.log('📊 Portfolio data:', portfolioData)
    
    // Test DAG creation
    canvas.createPortfolioDAG()
    console.log('✅ Portfolio DAG created successfully')
    
    canvasContainer.innerHTML = `
      <h2 style="color: #10b981;">✅ Portfolio Fully Loaded</h2>
      <p>All components are working correctly!</p>
      <button onclick="location.reload()" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
        Reload to Test Again
      </button>
    `
    
  } catch (error) {
    console.error('❌ Error loading portfolio data:', error)
    const canvasContainer = document.getElementById('workflow-canvas')
    canvasContainer.innerHTML = `
      <h2 style="color: #dc2626;">❌ Portfolio Data Failed</h2>
      <p>Error: ${error.message}</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: left; font-size: 12px;">${error.stack}</pre>
    `
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBasicPortfolio)
} else {
  initBasicPortfolio()
}
