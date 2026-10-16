/**
 * HowItWorksStrip
 *
 * A minimal 3-step sequence that explains the product flow.
 * Placed directly below the search form to answer the implicit
 * question "what happens after I click analyze?"
 *
 * Uses <ol> (ordered list) — steps are sequential, order matters.
 * Uses <li> for each step — correct semantic for list items.
 *
 * Layout:
 *   Mobile  → vertical stack (flex-col)
 *   Desktop → horizontal row with → separators (flex-row)
 */

// ── Data ─────────────────────────────────────────────────────────────────────
// Defined as a const array outside the component so it's not re-created
// on every render. TypeScript infers the type from the object shape.
const STEPS = [
  {
    number: "01",
    label: "Paste your GitHub username",
  },
  {
    number: "02",
    label: "We analyze your public repos",
  },
  {
    number: "03",
    label: "Get your full intelligence report",
  },
] as const
// `as const` makes every property readonly and narrows the literal types.
// This means step.number is "01" | "02" | "03", not just string.
// Useful if you ever switch on the value — TypeScript will warn if you
// forget a case.

export function HowItWorksStrip() {
  return (
    <ol
      aria-label="How it works"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-0"
    >
      {STEPS.map((step, index) => (
        // React.Fragment with key — lets us return two sibling elements
        // (the <li> and the → separator) from one map iteration without
        // adding an unnecessary wrapper <div>.
        <li
          key={step.number}
          className="flex items-center gap-2 sm:gap-2"
        >
          {/* Step number — monospace font signals "technical/sequential" */}
          <span className="font-mono text-xs font-bold text-blue-500">
            {step.number}
          </span>

          {/* Step label */}
          <span className="text-sm text-gray-500">{step.label}</span>

          {/* Arrow separator — only between steps (not after the last),
              only on sm+ (desktop). aria-hidden so screen readers skip it
              — the <ol> order already communicates sequence. */}
          {index < STEPS.length - 1 && (
            <span
              aria-hidden="true"
              className="ml-2 hidden text-gray-300 sm:block"
            >
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
