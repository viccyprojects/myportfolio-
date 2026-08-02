(() => {
  'use strict';

  const nameEl = document.getElementById('heroName');
  const roleEl = document.getElementById('heroRole');
  const bioEl = document.getElementById('heroBio');
  const photoEl = document.getElementById('heroPhoto');
  const photoFallback = document.getElementById('heroPhotoFallback');

  photoEl.addEventListener('load', () => { photoFallback.style.display = 'none'; });
  photoEl.addEventListener('error', () => { photoEl.removeAttribute('src'); photoFallback.style.display = 'flex'; });

  const apply = profile => {
    if (profile.name) nameEl.textContent = profile.name;
    if (profile.role) roleEl.textContent = profile.role;
    if (profile.bio) bioEl.textContent = profile.bio;
    if (profile.photoUrl) photoEl.src = profile.photoUrl;
  };

  const load = async () => {
    if (!window.firebaseConfigured) return;
    try {
      const doc = await firebase.firestore().collection('config').doc('profile').get();
      if (doc.exists) apply(doc.data());
    } catch (err) {}
  };

  load();
})();
