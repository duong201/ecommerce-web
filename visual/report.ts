import fs from 'node:fs'
import path from 'node:path'
import { RAW_DIR, type ContrastFinding, type ContrastReport } from './contrast'

/**
 * Rolls the per-page axe output into one summary. Findings are grouped by the
 * colour pair rather than by page, because one bad token shows up on a dozen
 * pages and is a single fix.
 */

const OUT_DIR = path.join(__dirname, 'out')

interface Group {
  theme: string
  foreground: string
  background: string
  ratio: number | null
  required: number | null
  /** Distinct `page@breakpoint` labels where this pair was painted. */
  where: Set<string>
  sample: ContrastFinding
}

const readReports = (): ContrastReport[] => {
  if (!fs.existsSync(RAW_DIR)) return []
  return fs
    .readdirSync(RAW_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(RAW_DIR, file), 'utf8')) as ContrastReport)
}

/** An element axe declined to measure, with the reason it gave. */
interface Unmeasured {
  theme: string
  target: string
  note: string
  where: Set<string>
}

/**
 * Collapses the positional parts of a CSS path so the fifth card in a carousel
 * groups with the first. Only used as a grouping key — the sample target keeps
 * the real selector so it can still be pasted into devtools.
 */
const shape = (selector: string): string =>
  selector
    .replace(/:nth-child\(\d+\)/g, ':nth-child(n)')
    .replace(/\[href\$?=("|').*?\1\]/g, '[href]')

/** Long page lists drown the table; the count is what matters after a few names. */
const listWhere = (where: Set<string>, limit = 4): string => {
  const names = [...where].sort()
  if (names.length <= limit) return names.join(', ')
  return `${names.slice(0, limit).join(', ')} +${names.length - limit} more`
}

const group = (reports: ContrastReport[], pick: (report: ContrastReport) => ContrastFinding[]) => {
  const groups = new Map<string, Group>()

  for (const report of reports) {
    for (const finding of pick(report)) {
      const key = `${report.theme}|${finding.foreground}|${finding.background}|${finding.required}`
      const existing = groups.get(key)
      const where = `${report.page}@${report.breakpoint}`

      if (existing) {
        existing.where.add(where)
        // Keep the worst ratio seen for the pair.
        if ((finding.ratio ?? Infinity) < (existing.ratio ?? Infinity)) {
          existing.ratio = finding.ratio
        }
      } else {
        groups.set(key, {
          theme: report.theme,
          foreground: finding.foreground ?? 'unknown',
          background: finding.background ?? 'unknown',
          ratio: finding.ratio,
          required: finding.required,
          where: new Set([where]),
          sample: finding,
        })
      }
    }
  }

  return [...groups.values()].sort((a, b) => (a.ratio ?? 99) - (b.ratio ?? 99))
}

/**
 * Incomplete findings carry no colours — axe gave up before it had a pair — so
 * these group by the element instead, which is what a human has to go look at.
 */
const groupUnmeasured = (reports: ContrastReport[]): Unmeasured[] => {
  const groups = new Map<string, Unmeasured>()

  for (const report of reports) {
    for (const finding of report.incomplete) {
      const key = `${report.theme}|${finding.message}|${shape(finding.target)}`
      const where = `${report.page}@${report.breakpoint}`
      const existing = groups.get(key)

      if (existing) {
        existing.where.add(where)
      } else {
        groups.set(key, {
          theme: report.theme,
          target: finding.target || '(unnamed element)',
          note: finding.message,
          where: new Set([where]),
        })
      }
    }
  }

  return [...groups.values()].sort(
    (a, b) => b.where.size - a.where.size || a.target.localeCompare(b.target),
  )
}

const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"]/g, (char) => ENTITIES[char] ?? char)

const countOf = (reports: ContrastReport[], key: 'page' | 'breakpoint' | 'theme'): number =>
  new Set(reports.map((report) => report[key])).size

const markdown = (reports: ContrastReport[], fails: Group[], unknown: Unmeasured[]): string => {
  const failingPages = new Set(
    reports.filter((report) => report.violations.length > 0).map((report) => report.page),
  )

  const lines = [
    '# Colour contrast — WCAG 2.1 AA',
    '',
    'Measured with axe-core on the rendered page: ' +
      `${countOf(reports, 'page')} pages × ${countOf(reports, 'breakpoint')} breakpoints × ` +
      `${countOf(reports, 'theme')} theme(s) = ${reports.length} audits.`,
    '',
    `- Colour pairs below AA: **${fails.length}**`,
    `- Pages affected: **${failingPages.size}** of ${countOf(reports, 'page')}`,
    `- Pairs axe could not measure (text over an image or gradient): **${unknown.length}**`,
    '',
  ]

  if (fails.length > 0) {
    lines.push(
      '## Below AA',
      '',
      '| Theme | Text | Background | Ratio | Needs | Pages |',
      '| --- | --- | --- | --- | --- | --- |',
    )
    for (const item of fails) {
      lines.push(
        `| ${item.theme} | \`${item.foreground}\` | \`${item.background}\` | ` +
          `${item.ratio ?? '?'}:1 | ${item.required ?? '?'}:1 | ` +
          `${listWhere(item.where)} |`,
      )
    }

    lines.push('', '### One example element per pair', '')
    for (const item of fails) {
      lines.push(
        `- \`${item.foreground}\` on \`${item.background}\` (${item.theme}) — ` +
          `\`${item.sample.target}\``,
      )
    }
    lines.push('')
  } else {
    lines.push('No text fell below the AA threshold.', '')
  }

  if (unknown.length > 0) {
    lines.push(
      '## Needs a human eye',
      '',
      'axe cannot compute a ratio when the background is an image, a gradient, or a',
      'partly transparent overlay. Check these against the screenshots.',
      '',
      '| Theme | Element | Why | Pages |',
      '| --- | --- | --- | --- |',
    )
    for (const item of unknown) {
      lines.push(
        `| ${item.theme} | \`${item.target}\` | ${item.note} | ` + `${listWhere(item.where)} |`,
      )
    }
    lines.push('')
  }

  return lines.join('\n')
}

const chip = (color: string): string =>
  `<span class="chip" style="background:${escapeHtml(color)}"></span>` +
  `<code>${escapeHtml(color)}</code>`

const swatchRow = (item: Group): string =>
  [
    '<tr>',
    `<td>${escapeHtml(item.theme)}</td>`,
    `<td><span class="sample" style="color:${escapeHtml(item.foreground)};` +
      `background:${escapeHtml(item.background)}">Sample text</span></td>`,
    `<td>${chip(item.foreground)}</td>`,
    `<td>${chip(item.background)}</td>`,
    `<td class="num">${item.ratio ?? '?'}:1</td>`,
    `<td class="num">${item.required ?? '?'}:1</td>`,
    `<td class="where">${escapeHtml(listWhere(item.where))}</td>`,
    `<td class="where"><code>${escapeHtml(item.sample.target)}</code></td>`,
    '</tr>',
  ].join('')

const unmeasuredRow = (item: Unmeasured): string =>
  [
    '<tr>',
    `<td>${escapeHtml(item.theme)}</td>`,
    `<td class="where"><code>${escapeHtml(item.target)}</code></td>`,
    `<td class="where">${escapeHtml(item.note)}</td>`,
    `<td class="where">${escapeHtml(listWhere(item.where))}</td>`,
    '</tr>',
  ].join('')

const STYLE = `
  :root { color-scheme: light dark; }
  body { font: 14px/1.5 system-ui, sans-serif; margin: 2rem auto; max-width: 72rem; padding: 0 1rem; }
  h1 { margin-bottom: .25rem; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0 2rem; }
  th, td { border: 1px solid #8883; padding: .4rem .6rem; text-align: left; vertical-align: middle; }
  th { background: #8881; }
  .chip { display: inline-block; width: 1rem; height: 1rem; border: 1px solid #8886; vertical-align: -3px; margin-right: .4rem; }
  .sample { display: inline-block; padding: .25rem .5rem; border: 1px solid #8886; white-space: nowrap; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .where { font-size: 12px; opacity: .8; }
  .lede { opacity: .8; }
`

const table = (head: string[], rows: string): string =>
  `<table><thead><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>` +
  `<tbody>${rows}</tbody></table>`

const html = (reports: ContrastReport[], fails: Group[], unknown: Unmeasured[]): string => {
  const failTable =
    fails.length === 0
      ? '<p>No text fell below the AA threshold.</p>'
      : table(
          ['Theme', 'Preview', 'Text', 'Background', 'Ratio', 'Needs', 'Pages', 'Example element'],
          fails.map(swatchRow).join(''),
        )

  const unknownTable =
    unknown.length === 0
      ? '<p>Nothing unmeasurable.</p>'
      : table(['Theme', 'Element', 'Why', 'Pages'], unknown.map(unmeasuredRow).join(''))

  return [
    '<!doctype html>',
    '<html lang="en"><head><meta charset="utf-8"><title>Contrast report</title>',
    `<style>${STYLE}</style></head><body>`,
    '<h1>Colour contrast — WCAG 2.1 AA</h1>',
    `<p class="lede">Measured with axe-core against the rendered page. ${reports.length} audits ` +
      `(${countOf(reports, 'page')} pages × ${countOf(reports, 'breakpoint')} breakpoints × ` +
      `${countOf(reports, 'theme')} theme(s)).</p>`,
    `<h2>Below AA — ${fails.length} colour pair(s)</h2>`,
    failTable,
    `<h2>Needs a human eye — ${unknown.length} pair(s)</h2>`,
    '<p class="lede">axe cannot compute a ratio over an image, a gradient, or a partly ' +
      'transparent overlay.</p>',
    unknownTable,
    '</body></html>',
  ].join('\n')
}

const globalTeardown = async (): Promise<void> => {
  const reports = readReports()
  if (reports.length === 0) return

  const fails = group(reports, (report) => report.violations)
  const unknown = groupUnmeasured(reports)

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'contrast-report.md'), markdown(reports, fails, unknown))
  fs.writeFileSync(path.join(OUT_DIR, 'contrast-report.html'), html(reports, fails, unknown))

  console.log(
    `\nContrast: ${fails.length} colour pair(s) below AA, ${unknown.length} unmeasurable, ` +
      `across ${reports.length} audits.\n  ${path.join(OUT_DIR, 'contrast-report.html')}\n`,
  )
}

export default globalTeardown
