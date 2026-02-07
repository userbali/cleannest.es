(() => {
  "use strict";

  const LANG_STORAGE_KEY = "cn:lang:index";
  const SUPPORTED = ["en", "de", "es", "nb", "hu"];

  const TRANSLATIONS = {
    en: {
      "meta.title": "Clean-Nest Property Management | Gran Canaria",
      "meta.desc": "Property supervision, gardening, cleaning and maintenance in Gran Canaria. Reliable property management with WhatsApp support.",

      "nav.services": "Services",
      "nav.how": "How it works",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Property supervision - Gardening - Cleaning",
      "hero.h1": "Reliable property management - so your home is perfect when you arrive.",
      "hero.sub": "Clean-Nest keeps your property maintained and clean - with transparent communication and professional standards.",
      "hero.cta1": "Message us on WhatsApp",
      "hero.cta2": "See how it works",

      "svc1.title": "Property supervision",
      "svc1.desc": "Key handling, regular checks.",
      "svc2.title": "Gardening",
      "svc2.desc": "Well-kept garden, tidy surroundings.",
      "svc3.title": "Cleaning and maintenance",
      "svc3.desc": "Regular cleaning and caretaker tasks handled.",

      "why.hosts.title": "Our offer for short-term rental hosts",
      "why.hosts.sub": "Make your short-term rental a 5-star experience - without being on the island. Maximum guest experience, high occupancy, and a home that is always ready.",
      "why.hosts.caption": "One team, one goal - your satisfaction is the basis of every decision we make.",
      "why.hosts.f1h": "Check-in and check-out",
      "why.hosts.f1p": "Professional cleaning so your property is ready for the next guest.",
      "why.hosts.f2h": "Host tasks on request",
      "why.hosts.f2p": "Key handover, property walkthrough.",
      "why.hosts.f3h": "Full marketing communication",
      "why.hosts.f3p": "Photos and videos plus social media presence.",
      "why.hosts.f4h": "Local support",
      "why.hosts.f4p": "Assistance in any unexpected situation.",
      "why.quality.title": "Why choose us",
      "why.quality.sub": "We do not compromise on precision and reliability - we care for your property as if it were our own.",
      "why.box1.h": "Reliability",
      "why.box1.p": "Your property is in safe hands - we look after it even when you are not there.",
      "why.box2.h": "Precision",
      "why.box2.p": "Check-in, cleaning, maintenance: everything happens exactly when it should.",
      "why.box3.h": "Flexibility",
      "why.box3.p": "We adapt to guest traffic and your needs - short-term rentals have no fixed schedule.",
      "why.box4.h": "Short lead times",
      "why.box4.p": "Fast response, immediate solutions - short deadlines without compromise.",

      "how.title": "How do we start working together?",
      "how.sub": "If our services and benefits convince you, getting started is simple, fast and transparent. All communication happens via WhatsApp - convenient and without unnecessary back-and-forth.",
      "how.s1": "Step 1",
      "how.s1h": "Get in touch",
      "how.s1p": "Message us on WhatsApp and briefly tell us what help you need and where the property is located.",
      "how.s2": "Step 2",
      "how.s2h": "Agree the details",
      "how.s2p": "We discuss the services, frequency, expectations and specific needs so everything fits short-term rental operations.",
      "how.s3": "Step 3",
      "how.s3h": "Execution and continuous updates",
      "how.s3p": "We carry out the tasks entrusted to us, and you receive timely, transparent updates. Your property is in safe hands.",

      "reviews.title": "What they say about us",
      "reviews.sub": "Our reviews.",
      "reviews.r1h": "5-star: Always spotless.",
      "reviews.r1p": "Perfect cleaning and fast WhatsApp replies.",
      "reviews.r2h": "5-star: Reliable and proactive.",
      "reviews.r2p": "They notice issues early and keep everything under control.",
      "reviews.r3h": "5-star: Premium and fresh.",
      "reviews.r3p": "Exactly what you want for a home in Gran Canaria.",
      "reviews.card1.text": "I really got my apartment back clean and tidy. Sofia",
      "reviews.card2.title": "Leave a review",
      "reviews.card3.title": "Give feedback",

      "faq.title": "FAQ",
      "faq.sub": "Still have questions? Message us.",
      "faq.q1": "Which areas do you cover?",
      "faq.a1": "Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz.",
      "faq.q2": "Do you handle key management?",
      "faq.a2": "Yes - professionally, with agreed access rules.",
      "faq.q3": "Can I get regular updates?",
      "faq.a3": "Yes - WhatsApp updates now, automated reports later.",

      "msg.title": "Send us a message",
      "msg.sub": "Write here and we will reply by email.",
      "msg.privacy": "We use your details only to reply.",
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
      "gdpr.text": "We use necessary cookies and localStorage to run the site. No marketing tracking.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Learn more",
      "privacy.title": "Privacy & GDPR",
      "privacy.body": "We use necessary cookies and localStorage to run the site (language, theme). No marketing tracking. If you contact us, we use your details only to reply.",

      "final.title": "Ready for a cleaner, fresher property?",
      "final.sub": "Message Clean-Nest on WhatsApp and we will take care of the rest.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Property Management - Gran Canaria"
    },

    de: {
      "meta.title": "Clean-Nest Immobilienbetreuung | Gran Canaria",
      "meta.desc": "Immobilienbetreuung, Gartenpflege, Reinigung und Wartung auf Gran Canaria. Zuverlaessiges Objektmanagement mit WhatsApp Support.",

      "nav.services": "Leistungen",
      "nav.how": "So funktionierts",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Immobilienbetreuung - Gartenpflege - Reinigung",
      "hero.h1": "Zuverlaessige Immobilienbetreuung - damit Ihr Zuhause perfekt ist, wenn Sie ankommen.",
      "hero.sub": "Clean-Nest haelt Ihre Immobilie in Ordnung und sauber - mit transparenter Kommunikation und professionellen Standards.",
      "hero.cta1": "Schreiben Sie uns per WhatsApp",
      "hero.cta2": "So funktionierts",

      "svc1.title": "Immobilienbetreuung",
      "svc1.desc": "Schluesselmanagement, regelmaessige Kontrollen.",
      "svc2.title": "Gartenpflege",
      "svc2.desc": "Gepflegter Garten, ordentliches Umfeld.",
      "svc3.title": "Reinigung und Wartung",
      "svc3.desc": "Regelmaessige Reinigung und Hausmeisteraufgaben.",

      "why.hosts.title": "Unser Angebot fuer Kurzzeitvermieter",
      "why.hosts.sub": "Machen Sie Ihre Kurzzeitvermietung zu einer 5-Sterne-Erfahrung - ohne auf der Insel zu sein. Maximale Gaestezufriedenheit, hohe Auslastung und ein Zuhause, das immer bereit ist.",
      "why.hosts.caption": "Ein Team, ein Ziel - Ihre Zufriedenheit ist die Basis jeder Entscheidung.",
      "why.hosts.f1h": "Check-in und Check-out",
      "why.hosts.f1p": "Professionelle Reinigung, damit Ihre Immobilie fuer den naechsten Gast bereit ist.",
      "why.hosts.f2h": "Host-Aufgaben auf Wunsch",
      "why.hosts.f2p": "Schluesseluebergabe, Objektvorstellung.",
      "why.hosts.f3h": "Komplette Marketingkommunikation",
      "why.hosts.f3p": "Fotos und Videos sowie Social-Media-Praesenz.",
      "why.hosts.f4h": "Lokale Unterstuetzung",
      "why.hosts.f4p": "Assistenz in jeder unerwarteten Situation.",
      "why.quality.title": "Warum uns waehlen",
      "why.quality.sub": "Bei Genauigkeit und Zuverlaessigkeit machen wir keine Kompromisse - wir behandeln Ihre Immobilie, als waere es unsere eigene.",
      "why.box1.h": "Zuverlaessigkeit",
      "why.box1.p": "Ihre Immobilie ist in sicheren Haenden - wir kuemmern uns auch dann, wenn Sie nicht vor Ort sind.",
      "why.box2.h": "Genauigkeit",
      "why.box2.p": "Check-in, Reinigung, Wartung: Bei uns passiert alles genau dann, wenn es sein muss.",
      "why.box3.h": "Flexibilitaet",
      "why.box3.p": "Wir passen uns dem Gaesteaufkommen und Ihren Beduerfnissen an - Kurzzeitvermietung kennt keinen festen Fahrplan.",
      "why.box4.h": "Kurze Fristen",
      "why.box4.p": "Schnelle Reaktion, sofortige Loesungen - kurze Fristen ohne Kompromisse.",

      "how.title": "Wie startet die Zusammenarbeit?",
      "how.sub": "Wenn Sie unsere Leistungen und Vorteile ueberzeugen, ist der Start bei uns einfach, schnell und transparent. Die gesamte Kommunikation erfolgt ueber WhatsApp - bequem und ohne unnoetige Schleifen.",
      "how.s1": "Schritt 1",
      "how.s1h": "Kontaktaufnahme",
      "how.s1p": "Schreiben Sie uns auf WhatsApp und teilen Sie kurz mit, welche Hilfe Sie brauchen und wo sich die Immobilie befindet.",
      "how.s2": "Schritt 2",
      "how.s2h": "Details abstimmen",
      "how.s2p": "Wir besprechen Leistungen, Frequenz, Erwartungen und besondere Wuensche, damit alles zur Kurzzeitvermietung passt.",
      "how.s3": "Schritt 3",
      "how.s3h": "Umsetzung und laufende Updates",
      "how.s3p": "Wir erledigen die Aufgaben, und Sie erhalten rechtzeitig transparente Updates. Ihre Immobilie ist in sicheren Haenden.",

      "reviews.title": "Was man ueber uns sagt",
      "reviews.sub": "Unsere Bewertungen.",
      "reviews.r1h": "5-star: Immer makellos.",
      "reviews.r1p": "Perfekte Reinigung und schnelle WhatsApp Antworten.",
      "reviews.r2h": "5-star: Zuverlaessig und proaktiv.",
      "reviews.r2p": "Sie erkennen Probleme frueh und behalten alles im Griff.",
      "reviews.r3h": "5-star: Premium und frisch.",
      "reviews.r3p": "Genau das, was man fuer ein Zuhause auf Gran Canaria will.",
      "reviews.card1.text": "Ich habe meine Wohnung wirklich sauber und ordentlich zurueckbekommen. Sofia",
      "reviews.card2.title": "Bewertung hinterlassen",
      "reviews.card3.title": "Feedback geben",

      "faq.title": "FAQ",
      "faq.sub": "Noch Fragen? Schreiben Sie uns.",
      "faq.q1": "Welche Gebiete betreuen Sie?",
      "faq.a1": "Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz.",
      "faq.q2": "Bieten Sie Schluesselmanagement an?",
      "faq.a2": "Ja - professionell mit vereinbarten Zugangsregeln.",
      "faq.q3": "Kann ich regelmaessige Updates erhalten?",
      "faq.a3": "Ja - WhatsApp Updates jetzt, automatisierte Berichte spaeter.",

      "msg.title": "Senden Sie uns eine Nachricht",
      "msg.sub": "Schreiben Sie hier und wir antworten per E-Mail.",
      "msg.privacy": "Wir nutzen Ihre Daten nur, um zu antworten.",
      "msg.name": "Name",
      "msg.email": "E-Mail",
      "msg.message": "Nachricht",
      "msg.send": "Nachricht senden",
      "msg.config": "Supabase Konfiguration fehlt.",
      "msg.missing": "Bitte Name, E-Mail und Nachricht ausfuellen.",
      "msg.sending": "Senden...",
      "msg.sent": "Nachricht gesendet. Danke.",
      "msg.failed": "Senden fehlgeschlagen.",

      "gdpr.title": "Datenschutzhinweis",
      "gdpr.text": "Wir nutzen notwendige Cookies und localStorage fuer den Betrieb der Seite. Kein Marketing-Tracking.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Mehr Infos",
      "privacy.title": "Datenschutz & GDPR",
      "privacy.body": "Wir nutzen notwendige Cookies und localStorage fuer die Seite (Sprache, Theme). Kein Marketing-Tracking. Wenn Sie uns kontaktieren, nutzen wir Ihre Daten nur fuer die Antwort.",

      "final.title": "Bereit fuer eine sauberere, frischere Immobilie?",
      "final.sub": "Schreiben Sie Clean-Nest auf WhatsApp und wir kuemmern uns um den Rest.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Immobilienbetreuung - Gran Canaria"
    },

    es: {
      "meta.title": "Clean-Nest Gestion de Propiedades | Gran Canaria",
      "meta.desc": "Supervision de propiedades, jardineria, limpieza y mantenimiento en Gran Canaria. Gestion fiable con soporte por WhatsApp.",

      "nav.services": "Servicios",
      "nav.how": "Como funciona",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Supervision de propiedades - Jardineria - Limpieza",
      "hero.h1": "Gestion de propiedades fiable - para que tu hogar este perfecto cuando llegues.",
      "hero.sub": "Clean-Nest mantiene tu propiedad cuidada y limpia - con comunicacion transparente y estandares profesionales.",
      "hero.cta1": "Escribenos por WhatsApp",
      "hero.cta2": "Ver como funciona",

      "svc1.title": "Supervision de propiedades",
      "svc1.desc": "Gestion de llaves, controles regulares.",
      "svc2.title": "Jardineria",
      "svc2.desc": "Jardin cuidado, entorno ordenado.",
      "svc3.title": "Limpieza y mantenimiento",
      "svc3.desc": "Limpieza regular y tareas de conserjeria.",

      "why.hosts.title": "Nuestra oferta para alquileres de corta estancia",
      "why.hosts.sub": "Convierte tu alquiler en una experiencia de 5 estrellas - sin estar en la isla. Maxima satisfaccion del huesped, alta ocupacion y una casa siempre lista.",
      "why.hosts.caption": "Un equipo, un objetivo: tu satisfaccion es la base de cada decision.",
      "why.hosts.f1h": "Check-in y check-out",
      "why.hosts.f1p": "Limpieza profesional para que tu propiedad este lista para el proximo huesped.",
      "why.hosts.f2h": "Tareas de anfitrion bajo demanda",
      "why.hosts.f2p": "Entrega de llaves, presentacion de la propiedad.",
      "why.hosts.f3h": "Comunicacion de marketing completa",
      "why.hosts.f3p": "Fotos y videos, presencia en redes sociales.",
      "why.hosts.f4h": "Soporte local",
      "why.hosts.f4p": "Asistencia ante cualquier situacion inesperada.",
      "why.quality.title": "Por que elegirnos",
      "why.quality.sub": "No hacemos concesiones en precision y fiabilidad: cuidamos tu propiedad como si fuera nuestra.",
      "why.box1.h": "Fiabilidad",
      "why.box1.p": "Tu propiedad esta en buenas manos; la cuidamos incluso cuando no estas.",
      "why.box2.h": "Precision",
      "why.box2.p": "Check-in, limpieza, mantenimiento: todo sucede cuando debe.",
      "why.box3.h": "Flexibilidad",
      "why.box3.p": "Nos adaptamos al flujo de huespedes y a tus necesidades; el alquiler de corta estancia no tiene horario fijo.",
      "why.box4.h": "Plazos cortos",
      "why.box4.p": "Respuesta rapida, soluciones inmediatas - plazos cortos sin compromisos.",

      "how.title": "Como iniciamos la colaboracion?",
      "how.sub": "Si nuestros servicios y ventajas te convencen, empezar es simple, rapido y transparente. Toda la comunicacion es por WhatsApp, sin vueltas innecesarias.",
      "how.s1": "Paso 1",
      "how.s1h": "Contacto",
      "how.s1p": "Escribenos por WhatsApp y dinos brevemente que necesitas y donde esta la propiedad.",
      "how.s2": "Paso 2",
      "how.s2h": "Acordar detalles",
      "how.s2p": "Revisamos servicios, frecuencia, expectativas y necesidades especiales para que todo encaje con el alquiler de corta estancia.",
      "how.s3": "Paso 3",
      "how.s3h": "Ejecucion y actualizaciones continuas",
      "how.s3p": "Nosotros realizamos las tareas y tu recibes actualizaciones claras y a tiempo. Tu propiedad esta en buenas manos.",

      "reviews.title": "Lo que dicen de nosotros",
      "reviews.sub": "Nuestras resenas.",
      "reviews.r1h": "5-star: Siempre impecable.",
      "reviews.r1p": "Limpieza perfecta y respuestas rapidas por WhatsApp.",
      "reviews.r2h": "5-star: Fiables y proactivos.",
      "reviews.r2p": "Detectan problemas pronto y lo mantienen todo bajo control.",
      "reviews.r3h": "5-star: Premium y fresco.",
      "reviews.r3p": "Justo lo que quieres para una casa en Gran Canaria.",
      "reviews.card1.text": "De verdad recibi mi apartamento limpio y ordenado. Sofia",
      "reviews.card2.title": "Deja una resena",
      "reviews.card3.title": "Danos tu opinion",

      "faq.title": "FAQ",
      "faq.sub": "Aun tienes dudas? Escribenos.",
      "faq.q1": "Que zonas cubrimos?",
      "faq.a1": "Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz.",
      "faq.q2": "Ofrecen gestion de llaves?",
      "faq.a2": "Si - profesionalmente, con reglas de acceso acordadas.",
      "faq.q3": "Puedo recibir actualizaciones regulares?",
      "faq.a3": "Si - WhatsApp ahora, informes automatizados despues.",

      "msg.title": "Envianos un mensaje",
      "msg.sub": "Escribe aqui y responderemos por email.",
      "msg.privacy": "Usamos tus datos solo para responder.",
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
      "gdpr.text": "Usamos cookies necesarias y localStorage para que el sitio funcione. Sin seguimiento de marketing.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Mas info",
      "privacy.title": "Privacidad y GDPR",
      "privacy.body": "Usamos cookies necesarias y localStorage para el sitio (idioma, tema). Sin seguimiento de marketing. Si nos contactas, usamos tus datos solo para responder.",

      "final.title": "Listo para una propiedad mas limpia y fresca?",
      "final.sub": "Escribe a Clean-Nest por WhatsApp y nos encargamos del resto.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Gestion de Propiedades - Gran Canaria"
    },

    nb: {
      "meta.title": "Clean-Nest Eiendomsforvaltning | Gran Canaria",
      "meta.desc": "Eiendomstilsyn, hagearbeid, rengjoering og vedlikehold pa Gran Canaria. Palitelig eiendomsforvaltning med WhatsApp-stoette.",

      "nav.services": "Tjenester",
      "nav.how": "Slik fungerer det",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Eiendomstilsyn - Hagearbeid - Rengjoering",
      "hero.h1": "Paalitelig eiendomsforvaltning - slik at hjemmet ditt er perfekt nar du kommer.",
      "hero.sub": "Clean-Nest holder eiendommen din vedlikeholdt og ren - med tydelig kommunikasjon og profesjonelle standarder.",
      "hero.cta1": "Send oss WhatsApp",
      "hero.cta2": "Se hvordan det fungerer",

      "svc1.title": "Eiendomstilsyn",
      "svc1.desc": "Nokkelhaandtering, regelmessige kontroller.",
      "svc2.title": "Hagearbeid",
      "svc2.desc": "Velstelt hage, ryddige omgivelser.",
      "svc3.title": "Rengjoering og vedlikehold",
      "svc3.desc": "Regelmessig rengjoering og vaktmesteroppgaver.",

      "why.hosts.title": "Vart tilbud for korttidsutleiere",
      "why.hosts.sub": "Gjor korttidsutleien til en 5-stjerners opplevelse - uten a vaere pa oya. Maksimal gjesteopplevelse, hoy beleggsgrad og et hjem som alltid er klart.",
      "why.hosts.caption": "Ett team, ett maal - din tilfredshet er grunnlaget for hver beslutning vi tar.",
      "why.hosts.f1h": "Innsjekk og utsjekk",
      "why.hosts.f1p": "Profesjonell rengjoering slik at boligen er klar for neste gjest.",
      "why.hosts.f2h": "Vertsoppgaver ved behov",
      "why.hosts.f2p": "Nokkeloverlevering, visning av eiendommen.",
      "why.hosts.f3h": "Full markedsfoering",
      "why.hosts.f3p": "Foto og video samt tilstedevaerelse i sosiale medier.",
      "why.hosts.f4h": "Lokal stoette",
      "why.hosts.f4p": "Hjelp i alle uventede situasjoner.",
      "why.quality.title": "Hvorfor velge oss",
      "why.quality.sub": "Vi kompromisser ikke pa presisjon og palitelighet - vi tar vare pa eiendommen din som om den var vaar egen.",
      "why.box1.h": "Palitelighet",
      "why.box1.p": "Eiendommen din er i trygge hender - vi passer pa selv nar du ikke er til stede.",
      "why.box2.h": "Presisjon",
      "why.box2.p": "Innsjekk, rengjoering, vedlikehold: alt skjer noyaktig nar det skal.",
      "why.box3.h": "Fleksibilitet",
      "why.box3.p": "Vi tilpasser oss gjestetrafikk og dine behov - korttidsutleie har ingen fast plan.",
      "why.box4.h": "Korte frister",
      "why.box4.p": "Rask respons, umiddelbare losninger - korte frister uten kompromiss.",

      "how.title": "Hvordan starter vi samarbeidet?",
      "how.sub": "Hvis tjenestene og fordelene vaare overbeviser deg, er oppstarten enkel, rask og oversiktlig. All kommunikasjon skjer via WhatsApp - praktisk og uten unodvendige runder.",
      "how.s1": "Steg 1",
      "how.s1h": "Kontakt oss",
      "how.s1p": "Send oss en WhatsApp og fortell kort hva du trenger og hvor eiendommen ligger.",
      "how.s2": "Steg 2",
      "how.s2h": "Avklare detaljer",
      "how.s2p": "Vi gaar gjennom tjenester, frekvens, forventninger og spesielle behov slik at alt passer korttidsutleie.",
      "how.s3": "Steg 3",
      "how.s3h": "Gjennomforing og lopende oppdateringer",
      "how.s3p": "Vi utforer oppgavene, og du faar tydelige oppdateringer i tide. Eiendommen din er i trygge hender.",

      "reviews.title": "Hva folk sier om oss",
      "reviews.sub": "Vare vurderinger.",
      "reviews.r1h": "5-star: Alltid plettfritt.",
      "reviews.r1p": "Perfekt rengjoering og raske WhatsApp-svar.",
      "reviews.r2h": "5-star: Palitelig og proaktiv.",
      "reviews.r2p": "De oppdager problemer tidlig og har full kontroll.",
      "reviews.r3h": "5-star: Premium og friskt.",
      "reviews.r3p": "Akkurat det du vil ha for et hjem pa Gran Canaria.",
      "reviews.card1.text": "Jeg fikk virkelig tilbake leiligheten min ren og ryddig. Sofia",
      "reviews.card2.title": "Legg igjen en vurdering",
      "reviews.card3.title": "Gi oss tilbakemelding",

      "faq.title": "FAQ",
      "faq.sub": "Har du flere sporsmal? Send oss en melding.",
      "faq.q1": "Hvilke omrader dekker dere?",
      "faq.a1": "Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz.",
      "faq.q2": "Tilbyr dere nokkelhaandtering?",
      "faq.a2": "Ja - profesjonelt, med avtalte tilgangsregler.",
      "faq.q3": "Kan jeg fa regelmessige oppdateringer?",
      "faq.a3": "Ja - WhatsApp-oppdateringer na, automatiske rapporter senere.",

      "msg.title": "Send oss en melding",
      "msg.sub": "Skriv her, sa svarer vi pa e-post.",
      "msg.privacy": "Vi bruker opplysningene dine kun for a svare.",
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
      "gdpr.text": "Vi bruker nodvendige cookies og localStorage for at siden skal fungere. Ingen markedsforingssporing.",
      "gdpr.accept": "OK",
      "gdpr.learn": "Les mer",
      "privacy.title": "Personvern og GDPR",
      "privacy.body": "Vi bruker nodvendige cookies og localStorage for siden (sprak, tema). Ingen markedsforingssporing. Hvis du kontakter oss, bruker vi data kun for svar.",

      "final.title": "Klar for en renere og friskere eiendom?",
      "final.sub": "Send Clean-Nest en WhatsApp, sa tar vi oss av resten.",
      "final.btn": "+34 624 680 309",

      "footer.left": "(c) <span id=\"y\"></span> Clean-Nest Eiendomsforvaltning - Gran Canaria"
    },

    hu: {
      "meta.title": "Clean-Nest Ingatlankezelés | Gran Canaria",
      "meta.desc": "Ingatlanfelügyelet, kertgondozás, takarítás és karbantartás Gran Canarián. Megbízható ingatlankezelés WhatsApp támogatással.",

      "nav.services": "Szolgáltatások",
      "nav.how": "Hogyan működik",

      "cta.whatsappLabel": "WhatsApp:",

      "hero.pill": "<strong>Gran Canaria</strong> - Ingatlanfelügyelet - Kertgondozás - Takarítás",
      "hero.h1": "Megbízható ingatlankezelés - hogy az otthonod tökéletes legyen, amikor megérkezel.",
      "hero.sub": "A Clean-Nest karban és tisztán tartja az ingatlanod - átlátható kommunikációval és profi sztenderdekkel.",
      "hero.cta1": "Írj WhatsAppon",
      "hero.cta2": "Nézd meg, hogyan működik",

      "svc1.title": "Ingatlanfelügyelet",
      "svc1.desc": "Kulcskezelés, rendszeres ellenőrzés.",
      "svc2.title": "Kertgondozás",
      "svc2.desc": "Gondozott kert, rendezett környezet.",
      "svc3.title": "Takarítás és karbantartás",
      "svc3.desc": "Rendszeres takarítás és gondnoki teendők ellátása.",

      "why.hosts.title": "Ajánlatunk rövid távú lakáskiadóknak",
      "why.hosts.sub": "Tedd a lakáskiadásod 5-csillagos élménnyé - anélkül, hogy a szigeten lennél. Maximális vendégélmény, teljes kihasználtság és mindig készen álló otthon.",
      "why.hosts.caption": "Egy csapat, egy cél - az Ön elégedettsége minden döntésünk alapja.",
      "why.hosts.f1h": "Ki és bejelentkezés",
      "why.hosts.f1p": "Professzionális takarítás, hogy ingatlanod készen álljon az új vendég fogadására.",
      "why.hosts.f2h": "Igény esetén host feladatok ellátása",
      "why.hosts.f2p": "Kulcsok átadása, ingatlan bemutatása.",
      "why.hosts.f3h": "Teljes marketing kommunikáció",
      "why.hosts.f3p": "Fotók és videók készítése közösségi médiás megjelenés biztosítása.",
      "why.hosts.f4h": "Helyi támogatás",
      "why.hosts.f4p": "Asszisztencia minden váratlan helyzetben.",
      "why.quality.title": "Miért válassz minket",
      "why.quality.sub": "Pontosságban és megbízhatóságban nem ismerünk kompromisszumot - az Ön ingatlanát úgy óvjuk és kezeljük, mintha a sajátunk lenne.",
      "why.box1.h": "Megbízhatóság",
      "why.box1.p": "Ingatlanát biztos kezekben tudhatja - mi akkor is figyelünk rá, amikor Ön nincs jelen.",
      "why.box2.h": "Pontosság",
      "why.box2.p": "Check-in, takarítás, karbantartás: nálunk minden pontosan akkor történik, amikor kell.",
      "why.box3.h": "Rugalmasság",
      "why.box3.p": "Alkalmazkodunk a vendégforgalomhoz és az Ön igényeihez - mert a rövidtávú kiadás nem ismer fix menetrendet.",
      "why.box4.h": "Rövid határidő",
      "why.box4.p": "Gyors reakció, azonnali megoldások - rövid határidőkkel, kompromisszumok nélkül.",

      "how.title": "Hogyan indul a közös munka?",
      "how.sub": "Ha meggyőztek szolgáltatásaink és előnyeink, az indulás nálunk egyszerű, gyors és átlátható. A teljes kommunikáció WhatsAppon keresztül zajlik - kényelmesen, felesleges körök nélkül.",
      "how.s1": "1. lépés",
      "how.s1h": "Kapcsolatfelvétel",
      "how.s1p": "Írj nekünk WhatsAppon, és röviden oszd meg velünk, milyen segítségre van szükséged, valamint hol található az ingatlan.",
      "how.s2": "2. lépés",
      "how.s2h": "Részletek egyeztetése",
      "how.s2p": "Közösen átbeszéljük a szükséges szolgáltatásokat, a gyakoriságot, az elvárásokat és az egyedi igényeket, hogy minden pontosan a rövidtávú kiadás működéséhez igazodjon.",
      "how.s3": "3. lépés",
      "how.s3h": " Megvalósítás és folyamatos tájékoztatás",
      "how.s3p": "Mi elvégezzük a ránk bízott feladatokat, Te pedig időben, átlátható módon értesülsz mindenről. Így az ingatlanod gondozása biztos kezekben van.",

"reviews.title": "Rólunk mondták",
      "reviews.sub": "Értékeléseink.",
      "reviews.r1h": "5-star: Mindig makulátlan.",
      "reviews.r1p": "Tökéletes takarítás és gyors WhatsApp válaszok.",
      "reviews.r2h": "5-star: Megbízható és proaktív.",
      "reviews.r2p": "Időben észreveszik a problémákat és kézben tartanak mindent.",
      "reviews.r3h": "5-star: Prémium és friss.",
      "reviews.r3p": "Pont, amit egy gran canariai otthontól vársz.",
      "reviews.card1.text": "Valóban tisztán és rendezetten kaptam vissza a lakásomat. Sofia",
      "reviews.card2.title": "Írj értékelést",
      "reviews.card3.title": "Adj visszajelzést",

      "faq.title": "GYIK",
      "faq.sub": "Még kérdésed van? Írj nekünk.",
      "faq.q1": "Mely területeken dolgoztok?",
      "faq.a1": "Puerto Rico, Arguineguin, Maspalomas, Playa del Ingles, San Agustin, Bahia Feliz.",
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
