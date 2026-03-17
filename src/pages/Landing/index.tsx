import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  staggerChildrenFast,
  sectionVariants,
} from '@/lib/motion'
import styles from './Landing.module.css'

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
] as const

function scrollTo(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}

function Section({
  id,
  className,
  children,
}: {
  id?: string
  className: string
  children: React.ReactNode
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  )
}

export function Landing() {
  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#hero" className={styles.logo} onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
          <span className={styles.logoIcon}>◇</span>
          <span>Receptionist</span>
        </a>
        <nav className={styles.nav} aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(href.slice(1))
              }}
            >
              {label}
            </a>
          ))}
          <Link to="/login" className={styles.signInBtn}>Sign In</Link>
        </nav>
      </motion.header>

      <main>
        {/* Hero */}
        <section id="hero" className={`${styles.sectionCream} ${styles.hero}`}>
          <motion.div
            className={styles.heroContent}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
              Meet Your Digital Front Desk Assistant Powered by AI
            </motion.h1>
            <motion.p className={styles.heroText} variants={fadeInUp}>
              Answer calls, schedule appointments, and provide instant support—24/7. 
              Let AI handle the front desk so you can focus on what matters.
            </motion.p>
            <motion.div className={styles.heroActions} variants={fadeInUp}>
              <Link to="/signup" className={styles.heroBtnPrimary}>Get Started</Link>
              <a href="#pricing" className={styles.heroBtnSecondary} onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>See Pricing</a>
            </motion.div>
          </motion.div>
          <motion.div
            className={styles.heroImage}
            aria-hidden
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </section>

        {/* Every Call Answered */}
        <Section id="features" className={`${styles.sectionSage} ${styles.section}`}>
          <div className={styles.twoCol}>
            <motion.div
              className={styles.twoColContent}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>Every Call Answered Every Time</motion.h2>
              <motion.p className={styles.sectionSubtitle} variants={fadeInUp}>
                Never miss a lead or customer call. Our AI assistant ensures every call is answered 
                with personalized, context-aware responses.
              </motion.p>
              <motion.ul className={styles.featureList} variants={staggerChildrenFast}>
                {[
                  { id: 'phone', icon: '📞', text: <><strong>Phone calls</strong> — Automate call handling and routing</> },
                  { id: 'personalized', icon: '✨', text: <><strong>Personalized service</strong> — Customizable AI conversations</> },
                  { id: 'knowledge', icon: '📋', text: <><strong>Knowledge-based answers</strong> — Trained on your business info</> },
                ].map((item) => (
                  <motion.li key={item.id} variants={fadeInUp}>
                    <span className={styles.featureIcon} aria-hidden>{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              className={styles.cardHighlight}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.15 }}
            >
              <div className={styles.cardHighlightIcon} aria-hidden>🧠</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Smart & Human-like</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Understands context and delivers natural, helpful interactions.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* What It Can Do */}
        <Section className={`${styles.sectionSage} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>
            What Your Digital Front Desk Assistant Can Do
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }} variants={fadeInUp}>
            One AI assistant for calls, appointments, and support.
          </motion.p>
          <motion.div
            className={styles.featureGrid}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { title: 'Instant Answering', text: 'Answer every call immediately, day or night.' },
              { title: 'Book Appointments', text: 'Schedule and reschedule without human intervention.' },
              { title: 'Prioritize Urgent Calls', text: 'Route important callers to the right person.' },
              { title: 'FAQ & Support', text: 'Answer common questions using your knowledge base.' },
              { title: 'Lead Capture', text: 'Collect contact details and qualify leads from Apollo.io.' },
              { title: 'Call Logging', text: 'Transcripts and summaries for every conversation.' },
            ].map((item) => (
              <motion.article key={item.title} className={styles.featureCard} variants={fadeInUp}>
                <div className={styles.featureCardIcon} aria-hidden>◆</div>
                <h3 className={styles.featureCardTitle}>{item.title}</h3>
                <p className={styles.featureCardText}>{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        {/* Built for Busy Businesses */}
        <Section id="built-for-business" className={`${styles.sectionWhite} ${styles.section}`}>
          <div className={styles.twoCol}>
            <motion.div className={styles.cardHighlight} style={{ minHeight: 200 }} aria-hidden variants={fadeIn} />
            <motion.div
              className={styles.twoColContent}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>Built for Busy Businesses</motion.h2>
              <motion.p className={styles.sectionSubtitle} variants={fadeInUp}>
                Streamline operations and improve efficiency with an AI front desk that scales with you.
              </motion.p>
              <motion.ul className={styles.featureList} variants={staggerChildrenFast}>
                {['Improve efficiency', 'Reduce costs', 'Increase customer satisfaction', '24/7 availability', 'Scalability'].map((text) => (
                  <motion.li key={text} variants={fadeInUp}>
                    <span className={styles.featureIcon} aria-hidden>✓</span>
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.a href="#features" className={styles.heroBtnPrimary} onClick={(e) => { e.preventDefault(); scrollTo('features') }} style={{ marginTop: '0.5rem', display: 'inline-block' }} variants={fadeInUp}>
                Explore Features
              </motion.a>
            </motion.div>
          </div>
        </Section>

        {/* Stats */}
        <Section className={`${styles.sectionCream} ${styles.section}`}>
          <motion.div
            className={styles.stats}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { value: '+78%', label: 'in customer satisfaction' },
              { value: '-22%', label: 'in operational costs' },
              { value: '24/7', label: 'availability' },
              { value: '-60%', label: 'in missed opportunities' },
            ].map((s) => (
              <motion.div key={s.label} className={styles.statItem} variants={fadeInUp}>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Powered by AI */}
        <Section className={`${styles.sectionSage} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>Powered by AI</motion.h2>
          <motion.div
            className={styles.featureGrid}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { title: 'AI Voice Control', text: 'Natural voice conversations with callers.' },
              { title: 'AI Appointment Setter', text: 'Book and manage appointments automatically.' },
              { title: 'AI Document Processing', text: 'Knowledge base trained on your docs.' },
              { title: 'Custom AI Solutions', text: 'Tailored to your business and workflows.' },
            ].map((item) => (
              <motion.article key={item.title} className={styles.featureCard} variants={fadeInUp}>
                <div className={styles.featureCardIcon} aria-hidden>◇</div>
                <h3 className={styles.featureCardTitle}>{item.title}</h3>
                <p className={styles.featureCardText}>{item.text}</p>
                <a href="#contact" className={styles.navLink} style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem' }} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Learn more →</a>
              </motion.article>
            ))}
          </motion.div>
        </Section>

        {/* Testimonials */}
        <Section className={`${styles.sectionSage} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>Trusted by Industry Leaders</motion.h2>
          <motion.div
            className={styles.testimonialGrid}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { quote: 'The AI receptionist handles our peak call volume without dropping a single lead. Game changer.', name: 'Sarah M.', initial: 'S' },
              { quote: 'We cut front-desk costs by 40% while improving response times. Highly recommend.', name: 'James K.', initial: 'J' },
              { quote: 'Our customers love the instant answers. The AI feels human and always has the right info.', name: 'Priya L.', initial: 'P' },
            ].map((t) => (
              <motion.blockquote key={t.name} className={styles.testimonialCard} variants={fadeInUp}>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.initial}</div>
                  <p className={styles.testimonialName}>{t.name}</p>
                </div>
              </motion.blockquote>
            ))}
          </motion.div>
        </Section>

        {/* Pricing placeholder */}
        <Section id="pricing" className={`${styles.sectionCream} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>Pricing</motion.h2>
          <motion.p className={styles.sectionSubtitle} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }} variants={fadeInUp}>
            Simple plans for teams of all sizes. Start free, scale when you need to.
          </motion.p>
        </Section>

        {/* FAQ placeholder */}
        <Section id="faq" className={`${styles.sectionSage} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>FAQ</motion.h2>
          <motion.p className={styles.sectionSubtitle} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }} variants={fadeInUp}>
            Common questions about the AI receptionist and lead collection.
          </motion.p>
        </Section>

        {/* Blog placeholder */}
        <Section id="blog" className={`${styles.sectionCream} ${styles.section}`}>
          <motion.h2 className={styles.sectionTitle} style={{ textAlign: 'center' }} variants={fadeInUp}>Blog</motion.h2>
          <motion.p className={styles.sectionSubtitle} style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }} variants={fadeInUp}>
            Tips and updates on AI receptionists and lead management.
          </motion.p>
        </Section>

        {/* CTA */}
        <Section id="contact" className={`${styles.sectionCream} ${styles.ctaSection}`}>
          <motion.h2 className={styles.ctaTitle} variants={fadeInUp}>Never Miss Another Opportunity</motion.h2>
          <motion.p className={styles.ctaText} variants={fadeInUp}>
            Join businesses that answer every call and capture every lead with AI.
          </motion.p>
          <motion.div className={styles.ctaActions} variants={fadeInUp}>
            <a href="#pricing" className={styles.heroBtnPrimary} onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Book a Demo →</a>
            <Link to="/signup" className={styles.heroBtnSecondary}>Start Your Free Trial</Link>
          </motion.div>
        </Section>

        {/* Footer */}
        <motion.footer
          className={styles.footer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <a href="#hero" className={styles.footerLogo} onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
            <span className={styles.logoIcon}>◇</span>
            Receptionist
          </a>
          <div className={styles.footerLinks}>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Pricing</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Contact Us</a>
          </div>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} Receptionist. All rights reserved.</p>
        </motion.footer>
      </main>
    </>
  )
}
