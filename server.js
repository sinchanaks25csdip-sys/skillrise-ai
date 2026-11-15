/**
 * SKILLRISE AI — Production HTTP Server & REST API Router
 * Zero External Dependencies (Native Node.js http, fs, path, url)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Server-side module imports
const SkillTaxonomy = require('./public/js/taxonomy.js');
const NLPEngine = require('./public/js/nlpEngine.js');
const LearningCatalog = require('./public/js/learningCatalog.js');
const MarketData = require('./public/js/marketData.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 3 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({ rawText: body });
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // REST API Endpoints
  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'online',
          app: 'SKILLRISE AI',
          sdgAlignment: ['Target 8.6 (Reduce Youth NEET)', 'Target 8.2 (Economic Productivity)'],
          timestamp: new Date().toISOString()
        });
      }

      if (pathname === '/api/taxonomy' && method === 'GET') {
        return sendJSON(res, 200, {
          categories: SkillTaxonomy.categories,
          targetRoles: SkillTaxonomy.targetRoles
        });
      }

      if (pathname === '/api/jobs' && method === 'GET') {
        const { keyword, region, sector, expLevel } = parsedUrl.query;
        const jobs = MarketData.filterJobs({ keyword, region, sector, expLevel });
        return sendJSON(res, 200, { total: jobs.length, jobs });
      }

      if (pathname === '/api/resume/scan' && method === 'POST') {
        const body = await parseBody(req);
        const text = body.resumeText || body.rawText || '';
        const parsed = NLPEngine.parseResumeSections(text);
        return sendJSON(res, 200, parsed);
      }

      if (pathname === '/api/skills/analyze' && method === 'POST') {
        const body = await parseBody(req);
        const skills = body.skills || [];
        const targetRole = body.targetRole || 'ai_engineer';
        const analysis = NLPEngine.analyzeSkillMatch(skills, targetRole, SkillTaxonomy);
        const roadmap = LearningCatalog.generatePathway(
          [...analysis.skills.missingRequired, ...analysis.skills.missingRecommended],
          analysis.targetRoleTitle
        );
        return sendJSON(res, 200, { analysis, roadmap });
      }

      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        return sendJSON(res, 200, {
          token: "demo_jwt_token_" + Date.now(),
          user: {
            name: body.email ? body.email.split('@')[0] : "Aarav Sharma",
            email: body.email || "aarav.sharma@aimail.com",
            role: "Job Seeker & Student"
          }
        });
      }

      return sendJSON(res, 404, { error: `Endpoint ${pathname} not found.` });
    } catch (err) {
      console.error('API Error:', err);
      return sendJSON(res, 500, { error: 'Internal Server Error', message: err.message });
    }
  }

  // Static File Serving
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Error reading file');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` SKILLRISE AI — Youth Skill-Gap & Employability Analyzer`);
  console.log(` UN SDG Target 8.6 & 8.2 Certified Web Application`);
  console.log(` Running live on http://localhost:${PORT}`);
  console.log(`================================================================`);
});
