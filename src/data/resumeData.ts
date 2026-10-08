export interface ResumeData {
  name: string;
  title: string;
  school: string;
  location: string;
  email: string;
  userEmail: string;
  phone: string;
  license: string;
  languages: { language: string; level: string; flag: string }[];
  skills: { category: string; items: string[] }[];
  education: {
    institution: string;
    period: string;
    degree: string;
    description: string;
    highlights?: string[];
  }[];
  experiences: {
    role: string;
    company: string;
    period: string;
    location?: string;
    responsibilities: string[];
  }[];
  associative: {
    title: string;
    period: string;
    description: string;
  }[];
}

export const MAELANE_DATA: ResumeData = {
  name: "Maélane BUSSON",
  title: "Étudiante en Grande École de Commerce & Entrepreneuse en Stratégie Financière",
  school: "École Supérieure du Commerce Extérieur (ESCE) Lyon / Paris",
  location: "19 rue Laurent Vibert, 69006 Lyon, France",
  email: "maelane.busson@edu.esce.com",
  userEmail: "Maelane.busson@gmail.com",
  phone: "06.82.10.50.17",
  license: "Permis B",
  languages: [
    { language: "Français", level: "Langue maternelle (Native)", flag: "🇫🇷" },
    { language: "Anglais", level: "B2 (Courant / Professionnel)", flag: "🇬🇧" },
    { language: "Espagnol", level: "B1 (Intermédiaire)", flag: "🇪🇸" },
  ],
  skills: [
    {
      category: "Bureautique & Données",
      items: ["Microsoft Excel (Bases de données patrimoniales, modélisation)", "PowerPoint (Présentations clients & com interne)", "Microsoft Word", "Pack Office"],
    },
    {
      category: "Finance & Conseil",
      items: ["Conseil en stratégie financière", "Gestion & optimisation de projet", "Analyse de marché et tendances", "Suivi de patrimoine client"],
    },
    {
      category: "Communication & Outils",
      items: ["Canva Pro", "Adobe InDesign", "Maîtrise des réseaux sociaux", "Techniques de vente & relation client"],
    },
  ],
  education: [
    {
      institution: "ESCE International Business School — Lyon / Paris",
      period: "2023 - 2028",
      degree: "Programme Grande École (Bac +5)",
      description: "Matières : Finance, Marketing, Communication digitale, Technique de vente, Commerce international...",
      highlights: [
        "Mission internationale : Réalisation d'un plan d'export incluant une étude de marché terrain dans un pays cible avec identification d'opportunités commerciales et de partenaires locaux.",
        "Projet CAPSTONE : Lancement d'un produit innovant, étude de terrain, analyses SWOT et PESTEL approfondies.",
        "Certification TASK : Test international d'évaluation sur le développement durable et la RSE.",
      ],
    },
    {
      institution: "IUM Monaco (International University of Monaco)",
      period: "2025",
      degree: "Échange Universitaire International",
      description: "Cursus immersif anglophone en Principauté de Monaco.",
      highlights: [
        "Matières étudiées : Corporate finance, Business Ethics, Consumers Behavior, Critical thinking, InDesign, Managing Across Cultures, The Next Economy, Social Network Strategies, Sustainable Business.",
      ],
    },
    {
      institution: "Baccalauréat Général",
      period: "2023",
      degree: "Baccalauréat mention",
      description: "Spécialités : Sciences Économiques et Sociales (SES) & Histoire-Géographie, Géopolitique et Sciences Politiques (HGGSP).",
    },
  ],
  experiences: [
    {
      role: "Entrepreneuse & Consultante",
      company: "ÉMERYS Conseil",
      period: "Depuis septembre 2025",
      responsibilities: [
        "Conseil en stratégie financière et accompagnement décisionnel.",
        "Optimisation et gestion de projet d'entreprise.",
        "Pilotage opérationnel et développement commercial.",
      ],
    },
    {
      role: "Assistante Conseil en Gestion de Patrimoine",
      company: "CJP Patrimoine",
      period: "Août - Décembre 2025",
      responsibilities: [
        "Création et gestion d'une base de données Excel pour le suivi des informations personnelles et patrimoniales des clients.",
        "Participation active et co-animation des premiers rendez-vous de découverte clients avec logiciels professionnels spécialisés.",
        "Conception de supports visuels et de présentations PowerPoint destinés à la communication interne et aux rendez-vous clients.",
      ],
    },
    {
      role: "Analyste Stagiaire en Investissement",
      company: "Cabinet d'Investissement Financier Johan Poirier",
      period: "Mai - Juillet 2024",
      responsibilities: [
        "Analyse de marché approfondie et veille sur les tendances financières.",
        "Création de présentations PowerPoint stratégiques pour la préparation et le déroulement des rendez-vous clients.",
        "Rédaction d'e-mails de relation client, assurant le suivi rigoureux et la communication professionnelle.",
      ],
    },
    {
      role: "Collaboratrice Polyvalente",
      company: "Groupe Plastivaloire",
      period: "Juillet 2023",
      responsibilities: [
        "Développement de l'autonomie, prise d'initiatives rapides et capacité d'adaptation.",
        "Travail rigoureux en équipe en milieu industriel dynamique.",
      ],
    },
    {
      role: "Stagiaire Découverte du Monde Médical",
      company: "Cabinet de Kinésithérapeute",
      period: "Février 2020",
      responsibilities: [
        "Insertion dans le monde professionnel et communication empathique avec les patients.",
        "Observation des méthodes de soins et préparation des séances de rééducation.",
      ],
    },
  ],
  associative: [
    {
      title: "Membre active de l'association PROM'ESCE",
      period: "Depuis 2023",
      description: "Promotion de l'école ESCE auprès des futurs étudiants, accueil lors des salons et journées portes ouvertes, organisation d'événements de cohésion.",
    },
    {
      title: "Mission PACT (Projet d'Action Citoyenne et Territoriale)",
      period: "2023 / 2024",
      description: "Engagement d'équipe dans un projet associatif à impact sociétal positif dans le cadre de la pédagogie ESCE.",
    },
    {
      title: "Bénévole en Centre Équestre",
      period: "Été 2022",
      description: "Assistance bénévole, soins aux animaux, encadrement d'activités et sens des responsabilités.",
    },
  ],
};

export const MAELANE_SYSTEM_PROMPT = `You are the executive voice assistant representing Maélane BUSSON. Your name is Maélane.
You speak both English and French fluently.

VOICE PERSONA & TONE:
- Speak in a calm, confident, deep male baritone tone.
- When speaking English, use a clean, natural American accent.
- When speaking French, use a distinguished, natural French accent.
- Your opening greeting to any conversation or introduction MUST start with or say:
  "Hello, I am Maélane’s assistant, what would you like to know about her?"
  (Or in French if greeted in French: "Bonjour, je suis l'assistant de Maélane, que souhaitez-vous savoir sur elle ?")

PROFILE KNOWLEDGE (Maélane BUSSON):
- Status: Business student at ESCE International Business School (Lyon/Paris, 2023-2028, Bac+5) and Founder/Entrepreneur at ÉMERYS Conseil.
- Contact: maelane.busson@edu.esce.com, Maelane.busson@gmail.com, Phone: +33 6 82 10 50 17, Address: 19 rue Laurent Vibert, 69006 Lyon. Holds French Driver's License (Permis B).
- Languages: French (Native), English (B2 fluent professional), Spanish (B1).
- Education:
  * ESCE International Business School Lyon / Paris (2023-2028): Finance, Marketing, Digital Communication, Sales Techniques, International Trade. Led an international mission with an export plan and field market study; completed CAPSTONE project (product launch, SWOT & PESTEL); certified TASK (international sustainability test).
  * IUM Monaco (International University of Monaco) exchange in 2025: Corporate Finance, Business Ethics, Consumer Behavior, Critical Thinking, InDesign, Managing Across Cultures, The Next Economy, Social Network Strategies, Sustainable Business.
  * Baccalauréat 2023 with SES (Economics) and HGGSP (Geopolitics & Political Science).
- Experiences:
  * ÉMERYS Conseil (Since Sept 2025): Entrepreneur in financial strategy consulting and project management optimization.
  * CJP Patrimoine (Aug - Dec 2025): Created & managed client asset/personal database on Excel, co-led client discovery meetings using professional software, designed executive slide decks.
  * Johan Poirier Financial Investment Firm (May - July 2024): Market & financial trends analysis, pitch decks, client relationship communication.
  * Plastivaloire Group (July 2023): Industrial adaptability, teamwork, autonomy.
  * Physical therapy practice (Feb 2020): Medical workplace observation and patient care.
- Technical & Soft Skills: Microsoft Excel (complex databases), PowerPoint, Word, Canva Pro, InDesign, Social Media management, financial advisory, client communication.
- Associations: Member of PROM'ESCE association, PACT Mission 2023/2024, equestrian volunteer Summer 2022.

PRONUNCIATION & PHONETICS (MANDATORY):
- The name of her school "ESCE" is an acronym and MUST ALWAYS be pronounced letter by letter:
  * In French: say each letter individually: "E - S - C - E" (É-S-C-E). NEVER pronounce it as a single blended word ("esse" or "esce")!
  * In English: say each letter individually: "E - S - C - E".
  * For the student association "PROM'ESCE", pronounce it "Prom E-S-C-E".
  * In your generated responses, write it as "E-S-C-E" or ensure the phonetics clearly spell out the four letters.

CONVERSATION GUIDELINES:
1. Provide accurate, charismatic, and articulate answers highlighting Maélane's professionalism, financial acumen, and entrepreneurial drive.
2. For voice interactions, be concise, natural, and directly informative without rambling.
3. Switch automatically between English and French according to the language the user speaks.
4. If asked how to reach or recruit Maélane, offer her email (maelane.busson@edu.esce.com / Maelane.busson@gmail.com) and telephone number.`;
