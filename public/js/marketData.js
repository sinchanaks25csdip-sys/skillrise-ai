/**
 * SKILLRISE AI — Regional Labor Market Intelligence & Job Recommender
 */

const MarketData = (function() {
  const INITIAL_JOBS = [
    {
      id: "job-ai-01",
      title: "Junior AI & NLP Solutions Engineer",
      company: "Cognitive Horizon Labs",
      region: "Asia-Pacific",
      city: "Bengaluru, India (Hybrid)",
      sector: "Data Science & AI",
      expLevel: "Entry Level (0-2 yrs)",
      salary: "₹10,50,000 - ₹14,00,000",
      skills: ["Python for Data Science", "Machine Learning", "Natural Language Processing (NLP)", "Generative AI & LLMs", "SQL & Relational Databases", "Git & Version Control"],
      description: "Build cutting-edge prompt engineering workflows, fine-tune open-weights LLMs, and craft customer intelligence bots with our generative AI team.",
      sdgImpact: "SDG 8.2 — High-Value AI Adoption"
    },
    {
      id: "job-web-01",
      title: "Junior Full-Stack Web Developer",
      company: "Nexus Cloud Systems",
      region: "North America",
      city: "Austin, TX (Remote / Hybrid)",
      sector: "Web Engineering",
      expLevel: "Entry Level (0-2 yrs)",
      salary: "$74,000 - $88,000",
      skills: ["JavaScript (ES6+)", "React & Modern UI", "TypeScript", "Node.js & Express", "RESTful API Architecture", "Git & Version Control"],
      description: "Join an agile engineering team building next-generation SaaS portals. Write responsive React frontends, build performant Express microservices, and collaborate through pull requests.",
      sdgImpact: "SDG 8.2 — Technological Innovation"
    },
    {
      id: "job-green-01",
      title: "Clean Energy Microgrid Field Specialist",
      company: "Aura Renewable Power",
      region: "Europe",
      city: "Berlin, Germany",
      sector: "Green Tech (SDG 8.2)",
      expLevel: "Junior / Vocational (0-2 yrs)",
      salary: "€52,000 - €64,000",
      skills: ["Solar PV Systems & Installation", "Battery Energy Storage Systems (BESS)", "Energy Auditing & Decarbonization", "Environmental IoT & Telemetry", "Analytical Problem Solving"],
      description: "Deploy and commission distributed solar PV arrays and lithium-ion battery storage units. Monitor IoT sensor telemetry and audit power efficiency across commercial sites.",
      sdgImpact: "SDG 8.2 & SDG 7 — Clean Energy Transition"
    },
    {
      id: "job-devops-01",
      title: "Associate Cloud & DevOps Administrator",
      company: "Stratosphere Cloud",
      region: "Global Remote",
      city: "Worldwide (Remote)",
      sector: "Cloud Infrastructure",
      expLevel: "Entry Level (1-2 yrs)",
      salary: "$68,000 - $85,000",
      skills: ["Linux & Bash Scripting", "Docker & Containerization", "CI/CD Pipelines", "Amazon Web Services (AWS)", "Git & Version Control"],
      description: "Configure containerized staging environments using Docker, implement GitHub Actions CI/CD workflows, manage AWS cloud instances, and enforce strict security hygiene.",
      sdgImpact: "SDG 8.6 — Global Remote Accessibility"
    },
    {
      id: "job-green-02",
      title: "Solar Photovoltaic Technical Associate",
      company: "Kibo Clean Power Initiative",
      region: "Sub-Saharan Africa",
      city: "Nairobi, Kenya (Field)",
      sector: "Green Tech (SDG 8.2)",
      expLevel: "Vocational Diploma (0-2 yrs)",
      salary: "KES 1,350,000 - 1,900,000",
      skills: ["Solar PV Systems & Installation", "Battery Energy Storage Systems (BESS)", "Energy Auditing & Decarbonization", "Team Collaboration & Cross-Functional Work"],
      description: "Assist in rural microgrid assembly, inverter synchronization, and solar PV array diagnostics. Help expand reliable clean power to underserved rural agricultural centers.",
      sdgImpact: "SDG 8.6 & 8.2 — Vocational Green Jobs"
    },
    {
      id: "job-data-02",
      title: "Junior Data Analyst & BI Specialist",
      company: "Vanguard Analytics",
      region: "Europe",
      city: "London, UK (Hybrid)",
      sector: "Data Science & AI",
      expLevel: "Entry Level (0-2 yrs)",
      salary: "£42,000 - £54,000",
      skills: ["Python for Data Science", "SQL & Relational Databases", "Data Visualization & BI", "Professional Technical Communication", "Analytical Problem Solving"],
      description: "Translate complex business telemetry into executive dashboards in Tableau/Power BI. Write performant PostgreSQL queries and identify customer churn patterns with Python.",
      sdgImpact: "SDG 8.2 — Productive Data Capabilities"
    }
  ];

  let currentJobs = [...INITIAL_JOBS];

  function getAllJobs() {
    return currentJobs;
  }

  function filterJobs({ keyword, region, sector, expLevel }) {
    return currentJobs.filter(job => {
      if (keyword) {
        const kw = keyword.toLowerCase();
        const mTitle = job.title.toLowerCase().includes(kw);
        const mCompany = job.company.toLowerCase().includes(kw);
        const mDesc = job.description.toLowerCase().includes(kw);
        const mSkills = job.skills.some(s => s.toLowerCase().includes(kw));
        if (!mTitle && !mCompany && !mDesc && !mSkills) return false;
      }
      if (region && region !== 'All Locations' && job.region !== region) return false;
      if (sector && sector !== 'All Sectors' && job.sector !== sector) return false;
      if (expLevel && expLevel !== 'All Levels' && !job.expLevel.includes(expLevel)) return false;
      return true;
    });
  }

  function matchJobsToCandidateSkills(candidateSkills) {
    const candidateSkillNames = new Set(candidateSkills.map(s => (s.name || s).toLowerCase()));

    return currentJobs.map(job => {
      let matchedCount = 0;
      job.skills.forEach(reqSkill => {
        if (candidateSkillNames.has(reqSkill.toLowerCase())) {
          matchedCount++;
        }
      });
      const matchPercentage = Math.min(100, Math.round((matchedCount / Math.max(1, job.skills.length)) * 100));
      return {
        ...job,
        matchedCount,
        matchPercentage
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  function getMarketInsights() {
    return {
      topSkills: [
        { name: "Generative AI & LLMs", sector: "AI & Data", count: 86, growth: "+65% YoY" },
        { name: "Python for Data Science", sector: "AI & Data", count: 74, growth: "+38% YoY" },
        { name: "Solar PV Systems (SDG 8.2)", sector: "Green Tech", count: 62, growth: "+42% YoY" },
        { name: "React & Modern UI", sector: "Web Engineering", count: 68, growth: "+26% YoY" },
        { name: "Docker & Containers", sector: "Cloud/DevOps", count: 58, growth: "+31% YoY" },
        { name: "Battery Storage (BESS)", sector: "Green Tech", count: 51, growth: "+45% YoY" },
        { name: "SQL & Databases", sector: "Data", count: 65, growth: "+24% YoY" },
        { name: "Analytical Problem Solving", sector: "Soft Skills", count: 82, growth: "+29% YoY" }
      ],
      sectorDistribution: [
        { label: "Data Science & AI", value: 36, color: "#8B35E8" },
        { label: "Web Engineering", value: 30, color: "#FF7417" },
        { label: "Green Tech (SDG 8.2)", value: 20, color: "#10B981" },
        { label: "Cloud & Infrastructure", value: 14, color: "#F044A5" }
      ]
    };
  }

  return {
    getAllJobs,
    filterJobs,
    matchJobsToCandidateSkills,
    getMarketInsights
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketData;
}
