/* ==========================================================================
   3D VISUALS — three.js r128
   Hero: three orbiting wireframe forms representing Code / Edit / Design
   About: slow-rotating gold ring lattice
   ========================================================================== */

(function () {
  if (typeof THREE === "undefined") return;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeRenderer(canvas) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
  }

  /* ---------------- HERO ---------------- */
  function initHero() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 14);

    var renderer = makeRenderer(canvas);

    var gold = 0xc9a44c;
    var goldBright = 0xe9cd82;

    var group = new THREE.Group();
    scene.add(group);

    // Code — an angled bracket pair (icosahedron as a stand-in geometric "gem")
    var icoGeo = new THREE.IcosahedronGeometry(2.1, 0);
    var icoMat = new THREE.MeshBasicMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.55 });
    var ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-4.2, 1.6, -2);
    group.add(ico);

    // Edit — a torus (reel/loop)
    var torusGeo = new THREE.TorusGeometry(1.6, 0.45, 8, 32);
    var torusMat = new THREE.MeshBasicMaterial({ color: goldBright, wireframe: true, transparent: true, opacity: 0.5 });
    var torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(3.8, -1.2, -3);
    group.add(torus);

    // Design — an octahedron
    var octGeo = new THREE.OctahedronGeometry(1.5, 0);
    var octMat = new THREE.MeshBasicMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.45 });
    var oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(0.6, 3.2, -5);
    group.add(oct);

    // Ambient particle field
    var particleCount = 140;
    var particleGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({ color: goldBright, size: 0.045, transparent: true, opacity: 0.55 });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    var mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      ico.rotation.x = t * 0.15;
      ico.rotation.y = t * 0.2;
      torus.rotation.x = t * 0.12;
      torus.rotation.y = t * 0.18;
      oct.rotation.x = t * 0.1;
      oct.rotation.z = t * 0.14;

      particles.rotation.y = t * 0.02;

      if (!reduceMotion) {
        group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.02;
        group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.02;
      }

      renderer.render(scene, camera);
    }
    if (!reduceMotion) animate();
    else renderer.render(scene, camera);
  }

  /* ---------------- ABOUT ---------------- */
  function initAbout() {
    var canvas = document.getElementById("about-canvas");
    if (!canvas) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    var renderer = makeRenderer(canvas);

    var group = new THREE.Group();
    scene.add(group);

    var rings = [];
    for (var i = 0; i < 3; i++) {
      var geo = new THREE.TorusGeometry(1.6 + i * 0.6, 0.015, 8, 64);
      var mat = new THREE.MeshBasicMaterial({ color: 0xc9a44c, transparent: true, opacity: 0.5 - i * 0.1 });
      var ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      ring.rotation.y = i * 0.4;
      group.add(ring);
      rings.push(ring);
    }

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    var ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      rings.forEach(function (r, i) {
        r.rotation.z = t * (0.06 + i * 0.02);
      });
      renderer.render(scene, camera);
    }
    if (!reduceMotion) animate();
    else renderer.render(scene, camera);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initAbout();
  });
})();
