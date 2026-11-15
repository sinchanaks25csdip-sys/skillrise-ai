/**
 * SKILLRISE AI — Natural Language Processing & Skill Matching Engine
 */

const NLPEngine = (function() {
  let SkillTaxonomyRef = typeof SkillTaxonomy !== 'undefined' ? SkillTaxonomy : null;
  if (!SkillTaxonomyRef && typeof require !== 'undefined') {
    try { SkillTaxonomyRef = require('./taxonomy.js'); } catch (e) {}
  }

  const STOPWORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
    'had', 'has', 'have', 'having', 'he', 'her', 'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into',
    'is', 'it', 'its', 'me', 'more', 'most', 'my', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
    'or', 'other', 'our', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
    'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
    'who', 'whom', 'why', 'with', 'you', 'your'
  ]);

  function cleanText(text) {
    if (!text) return '';
    return text.replace(/[\r\n\t]+/g, ' ').replace(/[^\w\s\+\#\.\-\/]/g, ' ').toLowerCase().trim();
  }

  function generateNGrams(tokens, maxN = 3) {
    const ngrams = [];
    const len = tokens.length;
    for (let i = 0; i < len; i++) {
      for (let n = 1; n <= maxN && (i + n) <= len; n++) {
        ngrams.push(tokens.slice(i, i + n).join(' '));
      }
    }
    return ngrams;
  }

  function extractSkills(text, taxonomy) {
    if (!text) return [];
    const tax = taxonomy || SkillTaxonomyRef || (typeof SkillTaxonomy !== 'undefined' ? SkillTaxonomy : null);
    if (!tax) return [];

    const cleaned = cleanText(text);
    const tokens = cleaned.split(/\s+/).filter(t => t.length > 0 && !STOPWORDS.has(t));
    const ngrams = new Set(generateNGrams(tokens, 3));

    const detected = [];
    const detectedIds = new Set();
    const allSkills = tax.getAllSkills();

    for (const skill of allSkills) {
      let matched = false;
      let term = '';

      const cleanName = cleanText(skill.name);
      if (ngrams.has(cleanName) || cleaned.includes(` ${cleanName} `) || cleaned.startsWith(`${cleanName} `)) {
        matched = true;
        term = skill.name;
      }

      if (!matched && skill.aliases) {
        for (const alias of skill.aliases) {
          const cleanAlias = cleanText(alias);
          if (ngrams.has(cleanAlias) || cleaned.includes(` ${cleanAlias} `)) {
            matched = true;
            term = alias;
            break;
          }
        }
      }

      if (matched && !detectedIds.has(skill.id)) {
        detectedIds.add(skill.id);
        detected.push({ ...skill, matchedAlias: term });
      }
    }
    return detected;
  }

  function parseResumeSections(text) {
    if (!text) return {};
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const candidateName = lines.length > 0 ? lines[0].replace(/[^a-zA-Z\s\.\-]/g, '').trim() : 'Candidate';

    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    const email = emailMatch ? emailMatch[1] : null;

    let education = "Bachelor's in Engineering & Technology";
    if (/master|m\.tech|msc|postgrad/i.test(text)) education = "Master's Degree (Postgraduate)";
    else if (/diploma|polytechnic|vocational/i.test(text)) education = "Vocational Technical Diploma";
    else if (/bootcamp|self-taught/i.test(text)) education = "Self-Taught / Accelerated Bootcamp";

    const extracted = extractSkills(text);
    const techSkills = extracted.filter(s => s.categoryId !== 'soft_skills');
    const softSkills = extracted.filter(s => s.categoryId === 'soft_skills');

    return {
      name: candidateName,
      email,
      education,
      rawText: text,
      allSkills: extracted,
      technicalSkills: techSkills,
      softSkills: softSkills
    };
  }

  function analyzeSkillMatch(candidateInput, targetRoleKey, taxonomy) {
    const tax = taxonomy || SkillTaxonomyRef || (typeof SkillTaxonomy !== 'undefined' ? SkillTaxonomy : null);

    let candidateSkills = [];
    if (Array.isArray(candidateInput)) {
      candidateSkills = candidateInput;
    } else if (typeof candidateInput === 'string') {
      candidateSkills = extractSkills(candidateInput, tax);
    }
    const candidateSkillIds = new Set(candidateSkills.map(s => s.id));

    // Resolve Target Role
    const role = tax.targetRoles.find(r => r.id === targetRoleKey) || tax.targetRoles[0];
    const requiredIds = role.requiredSkills || [];
    const recommendedIds = role.recommendedSkills || [];

    const matchedRequired = [];
    const missingRequired = [];
    const matchedRecommended = [];
    const missingRecommended = [];
    const bonus = [];

    requiredIds.forEach(id => {
      const full = tax.getSkillById(id) || { id, name: id, demandWeight: 0.9 };
      if (candidateSkillIds.has(id)) matchedRequired.push(full);
      else missingRequired.push(full);
    });

    recommendedIds.forEach(id => {
      const full = tax.getSkillById(id) || { id, name: id, demandWeight: 0.8 };
      if (candidateSkillIds.has(id)) matchedRecommended.push(full);
      else missingRecommended.push(full);
    });

    const allTargetSet = new Set([...requiredIds, ...recommendedIds]);
    candidateSkills.forEach(s => {
      if (!allTargetSet.has(s.id)) bonus.push(s);
    });

    const reqScore = (matchedRequired.length / Math.max(1, requiredIds.length)) * 75;
    const recScore = (matchedRecommended.length / Math.max(1, recommendedIds.length)) * 15;
    const bonusScore = Math.min(10, bonus.length * 2.5);
    const overallMatchScore = Math.min(100, Math.round(reqScore + recScore + bonusScore));

    // Category Competency Radar Scores
    const categoryScores = tax.categories.map(cat => {
      const catIds = cat.skills.map(s => s.id);
      const catTarget = [...requiredIds, ...recommendedIds].filter(id => catIds.includes(id));
      const targetCount = catTarget.length;
      let score = 20;

      if (targetCount > 0) {
        const matched = catTarget.filter(id => candidateSkillIds.has(id)).length;
        score = Math.round((matched / targetCount) * 100);
      } else {
        const possessed = catIds.filter(id => candidateSkillIds.has(id)).length;
        score = possessed > 0 ? Math.min(100, possessed * 30) : 15;
      }

      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        score: Math.max(15, score)
      };
    });

    let readinessTier = 'Developing Competency';
    if (overallMatchScore >= 80) readinessTier = 'Market Ready / Highly Employable';
    else if (overallMatchScore >= 60) readinessTier = 'Interview Ready (Minor Gaps)';
    else if (overallMatchScore >= 40) readinessTier = 'Foundational Baseline';

    return {
      targetRoleTitle: role.title,
      targetSector: role.sector,
      overallMatchScore,
      readinessTier,
      estimatedWeeks: Math.max(2, Math.ceil(missingRequired.length * 1.5)),
      skills: {
        candidate: candidateSkills,
        matchedRequired,
        missingRequired,
        matchedRecommended,
        missingRecommended,
        bonus
      },
      categoryScores
    };
  }

  return {
    cleanText,
    extractSkills,
    parseResumeSections,
    analyzeSkillMatch
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NLPEngine;
}
