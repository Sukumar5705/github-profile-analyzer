/**
 * HowItWorksStrip
 *
 * Compact one-line version of the workflow, for placing near the search form.
 * NOTE: it is not currently rendered anywhere. It now reads its labels from
 * HowItWorksSection so the two cannot disagree; delete this file if you don't
 * plan to use it.
 *
 * Semantics: <ol>, because the steps are sequential.
 * Layout: stacked on mobile, one row with arrows from sm up.
 */
import { HOW_IT_WORKS_STEPS } from "./HowItWorksSection"

export function HowItWorksStrip() {
  return (
    <ol
      aria-label="How it works"
      className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
    >
      {HOW_IT_WORKS_STEPS.map((step, index) => (
        <li key={step.number} className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-primary">
            {step.number}
          </span>
          <span>{step.shortLabel}</span>
          {index < HOW_IT_WORKS_STEPS.length - 1 && (
            <span aria-hidden="true" className="ml-1 hidden text-slate-300 sm:inline">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
