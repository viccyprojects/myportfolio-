(() => {
  'use strict';

  const STATUS_LABELS = {
    live: 'LIVE', active: 'ACTIVE', deployed: 'DEPLOYED', dev: 'IN DEV', paused: 'PAUSED'
  };

  const DEFAULT_PROJECTS = [
    {
      name: 'Atlantas', subtitle: 'Fintech ecosystem — flagship', status: 'dev', stackMini: 'Firebase · PWA',
      description: 'The flagship of a larger ecosystem plan. A three-portal progressive web app — user banking app, admin console, and a separate developer portal — running on a dedicated Firebase project. Built with a global system on/off switch, push notifications, and continent/country-level user organization.',
      tags: ['Firebase', 'PWA', 'Multi-portal', 'Push notifications', 'OTP flow'], url: ''
    },
    {
      name: 'Tradex', subtitle: 'Marketplace platform', status: 'active', stackMini: 'Firebase · Wallet',
      description: 'A recurring, long-running marketplace build carrying 54+ live listings. Sellers operate through an agent/team system with its own seller wallet, and every withdrawal request routes through admin-side approval before funds move.',
      tags: ['Marketplace', 'Agent system', 'Seller wallet', 'Admin approvals'], url: ''
    },
    {
      name: 'WaveMeet', subtitle: 'Real-time video calling', status: 'live', stackMini: 'Vercel · Firebase',
      description: 'A video-calling platform running on Vercel and Firebase. Ships a custom background sound system — users can upload their own audio, route it through an OBS virtual camera, and control it from an in-call slide-up tray without leaving the meeting.',
      tags: ['WebRTC-style calling', 'OBS routing', 'Google Auth'], url: ''
    },
    {
      name: 'X Club', subtitle: 'Social + investment platform', status: 'active', stackMini: 'Flutterwave · Groq',
      description: 'A social platform with a feed, direct messaging, and a built-in investment flow. Posting is partly automated through the Groq API, and checkout runs through Flutterwave with multi-currency support.',
      tags: ['Feed & messaging', 'Groq AI posting', 'Multi-currency checkout', 'PWA'], url: ''
    },
    {
      name: 'GoldVein Mining', subtitle: 'Group chat for gold sellers', status: 'deployed', stackMini: 'Single-file · RTDB',
      description: 'A full real-time group chat system for a niche trading community — delivered as a single HTML file running on Firebase Realtime Database. Includes admin controls, broadcast mode, per-member permission tiers, and Cloudinary-backed image uploads.',
      tags: ['Realtime Database', 'Broadcast mode', 'Permission tiers', 'Cloudinary'], url: ''
    },
    {
      name: 'ToonCast', subtitle: 'Live avatar & voice changer', status: 'paused', stackMini: 'MediaPipe · Web Audio',
      description: 'A face-driven cartoon avatar and voice-changer tool for live streaming, built on MediaPipe for facial tracking and the Web Audio API for real-time pitch shifting. Currently paused — avatar rendering quality fell short of the bar this log holds itself to.',
      tags: ['MediaPipe', 'Web Audio API', 'Face tracking', 'R&D'], url: ''
    }
  ];

  const projectStore = (() => {
    const list = document.getElementById('logList');
    const note = document.getElementById('logNote');

    const render = projects => {
      note.textContent = `${projects.length} case file${projects.length === 1 ? '' : 's'}. Not all of them succeeded on the first pass — the log stays honest either way.`;

      list.innerHTML = projects.map((p, i) => `
        <div class="log-entry">
          <div class="log-head">
            <span class="log-idx">${String(i + 1).padStart(2, '0')}</span>
            <span class="log-name">${escapeHtml(p.name)}<small>${escapeHtml(p.subtitle)}</small></span>
            <span class="status ${escapeHtml(p.status)}">${STATUS_LABELS[p.status] || 'ACTIVE'}</span>
            <span class="stack-mini">${escapeHtml(p.stackMini)}</span>
            <span class="chev"></span>
          </div>
          <div class="log-body">
            <div class="log-body-inner">
              <p>${escapeHtml(p.description)}</p>
              <div class="log-tags">${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
            </div>
            ${p.url ? `<div class="log-body-inner" style="padding-top:0;"><a class="view-live" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">VIEW LIVE →</a></div>` : ''}
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.log-entry').forEach(entry => {
        const head = entry.querySelector('.log-head');
        const body = entry.querySelector('.log-body');
        head.addEventListener('click', () => {
          const isOpen = entry.classList.contains('open');
          list.querySelectorAll('.log-entry.open').forEach(open => {
            if (open !== entry) {
              open.classList.remove('open');
              open.querySelector('.log-body').style.maxHeight = null;
            }
          });
          entry.classList.toggle('open', !isOpen);
          body.style.maxHeight = isOpen ? null : `${body.scrollHeight}px`;
        });
      });
    };

    const load = async () => {
      if (!window.firebaseConfigured) { render(DEFAULT_PROJECTS); return; }
      try {
        const doc = await firebase.firestore().collection('config').doc('projects').get();
        const data = doc.exists ? doc.data().list : null;
        render(Array.isArray(data) && data.length ? data : DEFAULT_PROJECTS);
      } catch (err) {
        render(DEFAULT_PROJECTS);
      }
    };

    load();
  })();
})();
