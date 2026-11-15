/**
 * SKILLRISE AI — Comprehensive Multi-Disciplinary Skill Taxonomy
 * Categorized into Modern Software, AI/Data Science, Clean Energy (SDG 8.2), Cloud/DevOps, and 21st Century Soft Skills
 */

const SkillTaxonomy = {
  categories: [
    {
      id: "ai_data",
      name: "AI & Data Science",
      color: "#8B35E8",
      skills: [
        { id: "python_data", name: "Python for Data Science", aliases: ["pandas", "numpy", "python data", "scipy"], demandWeight: 0.98, difficulty: "Intermediate" },
        { id: "machine_learning", name: "Machine Learning", aliases: ["ml", "scikit-learn", "supervised learning", "unsupervised learning"], demandWeight: 0.95, difficulty: "Advanced" },
        { id: "deep_learning", name: "Deep Learning & Neural Networks", aliases: ["tensorflow", "pytorch", "keras", "cnn", "transformers"], demandWeight: 0.92, difficulty: "Advanced" },
        { id: "nlp", name: "Natural Language Processing (NLP)", aliases: ["nlp", "text processing", "tokenization", "sentiment analysis", "spacy", "nltk", "llm"], demandWeight: 0.94, difficulty: "Advanced" },
        { id: "gen_ai", name: "Generative AI & LLMs", aliases: ["prompt engineering", "langchain", "rag", "vector database", "hugging face", "openai"], demandWeight: 0.99, difficulty: "Intermediate" },
        { id: "data_visualization", name: "Data Visualization & BI", aliases: ["tableau", "power bi", "matplotlib", "seaborn", "data storytelling"], demandWeight: 0.88, difficulty: "Beginner" },
        { id: "sql", name: "SQL & Relational Databases", aliases: ["sql", "postgresql", "mysql", "sqlite", "relational database"], demandWeight: 0.96, difficulty: "Intermediate" }
      ]
    },
    {
      id: "web_fullstack",
      name: "Full-Stack Web Engineering",
      color: "#FF7417",
      skills: [
        { id: "javascript", name: "JavaScript (ES6+)", aliases: ["js", "es6", "vanilla js", "ecmascript"], demandWeight: 0.98, difficulty: "Intermediate" },
        { id: "typescript", name: "TypeScript", aliases: ["ts"], demandWeight: 0.93, difficulty: "Intermediate" },
        { id: "react", name: "React & Modern UI", aliases: ["reactjs", "react.js", "react hooks", "nextjs"], demandWeight: 0.96, difficulty: "Intermediate" },
        { id: "nodejs", name: "Node.js & Express", aliases: ["node", "nodejs", "express", "backend js"], demandWeight: 0.94, difficulty: "Intermediate" },
        { id: "html_css", name: "HTML5 & Tailwind CSS", aliases: ["html5", "css3", "tailwind", "responsive design", "flexbox", "grid"], demandWeight: 0.88, difficulty: "Beginner" },
        { id: "rest_api", name: "RESTful API Architecture", aliases: ["rest", "rest api", "json api", "endpoints", "api design"], demandWeight: 0.95, difficulty: "Intermediate" },
        { id: "graphql", name: "GraphQL", aliases: ["apollo", "graphql api"], demandWeight: 0.78, difficulty: "Advanced" }
      ]
    },
    {
      id: "green_tech",
      name: "Green Tech & Renewable Energy (SDG 8.2)",
      color: "#10B981",
      skills: [
        { id: "solar_pv", name: "Solar PV Systems & Installation", aliases: ["solar pv", "photovoltaic", "solar panels", "inverters", "solar design"], demandWeight: 0.90, difficulty: "Intermediate" },
        { id: "energy_audit", name: "Energy Auditing & Decarbonization", aliases: ["energy audit", "energy efficiency", "hvac optimization", "building management"], demandWeight: 0.86, difficulty: "Intermediate" },
        { id: "battery_storage", name: "Battery Energy Storage Systems (BESS)", aliases: ["bess", "battery storage", "lithium-ion", "microgrid"], demandWeight: 0.89, difficulty: "Intermediate" },
        { id: "carbon_accounting", name: "Carbon Accounting & GHG Protocols", aliases: ["carbon accounting", "ghg protocol", "scope 1 2 3", "esg reporting", "carbon footprint"], demandWeight: 0.88, difficulty: "Intermediate" },
        { id: "iot_sensors", name: "Environmental IoT & Telemetry", aliases: ["environmental iot", "arduino", "raspberry pi", "lorawan", "sensors", "telemetry"], demandWeight: 0.85, difficulty: "Intermediate" }
      ]
    },
    {
      id: "cloud_devops",
      name: "Cloud, Infrastructure & DevOps",
      color: "#F044A5",
      skills: [
        { id: "git", name: "Git & Version Control", aliases: ["git", "github", "gitlab", "branching", "pull requests"], demandWeight: 0.99, difficulty: "Beginner" },
        { id: "docker", name: "Docker & Containerization", aliases: ["docker", "containers", "dockerfile", "docker-compose"], demandWeight: 0.94, difficulty: "Intermediate" },
        { id: "kubernetes", name: "Kubernetes Orchestration", aliases: ["k8s", "container orchestration", "helm"], demandWeight: 0.87, difficulty: "Advanced" },
        { id: "cicd", name: "CI/CD Pipelines", aliases: ["ci/cd", "continuous integration", "github actions", "jenkins"], demandWeight: 0.91, difficulty: "Intermediate" },
        { id: "aws", name: "Amazon Web Services (AWS)", aliases: ["aws", "ec2", "s3", "lambda", "cloudwatch"], demandWeight: 0.93, difficulty: "Intermediate" },
        { id: "linux", name: "Linux & Bash Scripting", aliases: ["linux", "bash", "shell scripting", "unix cli"], demandWeight: 0.95, difficulty: "Beginner" }
      ]
    },
    {
      id: "soft_skills",
      name: "Employability & 21st Century Soft Skills (SDG 8.6)",
      color: "#FFF0E8",
      skills: [
        { id: "problem_solving", name: "Analytical Problem Solving", aliases: ["problem solving", "troubleshooting", "debugging", "critical thinking"], demandWeight: 0.98, difficulty: "Intermediate" },
        { id: "communication", name: "Professional Technical Communication", aliases: ["communication", "technical writing", "presentation", "documentation"], demandWeight: 0.96, difficulty: "Beginner" },
        { id: "team_collaboration", name: "Team Collaboration & Cross-Functional Work", aliases: ["teamwork", "collaboration", "peer review", "cross-functional"], demandWeight: 0.95, difficulty: "Beginner" },
        { id: "agile_scrum", name: "Agile & Scrum Methodologies", aliases: ["agile", "scrum", "sprints", "kanban", "jira"], demandWeight: 0.92, difficulty: "Beginner" }
      ]
    }
  ],

  targetRoles: [
    {
      id: "ai_engineer",
      title: "AI & Machine Learning Associate",
      sector: "Data Science & AI",
      requiredSkills: ["python_data", "machine_learning", "sql", "nlp", "problem_solving", "git"],
      recommendedSkills: ["gen_ai", "deep_learning", "docker", "communication"],
      avgStartingSalary: "$72,000 - $96,000",
      demandGrowth: "+46% YoY"
    },
    {
      id: "fullstack_dev",
      title: "Full-Stack Web Developer",
      sector: "Web Engineering",
      requiredSkills: ["javascript", "react", "nodejs", "sql", "rest_api", "git", "problem_solving", "team_collaboration"],
      recommendedSkills: ["typescript", "html_css", "docker", "cicd"],
      avgStartingSalary: "$65,000 - $88,000",
      demandGrowth: "+26% YoY"
    },
    {
      id: "green_tech_spec",
      title: "Clean Energy & Green Tech Specialist",
      sector: "Green Tech (SDG 8.2)",
      requiredSkills: ["solar_pv", "energy_audit", "iot_sensors", "problem_solving", "team_collaboration"],
      recommendedSkills: ["battery_storage", "carbon_accounting", "python_data"],
      avgStartingSalary: "$58,000 - $82,000",
      demandGrowth: "+42% YoY"
    },
    {
      id: "cloud_devops_eng",
      title: "Junior Cloud & DevOps Associate",
      sector: "Cloud Infrastructure",
      requiredSkills: ["linux", "git", "docker", "aws", "cicd", "problem_solving"],
      recommendedSkills: ["kubernetes", "nodejs", "agile_scrum"],
      avgStartingSalary: "$68,000 - $92,000",
      demandGrowth: "+33% YoY"
    }
  ],

  getSkillById: function(id) {
    for (const cat of this.categories) {
      const match = cat.skills.find(s => s.id === id);
      if (match) return { ...match, category: cat.name, color: cat.color };
    }
    return null;
  },

  getAllSkills: function() {
    const list = [];
    for (const cat of this.categories) {
      for (const s of cat.skills) {
        list.push({ ...s, category: cat.name, categoryId: cat.id, color: cat.color });
      }
    }
    return list;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillTaxonomy;
}
