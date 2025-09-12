// Verification script to check if SVG connections are visible
// Run this in the browser console on the main portfolio page

console.log('🔍 === SVG CONNECTION VERIFICATION ===');

// Check if we have access to the workflow instance
const canvas = document.querySelector('#canvas');
const workflowInstance = canvas?.workflowInstance;

if (!workflowInstance) {
    console.error('❌ No workflow instance found');
} else {
    console.log('✅ Workflow instance found');
    
    // Check DOM structure
    const svg = workflowInstance.connectionsLayer;
    const tasksLayer = workflowInstance.tasksLayer;
    
    console.log('🏗️ DOM Structure:');
    console.log('  SVG parent:', svg.parentElement.className);
    console.log('  Tasks layer parent:', tasksLayer.parentElement.className);
    console.log('  Are siblings?', svg.parentElement === tasksLayer.parentElement);
    
    // Check if SVG is visible
    const svgRect = svg.getBoundingClientRect();
    const svgStyle = getComputedStyle(svg);
    console.log('🎨 SVG Visibility:');
    console.log('  Dimensions:', svgRect.width, 'x', svgRect.height);
    console.log('  Display:', svgStyle.display);
    console.log('  Visibility:', svgStyle.visibility);
    console.log('  Opacity:', svgStyle.opacity);
    
    // Check connections
    const paths = workflowInstance.connectionsGroup.querySelectorAll('path');
    console.log('🔗 Connections:');
    console.log('  Total paths:', paths.length);
    
    if (paths.length === 0) {
        console.log('⚠️ No connections found - trying to trigger creation...');
        
        // Try to trigger connection drawing
        if (typeof window.testConnections === 'function') {
            console.log('🧪 Running comprehensive test...');
            window.testConnections();
        } else if (typeof window.debugConnections === 'function') {
            console.log('🔄 Running debug connections...');
            window.debugConnections();
        } else {
            console.log('📞 Manually triggering redraw...');
            workflowInstance.redrawAllConnections();
        }
    } else {
        // Check each path
        paths.forEach((path, index) => {
            const pathRect = path.getBoundingClientRect();
            const isVisible = pathRect.width > 0 && pathRect.height > 0;
            console.log(`  Path ${index + 1}: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
            console.log(`    d: ${path.getAttribute('d')}`);
            console.log(`    stroke: ${path.getAttribute('stroke')}`);
            console.log(`    rect:`, pathRect);
        });
    }
}

console.log('✅ === VERIFICATION COMPLETE ===');

// Also expose this as a global function
window.verifyConnections = function() {
    // Run the verification code above
    console.log('🔄 Re-running verification...');
    eval(document.currentScript?.textContent || '');
};

console.log('💡 You can re-run this check anytime with: window.verifyConnections()');
