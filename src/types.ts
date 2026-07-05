export interface Service {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface Differentiator {
  id: number;
  title: string;
  description: string;
  tagline?: string;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface WebsiteContent {
  logo: {
    type: "text" | "image";
    initials: string;
    text: string;
    subtext: string;
    imageUrl: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineItalic: string;
    headlinePart3: string;
    subtitle: string;
    whatsappBtn: string;
    emailBtn: string;
  };
  marquee: string[];
  servicesSection: {
    tag: string;
    title: string;
    description: string;
    items: Service[];
  };
  ctaBanner: {
    quote: string;
    buttonText: string;
  };
  aboutSection: {
    tag: string;
    title: string;
    metric1Val: string;
    metric1Label: string;
    metric2Val: string;
    metric2Label: string;
    body: string;
    quote: string;
    buttonText: string;
  };
  whatWeDo: {
    tag: string;
    title: string;
    description1: string;
    description2: string;
    items: ChecklistItem[];
  };
  visionSection: {
    tag: string;
    quote: string;
    visionTitle: string;
    visionBody: string;
    missionTitle: string;
    missionBody: string;
  };
  whySection: {
    tag: string;
    title: string;
    description: string;
    items: Differentiator[];
  };
  founderSpotlight: {
    tag: string;
    name: string;
    title: string;
    quote: string;
    buttonText: string;
  };
  contactSection: {
    tag: string;
    title: string;
    description: string;
    addressTitle: string;
    addressValue: string;
    phoneTitle: string;
    phoneValue: string;
    emailTitle: string;
    emailValue: string;
    coordinatesTitle: string;
    coordinatesValue: string;
    coordinatesCity: string;
    coordinatesBtn: string;
  };
  footer: {
    title: string;
    description: string;
    contactTitle: string;
    addressTitle: string;
    addressValue: string;
    copyright: string;
    link1: string;
    link2: string;
  };
}
