import type { SiteCopy } from '../i18n'

/**
 * The customer quotes, as a single infinite row of cards drifting to the right.
 *
 * The track holds the quotes twice and is animated across exactly half its own
 * width, so the moment the first copy leaves the frame the second copy is
 * sitting pixel-identical behind it and the seam is invisible. The duplicate
 * pass is hidden from assistive technology, which would otherwise read every
 * quote twice.
 *
 * Duration scales with the number of quotes so the cards keep a constant speed
 * whether there are three of them or ten.
 */
export function Testimonials({ copy }: { copy: SiteCopy }) {
  const voices = copy.references.voices
  const duration = `${voices.length * 15}s`

  return (
    <section className="stimmen" id="stimmen">
      <div className="wrap">
        <span className="eyebrow">{copy.voices.eyebrow}</span>
        <h2>{copy.voices.title}</h2>
        <p className="lead">{copy.voices.text}</p>
      </div>

      <div
        className="marquee"
        style={{ '--marquee-duration': duration } as React.CSSProperties}
      >
        <div className="marquee-track">
          {voices.map(([quote, name, role]) => (
            <VoiceCard key={name} name={name} quote={quote} role={role} />
          ))}
          <div className="marquee-copy" aria-hidden="true">
            {voices.map(([quote, name, role]) => (
              <VoiceCard key={name} name={name} quote={quote} role={role} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VoiceCard({
  name,
  quote,
  role,
}: {
  name: string
  quote: string
  role: string
}) {
  return (
    <figure className="voice">
      <blockquote>{quote}</blockquote>
      <figcaption className="who">
        {/* No customer portraits exist for these quotes, so the mark is an
            initial in the brand circle rather than a stock face. */}
        <span className="who-mark" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
        <span>
          <b>{name}</b>
          {role}
        </span>
      </figcaption>
    </figure>
  )
}
