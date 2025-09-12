// Debug script to check enhanced connections
console.log('🔍 Debugging Enhanced SVG Connections');

// Wait for page to load
setTimeout(() => {
    console.log('\n=== SVG CONNECTION DEBUG REPORT ===');
    
    // Check if canvas exists
    const canvas = document.querySelector('#workflow-canvas');
    console.log('Canvas found:', !!canvas);
    
    // Check SVG elements
    const svg = document.querySelector('svg');
    console.log('SVG found:', !!svg);
    
    if (svg) {
        console.log('SVG dimensions:', svg.getAttribute('width'), 'x', svg.getAttribute('height'));
    }
    
    // Check layers
    const connectionsLayer = document.querySelector('#connections-layer');
    const tasksLayer = document.querySelector('#tasks-layer');
    console.log('Connections layer found:', !!connectionsLayer);
    console.log('Tasks layer found:', !!tasksLayer);
    
    // Check transforms
    if (connectionsLayer) {
        console.log('Connections transform:', connectionsLayer.getAttribute('transform'));
    }
    if (tasksLayer) {
        console.log('Tasks transform:', tasksLayer.getAttribute('transform'));
    }
    
    // Check connections
    const connections = document.querySelectorAll('.task-connection');
    console.log('\n🔗 CONNECTIONS ANALYSIS:');
    console.log('Total connections:', connections.length);
    
    // Check connection types
    const directConnections = document.querySelectorAll('.connection-direct');
    const curvedConnections = document.querySelectorAll('.connection-curved');
    const steppedConnections = document.querySelectorAll('.connection-stepped');
    
    console.log('Direct connections:', directConnections.length);
    console.log('Curved connections:', curvedConnections.length);
    console.log('Stepped connections:', steppedConnections.length);
    
    // Check group connections
    const groupSourceConnections = document.querySelectorAll('.connection-group-source');
    const groupTargetConnections = document.querySelectorAll('.connection-group-target');
    
    console.log('Group source connections:', groupSourceConnections.length);
    console.log('Group target connections:', groupTargetConnections.length);
    
    // Check labels
    const connectionLabels = document.querySelectorAll('.connection-label');
    const connectionLabelBgs = document.querySelectorAll('.connection-label-bg');
    
    console.log('Connection labels:', connectionLabels.length);
    console.log('Connection label backgrounds:', connectionLabelBgs.length);
    
    // Sample connection details
    if (connections.length > 0) {
        console.log('\n📊 SAMPLE CONNECTION DETAILS:');
        const firstConnection = connections[0];
        console.log('First connection path:', firstConnection.getAttribute('d'));
        console.log('First connection classes:', firstConnection.className.baseVal);
        console.log('First connection stroke:', firstConnection.getAttribute('stroke'));
    }
    
    // Check task nodes
    const taskNodes = document.querySelectorAll('.task-node');
    console.log('\n📋 TASK NODES:');
    console.log('Total task nodes:', taskNodes.length);
    
    if (taskNodes.length > 0) {
        const firstTask = taskNodes[0];
        console.log('First task position:', firstTask.style.left, firstTask.style.top);
        console.log('First task transform:', firstTask.style.transform);
    }
    
    console.log('\n=== DEBUG REPORT COMPLETE ===\n');
    
}, 2000);

// Also log any errors
window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.error);
});

// Monitor transform changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'transform') {
            console.log('🔄 Transform changed on:', mutation.target.id || mutation.target.tagName);
        }
    });
});

setTimeout(() => {
    const svg = document.querySelector('svg');
    if (svg) {
        observer.observe(svg, { 
            attributes: true, 
            subtree: true, 
            attributeFilter: ['transform'] 
        });
        console.log('👀 Transform observer activated');
    }
}, 1000);
