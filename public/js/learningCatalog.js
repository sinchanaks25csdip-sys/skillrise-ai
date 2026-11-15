/**
 * SKILLRISE AI — Automated Learning Pathway & 100% Free Course Catalog
 */

const LearningCatalog = (function() {
  const COURSES = {
    python_data: {
      title: "Python for Data Science & AI Foundations",
      provider: "University of Michigan / edX & Py4E",
      cost: "100% FREE",
      cert: "Accredited Certificate",
      duration: "30 Hours",
      priority: "High",
      level: "Beginner to Intermediate",
      url: "https://www.py4e.com/",
      topics: ["Data structures", "Web scraping", "Pandas & NumPy basics"]
    },
    machine_learning: {
      title: "Machine Learning with Python",
      provider: "Kaggle Learn / Google",
      cost: "100% FREE",
      cert: "Kaggle Micro-Degree",
      duration: "25 Hours",
      priority: "High",
      level: "Intermediate",
      url: "https://www.kaggle.com/learn/intro-to-machine-learning",
      topics: ["Decision trees", "Random forests", "Model validation", "XGBoost"]
    },
    nlp: {
      title: "Natural Language Processing with Transformers",
      provider: "Hugging Face & DeepLearning.AI",
      cost: "100% FREE",
      cert: "Course Completion Badge",
      duration: "20 Hours",
      priority: "High",
      level: "Advanced",
      url: "https://huggingface.co/learn/nlp-course/",
      topics: ["Tokenizers", "BERT & GPT architectures", "Fine-tuning"]
    },
    gen_ai: {
      title: "Generative AI & Prompt Engineering for Everyone",
      provider: "DeepLearning.AI / Andrew Ng",
      cost: "100% FREE (Audit)",
      cert: "AI Literacy Credential",
      duration: "14 Hours",
      priority: "High",
      level: "Beginner to Intermediate",
      url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/",
      topics: ["LLM architectures", "RAG systems", "Vector search"]
    },
    javascript: {
      title: "JavaScript Algorithms and Data Structures",
      provider: "freeCodeCamp",
      cost: "100% FREE",
      cert: "Verified Developer Certificate",
      duration: "40 Hours",
      priority: "High",
      level: "Beginner to Intermediate",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
      topics: ["ES6+ Syntax", "DOM APIs", "Async/Await", "Functional programming"]
    },
    react: {
      title: "Modern React & Component Architecture",
      provider: "freeCodeCamp & Meta Open Source",
      cost: "100% FREE",
      cert: "Verified Frontend Certificate",
      duration: "35 Hours",
      priority: "High",
      level: "Intermediate",
      url: "https://www.freecodecamp.org/learn/front-end-development-libraries/",
      topics: ["Hooks", "Custom hooks", "Context API", "State management"]
    },
    typescript: {
      title: "TypeScript for JavaScript Programmers",
      provider: "Microsoft Learn & TypeScript Official",
      cost: "100% FREE",
      cert: "Microsoft Learn Trophy",
      duration: "16 Hours",
      priority: "Medium",
      level: "Intermediate",
      url: "https://learn.microsoft.com/en-us/training/modules/typescript-get-started/",
      topics: ["Generics", "Type narrowing", "Interfaces", "Strict mode"]
    },
    nodejs: {
      title: "Back End Development & APIs with Node & Express",
      provider: "freeCodeCamp",
      cost: "100% FREE",
      cert: "Verified Developer Certificate",
      duration: "35 Hours",
      priority: "High",
      level: "Intermediate",
      url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
      topics: ["Express Routing", "Middleware", "MongoDB & Mongoose", "JWT Auth"]
    },
    docker: {
      title: "Docker Essentials for Developers",
      provider: "Docker Official & freeCodeCamp",
      cost: "100% FREE",
      cert: "Developer Digital Badge",
      duration: "12 Hours",
      priority: "Medium",
      level: "Intermediate",
      url: "https://docs.docker.com/get-started/",
      topics: ["Images", "Containers", "Docker Compose", "Multi-stage builds"]
    },
    git: {
      title: "Git & GitHub Collaboration Pathway",
      provider: "GitHub Skills",
      cost: "100% FREE",
      cert: "GitHub Certified Skills Badge",
      duration: "8 Hours",
      priority: "High",
      level: "Beginner",
      url: "https://skills.github.com/",
      topics: ["Branching", "Pull Requests", "Code review", "Merge conflicts"]
    },
    solar_pv: {
      title: "Solar Energy & PV System Design (SDG 8.2)",
      provider: "SUNY / Coursera (Free Audit)",
      cost: "100% FREE",
      cert: "Clean Energy Certificate",
      duration: "25 Hours",
      priority: "High",
      level: "Intermediate",
      url: "https://www.coursera.org/learn/solar-energy-basics",
      topics: ["PV Physics", "Inverter sizing", "Grid connection", "Microgrids"]
    },
    energy_audit: {
      title: "Industrial Energy Auditing & Climate Solutions",
      provider: "UN CC:Learn & SDG Academy",
      cost: "100% FREE",
      cert: "United Nations Official Badge",
      duration: "18 Hours",
      priority: "High",
      level: "Intermediate",
      url: "https://unccelearn.org/",
      topics: ["Energy balance", "Efficiency audits", "GHG protocol", "Scope 1-3"]
    },
    problem_solving: {
      title: "CS50x: Computer Science & Algorithmic Problem Solving",
      provider: "Harvard University / edX (Free Audit)",
      cost: "100% FREE",
      cert: "CS50 Verified Certificate",
      duration: "50 Hours",
      priority: "High",
      level: "Beginner to Advanced",
      url: "https://cs50.harvard.edu/x/",
      topics: ["Algorithmic logic", "Memory debugging", "Complexity analysis"]
    }
  };

  function getCourse(skillId) {
    if (COURSES[skillId]) return COURSES[skillId];
    return {
      title: `Applied Masterclass: ${skillId.replace(/_/g, ' ').toUpperCase()}`,
      provider: "edX & freeCodeCamp Open Academy",
      cost: "100% FREE",
      cert: "Verified Certificate",
      duration: "15 Hours",
      priority: "Medium",
      level: "Intermediate",
      url: `https://www.edx.org/search?q=${encodeURIComponent(skillId)}`,
      topics: ["Core principles", "Hands-on projects", "Industry best practices"]
    };
  }

  function generatePathway(missingSkills, targetRoleTitle = "Your Dream Role") {
    if (!missingSkills || missingSkills.length === 0) {
      return {
        targetRoleTitle,
        totalHours: 10,
        phases: [
          {
            phaseNumber: 1,
            title: "Phase 1: Portfolio Polish & Capstone Showcase",
            duration: "Weeks 1 - 2",
            description: "You already match 100% of primary requirements! Polish your portfolio and start submitting targeted job applications.",
            items: [
              {
                skillName: "Portfolio Architecture",
                ...COURSES.git,
                completed: false
              }
            ]
          }
        ]
      };
    }

    const phase1 = [];
    const phase2 = [];
    const phase3 = [];

    missingSkills.forEach((s, idx) => {
      const course = getCourse(s.id);
      const item = {
        skillId: s.id,
        skillName: s.name,
        category: s.category || "Specialized Tech",
        ...course,
        completed: false
      };

      if (idx % 3 === 0) phase1.push(item);
      else if (idx % 3 === 1) phase2.push(item);
      else phase3.push(item);
    });

    const phases = [];
    let weekStart = 1;

    if (phase1.length > 0) {
      phases.push({
        phaseNumber: 1,
        title: "Phase 1: Core Fundamentals & Primary Gap Closure",
        duration: `Weeks ${weekStart} - ${weekStart + 2}`,
        description: "Eliminate foundational roadblocks and build core technical fluency.",
        items: phase1
      });
      weekStart += 3;
    }

    if (phase2.length > 0) {
      phases.push({
        phaseNumber: 2,
        title: "Phase 2: Applied Tooling & Framework Integration",
        duration: `Weeks ${weekStart} - ${weekStart + 2}`,
        description: "Translate core concepts into real-world code and industry standard toolchains.",
        items: phase2
      });
      weekStart += 3;
    }

    if (phase3.length > 0) {
      phases.push({
        phaseNumber: 3,
        title: "Phase 3: Free Industry Certifications & Capstone Artifact",
        duration: `Weeks ${weekStart} - ${weekStart + 2}`,
        description: "Earn accredited free credentials and build demonstrator projects for your portfolio.",
        items: phase3
      });
    }

    const totalHours = missingSkills.reduce((sum, s) => {
      const c = getCourse(s.id);
      const hrs = parseInt(c.duration, 10) || 20;
      return sum + hrs;
    }, 0);

    return {
      targetRoleTitle,
      totalHours,
      phases
    };
  }

  return {
    COURSES,
    getCourse,
    generatePathway
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LearningCatalog;
}
