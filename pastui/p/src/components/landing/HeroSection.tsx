/**
 * HeroSection
 *
 * Layout shell only. Owns:
 * - Background gradient (subtle blue → white top-to-bottom)
 * - Vertical padding (breathing room above and below)
 * - Content width constraint (max-w-3xl, centered)
 * - Spacing between child components
 *
 * Does NOT own: headline copy, form logic, step descriptions.
 * Those live in their own files so they can be changed independently.
 */

import { HeroHeadline } from "./HeroHeadline"
import { UsernameSearchForm } from "./UsernameSearchForm"
import { HowItWorksStrip } from "./HowItWorksStrip"

export function HeroSection() {
  return (
    <section
      aria-label="Analyze your GitHub profile"
      className="relative bg-gradient-to-b from-blue-50/50 via-white to-white py-20 sm:py-28"
    >
      {/*
        max-w-3xl (768px) keeps the hero tight and scannable.
        Wider than this and the headline feels like body text.
        text-center aligns all children — each child uses mx-auto
        to control its own max-width within this.
      */}
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">

        {/* 1. Headline — eyebrow + h1 + subtext */}
        <HeroHeadline />

        {/* 2. Search form — the only interactive element in the hero */}
        <div className="mt-10">
          <UsernameSearchForm />
        </div>

        {/* 3. How it works strip — below the form, separated by a thin rule */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <HowItWorksStrip />
        </div>

      </div>
    </section>
  )
}
