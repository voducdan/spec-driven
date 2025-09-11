// Portfolio data structure based on VODUCDAN-DATA_ENGINEER.pdf
// This will be populated with actual data from the PDF

export const portfolioData = {
  personal: {
    name: 'Dan Vo',
    title: 'Data Engineer',
    email: 'voducdand99@gmail.com',
    phone: '0972184325',
    location: 'Binh Thanh district, Ho Chi Minh city',
    website: 'https://voducdan.github.io/cv/',
    summary:
      'As a Data Engineer, I am passionate and dedicated to my work. I am committed to continuously improving my skills and expertise. Leveraging a solid foundation in the Data Engineering sector, I am confident in contributing to project success by delivering robust and efficient data solutions. I find joy in every aspect of the design process, from initial discussions and collaboration to concept development and execution. My greatest satisfaction comes from seeing the final product achieve its intended goals.',
  },

  education: [
    {
      id: 'edu-1',
      institution: 'HCM University of Science',
      degree: 'Bachelor Information Technology',
      field: 'Information Technology',
      year: '8/2017 - 10/2021',
      gpa: '7.3/10',
      status: 'success',
      details: 'Bachelor degree in Information Technology with focus on data systems and algorithms',
    },
  ],

  experience: [
    {
      id: 'exp-1',
      company: 'MoMo',
      position: 'Data Engineer',
      duration: '7/2022 - Present',
      status: 'success',
      responsibilities: [
        'Operate and scale Airflow on Kubernetes to serve over 3,000 DAGs, ensuring tasks meet their SLA by running on time',
        'Guarantee DAG files are updated and reflected on the Airflow UI with a P90 latency of less than 15 seconds',
        'Leverage advanced Airflow features such as Pools, Queues, Priority Weights, and Cluster Policies to optimize resource utilization',
        'Set up CI pipelines using Gitlab CI to test and sync DAG code from GitLab to Airflow',
        'Developed a tool to support batch ingestion from various data sources using Spark on K8S',
        'Proposed and implemented a new solution to increase report update frequency from once per day to every 5 minutes using ClickHouse Kafka Connect',
        'Designed and developed a lakehouse system based on the medallion architecture using Spark, Iceberg, Hive Metastore, and GCS',
        'Managed infrastructure on Kubernetes in an Infrastructure-as-Code (IaC) approach using Pulumi'
      ],
      technologies: ['GCP', 'Kubernetes', 'Spark', 'Airflow', 'ClickHouse', 'Pulumi', 'Kafka'],
    },
    {
      id: 'exp-2',
      company: 'Amanotes',
      position: 'Data Engineer',
      duration: '6/2021 - 7/2022',
      status: 'success',
      responsibilities: [
        'Designed data models for event data from games',
        'Crawled/pulled data from partners\' APIs/Dashboards',
        'Applied DBT for transforming raw data from firebase'
      ],
      technologies: ['Python', 'GCP', 'Airflow', 'DBT', 'Docker'],
    },
    {
      id: 'exp-3',
      company: 'FPT Software',
      position: 'Data Engineer',
      duration: '1/2021 - 7/2021',
      status: 'success',
      responsibilities: [
        'Created data pipelines to extract, transform and load large datasets from csv files into the data warehouse',
        'Designed and developed data models',
        'Participated in building the infrastructure required for optimal extraction, transformation, and loading processes'
      ],
      technologies: ['Python', 'GCP', 'Airflow'],
    },
    {
      id: 'exp-4',
      company: 'Asia Commercial Bank (ACB)',
      position: 'Data Engineer Collaborator',
      duration: '7/2020 - 1/2021',
      status: 'success',
      responsibilities: [
        'Maintained data infrastructure',
        'Built data lineage to quickly identify the source tables of reports',
        'Crawled and enriched data for analytical purposes'
      ],
      technologies: ['Spark', 'Hadoop', 'Python', 'SQL', 'Oracle'],
    },
  ],

  skills: {
    technical: {
      id: 'skill-technical',
      category: 'Technical Skills',
      items: ['Spark', 'SQL', 'Data Modeling', 'ClickHouse', 'GCP', 'K8S', 'Docker', 'Airflow', 'Linux', 'Git'],
      proficiency: 90,
      status: 'success',
    },
    programming: {
      id: 'skill-prog',
      category: 'Programming Languages',
      items: ['Python', 'Javascript', 'OOP', 'Data Structures and Algorithms'],
      proficiency: 95,
      status: 'success',
    },
    dataTools: {
      id: 'skill-data',
      category: 'Data Engineering Tools',
      items: ['Apache Airflow', 'Apache Spark', 'Kafka', 'DBT', 'Hadoop'],
      proficiency: 90,
      status: 'running',
    },
    cloud: {
      id: 'skill-cloud',
      category: 'Cloud & Infrastructure',
      items: ['GCP', 'Kubernetes', 'Docker', 'Pulumi', 'Infrastructure-as-Code'],
      proficiency: 85,
      status: 'success',
    },
    databases: {
      id: 'skill-db',
      category: 'Databases & Storage',
      items: ['ClickHouse', 'Oracle', 'BigQuery', 'Hive Metastore', 'Iceberg'],
      proficiency: 85,
      status: 'success',
    },
  },

  certifications: [
    {
      id: 'cert-1',
      name: 'ClickHouse Certified Developer',
      issuer: 'ClickHouse',
      year: 'Current',
      status: 'success',
    },
    {
      id: 'cert-2',
      name: 'HackerRank SQL (Advanced) Certificate',
      issuer: 'HackerRank',
      year: 'Current',
      status: 'success',
    },
    {
      id: 'cert-3',
      name: 'GCP Professional Data Engineer',
      issuer: 'Google Cloud',
      year: 'Current',
      status: 'success',
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Airflow on Kubernetes Platform',
      description: 'Operate and scale Airflow on Kubernetes to serve over 3,000 DAGs with P90 latency of less than 15 seconds',
      technologies: ['Kubernetes', 'Apache Airflow', 'GitLab CI', 'Python'],
      status: 'success',
      company: 'MoMo',
      highlights: [
        'Scaled to 3,000+ DAGs',
        'P90 latency < 15 seconds',
        'Advanced Airflow features optimization',
        'CI/CD pipeline implementation'
      ],
    },
    {
      id: 'proj-2',
      title: 'Batch Ingestion Tool with Spark',
      description: 'Developed a comprehensive tool to support batch ingestion from various data sources using Spark on Kubernetes',
      technologies: ['Apache Spark', 'Kubernetes', 'Python', 'Security Management'],
      status: 'success',
      company: 'MoMo',
      highlights: [
        'Full development lifecycle participation',
        'Kubernetes Admission Control implementation',
        'Secret management for data security',
        'UI development for user interface'
      ],
    },
    {
      id: 'proj-3',
      title: 'Real-time Reporting with ClickHouse',
      description: 'Increased report update frequency from daily to every 5 minutes using ClickHouse Kafka Connect streaming',
      technologies: ['ClickHouse', 'Kafka Connect', 'ReplacingMergeTree', 'Materialized Views'],
      status: 'success',
      company: 'MoMo',
      highlights: [
        'Frequency improved from daily to 5-minute updates',
        'Data deduplication and pre-aggregation',
        'Significant load reduction on transformations',
        'Dashboard query performance optimization'
      ],
    },
    {
      id: 'proj-4',
      title: 'Lakehouse Architecture Implementation',
      description: 'Designed and developed a lakehouse system based on medallion architecture using modern data stack',
      technologies: ['Apache Spark', 'Apache Iceberg', 'Hive Metastore', 'Google Cloud Storage'],
      status: 'success',
      company: 'MoMo',
      highlights: [
        'Medallion architecture implementation',
        'Modern lakehouse design',
        'Scalable data storage solution',
        'Cloud-native approach'
      ],
    },
    {
      id: 'proj-5',
      title: 'Infrastructure as Code with Pulumi',
      description: 'Managed Kubernetes infrastructure using Infrastructure-as-Code approach with Pulumi',
      technologies: ['Pulumi', 'Kubernetes', 'Infrastructure-as-Code', 'GCP'],
      status: 'running',
      company: 'MoMo',
      highlights: [
        'IaC implementation',
        'Kubernetes management',
        'Automated infrastructure provisioning',
        'Cloud resource optimization'
      ],
    },
  ],

  // Airflow DAG structure for visualization
  dagStructure: {
    tasks: [
      // Education Group Tasks
      {
        id: 'edu-bachelor',
        title: 'Bachelor Information Technology',
        type: 'education',
        status: 'success',
        dependencies: [],
        position: { x: 120, y: 140 },
        description: 'HCM University of Science (8/2017 - 10/2021)',
        details: {
          institution: 'HCM University of Science',
          degree: 'Bachelor Information Technology',
          gpa: '7.3/10',
          duration: '8/2017 - 10/2021'
        }
      },

      // Experience Group Tasks
      {
        id: 'exp-momo',
        title: 'Data Engineer at MoMo',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 420, y: 120 },
        description: 'Current role: Airflow on K8S, Spark, ClickHouse',
        details: {
          company: 'MoMo',
          position: 'Data Engineer',
          duration: '7/2022 - Present',
          highlights: [
            'Operate and scale Airflow on Kubernetes to serve over 3,000 DAGs',
            'Developed batch ingestion tool using Spark on K8S',
            'Implemented real-time reporting with ClickHouse Kafka Connect',
            'Designed lakehouse system based on medallion architecture'
          ]
        }
      },
      {
        id: 'exp-amanotes',
        title: 'Data Engineer at Amanotes',
        type: 'experience',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 420, y: 280 },
        description: 'Event data modeling, API integration, DBT transforms',
        details: {
          company: 'Amanotes',
          position: 'Data Engineer',
          duration: '6/2021 - 7/2022',
          highlights: [
            'Designed data models for event data from games',
            'Crawled/pulled data from partners APIs/Dashboards',
            'Applied DBT for transforming raw data from firebase'
          ]
        }
      },

      // Skills Group Tasks
      {
        id: 'skills-technical',
        title: 'Technical Skills',
        type: 'skills',
        status: 'running',
        dependencies: ['exp-momo', 'exp-amanotes'],
        position: { x: 720, y: 140 },
        description: 'Python, Spark, Airflow, K8S, ClickHouse, GCP',
        details: {
          category: 'Technical Skills',
          items: ['Spark', 'SQL', 'Data Modeling', 'ClickHouse', 'GCP', 'K8S', 'Docker', 'Airflow'],
          proficiency: 90
        }
      },
      {
        id: 'skills-programming',
        title: 'Programming Languages',
        type: 'skills',
        status: 'success',
        dependencies: ['exp-momo'],
        position: { x: 720, y: 280 },
        description: 'Python, JavaScript, OOP, Data Structures',
        details: {
          category: 'Programming Languages',
          items: ['Python', 'Javascript', 'OOP', 'Data Structures and Algorithms'],
          proficiency: 95
        }
      },

      // Projects Group Tasks
      {
        id: 'proj-airflow-k8s',
        title: 'Airflow on Kubernetes',
        type: 'projects',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1020, y: 100 },
        description: 'Scaled Airflow to serve 3,000+ DAGs on K8S',
        details: {
          title: 'Airflow on Kubernetes Platform',
          technologies: ['Kubernetes', 'Apache Airflow', 'GitLab CI', 'Python'],
          highlights: [
            'Scaled to 3,000+ DAGs',
            'P90 latency < 15 seconds',
            'Advanced Airflow features optimization'
          ]
        }
      },
      {
        id: 'proj-batch-ingestion',
        title: 'Spark Batch Ingestion Tool',
        type: 'projects',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1020, y: 200 },
        description: 'Comprehensive batch ingestion with Spark on K8S',
        details: {
          title: 'Batch Ingestion Tool with Spark',
          technologies: ['Apache Spark', 'Kubernetes', 'Python'],
          highlights: [
            'Full development lifecycle participation',
            'Kubernetes Admission Control implementation',
            'Secret management for data security'
          ]
        }
      },
      {
        id: 'proj-clickhouse-streaming',
        title: 'ClickHouse Real-time Analytics',
        type: 'projects',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1020, y: 300 },
        description: 'Real-time reporting with 5-minute update frequency',
        details: {
          title: 'Real-time Reporting with ClickHouse',
          technologies: ['ClickHouse', 'Kafka Connect', 'ReplacingMergeTree'],
          highlights: [
            'Improved frequency from daily to 5-minute updates',
            'Data deduplication and pre-aggregation',
            'Dashboard query performance optimization'
          ]
        }
      },

      // Certifications Group Tasks
      {
        id: 'cert-clickhouse',
        title: 'ClickHouse Certified Developer',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1320, y: 140 },
        description: 'ClickHouse official certification',
        details: {
          name: 'ClickHouse Certified Developer',
          issuer: 'ClickHouse',
          year: 'Current'
        }
      },
      {
        id: 'cert-gcp',
        title: 'GCP Professional Data Engineer',
        type: 'certifications',
        status: 'success',
        dependencies: ['skills-technical'],
        position: { x: 1320, y: 240 },
        description: 'Google Cloud Professional Data Engineer',
        details: {
          name: 'GCP Professional Data Engineer',
          issuer: 'Google Cloud',
          year: 'Current'
        }
      },
    ],

    taskGroups: [
      {
        id: 'education-group',
        title: 'Education',
        tasks: ['edu-bachelor'],
        position: { x: 80, y: 90 },
        collapsed: false,
        color: '#10b981'
      },
      {
        id: 'experience-group',
        title: 'Professional Experience',
        tasks: ['exp-momo', 'exp-amanotes'],
        position: { x: 350, y: 70 },
        collapsed: false,
        color: '#3b82f6'
      },
      {
        id: 'skills-group',
        title: 'Technical Skills',
        tasks: ['skills-technical', 'skills-programming'],
        position: { x: 650, y: 90 },
        collapsed: false,
        color: '#8b5cf6'
      },
      {
        id: 'projects-group',
        title: 'Key Projects',
        tasks: ['proj-airflow-k8s', 'proj-batch-ingestion', 'proj-clickhouse-streaming'],
        position: { x: 950, y: 60 },
        collapsed: false,
        color: '#f59e0b'
      },
      {
        id: 'certifications-group',
        title: 'Certifications',
        tasks: ['cert-clickhouse', 'cert-gcp'],
        position: { x: 1250, y: 90 },
        collapsed: false,
        color: '#ef4444'
      },
    ],
  },
}

// Helper functions for data manipulation
export const portfolioHelpers = {
  getTaskByType(type) {
    return portfolioData.dagStructure.tasks.find(task => task.type === type)
  },

  getSkillsProficiency() {
    const skills = portfolioData.skills
    const total = Object.values(skills).reduce((sum, skill) => sum + skill.proficiency, 0)
    return Math.round(total / Object.keys(skills).length)
  },

  getExperienceYears() {
    // Calculate based on latest experience (MoMo started 7/2022, current is 9/2025)
    const startDate = new Date('2022-07-01');
    const currentDate = new Date('2025-09-11');
    const diffYears = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ years`;
  },

  getProjectCount() {
    return portfolioData.projects.length
  },

  // Convert portfolio data to Airflow-compatible format
  toAirflowTasks() {
    return portfolioData.dagStructure.tasks.map(task => ({
      task_id: task.id,
      task_type: task.type,
      status: task.status,
      dependencies: task.dependencies,
      metadata: this.getTaskMetadata(task.type),
    }))
  },

  getTaskMetadata(type) {
    switch (type) {
      case 'education':
        return portfolioData.education
      case 'experience':
        return portfolioData.experience
      case 'skills':
        return portfolioData.skills
      case 'projects':
        return portfolioData.projects
      case 'certifications':
        return portfolioData.certifications
      default:
        return {}
    }
  },
}
