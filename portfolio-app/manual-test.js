// Manual test script for enhanced connections
function manualConnectionTest() {
    console.log('\n🔧 MANUAL CONNECTION TEST');
    console.log('=========================');
    
    // Check basic elements
    const canvas = document.querySelector('#workflow-canvas');
    const svg = document.querySelector('svg');
    const connectionsLayer = document.querySelector('#connections-layer');
    const tasksLayer = document.querySelector('#tasks-layer');
    
    console.log('🔍 Element Check:');
    console.log(`  Canvas: ${!!canvas}`);
    console.log(`  SVG: ${!!svg}`);
    console.log(`  Connections Layer: ${!!connectionsLayer}`);
    console.log(`  Tasks Layer: ${!!tasksLayer}`);
    
    if (svg) {
        console.log(`  SVG Size: ${svg.getAttribute('width')} x ${svg.getAttribute('height')}`);
    }
    
    // Check connections
    const allPaths = document.querySelectorAll('path');
    const taskConnections = document.querySelectorAll('.task-connection');
    const directConnections = document.querySelectorAll('.connection-direct');
    const curvedConnections = document.querySelectorAll('.connection-curved');
    const steppedConnections = document.querySelectorAll('.connection-stepped');
    
    console.log('\n📊 Connection Count:');
    console.log(`  All paths: ${allPaths.length}`);
    console.log(`  Task connections: ${taskConnections.length}`);
    console.log(`  Direct: ${directConnections.length}`);
    console.log(`  Curved: ${curvedConnections.length}`);
    console.log(`  Stepped: ${steppedConnections.length}`);
    
    // Check group connections
    const groupSources = document.querySelectorAll('.connection-group-source');
    const groupTargets = document.querySelectorAll('.connection-group-target');
    const labels = document.querySelectorAll('.connection-label');
    const labelBgs = document.querySelectorAll('.connection-label-bg');
    
    console.log('\n🏷️ Group & Labels:');
    console.log(`  Group source connections: ${groupSources.length}`);
    console.log(`  Group target connections: ${groupTargets.length}`);
    console.log(`  Connection labels: ${labels.length}`);
    console.log(`  Label backgrounds: ${labelBgs.length}`);
    
    // Check transforms
    if (connectionsLayer && tasksLayer) {
        const connTransform = connectionsLayer.getAttribute('transform');
        const tasksTransform = tasksLayer.getAttribute('transform');
        
        console.log('\n🔄 Transform Sync:');
        console.log(`  Connections: ${connTransform || 'none'}`);
        console.log(`  Tasks: ${tasksTransform || 'none'}`);
        console.log(`  Synced: ${connTransform === tasksTransform}`);
    }
    
    // Sample connection details
    if (taskConnections.length > 0) {
        console.log('\n📋 Sample Connection:');
        const sample = taskConnections[0];
        console.log(`  Path: ${sample.getAttribute('d')?.substring(0, 50)}...`);
        console.log(`  Classes: ${sample.className.baseVal}`);
        console.log(`  Stroke: ${sample.getAttribute('stroke')}`);
        console.log(`  From: ${sample.getAttribute('data-from')}`);
        console.log(`  To: ${sample.getAttribute('data-to')}`);
    }
    
    // Check if canvas instance exists
    if (window.debugCanvas) {
        console.log('\n🎯 Canvas Instance:');
        console.log(`  Total tasks: ${window.debugCanvas.tasks.size}`);
        console.log(`  Total connections: ${window.debugCanvas.connections.length}`);
        console.log(`  Scale: ${window.debugCanvas.scale}`);
        console.log(`  Pan: (${window.debugCanvas.pan.x}, ${window.debugCanvas.pan.y})`);
    }
    
    // Test results summary
    const hasConnections = taskConnections.length > 0;
    const hasSmartRouting = directConnections.length > 0 || curvedConnections.length > 0 || steppedConnections.length > 0;
    const hasGroupConnections = groupSources.length > 0 || groupTargets.length > 0;
    const hasLabels = labels.length > 0;
    const hasTransforms = connectionsLayer && tasksLayer && 
                         connectionsLayer.getAttribute('transform') && 
                         tasksLayer.getAttribute('transform');
    
    console.log('\n✅ Test Results Summary:');
    console.log(`  Basic Connections: ${hasConnections ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Smart Routing: ${hasSmartRouting ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Group Connections: ${hasGroupConnections ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Connection Labels: ${hasLabels ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Transform Sync: ${hasTransforms ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPass = hasConnections && hasSmartRouting && hasGroupConnections && hasLabels && hasTransforms;
    console.log(`\n🎯 OVERALL: ${allPass ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME ISSUES REMAIN'}`);
    
    return {
        hasConnections,
        hasSmartRouting,
        hasGroupConnections,
        hasLabels,
        hasTransforms,
        allPass
    };
}

// Auto-run test after page load
setTimeout(() => {
    console.log('🚀 Auto-running manual connection test...');
    manualConnectionTest();
}, 4000);

// Make function available globally
window.manualConnectionTest = manualConnectionTest;
