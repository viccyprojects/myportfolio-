# V·SYS Portfolio — Public Site

The public-facing site. No framework, no build step — plain HTML/CSS/JS,
deployable as-is to Vercel, Netlify, GitHub Pages, or any static host.

This is one of two repos. The admin editor (`admin.html`) deploys
separately — see the `vsys-admin` package. The two are independent:
this site reads data from Firestore, the admin panel writes it. Neither
needs the other's source code to run.

## Structure

```
index.html      Home / hero (editable profile: name, role, bio, photo)
system.html     Skills / capability diagnostics
logs.html       Projects ("mission log")
collab.html     Collaboration channel + chat widget
contact.html    Contact info + chat widget

assets/
  style.css           shared HUD styling for every page
  hud.js              boot sequence, clock, cursor reticle, nav highlighting
  util.js             shared escapeHtml helper
  firebase-config.js  your Firebase web config
  profile.js          loads the editable profile onto index.html
  projects.js         loads project cards onto logs.html
  chat.js             the username-linked chat widget (collab.html, contact.html)
```

## Deploying

Upload this whole folder as-is. `index.html` is the homepage; every other
page is a real, separate URL (`/system.html`, `/logs.html`, etc.), linked
from the nav on the right.

## Firebase

This site only *reads* from Firestore (`config/profile`, `config/projects`,
`threads/*`) — it never writes without a signed-in admin, which lives in
the other repo. The security rules that enforce this are shared
infrastructure, not part of either codebase — see `firestore.rules` in
the `vsys-admin` package, and paste it into Firebase Console → Firestore
→ Rules once, regardless of which repo you're looking at.

## Chat, honestly

The chat widget identifies people by a self-chosen username, not a
password. That's enough to let someone pick up a conversation on a new
device, but it also means anyone who knows or guesses a username could
open that same thread. Fine for a low-stakes portfolio contact channel —
just don't reuse this pattern anywhere sensitive.
