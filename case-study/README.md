# Advertise with Koko, a product design case study

Open **`index.html`** in any browser. One self-contained file, no server,
no build step, no internet needed apart from web fonts.

## What is in here

| File | What it is |
|---|---|
| `index.html` | The case study. Standalone, all images inlined. Host it or attach it to an application |
| `artifact.html` | Same page, body only, for hosts that supply their own `<head>` |
| `TEMPLATE-GUIDE.md` | How the case study is structured, so you can build the next one |
| `src/index.template.html` | The source. Edit this, never `index.html` |
| `shots/` | 26 screens captured from the working prototype |
| `build.mjs` | Inlines the screenshots and writes both outputs |

## Editing it

Edit `src/index.template.html`, then from this folder:

```bash
node build.mjs
```

That rewrites `index.html` and `artifact.html`. It fails loudly if a
`{{shot:name}}` has no matching file in `shots/`.

## Before you send this to anyone

Everything a reader takes as evidence lives in one `CASE_DATA` block at the
top of the script in `src/index.template.html`. Nothing else needs editing.

1. **`author`** is `[Your name]` / Senior Product Designer. Replace it.
2. **`research.themes` and `research.quotes`** are placeholders shaped to
   the study design (20 merchants: 5 key accounts, 15 smaller merchants).
   Replace with your real synthesis.
3. **`validation`** session count, completion, median time and the findings
   table are placeholders. Replace with your real session notes.
4. **`inventory`** is the prototype's rate card, used for the revenue model.
   Adjust if the agreed numbers differ.

The page is written to stay honest with placeholders in it: nothing
simulated is presented as measured. But a hiring manager will ask about the
numbers, so they need to be yours.

## Fonts

Headings use Myriad Pro, body uses Book Antiqua. Neither is a web font.
Myriad Pro ships with Adobe apps and most Macs; Book Antiqua ships with
Windows and Office. Where they are not installed the page falls back to PT
Sans and PT Serif from Google Fonts. Worth opening once on a machine
without them to check you are happy with the fallback.

## The prototype

The screens are captured from a working prototype, not mockups. Its source
is the parent repository; see `docs/ARCHITECTURE.md` there for how the
pricing engine, availability rules and funnel are built.
