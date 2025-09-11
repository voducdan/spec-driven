// Simple non-module version for GitHub Pages compatibility
console.log('🚀 Starting simple portfolio initialization...');

// Portfolio data embedded directly (no imports)
const portfolioData = {
  personal: {
    name: "Dan Vo",
    title: "Senior Data Engineer",
    email: "voducdand99@gmail.com",
    location: "San Francisco, CA",
    summary: "Passionate data engineer with 5+ years of experience building scalable data pipelines and analytics platforms. Specialized in Apache Airflow, Python, and cloud-native architectures."
  },
  skills: {
    "Programming Languages": ["Python", "SQL", "JavaScript", "R", "Scala"],
    "Big Data Technologies": ["Apache Spark", "Apache Kafka", "Apache Airflow", "Hadoop"],
    "Cloud Platforms": ["AWS", "Google Cloud Platform", "Azure"],
    "Databases": ["PostgreSQL", "MongoDB", "Redis", "Snowflake", "BigQuery"],
    "Tools & Frameworks": ["Docker", "Kubernetes", "Terraform", "dbt", "Apache Superset"]
  },
  experience: [
    {
      title: "Senior Data Engineer",
      company: "TechCorp Inc.",
      duration: "2022 - Present",
      location: "San Francisco, CA",
      responsibilities: [
        "Lead data engineering team of 5 engineers",
        "Design and implement real-time data pipelines processing 10TB+ daily",
        "Migrate legacy systems to cloud-native architectures",
        "Reduce data processing costs by 40% through optimization"
      ]
    },
    {
      title: "Data Engineer",
      company: "DataFlow Solutions",
      duration: "2020 - 2022",
      location: "San Francisco, CA",
      responsibilities: [
        "Built ETL pipelines using Apache Airflow and Python",
        "Implemented data quality monitoring and alerting systems",
        "Collaborated with data scientists on ML model deployment"
      ]
    }
  ],
  projects: [
    {
      name: "Real-time Analytics Platform",
      description: "Built a real-time analytics platform processing millions of events per day",
      technologies: ["Python", "Apache Kafka", "Apache Spark", "AWS"],
      impact: "Reduced data latency from hours to seconds"
    },
    {
      name: "Data Pipeline Orchestration",
      description: "Designed and implemented a comprehensive data pipeline orchestration system",
      technologies: ["Apache Airflow", "Docker", "Kubernetes", "PostgreSQL"],
      impact: "Improved pipeline reliability from 85% to 99.5%"
    }
  ]
};

// Simple error handling
function showError(message) {
  const app = document.getElementById('app');
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
        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; backdrop-filter: blur(10px);">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Loading Issue</h2>
          <p style="margin-bottom: 1rem;">${message}</p>
          <button onclick="window.location.reload()" style="
            background: #3b82f6; 
            color: white; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 6px; 
            cursor: pointer;
            font-size: 1rem;
          ">🔄 Reload</button>
        </div>
      </div>
    `;
  }
}

// Simple portfolio rendering
function renderPortfolio() {
  console.log('📄 Rendering simple portfolio...');
  
  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ App container not found');
    return;
  }

  // Remove loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.remove();
  }

  // Create simple portfolio layout
  app.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <header style="padding: 2rem; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">
        <h1 style="margin: 0; font-size: 2.5rem; font-weight: 700;">⚡ ${portfolioData.personal.name}</h1>
        <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; opacity: 0.9;">${portfolioData.personal.title}</p>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.7;">${portfolioData.personal.location} • ${portfolioData.personal.email}</p>
      </header>
      
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem; border-bottom: 2px solid #60a5fa; padding-bottom: 0.5rem;">
            📊 About
          </h2>
          <p style="font-size: 1.1rem; line-height: 1.6; opacity: 0.9;">
            ${portfolioData.personal.summary}
          </p>
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem; border-bottom: 2px solid #60a5fa; padding-bottom: 0.5rem;">
            🚀 Experience
          </h2>
          ${portfolioData.experience.map(exp => `
            <div style="
              background: rgba(255,255,255,0.1);
              padding: 1.5rem;
              border-radius: 8px;
              margin-bottom: 1rem;
              backdrop-filter: blur(10px);
            ">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem;">${exp.title}</h3>
              <p style="margin: 0 0 0.5rem 0; opacity: 0.8; font-weight: 600;">${exp.company} • ${exp.duration}</p>
              <p style="margin: 0 0 1rem 0; opacity: 0.7;">${exp.location}</p>
              <ul style="margin: 0; padding-left: 1.5rem;">
                ${exp.responsibilities.map(resp => `<li style="margin-bottom: 0.5rem; opacity: 0.9;">${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem; border-bottom: 2px solid #60a5fa; padding-bottom: 0.5rem;">
            🛠️ Skills
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            ${Object.entries(portfolioData.skills).map(([category, skills]) => `
              <div style="
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 8px;
                backdrop-filter: blur(10px);
              ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: #60a5fa;">${category}</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  ${skills.map(skill => `
                    <span style="
                      background: rgba(96,165,250,0.3);
                      padding: 0.25rem 0.75rem;
                      border-radius: 20px;
                      font-size: 0.9rem;
                      border: 1px solid rgba(96,165,250,0.5);
                    ">${skill}</span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem; border-bottom: 2px solid #60a5fa; padding-bottom: 0.5rem;">
            🏗️ Featured Projects
          </h2>
          ${portfolioData.projects.map(project => `
            <div style="
              background: rgba(255,255,255,0.1);
              padding: 1.5rem;
              border-radius: 8px;
              margin-bottom: 1rem;
              backdrop-filter: blur(10px);
            ">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem;">${project.name}</h3>
              <p style="margin: 0 0 1rem 0; opacity: 0.9; line-height: 1.5;">${project.description}</p>
              <div style="margin-bottom: 1rem;">
                <strong style="opacity: 0.8;">Technologies:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                  ${project.technologies.map(tech => `
                    <span style="
                      background: rgba(16,185,129,0.3);
                      padding: 0.25rem 0.75rem;
                      border-radius: 20px;
                      font-size: 0.9rem;
                      border: 1px solid rgba(16,185,129,0.5);
                    ">${tech}</span>
                  `).join('')}
                </div>
              </div>
              <p style="margin: 0; font-weight: 600; color: #60a5fa;">📈 ${project.impact}</p>
            </div>
          `).join('')}
        </section>
      </main>

      <footer style="
        text-align: center;
        padding: 2rem;
        border-top: 1px solid rgba(255,255,255,0.2);
        opacity: 0.7;
      ">
        <p>🌐 Portfolio built with modern web technologies • 📧 ${portfolioData.personal.email}</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">
          💡 This is a simplified fallback version. 
          <a href="#" onclick="window.location.reload()" style="color: #60a5fa; text-decoration: underline;">
            Try reloading for the interactive DAG visualization
          </a>
        </p>
      </footer>
    </div>
  `;

  console.log('✅ Simple portfolio rendered successfully!');
}

// Initialize when DOM is ready
function initSimplePortfolio() {
  console.log('🔄 Initializing simple portfolio...');
  
  try {
    renderPortfolio();
  } catch (error) {
    console.error('❌ Error rendering portfolio:', error);
    showError(`Failed to render portfolio: ${error.message}`);
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSimplePortfolio);
} else {
  initSimplePortfolio();
}

// Fallback timeout
setTimeout(() => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.style.display !== 'none') {
    console.warn('⚠️ Fallback: Loading took too long, rendering simple portfolio');
    initSimplePortfolio();
  }
}, 5000);
