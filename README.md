# restaurant-web-app

Modern, responsive restaurant website for showcasing menus, catering services, reviews, gallery, opening hours, and contact information.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm test
npm run build
npm run test:browser:install
npm run test:browser
```

## Deployment

The site is configured for GitHub Pages and currently uses the repository base path:

`/-restaurant-web-app/`

After merging to `main`, the GitHub Pages workflow builds `dist` and deploys it through GitHub Actions. In repository **Settings → Pages**, set the deployment source to **GitHub Actions**.

See `FEATURES.md` for the product roadmap and `AGENTS.md` for engineering standards.
