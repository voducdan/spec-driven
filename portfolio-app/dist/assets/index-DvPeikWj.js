(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();class o{constructor(e,s,t,n="pending"){this.id=e,this.title=s,this.type=t,this.status=n,this.dependencies=[],this.element=null}addDependency(e){this.dependencies.push(e)}render(e,s){const t=document.createElement("div");return t.className=`task-node task-${this.type} status-${this.status}`,t.id=`task-${this.id}`,t.style.left=`${e}px`,t.style.top=`${s}px`,t.innerHTML=`
      <div class="task-header">
        <span class="task-icon">${this.getIcon()}</span>
        <span class="task-title">${this.title}</span>
      </div>
      <div class="task-status">
        <span class="status-indicator"></span>
        <span class="status-text">${this.status}</span>
      </div>
    `,t.addEventListener("click",()=>this.onClick()),this.element=t,t}getIcon(){return{education:"🎓",experience:"💼",skills:"⚡",projects:"🚀"}[this.type]||"📋"}onClick(){console.log(`Task ${this.id} clicked:`,this),this.showDetails()}showDetails(){alert(`Task: ${this.title}
Type: ${this.type}
Status: ${this.status}`)}updateStatus(e){this.status=e,this.element&&(this.element.className=`task-node task-${this.type} status-${e}`,this.element.querySelector(".status-text").textContent=e)}}class l{constructor(e,s,t=[]){this.id=e,this.title=s,this.tasks=t,this.isExpanded=!0,this.element=null}addTask(e){this.tasks.push(e)}render(e,s){const t=document.createElement("div");t.className=`task-group ${this.isExpanded?"expanded":"collapsed"}`,t.id=`group-${this.id}`,t.style.left=`${e}px`,t.style.top=`${s}px`;const n=document.createElement("div");n.className="group-header",n.innerHTML=`
      <button class="expand-toggle" onclick="this.parentElement.parentElement.classList.toggle('expanded')">
        <span class="toggle-icon">${this.isExpanded?"▼":"▶"}</span>
      </button>
      <span class="group-title">${this.title}</span>
      <span class="task-count">(${this.tasks.length} tasks)</span>
    `;const i=document.createElement("div");return i.className="group-content",this.tasks.forEach((r,u)=>{const p=r.render(0,u*60);i.appendChild(p)}),t.appendChild(n),t.appendChild(i),this.element=t,t}toggle(){this.isExpanded=!this.isExpanded,this.element&&(this.element.classList.toggle("expanded"),this.element.classList.toggle("collapsed"))}getProgress(){const e=this.tasks.filter(s=>s.status==="success").length;return{completed:e,total:this.tasks.length,percentage:this.tasks.length>0?e/this.tasks.length*100:0}}}class h{constructor(e){this.container=document.getElementById(e),this.tasks=new Map,this.groups=new Map,this.connections=[],this.canvasWidth=1200,this.canvasHeight=800,this.init()}init(){if(!this.container){console.error("Canvas container not found");return}this.container.innerHTML=`
      <div class="workflow-toolbar">
        <button id="zoom-in">🔍+</button>
        <button id="zoom-out">🔍-</button>
        <button id="fit-screen">📱</button>
        <button id="refresh-dag">🔄</button>
        <div class="dag-status">
          <span class="status-indicator running"></span>
          <span>Portfolio DAG</span>
        </div>
      </div>
      <div class="workflow-canvas" id="canvas">
        <svg class="connections-layer" width="${this.canvasWidth}" height="${this.canvasHeight}">
          <!-- Task connections will be drawn here -->
        </svg>
        <div class="tasks-layer">
          <!-- Task nodes and groups will be rendered here -->
        </div>
      </div>
    `,this.canvas=this.container.querySelector("#canvas"),this.connectionsLayer=this.container.querySelector(".connections-layer"),this.tasksLayer=this.container.querySelector(".tasks-layer"),this.setupEventListeners()}setupEventListeners(){var e,s,t,n;(e=this.container.querySelector("#zoom-in"))==null||e.addEventListener("click",()=>this.zoom(1.2)),(s=this.container.querySelector("#zoom-out"))==null||s.addEventListener("click",()=>this.zoom(.8)),(t=this.container.querySelector("#fit-screen"))==null||t.addEventListener("click",()=>this.fitToScreen()),(n=this.container.querySelector("#refresh-dag"))==null||n.addEventListener("click",()=>this.refresh())}addTask(e,s,t){this.tasks.set(e.id,{task:e,x:s,y:t});const n=e.render(s,t);return this.tasksLayer.appendChild(n),e}addGroup(e,s,t){this.groups.set(e.id,{group:e,x:s,y:t});const n=e.render(s,t);return this.tasksLayer.appendChild(n),e}addConnection(e,s){this.connections.push({from:e,to:s}),this.drawConnection(e,s)}drawConnection(e,s){const t=this.tasks.get(e),n=this.tasks.get(s);if(!t||!n)return;const i=document.createElementNS("http://www.w3.org/2000/svg","line");i.setAttribute("x1",t.x+100),i.setAttribute("y1",t.y+30),i.setAttribute("x2",n.x),i.setAttribute("y2",n.y+30),i.setAttribute("class","task-connection"),i.setAttribute("marker-end","url(#arrowhead)"),this.connectionsLayer.appendChild(i)}createPortfolioDAG(){const e=new o("edu","Education","education","success"),s=new o("exp","Experience","experience","success"),t=new o("skills","Skills","skills","running"),n=new o("projects","Projects","projects","pending");this.addTask(e,100,100),this.addTask(s,400,100),this.addTask(t,700,100),this.addTask(n,1e3,100),this.addConnection("edu","exp"),this.addConnection("exp","skills"),this.addConnection("skills","projects"),this.createDetailGroups()}createDetailGroups(){const s=new l("edu-details","Education Details",[new o("edu-1","University Degree","education","success"),new o("edu-2","Certifications","education","success")]);this.addGroup(s,50,250);const t=new l("exp-details","Experience Details",[new o("exp-1","Data Engineer Role","experience","success"),new o("exp-2","Previous Positions","experience","success")]);this.addGroup(t,350,250);const n=new l("skills-details","Skills Breakdown",[new o("skill-1","Programming Languages","skills","success"),new o("skill-2","Data Tools","skills","running"),new o("skill-3","Cloud Platforms","skills","pending")]);this.addGroup(n,650,250)}zoom(e){const s=this.canvas.style.transform.match(/scale\(([\d.]+)\)/),t=s?parseFloat(s[1])*e:e;this.canvas.style.transform=`scale(${t})`}fitToScreen(){this.canvas.style.transform="scale(1)"}refresh(){console.log("Refreshing Portfolio DAG..."),this.createPortfolioDAG()}}const c={personal:{name:"Dan Vo",title:"Data Engineer"}};function d(){const a=document.querySelector("#app");if(!a){console.error("App container not found");return}a.innerHTML=`
    <div class="portfolio-container">
      <header class="airflow-header">
        <div class="header-content">
          <h1>${c.personal.name}</h1>
          <p class="title">${c.personal.title}</p>
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
  `,setTimeout(()=>{g()},100),console.log("✅ Airflow Portfolio initialized successfully!")}function g(){const a=new h("workflow-canvas");a.createPortfolioDAG(),f(a)}function f(a){const e=document.getElementById("run-dag"),s=document.getElementById("pause-dag"),t=document.getElementById("refresh-dag");e==null||e.addEventListener("click",()=>{console.log("Running Portfolio DAG..."),e.textContent="⏳ Running...",e.disabled=!0,setTimeout(()=>{e.textContent="✅ Completed",setTimeout(()=>{e.textContent="▶ Run Portfolio DAG",e.disabled=!1},2e3)},3e3)}),s==null||s.addEventListener("click",()=>{console.log("Pausing Portfolio DAG...")}),t==null||t.addEventListener("click",()=>{console.log("Refreshing Portfolio DAG..."),a.refresh()})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
