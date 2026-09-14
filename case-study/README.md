# Case study

A standalone, self-contained web page: `index.html`. Host it anywhere or attach it as-is.

- `src/index.template.html` — the source. Edit this, not `index.html`.
- `shots/` — screens captured from the running prototype (`../src`), embedded at build.
- `build.mjs` — inlines the screenshots and writes `index.html` (standalone) and `artifact.html` (body-only, for hosts that supply their own document skeleton).

```bash
node case-study/build.mjs
```

## Before publishing

Open `src/index.template.html` and find `CASE_DATA` at the top of the script. Everything a reader takes as evidence lives there and nowhere else:

- `author` — your name and title (currently a placeholder).
- `research.themes` and `research.quotes` — the counts and quotes are **placeholders** shaped to the study you described (20 merchants: 5 key accounts, 15 long tail). Replace them with your real synthesis.
- `validation` — session count, completion, median time and the findings table are **placeholders**. Replace with your real session notes.
- `inventory` — the prototype's rate card, used for the revenue model. Adjust if the agreed numbers differ.

Rebuild after editing. Nothing else on the page needs to change.
