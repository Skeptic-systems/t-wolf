import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { SiteCopy } from '../i18n'
import { useLocale } from '../hooks/useLocale'
import { useLocalizedSeo } from '../hooks/useLocalizedSeo'
import { SignatureBand } from './SignatureBand'
import { SiteHeader } from './SiteHeader'
import { Testimonials } from './Testimonials'
import { TiltCard } from './TiltCard'
import { cleanPath, scrollToSection } from '../scroll'

const contactLinks = {
  email: 'mailto:digitalwerkstatt@t-wolf.it',
  phoneIt: 'tel:+393513642110',
  phoneDe: 'tel:+491771481418',
  whatsapp:
    'https://wa.me/393513642110?text=Hallo%21%20Ich%20habe%20eine%20Frage%20zu%20meinem%20Betrieb.',
}

/**
 * Section order follows the shape of the sales conversation this business
 * actually has, rather than the order the material happened to be written in:
 *
 *   who we are  ->  the problem you recognise  ->  how we think about it
 *   ->  what we do  ->  how it runs  ->  proof  ->  what it costs you
 *   ->  who you'd be working with  ->  objections  ->  get in touch
 *
 * The proof block is deliberately one run of three: worked cases first, because
 * they carry the detail, then the client list, then the quotes. Money (funding)
 * sits after the proof and before the people, so it lands once the reader is
 * already convinced but has not yet reached the contact form.
 */
export function HomePage() {
  const { copy, locale, setLocale } = useLocale()

  useLocalizedSeo('home', locale)

  useEffect(() => {
    const targetId = window.location.hash.slice(1)

    if (targetId) {
      window.history.replaceState(null, '', cleanPath())
      window.setTimeout(() => scrollToSection(targetId), 0)
    }
  }, [])

  return (
    <>
      <button
        className="skip"
        onClick={() => scrollToSection('main')}
        type="button"
      >
        {copy.nav.skip}
      </button>
      <SiteHeader copy={copy} locale={locale} setLocale={setLocale} />
      <main id="main">
        <Hero copy={copy} />
        <Recognition copy={copy} />
        <SignatureBand copy={copy} />
        <Services copy={copy} />
        <Process copy={copy} />
        <Workshop copy={copy} />
        <References copy={copy} />
        <Testimonials copy={copy} />
        <Funding copy={copy} />
        <Team copy={copy} />
        <Faq copy={copy} />
        <Contact copy={copy} />
      </main>
      <Footer copy={copy} />
    </>
  )
}

function Hero({ copy }: { copy: SiteCopy }) {
  const firstSentence = copy.hero.title.split('.')[0]
  const rest = copy.hero.title.replace(`${firstSentence}.`, '')

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">{copy.hero.eyebrow}</span>
          <h1>
            <span className="setup">{firstSentence}.</span>
            {withOrangePoint(rest)}
          </h1>
          <p className="lead">{copy.hero.text}</p>
          <div className="cta-row">
            <button
              className="btn btn-p"
              onClick={() => scrollToSection('kontakt')}
              type="button"
            >
              {copy.hero.cta}
            </button>
          </div>
          <p className="cta-alt">
            {copy.hero.note}
            <br />
            {copy.hero.whatsapp}{' '}
            <a href={contactLinks.whatsapp}>+39 351 3642110</a>.{' '}
            {copy.hero.call} <a href={contactLinks.phoneIt}>+39 351 3642110</a>,{' '}
            <a href={contactLinks.phoneDe}>+49 177 1481418</a>
          </p>
        </div>
        <div className="hero-photo">
          <TiltCard className="hero-card">
            <img
              alt="Thomas Wolfsteiner, T-Wolf.it Digitalwerkstatt"
              src="/assets/img/thomas-hero.webp"
            />
            <span className="hero-card-tag" aria-hidden="true">
              {copy.hero.place}
            </span>
          </TiltCard>
          <div className="hero-sig hero-sig-stack">
            <img className="sig-marke" alt="" src="/assets/img/bildmarke.png" />
            <span className="hero-cap">
              <b>{copy.hero.role}</b>
              <br />
              {copy.hero.subtitle}
              <br />
              {copy.hero.place}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function withOrangePoint(text: string) {
  return text.endsWith('.') ? (
    <>
      {text.slice(0, -1)}
      <span className="pt">.</span>
    </>
  ) : (
    text
  )
}

function Recognition({ copy }: { copy: SiteCopy }) {
  return (
    <section className="recog" id="erkennen">
      <div className="wrap recog-grid">
        <div>
          <span className="eyebrow">{copy.known.eyebrow}</span>
          <h2>{withOrangePoint(copy.known.title)}</h2>
          <p className="lead after">{copy.known.text}</p>
        </div>
        <ul>
          {copy.known.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Process({ copy }: { copy: SiteCopy }) {
  return (
    <section id="ablauf">
      <div className="wrap">
        <span className="eyebrow">{copy.process.eyebrow}</span>
        <h2>{withOrangePoint(copy.process.title)}</h2>
        <p className="lead">{copy.process.text}</p>
        <div className="steps">
          {copy.process.steps.map(([title, text]) => (
            <article className="step" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Workshop({ copy }: { copy: SiteCopy }) {
  return (
    <section>
      <div className="wrap">
        <CaseCard
          copy={copy}
          image="/assets/img/kunden/freitag-expert.png"
          text={copy.workshop.freitagText}
          title={copy.workshop.freitagTitle}
        />
        <p className="case-brueck">{copy.workshop.bridge}</p>
        <CaseCard
          copy={copy}
          image="/assets/img/kunden/martellerhof.png"
          plus
          text={copy.workshop.martellerText}
          title={copy.workshop.martellerTitle}
        />
        <article className="eigen">
          <span className="eyebrow">{copy.workshop.techEyebrow}</span>
          <h3>{copy.workshop.techTitle}</h3>
          <p>{copy.workshop.techText}</p>
        </article>
      </div>
    </section>
  )
}

function CaseCard({
  copy,
  image,
  plus,
  text,
  title,
}: {
  copy: SiteCopy
  image: string
  plus?: boolean
  text: string
  title: string
}) {
  const leftTitle = plus ? copy.workshop.weekly : copy.workshop.done
  const rightTitle = plus ? copy.workshop.plus : copy.workshop.skipped
  const leftItems = plus ? copy.workshop.weeklyItems : copy.workshop.doneItems
  const rightItems = plus ? copy.workshop.plusItems : copy.workshop.skippedItems

  return (
    <article className="case">
      <div className="case-kopf">
        <span className="eyebrow">{copy.workshop.eyebrow}</span>
        <img className="case-logo" alt="" src={image} />
      </div>
      <h2>{withOrangePoint(title)}</h2>
      <p className="lead">{text}</p>
      <div className="cols">
        <div className="did">
          <h4>{leftTitle}</h4>
          <ul>
            {leftItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={plus ? 'did' : 'nicht'}>
          <h4>{rightTitle}</h4>
          <ul>
            {rightItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {!plus ? (
        <blockquote>
          {copy.workshop.quote}
          <cite>
            <b>Michael Freitag</b> · Freitag Expert IT Solutions
          </cite>
        </blockquote>
      ) : null}
    </article>
  )
}

function Services({ copy }: { copy: SiteCopy }) {
  return (
    <section id="leistungen">
      <div className="wrap">
        <span className="eyebrow">{copy.services.eyebrow}</span>
        <h2>{withOrangePoint(copy.services.title)}</h2>
        <p className="lead">{copy.services.text}</p>
        <p className="claimzeile">{copy.services.claim}</p>
        <div className="gruppen">
          {copy.services.items.map((item) => (
            <article
              className={item.small ? 'gruppe gruppe-klein' : 'gruppe'}
              key={item.title}
            >
              <img
                className="gruppe-ic"
                alt=""
                src={`/assets/icons/${item.icon}`}
              />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul className="gruppe-liste">
                {item.list.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function References({ copy }: { copy: SiteCopy }) {
  const references = [
    {
      href: 'https://www.martellerhof.com',
      image: '/assets/img/kunden/martellerhof.png',
      title: 'Hotel Martellerhof',
      label: 'Hotel · Martelltal',
    },
    { title: 'Rona Ranch', label: 'Ranch & Erlebnis' },
    {
      href: 'https://alpen.beauty',
      image: '/assets/img/kunden/alpenbeauty.png',
      title: 'Alpenbeauty',
      label: 'Kosmetikstudio · Martell',
    },
    { title: 'Andrea', label: 'Sprachcoaching · Südtirol' },
    {
      href: 'https://schrittweise-tanz.com',
      image: '/assets/img/kunden/schrittweise.png',
      title: 'Schrittweise',
      label: 'Ballett & Tanz · Naturns',
    },
    {
      href: 'https://freitag.expert',
      image: '/assets/img/kunden/freitag-expert.png',
      title: 'Freitag Expert IT Lösungen',
      label: 'IT-Dienstleistungen',
    },
  ]

  return (
    <section id="referenzen">
      <div className="wrap">
        <span className="eyebrow">{copy.references.eyebrow}</span>
        <h2>{withOrangePoint(copy.references.title)}</h2>
        <p className="lead">{copy.references.text}</p>
        <div className="namen">
          {references.map((reference) => {
            const content = (
              <>
                <span className="slot">
                  {reference.image ? (
                    <img alt={reference.title} src={reference.image} />
                  ) : (
                    <b>{reference.title}</b>
                  )}
                </span>
                <span>{reference.label}</span>
              </>
            )

            return reference.href ? (
              <a href={reference.href} key={reference.title}>
                {content}
              </a>
            ) : (
              <div key={reference.title}>{content}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Funding({ copy }: { copy: SiteCopy }) {
  return (
    <section>
      <div className="wrap">
        <div className="foerderband">
          <div>
            <span className="eyebrow">{copy.funding.eyebrow}</span>
            <h2>{withOrangePoint(copy.funding.title)}</h2>
            <p className="lead">{copy.funding.text}</p>
          </div>
          <div>
            <div className="big60">{copy.funding.number}</div>
            <span className="big60-lbl">{copy.funding.label}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Team({ copy }: { copy: SiteCopy }) {
  return (
    <section id="team">
      <div className="wrap">
        <span className="eyebrow">{copy.team.eyebrow}</span>
        <h2>{withOrangePoint(copy.team.title)}</h2>
        <p className="lead">{copy.team.text}</p>
        <div className="team">
          {copy.team.people.map(([image, role, name, paragraphs, line]) => (
            <article className="person" key={name}>
              <div className="avatar">
                <img alt={name} src={`/assets/img/${image}`} />
              </div>
              <div>
                <span className="role">{role}</span>
                <h3>{name}</h3>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {line ? <p className="ownline">„{line}“</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq({ copy }: { copy: SiteCopy }) {
  return (
    <section>
      <div className="wrap">
        <span className="eyebrow">{copy.faq.eyebrow}</span>
        <h2>{withOrangePoint(copy.faq.title)}</h2>
        <div className="faq-list">
          {copy.faq.items.map(([question, paragraphs], index) => (
            <details key={question} open={index < 5}>
              <summary>{question}</summary>
              <div className="body">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ copy }: { copy: SiteCopy }) {
  return (
    <section id="kontakt">
      <div className="wrap">
        <span className="eyebrow">{copy.contact.eyebrow}</span>
        <h2>{withOrangePoint(copy.contact.title)}</h2>
        <p className="lead">{copy.contact.text}</p>
        <div className="contact">
          <div className="cdata">
            <img
              className="kontakt-logo"
              alt="T-Wolf.it Digitalwerkstatt"
              src="/assets/img/logo-wortmarke.png"
            />
            <img
              className="kontakt-marke"
              alt="T-Wolf.it"
              src="/assets/img/bildmarke.png"
            />
            <a href={contactLinks.email}>
              <span className="lbl">{copy.contact.email}</span>
              digitalwerkstatt@t-wolf.it
            </a>
            <a href={contactLinks.phoneIt}>
              <span className="lbl">{copy.contact.phoneIt}</span>
              +39 351 3642110
            </a>
            <a href={contactLinks.phoneDe}>
              <span className="lbl">{copy.contact.phoneDe}</span>
              +49 177 1481418
            </a>
            <a href={contactLinks.whatsapp}>
              <span className="lbl">{copy.contact.whatsapp}</span>
              +39 351 3642110
            </a>
            <span>
              <span className="lbl">{copy.contact.address}</span>
              Tschirland 158, 39025 Naturns (BZ)
            </span>
          </div>
          <form className="formmock" action={contactLinks.email}>
            <label htmlFor="name">{copy.contact.name}</label>
            <input className="fld" id="name" name="name" />
            <label htmlFor="email">{copy.contact.mail}</label>
            <input className="fld" id="email" name="email" type="email" />
            <label htmlFor="phone">{copy.contact.phone}</label>
            <input className="fld" id="phone" name="phone" />
            <label htmlFor="subject">{copy.contact.subject}</label>
            <textarea className="fld big" id="subject" name="subject" />
            <label htmlFor="website">{copy.contact.website}</label>
            <input className="fld" id="website" name="website" />
            <label className="consent">
              <input type="checkbox" />
              <span>{copy.contact.consent}</span>
            </label>
            <button className="btn btn-p" type="submit">
              {copy.contact.submit}
            </button>
            <p className="note">{copy.contact.note}</p>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer({ copy }: { copy: SiteCopy }) {
  return (
    <footer>
      <div className="wrap foot">
        <span>{copy.footer.copyright}</span>
        <span className="sp" />
        <Link to="/imprint">{copy.footer.imprint}</Link>
        <Link to="/privacy">{copy.footer.privacy}</Link>
      </div>
    </footer>
  )
}
