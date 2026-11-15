// Hero service-mesh animation, typed line, and scroll reveal.
(function () {
  document.documentElement.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Typed line ----------
  var typed = document.getElementById('typed');
  var lines = [
    'Java 21 and Spring Boot',
    'event-driven microservices with Kafka',
    'Claude Certified Developer – Foundations'
  ];
  if (typed) {
    if (reduced) {
      typed.textContent = lines[0];
    } else {
      var li = 0, ci = 0, deleting = false;
      (function tick() {
        var line = lines[li];
        typed.textContent = line.slice(0, ci);
        var wait = 55;
        if (!deleting && ci < line.length) { ci++; }
        else if (!deleting) { deleting = true; wait = 1800; }
        else if (ci > 0) { ci--; wait = 25; }
        else { deleting = false; li = (li + 1) % lines.length; wait = 350; }
        setTimeout(tick, wait);
      })();
    }
  }

  // ---------- Scroll reveal ----------
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Service mesh canvas ----------
  // Nodes are services; bright pulses are messages travelling between them.
  var canvas = document.getElementById('mesh');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = 1, nodes = [], pulses = [], running = false, rafId = 0;
  var LINK = 170;

  function resize() {
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.max(10, Math.min(46, Math.round((W * H) / 22000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.6 + Math.random() * 1.8
      });
    }
    pulses = [];
  }

  function spawnPulse() {
    var a = nodes[(Math.random() * nodes.length) | 0];
    var near = nodes.filter(function (n) {
      return n !== a && Math.hypot(n.x - a.x, n.y - a.y) < LINK;
    });
    if (!near.length) return;
    pulses.push({ a: a, b: near[(Math.random() * near.length) | 0], t: 0, v: 0.012 + Math.random() * 0.012 });
  }

  function draw(move) {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, d;

    if (move) {
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
    }

    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(120, 170, 255,' + (0.22 * (1 - d / LINK)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.fillStyle = 'rgba(150, 200, 255, 0.75)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
    }

    if (move) {
      if (pulses.length < 9 && Math.random() < 0.06) spawnPulse();
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i];
        p.t += p.v;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        var x = p.a.x + (p.b.x - p.a.x) * p.t;
        var y = p.a.y + (p.b.y - p.a.y) * p.t;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(111, 211, 255, 0.95)');
        g.addColorStop(1, 'rgba(111, 211, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.fill();
      }
    }
  }

  function loop() {
    if (!running) return;
    draw(true);
    rafId = requestAnimationFrame(loop);
  }

  function start() { if (!running && !reduced) { running = true; loop(); } }
  function stop() { running = false; cancelAnimationFrame(rafId); }

  resize();
  draw(false);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); draw(false); }, 150);
  });

  // Only animate while the hero is on screen and the tab is visible.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting && !document.hidden ? start() : stop();
    }).observe(canvas);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
})();
