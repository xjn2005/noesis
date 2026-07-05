# Noesis

Noesis is a public knowledge site built with Quartz and synced from Obsidian.

Site: https://xjn2005.github.io/noesis/

## Workflow

In Obsidian, put publishable notes under `public/` and add:

```yml
---
publish: true
draft: false
---
```

```bash
npm run sync:obsidian -- --vault "D:\OneDrive\OneDrive\文档\Obsidian Vault"
npm run quartz -- build --serve
```

Deploy happens automatically from `main` via GitHub Pages.

```bash
git add -A
git commit -m "Update Noesis content"
git push
```
