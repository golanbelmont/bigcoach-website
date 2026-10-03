import Navbar from '@/components/Navbar'
import FabDock from '@/components/FabDock'
import Hero from '@/components/Hero'
import Story from '@/components/Story'
import Reels from '@/components/Reels'
import About from '@/components/About'
import Method from '@/components/Method'
import Programs from '@/components/Programs'
import Testimonials from '@/components/Testimonials'
import Faq from '@/components/Faq'
import ResearchTeaser from '@/components/ResearchTeaser'
import FinalFooter from '@/components/FinalFooter'
import LeadPopup from '@/components/LeadPopup'
import Consent from '@/components/Consent'
import Fx from '@/components/Fx'

/*
 * מסע הלקוח (לא לערבב סדר בלי בקשה):
 * כאב (hero) → הזדהות (story) → הוכחה (reels) → המדריך (about+golan)
 * → התוכנית (method) → ההצעה (programs) → הוכחה חברתית → התנגדויות → סגירה.
 */
export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="progress" aria-hidden="true">
        <i id="progressBar" />
      </div>

      <LeadPopup />
      <Consent />

      <Navbar />
      <FabDock />

      <Hero />

      <main id="main">
        <Story />
        <Reels />
        <About />
        <Method />
        <Programs />
        <Testimonials />
        <ResearchTeaser />
        <Faq />
      </main>

      <FinalFooter />
      <Fx />
    </>
  )
}
