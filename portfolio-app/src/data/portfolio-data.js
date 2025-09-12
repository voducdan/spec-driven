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
      // New Root Task
      {
        id: 'king',
        title: 'Live as a King',
        type: 'start',
        status: 'success',
        dependencies: [],
        position: { x: 50, y: 400 },
        description: 'The ultimate goal',
        isGroup: false,
      },

      // Education Group
      {
        id: 'group-education',
        title: 'Education',
        type: 'group',
        status: 'success',
        dependencies: ['king'],
        position: { x: 250, y: 400 },
        description: 'Foundation of knowledge',
        isGroup: true,
      },
      {
        id: 'edu-bachelor',
        title: 'Bachelor Information Technology',
        type: 'education',
        status: 'success',
        dependencies: ['group-education'],
        position: { x: 450, y: 400 },
        description: 'HCM University of Science (8/2017 - 10/2021)',
        details: {
          institution: 'HCM University of Science',
          degree: 'Bachelor Information Technology',
          gpa: '7.3/10',
          duration: '8/2017 - 10/2021'
        },
        group: 'group-education',
      },

      // Experience Group
      {
        id: 'group-experience',
        title: 'Experience',
        type: 'group',
        status: 'success',
        dependencies: ['edu-bachelor'],
        position: { x: 650, y: 400 },
        description: 'Professional journey',
        isGroup: true,
      },
      {
        id: 'exp-momo',
        title: 'Data Engineer at MoMo',
        type: 'experience',
        status: 'success',
        dependencies: ['group-experience'],
        position: { x: 850, y: 150 },
        description: 'Current role: Airflow on K8S, Spark, ClickHouse',
        group: 'group-experience',
        details: {
          company: 'MoMo',
          position: 'Data Engineer',
          duration: '7/2022 - Present',
        }
      },
      {
        id: 'exp-amanotes',
        title: 'Data Engineer at Amanotes',
        type: 'experience',
        status: 'success',
        dependencies: ['group-experience'],
        position: { x: 850, y: 300 },
        description: 'Event data modeling, API integration, DBT transforms',
        group: 'group-experience',
        details: {
          company: 'Amanotes',
          position: 'Data Engineer',
          duration: '6/2021 - 7/2022',
        }
      },
      {
        id: 'exp-fpt',
        title: 'Data Engineer at FPT Software',
        type: 'experience',
        status: 'success',
        dependencies: ['group-experience'],
        position: { x: 850, y: 450 },
        description: 'ETL pipelines and data modeling',
        group: 'group-experience',
        details: {
          company: 'FPT Software',
          position: 'Data Engineer',
          duration: '1/2021 - 7/2021',
        }
      },
      {
        id: 'exp-acb',
        title: 'Data Engineer at ACB',
        type: 'experience',
        status: 'success',
        dependencies: ['group-experience'],
        position: { x: 850, y: 600 },
        description: 'Data infrastructure and data lineage',
        group: 'group-experience',
        details: {
          company: 'Asia Commercial Bank (ACB)',
          position: 'Data Engineer Collaborator',
          duration: '7/2020 - 1/2021',
        }
      },

      // Projects Group
      {
        id: 'group-projects',
        title: 'Projects',
        type: 'group',
        status: 'success',
        dependencies: [
          {from: 'group-experience', label: 'Enabled by'},
          {from: 'exp-momo', label: 'Built at'},
          {from: 'exp-amanotes', label: 'Developed at'}
        ],
        position: { x: 1100, y: 400 },
        description: 'Key accomplishments',
        isGroup: true,
      },
      {
        id: 'proj-airflow-k8s',
        title: 'Airflow on Kubernetes',
        type: 'projects',
        status: 'success',
        dependencies: [{from: 'exp-momo', label: 'Developed at'}],
        position: { x: 1300, y: 100 },
        description: 'Scaled Airflow to serve 3,000+ DAGs on K8S',
        group: 'group-projects',
      },
      {
        id: 'proj-batch-ingestion',
        title: 'Spark Batch Ingestion Tool',
        type: 'projects',
        status: 'success',
        dependencies: [{from: 'exp-momo', label: 'Developed at'}],
        position: { x: 1300, y: 220 },
        description: 'Comprehensive batch ingestion with Spark on K8S',
        group: 'group-projects',
      },
      {
        id: 'proj-clickhouse-streaming',
        title: 'ClickHouse Real-time Analytics',
        type: 'projects',
        status: 'success',
        dependencies: [{from: 'exp-momo', label: 'Developed at'}],
        position: { x: 1300, y: 340 },
        description: 'Real-time reporting with 5-minute update frequency',
        group: 'group-projects',
      },
      {
        id: 'proj-lakehouse',
        title: 'Lakehouse Architecture',
        type: 'projects',
        status: 'success',
        dependencies: [{from: 'exp-momo', label: 'Developed at'}],
        position: { x: 1300, y: 460 },
        description: 'Medallion architecture with Spark and Iceberg',
        group: 'group-projects',
      },
      {
        id: 'proj-pulumi',
        title: 'Infrastructure as Code',
        type: 'projects',
        status: 'running',
        dependencies: [{from: 'exp-momo', label: 'Developed at'}],
        position: { x: 1300, y: 580 },
        description: 'Managed K8s infrastructure with Pulumi',
        group: 'group-projects',
      },

      // Skills Group
      {
        id: 'group-skills',
        title: 'Skills',
        type: 'group',
        status: 'success',
        dependencies: ['group-projects'], // Connect from projects group
        position: { x: 1550, y: 400 },
        description: 'Technical capabilities',
        isGroup: true,
      },
      {
        id: 'skills-technical',
        title: 'Technical Skills',
        type: 'skills',
        status: 'running',
        dependencies: ['group-skills'],
        position: { x: 1750, y: 150 },
        description: 'Spark, SQL, Data Modeling, ClickHouse, GCP, K8S, Docker, Airflow',
        group: 'group-skills',
      },
      {
        id: 'skills-programming',
        title: 'Programming',
        type: 'skills',
        status: 'success',
        dependencies: ['group-skills'],
        position: { x: 1750, y: 300 },
        description: 'Python, Javascript, OOP, Data Structures and Algorithms',
        group: 'group-skills',
      },
      {
        id: 'skills-data',
        title: 'Data Engineering Tools',
        type: 'skills',
        status: 'running',
        dependencies: ['group-skills'],
        position: { x: 1750, y: 450 },
        description: 'Apache Airflow, Apache Spark, Kafka, DBT, Hadoop',
        group: 'group-skills',
      },
      {
        id: 'skills-cloud',
        title: 'Cloud & Infra',
        type: 'skills',
        status: 'success',
        dependencies: ['group-skills'],
        position: { x: 1750, y: 600 },
        description: 'GCP, Kubernetes, Docker, Pulumi, Infrastructure-as-Code',
        group: 'group-skills',
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
