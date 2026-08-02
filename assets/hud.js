(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const boot = (() => {
    const logs = ['loading kernel…', 'mounting interface…', 'calibrating reticle…', 'linking mission log…', 'ready.'];
    const el = document.getElementById('bootLog');
    const shell = document.getElementById('boot');
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i < logs.length) el.textContent = logs[i];
    }, 340);
    const finish = () => {
      shell.classList.add('hidden');
      clearInterval(interval);
    };
    window.addEventListener('load', () => setTimeout(finish, prefersReducedMotion ? 200 : 1750));
    return { finish };
  })();

  const clock = (() => {
    const el = document.getElementById('clock');
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  })();

  const reticle = (() => {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const el = document.getElementById('reticle');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let hovering = false;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', e => {
      hovering = !!e.target.closest('a, button, .log-head, .panel');
      el.classList.toggle('lock', hovering);
    });

    const step = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      el.style.transform = `translate(${rx}px, ${ry}px) scale(${hovering ? 1.4 : 1})`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  })();

  const navActive = (() => {
    const current = document.body.dataset.page;
    document.querySelectorAll('.hud-nav .item').forEach(item => {
      item.classList.toggle('active', item.dataset.target === current);
    });
  })();
})();
