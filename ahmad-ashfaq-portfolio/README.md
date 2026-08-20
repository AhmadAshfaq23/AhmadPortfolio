# Ahmad Ashfaq — Portfolio Site

A premium, dark-luxury portfolio with 3D animated visuals (three.js), a
filterable project showcase, and a real admin panel for adding/editing
projects and profile content — no code required after setup.

No build tools, no framework, no paid hosting. Pure HTML/CSS/JS, deployable
to Netlify's free tier with a free custom subdomain.

---

## 1. What's in this folder

```
index.html          → the site itself
css/style.css        → all styling (design tokens at the top)
js/three-hero.js     → the 3D hero + about-section visuals
js/main.js           → nav, filters, tilt effects, form handling, content loader
data/profile.json    → your bio, stats, services, testimonials, socials
data/projects.json   → your portfolio items (this is what the admin panel edits)
admin/index.html     → the admin panel login screen
admin/config.yml     → tells the admin panel what fields to show
assets/uploads/      → images (currently placeholder SVGs — swap these out)
netlify.toml         → Netlify configuration
```

**Everything on the page — your name, bio, stats, services, testimonials,
and every project card — is pulled live from `data/profile.json` and
`data/projects.json`.** Edit those two files (by hand, or through the admin
panel below) and the site updates. You never need to touch the HTML/CSS.

---

## 2. Deploy to Netlify (free) — first time

1. Create a free account at [netlify.com](https://www.netlify.com) if you
   don't have one.
2. **Put this folder in a GitHub repository.** This is required for the
   admin panel to work (it needs somewhere to save your edits). If you
   don't already use GitHub:
   - Create a free account at [github.com](https://github.com)
   - Create a new repository (e.g. `ahmad-portfolio`)
   - Upload all the files in this folder to it (GitHub's web uploader
     works fine — drag the whole folder in)
3. In Netlify: **Add new site → Import an existing project → connect to
   GitHub → pick your repository.**
4. Leave the build settings as detected (publish directory `.`, no build
   command needed) and click **Deploy**.
5. Your site is now live at a URL like `random-name-123.netlify.app`.

### Rename your free subdomain
In Netlify: **Site configuration → Change site name** → pick something like
`ahmadashfaq.netlify.app`. This is free and gives you a clean link to put
on your Fiverr profile immediately.

### Connect a real custom domain (optional, later)
If you buy a domain (e.g. from Namecheap or Google Domains), go to
**Site configuration → Domain management → Add a custom domain** and
follow Netlify's DNS instructions. This part isn't free (domains cost
money yearly) but Netlify's hosting stays free either way.

---

## 3. Turn on the admin panel

The admin panel lives at `yoursite.netlify.app/admin/` and lets you log in
and add/edit projects and profile info from a normal web page — no code.

To activate it (one-time setup, ~5 minutes):

1. In your Netlify site dashboard, go to **Site configuration → Identity**
   and click **Enable Identity**.
2. Under Identity settings, set **Registration** to **Invite only**
   (so random people can't sign up).
3. Go to **Identity → Services** and click **Enable Git Gateway**. This
   lets the admin panel save changes back to your GitHub repo for you.
4. Go to the **Identity** tab and click **Invite users** — invite your own
   email address.
5. Check your email, click the invite link, and set a password.
6. Visit `yoursite.netlify.app/admin/` and log in.

You'll see two sections:
- **Profile & Site Content** — your name, bio, stats, services,
  testimonials, and social links.
- **Portfolio Projects** — add, edit, reorder, or delete project cards.
  Each one has a title, category (Website / Video / Podcast / Reel / Ad),
  description, thumbnail image upload, optional link, and tags.

Every save creates a commit in your GitHub repo, and Netlify automatically
rebuilds and republishes the live site within about a minute.

---

## 4. Replace the placeholder images

Right now the profile photo and project thumbnails are elegant placeholder
graphics labeled "REPLACE." Swap them either:
- **Through the admin panel** — open a project or your profile, and
  upload a new image directly in the image field, or
- **Manually** — replace the files in `assets/uploads/` with your own
  photo/thumbnails using the same filenames (or upload new ones and update
  the path in `data/profile.json` / `data/projects.json`).

For best results: profile photo roughly 3:4 portrait, project thumbnails
roughly 8:5 landscape (or close — they'll crop to fit).

---

## 5. The contact form

The contact form on the site uses **Netlify Forms**, which is free up to
100 submissions/month. Once deployed, submissions will appear under
**Site configuration → Forms** in your Netlify dashboard, and you can turn
on email notifications there so you get pinged the moment someone reaches
out.

---

## 6. Making direct edits without the admin panel

If you ever want to hand-edit content:
- Open `data/profile.json` or `data/projects.json` in any text editor
- Keep the same structure (matching quotes, commas, brackets)
- Save, then upload the changed file to your GitHub repo (or push a commit
  if you're using git locally) — Netlify rebuilds automatically

---

## 7. Local preview before deploying (optional)

You don't need this to deploy, but if you want to preview changes on your
own computer first: open a terminal in this folder and run any simple
static server, e.g. `python3 -m http.server 8080`, then visit
`http://localhost:8080` in your browser.
