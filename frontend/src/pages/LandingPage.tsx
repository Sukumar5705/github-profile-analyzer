import { Navbar } from "../components/shared/Navbar"
import { HeroSection } from "../components/landing/HeroSection"
import { TrustBar } from "../components/landing/TrustBar"
import { HowItWorksSection } from "../components/landing/HowItWorksSection"
import { FeaturesSection } from "../components/landing/FeaturesSection"
import { TechStackSection } from "../components/landing/TechStackSection"
import { Footer } from "../components/shared/Footer"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top sticky navigation */}
      <Navbar />

      {/* Main content landmarks */}
      <main id="main-content" className="flex-1">
        <HeroSection />
        <TrustBar />
        <HowItWorksSection />
        <FeaturesSection />
        <TechStackSection />
      </main>

      {/* Modern footer */}
      <Footer />

    </div>
  )
}

