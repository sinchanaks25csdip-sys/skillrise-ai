/**
 * SKILLRISE AI — Master Application Controller
 * Coordinates Views, Authentication, 3D Scene Triggers, NLP Analysis, Dashboard & Roadmaps
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    currentView: 'landing', // 'landing' | 'signin' | 'create-account' | 'dashboard'
    dashboardTab: 'overview',
    currentUser: null, // set upon login
    candidateText: "",
    candidateParsed: null,
    targetRoleKey: 'ai_engineer',
    analysis: null,
    roadmap: null,
    completedSkillIds: new Set(),
    isScanning: false
  };

  // DOM Containers
  const viewLanding = document.getElementById('view-landing');
  const viewAuth = document.getElementById('view-auth');
  const viewDashboard = document.getElementById('view-dashboard');
  const toastContainer = document.getElementById('toast-container');

  // Initialize 3D Transformation Canvas
  if (typeof SkillRise3D !== 'undefined') {
    SkillRise3D.init('scene-3d-container');
  }

  // Preload Default Aarav Sharma profile for instant rich demonstration
  loadProfilePreset('cs_graduate', false);

  // Set up Event Listeners
  setupNavigationEvents();
  setupAuthEvents();
  setupDashboardNav();
  setup3DStagePills();
  setupResumeUpload();
  setupMarketFilters();

  // ----------------------------------------------------
  // NAVIGATION ROUTER
  // ----------------------------------------------------
  function switchView(viewName, options = {}) {
    state.currentView = viewName;

    // Hide all main view containers
    viewLanding.classList.add('hidden');
    viewAuth.classList.add('hidden');
    viewDashboard.classList.add('hidden');

    if (viewName === 'landing') {
      viewLanding.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'signin' || viewName === 'create-account') {
      viewAuth.classList.remove('hidden');
      toggleAuthMode(viewName === 'create-account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'dashboard') {
      if (!state.currentUser) {
        // Auto-login as default demo candidate if accessing directly
        loginUser({
          name: "Aarav Sharma",
          email: "aarav.sharma@aimail.com",
          role: "Computer Science Graduate",
          avatar: "👨‍🎓"
        });
      }
      viewDashboard.classList.remove('hidden');
      if (options.tab) {
        switchDashboardTab(options.tab);
      } else {
        switchDashboardTab(state.dashboardTab);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function setupNavigationEvents() {
    // Header Buttons
    document.querySelectorAll('[data-nav="landing"]').forEach(el => el.addEventListener('click', () => switchView('landing')));
    document.querySelectorAll('[data-nav="signin"]').forEach(el => el.addEventListener('click', () => switchView('signin')));
    document.querySelectorAll('[data-nav="create-account"]').forEach(el => el.addEventListener('click', () => switchView('create-account')));
    document.querySelectorAll('[data-nav="dashboard"]').forEach(el => el.addEventListener('click', () => switchView('dashboard')));

    // Hero Action Buttons
    const btnGetStarted = document.getElementById('btn-hero-get-started');
    const btnExplore = document.getElementById('btn-hero-explore');
    const btnHeroSignIn = document.getElementById('btn-hero-signin');

    if (btnGetStarted) btnGetStarted.addEventListener('click', () => switchView('create-account'));
    if (btnExplore) btnExplore.addEventListener('click', () => {
      switchView('dashboard', { tab: 'overview' });
      showToast("Exploring SkillRise AI Dashboard & Market Intelligence", "info");
    });
    if (btnHeroSignIn) btnHeroSignIn.addEventListener('click', () => switchView('signin'));
  }

  // ----------------------------------------------------
  // 3D STAGE SWITCHER IN HERO
  // ----------------------------------------------------
  function setup3DStagePills() {
    const pills = document.querySelectorAll('.stage-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const stageNum = parseInt(pill.getAttribute('data-stage'), 10);
        if (typeof SkillRise3D !== 'undefined') {
          SkillRise3D.setStage(stageNum);
        }
      });
    });

    const btnAutoMorph = document.getElementById('btn-auto-morph');
    if (btnAutoMorph) {
      let morphInterval = null;
      btnAutoMorph.addEventListener('click', () => {
        if (morphInterval) {
          clearInterval(morphInterval);
          morphInterval = null;
          btnAutoMorph.textContent = "▶ Auto Morph Story";
          showToast("Stopped auto morphing", "info");
        } else {
          btnAutoMorph.textContent = "⏸ Pause Story";
          showToast("Playing 3-stage transformation story...", "success");
          let s = SkillRise3D.getStage();
          morphInterval = setInterval(() => {
            s = (s % 3) + 1;
            SkillRise3D.setStage(s);
          }, 3200);
        }
      });
    }
  }

  // ----------------------------------------------------
  // AUTHENTICATION (SIGN IN & CREATE ACCOUNT)
  // ----------------------------------------------------
  function toggleAuthMode(isRegister) {
    const formTitle = document.getElementById('auth-form-title');
    const formSubtitle = document.getElementById('auth-form-subtitle');
    const registerFields = document.getElementById('auth-register-fields');
    const btnSubmit = document.getElementById('btn-auth-submit');
    const switchPrompt = document.getElementById('auth-switch-prompt');
    const switchLink = document.getElementById('auth-switch-link');

    if (isRegister) {
      formTitle.textContent = "Create Your Account";
      formSubtitle.textContent = "Start your transformation journey into high-demand careers.";
      registerFields.classList.remove('hidden');
      btnSubmit.textContent = "Create Account";
      switchPrompt.textContent = "Already have an account?";
      switchLink.textContent = "Sign In";
      switchLink.setAttribute('data-target-auth', 'signin');
    } else {
      formTitle.textContent = "Welcome Back to SkillRise";
      formSubtitle.textContent = "Sign in to access your AI skill gap analyzer & roadmap.";
      registerFields.classList.add('hidden');
      btnSubmit.textContent = "Sign In to Dashboard";
      switchPrompt.textContent = "Don't have an account yet?";
      switchLink.textContent = "Create Account";
      switchLink.setAttribute('data-target-auth', 'create-account');
    }
  }

  function setupAuthEvents() {
    const switchLink = document.getElementById('auth-switch-link');
    if (switchLink) {
      switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = switchLink.getAttribute('data-target-auth');
        switchView(target);
      });
    }

    // Auth Form Submission
    const authForm = document.getElementById('auth-main-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const name = document.getElementById('auth-name').value.trim() || email.split('@')[0];

        loginUser({
          name: name || "Aarav Sharma",
          email: email || "student@skillrise.ai",
          role: "Job Seeker & Student",
          avatar: "🎓"
        });

        showToast(`Welcome, ${name}! Logged in successfully.`, "success");
        switchView('dashboard', { tab: 'overview' });
      });
    }

    // Social Auth Buttons (Google & GitHub)
    document.querySelectorAll('.btn-social-auth').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.getAttribute('data-provider');
        loginUser({
          name: provider === 'google' ? "Aarav Sharma (Google)" : "Aarav Sharma (GitHub)",
          email: provider === 'google' ? "aarav.sharma@gmail.com" : "aarav@github.user",
          role: "Candidate",
          avatar: provider === 'google' ? "🔵" : "🐙"
        });
        showToast(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}!`, "success");
        switchView('dashboard', { tab: 'overview' });
      });
    });

    // Quick Demo Logins
    const btnDemoStudent = document.getElementById('btn-demo-student');
    const btnDemoRecruiter = document.getElementById('btn-demo-recruiter');

    if (btnDemoStudent) {
      btnDemoStudent.addEventListener('click', () => {
        loginUser({
          name: "Aarav Sharma",
          email: "aarav.sharma@aimail.com",
          role: "Computer Science Graduate",
          avatar: "👨‍🎓"
        });
        showToast("Logged in as Demo Student!", "success");
        switchView('dashboard', { tab: 'overview' });
      });
    }

    if (btnDemoRecruiter) {
      btnDemoRecruiter.addEventListener('click', () => {
        loginUser({
          name: "Sophia Zhang",
          email: "sophia@nexustech.io",
          role: "Talent Acquisition Partner",
          avatar: "💼"
        });
        showToast("Logged in as Industry Partner!", "success");
        switchView('dashboard', { tab: 'market' });
      });
    }
  }

  function loginUser(userObj) {
    state.currentUser = userObj;
    document.querySelectorAll('.user-display-name').forEach(el => el.textContent = userObj.name);
    document.querySelectorAll('.user-display-email').forEach(el => el.textContent = userObj.email);
    document.querySelectorAll('.user-display-avatar').forEach(el => el.textContent = userObj.avatar);
    document.querySelectorAll('.user-display-role').forEach(el => el.textContent = userObj.role);
  }

  // ----------------------------------------------------
  // DASHBOARD TAB ROUTER
  // ----------------------------------------------------
  function switchDashboardTab(tabName) {
    state.dashboardTab = tabName;

    // Update Sidebar Active state
    document.querySelectorAll('.dashboard-nav-item').forEach(btn => {
      if (btn.getAttribute('data-dash-tab') === tabName) {
        btn.classList.add('bg-midnight-card', 'text-sunset-orange', 'border-sunset-orange');
        btn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-midnight-card', 'text-sunset-orange', 'border-sunset-orange');
        btn.classList.add('text-slate-400', 'border-transparent');
      }
    });

    // Show active tab pane
    document.querySelectorAll('.dash-pane').forEach(pane => {
      if (pane.id === `dash-pane-${tabName}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    // Trigger tab-specific renders
    if (tabName === 'overview') renderDashboardOverview();
    if (tabName === 'skills') renderSkillGapTab();
    if (tabName === 'market') renderJobMarketTab();
    if (tabName === 'roadmap') renderRoadmapTab();
    if (tabName === 'jobs') renderRecommendedJobsTab();
  }

  function setupDashboardNav() {
    document.querySelectorAll('.dashboard-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-dash-tab');
        if (tab === 'logout') {
          state.currentUser = null;
          showToast("Signed out successfully.", "info");
          switchView('landing');
        } else {
          switchDashboardTab(tab);
        }
      });
    });
  }

  // ----------------------------------------------------
  // RESUME SCANNING & NLP EXECUTION
  // ----------------------------------------------------
  function setupResumeUpload() {
    const dropzone = document.getElementById('dash-resume-dropzone');
    const fileInput = document.getElementById('dash-resume-input');
    const textInput = document.getElementById('dash-resume-textarea');
    const btnScan = document.getElementById('btn-run-ai-scan');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-sunset-orange', 'bg-purple-900/20');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-sunset-orange', 'bg-purple-900/20');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-sunset-orange', 'bg-purple-900/20');
        if (e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleFile(e.target.files[0]);
        }
      });
    }

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        textInput.value = e.target.result;
        state.candidateText = e.target.result;
        showToast(`Loaded "${file.name}"! Starting AI scan...`, "success");
        triggerResumeScan();
      };
      reader.readAsText(file);
    }

    if (btnScan) {
      btnScan.addEventListener('click', () => {
        const val = textInput.value.trim();
        if (!val) {
          showToast("Please paste your resume or pick a demo profile first.", "warning");
          return;
        }
        state.candidateText = val;
        triggerResumeScan();
      });
    }

    // Preset profile buttons in Resume tab
    document.querySelectorAll('.btn-preset-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        const pKey = btn.getAttribute('data-preset');
        loadProfilePreset(pKey, true);
      });
    });

    // Target Role Select Listener
    const roleSelect = document.getElementById('dash-target-role-select');
    if (roleSelect) {
      roleSelect.addEventListener('change', () => {
        state.targetRoleKey = roleSelect.value;
        runAnalysis();
        showToast(`Target role set to: ${roleSelect.options[roleSelect.selectedIndex].text}`, "info");
      });
    }
  }

  function loadProfilePreset(presetKey, shouldNotify = true) {
    const profile = SampleResumes[presetKey];
    if (!profile) return;

    state.candidateText = profile.content;
    state.targetRoleKey = profile.targetRole;

    const textInput = document.getElementById('dash-resume-textarea');
    if (textInput) textInput.value = profile.content;

    const roleSelect = document.getElementById('dash-target-role-select');
    if (roleSelect) roleSelect.value = profile.targetRole;

    // Login matching candidate
    loginUser({
      name: profile.name,
      email: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@candidate.org`,
      role: profile.role,
      avatar: presetKey === 'vocational_green_tech' ? "🌱" : (presetKey === 'junior_data_analyst' ? "📊" : (presetKey === 'self_taught_web_dev' ? "👩‍💻" : "👨‍🎓"))
    });

    runAnalysis();

    if (shouldNotify) {
      showToast(`Loaded ${profile.name} (${profile.role})`, "success");
    }
  }

  function triggerResumeScan() {
    state.isScanning = true;
    const scannerOverlay = document.getElementById('resume-scan-animation-overlay');
    const scanProgressBar = document.getElementById('resume-scan-progress-bar');
    const scanStatusText = document.getElementById('resume-scan-status-text');

    if (scannerOverlay) scannerOverlay.classList.remove('hidden');

    let progress = 0;
    const steps = [
      "Tokenizing resume structure and contact headers...",
      "Extracting technical & algorithmic competencies via NLP...",
      "Matching against regional industry demand ontologies...",
      "Calibrating SDG 8.6 youth employability index...",
      "Finalizing multi-phase learning roadmap..."
    ];

    const interval = setInterval(() => {
      progress += 20;
      if (scanProgressBar) scanProgressBar.style.width = `${progress}%`;
      const stepIdx = Math.min(steps.length - 1, Math.floor(progress / 20));
      if (scanStatusText) scanStatusText.textContent = steps[stepIdx];

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (scannerOverlay) scannerOverlay.classList.add('hidden');
          state.isScanning = false;
          runAnalysis();
          showToast("AI Resume Scanning & Skill Extraction Complete!", "success");
          switchDashboardTab('skills');
        }, 400);
      }
    }, 280);
  }

  function runAnalysis() {
    state.completedSkillIds.clear();

    // 1. Parse sections
    state.candidateParsed = NLPEngine.parseResumeSections(state.candidateText);

    // 2. Perform Gap Analysis against Target Role
    state.analysis = NLPEngine.analyzeSkillMatch(
      state.candidateParsed.allSkills,
      state.targetRoleKey,
      SkillTaxonomy
    );

    // 3. Generate Roadmap
    state.roadmap = LearningCatalog.generatePathway(
      [...state.analysis.skills.missingRequired, ...state.analysis.skills.missingRecommended],
      state.analysis.targetRoleTitle
    );

    // Update all views
    renderResumeTabDetails();
    renderDashboardOverview();
    renderSkillGapTab();
    renderRoadmapTab();
    renderRecommendedJobsTab();
  }

  // ----------------------------------------------------
  // RENDER VIEWS
  // ----------------------------------------------------

  // Resume Tab Details
  function renderResumeTabDetails() {
    if (!state.candidateParsed) return;
    const p = state.candidateParsed;

    const elName = document.getElementById('parsed-name');
    const elEdu = document.getElementById('parsed-education');
    const elTechContainer = document.getElementById('parsed-tech-skills');
    const elSoftContainer = document.getElementById('parsed-soft-skills');

    if (elName) elName.textContent = p.name;
    if (elEdu) elEdu.textContent = p.education;

    if (elTechContainer) {
      elTechContainer.innerHTML = p.technicalSkills.map(s => `
        <span class="tag-matched flex items-center gap-1.5">
          <span>✓</span>
          <span>${s.name}</span>
        </span>
      `).join('') || '<span class="text-xs text-slate-500">None detected</span>';
    }

    if (elSoftContainer) {
      elSoftContainer.innerHTML = p.softSkills.map(s => `
        <span class="tag-recommended flex items-center gap-1.5">
          <span>★</span>
          <span>${s.name}</span>
        </span>
      `).join('') || '<span class="text-xs text-slate-500">None detected</span>';
    }
  }

  // Dashboard Overview
  function renderDashboardOverview() {
    if (!state.analysis) return;
    const a = state.analysis;

    // Metric numbers
    const elMatch = document.getElementById('overview-match-pct');
    const elTotalSkills = document.getElementById('overview-total-skills');
    const elMissingCount = document.getElementById('overview-missing-count');
    const elCourseCount = document.getElementById('overview-course-count');
    const elJobsCount = document.getElementById('overview-jobs-count');
    const elTargetRole = document.getElementById('overview-target-role');

    if (elMatch) elMatch.textContent = `${a.overallMatchScore}%`;
    if (elTotalSkills) elTotalSkills.textContent = state.candidateParsed ? state.candidateParsed.allSkills.length : 12;
    if (elMissingCount) elMissingCount.textContent = a.skills.missingRequired.length;
    if (elCourseCount) elCourseCount.textContent = state.roadmap ? state.roadmap.phases.reduce((s, p) => s + p.items.length, 0) : 5;
    if (elJobsCount) elJobsCount.textContent = MarketData.getAllJobs().length * 18;
    if (elTargetRole) elTargetRole.textContent = a.targetRoleTitle;

    // Overview missing skill tags
    const elMissingTags = document.getElementById('overview-missing-tags');
    if (elMissingTags) {
      elMissingTags.innerHTML = a.skills.missingRequired.map(s => `
        <span class="tag-missing">⚠️ ${s.name}</span>
      `).join('');
    }
  }

  // Skill Gap Analysis Tab
  function renderSkillGapTab() {
    if (!state.analysis) return;
    const a = state.analysis;

    // Match Gauge
    const gaugeScore = document.getElementById('skills-gauge-score');
    const readinessTier = document.getElementById('skills-readiness-tier');
    const estWeeks = document.getElementById('skills-est-weeks');

    if (gaugeScore) gaugeScore.textContent = `${a.overallMatchScore}%`;
    if (readinessTier) readinessTier.textContent = a.readinessTier;
    if (estWeeks) estWeeks.textContent = `${a.estimatedWeeks} Weeks`;

    // Render 3D SVG Spider Radar Chart
    renderRadarChart('skills-radar-container', a.categoryScores);

    // Skill Matrix Columns
    const colMatched = document.getElementById('matrix-matched-skills');
    const colMissingReq = document.getElementById('matrix-missing-req');
    const colMissingRec = document.getElementById('matrix-missing-rec');
    const colBonus = document.getElementById('matrix-bonus-skills');

    if (colMatched) {
      colMatched.innerHTML = a.skills.matchedRequired.map(s => `
        <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
          <span class="font-bold text-emerald-300">✓ ${s.name}</span>
          <span class="text-[10px] text-emerald-400 font-semibold">${s.difficulty || 'Intermediate'}</span>
        </div>
      `).join('') || '<span class="text-xs text-slate-500 italic">None</span>';
    }

    if (colMissingReq) {
      colMissingReq.innerHTML = a.skills.missingRequired.map(s => `
        <div class="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs">
          <span class="font-bold text-rose-300">⚠️ ${s.name}</span>
          <span class="text-[10px] text-rose-400 font-bold">Priority 1</span>
        </div>
      `).join('') || '<span class="text-xs text-slate-500 italic">None</span>';
    }

    if (colMissingRec) {
      colMissingRec.innerHTML = a.skills.missingRecommended.map(s => `
        <div class="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
          <span class="font-bold text-amber-300">⚡ ${s.name}</span>
          <span class="text-[10px] text-amber-400 font-semibold">Priority 2</span>
        </div>
      `).join('') || '<span class="text-xs text-slate-500 italic">None</span>';
    }

    if (colBonus) {
      colBonus.innerHTML = a.skills.bonus.map(s => `
        <div class="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
          <span class="font-bold text-purple-300">★ ${s.name}</span>
          <span class="text-[10px] text-purple-400 font-semibold">Differentiating</span>
        </div>
      `).join('') || '<span class="text-xs text-slate-500 italic">None</span>';
    }
  }

  // 3D SVG Spider Radar Chart
  function renderRadarChart(containerId, categories) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 340;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 45;

    const numAxes = categories.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Hexagonal Grid
    let grid = '';
    [0.3, 0.6, 1.0].forEach(level => {
      const r = radius * level;
      const pts = [];
      for (let i = 0; i < numAxes; i++) {
        const a = i * angleSlice - Math.PI / 2;
        pts.push(`${centerX + r * Math.cos(a)},${centerY + r * Math.sin(a)}`);
      }
      grid += `<polygon points="${pts.join(' ')}" fill="none" stroke="#8B35E8" stroke-width="1" stroke-dasharray="2,3" opacity="0.4"/>`;
    });

    // Spokes and Labels
    let spokes = '';
    let labels = '';
    categories.forEach((cat, i) => {
      const a = i * angleSlice - Math.PI / 2;
      const x = centerX + radius * Math.cos(a);
      const y = centerY + radius * Math.sin(a);
      spokes += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#160B2A" stroke-width="1.5"/>`;

      const lx = centerX + (radius + 20) * Math.cos(a);
      const ly = centerY + (radius + 20) * Math.sin(a);
      let anchor = 'middle';
      if (Math.cos(a) > 0.3) anchor = 'start';
      else if (Math.cos(a) < -0.3) anchor = 'end';

      labels += `
        <text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" class="text-[10px] font-bold fill-slate-300">
          ${cat.name} (${cat.score}%)
        </text>
      `;
    });

    // Candidate Polygon
    const candPts = categories.map((cat, i) => {
      const a = i * angleSlice - Math.PI / 2;
      const r = (cat.score / 100) * radius;
      return `${centerX + r * Math.cos(a)},${centerY + r * Math.sin(a)}`;
    }).join(' ');

    container.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible">
        <defs>
          <radialGradient id="radarSunriseGrad">
            <stop offset="0%" stop-color="#FF7417" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#8B35E8" stop-opacity="0.2"/>
          </radialGradient>
        </defs>
        ${grid}
        ${spokes}
        <polygon points="${candPts}" fill="url(#radarSunriseGrad)" stroke="#FF7417" stroke-width="2.2"/>
        ${categories.map((cat, i) => {
          const a = i * angleSlice - Math.PI / 2;
          const r = (cat.score / 100) * radius;
          return `<circle cx="${centerX + r * Math.cos(a)}" cy="${centerY + r * Math.sin(a)}" r="4.5" fill="#FFF0E8" stroke="#FF7417" stroke-width="2"/>`;
        }).join('')}
        ${labels}
      </svg>
    `;
  }

  // Job Market Insights Tab
  function renderJobMarketTab() {
    const insights = MarketData.getMarketInsights();

    // Render Top Skills Bar Chart
    const chartContainer = document.getElementById('market-skills-chart-container');
    if (chartContainer) {
      const maxCount = Math.max(...insights.topSkills.map(s => s.count));
      chartContainer.innerHTML = insights.topSkills.map((s, idx) => {
        const pct = Math.round((s.count / maxCount) * 100);
        return `
          <div class="mb-3.5">
            <div class="flex items-center justify-between text-xs mb-1">
              <div class="flex items-center gap-2">
                <span class="font-mono text-slate-500 font-bold">#${idx + 1}</span>
                <span class="font-bold text-soft-white">${s.name}</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-midnight-purple border border-purple-900/60 text-purple-300 font-semibold">${s.sector}</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-slate-400 font-semibold">${s.count} postings</span>
                <span class="text-emerald-400 font-extrabold text-[11px]">${s.growth}</span>
              </div>
            </div>
            <div class="w-full bg-midnight-purple/90 h-2.5 rounded-full overflow-hidden border border-purple-900/40">
              <div class="h-full rounded-full bg-gradient-to-r from-sunset-orange via-sunrise-red to-electric-purple" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Sector Donut
    const donutContainer = document.getElementById('market-sector-donut-container');
    if (donutContainer) {
      donutContainer.innerHTML = `
        <div class="space-y-2 mt-2">
          ${insights.sectorDistribution.map(item => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-midnight-purple/60 border border-purple-900/40 text-xs">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full shadow-sm" style="background-color: ${item.color};"></span>
                <span class="font-bold text-soft-white">${item.label}</span>
              </div>
              <span class="font-black text-sunset-orange font-mono">${item.value}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  function setupMarketFilters() {
    const searchInput = document.getElementById('market-filter-search');
    const locationSelect = document.getElementById('market-filter-location');
    const sectorSelect = document.getElementById('market-filter-sector');

    const runFilter = () => {
      const filtered = MarketData.filterJobs({
        keyword: searchInput ? searchInput.value.trim() : '',
        region: locationSelect ? locationSelect.value : 'All Locations',
        sector: sectorSelect ? sectorSelect.value : 'All Sectors'
      });
      renderJobsTable(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', runFilter);
    if (locationSelect) locationSelect.addEventListener('change', runFilter);
    if (sectorSelect) sectorSelect.addEventListener('change', runFilter);

    // Initial render
    renderJobsTable(MarketData.getAllJobs());
  }

  function renderJobsTable(jobsList) {
    const tableBody = document.getElementById('market-jobs-table-body');
    if (!tableBody) return;

    if (jobsList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500 italic">No job postings found matching criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = jobsList.map(j => `
      <tr class="border-b border-purple-900/30 hover:bg-purple-950/20 transition">
        <td class="px-4 py-3.5">
          <div class="font-bold text-soft-white">${j.title}</div>
          <div class="text-xs text-slate-400 font-medium">${j.company}</div>
        </td>
        <td class="px-4 py-3.5 text-xs text-slate-300">
          <div>${j.city}</div>
          <span class="text-[10px] text-sunset-orange font-semibold">${j.expLevel}</span>
        </td>
        <td class="px-4 py-3.5">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold ${j.sector.includes('Green') ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : (j.sector.includes('AI') ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30' : 'bg-orange-950/60 text-orange-300 border border-orange-500/30')}">
            ${j.sector}
          </span>
        </td>
        <td class="px-4 py-3.5 text-xs font-mono font-bold text-soft-white">${j.salary}</td>
        <td class="px-4 py-3.5 text-right">
          <button class="btn-match-job text-xs font-bold text-sunset-orange hover:text-white border border-sunset-orange/50 hover:bg-sunset-orange px-3 py-1 rounded-full transition" data-job-id="${j.id}">
            Match Me
          </button>
        </td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('.btn-match-job').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.getAttribute('data-job-id');
        const selected = MarketData.getAllJobs().find(j => j.id === jobId);
        if (selected) {
          switchDashboardTab('jobs');
          showToast(`Matching your profile against: ${selected.title}`, "info");
        }
      });
    });
  }

  // AI Learning Roadmap Tab
  function renderRoadmapTab() {
    if (!state.roadmap) return;
    const r = state.roadmap;

    const elTitle = document.getElementById('roadmap-target-title');
    const elHours = document.getElementById('roadmap-total-hours');
    const container = document.getElementById('roadmap-pathway-container');

    if (elTitle) elTitle.textContent = r.targetRoleTitle;
    if (elHours) elHours.textContent = `~${r.totalHours} Hours`;

    if (!container) return;

    container.innerHTML = r.phases.map(phase => `
      <div class="pathway-step mb-8">
        <div class="pathway-node">${phase.phaseNumber}</div>
        <div class="glass-panel p-5">
          <div class="flex items-center justify-between pb-3 border-b border-purple-900/30 mb-4 flex-wrap gap-2">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-sunset-orange to-sunrise-red text-white">
                ${phase.duration}
              </span>
              <h4 class="text-base font-extrabold text-soft-white mt-1.5">${phase.title}</h4>
              <p class="text-xs text-slate-400 mt-0.5">${phase.description}</p>
            </div>
            <span class="text-xs font-mono font-bold text-purple-400">${phase.items.length} Course Module${phase.items.length > 1 ? 's' : ''}</span>
          </div>

          <div class="space-y-3">
            ${phase.items.map(item => `
              <div class="p-4 rounded-xl bg-midnight-purple/80 border border-purple-900/50 hover:border-sunset-orange/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <input
                    type="checkbox"
                    class="mt-1 h-4 w-4 text-sunset-orange rounded border-purple-700 focus:ring-sunset-orange bg-deep-black cursor-pointer roadmap-skill-checkbox"
                    data-skill-id="${item.skillId}"
                    ${state.completedSkillIds.has(item.skillId) ? 'checked' : ''}
                  />
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-extrabold text-sm text-soft-white">${item.skillName}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">${item.cost}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/40">${item.provider}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold text-sunset-orange">${item.priority} Priority</span>
                    </div>
                    <p class="text-xs text-slate-300 font-medium mt-1">${item.title}</p>
                    <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-mono">
                      <span>⏱️ ${item.duration}</span>
                      <span>🎓 ${item.cert}</span>
                      <span>🎯 ${item.level}</span>
                    </div>
                  </div>
                </div>

                <div class="self-end sm:self-center">
                  <a
                    href="${item.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-glow-sunrise text-xs px-3.5 py-1.5 gap-1.5 shadow-sm"
                  >
                    <span>Start Free</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Attach checkbox events for real-time score boosting
    container.querySelectorAll('.roadmap-skill-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-skill-id');
        if (e.target.checked) {
          state.completedSkillIds.add(id);
          showToast("Skill module completed! Recalculating employability score...", "success");
        } else {
          state.completedSkillIds.delete(id);
        }
        recalculateScoreWithProgress();
      });
    });
  }

  function recalculateScoreWithProgress() {
    if (!state.analysis) return;
    const base = state.analysis.overallMatchScore;
    const boost = state.completedSkillIds.size * 6;
    const newScore = Math.min(100, base + boost);

    // Update displays
    document.querySelectorAll('.overview-match-pct, #skills-gauge-score').forEach(el => {
      el.textContent = `${newScore}%`;
    });

    const boostBadge = document.getElementById('roadmap-boosted-badge');
    if (boostBadge) {
      boostBadge.classList.remove('hidden');
      boostBadge.textContent = `Boosted to ${newScore}% (+${boost}%)`;
    }
  }

  // Recommended Jobs Tab
  function renderRecommendedJobsTab() {
    const container = document.getElementById('recommended-jobs-container');
    if (!container) return;

    const candidateSkills = state.candidateParsed ? state.candidateParsed.allSkills : [];
    const matchedJobs = MarketData.matchJobsToCandidateSkills(candidateSkills);

    container.innerHTML = matchedJobs.map(job => `
      <div class="glass-panel p-5 hover:border-sunset-orange/60 transition">
        <div class="flex items-start justify-between pb-3 border-b border-purple-900/30 mb-3 gap-2 flex-wrap">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-base font-extrabold text-soft-white">${job.title}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${job.matchPercentage >= 70 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-orange-950 text-sunset-orange border border-orange-500/40'}">
                ${job.matchPercentage}% Match
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 font-medium">${job.company} &bull; ${job.city}</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono font-bold text-soft-white">${job.salary}</span>
            <div class="text-[10px] text-purple-400 font-semibold">${job.sector}</div>
          </div>
        </div>

        <p class="text-xs text-slate-300 mb-4 leading-relaxed">${job.description}</p>

        <div class="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-purple-900/20">
          <div class="flex flex-wrap gap-1.5 max-w-md">
            ${job.skills.map(s => `
              <span class="text-[10px] px-2 py-0.5 rounded-md bg-midnight-purple border border-purple-800 text-slate-300 font-semibold">${s}</span>
            `).join('')}
          </div>

          <button class="btn-glow-sunrise text-xs px-4 py-2 gap-1.5 btn-apply-job" data-job-title="${job.title}" data-company="${job.company}">
            <span>Apply with 1-Click</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-apply-job').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-job-title');
        const company = btn.getAttribute('data-company');
        showToast(`Application submitted to ${company} for ${title}!`, "success");
      });
    });
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    const colorMap = {
      success: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200 shadow-emerald-950/50',
      warning: 'border-amber-500/60 bg-amber-950/90 text-amber-200 shadow-amber-950/50',
      info: 'border-purple-500/60 bg-midnight-purple/95 text-soft-white shadow-purple-950/50'
    };

    toast.className = `p-3.5 rounded-xl border text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0 ${colorMap[type] || colorMap.info}`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-3', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-3');
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }
});
