import './style.css'
import { portfolioData } from './data/portfolio-data.js'
import { WorkflowCanvas } from './components/WorkflowCanvas.js'


// Add global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
  showErrorMessage('JavaScript Error', e.error?.message || 'Unknown error occurred')
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
  showErrorMessage('Loading Error', 'Failed to load portfolio components')
})

function showErrorMessage(title, message) {
  const app = document.querySelector('#app')
  if (app) {
    app.innerHTML = `
      <div style="
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
        <div style="
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 2rem;
          max-width: 500px;
        ">
          <h2 style="color: #fca5a5; margin-bottom: 1rem;">${title}</h2>
          <p style="margin-bottom: 1.5rem;">${message}</p>
          <button onclick="window.location.reload()" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          ">Reload Page</button>
        </div>
      </div>
    `
  }
}

// Enhanced portfolio initialization with DAG visualization
async function initPortfolio() {
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('App container not found')
    showErrorMessage('Setup Error', 'Application container not found')
    return
  }

  // Remove loading screen
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    loadingScreen.remove()
  }

  try {
    
    // Apply Airflow layout structure to the app container
    app.style.cssText = `
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `
    
    // Let WorkflowCanvas create its own complete layout
    app.innerHTML = `<div id="workflow-canvas" style="flex: 1; width: 100%; height: 100%;"></div>`


    const updateDebug = (step, tasks = 0, scroll = 'Not attached', error = '') => {
      const stepEl = document.getElementById('debug-step')
      const tasksEl = document.getElementById('debug-tasks')
      const scrollEl = document.getElementById('debug-scroll')
      const errorEl = document.getElementById('debug-error')
      
      if (stepEl) stepEl.textContent = `Step: ${step}`
      if (tasksEl) tasksEl.textContent = `Tasks: ${tasks}`
      if (scrollEl) scrollEl.textContent = `Scroll: ${scroll}`
      if (errorEl) errorEl.textContent = error
    }

    // Initialize the WorkflowCanvas with error handling
    updateDebug('Creating WorkflowCanvas...')
    const canvas = new WorkflowCanvas('workflow-canvas')
    
    // Store canvas reference globally for debugging
    window.portfolioCanvas = canvas
    
    updateDebug('Creating portfolio DAG...')
    await canvas.createPortfolioDAG()
    
    updateDebug('DAG created, centering view...', canvas.tasks.size)
    canvas.centerDAG()
    
    // Check if scroll functionality is working
    if (canvas.tasksLayer) {
      updateDebug('Checking scroll functionality...', canvas.tasks.size, 'Attached')
      
      // Test scroll functionality
      canvas.tasksLayer.addEventListener('scroll', () => {
        updateDebug('Scroll detected!', canvas.tasks.size, 'Working')
      })
      
    } else {
      updateDebug('ERROR: tasksLayer not found', canvas.tasks.size, 'Failed', 'tasksLayer missing')
    }
    
    updateDebug('Initialization complete!', canvas.tasks.size, 'Ready')
    
  } catch (error) {
    console.error('❌ Error during portfolio initialization:', error)
    
    // Update debug overlay with error
    const updateDebug = (step, tasks = 0, scroll = 'Not attached', error = '') => {
      const stepEl = document.getElementById('debug-step')
      const tasksEl = document.getElementById('debug-tasks')
      const scrollEl = document.getElementById('debug-scroll')
      const errorEl = document.getElementById('debug-error')
      
      if (stepEl) stepEl.textContent = `Step: ${step}`
      if (tasksEl) tasksEl.textContent = `Tasks: ${tasks}`
      if (scrollEl) scrollEl.textContent = `Scroll: ${scroll}`
      if (errorEl) errorEl.textContent = error
    }
    
    updateDebug('FAILED', 0, 'Error', error.message)
    
    showErrorMessage('Portfolio Loading Error', `Failed to load interactive DAG: ${error.message}`)
  }
}

// Simple portfolio view function
function showSimpleView() {
  const app = document.querySelector('#app')
  if (!app) return
  
  app.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <header style="
        padding: 3rem 2rem;
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      ">
        <h1 style="
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #60a5fa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">⚡ ${portfolioData.personal.name}</h1>
        <div style="font-size: 1.4rem; opacity: 0.9; margin-bottom: 0.5rem;">${portfolioData.personal.title}</div>
        <div style="opacity: 0.7; font-size: 1.1rem;">${portfolioData.personal.location} • ${portfolioData.personal.email}</div>
        <button onclick="window.location.reload()" style="
          margin-top: 1rem;
          background: rgba(16,185,129,0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
        ">🔄 Back to DAG</button>
      </header>
      
      <main style="max-width: 1200px; margin: 0 auto; padding: 3rem 2rem;">
        
        <section style="margin-bottom: 4rem;">
          <h2 style="
            font-size: 2rem;
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #60a5fa;
            padding-bottom: 0.5rem;
          ">📊 About</h2>
          <div style="
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
          ">
            <p style="font-size: 1.2rem; line-height: 1.7;">
              ${portfolioData.personal.summary}
            </p>
          </div>
        </section>

        <section style="margin-bottom: 4rem;">
          <h2 style="
            font-size: 2rem;
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #60a5fa;
            padding-bottom: 0.5rem;
          ">🚀 Experience</h2>
          ${portfolioData.experience.map(exp => `
            <div style="
              background: rgba(255,255,255,0.1);
              padding: 2rem;
              border-radius: 12px;
              margin-bottom: 1.5rem;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.1);
            ">
              <h3 style="margin-bottom: 0.75rem; font-size: 1.4rem; color: #60a5fa;">${exp.position}</h3>
              <p style="opacity: 0.8; font-weight: 600; margin-bottom: 0.5rem;">${exp.company} • ${exp.duration}</p>
              <p style="opacity: 0.7; margin-bottom: 1rem;">${exp.location}</p>
              <ul style="padding-left: 1.5rem;">
                ${exp.achievements.map(achievement => `
                  <li style="margin-bottom: 0.75rem; opacity: 0.9; line-height: 1.6;">${achievement}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section style="margin-bottom: 4rem;">
          <h2 style="
            font-size: 2rem;
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #60a5fa;
            padding-bottom: 0.5rem;
          ">🛠️ Technical Skills</h2>
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          ">
            ${Object.entries(portfolioData.skills).map(([category, skills]) => `
              <div style="
                background: rgba(255,255,255,0.1);
                padding: 2rem;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
              ">
                <h3 style="color: #34d399; font-size: 1.2rem; margin-bottom: 1rem;">${category}</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                  ${skills.map(skill => `
                    <span style="
                      background: rgba(96,165,250,0.2);
                      padding: 0.5rem 1rem;
                      border-radius: 25px;
                      font-size: 0.9rem;
                      border: 1px solid rgba(96,165,250,0.4);
                    ">${skill}</span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="margin-bottom: 4rem;">
          <h2 style="
            font-size: 2rem;
            margin-bottom: 1.5rem;
            border-bottom: 3px solid #60a5fa;
            padding-bottom: 0.5rem;
          ">🏗️ Featured Projects</h2>
          ${portfolioData.projects.map(project => `
            <div style="
              background: rgba(255,255,255,0.1);
              padding: 2rem;
              border-radius: 12px;
              margin-bottom: 1.5rem;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.1);
            ">
              <h3 style="margin-bottom: 0.75rem; font-size: 1.4rem; color: #60a5fa;">${project.name}</h3>
              <p style="opacity: 0.9; line-height: 1.6; margin-bottom: 1rem; font-size: 1.1rem;">
                ${project.description}
              </p>
              <div style="margin-bottom: 1rem;">
                <strong style="opacity: 0.8;">Technologies:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem;">
                  ${project.technologies.map(tech => `
                    <span style="
                      background: rgba(16,185,129,0.2);
                      padding: 0.4rem 0.8rem;
                      border-radius: 20px;
                      font-size: 0.85rem;
                      border: 1px solid rgba(16,185,129,0.4);
                    ">${tech}</span>
                  `).join('')}
                </div>
              </div>
              <div style="
                font-weight: 600;
                color: #34d399;
                font-size: 1.1rem;
                padding: 0.75rem;
                background: rgba(52,211,153,0.1);
                border-left: 3px solid #34d399;
                border-radius: 0 8px 8px 0;
              ">📈 Impact: ${project.impact}</div>
            </div>
          `).join('')}
        </section>

      </main>

      <footer style="
        text-align: center;
        padding: 3rem 2rem;
        border-top: 1px solid rgba(255,255,255,0.2);
        background: rgba(0,0,0,0.2);
      ">
        <p style="margin-bottom: 1rem;">
          🌐 Portfolio built with modern web technologies • 
          📧 <a href="mailto:${portfolioData.personal.email}" style="color: #60a5fa; text-decoration: none;">${portfolioData.personal.email}</a>
        </p>
        <p style="font-size: 0.9rem; opacity: 0.7;">
          💡 Interactive DAG visualization powered by Apache Airflow concepts
        </p>
      </footer>
    </div>
  `
}

// Make function available globally
window.showSimpleView = showSimpleView

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPortfolio()
  })
} else {
  initPortfolio()
}

// Emergency fallback - if nothing happens in 10 seconds, show error
setTimeout(() => {
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    console.error('🚨 Emergency timeout - Portfolio failed to load')
    showErrorMessage('Timeout Error', 'Portfolio took too long to load. This may be due to slow network or script errors.')
  }
}, 10000)
