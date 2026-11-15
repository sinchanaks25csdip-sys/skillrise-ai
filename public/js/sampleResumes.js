/**
 * SKILLRISE AI — Sample Youth Profiles for Instant 1-Click Demos
 */

const SampleResumes = {
  cs_graduate: {
    id: "cs_graduate",
    name: "Aarav Sharma",
    role: "Computer Science Graduate",
    targetRole: "ai_engineer",
    summary: "Recent engineering graduate with academic foundation in algorithms, basic Python, and relational databases. Seeking to break into artificial intelligence and machine learning.",
    content: `Aarav Sharma
Bengaluru, India | aarav.sharma@aimail.com | github.com/aarav-ai

OBJECTIVE
Recent B.Tech in Computer Science graduate eager to apply algorithmic problem-solving and programming fundamentals to an entry-level Artificial Intelligence and Machine Learning engineering role.

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2022 - 2026)
Visvesvaraya Technological University — CGPA: 8.4/10

TECHNICAL SKILLS & COMPETENCIES
- Programming: Python for Data Science, Java, C++, basic SQL
- Core Fundamentals: Data Structures, Algorithms, Analytical Problem Solving, Relational Databases
- Version Control: Git, GitHub
- Soft Skills: Team Collaboration & Cross-Functional Work, Eager Learner

PROJECTS
- Student Performance Clustering: Python script utilizing Pandas and basic Scikit-Learn to segment academic cohorts based on assessment grades.
- Campus Library Management System: Java Swing desktop application connected to MySQL database with relational schema design.
- Algorithm Visualizer: Interactive web-based QuickSort and Binary Search tree visualizer.`
  },

  self_taught_web_dev: {
    id: "self_taught_web_dev",
    name: "Elena Rostova",
    role: "Self-Taught Frontend Developer",
    targetRole: "fullstack_dev",
    summary: "Dedicated self-taught web developer with strong visual and client-side skills. Looking to master full-stack Node.js and API engineering.",
    content: `Elena Rostova
Austin, TX | elena.rostova@devmail.io | elena-portfolio.dev

PROFESSIONAL SUMMARY
Motivated self-taught developer with hands-on experience building dynamic single-page web applications using modern JavaScript and React. Passionate about responsive UI and component design.

SKILLS & TOOLING
- Frontend: JavaScript (ES6+), React & Modern UI, HTML5 & Tailwind CSS, Responsive Design
- Version Control & Workflow: Git, GitHub, npm, Agile & Scrum Methodologies
- Collaboration & Strengths: Analytical Problem Solving, Fast Learner, Professional Technical Communication

FEATURED PROJECTS
- EcoStore Commerce Portal: React single-page storefront with dynamic shopping cart state, search filtering, and custom Tailwind styling.
- RecipeFinder App: Asynchronous web app querying external REST APIs with debounced search and bookmarking features.
- Accessible Design System: WCAG compliant modular UI button and input library.`
  },

  junior_data_analyst: {
    id: "junior_data_analyst",
    name: "Priya Patel",
    role: "Junior Data Analyst & BI Specialist",
    targetRole: "ai_engineer",
    summary: "Economics and Statistics graduate skilled in exploratory data analysis and executive dashboards in Power BI/Tableau.",
    content: `Priya Patel
London, UK | priya.patel@analystmail.co.uk | linkedin.com/in/priya-patel-data

PROFESSIONAL SUMMARY
Entry-level Data Analyst with strong statistical foundation. Experienced in cleaning tabular data, writing relational SQL queries, and creating executive business dashboards.

TECHNICAL COMPETENCIES
- Data Analysis: Python for Data Science, Pandas, NumPy, SQL & Relational Databases, PostgreSQL
- Business Intelligence: Data Visualization & BI, Tableau, Power BI, Advanced Excel
- Professional Strengths: Professional Technical Communication, Analytical Problem Solving, Team Collaboration & Cross-Functional Work

EXPERIENCE & CAPSTONE
- Customer Churn Predictive Analysis: Cleaned and analyzed 10,000+ subscriber records in Python and created interactive Tableau dashboard identifying key churn triggers.
- Retail Inventory Query Optimization: Structured complex multi-table SQL JOIN queries to audit warehouse lead times.`
  },

  vocational_green_tech: {
    id: "vocational_green_tech",
    name: "Kofi Mensah",
    role: "Vocational Clean Energy Technician",
    targetRole: "green_tech_spec",
    summary: "Certified vocational solar technician with practical microgrid assembly and electrical testing experience in emerging markets.",
    content: `Kofi Mensah
Nairobi, Kenya | kofi.mensah@solardrive.org | +254 712 345678

PROFESSIONAL SUMMARY
Certified Vocational Renewable Energy Technician with field experience in solar photovoltaic system assembly, microgrid wiring, and electrical efficiency testing. Dedicated to expanding clean energy access.

VOCATIONAL CERTIFICATIONS & SKILLS
- Renewable Energy: Solar PV Systems & Installation, Inverter Configuration, Battery Energy Storage Systems (BESS), DC/AC Circuit Diagnostics
- Safety & Telemetry: Energy Auditing & Decarbonization, Environmental IoT & Telemetry, Electrical Safety Standards
- Work Ethic: Analytical Problem Solving, Team Collaboration & Cross-Functional Work, Field Troubleshooting

APPRENTICESHIP & FIELD PROJECTS
- Rural Solar Community Microgrid: Commissioned 50 kW rooftop solar PV array for agricultural processing center. Assisted in inverter synchronization and battery calibration.
- Vocational Workshop Energy Audit: Conducted comprehensive energy audit proposing LED retrofitting and circuit rebalancing that lowered peak consumption by 18%.`
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SampleResumes;
}
