import fs from 'node:fs'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, type TestInfo } from '@playwright/test'

/**
 * Real contrast, not a palette review: axe-core reads the colour the browser
 * actually painted — including inherited and blended backgrounds — and compares
 * it against the WCAG 2.1 AA threshold for that text's size and weight.
 */

export const RAW_DIR = path.join(__dirname, 'out', 'contrast', 'raw')

/** One flagged element, flattened out of the axe result shape. */
export interface ContrastFinding {
  target: string
  html: string
  foreground: string | null
  background: string | null
  ratio: number | null
  required: number | null
  fontSize: string | null
  fontWeight: string | null
  message: string
}

export interface ContrastReport {
  page: string
  title: string
  path: string
  theme: string
  breakpoint: string
  width: number
  /** Elements axe measured and found below the AA threshold. */
  violations: ContrastFinding[]
  /** Elements axe could not measure — usually text over an image or gradient. */
  incomplete: ContrastFinding[]
}

/** axe puts the measured colours in the check's `data` bag; shapes vary by outcome. */
interface ContrastData {
  fgColor?: string
  bgColor?: string
  contrastRatio?: number
  expectedContrastRatio?: string
  fontSize?: string
  fontWeight?: string
}

interface AxeCheck {
  id: string
  data?: ContrastData
  message?: string
}

interface AxeNode {
  target?: unknown[]
  html?: string
  failureSummary?: string
  any?: AxeCheck[]
  all?: AxeCheck[]
  none?: AxeCheck[]
}

const flatten = (nodes: AxeNode[]): ContrastFinding[] =>
  nodes.map((node) => {
    const check = [...(node.any ?? []), ...(node.all ?? []), ...(node.none ?? [])].find(
      (candidate) => candidate.id === 'color-contrast',
    )
    const data = check?.data ?? {}
    const required = data.expectedContrastRatio
      ? Number(String(data.expectedContrastRatio).replace(':1', ''))
      : null

    return {
      target: String(node.target?.[0] ?? ''),
      html: String(node.html ?? '').slice(0, 300),
      foreground: data.fgColor ?? null,
      background: data.bgColor ?? null,
      ratio: typeof data.contrastRatio === 'number' ? data.contrastRatio : null,
      required: Number.isFinite(required) ? required : null,
      fontSize: data.fontSize ?? null,
      fontWeight: data.fontWeight ?? null,
      message: String(check?.message ?? node.failureSummary ?? '').slice(0, 300),
    }
  })

export interface AuditMeta {
  page: string
  title: string
  path: string
  theme: string
  breakpoint: string
  width: number
}

/**
 * Runs the colour-contrast rule over the current page, saves the findings for
 * the summary report, and soft-fails the test so one bad page does not stop the
 * rest of the audit.
 */
export const auditContrast = async (
  page: Page,
  meta: AuditMeta,
  testInfo: TestInfo,
): Promise<ContrastReport> => {
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()

  const report: ContrastReport = {
    ...meta,
    violations: flatten(results.violations.flatMap((violation) => violation.nodes as AxeNode[])),
    incomplete: flatten(results.incomplete.flatMap((entry) => entry.nodes as AxeNode[])),
  }

  fs.mkdirSync(RAW_DIR, { recursive: true })
  fs.writeFileSync(
    path.join(RAW_DIR, `${meta.theme}__${meta.breakpoint}__${meta.page}.json`),
    JSON.stringify(report, null, 2),
  )

  await testInfo.attach('contrast.json', {
    body: JSON.stringify(report, null, 2),
    contentType: 'application/json',
  })

  const summary = report.violations
    .map(
      (finding) =>
        `  ${finding.ratio}:1 (needs ${finding.required}:1) ` +
        `${finding.foreground} on ${finding.background} — ${finding.target}`,
    )
    .join('\n')

  expect.soft(report.violations.length, `Contrast below AA:\n${summary}`).toBe(0)

  return report
}
