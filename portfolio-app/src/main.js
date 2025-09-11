import './style.css'
import { portfolioData } from './data/portfolio-data.js'

// Add global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
})

// Simplified portfolio initialization
async function initPortfolio() {
  console.log('🚀 Starting simplified portfolio initialization...')
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('App container not found')
    return
  }

  // Remove loading screen immediately since we're doing a simple layout
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    console.log('🗑️ Removing loading screen...')
    loadingScreen.remove()
  }

  // Simple portfolio layout without complex DAG visualization
  app.innerHTML = `
    <div class="portfolio-container">
      <header class="airflow-header">
        <div class="header-content">
          <h1>${portfolioData.personal.name}</h1>
          <p class="title">${portfolioData.personal.title}</p>
          <p class="subtitle">Interactive Portfolio</p>
        </div>
        <div class="dag-info">
          <span class="dag-status running">●</span>
          <span>Portfolio Active</span>
        </div>
      </header>
      
      <main class="workflow-container">
        <div class="portfolio-content">
          <div class="portfolio-section">
            <h2>🎓 Education</h2>
            ${portfolioData.education.map(edu => `
              <div class="portfolio-item">
                <h3>${edu.institution}</h3>
                <p><strong>${edu.degree}</strong> in ${edu.field}</p>
                <p><em>${edu.year}</em> | GPA: ${edu.gpa}</p>
                <p>${edu.details}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="portfolio-section">
            <h2>💼 Experience</h2>
            ${portfolioData.experience.map(exp => `
              <div class="portfolio-item">
                <h3>${exp.company}</h3>
                <p><strong>${exp.position}</strong> | <em>${exp.duration}</em></p>
                <ul>
                  ${exp.responsibilities.slice(0, 3).map(resp => `<li>${resp}</li>`).join('')}
                </ul>
                <div class="tech-stack">
                  ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="portfolio-section">
            <h2>🔧 Skills</h2>
            ${Object.values(portfolioData.skills).map(skill => `
              <div class="portfolio-item">
                <h3>${skill.category}</h3>
                <div class="skill-items">
                  ${skill.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="portfolio-section">
            <h2>🚀 Projects</h2>
            ${portfolioData.projects.map(project => `
              <div class="portfolio-item">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <h4>Key Highlights:</h4>
                <ul>
                  ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
                <div class="tech-stack">
                  ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="portfolio-actions">
            <button id="enable-dag" class="btn-primary">🎯 Enable DAG Visualization</button>
          </div>
        </div>
      </main>
      
      <footer class="portfolio-footer">
        <p>Portfolio © ${new Date().getFullYear()} | <a href="mailto:${portfolioData.personal.email}">${portfolioData.personal.email}</a></p>
      </footer>
    </div>
  `

  // Add event listener for DAG visualization
  document.getElementById('enable-dag')?.addEventListener('click', async () => {
    const button = document.getElementById('enable-dag')
    button.textContent = '⏳ Loading DAG...'
    button.disabled = true
    
    try {
      await enableDagVisualization()
      button.textContent = '✅ DAG Enabled'
    } catch (error) {
      console.error('DAG visualization failed:', error)
      button.textContent = '❌ DAG Failed - Click to Retry'
      button.disabled = false
    }
  })
  
  console.log('✅ Simplified portfolio loaded successfully!')
}

async function enableDagVisualization() {
  console.log('🎯 Attempting to load DAG visualization...')
  
  try {
    console.log('📦 Importing WorkflowCanvas...')
    const { WorkflowCanvas } = await import('./components/WorkflowCanvas.js')
    console.log('✅ WorkflowCanvas imported successfully')
    
    // Replace the entire body content with full-screen DAG
    document.body.innerHTML = `
      <div class="dag-fullscreen-container">
        <div class="dag-header">
          <div class="dag-title">
            <h1>📊 Portfolio DAG - ${portfolioData.personal.name}</h1>
            <button id="exit-dag" class="btn-secondary">← Back to Portfolio</button>
          </div>
          <div class="dag-info">
            <span class="dag-status running">●</span>
            <span>Portfolio Workflow Active</span>
          </div>
        </div>
        <div id="workflow-canvas" class="dag-canvas-fullscreen">
          <!-- DAG will be rendered here -->
        </div>
      </div>
    `
    
    console.log('🎪 Creating WorkflowCanvas instance...')
    const canvas = new WorkflowCanvas('workflow-canvas')
    
    console.log('📊 Creating portfolio DAG...')
    await canvas.createPortfolioDAG()
    
    // Add exit functionality
    document.getElementById('exit-dag')?.addEventListener('click', () => {
      console.log('🔄 Reloading to return to portfolio...')
      location.reload() // Simple way to go back to portfolio
    })
    
    console.log('✅ DAG visualization enabled successfully')
  } catch (error) {
    console.error('❌ Failed to enable DAG visualization:', error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPortfolio())
} else {
  initPortfolio()
}
