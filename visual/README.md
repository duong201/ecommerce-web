# Visual run

Full-page screenshots of every route at three breakpoints, plus a real
colour-contrast audit of the same pages.

```bash
yarn visual:build      # once, and again after any src/ change
yarn visual            # screenshots + contrast
yarn visual:report     # open the Playwright HTML report
```

Then look at:

| What                             | Where                                                |
| -------------------------------- | ---------------------------------------------------- |
| Screenshots                      | `visual/out/screens/<theme>/<breakpoint>/<page>.png` |
| Contrast summary (open this one) | `visual/out/contrast-report.html`                    |
| Same summary as text             | `visual/out/contrast-report.md`                      |
| Per-page axe output              | `visual/out/contrast/raw/*.json`                     |

Narrower runs:

```bash
yarn visual:shots                                  # screenshots only
yarn visual:contrast                               # contrast only
THEMES=light,dark yarn visual:shots                # screenshots in both themes
npx playwright test --grep "mobile"                # one breakpoint
npx playwright test --grep "Admin dashboard"       # one page, all breakpoints
yarn visual:typecheck                              # tsc over visual/
```

## How it works

`yarn visual:build` produces a normal production build into `visual/.build`
with `REACT_APP_USE_MOCK=true`, so every page renders from
`src/services/mock/dataset.ts` and the run needs no API, no database and no
network. `serve.mjs` hosts that build with the SPA fallback the router needs;
Playwright starts it automatically.

`global-setup.ts` signs in once as `khach@shop.vn` and once as `admin@shop.vn`
through the real login form and saves each session to `visual/.auth`, so a
guarded page can be opened directly instead of walking the login screen for
every shot.

**Breakpoints** (`targets.ts`) take one viewport per band of
`src/styles/_breakpoints.scss`: 390px (below `xs`), 834px (between `md` and
`lg`) and 1440px (`xxl`).

**Contrast** is measured by axe-core against the rendered page — the colour the
browser actually painted, including inherited and blended backgrounds — at the
WCAG 2.1 AA threshold for each element's text size and weight. It runs in both
themes, because the dark palette is a separate set of tokens. Findings are
grouped by colour pair rather than by page, since one bad token usually shows up
on a dozen pages and is a single fix.

Elements axe declines to measure — text over an image, a gradient, or a
part-transparent overlay — land in a separate "needs a human eye" table. Those
are not passes; check them against the screenshots.

Contrast failures are soft assertions, so one bad page never stops the rest of
the audit. A red run therefore means "there are findings", not "the harness
broke" — read `contrast-report.html` for what they are.

## Adding a page

Add it to `ROUTES` in `targets.ts` with the audience it needs (`guest`,
`customer` or `admin`). Pages that only hold content after something has been
bought — cart, checkout, order confirmation — belong in `flow.spec.ts` instead:
the offline store keeps the cart in memory, so a reload empties it and those
pages have to be walked to with client-side navigation in one session.
