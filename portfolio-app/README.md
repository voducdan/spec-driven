# Airflow-Inspired Portfolio

A creative web portfolio inspired by Apache Airflow's DAG visualization, showcasing Dan Vo's data engineering experience through an interactive workflow interface.

## 🎯 Project Overview

This portfolio transforms traditional CV presentation into an interactive **Directed Acyclic Graph (DAG)** where:

- **Education** → **Experience** → **Skills** → **Projects** form the main workflow
- Each section is a "task" with dependencies and status indicators
- Interactive nodes reveal detailed information with Airflow-style logs and metrics
- Visual states indicate completion/proficiency levels
- Real-time DAG execution simulation with task state management
- Full accessibility support (WCAG 2.1 AA compliant)
- Responsive design for mobile, tablet, and desktop
- Performance-optimized rendering for smooth 60fps animations

## 🚀 Tech Stack

- **Vite 5.x** - Fast build tool and development server
- **Vanilla JavaScript** - No frameworks, pure ES6 modules with advanced OOP patterns
- **Modern CSS** - CSS Grid, Flexbox, Custom Properties, Advanced Animations
- **SVG Graphics** - Dynamic DAG connections and visualizations
- **Web APIs** - IntersectionObserver, Performance API, Web Accessibility APIs
- **Testing** - Vitest with comprehensive test suite (59 tests passing)

## 📁 Project Structure

```
portfolio-app/
├── src/
│   ├── main.js                         # Application entry point
│   ├── style.css                       # Main stylesheet
│   ├── components/
│   │   ├── TaskNode.js                # Interactive task nodes with modals
│   │   ├── TaskGroup.js               # Collapsible task groupings
│   │   ├── WorkflowCanvas.js          # Main DAG visualization engine
│   │   ├── EducationSection.js        # Education portfolio section
│   │   ├── ExperienceSection.js       # Professional experience section
│   │   ├── SkillsSection.js           # Technical skills matrix
│   │   └── ProjectsSection.js         # Projects and certifications
│   ├── data/
│   │   └── portfolio-data.js          # Structured portfolio data
│   ├── utils/
│   │   ├── workflow-helpers.js        # DAG utilities & algorithms
│   │   ├── workflow-state.js          # Centralized state management
│   │   ├── performance.js             # Performance optimization utilities
│   │   └── accessibility.js           # WCAG 2.1 AA accessibility features
│   ├── styles/
│   │   ├── airflow-theme.css          # Airflow-inspired theme system
│   │   └── responsive.css             # Mobile-first responsive design
│   └── assets/                        # Static assets and additional styles
├── tests/                             # Comprehensive test suite
│   ├── airflow-canvas.test.js         # Canvas and DAG visualization tests
│   ├── navigation.test.js             # Navigation and workflow tests
│   ├── portfolio-data.test.js         # Data structure and validation tests
│   └── setup.js                       # Test configuration
├── index.html                         # HTML template with loading screen
├── package.json                       # Dependencies & scripts
├── vite.config.js                     # Vite configuration
├── vitest.config.js                   # Testing configuration
└── README.md                         # This comprehensive documentation
```

## 🛠 Development Setup

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm 9+** - Package manager

### Quick Start

```bash
# Clone and navigate to project
cd portfolio-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Commands

#### Development
```bash
npm run dev          # Start development server (http://localhost:5174)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

#### Testing
```bash
npm test            # Run all tests (59 tests)
npm run test:watch  # Run tests in watch mode
npm run test:ui     # Open Vitest UI interface
npm run coverage    # Generate test coverage report
```

#### Code Quality
```bash
npm run lint         # Check code with ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
```

#### Maintenance
```bash
npm run clean        # Clean build artifacts
npm install          # Reinstall dependencies
```

### Development Server

- **Local**: http://localhost:5174/
- **Network**: Available on local network for mobile testing
- **Hot reload**: Enabled for all file changes
- **Error overlay**: Development error display
- **Source maps**: Enabled for debugging

## 🎨 Design Concept

### Airflow DAG Metaphor

This portfolio visualizes career progression as an Apache Airflow DAG:

```
Education → Experience → Skills → Projects
    ↓           ↓          ↓         ↓
[Task Groups with detailed breakdowns]
    ↓           ↓          ↓         ↓
[Individual tasks with dependencies and status]
```

### Task Status System

- **🟢 Success**: Completed milestones (education, past roles, achieved skills)
- **🟡 Running**: Current activities (ongoing projects, active learning)
- **⚪ Pending**: Future goals and planned work
- **🔴 Failed**: Challenges overcome or lessons learned (rare, for demonstration)

### Interactive Features

- **Task Nodes**: Click to expand with detailed information
- **Connection Lines**: Visual dependencies between portfolio sections
- **DAG Controls**: Play, pause, and refresh the entire portfolio workflow
- **Real-time Execution**: Simulate task execution with timing and status updates
- **Modal Details**: Deep-dive views for projects, experience, and skills
- **Responsive Layout**: Optimized for mobile, tablet, and desktop viewing

## 🔧 Architecture & Features

### Component Architecture

The portfolio follows a modular, object-oriented architecture:

#### Core Components
- **WorkflowCanvas**: Main DAG visualization engine with SVG rendering
- **TaskNode**: Individual portfolio task with state management
- **TaskGroup**: Collapsible groupings of related tasks
- **Portfolio Sections**: Specialized components for each career area

#### State Management
- **Centralized State**: `workflow-state.js` manages all task states and transitions
- **Event-Driven**: Components communicate through custom events
- **Persistence**: Local storage for user preferences and state

#### Performance Optimizations
- **RAF Management**: Optimized animation frame handling
- **Lazy Loading**: Intersection Observer for task details
- **Memory Management**: Proper cleanup and resource management
- **Adaptive Quality**: Performance-based quality adjustments

#### Accessibility Features (WCAG 2.1 AA)
- **Keyboard Navigation**: Full keyboard support with Tab, Arrow keys
- **Screen Reader**: ARIA labels, live regions, and semantic markup
- **Focus Management**: Proper focus trapping and skip links
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Color Contrast**: AA-compliant color combinations

### Data Structure

Portfolio data is structured to mirror Airflow DAG concepts:

```javascript
// Task Definition
{
  id: 'unique-task-id',
  title: 'Human-readable title',
  type: 'education|experience|skills|projects',
  status: 'pending|running|success|failed',
  dependencies: ['parent-task-ids'],
  position: { x: 100, y: 200 },
  metadata: { /* task-specific data */ }
}
```

### Testing Strategy

Comprehensive test suite with 59 tests covering:

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction and data flow
- **DAG Logic Tests**: Dependency resolution and execution order
- **Accessibility Tests**: ARIA attributes and keyboard navigation
- **Performance Tests**: Animation timing and resource usage

## 📱 Responsive Design

### Mobile-First Approach

The portfolio uses a mobile-first, progressive enhancement strategy:

#### Breakpoints
- **320px+**: Base mobile experience
- **481px - 768px**: Tablet portrait
- **769px - 1024px**: Tablet landscape
- **1025px - 1440px**: Desktop
- **1441px+**: Large desktop

#### Adaptive Features
- **Collapsible Sidebar**: Moves above canvas on mobile
- **Touch Optimizations**: Larger touch targets, gesture support
- **Condensed Controls**: Horizontal layout for mobile DAG controls
- **Simplified Animations**: Reduced motion on smaller screens

### Cross-Browser Compatibility

Tested and optimized for:
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility Tools**: Screen readers (NVDA, JAWS, VoiceOver)

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Creates optimized production files in `dist/`:
- Minified JavaScript and CSS
- Optimized asset loading
- Source maps for debugging
- Performance metrics

### Hosting Options

The portfolio is a static site and can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **AWS S3**: Upload `dist/` contents to S3 bucket
- **Any Static Host**: Serve `dist/` folder contents

### Environment Configuration

```javascript
// vite.config.js - Production optimizations
export default {
  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['performance', 'accessibility']
        }
      }
    }
  }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Interactive UI (recommended)
npm run test:ui

# Coverage report
npm run coverage
```

### Test Categories

#### Canvas & Visualization (18 tests)
- DAG rendering and layout
- Task node positioning
- SVG connection generation
- Interactive controls

#### Portfolio Data (20 tests)
- Data structure validation
- Task dependency resolution
- Portfolio content verification

#### Navigation & Workflow (21 tests)
- Task execution simulation
- State transitions
- Keyboard navigation
- Accessibility features

### Writing New Tests

```javascript
// Example test structure
import { describe, it, expect, beforeEach } from 'vitest'
import { TaskNode } from '../src/components/TaskNode.js'

describe('TaskNode Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should render with correct ARIA attributes', () => {
    const task = new TaskNode('test-task', 'Test Task', 'pending')
    const element = task.render()
    
    expect(element.getAttribute('role')).toBe('button')
    expect(element.getAttribute('aria-label')).toContain('Test Task')
  })
})
```

## 🔒 Accessibility Compliance

### WCAG 2.1 AA Standards

The portfolio meets WCAG 2.1 AA guidelines:

#### Perceivable
- **Color Contrast**: Minimum 4.5:1 ratio for all text
- **Alternative Text**: Comprehensive ARIA labels for all interactive elements
- **Scalable Text**: Supports up to 200% zoom without loss of functionality

#### Operable
- **Keyboard Navigation**: Full functionality without mouse
- **Focus Management**: Visible focus indicators and logical tab order
- **Motion Control**: Respects `prefers-reduced-motion` preference
- **Touch Targets**: Minimum 44px touch targets on mobile

#### Understandable
- **Clear Language**: Plain language in all interface text
- **Consistent Navigation**: Predictable interaction patterns
- **Error Prevention**: Clear feedback for all user actions

#### Robust
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Cross-Platform**: Works with assistive technologies
- **Future-Proof**: Uses standard web technologies

### Accessibility Testing

```bash
# Install accessibility testing tools
npm install -D @axe-core/playwright axe-core

# Run accessibility tests
npm run test:a11y
```

## 🎯 Performance Metrics

### Target Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Frame Rate**: Consistent 60fps animations
- **Bundle Size**: < 500KB gzipped

### Optimization Techniques

#### Code Splitting
```javascript
// Dynamic imports for large components
const loadWorkflowCanvas = () => import('./components/WorkflowCanvas.js')
```

#### Resource Optimization
- **Lazy Loading**: Portfolio sections load on interaction
- **Image Optimization**: SVG graphics for scalability
- **Font Loading**: System fonts for performance
- **Caching**: Service worker for offline capability

#### Animation Performance
- **Hardware Acceleration**: `transform` and `opacity` properties
- **RAF Management**: Batched DOM updates
- **Adaptive Quality**: Reduced effects on low-performance devices

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper tests
4. **Run quality checks**: `npm run lint && npm test`
5. **Commit changes**: Use conventional commit format
6. **Push branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Code Standards

- **ES6+ JavaScript**: Modern syntax and features
- **Functional Programming**: Prefer pure functions
- **Component Architecture**: Single responsibility principle
- **Documentation**: JSDoc comments for public APIs
- **Testing**: Minimum 80% test coverage

### Commit Convention

```
feat: add new portfolio section component
fix: resolve accessibility focus issue
docs: update installation instructions
style: improve responsive design for tablets
test: add coverage for workflow state management
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apache Airflow**: Inspiration for DAG visualization concepts
- **Vite Team**: Excellent development experience
- **Web Accessibility Initiative**: WCAG guidelines and best practices
- **Open Source Community**: Tools and libraries that made this possible

---

**Built with ❤️ by Dan Vo** | Data Engineer passionate about workflow orchestration and accessible web experiences
