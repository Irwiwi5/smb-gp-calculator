# Your Wireless — SMB GP Calculator (installable app)

This folder is a complete, self-contained web app. Once it's hosted at a URL,
your team can add it to their Android (or iPhone) home screen like a real
app — no app store, no $25 fee, no review process — and it keeps working
without internet after that first install.

## What's in this folder

- `index.html` — the app itself
- `styles.css`, `app.js` — its styling and logic
- `manifest.webmanifest` — tells phones how to install it (name, icon, colors)
- `service-worker.js` — makes it work offline and handles update checks
- `catalog.json` — **the live price list.** Edit this file and republish to
  push new GP numbers to every phone that has the app installed — no
  reinstall needed.
- `icons/` — app icons (home screen, browser tab)

## One-time setup: publish it with GitHub Pages (free)

You only need to do this once. Takes about 10 minutes.

1. **Create a free GitHub account** at github.com, if you don't have one.
2. **Create a new repository.** Click the `+` in the top right → "New
   repository." Name it something like `smb-gp-calculator`. Keep it Public.
   Don't add a README (you already have one).
3. **Upload these files.** On the new repo's page, click "uploading an
   existing file," then drag in every file and folder from this package
   (`index.html`, `styles.css`, `app.js`, `manifest.webmanifest`,
   `service-worker.js`, `catalog.json`, and the whole `icons` folder).
   Commit the upload.
4. **Turn on GitHub Pages.** In the repo, go to Settings → Pages. Under
   "Build and deployment," set Source to "Deploy from a branch," Branch to
   `main` and folder to `/ (root)`. Save.
5. **Wait ~1 minute**, then refresh that Pages settings screen — it will
   show your live URL, something like:
   `https://yourusername.github.io/smb-gp-calculator/`
6. Open that URL. The calculator should load exactly like the file you've
   already been using.

That URL is what you share with your team (text it, email it, put it on a
team chat pin, QR code it, whatever's easiest).

## Installing it on a phone (for your team)

**Android (Chrome):**
1. Open the URL above in Chrome.
2. Tap the **⋮** menu → **"Install app"** (or you may see a banner at the
   top of the app itself — tap **Install** there instead).
3. It now sits on the home screen with its own icon, opens full-screen with
   no browser bar, and works without signal once it's been opened once.

**iPhone (Safari):**
1. Open the URL in Safari.
2. Tap the Share icon (square with an arrow) → **"Add to Home Screen"**.
3. Same result — full-screen app icon, works offline.

## Pushing price updates later (the "future-proof" part)

When Exhibit B changes, or you want to add/reprice an item for the whole
team at once:

1. Open `catalog.json` in the GitHub repo (click the file, then the pencil/
   edit icon).
2. Edit the numbers, names, or categories you need to change. **Don't**
   remove or change the `"key"` value on an existing item — that's the ID
   the app uses to match it up and update it correctly on everyone's phone.
   To retire an item, just leave it in place with the right info (there's
   no real downside to leaving old items), or delete it if you're sure no
   one needs it anymore.
3. To add a brand-new item, copy an existing block inside `"items"`, give
   it a new unique `"key"` (anything, as long as no other item uses it),
   and fill in `name`, `category`, `payout`, `type` (`"line"` or
   `"account"`), and `notes`.
4. **Bump the `"version"` field at the top** (e.g. `"2026.11.13.1"` →
   `"2026.11.20.1"`) and update `"updated"` to today's date. The app only
   re-syncs when it sees a version number different from the one it last
   saved — this is what actually triggers the update on phones.
5. Commit the change (GitHub will prompt you for a commit message — anything
   like "November price update" is fine).
6. Done. Every phone with the app installed will pick up the new numbers
   automatically the next time it has an internet connection and is opened
   (usually within a few seconds) — no reinstalling, no new link to send
   out. Reps can also force an immediate check with the **"🔄 Check for
   Price List Updates"** button inside the catalog editor (tap "Edit
   Catalog: On" first).

### How the update logic protects reps' own customizations

Any item a rep adds themselves in the in-app catalog editor has no `key`,
so a `catalog.json` update will never touch, overwrite, or delete it. Your
pushed updates only ever add new official items or correct the price/name/
category of existing official ones (matched by `key`) — a rep's personal
additions and their current deal-in-progress are always left alone.

## If you'd rather not use GitHub Pages

The app still works perfectly as a single installed app without any of
this — it just won't auto-update. Your team can install it from any URL
you host it at (your company website, SharePoint, etc. all work the same
way, as long as all these files stay together in one folder), or you can
keep using the manual **Export/Import Catalog** buttons already in the
admin panel to hand-deliver price list files the same way you were before.
Just say the word if you'd like help wiring this up to your company's
existing site or SharePoint instead of GitHub Pages — same files, different
address.
