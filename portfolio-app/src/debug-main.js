// Simple debug version to test the loading issue
import './style.css'

console.log('🚀 Debug main.js starting...')

async function debugInit() {
  console.log('📍 Debug init started')
  
  const app = document.querySelector('#app')
  if (!app) {
    console.error('❌ App container not found')
    return
  }
  
  // Remove loading screen first
  const loadingScreen = document.querySelector('.loading-screen')
  if (loadingScreen) {
    console.log('🗑️ Removing loading screen...')
    loadingScreen.remove()
  }
  
  // Set basic content
  app.innerHTML = `
    <div style="padding: 40px; text-align: center;">
      <h1>Portfolio Debug</h1>
      <p>Basic loading successful!</p>
      <button id="test-imports">Test Imports</button>
      <div id="test-results" style="margin-top: 20px;"></div>
    </div>
  `
  
  // Test imports one by one
  document.getElementById('test-imports').addEventListener('click', async () => {
    const results = document.getElementById('test-results')
    results.innerHTML = '<p>Testing imports...</p>'
    
    try {
      console.log('🧪 Testing portfolio data import...')
      const { portfolioData } = await import('./data/portfolio-data.js')
      console.log('✅ Portfolio data imported:', portfolioData)
      results.innerHTML += '<p>✅ Portfolio data: OK</p>'
      
      console.log('🧪 Testing TaskNode import...')
      const { TaskNode } = await import('./components/TaskNode.js')
      console.log('✅ TaskNode imported:', TaskNode)
      results.innerHTML += '<p>✅ TaskNode: OK</p>'
      
      console.log('🧪 Testing WorkflowCanvas import...')
      const { WorkflowCanvas } = await import('./components/WorkflowCanvas.js')
      console.log('✅ WorkflowCanvas imported:', WorkflowCanvas)
      results.innerHTML += '<p>✅ WorkflowCanvas: OK</p>'
      
      console.log('🧪 Testing WorkflowCanvas instantiation...')
      app.innerHTML += '<div id="test-canvas" style="height: 400px; border: 1px solid #ccc; margin: 20px;"></div>'
      const canvas = new WorkflowCanvas('test-canvas')
      console.log('✅ WorkflowCanvas created:', canvas)
      results.innerHTML += '<p>✅ WorkflowCanvas creation: OK</p>'
      
      console.log('🧪 Testing DAG creation...')
      canvas.createPortfolioDAG()
      console.log('✅ DAG created successfully')
      results.innerHTML += '<p>✅ DAG Creation: OK</p>'
      
      results.innerHTML += '<p>🎉 All tests passed!</p>'
      
    } catch (error) {
      console.error('❌ Test failed:', error)
      results.innerHTML += `<p>❌ Error: ${error.message}</p>`
      results.innerHTML += `<pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.stack}</pre>`
    }
  })
  
  console.log('✅ Debug init completed')
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debugInit)
} else {
  debugInit()
}
