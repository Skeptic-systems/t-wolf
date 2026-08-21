export const LOCALES = ['de', 'en', 'it'] as const

export type Locale = (typeof LOCALES)[number]
export type PageKey = 'home' | 'privacy' | 'imprint'
export type LegalSection = {
  title: string
  paragraphs: Array<string>
  list?: Array<string>
}

export type ServiceItem = {
  icon: string
  title: string
  text: string
  list: Array<string>
  small?: boolean
}

export const FALLBACK_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 't-wolf.locale'

export const localeLabels: Record<Locale, string> = {
  de: 'DE',
  en: 'EN',
  it: 'IT',
}

export const pages: Record<PageKey, { path: string }> = {
  home: { path: '/' },
  privacy: { path: '/privacy' },
  imprint: { path: '/imprint' },
}

export const siteBaseUrl = 'https://t-wolf.it'
export const socialImagePath = '/social-preview.svg'

export type SiteCopy = {
  seo: Record<PageKey, { title: string; description: string }>
  nav: Record<
    | 'skip'
    | 'known'
    | 'process'
    | 'services'
    | 'references'
    | 'team'
    | 'cta'
    | 'menu'
    | 'language',
    string
  >
  hero: Record<
    | 'eyebrow'
    | 'title'
    | 'text'
    | 'cta'
    | 'note'
    | 'whatsapp'
    | 'call'
    | 'role'
    | 'subtitle'
    | 'place',
    string
  >
  known: { eyebrow: string; title: string; text: string; items: Array<string> }
  process: {
    eyebrow: string
    title: string
    text: string
    steps: Array<[string, string]>
  }
  workshop: {
    eyebrow: string
    freitagTitle: string
    freitagText: string
    done: string
    skipped: string
    doneItems: Array<string>
    skippedItems: Array<string>
    quote: string
    bridge: string
    martellerTitle: string
    martellerText: string
    weekly: string
    weeklyItems: Array<string>
    plus: string
    plusItems: Array<string>
    techTitle: string
    techText: string
    techEyebrow: string
  }
  services: {
    eyebrow: string
    title: string
    text: string
    claim: string
    items: Array<ServiceItem>
  }
  references: {
    eyebrow: string
    title: string
    text: string
    voices: Array<[string, string, string]>
  }
  funding: Record<'eyebrow' | 'title' | 'text' | 'number' | 'label', string>
  team: {
    eyebrow: string
    title: string
    text: string
    people: Array<[string, string, string, Array<string>, string?]>
  }
  faq: { eyebrow: string; title: string; items: Array<[string, Array<string>]> }
  contact: Record<
    | 'eyebrow'
    | 'title'
    | 'text'
    | 'email'
    | 'phoneIt'
    | 'phoneDe'
    | 'whatsapp'
    | 'address'
    | 'name'
    | 'mail'
    | 'phone'
    | 'subject'
    | 'website'
    | 'consent'
    | 'submit'
    | 'note',
    string
  >
  footer: Record<'copyright' | 'imprint' | 'privacy', string>
  legal: {
    privacyTitle: string
    privacyEyebrow: string
    privacyStand: string
    privacySections: Array<LegalSection>
    imprintTitle: string
    imprintEyebrow: string
    imprintStand: string
    imprintSections: Array<LegalSection>
    back: string
  }
  seoPanel: Record<
    | 'title'
    | 'description'
    | 'google'
    | 'x'
    | 'discord'
    | 'metadata'
    | 'missing',
    string
  >
}

const sharedServices: SiteCopy['services']['items'] = [
  {
    icon: 'social-media.svg',
    title: 'Sichtbarkeit und Social Media',
    text: 'Wir sorgen dafür, dass dein Betrieb dort auftaucht, wo deine Kunden ohnehin unterwegs sind. Du musst abends nicht mehr selbst posten, planen oder Anzeigen prüfen.',
    list: [
      'Instagram, Facebook, TikTok, YouTube und LinkedIn',
      'Plan, Beiträge und laufende Betreuung',
      'Werbeanzeigen mit einem Budget, das sich rechnet',
      'Strategie und Zielgruppen',
      'Deine Bewertungen beantworten',
    ],
  },
  {
    icon: 'website.svg',
    title: 'Website und gefunden werden',
    text: 'Eine schnelle, saubere Website, die zu deinem Betrieb passt. Und überall dieselben Angaben, bei Google, auf den Portalen und inzwischen auch dort, wo Leute die KI fragen.',
    list: [
      'Website und Webdesign, von Thomas selbst programmiert',
      'Domain, Hosting und laufende Wartung',
      'Google-Unternehmensprofil und Buchungsportale',
      'Suchmaschinenoptimierung (SEO), damit Google dich findet',
      'Gefunden werden, wenn Leute die KI fragen',
      'Verständliche Berichte statt Zahlenfriedhof',
    ],
  },
  {
    icon: 'branding-design.svg',
    title: 'Auftritt, Bilder und Drucksachen',
    text: 'Wenn der Auftritt noch nicht zusammenpasst, machen wir ihn wiedererkennbar. Auf Wunsch liefern wir auch das Material dazu.',
    list: [
      'Marke, Logo und Bildsprache',
      'Visitenkarten, Flyer und Tischaufsteller',
      'Fotos und kurze Videos',
      'Drohnenaufnahmen von deinem Betrieb',
    ],
  },
  {
    icon: 'digitale-loesungen.svg',
    title: 'Technik und eigene Lösungen',
    text: 'Beschreib das Problem, auch wenn du keine Ahnung hast, wie die Lösung aussehen soll. Thomas nimmt es auseinander und baut dir etwas, das dazu passt.',
    list: [
      'Software, die es so nicht zu kaufen gibt',
      'Self-Check-in, Telefonstimme, Automatisierung',
      'Server, Hosting und die Technik dahinter',
      'Alles selbst programmiert',
    ],
  },
  {
    icon: 'ki-beratung.svg',
    title: 'KI, die wirklich Arbeit abnimmt',
    text: 'Längst nicht jede KI-Idee spart Zeit. Wir schauen uns deinen Alltag an, suchen aus, was sich lohnt, und sagen dir ehrlich, wo es nichts bringt.',
    list: [
      'KI-Beratung für deine Abläufe',
      'Wiederkehrende Aufgaben automatisieren',
      'Schulungen für dich und dein Team',
      'KI-Lösungen, die zu deinem Betrieb passen',
    ],
  },
  {
    icon: 'google-und-ki.svg',
    title: 'Und der Kleinkram, der immer liegen bleibt',
    text: 'Die Zeit geht selten beim großen Projekt drauf. Sie geht bei hundert kleinen Baustellen drauf, an die keiner denkt. Genau die dürfen bei uns landen.',
    list: [
      'Das Google-Konto zurückholen, auf das im Betrieb keiner mehr Zugriff hat',
      'Den Eintrag bei den Buchungsportalen geraderücken, der falsch angelegt war',
      'Die Rundmails von Verbänden und Portalen lesen und umsetzen, was drinsteht',
      'Wenn Mail, WLAN oder ein Rechner klemmt, kannst du anrufen',
    ],
    small: true,
  },
]

export const content = {
  de: {
    seo: {
      home: {
        title:
          'Social Media & Website für kleine Betriebe in Südtirol | T-Wolf.it',
        description:
          'T-Wolf.it schaut auf Website, Social Media, Werbung, Technik und KI kleiner Betriebe und macht nur, was wirklich sinnvoll ist.',
      },
      privacy: {
        title: 'Datenschutz | T-Wolf.it',
        description:
          'Datenschutzhinweise von T-Wolf.it für Kontakt, Cookies, Spracheinstellung und technische Bereitstellung.',
      },
      imprint: {
        title: 'Impressum | T-Wolf.it',
        description:
          'Impressum von T-Wolf.it, Digitalwerkstatt von Dipl.-Ing. Thomas Wolfsteiner in Naturns, Südtirol.',
      },
    },
    nav: {
      skip: 'Zum Inhalt springen',
      known: 'Kennst du das',
      process: 'So läuft das',
      services: 'Was wir machen',
      references: 'Referenzen',
      team: 'Über uns',
      cta: 'Wir schauen hin',
      menu: 'Menü',
      language: 'Sprache',
    },
    hero: {
      eyebrow: 'Digitalwerkstatt · Naturns · Südtirol',
      title:
        'Website, Social Media, Werbung, Technik. Und keiner im Haus kennt sich richtig aus.',
      text: 'Wir sehen uns deinen Betrieb an, gehen einmal alles durch und sagen dir ehrlich, was sich für dich lohnt. Dann machen wir genau das. Den Rest lassen wir weg.',
      cta: 'Wir schauen hin',
      note: 'Kostet nichts und verpflichtet dich zu nichts.',
      whatsapp: 'Lieber auf WhatsApp:',
      call: 'Oder anrufen:',
      role: 'Dipl.-Ing. Thomas Wolfsteiner',
      subtitle: 'Inhaber · Senior-Software-Entwickler',
      place: 'Naturns, Südtirol',
    },
    known: {
      eyebrow: 'Kommt dir das bekannt vor',
      title: 'Diese vier Sätze hören wir am häufigsten.',
      text: 'Wenn du dich da wiederfindest: Das sind genau die Betriebe, für die wir arbeiten. Du führst deinen Laden selbst, du hast keine Marketingabteilung im Rücken, und abends um zehn bleibt genau das liegen. Da fangen wir an.',
      items: [
        'Unsere Website hat damals eine Agentur gemacht. Muss man mit der eigentlich was machen?',
        'Können wir das Posten nicht selber machen?',
        'Kann man denn über Social Media Werbung machen?',
        'Kannst du da mal schauen?',
      ],
    },
    process: {
      eyebrow: 'So läuft das',
      title: 'Erst hinschauen. Dann sagen, was Sinn macht. Dann machen.',
      text: 'Eine Werkstatt ist der Ort, wo jemand zuerst hinschaut und dir dann sagt, was wirklich nötig ist. Genau so arbeiten wir.',
      steps: [
        [
          'Wir schauen hin.',
          'Ein Anruf oder eine kurze Nachricht reicht. Wir sehen uns deinen Betrieb an: was gut läuft, was dich bremst, wo deine Kunden unterwegs sind.',
        ],
        [
          'Wir sagen ehrlich, was Sinn macht.',
          'Auch wenn das heißt: Das brauchst du nicht. Erst danach bekommst du ein Angebot mit den Bausteinen, die zu deinem Betrieb passen.',
        ],
        [
          'Wir machen, gemeinsam mit dir.',
          'Du gibst frei, bevor etwas online geht. Danach siehst du in verständlichen Berichten, was es gebracht hat.',
        ],
      ],
    },
    workshop: {
      eyebrow: 'Aus der Werkstatt',
      freitagTitle: 'Bei Michael war die Antwort: ein Kanal.',
      freitagText:
        'Michael Freitag führt selbst eine IT-Firma und wollte mehr Anfragen. Gemacht haben wir sein LinkedIn-Profil und eine Schulung, damit er die Plattform danach selbst bedienen kann. Mehr war nicht nötig.',
      done: 'Gemacht',
      skipped: 'Nicht gebraucht',
      doneItems: [
        'LinkedIn-Profil aufgebaut',
        'Schulung, damit er es selbst kann',
      ],
      skippedItems: [
        'Instagram',
        'TikTok',
        'Neue Website',
        'Laufendes Werbebudget',
      ],
      quote:
        'Die T-Wölfe haben mein LinkedIn-Profil optimiert und mir gezeigt, wie ich die Plattform richtig nutzt. Seither hat sich meine Reichweite vervielfacht.',
      bridge: 'Und einmal anders herum.',
      martellerTitle: 'Beim Martellerhof sind es vier Kanäle.',
      martellerText:
        'Das Hotel Martellerhof im Martelltal wird von der Familie selbst geführt. Den ganzen Auftritt nach außen übernehmen wir, online wie auf Papier.',
      weekly: 'Jede Woche',
      weeklyItems: [
        'Instagram, Facebook, TikTok und YouTube',
        'Beiträge, Reels und Stories',
        'Antworten auf Google-Bewertungen und Kommentare',
      ],
      plus: 'Dazu',
      plusItems: [
        'Werbekampagnen auf Instagram und Facebook',
        'Drucksachen und Anzeigen auf Papier',
        'Der Eintrag bei den Buchungsportalen',
      ],
      techTitle: 'Zwei Websites von Thomas kannst du sofort aufmachen.',
      techEyebrow: 'Technik zum Nachschauen',
      techText:
        'Die eine ist die hier. Selbst programmiert, gehostet in Deutschland, und kein Messwerkzeug lädt, bevor du zugestimmt hast. Die zweite ist kurswechsel.info.',
    },
    services: {
      eyebrow: 'Was wir übernehmen',
      title: 'Du musst nicht wissen, was du brauchst.',
      text: 'Erzähl uns, was im Betrieb liegen bleibt, nicht funktioniert oder endlich besser laufen soll. Wir schauen dahinter und nehmen nur das dazu, was wirklich nötig ist.',
      claim:
        'Sichtbarkeit: so individuell wie dein Betrieb, so groß wie dein Bedarf',
      items: sharedServices,
    },
    references: {
      eyebrow: 'Referenzen',
      title: 'Betriebe, die uns vertrauen.',
      text: 'Was wir für wen gemacht haben, erzählen wir dir gern im Gespräch. Auf der Website halten wir uns damit zurück, und mit deinem Betrieb würden wir es genauso halten.',
      voices: [
        [
          '„Ich bin einfach froh, dass ihr das übernehmt, so kann ich mich aufs Tanzen konzentrieren.“',
          'Eva',
          'Schrittweise · Tanzschule',
        ],
        [
          '„Seit die zwoa inser Social Media machen, sein die Buchungen und inser Bekanntheit deutlich aufigongen. Und mir gfollt, wia vertrauensvoll mir zommorbeitn.“',
          'Babsi',
          'Hotel Martellerhof · Martell',
        ],
        [
          '„Seither hat sich meine Reichweite vervielfacht, und ich bekomme Auftragsanfragen, was vorher schlicht nicht passiert ist.“',
          'Michael Freitag',
          'Freitag Expert IT Solutions',
        ],
      ],
    },
    funding: {
      eyebrow: 'Förderung',
      title: 'Hol dir das Fördergeld, bevor du startest.',
      text: 'Südtirol fördert die Digitalisierung kleiner Betriebe. Website, Social Media, Schulungen und eigens entwickelte Software zählen dazu. Wichtig, und hier machen viele einen Fehler: Der Antrag muss vor Projektbeginn gestellt werden. Sprich uns früh an, dann planen wir das gleich mit ein.',
      number: '60%',
      label: 'Bis zu 60 % für Betriebe in Südtirol',
    },
    team: {
      eyebrow: 'Über uns',
      title: 'Zwei Menschen, ein Team.',
      text: 'Kein anonymer Apparat. Du arbeitest direkt mit uns beiden.',
      people: [
        [
          'thomas-portrait.webp',
          'Inhaber · Technik, KI & Entwicklung',
          'Thomas Wolfsteiner',
          [
            'Dipl.-Ing. für Elektrotechnik, seit über 25 Jahren Entwickler in der Großindustrie. Dieselbe Sorgfalt steckt jetzt in dem, was er für deinen Betrieb baut. Was bei dir technisch nicht läuft, landet bei ihm: Websites und Server, Schulungen für dein Team, ein Gerät für den Check-in oder der Rechner, der nicht mehr ins Netz kommt. Gibt es das Passende nicht zu kaufen, baut er es selbst.',
          ],
          'Probleme lösen ist der Teil, der mir Spaß macht.',
        ],
        [
          'claudia-portrait.webp',
          'Marketing & Social Media',
          'Claudia',
          [
            'Ausgebildete Social Media Managerin. Strategie, Content, Betreuung der Kanäle und Werbeanzeigen, und dazu die direkte Zusammenarbeit mit den Betrieben. Sie baut Auftritte auf, die zu kleinen Betrieben passen: persönlich, humorvoll, mit Gespür für Ton und Marke.',
          ],
        ],
      ],
    },
    faq: {
      eyebrow: 'Häufige Fragen',
      title: 'Was kleine Betriebe uns oft fragen.',
      items: [
        [
          'Für wen arbeitet ihr?',
          [
            'Für kleine Betriebe in Südtirol, Deutschland, Österreich und der Schweiz: Hotels und Pensionen, Beauty- und Wellnessbetriebe, Handwerk, Tanzschulen, Coaches, Selbständige und kleine IT-Firmen. Also für Menschen, die ihren Betrieb selbst führen und keine Marketingabteilung im Rücken haben.',
            'Für Konzerne arbeiten wir bewusst nicht. Große Unternehmen brauchen andere Prozesse, andere Budgets und andere Ansprechpartner. Wir wollen dort gut sein, wo jemand mit uns am Tisch sitzt und sagt, was ihn wirklich drückt.',
            'Zu klein gibt es bei uns nicht. Je kleiner dein Betrieb, desto eher reicht ein einziger Baustein, um etwas zu bewegen.',
          ],
        ],
        [
          'Was kostet das ungefähr?',
          [
            'Eine Preisliste nennen wir bewusst nicht, weil eine Zahl ohne deinen Zusammenhang nichts aussagt. Eine einfache Website ist etwas völlig anderes als eine laufende Betreuung mit Anzeigen und eigener Software.',
            'Was wir dir zusagen können: Wir schnüren das Paket, das zu deinem Budget passt. Sag uns offen, was du im Monat ausgeben kannst, und wir sagen dir ehrlich, was damit sinnvoll machbar ist. Reicht es für das, was du dir vorstellst, nicht aus, sagen wir das auch und schlagen einen kleineren Einstieg vor, der trotzdem etwas bewegt.',
          ],
        ],
        [
          'Werden die Leistungen gefördert?',
          [
            'Ja. Das Land Südtirol fördert die Digitalisierung kleiner Betriebe mit bis zu 60 %. Voraussetzung ist ein Betrieb mit Sitz in Südtirol, weniger als zehn Mitarbeitern, höchstens zwei Millionen Euro Jahresumsatz und einer Eintragung bei der Handelskammer Bozen oder einer Berufskammer. Gefördert werden Vorhaben zwischen 2.000 und 15.000 Euro. Gefördert werden unter anderem Website und Onlineshop, Social-Media-Betreuung, Beratung, Schulungen und individuell entwickelte Software.',
            'Der Antrag muss vor Projektbeginn gestellt werden. Wer erst beauftragt und dann den Antrag stellt, bekommt nichts. Für Betriebe in Deutschland, Österreich und der Schweiz gelten andere Programme, auch dazu beraten wir dich.',
          ],
        ],
        [
          'Können wir das nicht selbst machen?',
          [
            'Klar könnt ihr. Viele fangen so an, und die ersten Wochen läuft es auch gut. Dann kommt ein großer Auftrag rein, jemand fällt aus, die Saison zieht an, und der letzte Beitrag ist plötzlich drei Wochen alt. Genau da bricht es meistens ab.',
            'Wenn du es trotzdem selbst machen willst, zeigen wir dir, worauf es ankommt, und schulen dich darauf. Manchmal ist das die ehrlichere Empfehlung als eine laufende Betreuung. Und wenn du merkst, dass es neben dem Betrieb doch nicht geht, übernehmen wir.',
          ],
        ],
        [
          'Müssen wir alles bei euch machen?',
          [
            'Nein. Wenn du schon eine Website hast, mit der du zufrieden bist, lassen wir sie in Ruhe. Wenn dein Sohn die Fotos macht: prima, dann machen wir daraus gute Beiträge. Wir übernehmen genau die Bausteine, bei denen wir dir wirklich etwas abnehmen.',
          ],
        ],
        [
          'Helft ihr auch, wenn im Betrieb was mit der Technik klemmt?',
          [
            'Ja. Wenn die Website hakt, das Mailkonto streikt, das WLAN im Haus nicht mehr tut oder ein Rechner Ärger macht, ruf an. Thomas ist Dipl.-Ing. für Elektrotechnik und seit über 25 Jahren Software-Entwickler, der schaut sich das an. Meistens ist es schneller erledigt, als wenn du erst jemanden suchst.',
            'Einen Notdienst rund um die Uhr können wir zu zweit allerdings nicht leisten. Wenn dein Betrieb jemanden braucht, der jederzeit sofort erreichbar ist, sagen wir dir das ehrlich und empfehlen dir eine passende Adresse.',
          ],
        ],
        [
          'Wie lange dauert es, bis man was merkt?',
          [
            'Länger, als die meisten hoffen. In den ersten Wochen passiert sichtbar wenig, weil erst Material, Rhythmus und Zielgruppe stehen müssen. Bewegung sehen wir meist nach einigen Monaten, zuerst bei Reichweite und Profilbesuchen, später bei den Anfragen.',
            'Manches geht schneller. Ein gepflegtes Google-Unternehmensprofil bringt oft am ehesten etwas, weil dort Leute suchen, die ohnehin gerade kaufen wollen. Werbeanzeigen wirken sofort, kosten dafür laufend Budget. Was bei dir zuerst greift, sagen wir dir, nachdem wir hingeschaut haben.',
          ],
        ],
        [
          'Mache ich mich damit von euch abhängig?',
          [
            'Nein, und darauf legen wir Wert. Alle Zugänge gehören dir: Domain, Website, deine Social-Media-Konten, dein Google-Unternehmensprofil, dein Werbekonto. Wir arbeiten darin, wir besitzen sie nicht.',
            'Wenn du willst, zeigen wir dir, wie du Teile davon selbst übernimmst. Bei Michael Freitag war genau das der Auftrag: das Profil aufbauen und ihn so schulen, dass er es danach allein bedienen kann.',
          ],
        ],
        [
          'Wie haltet ihr es mit dem Datenschutz?',
          [
            'Ernst. Für die Statistik nutzen wir Matomo auf unserem eigenen Hosting in Deutschland statt Google Analytics, das ist in Italien wichtig, weil die Datenschutzbehörde Google Analytics mehrfach beanstandet hat. Unsere Messung läuft ohne Cookies, mit gekürzter IP-Adresse, und ein eingeschaltetes „Do Not Track“ respektieren wir. Deshalb kommt diese Website ohne Cookie-Hinweis aus. Sobald etwas dazukommt, das wirklich eine Einwilligung braucht, etwa ein Meta-Pixel für Anzeigen, bauen wir es hinter die Zustimmung. Das halten wir bei deiner Seite genauso.',
          ],
        ],
        [
          'Was heißt „gefunden werden bei der KI“?',
          [
            'Immer mehr Menschen fragen inzwischen ChatGPT oder Perplexity statt Google: „Wo finde ich ein familienfreundliches Hotel im Vinschgau?“ Die KI antwortet mit ein paar Namen, und wer nicht dabei ist, kommt in diesem Gespräch schlicht nicht vor. Kein zweiter Platz, keine Seite zwei.',
            'Damit dein Betrieb in solchen Antworten auftaucht, braucht deine Website technisch sauber ausgezeichnete Angaben (strukturierte Daten), klare, zitierfähige Fakten statt Werbesprache und die Erlaubnis für die KI-Crawler, sie überhaupt zu lesen. Das können bisher die wenigsten. Wir haben es auf dieser Website selbst umgesetzt.',
          ],
        ],
      ],
    },
    contact: {
      eyebrow: 'Kontakt',
      title: 'Erzähl uns, was dich gerade bremst.',
      text: 'Ein Anruf oder eine kurze Nachricht reicht. Wir melden uns, schauen hin und sagen dir ehrlich, was Sinn macht.',
      email: 'E-Mail',
      phoneIt: 'Telefon Italien',
      phoneDe: 'Telefon Deutschland',
      whatsapp: 'WhatsApp',
      address: 'Werkstatt',
      name: 'Name',
      mail: 'E-Mail',
      phone: 'Telefon optional',
      subject: 'Worum geht es?',
      website: 'Website',
      consent:
        'Ich bin einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage verarbeitet werden.',
      submit: 'Nachricht abschicken',
      note: 'Das Formular ist statisch vorbereitet und braucht später nur noch einen Versand-Endpunkt.',
    },
    footer: {
      copyright:
        '© 2026 T-Wolf.it · Digitalwerkstatt · Dipl.-Ing. Thomas Wolfsteiner · Tschirland 158, 39025 Naturns (BZ) · P.IVA 03289650214',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
    },
    legal: {
      privacyTitle: 'Datenschutz',
      privacyEyebrow: 'Datenschutzerklärung · Informativa privacy',
      privacyStand:
        'Stand August 2026 · Verordnung (EU) 2016/679 und D.Lgs. 196/2003 in geltender Fassung',
      privacySections: [
        {
          title: 'Verantwortlicher',
          paragraphs: [
            'T-Wolf.it · Digitalwerkstatt, Inhaber Dipl.-Ing. Thomas Wolfsteiner, Tschirland 158, 39025 Naturns (BZ), Italien. E-Mail: digitalwerkstatt@t-wolf.it. Partita IVA: 03289650214.',
            'Ein Datenschutzbeauftragter ist nicht bestellt. Die Voraussetzungen des Art. 37 DSGVO liegen nicht vor.',
          ],
        },
        {
          title: 'Hosting und Server-Protokolle',
          paragraphs: [
            'Diese Website liegt auf einem Webhosting-Paket der Hetzner Online GmbH. Die Server stehen in Deutschland, also innerhalb der Europäischen Union.',
            'Bei jedem Aufruf werden technisch notwendige Daten protokolliert. Zweck ist der sichere und störungsfreie Betrieb. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Protokolle werden nach sieben Tagen gelöscht.',
          ],
          list: [
            'gekürzte IP-Adresse',
            'Datum und Uhrzeit des Zugriffs',
            'aufgerufene Seite und übertragene Datenmenge',
            'Browsertyp und Betriebssystem',
          ],
        },
        {
          title: 'Kontaktaufnahme',
          paragraphs: [
            'Wenn Sie uns über das Formular oder per E-Mail schreiben, verarbeiten wir die von Ihnen gemachten Angaben, um Ihre Anfrage zu beantworten.',
            'Das Formular speichert nichts in einer Datenbank und bindet keinen Drittanbieter ein. Ihre Nachricht wird auf unserem Server unmittelbar zu einer E-Mail gemacht.',
            'Sie können uns telefonisch oder über WhatsApp erreichen. Bei WhatsApp werden Ihre Nachricht und Ihre Rufnummer über die Server von WhatsApp Ireland Ltd. übermittelt.',
          ],
        },
        {
          title: 'Statistik mit Matomo',
          paragraphs: [
            'Für die Reichweitenmessung kann Matomo auf eigenem Hosting in Deutschland eingesetzt werden. Es findet keine Übermittlung an Dritte statt, die IP-Adresse wird gekürzt, und die Zahlen dienen der Verbesserung der Website.',
            'Matomo läuft ohne Cookies, die IP-Adresse wird vor der Speicherung um zwei Bytes gekürzt, ein aktiviertes „Do Not Track“ im Browser wird respektiert, und die Einzeldaten werden nach 183 Tagen automatisch gelöscht.',
          ],
        },
        {
          title: 'Cookies und ähnliche Techniken',
          paragraphs: [
            'Diese Website setzt keinen Cookie-Hinweis ein. Die Spracheinstellung wird lokal im Browser gespeichert, verändert aber nicht den URL-Pfad.',
            'Sollte künftig eine Technik hinzukommen, die eine Einwilligung braucht, wird vorher gefragt und diese Erklärung ergänzt.',
          ],
        },
        {
          title: 'Schriftarten',
          paragraphs: [
            'Alle Schriften werden lokal von dieser Website geladen. Es besteht keine Verbindung zu Google Fonts oder einem anderen fremden Dienst.',
          ],
        },
        {
          title: 'Empfänger, Aufbewahrung und Rechte',
          paragraphs: [
            'Daten werden nur weitergegeben, wenn es für die Erfüllung der Aufgaben oder gesetzlicher Pflichten nötig ist, etwa an Steuerberatung, Behörden, Banken oder technische Dienstleister mit Auftragsverarbeitungsvertrag.',
            'Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck nötig ist. Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch.',
            'Beschwerden können an den Garante per la protezione dei dati personali in Rom oder an die Behörde Ihres Wohnorts gerichtet werden.',
          ],
        },
      ],
      imprintTitle: 'Impressum',
      imprintEyebrow: 'Angaben zum Anbieter · Note legali',
      imprintStand: 'Stand August 2026',
      imprintSections: [
        {
          title: 'Anbieter',
          paragraphs: [
            'T-Wolf.it · Digitalwerkstatt',
            'Freiberufliche Tätigkeit (libero professionista)',
            'Inhaber: Dipl.-Ing. Thomas Wolfsteiner',
            'Tschirland 158, 39025 Naturns (BZ), Italien',
            'Telefon Italien: +39 351 3642110',
            'Telefon Deutschland: +49 177 1481418',
            'E-Mail: digitalwerkstatt@t-wolf.it',
            'Partita IVA: 03289650214',
            'USt-IdNr. für Geschäfte innerhalb der EU: IT03289650214',
            'Steuernummer / Codice fiscale: WLFTMS70T24Z112S',
          ],
        },
        {
          title: 'Verantwortlich für den Inhalt',
          paragraphs: ['Dipl.-Ing. Thomas Wolfsteiner, Anschrift wie oben.'],
        },
        {
          title: 'Rechtlicher Rahmen',
          paragraphs: [
            'Diese Seite erfüllt die Angabepflichten nach Art. 35 DPR 633/1972 sowie die Informationspflichten des D.Lgs. 70/2003. Der Sitz des Unternehmens ist Italien, es gilt italienisches Recht.',
            'Die Tätigkeit wird freiberuflich ausgeübt; Freiberufler werden nicht in das Handelsregister der Handelskammer Bozen eingetragen, eine REA-Nummer gibt es daher nicht.',
            'Es handelt sich um keine reglementierte Berufstätigkeit. „Dipl.-Ing.“ ist ein akademischer Grad, keine geschützte Berufsbezeichnung.',
          ],
        },
        {
          title: 'Haftung, Urheberrecht und Bildnachweis',
          paragraphs: [
            'Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen.',
            'Diese Website verweist an einzelnen Stellen auf fremde Websites. Auf deren Inhalte besteht kein Einfluss.',
            'Texte, Bilder, Grafiken und Gestaltung dieser Website sind urheberrechtlich geschützt. Porträtaufnahmen: Thorsten Kaufmann.',
          ],
        },
        {
          title: 'Streitbeilegung',
          paragraphs: [
            'Unsere Leistungen richten sich an Unternehmen, Selbständige und Freiberufler, nicht an Verbraucher. Eine Verpflichtung zur Teilnahme an einem Streitbeilegungsverfahren besteht daher nicht.',
          ],
        },
      ],
      back: 'Zurück zur Startseite',
    },
    seoPanel: {
      title: 'SEO-Vorschau',
      description: 'Aktuelle Head-Metadaten der geladenen Route.',
      google: 'Google Suche',
      x: 'X / Twitter',
      discord: 'Discord / Slack',
      metadata: 'Metadaten',
      missing: 'Fehlt',
    },
  },
  en: {
    seo: {
      home: {
        title:
          'Social media and websites for small businesses in South Tyrol | T-Wolf.it',
        description:
          'T-Wolf.it reviews websites, social media, ads, tech and AI for small businesses and only builds what actually makes sense.',
      },
      privacy: {
        title: 'Privacy | T-Wolf.it',
        description:
          'Privacy notes for T-Wolf.it, language storage, contact data and static website operation.',
      },
      imprint: {
        title: 'Imprint | T-Wolf.it',
        description:
          'Legal notice for T-Wolf.it, the digital workshop by Dipl.-Ing. Thomas Wolfsteiner in Naturns, South Tyrol.',
      },
    },
    nav: {
      skip: 'Skip to content',
      known: 'Sound familiar',
      process: 'How it works',
      services: 'What we do',
      references: 'References',
      team: 'About us',
      cta: 'We take a look',
      menu: 'Menu',
      language: 'Language',
    },
    hero: {
      eyebrow: 'Digital workshop · Naturns · South Tyrol',
      title:
        'Website, social media, ads, tech. And nobody in-house really knows what to do.',
      text: 'We look at your business, go through everything once and tell you honestly what is worth doing. Then we do exactly that. We leave the rest out.',
      cta: 'We take a look',
      note: 'Costs nothing and commits you to nothing.',
      whatsapp: 'Prefer WhatsApp:',
      call: 'Or call:',
      role: 'Dipl.-Ing. Thomas Wolfsteiner',
      subtitle: 'Owner · Senior software developer',
      place: 'Naturns, South Tyrol',
    },
    known: {
      eyebrow: 'Sound familiar',
      title: 'These are the four sentences we hear most often.',
      text: 'If you recognize yourself here, you are exactly the kind of business we work for. You run your company yourself, without a marketing department behind you.',
      items: [
        'An agency built our website back then. Do we actually have to do anything with it?',
        'Could we not just post ourselves?',
        'Can you advertise on social media?',
        'Could you just take a look?',
      ],
    },
    process: {
      eyebrow: 'How it works',
      title: 'Look first. Then say what makes sense. Then build.',
      text: 'A workshop is where someone looks carefully first and then tells you what is really needed. That is how we work.',
      steps: [
        [
          'We take a look.',
          'A call or short message is enough. We look at what works, what slows you down and where your customers are.',
        ],
        [
          'We say honestly what makes sense.',
          'Even when that means: you do not need this. Then you get an offer with only the pieces that fit.',
        ],
        [
          'We build it together with you.',
          'You approve things before they go online, and afterwards you get understandable reports.',
        ],
      ],
    },
    workshop: {
      eyebrow: 'From the workshop',
      freitagTitle: 'For Michael the answer was: one channel.',
      freitagText:
        'Michael Freitag runs an IT company and wanted more inquiries. We built his LinkedIn profile and trained him to run the platform himself afterwards.',
      done: 'Done',
      skipped: 'Not needed',
      doneItems: [
        'Built the LinkedIn profile',
        'Training so he can run it himself',
      ],
      skippedItems: ['Instagram', 'TikTok', 'New website', 'Ongoing ad budget'],
      quote:
        'The T-Wolves optimized my LinkedIn profile and showed me how to use the platform properly. Since then my reach has multiplied.',
      bridge: 'And the other way around.',
      martellerTitle: 'For Martellerhof it is four channels.',
      martellerText:
        'Hotel Martellerhof in Martell Valley is family-run. We handle the whole external presence, online and on paper.',
      weekly: 'Every week',
      weeklyItems: [
        'Instagram, Facebook, TikTok and YouTube',
        'Posts, reels and stories',
        'Google reviews and comments',
      ],
      plus: 'Also',
      plusItems: [
        'Ad campaigns',
        'Print material and ads',
        'Booking portal entries',
      ],
      techTitle: 'Two websites by Thomas are ready to inspect.',
      techEyebrow: 'Technology you can inspect',
      techText:
        'One is this one. Self-coded, hosted in Germany, and no tracking tool loads before consent. The second is kurswechsel.info.',
    },
    services: {
      eyebrow: 'What we take over',
      title: 'You do not have to know what you need.',
      text: 'Tell us what keeps being left behind in the business. We look behind it and only add what is really necessary.',
      claim: 'Visibility: as individual as your business, as big as your need',
      items: [
        {
          icon: 'social-media.svg',
          title: 'Visibility and social media',
          text: 'We make sure your business appears where your customers already are. You no longer have to post, plan or check ads late in the evening.',
          list: [
            'Instagram, Facebook, TikTok, YouTube and LinkedIn',
            'Plan, posts and ongoing support',
            'Ads with a budget that makes sense',
            'Strategy and target groups',
            'Replying to your reviews',
          ],
        },
        {
          icon: 'website.svg',
          title: 'Website and being found',
          text: 'A fast, clean website that fits your business. And consistent information everywhere, on Google, portals and where people ask AI.',
          list: [
            'Website and web design, coded by Thomas',
            'Domain, hosting and ongoing maintenance',
            'Google Business Profile and booking portals',
            'Search engine optimization (SEO)',
            'Being found when people ask AI',
            'Understandable reports instead of number fog',
          ],
        },
        {
          icon: 'branding-design.svg',
          title: 'Brand, images and print',
          text: 'If the public presence does not fit together yet, we make it recognizable. We can also provide the material.',
          list: [
            'Brand, logo and visual language',
            'Business cards, flyers and table displays',
            'Photos and short videos',
            'Drone shots of your business',
          ],
        },
        {
          icon: 'digitale-loesungen.svg',
          title: 'Tech and custom solutions',
          text: 'Describe the problem, even if you do not know what the solution should look like. Thomas takes it apart and builds something that fits.',
          list: [
            'Software that cannot be bought off the shelf',
            'Self-check-in, phone voice, automation',
            'Servers, hosting and the tech behind it',
            'Everything coded in-house',
          ],
        },
        {
          icon: 'ki-beratung.svg',
          title: 'AI that actually saves work',
          text: 'Not every AI idea saves time. We look at your daily work, choose what is worthwhile and say honestly where it does not help.',
          list: [
            'AI consulting for your workflows',
            'Automating recurring tasks',
            'Training for you and your team',
            'AI solutions that fit your business',
          ],
        },
        {
          icon: 'google-und-ki.svg',
          title: 'The small stuff that keeps waiting',
          text: 'Time is rarely lost on the big project. It is lost on a hundred small issues nobody thinks about. Those can land with us.',
          list: [
            'Recovering the Google account nobody can access',
            'Fixing booking portal entries',
            'Reading and handling platform mails',
            'Mail, Wi-Fi or computer trouble',
          ],
          small: true,
        },
      ],
    },
    references: {
      eyebrow: 'References',
      title: 'Businesses that trust us.',
      text: 'We are happy to explain what we did for whom in a conversation. On the website we keep it discreet, and we would do the same with your business.',
      voices: [
        [
          '“I am simply glad you take care of this, so I can focus on dancing.”',
          'Eva',
          'Schrittweise · Dance school',
        ],
        [
          '“Since they have been doing our social media, bookings and awareness have clearly gone up.”',
          'Babsi',
          'Hotel Martellerhof · Martell',
        ],
        [
          '“Since then my reach has multiplied and I receive project inquiries.”',
          'Michael Freitag',
          'Freitag Expert IT Solutions',
        ],
      ],
    },
    funding: {
      eyebrow: 'Funding',
      title: 'Get the funding before you start.',
      text: 'South Tyrol supports digitization for small businesses. Websites, social media, training and custom software can count. The application must be filed before the project starts.',
      number: '60%',
      label: 'Up to 60% from South Tyrol',
    },
    team: {
      eyebrow: 'About us',
      title: 'Two people, one team.',
      text: 'No anonymous agency machine. You work directly with both of us.',
      people: [
        [
          'thomas-portrait.webp',
          'Owner · Tech, AI & development',
          'Thomas Wolfsteiner',
          [
            'Electrical engineer and developer for more than 25 years. The same care now goes into what he builds for your business. If something technical does not work, it lands with him: websites and servers, training for your team, a check-in device or the computer that no longer gets online. If the right thing cannot be bought, he builds it.',
          ],
          'Solving problems is the part I enjoy.',
        ],
        [
          'claudia-portrait.webp',
          'Marketing & social media',
          'Claudia',
          [
            'Trained social media manager. Strategy, content, channel support and ads, plus direct collaboration with the businesses. She builds public presences that fit small businesses: personal, humorous, with a feel for tone and brand.',
          ],
        ],
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'What small businesses often ask us.',
      items: [
        [
          'Who do you work for?',
          [
            'Small businesses in South Tyrol, Germany, Austria and Switzerland: hotels, beauty and wellness businesses, crafts, dance schools, coaches, freelancers and small IT companies.',
          ],
        ],
        [
          'What does it cost?',
          [
            'We do not publish a price list because a number without your context is not useful. We build the package that fits your budget.',
          ],
        ],
        [
          'Can the work be funded?',
          [
            'Yes. South Tyrol supports digitization for small businesses with up to 60 percent. The application must be filed before the project starts.',
          ],
        ],
        [
          'Can we do it ourselves?',
          [
            'Of course. If that is the honest recommendation, we show you what matters. If it does not fit next to daily work, we take over.',
          ],
        ],
        [
          'Do we have to do everything with you?',
          [
            'No. We take over exactly the pieces where we can really take work off your plate.',
          ],
        ],
        [
          'Do you help with technical trouble?',
          [
            'Yes. If website, mail, Wi-Fi or computers cause trouble, call us. We cannot offer 24/7 emergency service as a team of two.',
          ],
        ],
        [
          'What does being found by AI mean?',
          [
            'Clear, technically marked-up facts help your business appear in answers from ChatGPT, Perplexity and similar systems.',
          ],
        ],
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Tell us what is slowing you down.',
      text: 'A call or short message is enough. We get back to you, look closely and tell you honestly what makes sense.',
      email: 'Email',
      phoneIt: 'Phone Italy',
      phoneDe: 'Phone Germany',
      whatsapp: 'WhatsApp',
      address: 'Workshop',
      name: 'Name',
      mail: 'Email',
      phone: 'Phone optional',
      subject: 'What is it about?',
      website: 'Website',
      consent: 'I agree that my details may be processed to answer my request.',
      submit: 'Send message',
      note: 'The form is statically prepared and only needs a sending endpoint later.',
    },
    footer: {
      copyright:
        '© 2026 T-Wolf.it · Digital workshop · Dipl.-Ing. Thomas Wolfsteiner · Tschirland 158, 39025 Naturns (BZ) · P.IVA 03289650214',
      imprint: 'Imprint',
      privacy: 'Privacy',
    },
    legal: {
      privacyTitle: 'Privacy',
      privacyEyebrow: 'Privacy notice',
      privacyStand: 'Updated August 2026',
      privacySections: [
        {
          title: 'Controller',
          paragraphs: [
            'T-Wolf.it · Digital workshop, owner Dipl.-Ing. Thomas Wolfsteiner, Tschirland 158, 39025 Naturns (BZ), Italy. Email: digitalwerkstatt@t-wolf.it. Partita IVA: 03289650214.',
          ],
        },
        {
          title: 'Hosting and logs',
          paragraphs: [
            'The website is hosted in Germany. Technical access logs are used only for secure and stable operation and are deleted after seven days.',
          ],
        },
        {
          title: 'Contact and language setting',
          paragraphs: [
            'Contact details you send voluntarily are processed only to answer your request. The selected language is stored locally in your browser and does not change the URL path.',
          ],
        },
        {
          title: 'Cookies, fonts and analytics',
          paragraphs: [
            'No cookie notice is shown. Fonts are served locally. The original site describes cookie-free Matomo analytics on self-hosted infrastructure.',
          ],
        },
      ],
      imprintTitle: 'Imprint',
      imprintEyebrow: 'Legal notice',
      imprintStand: 'Updated August 2026',
      imprintSections: [
        {
          title: 'Provider',
          paragraphs: [
            'T-Wolf.it · Digital workshop',
            'Freelance activity (libero professionista)',
            'Owner: Dipl.-Ing. Thomas Wolfsteiner',
            'Tschirland 158, 39025 Naturns (BZ), Italy',
            'Phone Italy: +39 351 3642110',
            'Phone Germany: +49 177 1481418',
            'Email: digitalwerkstatt@t-wolf.it',
            'Partita IVA: 03289650214',
            'EU VAT ID: IT03289650214',
            'Tax number / Codice fiscale: WLFTMS70T24Z112S',
          ],
        },
        {
          title: 'Responsibility and legal framework',
          paragraphs: [
            'Dipl.-Ing. Thomas Wolfsteiner is responsible for the content. The business is based in Italy and Italian law applies.',
            'The activity is freelance and not a regulated profession. “Dipl.-Ing.” is an academic degree.',
          ],
        },
        {
          title: 'Liability and copyright',
          paragraphs: [
            'The contents are prepared with care, but no warranty is given for correctness, completeness or timeliness. Texts, images, graphics and design are protected by copyright.',
          ],
        },
      ],
      back: 'Back to home',
    },
    seoPanel: {
      title: 'SEO Preview',
      description: 'Current head metadata for the loaded route.',
      google: 'Google Search',
      x: 'X / Twitter',
      discord: 'Discord / Slack',
      metadata: 'Metadata',
      missing: 'Missing',
    },
  },
  it: {} as SiteCopy,
} satisfies Record<Locale, SiteCopy>

content.it = {
  ...content.en,
  seo: {
    home: {
      title:
        'Social media e siti web per piccole imprese in Alto Adige | T-Wolf.it',
      description:
        'T-Wolf.it controlla sito, social media, pubblicita, tecnologia e AI per piccole imprese e realizza solo cio che ha senso.',
    },
    privacy: {
      title: 'Privacy | T-Wolf.it',
      description:
        'Informazioni privacy di T-Wolf.it su lingua salvata, contatto e funzionamento statico del sito.',
    },
    imprint: {
      title: 'Note legali | T-Wolf.it',
      description:
        'Note legali di T-Wolf.it, laboratorio digitale di Dipl.-Ing. Thomas Wolfsteiner a Naturno, Alto Adige.',
    },
  },
  nav: {
    skip: 'Vai al contenuto',
    known: 'Ti suona familiare',
    process: 'Come funziona',
    services: 'Cosa facciamo',
    references: 'Referenze',
    team: 'Chi siamo',
    cta: 'Diamo un’occhiata',
    menu: 'Menu',
    language: 'Lingua',
  },
  hero: {
    eyebrow: 'Laboratorio digitale · Naturno · Alto Adige',
    title:
      'Sito web, social media, pubblicita, tecnologia. E in azienda nessuno sa davvero da dove partire.',
    text: 'Guardiamo la tua attivita, controlliamo tutto una volta e ti diciamo onestamente cosa conviene. Poi facciamo proprio quello. Il resto lo lasciamo stare.',
    cta: 'Diamo un’occhiata',
    note: 'Non costa nulla e non ti vincola a niente.',
    whatsapp: 'Preferisci WhatsApp:',
    call: 'Oppure chiama:',
    role: 'Dipl.-Ing. Thomas Wolfsteiner',
    subtitle: 'Titolare · Senior software developer',
    place: 'Naturno, Alto Adige',
  },
  known: {
    eyebrow: 'Ti suona familiare',
    title: 'Queste quattro frasi le sentiamo piu spesso.',
    text: 'Se ti ci riconosci, sei esattamente il tipo di impresa per cui lavoriamo: piccola, diretta, senza reparto marketing alle spalle.',
    items: [
      'Il nostro sito lo ha fatto un’agenzia anni fa. Dobbiamo ancora farci qualcosa?',
      'Non possiamo pubblicare noi sui social?',
      'Si puo fare pubblicita sui social media?',
      'Puoi darci un’occhiata?',
    ],
  },
  process: {
    eyebrow: 'Come funziona',
    title: 'Prima guardare. Poi dire cosa ha senso. Poi fare.',
    text: 'Un laboratorio e un posto dove qualcuno guarda bene e poi ti dice cosa serve davvero. Noi lavoriamo cosi.',
    steps: [
      [
        'Guardiamo.',
        'Basta una chiamata o un messaggio. Vediamo cosa funziona, cosa rallenta e dove si trovano i tuoi clienti.',
      ],
      [
        'Diciamo onestamente cosa ha senso.',
        'Anche quando significa: questo non ti serve. Poi ricevi un’offerta con solo i pezzi adatti.',
      ],
      [
        'Realizziamo insieme a te.',
        'Tu approvi prima che qualcosa vada online e dopo ricevi report comprensibili.',
      ],
    ],
  },
  services: {
    ...content.en.services,
    eyebrow: 'Cosa prendiamo in mano',
    title: 'Non devi sapere tu cosa ti serve.',
    text: 'Raccontaci cosa resta fermo in azienda. Noi guardiamo dietro il problema e aggiungiamo solo cio che serve davvero.',
    claim:
      'Visibilita: individuale come la tua impresa, grande quanto il bisogno',
  },
  references: {
    eyebrow: 'Referenze',
    title: 'Aziende che si fidano di noi.',
    text: 'Ti raccontiamo volentieri in una conversazione cosa abbiamo fatto e per chi. Sul sito restiamo discreti, come faremmo anche con la tua azienda.',
    voices: [
      [
        '“Sono contenta che ve ne occupiate voi, cosi posso concentrarmi sulla danza.”',
        'Eva',
        'Schrittweise · Scuola di danza',
      ],
      [
        '“Da quando gestiscono i nostri social, prenotazioni e notorieta sono aumentate.”',
        'Babsi',
        'Hotel Martellerhof · Martello',
      ],
      [
        '“Da allora la mia portata e cresciuta e ricevo richieste di lavoro.”',
        'Michael Freitag',
        'Freitag Expert IT Solutions',
      ],
    ],
  },
  funding: {
    eyebrow: 'Contributi',
    title: 'Richiedi il contributo prima di iniziare.',
    text: 'L’Alto Adige sostiene la digitalizzazione delle piccole imprese. Siti, social media, formazione e software su misura possono rientrare. La domanda va fatta prima dell’inizio.',
    number: '60%',
    label: 'Fino al 60% dalla Provincia di Bolzano',
  },
  team: {
    ...content.en.team,
    eyebrow: 'Chi siamo',
    title: 'Due persone, un team.',
    text: 'Nessuna struttura anonima. Lavori direttamente con noi due.',
  },
  faq: {
    eyebrow: 'Domande frequenti',
    title: 'Cosa ci chiedono spesso le piccole imprese.',
    items: [
      [
        'Per chi lavorate?',
        [
          'Per piccole imprese in Alto Adige, Germania, Austria e Svizzera: hotel, beauty, artigiani, scuole di danza, coach, autonomi e piccole aziende IT.',
        ],
      ],
      [
        'Quanto costa?',
        [
          'Non pubblichiamo un listino perche un numero senza contesto non aiuta. Costruiamo il pacchetto adatto al budget.',
        ],
      ],
      [
        'Ci sono contributi?',
        [
          'Si. L’Alto Adige sostiene la digitalizzazione delle piccole imprese fino al 60 percento. La domanda va fatta prima del progetto.',
        ],
      ],
      [
        'Possiamo farlo da soli?',
        [
          'Certo. Se e la scelta piu onesta, vi mostriamo cosa conta. Se non sta accanto al lavoro quotidiano, subentriamo noi.',
        ],
      ],
      [
        'Dobbiamo fare tutto con voi?',
        [
          'No. Prendiamo solo i pezzi in cui possiamo davvero toglierti lavoro.',
        ],
      ],
      [
        'Aiutate anche con problemi tecnici?',
        [
          'Si. Se sito, mail, Wi-Fi o computer danno problemi, chiamaci. In due non possiamo offrire emergenza 24/7.',
        ],
      ],
      [
        'Cosa significa essere trovati dall’AI?',
        [
          'Fatti chiari e marcati tecnicamente aiutano la tua azienda ad apparire nelle risposte di ChatGPT, Perplexity e sistemi simili.',
        ],
      ],
    ],
  },
  contact: {
    ...content.en.contact,
    eyebrow: 'Contatto',
    title: 'Raccontaci cosa ti sta rallentando.',
    text: 'Basta una chiamata o un breve messaggio. Ti rispondiamo, guardiamo bene e diciamo onestamente cosa ha senso.',
    name: 'Nome',
    phone: 'Telefono opzionale',
    subject: 'Di cosa si tratta?',
    consent:
      'Acconsento al trattamento dei miei dati per rispondere alla richiesta.',
    submit: 'Invia messaggio',
  },
  footer: {
    copyright:
      '© 2026 T-Wolf.it · Laboratorio digitale · Dipl.-Ing. Thomas Wolfsteiner · Tschirland 158, 39025 Naturno (BZ) · P.IVA 03289650214',
    imprint: 'Note legali',
    privacy: 'Privacy',
  },
  legal: {
    privacyTitle: 'Privacy',
    privacyEyebrow: 'Informativa privacy',
    privacyStand: 'Aggiornato ad agosto 2026',
    privacySections: [
      {
        title: 'Titolare',
        paragraphs: [
          'T-Wolf.it · Laboratorio digitale, titolare Dipl.-Ing. Thomas Wolfsteiner, Tschirland 158, 39025 Naturno (BZ), Italia. E-mail: digitalwerkstatt@t-wolf.it. Partita IVA: 03289650214.',
        ],
      },
      {
        title: 'Hosting e log',
        paragraphs: [
          'Il sito è ospitato in Germania. I log tecnici servono solo per il funzionamento sicuro e stabile e vengono cancellati dopo sette giorni.',
        ],
      },
      {
        title: 'Contatto e lingua',
        paragraphs: [
          'I dati inviati volontariamente vengono trattati solo per rispondere alla richiesta. La lingua scelta viene salvata localmente nel browser e non modifica il percorso URL.',
        ],
      },
      {
        title: 'Cookie, font e statistiche',
        paragraphs: [
          'Non viene mostrato alcun banner cookie. I font sono serviti localmente. Il sito originale descrive statistiche Matomo senza cookie su infrastruttura propria.',
        ],
      },
    ],
    imprintTitle: 'Note legali',
    imprintEyebrow: 'Note legali',
    imprintStand: 'Aggiornato ad agosto 2026',
    imprintSections: [
      {
        title: 'Fornitore',
        paragraphs: [
          'T-Wolf.it · Laboratorio digitale',
          'Attività libero professionale',
          'Titolare: Dipl.-Ing. Thomas Wolfsteiner',
          'Tschirland 158, 39025 Naturno (BZ), Italia',
          'Telefono Italia: +39 351 3642110',
          'Telefono Germania: +49 177 1481418',
          'E-mail: digitalwerkstatt@t-wolf.it',
          'Partita IVA: 03289650214',
          'P.IVA UE: IT03289650214',
          'Codice fiscale: WLFTMS70T24Z112S',
        ],
      },
      {
        title: 'Responsabilità e quadro giuridico',
        paragraphs: [
          'Responsabile dei contenuti è Dipl.-Ing. Thomas Wolfsteiner. La sede è in Italia e si applica il diritto italiano.',
          'L’attività è libero professionale e non regolamentata. “Dipl.-Ing.” è un titolo accademico.',
        ],
      },
      {
        title: 'Responsabilità e diritto d’autore',
        paragraphs: [
          'I contenuti sono redatti con cura, ma non si assume alcuna garanzia per correttezza, completezza o attualità. Testi, immagini, grafica e design sono protetti dal diritto d’autore.',
        ],
      },
    ],
    back: 'Torna alla home',
  },
  seoPanel: {
    title: 'Anteprima SEO',
    description: 'Metadati head attuali della route caricata.',
    google: 'Ricerca Google',
    x: 'X / Twitter',
    discord: 'Discord / Slack',
    metadata: 'Metadati',
    missing: 'Manca',
  },
}

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value)
}

export function localeFromLanguageTag(
  value: string | undefined,
): Locale | null {
  const language = value?.toLowerCase().split('-')[0]
  return isLocale(language) ? language : null
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return FALLBACK_LOCALE

  for (const language of navigator.languages ?? []) {
    const locale = localeFromLanguageTag(language)
    if (locale) return locale
  }

  return localeFromLanguageTag(navigator.language) ?? FALLBACK_LOCALE
}

export function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null

  try {
    const locale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return isLocale(locale) ? locale : null
  } catch {
    return null
  }
}

export function resolveInitialLocale(): Locale {
  return readStoredLocale() ?? detectBrowserLocale()
}

export function writeStoredLocale(locale: Locale) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  window.dispatchEvent(
    new CustomEvent('t-wolf:localechange', { detail: locale }),
  )
}

export const languageBootstrapScript = `
(() => {
  const key = ${JSON.stringify(LOCALE_STORAGE_KEY)};
  const supported = ${JSON.stringify(LOCALES)};
  const fallback = ${JSON.stringify(FALLBACK_LOCALE)};
  const pick = (value) => {
    const code = String(value || '').toLowerCase().split('-')[0];
    return supported.includes(code) ? code : null;
  };
  let locale = null;
  try {
    locale = pick(localStorage.getItem(key));
  } catch {}
  if (!locale) {
    const languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const language of languages) {
      locale = pick(language);
      if (locale) break;
    }
  }
  locale ||= fallback;
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
})();
`

export function getRouteHead(page: PageKey, locale: Locale = FALLBACK_LOCALE) {
  const url = `${siteBaseUrl}${pages[page].path}`
  const image = `${siteBaseUrl}${socialImagePath}`
  const seo = content[locale].seo[page]

  return {
    meta: [
      { title: seo.title },
      { name: 'description', content: seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: locale },
      { property: 'og:site_name', content: 'T-Wolf.it' },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
