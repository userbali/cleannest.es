(() => {
  "use strict";

  const LANG_STORAGE_KEY = "cn:lang:index";
  const SUPPORTED = ["en", "de", "es", "nb", "hu"];

  const TRANSLATIONS = {
    en: {
      "meta.title": "Clean-Nest Property Management | Gran Canaria",
      "meta.desc": "Home care, gardening, cleaning and maintenance in Gran Canaria. Reliable property management with WhatsApp support.",

      "nav.services": "Services",
      "nav.how": "How it works",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "Serving <strong>Gran Canaria</strong> - Home Care - Gardening - Cleaning",
      "hero.h1": "Fresh, reliable property care - so your home is perfect when you arrive.",
      "hero.sub": "Clean-Nest keeps your property spotless, maintained, and always ready - with clear communication and professional standards.",
      "hero.cta1": "WhatsApp us now",
      "hero.cta2": "See how it works",

      "svc1.title": "Home Care",
      "svc1.desc": "Keyholding, checks, airing, utilities, and peace of mind.",
      "svc2.title": "Gardening Services",
      "svc2.desc": "Healthy gardens, clean edges, seasonal upkeep.",
      "svc3.title": "Cleaning & Maintenance",
      "svc3.desc": "Deep cleans, refreshes, and trusted maintenance support.",

      "why.hosts.title": "For Short-Term Rental Hosts",
      "why.hosts.sub": "Turn your rental into a 5-star experience - without being on the island. You get fewer guest issues, faster turnovers, and a home that is always ready.",
      "why.hosts.caption": "Short-window turnover cleaning for tight check-out/check-in schedules.",
      "why.hosts.f1h": "Fast turnovers",
      "why.hosts.f1p": "Clean, reset, and ready between stays.",
      "why.hosts.f2h": "Guest-ready checks",
      "why.hosts.f2p": "Keys, utilities, and walkthroughs verified.",
      "why.hosts.f3h": "Presentation care",
      "why.hosts.f3p": "Details handled so photos and reviews stay strong.",
      "why.hosts.f4h": "Local response",
      "why.hosts.f4p": "On-island support for issues and fixes.",
      "why.quality.title": "Clean, fresh, and professionally managed",
      "why.quality.sub": "Built for property owners who want consistent quality - with clear standards and dependable care.",
      "why.box1.h": "Routine property checks",
      "why.box1.p": "Prevent issues early with scheduled inspections.",
      "why.box2.h": "Trusted access handling",
      "why.box2.p": "Keys and coordination handled responsibly.",
      "why.box3.h": "Spotless presentation",
      "why.box3.p": "Cleaning that matches high expectations.",
      "why.box4.h": "Garden & outdoor care",
      "why.box4.p": "Fresh, tidy outdoor spaces all year.",

      "how.title": "How it works",
      "how.sub": "Simple, fast, and clear - designed around WhatsApp communication.",
      "how.s1": "Step 1",
      "how.s1h": "Message us",
      "how.s1p": "Tell us what you need and where your property is located.",
      "how.s2": "Step 2",
      "how.s2h": "Confirm scope",
      "how.s2p": "We align on services, frequency, and expectations.",
      "how.s3": "Step 3",
      "how.s3h": "We take care",
      "how.s3p": "We handle the work and keep you informed.",

      "reviews.title": "What owners say",
      "reviews.sub": "Let us prove it.",
      "reviews.r1h": "5-star: Spotless every time.",
      "reviews.r1p": "Perfect cleaning and very responsive on WhatsApp.",
      "reviews.r2h": "5-star: Reliable and proactive.",
      "reviews.r2p": "They notice issues early and keep everything under control.",
      "reviews.r3h": "5-star: Feels premium and fresh.",
      "reviews.r3p": "Exactly what you want for a home in Gran Canaria.",

      "faq.title": "FAQ",
      "faq.sub": "Still not sure? Contact us.",
      "faq.q1": "What areas do you serve?",
      "faq.a1": "Mogan, Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz, Las Palmas.",
      "faq.q2": "Do you offer keyholding?",
      "faq.a2": "Yes - handled professionally with agreed access rules.",
      "faq.q3": "Can I get regular updates?",
      "faq.a3": "Yes - WhatsApp updates now, automated reporting later.",

      "msg.title": "Send us a message",
      "msg.sub": "Write to us here and we will reply by email.",
      "msg.privacy": "We will only use your details to respond to your message.",
      "msg.name": "Name",
      "msg.email": "Email",
      "msg.message": "Message",
      "msg.send": "Send message",
      "msg.config": "Supabase config missing.",
      "msg.missing": "Please fill in name, email, and message.",
      "msg.sending": "Sending...",
      "msg.sent": "Message sent. Thank you.",
      "msg.failed": "Send failed.",

      "gdpr.title": "Privacy notice",
      "gdpr.text": "We use necessary cookies and localStorage to run the site and remember your preferences. No marketing trackers.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Learn more",
      "privacy.title": "Privacy & GDPR",
      "privacy.body": "We only use necessary cookies and localStorage to run the site and remember your preferences (language, theme). We do not use marketing trackers. If you contact us, we use your details only to reply.",

      "final.title": "Ready for a cleaner, fresher property?",
      "final.sub": "Message Clean-Nest on WhatsApp and we will take it from there.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Property Management - Gran Canaria"
    },

    de: {
      "meta.title": "Clean-Nest Objektmanagement | Gran Canaria",
      "meta.desc": "Hausbetreuung, Gartenpflege, Reinigung und Wartung auf Gran Canaria. Zuverlaessiges Objektmanagement mit WhatsApp Support.",

      "nav.services": "Leistungen",
      "nav.how": "So funktionierts",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "Fuer <strong>Gran Canaria</strong> - Hausbetreuung - Gartenpflege - Reinigung",
      "hero.h1": "Frische, zuverlaessige Objektpflege - damit Ihr Zuhause perfekt ist, wenn Sie ankommen.",
      "hero.sub": "Clean-Nest haelt Ihre Immobilie sauber, gepflegt und immer bereit - mit klarer Kommunikation und professionellen Standards.",
      "hero.cta1": "Jetzt per WhatsApp schreiben",
      "hero.cta2": "So funktionierts",

      "svc1.title": "Hausbetreuung",
      "svc1.desc": "Schluesselservice, Kontrollen, Lueften, Versorger und Ruhe.",
      "svc2.title": "Gartenservice",
      "svc2.desc": "Gesunde Gaerten, saubere Kanten, saisonale Pflege.",
      "svc3.title": "Reinigung & Wartung",
      "svc3.desc": "Grundreinigung, Auffrischung und zuverlaessige Unterstuetzung.",

      "why.hosts.title": "Fuer Kurzzeitvermieter",
      "why.hosts.sub": "Machen Sie Ihre Vermietung zu einer 5-star Erfahrung - ohne auf der Insel zu sein. Weniger Probleme, schnellere Wechsel und ein Zuhause, das immer bereit ist.",
      "why.hosts.caption": "Turnover Reinigung fuer enge Check-out/Check-in Zeitfenster.",
      "why.hosts.f1h": "Schnelle Wechsel",
      "why.hosts.f1p": "Reinigung, Reset und bereit zwischen Gaesten.",
      "why.hosts.f2h": "Gaeste-Check",
      "why.hosts.f2p": "Schluessel, Strom, Wasser und Rundgang geprueft.",
      "why.hosts.f3h": "Praesentation",
      "why.hosts.f3p": "Details stimmen, damit Fotos und Bewertungen stark bleiben.",
      "why.hosts.f4h": "Lokale Hilfe",
      "why.hosts.f4p": "Vor Ort Support fuer Probleme und Fixes.",
      "why.quality.title": "Sauber, frisch und professionell betreut",
      "why.quality.sub": "Fuer Eigentuemmer, die konstante Qualitaet wollen - mit klaren Standards und verlaesslicher Betreuung.",
      "why.box1.h": "Regelmaessige Objektkontrollen",
      "why.box1.p": "Probleme frueh erkennen durch geplante Checks.",
      "why.box2.h": "Vertrauensvoller Zugang",
      "why.box2.p": "Schluessel und Koordination verantwortungsvoll geregelt.",
      "why.box3.h": "Makellose Praesentation",
      "why.box3.p": "Reinigung, die hohen Erwartungen entspricht.",
      "why.box4.h": "Garten- und Aussenpflege",
      "why.box4.p": "Frische, gepflegte Aussenbereiche das ganze Jahr.",

      "how.title": "So funktionierts",
      "how.sub": "Einfach, schnell und klar - WhatsApp ist der Hauptkanal.",
      "how.s1": "Schritt 1",
      "how.s1h": "Schreiben Sie uns",
      "how.s1p": "Sagen Sie uns, was Sie brauchen und wo die Immobilie liegt.",
      "how.s2": "Schritt 2",
      "how.s2h": "Umfang bestaetigen",
      "how.s2p": "Wir stimmen Leistungen, Frequenz und Erwartungen ab.",
      "how.s3": "Schritt 3",
      "how.s3h": "Wir kuemmern uns",
      "how.s3p": "Wir erledigen die Arbeit und halten Sie auf dem Laufenden.",

      "reviews.title": "Was Eigentuemer sagen",
      "reviews.sub": "Wir zeigen es Ihnen.",
      "reviews.r1h": "5-star: Jedes Mal makellos.",
      "reviews.r1p": "Perfekte Reinigung und sehr schnelle WhatsApp Antworten.",
      "reviews.r2h": "5-star: Zuverlaessig und proaktiv.",
      "reviews.r2p": "Sie erkennen Probleme frueh und behalten alles im Griff.",
      "reviews.r3h": "5-star: Premium und frisch.",
      "reviews.r3p": "Genau das, was man fuer ein Zuhause auf Gran Canaria will.",

      "faq.title": "FAQ",
      "faq.sub": "Noch unsicher? Kontaktieren Sie uns.",
      "faq.q1": "Welche Orte betreuen Sie?",
      "faq.a1": "Mogan, Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz, Las Palmas.",
      "faq.q2": "Bieten Sie Schluesselservice an?",
      "faq.a2": "Ja - professionell mit vereinbarten Zugangsregeln.",
      "faq.q3": "Gibt es regelmaessige Updates?",
      "faq.a3": "Ja - WhatsApp Updates jetzt, automatisierte Berichte spaeter.",

      "msg.title": "Senden Sie uns eine Nachricht",
      "msg.sub": "Schreiben Sie uns hier und wir antworten per E-Mail.",
      "msg.privacy": "Wir nutzen Ihre Daten nur, um auf Ihre Nachricht zu antworten.",
      "msg.name": "Name",
      "msg.email": "E-Mail",
      "msg.message": "Nachricht",
      "msg.send": "Nachricht senden",
      "msg.config": "Supabase Konfiguration fehlt.",
      "msg.missing": "Bitte Name, E-Mail und Nachricht ausfuellen.",
      "msg.sending": "Senden...",
      "msg.sent": "Nachricht gesendet. Danke.",
      "msg.failed": "Senden fehlgeschlagen.",

      "gdpr.title": "Datenschutz Hinweis",
      "gdpr.text": "Wir nutzen notwendige Cookies und localStorage, um die Seite zu betreiben und Praeferenzen zu speichern. Keine Marketing Tracker.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Mehr Infos",
      "privacy.title": "Datenschutz & GDPR",
      "privacy.body": "Wir nutzen nur notwendige Cookies und localStorage, um die Seite zu betreiben und Praeferenzen zu speichern (Sprache, Theme). Keine Marketing Tracker. Wenn Sie uns kontaktieren, nutzen wir Ihre Daten nur fuer die Antwort.",

      "final.title": "Bereit fuer eine sauberere, frischere Immobilie?",
      "final.sub": "Schreiben Sie Clean-Nest per WhatsApp und wir uebernehmen den Rest.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Objektmanagement - Gran Canaria"
    },

    es: {
      "meta.title": "Clean-Nest Gestion de Propiedades | Gran Canaria",
      "meta.desc": "Cuidado del hogar, jardineria, limpieza y mantenimiento en Gran Canaria. Gestion fiable con soporte por WhatsApp.",

      "nav.services": "Servicios",
      "nav.how": "Como funciona",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "En <strong>Gran Canaria</strong> - Cuidado del hogar - Jardineria - Limpieza",
      "hero.h1": "Cuidado de la propiedad fiable y fresco - para que tu hogar este perfecto cuando llegues.",
      "hero.sub": "Clean-Nest mantiene tu propiedad impecable, cuidada y siempre lista - con comunicacion clara y estandares profesionales.",
      "hero.cta1": "Escribenos por WhatsApp",
      "hero.cta2": "Ver como funciona",

      "svc1.title": "Cuidado del hogar",
      "svc1.desc": "Custodia de llaves, revisiones, ventilacion, suministros y tranquilidad.",
      "svc2.title": "Servicios de jardineria",
      "svc2.desc": "Jardines sanos, bordes limpios y mantenimiento estacional.",
      "svc3.title": "Limpieza y mantenimiento",
      "svc3.desc": "Limpiezas profundas, puesta a punto y apoyo de mantenimiento fiable.",

      "why.hosts.title": "Para anfitriones de alquileres de corta estancia",
      "why.hosts.sub": "Convierte tu alquiler en una experiencia de 5-star - sin estar en la isla. Menos incidencias, cambios mas rapidos y una casa siempre lista.",
      "why.hosts.caption": "Limpieza de cambios rapidos para horarios ajustados de check-out/check-in.",
      "why.hosts.f1h": "Cambios rapidos",
      "why.hosts.f1p": "Limpieza, reset y listo entre estancias.",
      "why.hosts.f2h": "Revisiones para huespedes",
      "why.hosts.f2p": "Llaves, servicios y recorrido verificados.",
      "why.hosts.f3h": "Presentacion cuidada",
      "why.hosts.f3p": "Detalles cuidados para que fotos y resenas sigan fuertes.",
      "why.hosts.f4h": "Respuesta local",
      "why.hosts.f4p": "Soporte en la isla para problemas y arreglos.",
      "why.quality.title": "Limpio, fresco y gestionado profesionalmente",
      "why.quality.sub": "Para propietarios que quieren calidad constante - con estandares claros y cuidado fiable.",
      "why.box1.h": "Revisiones periodicas",
      "why.box1.p": "Prevenir problemas pronto con inspecciones programadas.",
      "why.box2.h": "Acceso gestionado con confianza",
      "why.box2.p": "Llaves y coordinacion gestionadas con responsabilidad.",
      "why.box3.h": "Presentacion impecable",
      "why.box3.p": "Limpieza a la altura de altas expectativas.",
      "why.box4.h": "Jardin y exterior",
      "why.box4.p": "Espacios exteriores frescos y ordenados todo el ano.",

      "how.title": "Como funciona",
      "how.sub": "Simple, rapido y claro - basado en comunicacion por WhatsApp.",
      "how.s1": "Paso 1",
      "how.s1h": "Escribenos",
      "how.s1p": "Cuentanos que necesitas y donde esta tu propiedad.",
      "how.s2": "Paso 2",
      "how.s2h": "Confirmar el servicio",
      "how.s2p": "Acordamos servicios, frecuencia y expectativas.",
      "how.s3": "Paso 3",
      "how.s3h": "Nos encargamos",
      "how.s3p": "Realizamos el trabajo y te mantenemos informado.",

      "reviews.title": "Lo que dicen los propietarios",
      "reviews.sub": "Dejanos demostrarlo.",
      "reviews.r1h": "5-star: Impecable cada vez.",
      "reviews.r1p": "Limpieza perfecta y respuesta rapida por WhatsApp.",
      "reviews.r2h": "5-star: Fiables y proactivos.",
      "reviews.r2p": "Detectan problemas pronto y lo mantienen todo bajo control.",
      "reviews.r3h": "5-star: Se siente premium y fresco.",
      "reviews.r3p": "Justo lo que quieres para una casa en Gran Canaria.",

      "faq.title": "FAQ",
      "faq.sub": "Aun tienes dudas? Contactanos.",
      "faq.q1": "Que zonas cubren?",
      "faq.a1": "Mogan, Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz, Las Palmas.",
      "faq.q2": "Ofrecen custodia de llaves?",
      "faq.a2": "Si - gestionado profesionalmente con reglas acordadas.",
      "faq.q3": "Puedo recibir actualizaciones regulares?",
      "faq.a3": "Si - WhatsApp ahora, informes automatizados despues.",

      "msg.title": "Envia un mensaje",
      "msg.sub": "Escribenos aqui y responderemos por email.",
      "msg.privacy": "Solo usaremos tus datos para responder a tu mensaje.",
      "msg.name": "Nombre",
      "msg.email": "Email",
      "msg.message": "Mensaje",
      "msg.send": "Enviar mensaje",
      "msg.config": "Falta la configuracion de Supabase.",
      "msg.missing": "Completa nombre, email y mensaje.",
      "msg.sending": "Enviando...",
      "msg.sent": "Mensaje enviado. Gracias.",
      "msg.failed": "Error al enviar.",

      "gdpr.title": "Aviso de privacidad",
      "gdpr.text": "Usamos cookies necesarias y localStorage para que el sitio funcione y recordar tus preferencias. Sin rastreadores de marketing.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Mas info",
      "privacy.title": "Privacidad y GDPR",
      "privacy.body": "Solo usamos cookies necesarias y localStorage para el sitio y tus preferencias (idioma, tema). Sin rastreadores de marketing. Si nos contactas, usamos tus datos solo para responder.",

      "final.title": "Listo para una propiedad mas limpia y fresca?",
      "final.sub": "Escribe a Clean-Nest por WhatsApp y nos encargamos del resto.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Gestion de Propiedades - Gran Canaria"
    },

    nb: {
      "meta.title": "Clean-Nest Eiendomsservice | Gran Canaria",
      "meta.desc": "Boligtilsyn, hagearbeid, rengjoring og vedlikehold pa Gran Canaria. Palitelig eiendomsservice med WhatsApp stotte.",

      "nav.services": "Tjenester",
      "nav.how": "Slik fungerer det",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "I <strong>Gran Canaria</strong> - Boligtilsyn - Hagearbeid - Rengjoring",
      "hero.h1": "Frisk og palitelig eiendomspleie - sa hjemmet ditt er perfekt nar du kommer.",
      "hero.sub": "Clean-Nest holder eiendommen ren, vedlikeholdt og alltid klar - med tydelig kommunikasjon og profesjonelle standarder.",
      "hero.cta1": "Send oss WhatsApp",
      "hero.cta2": "Se hvordan det fungerer",

      "svc1.title": "Boligtilsyn",
      "svc1.desc": "Nokkeloppbevaring, kontroller, lufting, strom/vann og trygghet.",
      "svc2.title": "Hagetjenester",
      "svc2.desc": "Sunne hager, rene kanter og sesongvedlikehold.",
      "svc3.title": "Rengjoring og vedlikehold",
      "svc3.desc": "Grundig rengjoring, oppfriskning og palitelig vedlikehold.",

      "why.hosts.title": "For korttidsutleie-verter",
      "why.hosts.sub": "Gjor utleien til en 5-star opplevelse - uten a vaere pa oya. Faerre problemer, raskere bytter og et hjem som alltid er klart.",
      "why.hosts.caption": "Rask turnover rengjoring for trange utsjekk/innsjekk vinduer.",
      "why.hosts.f1h": "Raske bytter",
      "why.hosts.f1p": "Rengjor, reset og klart mellom opphold.",
      "why.hosts.f2h": "Gjeste-sjekk",
      "why.hosts.f2p": "Nokler, strom, vann og rundgang sjekket.",
      "why.hosts.f3h": "Presentasjon",
      "why.hosts.f3p": "Detaljer som holder bilder og omtaler sterke.",
      "why.hosts.f4h": "Lokal respons",
      "why.hosts.f4p": "Pa oya hjelp ved problemer og fikser.",
      "why.quality.title": "Rent, friskt og profesjonelt administrert",
      "why.quality.sub": "For eiere som vil ha jevn kvalitet - med klare standarder og palitelig service.",
      "why.box1.h": "Regelmessige kontroller",
      "why.box1.p": "Forebygg problemer tidlig med planlagte inspeksjoner.",
      "why.box2.h": "Trygg tilgang",
      "why.box2.p": "Nokler og koordinering handteres ansvarlig.",
      "why.box3.h": "Plettfri presentasjon",
      "why.box3.p": "Rengjoring som moter hoye forventninger.",
      "why.box4.h": "Hage og uteomrader",
      "why.box4.p": "Ryddige uteomrader hele aret.",

      "how.title": "Slik fungerer det",
      "how.sub": "Enkelt, raskt og tydelig - basert pa WhatsApp.",
      "how.s1": "Steg 1",
      "how.s1h": "Send oss en melding",
      "how.s1p": "Fortell hva du trenger og hvor eiendommen ligger.",
      "how.s2": "Steg 2",
      "how.s2h": "Bekreft omfang",
      "how.s2p": "Vi avklarer tjenester, frekvens og forventninger.",
      "how.s3": "Steg 3",
      "how.s3h": "Vi ordner resten",
      "how.s3p": "Vi gjor jobben og holder deg oppdatert.",

      "reviews.title": "Hva eiere sier",
      "reviews.sub": "La oss bevise det.",
      "reviews.r1h": "5-star: Plettfritt hver gang.",
      "reviews.r1p": "Perfekt rengjoring og raske svar pa WhatsApp.",
      "reviews.r2h": "5-star: Palitelig og proaktiv.",
      "reviews.r2p": "De oppdager problemer tidlig og har full kontroll.",
      "reviews.r3h": "5-star: Premium og friskt.",
      "reviews.r3p": "Akkurat det du vil ha for et hjem pa Gran Canaria.",

      "faq.title": "FAQ",
      "faq.sub": "Usikker? Ta kontakt.",
      "faq.q1": "Hvilke omrader dekker dere?",
      "faq.a1": "Mogan, Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz, Las Palmas.",
      "faq.q2": "Tilbyr dere nokkeloppbevaring?",
      "faq.a2": "Ja - profesjonelt med avtalte adgangsregler.",
      "faq.q3": "Kan jeg fa regelmessige oppdateringer?",
      "faq.a3": "Ja - WhatsApp oppdateringer na, automatiske rapporter senere.",

      "msg.title": "Send oss en melding",
      "msg.sub": "Skriv til oss her og vi svarer pa e-post.",
      "msg.privacy": "Vi bruker kun opplysningene dine for a svare pa meldingen.",
      "msg.name": "Navn",
      "msg.email": "E-post",
      "msg.message": "Melding",
      "msg.send": "Send melding",
      "msg.config": "Supabase konfigurasjon mangler.",
      "msg.missing": "Fyll inn navn, e-post og melding.",
      "msg.sending": "Sender...",
      "msg.sent": "Melding sendt. Takk.",
      "msg.failed": "Sending feilet.",

      "gdpr.title": "Personvern varsel",
      "gdpr.text": "Vi bruker nodvendige cookies og localStorage for at siden skal fungere og huske preferanser. Ingen markedsforing trackere.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Les mer",
      "privacy.title": "Personvern og GDPR",
      "privacy.body": "Vi bruker kun nodvendige cookies og localStorage for siden og preferanser (sprak, tema). Ingen markedsforing trackere. Hvis du kontakter oss, bruker vi data kun for svar.",

      "final.title": "Klar for en renere og friskere eiendom?",
      "final.sub": "Send Clean-Nest en WhatsApp og vi tar det derfra.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Eiendomsservice - Gran Canaria"
    },

    hu: {
      "meta.title": "Clean-Nest Ingatlankezelés | Gran Canaria",
      "meta.desc": "Ingatlanfelügyelet, kertgondozás, takarítás és karbantartás Gran Canarián. Megbízható ingatlankezelés WhatsApp támogatással.",

      "nav.services": "Szolgáltatások",
      "nav.how": "Hogyan működik",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Ingatlanfelügyelet - Kertgondozás - Takarítás",
      "hero.h1": "Friss, megbízható ingatlankezelés - hogy az otthonod tökéletes legyen, amikor megérkezel.",
      "hero.sub": "A Clean-Nest tisztán, karbantartva és mindig készen tartja az ingatlanod - átlátható kommunikációval és profi sztenderdekkel.",
      "hero.cta1": "Írj WhatsAppon",
      "hero.cta2": "Nézd meg, hogyan működik",

      "svc1.title": "Ingatlanfelügyelet",
      "svc1.desc": "Kulcskezelés, ellenőrzések, szellőztetés, közművek és nyugalom.",
      "svc2.title": "Kertgondozás",
      "svc2.desc": "Egészséges kertek, rendezett szegélyek, szezonális ápolás.",
      "svc3.title": "Takarítás és karbantartás",
      "svc3.desc": "Nagytakarítás, felfrissítés és megbízható karbantartási támogatás.",

      "why.hosts.title": "Rövid távú kiadóknak",
      "why.hosts.sub": "Tedd a kiadásod 5-star élménnyé - anélkül, hogy a szigeten lennél. Kevesebb vendégprobléma, gyorsabb fordulók és mindig készen álló otthon.",
      "why.hosts.caption": "Gyors forduló takarítás szűk check-out/check-in időkben.",
      "why.hosts.f1h": "Gyors fordulók",
      "why.hosts.f1p": "Takarítás, reset, és készen a következő vendégre.",
      "why.hosts.f2h": "Vendégre kész ellenőrzések",
      "why.hosts.f2p": "Kulcsok, közművek és bejárás ellenőrizve.",
      "why.hosts.f3h": "Megjelenés, minőség",
      "why.hosts.f3p": "A részletek rendben, hogy a fotók és értékelések erősek maradjanak.",
      "why.hosts.f4h": "Helyi segítség",
      "why.hosts.f4p": "Szigeten belüli támogatás problémákra és javításokra.",
      "why.quality.title": "Tiszta, friss és profi kezelés",
      "why.quality.sub": "Azoknak a tulajdonosoknak, akik állandó minőséget akarnak - egyértelmű sztenderdekkel és megbízható gondoskodással.",
      "why.box1.h": "Rendszeres ingatlanellenőrzések",
      "why.box1.p": "Előzd meg a problémákat korán, tervezett ellenőrzésekkel.",
      "why.box2.h": "Megbízható hozzáférés",
      "why.box2.p": "Kulcsok és koordináció felelősen kezelve.",
      "why.box3.h": "Tökéletes megjelenés",
      "why.box3.p": "Takarítás, ami a magas elvárásokhoz igazodik.",
      "why.box4.h": "Kert és külső terek",
      "why.box4.p": "Rendezett, friss kültéri terek egész évben.",

      "how.title": "Hogyan működik",
      "how.sub": "Egyszerű, gyors és átlátható - WhatsApp kommunikációra építve.",
      "how.s1": "1. lépés",
      "how.s1h": "Írj nekünk",
      "how.s1p": "Mondd el, mire van szükséged és hol található az ingatlan.",
      "how.s2": "2. lépés",
      "how.s2h": "Részletek egyeztetése",
      "how.s2p": "Egyeztetjük a szolgáltatásokat, gyakoriságot és elvárásokat.",
      "how.s3": "3. lépés",
      "how.s3h": "Mi intézzük",
      "how.s3p": "Elvégezzük a munkát és tájékoztatunk.",

      "reviews.title": "Amit a tulajdonosok mondanak",
      "reviews.sub": "Bizonyítunk.",
      "reviews.r1h": "5-star: Mindig makulátlan.",
      "reviews.r1p": "Tökéletes takarítás és gyors WhatsApp válaszok.",
      "reviews.r2h": "5-star: Megbízható és proaktív.",
      "reviews.r2p": "Időben észreveszik a problémákat és kézben tartanak mindent.",
      "reviews.r3h": "5-star: Prémium és friss.",
      "reviews.r3p": "Pont, amit egy gran canariai otthontól vársz.",

      "faq.title": "GYIK",
      "faq.sub": "Még kérdésed van? Írj nekünk.",
      "faq.q1": "Mely területeken dolgoztok?",
      "faq.a1": "Mogan, Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz, Las Palmas.",
      "faq.q2": "Vállaltok kulcskezelést?",
      "faq.a2": "Igen - professzionálisan, egyeztetett hozzáférési szabályokkal.",
      "faq.q3": "Kaphatok rendszeres frissítést?",
      "faq.a3": "Igen - WhatsApp frissítés most, automatizált riportok később.",

      "msg.title": "Írj nekünk üzenetet",
      "msg.sub": "Itt tudsz írni, és e-mailben válaszolunk.",
      "msg.privacy": "Az adataidat csak a válaszadáshoz használjuk.",
      "msg.name": "Név",
      "msg.email": "E-mail",
      "msg.message": "Üzenet",
      "msg.send": "Üzenet küldése",
      "msg.config": "Supabase konfiguráció hiányzik.",
      "msg.missing": "Kérjük töltsd ki a nevet, e-mailt és üzenetet.",
      "msg.sending": "Küldés...",
      "msg.sent": "Üzenet elküldve. Köszönjük.",
      "msg.failed": "Küldés sikertelen.",

      "gdpr.title": "Adatvédelmi tájékoztató",
      "gdpr.text": "A webhely működtetéséhez szükséges cookie-kat és localStorage-t használunk. Nincs marketingkövetés.",
      "gdpr.accept": "OK",
      "gdpr.learn": "További információ",
      "privacy.title": "Adatvédelem és GDPR",
      "privacy.body": "A webhely működtetéséhez szükséges cookie-kat és localStorage-t használunk (nyelv, téma). Nincs marketingkövetés. Ha felveszed velünk a kapcsolatot, adataidat csak a válaszhoz használjuk.",

      "final.title": "Készen állsz egy tisztább, frissebb ingatlanra?",
      "final.sub": "Írj a Clean-Nestnek WhatsAppon, és intézzük a többit.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Ingatlankezelés - Gran Canaria"
    }
  };

  function safeLSGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeLSSet(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }

  function normalizeLang(lang) {
    if (!lang) return "en";
    const s = String(lang).toLowerCase().trim();
    if (s === "no") return "nb";
    if (s.startsWith("nb") || s.startsWith("nn")) return "nb";
    if (s.startsWith("de")) return "de";
    if (s.startsWith("es")) return "es";
    if (s.startsWith("en")) return "en";
    if (s.startsWith("hu")) return "hu";
    return "en";
  }

  function getPreferredLang() {
    const saved = normalizeLang(safeLSGet(LANG_STORAGE_KEY));
    if (SUPPORTED.includes(saved) && safeLSGet(LANG_STORAGE_KEY)) return saved;

    const nav = (navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language) || "en";
    const detected = normalizeLang(nav);
    return SUPPORTED.includes(detected) ? detected : "en";
  }

  let currentLang = getPreferredLang();

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
      (TRANSLATIONS.en && TRANSLATIONS.en[key]) ||
      key;
  }

  function updateYear() {
    const y = document.getElementById("y");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang === "nb" ? "no" : currentLang;

    document.title = t("meta.title");
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.desc"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (!val) return;
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
      else el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if (val) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
      const btnLang = normalizeLang(btn.getAttribute("data-lang"));
      btn.classList.toggle("is-active", btnLang === currentLang);
    });

    updateYear();
  }

  function setLang(lang) {
    const next = normalizeLang(lang);
    if (!SUPPORTED.includes(next)) return;
    currentLang = next;
    safeLSSet(LANG_STORAGE_KEY, next);
    applyTranslations();
    window.dispatchEvent(new CustomEvent("cn:lang", { detail: { lang: next } }));
  }

  function initLangSwitch() {
    const sw = document.querySelector(".lang-switch");
    if (!sw) return;
    sw.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn[data-lang]");
      if (!btn) return;
      setLang(btn.getAttribute("data-lang"));
    });
  }

  window.CN_I18N = {
    t,
    setLang,
    apply: applyTranslations,
    get: () => currentLang
  };

  initLangSwitch();
  applyTranslations();
})();
