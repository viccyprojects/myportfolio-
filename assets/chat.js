(() => {
  'use strict';

  const backdrop = document.getElementById('chatBackdrop');
  const stepIdentify = document.getElementById('chatStepIdentify');
  const stepThread = document.getElementById('chatStepThread');
  const usernameInput = document.getElementById('chatUsername');
  const identifyErr = document.getElementById('chatIdentifyErr');
  const threadUserEl = document.getElementById('chatThreadUser');
  const logEl = document.getElementById('chatLog');
  const textInput = document.getElementById('chatText');
  const threadErr = document.getElementById('chatThreadErr');

  const STORAGE_KEY = 'vsysChatUsername';
  let topic = 'general';
  let threadId = null;
  let unsubscribe = null;

  const slugify = raw => raw.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '');

  const showStep = step => {
    [stepIdentify, stepThread].forEach(s => { s.style.display = 'none'; });
    step.style.display = 'block';
  };

  const renderMessages = docs => {
    if (!docs.length) {
      logEl.innerHTML = '<div class="chat-empty">This is the start of your conversation. Send a message and we\'ll get back to you soon.</div>';
      return;
    }
    logEl.innerHTML = docs.map(m => `
      <div class="chat-bubble ${m.sender === 'admin' ? 'admin' : 'user'}">
        <span class="who">${m.sender === 'admin' ? 'V·SYS' : 'YOU'}</span>${escapeHtml(m.text)}
      </div>
    `).join('');
    logEl.scrollTop = logEl.scrollHeight;
  };

  const openThread = async id => {
    threadId = id;
    threadUserEl.textContent = `@${id}`;
    showStep(stepThread);
    if (!window.firebaseConfigured) {
      renderMessages([]);
      return;
    }
    if (unsubscribe) unsubscribe();
    unsubscribe = firebase.firestore()
      .collection('threads').doc(id).collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snap => renderMessages(snap.docs.map(d => d.data())));
  };

  const ensureThread = async (id, displayName) => {
    const ref = firebase.firestore().collection('threads').doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({
        username: displayName, topic,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await ref.set({ topic, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    }
  };

  const open = t => {
    topic = t || 'general';
    identifyErr.textContent = '';
    threadErr.textContent = '';
    usernameInput.value = '';
    textInput.value = '';
    backdrop.classList.add('show');

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      openThread(saved);
      if (window.firebaseConfigured) ensureThread(saved, saved);
    } else {
      showStep(stepIdentify);
    }
  };

  const close = () => {
    backdrop.classList.remove('show');
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  };

  document.querySelectorAll('[data-chat-open]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.chatTopic));
  });
  document.getElementById('chatClose').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  document.getElementById('chatUsernameNext').addEventListener('click', async () => {
    const raw = usernameInput.value.trim();
    const id = slugify(raw);
    if (!id) { identifyErr.textContent = 'enter a username'; return; }
    if (!window.firebaseConfigured) { identifyErr.textContent = 'chat is not configured on this site yet'; return; }
    identifyErr.textContent = 'connecting…';
    try {
      await ensureThread(id, raw);
      localStorage.setItem(STORAGE_KEY, id);
      identifyErr.textContent = '';
      openThread(id);
    } catch (err) {
      identifyErr.textContent = `could not connect — ${err.message}`;
    }
  });

  document.getElementById('chatSwitchUser').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    usernameInput.value = '';
    identifyErr.textContent = '';
    showStep(stepIdentify);
  });

  document.getElementById('chatSendBtn').addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text || !threadId) return;
    if (!window.firebaseConfigured) { threadErr.textContent = 'chat is not configured on this site yet'; return; }
    threadErr.textContent = '';
    textInput.value = '';
    try {
      const ref = firebase.firestore().collection('threads').doc(threadId);
      await ref.collection('messages').add({
        sender: 'user', text, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await ref.set({ updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch (err) {
      threadErr.textContent = `could not send — ${err.message}`;
    }
  });

  textInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('chatSendBtn').click();
  });
})();
