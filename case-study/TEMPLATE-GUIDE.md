# Case study template guide

How this case study is built, so you can produce the next one without
starting from a blank page. Everything here describes decisions you can
copy: what each section is for, what belongs in it, and which components
carry which kind of content.

The short version: **eleven sections in a fixed order, each opening with a
one-line takeaway, with every claim a reader might act on kept in one data
block at the bottom of the file.**

---

## 1. The structure

Eleven sections, numbered 00 to 10. The order is not arbitrary. It answers
the questions a hiring manager asks in the order they ask them.

| # | Section | The question it answers | Words |
|---|---------|------------------------|-------|
| 00 | In brief | Should I keep reading? | 250 to 400 |
| 01 | Context | What was the situation? | 300 to 450 |
| 02 | Research | How do you know what users need? | 400 to 600 |
| 03 | Framing | Did you solve the right problem? | 250 to 400 |
| 04 | Principles | Do you have a point of view? | 150 to 250 |
| 05 | Decision logic | Can you handle complexity? | 300 plus the map |
| 06 | The product | What did you actually make? | 700 to 1,000 |
| 07 | Validation | Did you test it? | 250 to 400 |
| 08 | Impact | Do you understand the business? | 300 to 450 |
| 09 | The build | What was the craft level? | 200 to 300 |
| 10 | Learnings | Are you honest and self-aware? | 200 to 300 |

Total prose sits around 3,500 to 4,500 words, which reads in 12 to 15
minutes at 300 words a minute. Past 5,000 words the reading-time counter
starts to look like a warning rather than an invitation.

### What goes in each

**00 In brief.** The whole case study compressed. A device collage of the
real product, three cards (the problem, your role, what changed), the
core flow as numbered chips, one design decision that shows judgement, the
tools and research methods, and the timeline in days. If someone reads
only this section they should be able to describe your work to a colleague.

**01 Context.** The situation before you. What the business needed, what
users lacked, and the one constraint that shaped everything. End on a
callout with that constraint, so it echoes through the rest of the page.

**02 Research.** Method, sample, and what you found. Lead with the finding
that surprised you, not the one that confirmed the brief. Include the
decision about *who* you designed for, because choosing a user is a
senior act. Close with a table mapping each insight to the thing it
changed. That table is the single most persuasive object in the section.

**03 Framing.** The problem in one sentence, set in a dark panel so it
reads as a thesis. Then the constraints you designed inside, and how you
defined success before you started. Defining success up front is what
separates a designer from a decorator.

**04 Principles.** Three or four rules you held yourself to, each traceable
to a research finding and visible on every screen. Keep them short. A
principle that needs a paragraph is not a principle.

**05 Decision logic.** The flow, as an interactive map. Every node carries
the rule and the reason for the rule. This section is where you prove you
can hold a system in your head. See section 4 below for how it is built.

**06 The product.** Walk the flow. For each step: a working simulation or a
screenshot, then two or three "why" notes, then a decision card wherever a
real call was made. Do not narrate the interface. Explain the choices.

**07 Validation.** What you tested, how many people, what they did, and what
changed as a result. Small samples are fine if you say so. A table of
"observed / round / what changed" is worth more than a paragraph of
reassurance.

**08 Impact.** The business model in numbers you can defend. If you have
real metrics, lead with them. If you do not, model the opportunity from
inputs you can name, state the assumptions, and list what you would
measure after launch. Never invent outcomes.

**09 The build.** Craft evidence. Accessibility, testing, handoff, what is
real versus mocked. Keep it to cards; nobody reads prose here.

**10 Learnings.** What you would tell yourself at the start. Include at
least one thing you got wrong. A case study with no mistakes reads as
marketing.

---

## 2. The rules that keep it credible

These matter more than the visual design.

**Every section opens with a takeaway.** One italic line under the heading
that states the conclusion. A reader who skims only these lines gets the
whole argument. Write the takeaway first, then the section.

**Nothing simulated is presented as measured.** Placeholder figures are
labelled as placeholders, in the copy, not just in a comment. If a number
is a prototype stand-in for something a real service would provide, say so
where it appears.

**Decision cards mark real decisions only.** The bordered card with the
"Design decision" label is the loudest object on the page. Use it where a
genuine call was made with an alternative rejected. Sixteen across this
page is about the ceiling. Thirty would make it wallpaper.

**Rejected options are shown, not implied.** The strongest decision cards
carry a red "rejected" panel beside the green "shipped" one. Showing the
path not taken is what makes the taken path look considered.

**Value before price, everywhere.** The product principle applies to the
case study too: show what the work achieved before explaining how clever it
was.

**No dashes.** Em and en dashes are replaced with commas, "to" for ranges,
or full stops. It is a house style choice; keep it consistent or drop it
entirely, but do not do it halfway.

---

## 3. The file structure

```
case-study/
  src/index.template.html   the source. Edit this, never index.html
  shots/                    screenshots, one .jpg per {{shot:name}}
  build.mjs                 inlines shots as base64, writes the outputs
  index.html                standalone, self-contained. Host or attach
  artifact.html             body-only, for hosts that supply <head>
```

`npm run` is not needed. `node build.mjs` from the case-study folder.

### How images work

The template contains `{{shot:03-landing-selected}}`. The build script
finds `shots/03-landing-selected.jpg` and inlines it as a base64 data URI.
One self-contained file, no broken image paths, no asset hosting.

To add a screenshot: drop `shots/my-screen.jpg` in the folder and write
`{{shot:my-screen}}` in the template. The build fails loudly if a named
shot is missing, which is what you want.

Capture screenshots at 1200px wide, JPEG quality 82. The whole page should
stay under about 2 MB; past that, email attachments start bouncing.

---

## 4. The components

Copy these from `src/index.template.html`. Each one has a job.

### Section head

```html
<div class="section-head">
  <div class="idx">02</div>
  <div>
    <h2>Research</h2>
    <p class="takeaway">The one-line conclusion of this section.</p>
  </div>
</div>
```

### Design decision card

The signature component. Use it where you made a call.

```html
<div class="decision">
  <span class="eyebrow">Design decision</span>
  <h3>The decision, stated as what you did</h3>
  <p>Why the obvious approach fails, in concrete terms.</p>
  <p>Why this approach works instead.</p>
  <div class="vs">
    <div class="rej"><b>Rejected</b>What it was and what broke.</div>
    <div class="acc"><b>Shipped</b>What you did and why it holds.</div>
  </div>
</div>
```

The `.vs` block is optional. Use it when there was a genuine fork.

### Why note

Lighter than a decision card. For explaining a detail.

```html
<div class="why">
  <div class="dot">1</div>
  <div><b>The point, in a short sentence.</b>The explanation, two or
  three lines, citing the research finding behind it.</div>
</div>
```

### Progressive disclosure

For the second half of a long section. Keeps the page scannable without
cutting content.

```html
<details class="more">
  <summary><span class="closed">Read the full brief</span><span class="opened">Show less</span></summary>
  <p class="detail">...</p>
</details>
```

### Device frames

```html
<figure class="laptop">
  <div class="screen"><img src="{{shot:name}}" alt="..." /></div>
  <div class="base"></div>
  <figcaption>What this screen is.</figcaption>
</figure>

<figure class="phone-frame"><div class="pscreen"><img src="{{shot:name}}" alt="..." /></div></figure>
```

The hero collage (`.collage`) positions two laptops and two phones
absolutely. It reflows to a stack at phone width. If your product is
mobile only, drop the laptops and set three phones side by side.

### Other pieces

| Class | Use |
|-------|-----|
| `.card` | A block of related content. `.card.dark` inverts it |
| `.card.brand` | Tinted, for the insight-to-design table |
| `.problem-stmt` | The dark thesis panel in Framing |
| `.constraints` | Illustration beside a list |
| `.stepchips` | A numbered flow as inline chips |
| `.timeline` | The project schedule, three per row |
| `.tools` | Pills for tools and methods |
| `.metric-row` / `.metric` | Headline figures. `.hl` inverts one |
| `.quote` | A research quote, no attribution |
| `.bar` | A horizontal count bar for interview themes |
| `.tbl-wrap` + `.tbl` | Any table. Scrolls horizontally on mobile |
| `.callout` | A single emphasised sentence with a left rule |
| `.eyebrow` | Small uppercase label above anything |
| `mark` / `strong` | Highlight and bold inside heavy prose |

---

## 5. The decision map

The most reusable part of this case study. It renders from a data array,
so adding a step is one object, not a block of markup.

```js
const FLOW = [
  {
    id: "unique-id",
    kind: "step",              // "step" or "decision"
    title: "A full sentence about what happens",
    sub: "The concrete detail underneath",
    branches: [["Outcome", "y"], ["Blocked", "n"], ["Neutral", ""]],
    tags: ["Label"],
    rule: "What the system does, precisely.",
    why: "Why it works that way, citing research or a constraint.",
  },
];
```

`kind: "step"` renders a numbered black circle. `kind: "decision"` renders
a purple diamond. Steps are numbered automatically; decisions are not.
`branches` only applies to decisions. Tone is `"y"` for green, `"n"` for
red, `""` for neutral.

Two things to watch:

- **Node classes are `mstep` and `sysdec`, not `step` and `decision`.**
  Both of those collide with other components on the page (`.step` is the
  numbered list in Framing, `.decision` is the decision card). A collision
  there produces overlapping borders and broken connector lines.
- The connector is one line per node with a halo on the pin cutting
  through it. If you change pin size, change the halo to match or the line
  will appear to touch the markers.

---

## 6. The interactive simulations

Six of them, in section 06. They are plain JavaScript with no libraries,
each self-contained in one IIFE block at the bottom of the file.

They exist because a hiring manager who *tries* the calendar understands
the pricing rules in ten seconds. The same explanation in prose takes a
paragraph they will skim.

Build a simulation when the interaction is the design decision. Do not
build one to show a form filling in. The rule of thumb: if the simulation
does not teach something a screenshot cannot, use the screenshot.

Each follows the same shell:

```html
<div class="sim" id="sim-name">
  <div class="sim-head"><span class="live">Live simulation</span><span>Context</span></div>
  <div class="sim-body"><!-- the interactive bit --></div>
  <div class="sim-note">What to try, and what rule it demonstrates.</div>
</div>
```

Keep the simulation's rules identical to the real product's, or do not
claim it is a simulation. The calendar here uses the same lead time,
occupancy, weekend uplift and upsell suppression as the shipped code.

---

## 7. The data block

Everything a reader treats as evidence lives in `CASE_DATA` at the top of
the script tag. Nothing else on the page needs editing to swap in a new
study's numbers.

```js
const CASE_DATA = {
  author: { name: "...", title: "..." },
  research: { total: 20, themes: [...], quotes: [...] },
  validation: { sessions: 6, completed: 6, medianMinutes: "4:10", rounds: 2, findings: [...] },
  inventory: [...],   // whatever your impact model needs
};
```

This is a deliberate separation. Claims live in one place so they can be
checked, updated, or challenged without touching layout. When you write
the next case study, fill this block first and the page will populate
itself.

---

## 8. Typography and colour

```css
--serif: "Myriad Pro", ...     headings and UI
--sans: "Book Antiqua", ...    body copy
--ink: #0f1116                 near-black text
--brand: #bddcee               the product's accent
--brand-ink: #1f5f7a           accent, dark enough for text
--green / --amber / --red      semantic only, never decorative
```

The palette is the product's own, which is what makes the page feel like
the same hand made both. When you write a case study for a different
product, take that product's accent and rebuild these five values around
it. Do not reuse this blue.

Two rules that keep it legible:

- The page declares `color-scheme: light`. Without it, a viewer in dark
  mode gets white button text on the light page, which silently blanks
  labels inside every interactive component.
- Semantic colours carry meaning only. Green is "this was chosen or it
  worked", red is "this was rejected or blocked", amber is "attention".
  Never use them to decorate.

---

## 9. Writing the next one

In order:

1. **Fill `CASE_DATA` first.** Your real numbers, quotes and findings. If a
   number does not exist, leave the placeholder and mark it.
2. **Write the eleven takeaways.** One line per section. If the sequence of
   takeaways does not tell the story on its own, the structure is wrong and
   no amount of prose will fix it.
3. **Capture the screenshots.** Name them `NN-what-it-is.jpg` so they sort
   in flow order.
4. **Write section 00 last.** It is a summary; you cannot summarise what you
   have not written.
5. **Place decision cards deliberately.** Go through the draft and mark
   every real fork. If you find fewer than five, the case study is a
   walkthrough rather than an argument, and hiring managers can tell.
6. **Check the reading time.** The counter is in the rail. Over 15 minutes,
   cut, do not hide.

### Before publishing

- Replace every placeholder and remove the labels that flag them
- Your name and title in the footer
- Open it in a browser set to dark mode, and at 390px wide
- Click every simulation and every decision node
- Read the takeaways alone, top to bottom, and check they hold together
