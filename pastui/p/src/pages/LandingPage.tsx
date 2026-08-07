/**
 * LandingPage
 *
 * Assembly of all landing components in reading order.
 *
 * Structure:
 *   <div>               page root, white bg, min full viewport height
 *     <Navbar />        top brand + recruiter link
 *     <main>            skip-nav target; wraps visible page content
 *       <HeroSection /> search + headline + how-it-works
 *       <FeaturesSection /> two-column feature grid
 *     </main>
 *     <Footer />        wordmark + copyright
 *   </div>
 *
 * <main> is a semantic landmark — "Skip to main content" links (used by
 * accessibility overlays and power keyboard users) point to <main>.
 * This lets them jump past the Navbar directly to the content.
 *
 * This component has zero logic — it's pure composition.
 * All interactivity lives in UsernameSearchForm.
 */

import { Navbar } from "../components/shared/Navbar"
import { HeroSection } from "../components/landing/HeroSection"
import { FeaturesSection } from "../components/landing/FeaturesSection"
import { Footer } from "../components/shared/Footer"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />
      </main>

      <Footer />

    </div>
  )
}
