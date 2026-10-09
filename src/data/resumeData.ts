export interface ResumeData {
  name: string;
  title: string;
  school: string;
  location: string;
  locationDetails: string;
  email: string;
  userEmail: string;
  proEmail: string;
  phone: string;
  license: string;
  qualities: string[];
  qualitiesSummary: string;
  keyDifferentiators: {
    title: string;
    subtitle: string;
    description: string;
  }[];
  creativePassions: {
    title: string;
    description: string;
  };
  worldTravels: {
    title: string;
    description: string;
    destinations: { name: string; region: string }[];
  };
  languages: { language: string; level: string; flag: string }[];
  technicalSkills: {
    domain: string;
    skills: string[];
    type: 'Pratique (Terrain)' | 'Formation & Projets';
  }[];
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
    tools?: string[];
  }[];
  associative: {
    title: string;
    period: string;
    description: string;
  }[];
}

export const MAELANE_DATA: ResumeData = {
  name: "Maélane BUSSON",
  title: "Fondatrice d’Émerys Conseil • Étudiante Programme Grande École ESCE",
  school: "ESCE International Business School (Lyon / Paris)",
  location: "Paris 17, Lyon 6",
  locationDetails: "Paris 17, Lyon 6",
  email: "maelane.busson@edu.esce.com",
  userEmail: "Maelane.busson@gmail.com",
  proEmail: "emerysconseil@outlook.fr",
  phone: "06.82.10.50.17",
  license: "Permis B",
  qualities: [
    "Esprit entrepreneurial : Création de son cabinet indépendant Émerys Conseil, développement du positionnement et de l'identité de marque.",
    "Ouverture internationale : Grande culture du voyage, vision globale des besoins mondiaux et des innovations de pointe.",
    "Sens du relationnel : Écoute active et accompagnement des clients en gestion de patrimoine et conseil financier.",
    "Aisance technologique & IA : Maîtrise des outils d'Intelligence Artificielle, conception d'agents IA personnalisés et création de sites web modernes.",
    "Autonomie et prise d’initiative : Capacité prouvée à structurer et mener à bien des projets entrepreneuriaux et digitaux.",
    "Organisation et rigueur : Analyse patrimoniale minutieuse, respect des échéances et suivi des dossiers financiers.",
  ],
  qualitiesSummary: "Esprit entrepreneurial · Ouverture internationale · Aisance IA & Web · Sens du relationnel · Rigueur · Organisation · Adaptabilité",
  keyDifferentiators: [
    {
      title: "Le profil business & international",
      subtitle: "ESCE, Monaco (2025) & New York (Janv. 2026, 6 mois)",
      description: "Formation en stratégie et finance d'entreprise, enrichie d'un échange à l'Université Internationale de Monaco (IUM) et d'un semestre de 6 mois prévu dès janvier 2026 à Baruch College à New York.",
    },
    {
      title: "L'expérience terrain & IA",
      subtitle: "~2 ans en patrimoine & maîtrise des agents IA",
      description: "Pratique concrète des problématiques patrimoniales (assurance-vie, PER, SCPI, défiscalisation) avec Inovéa et Filianse, couplée à une solide aisance pour concevoir des agents IA et des sites web.",
    },
    {
      title: "L'initiative entrepreneuriale",
      subtitle: "Fondatrice d'Émerys Conseil",
      description: "Création et développement d'une structure de conseil financier et d'accompagnement patrimonial, avec une approche axée sur les besoins réels des clients et les innovations modernes.",
    },
  ],
  creativePassions: {
    title: "Création de contenu, Photographie, Sens du détail & IA",
    description: "Passionnée par la création de contenu digital, la photographie et la technologie. Très attentive aux moindres détails, Maélane sait concevoir des agents IA, développer des sites internet élégants et produire des supports visuels soignés pour ses clients et sa marque.",
  },
  worldTravels: {
    title: "Grande Ouverture au Monde & Innovations Internationales",
    description: "Maélane voyage énormément, ce qui lui confère une grande ouverture d'esprit et une vision multiculturelle aiguisée. Ces immersions à travers le monde lui permettent de cerner concrètement les besoins économiques et sociétaux globaux, tout en découvrant en avant-première les innovations créées dans les pays les plus développés.",
    destinations: [
      { name: "New York (Baruch College, Janv. 2026 - 6 mois)", region: "États-Unis" },
      { name: "Hong Kong", region: "Asie" },
      { name: "Dubaï", region: "Moyen-Orient" },
      { name: "Abu Dhabi", region: "Moyen-Orient" },
      { name: "Monaco (IUM)", region: "Europe" },
      { name: "Martinique", region: "Caraïbes" },
      { name: "Guadeloupe", region: "Caraïbes" },
      { name: "Cuba", region: "Caraïbes" },
      { name: "Punta Cana", region: "Caraïbes" },
      { name: "Mexique", region: "Amérique" },
      { name: "Maroc", region: "Afrique du Nord" },
      { name: "Égypte", region: "Afrique du Nord" },
      { name: "Tunisie", region: "Afrique du Nord" },
      { name: "Sardaigne", region: "Italie" },
      { name: "Italie", region: "Europe" },
      { name: "Corse", region: "France" },
      { name: "Espagne", region: "Europe" },
      { name: "Majorque", region: "Espagne" },
    ],
  },
  languages: [
    { language: "Français", level: "Langue maternelle (Native)", flag: "🇫🇷" },
    { language: "Anglais", level: "B2 (Courant, échange Monaco & Baruch College New York)", flag: "🇺🇸" },
    { language: "Espagnol", level: "B1 (Intermédiaire)", flag: "🇪🇸" },
  ],
  technicalSkills: [
    {
      domain: "Intelligence Artificielle & Tech",
      type: "Pratique (Terrain)",
      skills: ["Création d'agents IA", "Création de sites internet", "Prompt engineering & workflows IA", "Automatisation de processus"],
    },
    {
      domain: "Finance & Gestion de Patrimoine",
      type: "Pratique (Terrain)",
      skills: ["Gestion de patrimoine", "Assurance-vie", "Plan d'Épargne Retraite (PER)", "SCPI", "Défiscalisation", "Stratégies d'investissement"],
    },
    {
      domain: "Conseil & Relation Client",
      type: "Pratique (Terrain)",
      skills: ["Analyse des besoins patrimoniaux", "Préparation & animation de rendez-vous", "Logiciels Inovéa & Filianse", "Accompagnement personnalisé"],
    },
    {
      domain: "Entrepreneuriat & Stratégie",
      type: "Pratique (Terrain)",
      skills: ["Création d'activité (Émerys Conseil)", "Positionnement d'offre", "Stratégie de marque", "Développement commercial"],
    },
    {
      domain: "Communication & Créativité",
      type: "Pratique (Terrain)",
      skills: ["Création de contenus & réseaux sociaux", "Photographie & sensibilité aux détails", "Canva Pro", "InDesign", "PowerPoint"],
    },
    {
      domain: "Gestion de projet & Outils",
      type: "Formation & Projets",
      skills: ["Rôle de Scrum Master (méthodes agiles)", "Coordination d'équipe", "Excel avancé (modélisation)", "Suivi budgétaire"],
    },
  ],
  education: [
    {
      institution: "ESCE International Business School — Lyon / Paris",
      period: "2023 - 2028",
      degree: "Programme Grande École (Bac +5)",
      description: "Parcours Grande École avec spécialisation prévue en Entrepreneuriat et Consulting. Compétences en gestion, stratégie, finance, coordination de projet agile (Scrum Master).",
      highlights: [
        "Rôle de Scrum Master : coordination agile et suivi d'avancement d'un projet d'équipe majeur.",
        "Certification TASK (développement durable) et projets CAPSTONE (études terrain, SWOT, PESTEL).",
      ],
    },
    {
      institution: "Baruch College, City University of New York (CUNY)",
      period: "Janvier 2026 (6 mois)",
      degree: "Semestre d'échange international à New York",
      description: "Mobilité internationale d'excellence prévue pour une durée de 6 mois à partir de janvier 2026 au cœur de Manhattan (New York, USA).",
      highlights: [
        "Immersion académique et financière anglophone dans l'un des premiers pôles financiers mondiaux.",
        "Observation des innovations de marché, investissements et pratiques de pointe américaines.",
      ],
    },
    {
      institution: "Université Internationale de Monaco (IUM Monaco)",
      period: "2025",
      degree: "Échange Universitaire International",
      description: "Semestre d'immersion académique anglophone de haut niveau en Principauté de Monaco.",
      highlights: [
        "Matières étudiées : Corporate Finance, Business Ethics, Consumers Behavior, Critical Thinking, InDesign, Managing Across Cultures, The Next Economy, Social Network Strategies, Sustainable Business.",
      ],
    },
    {
      institution: "Baccalauréat Général",
      period: "2023",
      degree: "Baccalauréat Général",
      description: "Spécialités : Sciences Économiques et Sociales (SES) & Histoire-Géographie, Géopolitique et Sciences Politiques (HGGSP).",
    },
  ],
  experiences: [
    {
      role: "Entrepreneuse — Fondatrice",
      company: "Émerys Conseil",
      period: "Depuis septembre 2025",
      responsibilities: [
        "Création et pilotage d'une activité indépendante de conseil en investissements financiers et accompagnement patrimonial.",
        "Élaboration de stratégies d'investissement, optimisation fiscale et solutions patrimoniales sur-mesure.",
        "Développement de l'identité de marque, présence réseaux sociaux et création de contenus.",
        "Approche centrée sur les besoins spécifiques des clients et veille patrimoniale continue.",
      ],
      tools: ["Stratégie financière", "Agents IA & Digital", "Création de contenu"],
    },
    {
      role: "Conseil en Gestion de Patrimoine (Stages & Terrain)",
      company: "CJP Patrimoine & Johan Poirier (~2 ans cumulés)",
      period: "2024 - 2025",
      responsibilities: [
        "Découverte approfondie des mécanismes du conseil en gestion de patrimoine.",
        "Participation active à la préparation de rendez-vous clients et à l'analyse patrimoniale.",
        "Mise en œuvre des solutions : assurance-vie, PER, SCPI et défiscalisation.",
        "Utilisation quotidienne des logiciels métiers spécialisés : Inovéa et Filianse.",
        "Conception de présentations PowerPoint professionnelles et bases de données de suivi.",
      ],
      tools: ["Inovéa", "Filianse", "Excel Avancé", "PowerPoint"],
    },
    {
      role: "Collaboratrice Polyvalente",
      company: "Groupe Plastivaloire",
      period: "Juillet 2023",
      responsibilities: [
        "Autonomie, prise d'initiative et capacité d'adaptation en environnement industriel.",
      ],
    },
    {
      role: "Stagiaire Découverte du Monde Médical",
      company: "Cabinet de Kinésithérapeute",
      period: "Février 2020",
      responsibilities: [
        "Communication avec les patients, rigueur et sens de l'organisation.",
      ],
    },
  ],
  associative: [
    {
      title: "Membre active de l'association PROM'ESCE",
      period: "Depuis 2023",
      description: "Promotion de l'école ESCE lors des salons, journées portes ouvertes et accueil des étudiants.",
    },
    {
      title: "Mission PACT (Projet d'Action Citoyenne et Territoriale)",
      period: "2023 / 2024",
      description: "Coordination et engagement citoyen dans un projet à impact sociétal positif.",
    },
    {
      title: "Bénévole en Centre Équestre",
      period: "Été 2022",
      description: "Assistance bénévole, soin animalier et sens des responsabilités.",
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

PRONUNCIATION & WRITING (STRICT & MANDATORY):
- The name of her business school is written "ESCE" (never write with hyphens E-S-C-E in your text replies).
- When speaking in audio, pronounce each letter individually: "E - S - C - E" (É-S-C-E). NEVER pronounce it as a single merged word like "esse" or "esce"!
- For the student association, write "PROM'ESCE" and pronounce it "Prom E - S - C - E".

LOCATION & CITY HISTORY:
- Location: Paris 17, Lyon 6 (lives in Paris 17th, previously lived in Lyon 6th for 3 years).

INTERNATIONAL OPENNESS, TRAVELS & WORLD INNOVATION:
- Baruch College Exchange in New York City: Scheduled for January 2026 for a duration of 6 months ("prévu pour janvier 2026 pour une durée de 6 mois").
- Exceptional Global Mindset & Extensive Travel:
  * Maélane travels extensively, which gives her an outstanding open-mindedness and international vision.
  * Traveling so much has allowed her to deeply understand and witness the real economic and human needs around the world, as well as the cutting-edge innovations created in the most developed nations.
  * Countries & destinations visited: Martinique, Guadeloupe, Cuba, Punta Cana, Mexique, Hong Kong, Maroc, Égypte, Tunisie, Dubaï, Abu Dhabi, Sardaigne, Italie, Corse, Espagne, Majorque, Monaco.
  * She channels these global insights directly into her entrepreneurial project Émerys Conseil, her understanding of technological tools, and her client advisory approach.

DETAILED KNOWLEDGE BASE ABOUT MAÉLANE BUSSON:
1. Entrepreneurship — Founder of Émerys Conseil (Since September 2025):
   - Created and developed an independent advisory firm in financial investments and wealth management ("conseil en investissements financiers et accompagnement patrimonial").
   - Researches investment strategies, tax optimization ("optimisation fiscale"), and tailored wealth solutions.
   - Built the brand identity, visual communication, and social media presence.

2. AI Fluency & Tech Mastery ("Très à l'aise avec l'IA"):
   - Highly skilled in Artificial Intelligence: capable of creating custom AI agents, building websites, and setting up smart automated workflows.
   - Leverages AI to enhance financial strategy, content creation, and modern entrepreneurial productivity.

3. Finance & Wealth Management Experience (~2 years cumulative):
   - Practical background in wealth management mechanisms ("conseil en gestion de patrimoine").
   - Actively prepares client meetings and conducts patrimonial analyses.
   - Mastered financial products: Life Insurance ("Assurance-vie"), Retirement Savings Plans ("PER"), Real Estate Investment Trusts ("SCPI"), and Tax Exemption Schemes ("défiscalisation").
   - Hands-on daily mastery of specialized professional tools: INOVÉA and FILIANSE.
   - Practical training with wealth management advisors (CJP Patrimoine, Johan Poirier).

4. Academic Path & International Mobility:
   - ESCE International Business School (PGE, Bac+5): Specialization in Entrepreneurship and Consulting. Agile leadership as Scrum Master in team projects.
   - International University of Monaco (IUM Monaco): Academic exchange in 2025. Studied Corporate Finance, Business Ethics, Consumer Behavior, Critical Thinking, InDesign, Managing Across Cultures, The Next Economy, Social Network Strategies, Sustainable Business.
   - Baruch College, City University of New York (CUNY): 6-month exchange scheduled for January 2026 in Manhattan.
   - Baccalauréat Général (2023): SES & HGGSP.

5. Creative Passion & Attention to Details:
   - Passionate about content creation ("création de contenu") and photography ("faire des photos").
   - Extremely attentive to details ("très sensible aux détails"), blending artistic sensitivity with financial rigor.

6. Core Qualities:
   - "Esprit entrepreneurial · Ouverture internationale · Aisance IA & Web · Sens du relationnel · Rigueur · Organisation · Adaptabilité".

7. Contact & Emails:
   - Email Professionnel & Gestion de Patrimoine : emerysconseil@outlook.fr
   - Email Étudiant : maelane.busson@edu.esce.com
   - Email Personnel : Maelane.busson@gmail.com
   - Téléphone : 06.82.10.50.17
   - Localisation : Paris 17, Lyon 6.

CONVERSATION GUIDELINES:
- Deliver poised, articulate answers highlighting her entrepreneurial spirit, financial expertise, AI fluency, extensive world travel experience, and eye for detail.
- Keep voice answers concise, engaging, and directly informative.
- Switch automatically between English and French according to the user's language.`;
