/* ==========================================================================
   THREE.JS 3D AMBIENT CANVAS — GOLDEN EMBERS & AROMATIC SPICE DUST
   Advanced particle system with multi-layered effects, mouse parallax,
   interactive zones, and performance optimization
   ========================================================================== */

let threeInitialized = false;
let animationId = null;
let scene = null;
let camera = null;
let renderer = null;
let particleSystems = [];
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let scrollY = 0;
let time = 0;
let clock = null;
let resizeHandler = null;
let mousemoveHandler = null;
let scrollHandler = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
function initThreeBackground() {
  const container = document.getElementById('three-bg-canvas');
  if (!container || typeof THREE === 'undefined' || threeInitialized) return;

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.warn('WebGL not supported, skipping Three.js background');
    return;
  }

  // Scene setup
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Camera with dynamic FOV based on screen size
  const aspect = window.innerWidth / window.innerHeight;
  const fov = window.innerWidth < 768 ? 80 : 65;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2000);
  camera.position.set(0, 0, 60);

  // Renderer with high quality settings
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Create all particle layers
  createEmberLayer();
  createSpiceDustLayer();
  createFloatingAshLayer();
  createGlowOrbs();

  // Event listeners
  mousemoveHandler = onMouseMove;
  scrollHandler = onScroll;
  resizeHandler = onResize;

  window.addEventListener('mousemove', mousemoveHandler, { passive: true });
  window.addEventListener('scroll', scrollHandler, { passive: true });
  window.addEventListener('resize', resizeHandler, { passive: true });

  // Start animation loop
  animate();
  threeInitialized = true;

  // Expose for debugging
  window.__threeBg = { scene, camera, renderer, particleSystems, dispose: disposeThreeBackground };
}

/* ==========================================================================
   PARTICLE LAYER CREATION
   ========================================================================== */

function createEmberLayer() {
  // Golden embers - larger, slower, warm glow
  const count = window.innerWidth < 768 ? 150 : 250;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const colorIndices = new Float32Array(count);
  const lifetimes = new Float32Array(count);
  const maxLifetimes = new Float32Array(count);

  const emberColors = [
    new THREE.Color(0xffd700), // Gold
    new THREE.Color(0xffaa00), // Amber
    new THREE.Color(0xff6600), // Deep Orange
    new THREE.Color(0xff3300), // Ember Red
    new THREE.Color(0xffffaa), // Pale Gold
  ];

  for (let i = 0; i < count; i++) {
    resetEmber(i, positions, velocities, sizes, alphas, colorIndices, lifetimes, maxLifetimes, true);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute('colorIndex', new THREE.BufferAttribute(colorIndices, 1));
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
  geometry.setAttribute('maxLifetime', new THREE.BufferAttribute(maxLifetimes, 1));

  // Custom shader material for embers with glow
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float size;
      attribute float alpha;
      attribute float colorIndex;
      attribute float lifetime;
      attribute float maxLifetime;
      varying float vAlpha;
      varying float vColorIndex;
      varying float vLifeProgress;
      varying vec3 vPosition;
      void main() {
        vAlpha = alpha;
        vColorIndex = colorIndex;
        vLifeProgress = lifetime / maxLifetime;
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColors[5];
      varying float vAlpha;
      varying float vColorIndex;
      varying float vLifeProgress;
      varying vec3 vPosition;
      void main() {
        vec3 color = uColors[int(vColorIndex)];
        float dist = length(gl_PointCoord - vec2(0.5));
        float circle = 1.0 - smoothstep(0.0, 0.5, dist);
        // Core glow
        float core = 1.0 - smoothstep(0.0, 0.25, dist);
        vec3 finalColor = mix(color * 0.3, color, core);
        float finalAlpha = circle * vAlpha * (1.0 - vLifeProgress * 0.5);
        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `,
    uniforms: {
      uColors: { value: emberColors },
      uTime: { value: 0 }
    }
  });

  const system = new THREE.Points(geometry, material);
  system.userData = {
    type: 'ember',
    count,
    resetFn: resetEmber,
    positions,
    velocities,
    sizes,
    alphas,
    colorIndices,
    lifetimes,
    maxLifetimes,
    geometry,
    material
  };
  scene.add(system);
  particleSystems.push(system);
}

function createSpiceDustLayer() {
  // Aromatic spice dust - smaller, more numerous, swirling
  const count = window.innerWidth < 768 ? 300 : 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const colorIndices = new Float32Array(count);
  const phases = new Float32Array(count);
  const phaseSpeeds = new Float32Array(count);

  const spiceColors = [
    new THREE.Color(0xc9a84c), // Warm Gold
    new THREE.Color(0xd4a574), // Saffron
    new THREE.Color(0xb8860b), // Dark Goldenrod
    new THREE.Color(0xe6c87a), // Light Saffron
    new THREE.Color(0xdaa520), // Goldenrod
  ];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 20 + Math.random() * 50;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 10;
    positions[i * 3 + 2] = radius * Math.cos(phi);

    velocities[i * 3] = (Math.random() - 0.5) * 0.008;
    velocities[i * 3 + 1] = Math.random() * 0.015 + 0.003;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

    sizes[i] = Math.random() * 1.2 + 0.3;
    alphas[i] = Math.random() * 0.4 + 0.15;
    colorIndices[i] = Math.floor(Math.random() * spiceColors.length);
    phases[i] = Math.random() * Math.PI * 2;
    phaseSpeeds[i] = Math.random() * 0.002 + 0.0005;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute('colorIndex', new THREE.BufferAttribute(colorIndices, 1));
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('phaseSpeed', new THREE.BufferAttribute(phaseSpeeds, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexShader: `
      attribute float size;
      attribute float alpha;
      attribute float colorIndex;
      attribute float phase;
      attribute float phaseSpeed;
      varying float vAlpha;
      varying float vColorIndex;
      varying float vPhase;
      varying vec3 vPosition;
      void main() {
        vAlpha = alpha;
        vColorIndex = colorIndex;
        vPhase = phase;
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColors[5];
      uniform float uTime;
      varying float vAlpha;
      varying float vColorIndex;
      varying float vPhase;
      varying vec3 vPosition;
      void main() {
        vec3 color = uColors[int(vColorIndex)];
        float dist = length(gl_PointCoord - vec2(0.5));
        float circle = 1.0 - smoothstep(0.0, 0.5, dist);
        // Subtle shimmer
        float shimmer = sin(uTime * 3.0 + vPhase * 10.0) * 0.15 + 0.85;
        float finalAlpha = circle * vAlpha * shimmer;
        gl_FragColor = vec4(color, finalAlpha);
      }
    `,
    uniforms: {
      uColors: { value: spiceColors },
      uTime: { value: 0 }
    }
  });

  const system = new THREE.Points(geometry, material);
  system.userData = {
    type: 'spice',
    count,
    positions,
    velocities,
    sizes,
    alphas,
    colorIndices,
    phases,
    phaseSpeeds,
    geometry,
    material
  };
  scene.add(system);
  particleSystems.push(system);
}

function createFloatingAshLayer() {
  // Fine ash/smoke particles - very subtle, large count
  const count = window.innerWidth < 768 ? 100 : 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const rotations = new Float32Array(count);
  const rotationSpeeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100 - 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    velocities[i * 3] = (Math.random() - 0.5) * 0.015;
    velocities[i * 3 + 1] = Math.random() * 0.01 + 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

    sizes[i] = Math.random() * 3 + 1.5;
    alphas[i] = Math.random() * 0.08 + 0.02;
    rotations[i] = Math.random() * Math.PI * 2;
    rotationSpeeds[i] = (Math.random() - 0.5) * 0.001;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
  geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotationSpeeds, 1));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: false,
    transparent: true,
    opacity: 0.15,
    color: 0x3a2f1f,
    blending: THREE.NormalBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const system = new THREE.Points(geometry, material);
  system.userData = {
    type: 'ash',
    count,
    positions,
    velocities,
    sizes,
    alphas,
    rotations,
    rotationSpeeds,
    geometry,
    material
  };
  scene.add(system);
  particleSystems.push(system);
}

function createGlowOrbs() {
  // Large atmospheric glow orbs - few, dramatic
  const count = 5;
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const orbs = [];

  const orbColors = [
    new THREE.Color(0xff6600),
    new THREE.Color(0xffaa00),
    new THREE.Color(0xff8800),
    new THREE.Color(0xff4400),
    new THREE.Color(0xffcc00),
  ];

  for (let i = 0; i < count; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: orbColors[i],
      transparent: true,
      opacity: 0.03,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(15 + Math.random() * 10);
    mesh.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60 - 10,
      (Math.random() - 0.5) * 60
    );
    mesh.userData = {
      baseScale: mesh.scale.x,
      speed: 0.1 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      axis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize()
    };
    scene.add(mesh);
    orbs.push(mesh);
  }
  particleSystems.push({ type: 'orbs', orbs });
}

/* ==========================================================================
   PARTICLE RESET & UPDATE FUNCTIONS
   ========================================================================== */

function resetEmber(index, positions, velocities, sizes, alphas, colorIndices, lifetimes, maxLifetimes, initial = false) {
  const spreadX = initial ? 45 : 60;
  const spreadY = initial ? 45 : 50;
  const spreadZ = initial ? 40 : 50;

  positions[index * 3] = (Math.random() - 0.5) * spreadX * 2;
  positions[index * 3 + 1] = initial ? (Math.random() - 0.5) * spreadY * 2 : -spreadY - Math.random() * 10;
  positions[index * 3 + 2] = (Math.random() - 0.5) * spreadZ * 2;

  velocities[index * 3] = (Math.random() - 0.5) * 0.02;
  velocities[index * 3 + 1] = Math.random() * 0.04 + 0.015;
  velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.02;

  sizes[index] = Math.random() * 2.5 + 1.2;
  alphas[index] = Math.random() * 0.5 + 0.4;
  colorIndices[index] = Math.floor(Math.random() * 5);
  lifetimes[index] = 0;
  maxLifetimes[index] = 150 + Math.random() * 200;
}

function updateEmbers(system, delta) {
  const { count, positions, velocities, sizes, alphas, colorIndices, lifetimes, maxLifetimes, geometry } = system.userData;
  let needsUpdate = false;

  for (let i = 0; i < count; i++) {
    // Apply velocity with subtle turbulence
    positions[i * 3] += velocities[i * 3] + Math.sin(time * 0.5 + i) * 0.003;
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(time * 0.3 + i) * 0.003;

    // Mouse influence
    const dx = positions[i * 3] - targetX * 15;
    const dy = positions[i * 3 + 1] - targetY * 15;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) {
      const force = (30 - dist) / 30 * 0.02;
      positions[i * 3] += dx / (dist + 0.1) * force;
      positions[i * 3 + 1] += dy / (dist + 0.1) * force;
    }

    // Scroll influence
    positions[i * 3 + 1] -= scrollY * 0.0005;

    lifetimes[i] += delta * 60;

    // Reset if expired or too high
    if (lifetimes[i] > maxLifetimes[i] || positions[i * 3 + 1] > 60) {
      resetEmber(i, positions, velocities, sizes, alphas, colorIndices, lifetimes, maxLifetimes);
      needsUpdate = true;
    }

    // Fade alpha based on lifetime
    const progress = lifetimes[i] / maxLifetimes[i];
    alphas[i] = alphas[i] * (1 - progress * 0.3);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.alpha.needsUpdate = true;
  geometry.attributes.lifetime.needsUpdate = true;
}

function updateSpiceDust(system, delta) {
  const { count, positions, velocities, phases, phaseSpeeds, geometry } = system.userData;

  for (let i = 0; i < count; i++) {
    positions[i * 3] += velocities[i * 3] + Math.sin(phases[i] + time) * 0.005;
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(phases[i] + time * 0.7) * 0.005;

    // Mouse influence - stronger swirl
    const dx = positions[i * 3] - targetX * 20;
    const dy = positions[i * 3 + 1] - targetY * 10;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 40) {
      const force = (40 - dist) / 40 * 0.03;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      positions[i * 3] += Math.cos(angle) * force;
      positions[i * 3 + 2] += Math.sin(angle) * force;
    }

    // Scroll
    positions[i * 3 + 1] -= scrollY * 0.0003;

    phases[i] += phaseSpeeds[i];

    // Wrap around
    if (positions[i * 3 + 1] > 60) {
      positions[i * 3 + 1] = -60;
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    if (positions[i * 3 + 1] < -80) {
      positions[i * 3 + 1] = 60;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.phase.needsUpdate = true;
}

function updateFloatingAsh(system, delta) {
  const { count, positions, velocities, rotations, rotationSpeeds, geometry } = system.userData;

  for (let i = 0; i < count; i++) {
    positions[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(time * 0.5 + i) * 0.002;

    rotations[i] += rotationSpeeds[i];

    if (positions[i * 3 + 1] > 70) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = -70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.rotation.needsUpdate = true;
}

function updateGlowOrbs(delta) {
  particleSystems.forEach(sys => {
    if (sys.type === 'orbs') {
      sys.orbs.forEach(orb => {
        orb.userData.phase += delta * orb.userData.speed;
        const s = orb.userData.baseScale * (1 + Math.sin(orb.userData.phase) * 0.15);
        orb.scale.setScalar(s);

        // Slow orbital motion
        const axis = orb.userData.axis;
        orb.position.applyAxisAngle(axis, delta * 0.05);

        // Pulse opacity
        orb.material.opacity = 0.02 + Math.sin(orb.userData.phase * 2) * 0.015;
      });
    }
  });
}

/* ==========================================================================
   ANIMATION LOOP
   ========================================================================== */

function animate() {
  animationId = requestAnimationFrame(animate);

  const delta = clock.getDelta();
  time += delta;

  // Smooth mouse tracking
  targetX += (mouseX - targetX) * 0.03;
  targetY += (mouseY - targetY) * 0.03;

  // Update all particle systems
  particleSystems.forEach(system => {
    if (system.userData.type === 'ember') {
      updateEmbers(system, delta);
      system.material.uniforms.uTime.value = time;
    } else if (system.userData.type === 'spice') {
      updateSpiceDust(system, delta);
      system.material.uniforms.uTime.value = time;
    } else if (system.userData.type === 'ash') {
      updateFloatingAsh(system, delta);
    } else if (system.type === 'orbs') {
      updateGlowOrbs(delta);
    }
  });

  // Subtle camera breathing
  camera.position.x = Math.sin(time * 0.08) * 1.5 + targetX * 3;
  camera.position.y = Math.cos(time * 0.06) * 1 + targetY * 2;
  camera.lookAt(0, -5, 0);

  // Subtle scene rotation
  scene.rotation.y = Math.sin(time * 0.02) * 0.02 + targetX * 0.03;
  scene.rotation.x = Math.cos(time * 0.015) * 0.015 - targetY * 0.02;

  renderer.render(scene, camera);
}

/* ==========================================================================
   EVENT HANDLERS
   ========================================================================== */

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function onScroll() {
  scrollY = window.scrollY;
}

function onResize() {
  if (!renderer || !camera) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.fov = width < 768 ? 80 : 65;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/* ==========================================================================
   DISPOSAL
   ========================================================================== */

function disposeThreeBackground() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (mousemoveHandler) window.removeEventListener('mousemove', mousemoveHandler);
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);

  particleSystems.forEach(system => {
    if (system.userData?.geometry) system.userData.geometry.dispose();
    if (system.userData?.material) {
      if (Array.isArray(system.userData.material)) {
        system.userData.material.forEach(m => m.dispose());
      } else {
        system.userData.material.dispose();
      }
    }
    if (system.orbs) {
      system.orbs.forEach(orb => {
        orb.geometry.dispose();
        orb.material.dispose();
      });
    }
    if (system.parent) system.parent.remove(system);
  });

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    const canvas = renderer.domElement;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  scene = null;
  camera = null;
  renderer = null;
  particleSystems = [];
  threeInitialized = false;
}

/* ==========================================================================
   3D INTERACTIVE TILT CARDS WITH GLARE SHEEN
   Vanilla JS implementation with GPU acceleration
   ========================================================================== */

let tiltInitialized = false;
let tiltCards = new WeakMap();

function init3DTiltCards() {
  if (tiltInitialized) return;

  const selector = '.dish-card, .usp-card, .hero-visual-card, .promo-card, .event-card, .testimonial-card, .highlight-card, .promo-card, .about-image-wrapper, .chef-card-img, .gallery-item, .location-map, .logistics-card, .footer-col, .stat-item';

  // Use IntersectionObserver to initialize cards only when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initTiltCard(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px', threshold: 0.05 });

  document.querySelectorAll(selector).forEach(card => {
    if (!card.dataset.tiltInit) {
      observer.observe(card);
    }
  });

  tiltInitialized = true;
}

function initTiltCard(card) {
  card.dataset.tiltInit = 'true';

  // Force GPU layer
  card.style.transformStyle = 'preserve-3d';
  card.style.willChange = 'transform, box-shadow';
  card.style.backfaceVisibility = 'hidden';

  // Create glare element
  const glare = document.createElement('div');
  glare.className = 'tilt-glare';
  glare.style.cssText = `
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.3s ease;
  `;
  card.style.position = 'relative';
  card.insertBefore(glare, card.firstChild);

  let rafId = null;
  let currentX = 0;
  let currentY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let glareX = 50;
  let glareY = 50;

  const maxTilt = card.classList.contains('hero-visual-card') ? 8 : 12;
  const scaleFactor = card.classList.contains('hero-visual-card') ? 1.01 : 1.03;

  function updateTransform() {
    const rotateX = currentY;
    const rotateY = currentX;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX.toFixed(2)}deg)
      rotateY(${rotateY.toFixed(2)}deg)
      scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})
      translateZ(10px)
    `;

    // Glare follows mouse
    glare.style.transform = `
      translate(${glareX - 50}%, ${glareY - 50}%)
      scale(1.5)
    `;
    glare.style.opacity = (Math.abs(currentX) + Math.abs(currentY)) / (maxTilt * 2) * 0.4;

    rafId = requestAnimationFrame(updateTransform);
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = ((x - centerX) / centerX) * maxTilt;
    const deltaY = ((y - centerY) / centerY) * -maxTilt;

    targetRotateX = deltaY;
    targetRotateY = deltaX;
    glareX = (x / rect.width) * 100;
    glareY = (y / rect.height) * 100;
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    if (!rafId) {
      currentX = targetRotateY;
      currentY = targetRotateX;
      updateTransform();
    }
  });

  card.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    glareX = 50;
    glareY = 50;

    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';

    // Animate back to center
    const animateReturn = () => {
      currentX += (targetRotateY - currentX) * 0.15;
      currentY += (targetRotateX - currentY) * 0.15;

      card.style.transform = `
        perspective(1000px)
        rotateX(${currentY.toFixed(2)}deg)
        rotateY(${currentX.toFixed(2)}deg)
        scale3d(1, 1, 1)
        translateZ(0)
      `;

      glare.style.opacity = (Math.abs(currentX) + Math.abs(currentY)) / (maxTilt * 2) * 0.4;

      if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
        requestAnimationFrame(animateReturn);
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
    animateReturn();
  });

  // Touch support for mobile
  card.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetRotateX = ((y - centerY) / centerY) * -maxTilt * 0.5;
      targetRotateY = ((x - centerX) / centerX) * maxTilt * 0.5;
      glareX = (x / rect.width) * 100;
      glareY = (y / rect.height) * 100;

      card.style.transition = 'transform 0.1s ease-out';
      currentX = targetRotateY;
      currentY = targetRotateX;
      card.style.transform = `
        perspective(1000px)
        rotateX(${currentY.toFixed(2)}deg)
        rotateY(${currentX.toFixed(2)}deg)
        scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})
      `;
      glare.style.opacity = '0.2';
    }
  }, { passive: true });

  card.addEventListener('touchend', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glare.style.opacity = '0';
  }, { passive: true });
}

/* ==========================================================================
   PUBLIC API
   ========================================================================== */

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if Three.js is loaded
  if (typeof THREE !== 'undefined') {
    initThreeBackground();
  } else {
    // Wait for Three.js to load
    const checkThree = setInterval(() => {
      if (typeof THREE !== 'undefined') {
        clearInterval(checkThree);
        initThreeBackground();
      }
    }, 100);
  }

  // Initialize tilt cards
  init3DTiltCards();
});

// Expose for manual control
window.ThreeBG = {
  init: initThreeBackground,
  dispose: disposeThreeBackground,
  initTiltCards: init3DTiltCards,
  getScene: () => scene,
  getRenderer: () => renderer,
  getCamera: () => camera
};