/**
 * SKILLRISE AI — Cinematic 3D Character Transformation Scene
 * Implemented using Three.js WebGL
 * Communicates the 3-stage metamorphosis of a student/job seeker into a career-ready professional
 */

const SkillRise3D = (function() {
  let scene, camera, renderer, container;
  let currentStage = 1; // 1: Limited Knowledge, 2: Learning & Growth, 3: Career Ready
  let targetStage = 1;
  let animId;

  // 3D Objects
  let characterGroup;
  let headMesh, torsoMesh, blazerMesh, leftArm, rightArm, laptopMesh;
  let stage1Elements = [];
  let stage2Elements = [];
  let stage3Elements = [];
  let portalRing;
  let particleSystem;
  let horizonMesh;
  let keyLight, rimLight, fillLight, portalLight;

  // Interaction
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let stageTransitionProgress = 1.0;

  function init(containerId) {
    container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 520;

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080711, 0.04);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    setupLighting();

    // 5. Build 3D Sunrise Horizon Background
    createSunriseHorizon();

    // 6. Build the Unified Character Model
    createCharacter();

    // 7. Build Stage-specific 3D Props & Transformation Elements
    createStageElements();

    // 8. Background Particle Field (Stars & Code Sparks)
    createParticleField();

    // 9. Event Listeners (Mouse drag orbit & resize)
    setupEvents();

    // 10. Start Animation Loop
    animate();
  }

  function setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x160B2A, 1.2);
    scene.add(ambientLight);

    // Key Light (Sunrise Orange)
    keyLight = new THREE.DirectionalLight(0xFF7417, 1.8);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim Light (Neon Pink / Electric Purple)
    rimLight = new THREE.DirectionalLight(0xF044A5, 2.2);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Fill Light (Soft Sunrise White)
    fillLight = new THREE.PointLight(0xFFF0E8, 1.0, 15);
    fillLight.position.set(0, 2, 4);
    scene.add(fillLight);

    // Portal Light (Dynamic for Stage 2 & 3)
    portalLight = new THREE.PointLight(0xFF7417, 0, 12);
    portalLight.position.set(0, 1.2, -0.8);
    scene.add(portalLight);
  }

  function createSunriseHorizon() {
    // Curved backdrop showing a glowing sunrise horizon
    const horizonGeo = new THREE.SphereGeometry(14, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const horizonMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        colorBottom: { value: new THREE.Color(0xFF7417) }, // Sunset orange
        colorMid: { value: new THREE.Color(0xF04458) },    // Sunrise red
        colorTop: { value: new THREE.Color(0x160B2A) },    // Midnight purple
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        uniform vec3 colorBottom;
        uniform vec3 colorMid;
        uniform vec3 colorTop;
        void main() {
          float factor = clamp((vPosition.y + 2.0) / 10.0, 0.0, 1.0);
          vec3 col = mix(colorBottom, colorMid, factor * 0.7);
          col = mix(col, colorTop, factor);
          gl_FragColor = vec4(col, 0.95);
        }
      `
    });
    horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.position.set(0, -1, -2);
    scene.add(horizonMesh);

    // Circular glowing ground plane (Pedestal)
    const groundGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.25, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x160B2A,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x8B35E8,
      emissiveIntensity: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.9;
    ground.receiveShadow = true;
    scene.add(ground);

    // Neon Rim Ring around Pedestal
    const ringGeo = new THREE.TorusGeometry(2.42, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF7417 });
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = -0.77;
    scene.add(groundRing);
  }

  function createCharacter() {
    characterGroup = new THREE.Group();

    // 1. Head (Sculpted Stylized Geometry)
    const headGeo = new THREE.SphereGeometry(0.32, 28, 28);
    headGeo.scale(0.85, 1.05, 0.9);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xDDA17E, // Warm skin tone
      roughness: 0.6,
      metalness: 0.1
    });
    headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 1.55, 0);
    headMesh.castShadow = true;
    characterGroup.add(headMesh);

    // Modern Hair
    const hairGeo = new THREE.SphereGeometry(0.33, 24, 24);
    hairGeo.scale(0.88, 0.8, 0.95);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1E1428, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.68, -0.04);
    characterGroup.add(hair);

    // 2. Torso (Student Hoodie / Professional Blazer morph)
    const torsoGeo = new THREE.CylinderGeometry(0.36, 0.30, 0.95, 24);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x2A1B4E, // Dark purple student hoodie base
      roughness: 0.5,
      metalness: 0.2
    });
    torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.set(0, 0.85, 0);
    torsoMesh.castShadow = true;
    characterGroup.add(torsoMesh);

    // Professional Blazer Overlay (Visible in Stage 3)
    const blazerGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.96, 24);
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x0E0B1A, // Sleek midnight blazer
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.0 // starts invisible in stage 1
    });
    blazerMesh = new THREE.Mesh(blazerGeo, blazerMat);
    blazerMesh.position.set(0, 0.85, 0);
    characterGroup.add(blazerMesh);

    // 3. Arms
    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.75, 16);
    armGeo.translate(0, -0.35, 0);

    const armMat = new THREE.MeshStandardMaterial({ color: 0x2A1B4E, roughness: 0.5 });

    leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.46, 1.2, 0);
    characterGroup.add(leftArm);

    rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.46, 1.2, 0);
    characterGroup.add(rightArm);

    // 4. Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 16);
    legGeo.translate(0, -0.45, 0);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x140E24, roughness: 0.8 });

    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.2, 0.38, 0);
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.2, 0.38, 0);
    characterGroup.add(rightLeg);

    // 5. Futuristic Laptop (Projects Hologram in Stage 3)
    const laptopBaseGeo = new THREE.BoxGeometry(0.46, 0.02, 0.32);
    const laptopScreenGeo = new THREE.BoxGeometry(0.46, 0.32, 0.02);
    laptopScreenGeo.translate(0, 0.16, 0);

    const laptopMat = new THREE.MeshStandardMaterial({
      color: 0x160B2A,
      metalness: 0.9,
      roughness: 0.2
    });
    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0xFF7417 });

    const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopMat);
    const laptopScreen = new THREE.Mesh(laptopScreenGeo, screenGlowMat);
    laptopScreen.position.set(0, 0.01, -0.15);
    laptopScreen.rotation.x = -0.3;

    laptopMesh = new THREE.Group();
    laptopMesh.add(laptopBase);
    laptopMesh.add(laptopScreen);
    laptopMesh.position.set(0, 0.75, 0.38);
    laptopMesh.rotation.x = 0.2;
    laptopMesh.scale.set(0.001, 0.001, 0.001); // hidden in stage 1
    characterGroup.add(laptopMesh);

    scene.add(characterGroup);
  }

  function createStageElements() {
    // ----------------------------------------------------
    // STAGE 1: Faded Books, Unfinished Code Brackets, Dim Glow
    // ----------------------------------------------------
    const bookGeo = new THREE.BoxGeometry(0.28, 0.06, 0.2);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x3C2356, roughness: 0.8 });

    for (let i = 0; i < 4; i++) {
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(
        (Math.random() - 0.5) * 2.2,
        0.3 + Math.random() * 1.4,
        (Math.random() - 0.5) * 1.5
      );
      book.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.4);
      scene.add(book);
      stage1Elements.push(book);
    }

    // Code Bracket < /> in wireframe
    const bracketGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 24, Math.PI * 1.2);
    const bracketMat = new THREE.MeshBasicMaterial({ color: 0xF04458, wireframe: true });
    const bracket1 = new THREE.Mesh(bracketGeo, bracketMat);
    bracket1.position.set(-1.1, 1.5, 0.5);
    bracket1.rotation.z = Math.PI / 4;
    scene.add(bracket1);
    stage1Elements.push(bracket1);

    // ----------------------------------------------------
    // STAGE 2: Energy Portal, Floating Tech Icons, Code Sparks
    // ----------------------------------------------------
    // Glowing Torus Energy Portal
    const portalGeo = new THREE.TorusGeometry(1.6, 0.06, 24, 64);
    const portalMat = new THREE.MeshBasicMaterial({
      color: 0xFF7417,
      transparent: true,
      opacity: 0.85
    });
    portalRing = new THREE.Mesh(portalGeo, portalMat);
    portalRing.position.set(0, 1.1, -0.6);
    scene.add(portalRing);
    stage2Elements.push(portalRing);

    // Floating Tech Cubes (Python, React, AI, Cloud)
    const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const techColors = [0xFF7417, 0xF044A5, 0x8B35E8, 0x10B981, 0x3B82F6];

    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: techColors[i % techColors.length],
        emissive: techColors[i % techColors.length],
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const cube = new THREE.Mesh(cubeGeo, mat);
      cube.position.set(
        Math.cos((i / 8) * Math.PI * 2) * 1.35,
        0.8 + Math.sin(i * 1.5) * 0.5,
        Math.sin((i / 8) * Math.PI * 2) * 1.2
      );
      scene.add(cube);
      stage2Elements.push(cube);
    }

    // ----------------------------------------------------
    // STAGE 3: Career Badges, Glowing Holographic Shield, Laptop Aura
    // ----------------------------------------------------
    const badgeGeo = new THREE.OctahedronGeometry(0.18, 0);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      emissive: 0xFF7417,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let i = 0; i < 4; i++) {
      const badge = new THREE.Mesh(badgeGeo, goldMat);
      badge.position.set(
        (i % 2 === 0 ? 1 : -1) * (0.85 + (i * 0.2)),
        1.1 + (i * 0.35),
        0.4 + (i * 0.1)
      );
      scene.add(badge);
      stage3Elements.push(badge);
    }

    // Holographic Projection Plane over laptop
    const holoGeo = new THREE.PlaneGeometry(0.55, 0.38);
    const holoMat = new THREE.MeshBasicMaterial({
      color: 0xFF7417,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const holoScreen = new THREE.Mesh(holoGeo, holoMat);
    holoScreen.position.set(0, 1.05, 0.42);
    holoScreen.rotation.x = -0.2;
    scene.add(holoScreen);
    stage3Elements.push(holoScreen);

    // Initial Stage 1 visibility configuration
    updateStageVisibility(1, 1.0);
  }

  function createParticleField() {
    const particleCount = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xFF7417);
    const c2 = new THREE.Color(0xF044A5);
    const c3 = new THREE.Color(0x8B35E8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const mixed = Math.random() > 0.6 ? c1 : (Math.random() > 0.3 ? c2 : c3);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function setupEvents() {
    window.addEventListener('resize', onResize);

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => isDragging = false);

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Set Stage (1, 2, or 3)
  function setStage(stageNum) {
    if (stageNum < 1 || stageNum > 3) return;
    targetStage = stageNum;
    stageTransitionProgress = 0.0;

    // Update UI Stage Pills
    const pills = document.querySelectorAll('.stage-nav-pill');
    pills.forEach(pill => {
      const pStage = parseInt(pill.getAttribute('data-stage'), 10);
      if (pStage === stageNum) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update Stage Info Card Text
    const stageDesc = document.getElementById('stage-description-text');
    const stageTitle = document.getElementById('stage-title-text');
    if (stageTitle && stageDesc) {
      if (stageNum === 1) {
        stageTitle.textContent = "Stage 1: Limited Knowledge & Exploration";
        stageDesc.textContent = "Uncertainty in a rapidly shifting market. Surrounded by basic textbook concepts, unguided code snippets, and unmapped career paths.";
      } else if (stageNum === 2) {
        stageTitle.textContent = "Stage 2: AI Guided Learning & Growth";
        stageDesc.textContent = "Stepping through the transformation portal. Empowered with curated 100% free courses, personalized roadmaps, and real-time skill acquisition.";
      } else if (stageNum === 3) {
        stageTitle.textContent = "Stage 3: Career-Ready Professional";
        stageDesc.textContent = "Standing confident at the sunrise horizon. Armed with verified industry credentials, modern tools, and targeted employability qualifications.";
      }
    }
  }

  function updateStageVisibility(stage, progress) {
    // Stage 1 Elements
    const s1Alpha = stage === 1 ? (1.0 - progress * 0.5) : 0.0;
    stage1Elements.forEach(el => {
      el.visible = stage === 1;
      el.rotation.y += 0.005;
    });

    // Stage 2 Elements (Portal & Tech Cubes)
    const s2Alpha = stage === 2 ? 1.0 : (stage === 3 ? 0.35 : 0.0);
    stage2Elements.forEach((el, idx) => {
      el.visible = stage >= 2;
      if (el === portalRing) {
        el.rotation.z += 0.015;
      } else {
        el.rotation.x += 0.01;
        el.rotation.y += 0.02;
        el.position.y += Math.sin(Date.now() * 0.002 + idx) * 0.0015;
      }
    });

    // Stage 3 Elements (Badges & Laptop)
    stage3Elements.forEach(el => {
      el.visible = stage === 3;
      el.rotation.y += 0.015;
    });

    // Character Posture & Outfit morphing
    if (stage === 1) {
      // Slouched, uncertain
      headMesh.rotation.x = 0.15;
      headMesh.position.y = 1.52;
      torsoMesh.rotation.x = 0.08;
      leftArm.rotation.z = 0.15;
      rightArm.rotation.z = -0.15;
      laptopMesh.scale.set(0.001, 0.001, 0.001);
      blazerMesh.material.opacity = 0.0;

      // Darker lighting
      keyLight.color.setHex(0x8B35E8);
      keyLight.intensity = 1.0;
      rimLight.color.setHex(0xF04458);
      rimLight.intensity = 0.8;
      portalLight.intensity = 0.0;
    } else if (stage === 2) {
      // Stepping forward, active posture
      headMesh.rotation.x = 0.0;
      headMesh.position.y = 1.55;
      torsoMesh.rotation.x = 0.0;
      leftArm.rotation.z = 0.35;
      rightArm.rotation.z = -0.35;
      laptopMesh.scale.set(0.001, 0.001, 0.001);
      blazerMesh.material.opacity = 0.45;

      // Vibrant sunrise portal lighting
      keyLight.color.setHex(0xFF7417);
      keyLight.intensity = 2.0;
      rimLight.color.setHex(0xF044A5);
      rimLight.intensity = 1.8;
      portalLight.intensity = 2.5;
    } else if (stage === 3) {
      // Confident professional stance with glowing laptop
      headMesh.rotation.x = -0.05;
      headMesh.position.y = 1.57;
      torsoMesh.rotation.x = -0.02;
      leftArm.rotation.x = -0.6;
      leftArm.rotation.z = 0.2;
      rightArm.rotation.x = -0.6;
      rightArm.rotation.z = -0.2;
      laptopMesh.scale.set(1.0, 1.0, 1.0);
      blazerMesh.material.opacity = 0.95;

      // Brilliant sunrise horizon lighting
      keyLight.color.setHex(0xFF7417);
      keyLight.intensity = 2.4;
      rimLight.color.setHex(0xFFF0E8);
      rimLight.intensity = 2.2;
      portalLight.intensity = 1.5;
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    // Smooth stage transitions
    if (currentStage !== targetStage) {
      stageTransitionProgress += 0.035;
      if (stageTransitionProgress >= 1.0) {
        currentStage = targetStage;
        stageTransitionProgress = 1.0;
      }
      updateStageVisibility(targetStage, stageTransitionProgress);
    }

    // Auto idle camera sway
    if (!isDragging) {
      targetRotationY += 0.002;
    }

    // Character gentle breathing motion
    const time = Date.now() * 0.002;
    characterGroup.position.y = Math.sin(time) * 0.025;
    characterGroup.rotation.y += (targetRotationY - characterGroup.rotation.y) * 0.08;
    characterGroup.rotation.x += (targetRotationX - characterGroup.rotation.x) * 0.08;

    // Slow starfield particle drift
    if (particleSystem) {
      particleSystem.rotation.y -= 0.0006;
    }

    // Render Scene
    renderer.render(scene, camera);
  }

  return {
    init,
    setStage,
    getStage: () => currentStage
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillRise3D;
}
