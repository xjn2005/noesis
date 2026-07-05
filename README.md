# Noesis

Noesis is my public knowledge site built with Quartz and synced from an Obsidian vault.

The source notes live in Obsidian. Only notes marked for publishing are copied into this repository and deployed to GitHub Pages.

## Writing Flow

Use these folders in the Obsidian vault:

- `public/`: notes that can be published
- `private/`: private notes, never synced
- `drafts/`: draft notes, never synced

Add this frontmatter to every note that should appear on the site:

```yaml
---
publish: true
draft: false
---
```

## Sync Notes

From this repository:

```bash
npm run sync:obsidian -- --vault "D:\OneDrive\OneDrive\文档\Obsidian Vault"
```

Synced notes are copied into `content/public`.

## Local Preview

```bash
npm run quartz -- build --serve
```

Then open:

```text
http://localhost:8080
```

## Deploy

GitHub Pages deploys automatically from the `main` branch.

Push changes with:

```bash
git add -A
git commit -m "Update Noesis content"
git push
```

The deployed site is:

```text
https://xjn2005.github.io/noesis/
```
