# GridDB v2 Docs

VitePress site that builds and deploys to Azure Static Web Apps at **https://docs.griddb.net**.

## Quick start

```bash
npm install
npm run docs:dev     # http://localhost:5173
npm run docs:build   # outputs to .vitepress/dist
npm run docs:preview # serve the built output locally
```

## Repo layout

```
.
├── .github/workflows/
│   └── azure-static-web-apps.yml   # CI/CD, runs on push to main
├── .vitepress/
│   ├── config.js                   # site title, nav, sidebar, <head> tags
│   └── dist/                       # build output (gitignored)
├── staticwebapp.config.json        # Azure SWA routes + headers
├── swa-cli.config.json             # local SWA CLI config only, not used by CI
└── *.md                            # the actual docs pages
```

## Deploying

Push to `main`. That's it. The GitHub Action builds and uploads to SWA.

PRs against `main` get a preview environment automatically, and it's torn down when the PR closes.

Key values in the workflow:

| Setting | Value |
|---|---|
| `app_location` | `./` |
| `output_location` | `.vitepress/dist` |
| `api_location` | (empty, no API) |

There's no manual `swa deploy` step. `swa-cli.config.json` exists for running the SWA emulator locally if you ever want it, but CI ignores it.

## Adding or editing a page

1. Create/edit the `.md` file.
2. Add it to the sidebar in `.vitepress/config.js` if it should show up in nav.
3. Push to `main`.

Frontmatter at the top of a page sets things like the next-page link:

```yaml
---
next:
  text: 'How to Get Started'
  link: '/gettingstarted/Overview'
---
```

## Gotchas (read this before debugging)

### Headers live in `staticwebapp.config.json`, at the repo root

Because `app_location` is `./`, Azure reads the config from the repo root. You do **not** need to move it into `public/` or into the dist folder.

Current contents:

```json
{
  "globalHeaders": {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
}
```

Verify a deploy actually applied them:

```bash
curl -sI https://docs.griddb.net | grep -iE 'referrer|strict-transport'
```

### YouTube embeds and the Referrer-Policy trap

Azure SWA defaults `Referrer-Policy` to `same-origin`, which sends **no** `Referer` header cross-origin. YouTube rejects the embed and the player shows **Error 153**.

This only breaks on the deployed site. Localhost works fine, which makes it very confusing.

The `Referrer-Policy: strict-origin-when-cross-origin` line above fixes it globally. Any other cross-origin embed (CodePen, Twitter, etc) would hit the same wall, so leave it in.

Iframes should also carry the policy directly as a backup, since element-level policy beats the document default:

```html
<p class="iframe-container">
<iframe src="https://www.youtube.com/embed/VIDEO_ID?feature=oembed"
        referrerpolicy="strict-origin-when-cross-origin"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
</p>
```

### Diagnosing a broken video

Check whether embedding is allowed on YouTube's side before touching any config:

```bash
curl -i "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

- **200 + JSON** means embedding is permitted, so the problem is on our end (headers, CSP, ad blocker).
- **401/403** means embedding is disabled on the video itself. That needs someone with access to the GridDB YouTube channel to tick **Allow embedding** in YouTube Studio.

Also rule out: ad blockers and DNS-level blockers throw in-player errors that look identical to config problems. Test in incognito with extensions off.

### Raw HTML in markdown is compiled as a Vue template

VitePress runs `.md` files through Vue. Inline HTML mostly just works, but keep attributes lowercase (`referrerpolicy`, not `referrerPolicy`) or they get dropped.

If you ever need the YouTube player API (autoplay control, events), build a proper component in `.vitepress/theme/components/` instead of inlining it.

### Config file naming

Two similarly-named files, very different jobs:

- `staticwebapp.config.json` -> Azure platform config (routes, headers). **This is the one that matters.**
- `swa-cli.config.json` -> local CLI tooling only. Not read by Azure.

## Analytics

Google Analytics (`G-TW3T98KWKM`) is wired up via the `head` array in `.vitepress/config.js`.
