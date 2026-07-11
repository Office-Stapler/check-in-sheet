# Check-in sheet

A small React app for building printable A4 sign-in sheets (e.g. event or assembly attendance).

Edit the title and roster, sort names (Chinese first, English first, or original order), tweak blank pages and rows on the sheet, then print or save as PDF from the browser.

**Live:** [office-stapler.github.io/check-in-sheet](https://office-stapler.github.io/check-in-sheet/)

## Features

- **Sheet** — A4 preview of the check-in table (name, phone column, mark columns)
- **Sheet data** — edit title and names (one name per line)
- Sort by language script; insert / remove / rename rows on the sheet
- Extra blank pages for walk-ins
- Print / Save PDF with A4 page breaks (`ROWS_PER_PAGE` and A4 size in `src/data/page.ts`)
- Roster and settings persist in `localStorage`
- Undo toast when deleting a row

## Setup

```bash
yarn
yarn dev
```

| Script        | Description              |
| ------------- | ------------------------ |
| `yarn dev`    | Start the Vite dev server |
| `yarn build`  | Typecheck and production build |
| `yarn preview`| Preview the production build |
| `yarn lint`   | Run ESLint               |
| `yarn lint:fix` | Auto-fix lint issues |

## Deploy (GitHub Pages)

Pushes to `main` build and deploy via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

One-time repo setup:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions
2. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually)

The Vite `base` is `/check-in-sheet/` to match this repository name.

## Stack

React 19, TypeScript, Vite, React Compiler.
