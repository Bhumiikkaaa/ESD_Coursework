# E-commerce Lab: HTML & CSS Best Practices

You will build an Amazon-style homepage in two files:

- `ecommerce_assignment.html`
- `style_ecommerce_assignment.css`

The page has **6 sections worth 10 marks each (60 total)**. You get the design (`final_expected_look.png`) for the
visuals and `design_spec.md` for the exact colours and sizes. **Pixel-perfect matching is not the
goal.** Most of your marks come from following the practices below: clean semantic HTML and CSS
that adapts to the screen instead of using hard-coded sizes.

---

## How each section is graded (10 marks)

| Part | Marks | What we check |
|---|---|---|
| HTML semantics & content | 3.0 | Right elements for the job, all required content present, no inline styles or `<br>` layout |
| Accessibility | 1.5 | Alt text, labelled form controls, named links/buttons, hidden decorative icons |
| CSS best practices | 3.0 | Flexbox/Grid, `gap`, no hard-coded sizes, `rem` units, colour tokens, clean selectors |
| Rendering & responsiveness | 1.5 | Section renders and nothing overflows the screen at 1440px, 768px and 390px widths |
| Visual fidelity | 1.0 | Colours from `design_spec.md` are used, and the section is roughly the designed size |

An empty section scores 0. A partly finished section gets proportionally fewer marks.

**Copy-pasting from outside is not allowed.** Type your code yourself. Code pasted from
anywhere outside your two lab files (websites, AI tools, other files, classmates) is recorded,
including what was pasted, and **reduces the marks** of the section it goes into. Copying and
pasting **within** your own two lab files (for example duplicating a card you wrote) is fine.

## Rules for the template

1. Build only inside the 6 marked sections.
2. Keep each section wrapper's `class` and `data-section="N"` attribute. You **may** change the
   wrapper's tag (for example `<div>` to `<nav>` or `<section>`) if a more semantic element fits.
3. Write all CSS in `style_ecommerce_assignment.css`, under the matching `SECTION N` banner.
   Do not use `<style>` tags or `style=""` attributes.
4. Keep the section comments (`/* SECTION 1 - ... */` etc.) in both files. The content each
   section needs is listed in `design_spec.md`.
5. **AI tools** may be used only to look up syntax (for example "how does `minmax()` work").
   Pasting the template, a section of it, or the task into an AI tool to generate your answer
   is not allowed. Whatever you learn, **type it yourself**: don't paste the answer in.

## Lab Activity Monitor (required)

Write your code in **VS Code**, with the lab folder opened via **File > Open Folder...**. When VS
Code asks, choose **Yes, I trust the authors**, then **Allow** for automatic tasks. The lab
setup then installs the monitor by itself (see `README.md`).

The status bar shows **Lab monitor** while it is recording. It watches **only**
`ecommerce_assignment.html` and `style_ecommerce_assignment.css`, and writes to
`lab_activity.log` in the same folder. It records:

- code pasted from outside your two lab files, including the pasted text and the section it
  went into (copies within your own files are noted as allowed)
- large blocks inserted by autocomplete or snippets
- how many characters you type per minute
- each save (a fingerprint of the file, not a copy)

Nothing is sent anywhere. Pastes from outside reduce your marks (see above).
The monitor **stops and uninstalls itself 24 hours after it first runs** and is not reinstalled.

**Rules:**
- Open the folder in VS Code with the extension installed **before** you start writing.
- Save your files in VS Code before you submit.
- Submit the **whole folder**, including `lab_activity.log`. Do not edit, delete or copy it.
- A missing or edited log, files changed outside VS Code, or work that was already there
  before the log started will all be reviewed by your instructor.

---

## 1. Semantic HTML

- Use the right landmark for each job: `<header>`, `<nav aria-label="...">`, `<main>`, `<footer>`.
  Group content in `<section>` and self-contained items, such as product cards, in `<article>`.
- Headings follow an outline (`<h2>` for card titles and footer column titles). Never choose a
  heading level for its size; style it with a class instead.
- Lists of links or items are `<ul>` / `<ol>` with `<li>` children. A `<ul>` may contain only
  `<li>`, never `<p>` or `<a>` directly.
- `<a href>` for anything that navigates; `<button>` for anything that acts. Never make a
  `<div>` clickable.
- The search bar is a `<form role="search">` with `<input type="search">`, a `<select>` and a
  submit `<button>`.
- **No `<br>` for layout.** Let text wrap inside a container of the right width.
- **No `style=""` attributes.** Content images are `<img>` elements, not CSS backgrounds.

## 2. Images

- Always set `width` and `height` attributes to the image file's real pixel size. This reserves
  space and stops the page from jumping while images load. CSS still controls the displayed size.
- Meaningful image: descriptive `alt`. Decorative image, or one whose meaning is already in a
  nearby text label: `alt=""`.
- Images below the first screen: `loading="lazy"`. The hero image: **not** lazy, and add
  `fetchpriority="high"`.
- Crop with `object-fit: cover` plus `aspect-ratio`, not by fixing width and height in px.

## 3. Accessibility

- Every `<input>` / `<select>` has a `<label for="...">` (it can be visually hidden with the
  `.visually-hidden` class). A placeholder is not a label.
- Icon-only links and buttons need `aria-label="..."`. The icon itself gets `aria-hidden="true"`.
- Repeated link text ("See more") gets context: `See more <span class="visually-hidden">clothes</span>`.
- Never remove focus outlines without replacing them. Style `:focus-visible`.
- Text contrast of at least 4.5:1.

## 4. Sizing: no hard-coded dimensions

This is the most important rule for the CSS marks. Let elements size from their content and
their container.

| Instead of | Do this |
|---|---|
| `width: 620px` on the search bar | `flex: 1; min-width: 0;` so it fills the remaining space |
| `width: 23%` plus margin maths for cards | `display: grid; grid-template-columns: repeat(auto-fill, minmax(...)); gap: ...` |
| `height: 400px` on a card or section | No height; let the content decide (use `min-height` only if really needed) |
| `height: 350px` banner | `height: clamp(13rem, 40vw, 37.5rem)` or `aspect-ratio` |
| `margin-left: 2rem` between siblings | `gap` on the flex or grid parent |
| `position: relative; left: 37px` to nudge | Fix the layout instead: `justify-content`, `margin-left: auto`, `gap` |
| `width: 1000px; margin: auto` | `width: min(100%, 62.5rem); margin-inline: auto;` |
| `font-size: 25px` | `rem` from your type scale |

- **Units:** `rem` for font sizes, spacing and breakpoints. `%`, `fr`, `vw`, `min()`, `max()`
  and `clamp()` for fluid sizes. Use `px` only for hairline borders (1px) and shadows.
- Fixed sizes are fine for things that really are fixed: icons, the logo width, button tap
  targets.
- Full-width background, limited-width content: the outer element spans 100%, and an inner
  wrapper sets `width: min(100%, var(--content-max))`.
- Add `min-width: 0` to flex or grid children that contain inputs or long content, so they can
  shrink.
- Never set a fixed `height` on something that contains text. It overflows when the text wraps
  or the user zooms in.

## 5. Layout patterns

- **Flexbox** for rows of items such as nav bars. Push an item to the far end with `margin-left: auto`.
- **Grid** for card collections and footer columns.
- Card grid with at most 4 columns and no media queries:
  ```css
  .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill,
          minmax(max(16rem, (100% - 3 * var(--gap)) / 4), 1fr));
      gap: var(--gap);
  }
  ```
- Sideways-scrolling row: `display: grid; grid-auto-flow: column; overflow-x: auto; scroll-snap-type: x mandatory;`
- Hover borders that don't shift the layout: `border: 1px solid transparent;` normally, and
  change only `border-color` on `:hover`.

## 6. Responsive design

- Build fluid layouts first. Grid, Flexbox and `clamp()` handle most screen sizes without
  media queries.
- Use media queries only to *rearrange or hide* pieces, with breakpoints in `em`
  (for example `@media (max-width: 48em)`).
- Test at **390px, 768px and 1440px**. Nothing may scroll sideways except deliberate scrollers.

## 7. CSS organisation

- **Design tokens first:** every colour, font size, spacing value and layout width is a custom
  property on `:root` (see `design_spec.md`). Rules use `var(--token)`, never raw hex values.
- Start with a small reset: `box-sizing: border-box`, zero margins,
  `img { display: block; max-width: 100%; height: auto; }`, and `font: inherit` on form controls.
- Style with **classes**. Avoid `#id` selectors, avoid `!important`, and keep selectors short
  (no more than 3 classes).
- Use clear component names: `.card`, `.card-title`, `.card-link`.
- In `:hover` rules, change only the properties that differ. Don't repeat the whole rule.
- Remove debug styles such as `background: pink` before you submit.

## Self-check before submitting

- [ ] All 6 sections built, wrappers still have their `class` and `data-section`
- [ ] Landmarks, headings and lists used correctly; no `<br>` and no `style=""`
- [ ] Every image has `width`, `height` and `alt`; below-the-fold images are lazy
- [ ] Every form control has a label; icon-only controls have `aria-label`
- [ ] Colours, font sizes and spacing come from `:root` tokens
- [ ] No fixed `px` widths or heights on layout boxes; no `position` nudges
- [ ] Checked in the browser at 390px, 768px and 1440px (DevTools device toolbar)
- [ ] Files saved in VS Code; submitting the whole folder including `lab_activity.log`
