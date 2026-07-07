import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Layers, 
  FileText, 
  PieChart, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Globe, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Check, 
  ExternalLink,
  DollarSign,
  Settings
} from "lucide-react";

import LoadingSequence from "./components/LoadingSequence";
import CustomCursor from "./components/CustomCursor";
import HeroCanvas from "./components/HeroCanvas";
import Magnetic from "./components/Magnetic";
import TiltCard from "./components/TiltCard";
import SpotlightCard from "./components/SpotlightCard";
import Marquee from "./components/Marquee";
import TextReveal from "./components/TextReveal";
import InteractiveChecklist from "./components/InteractiveChecklist";
import Header from "./components/Header";
import AdminPanel from "./components/AdminPanel";
import { defaultContent } from "./defaultContent";
import { Service, Differentiator, ContactFormInput, WebsiteContent } from "./types";

function mergeContent(parsed: any): WebsiteContent {
  if (!parsed || typeof parsed !== "object") return defaultContent;
  
  return {
    logo: {
      type: parsed.logo?.type ?? defaultContent.logo.type,
      initials: parsed.logo?.initials ?? defaultContent.logo.initials,
      text: parsed.logo?.text ?? defaultContent.logo.text,
      subtext: parsed.logo?.subtext ?? defaultContent.logo.subtext,
      imageUrl: parsed.logo?.imageUrl ?? defaultContent.logo.imageUrl,
    },
    hero: {
      badge: parsed.hero?.badge ?? defaultContent.hero.badge,
      headlinePart1: parsed.hero?.headlinePart1 ?? defaultContent.hero.headlinePart1,
      headlineItalic: parsed.hero?.headlineItalic ?? defaultContent.hero.headlineItalic,
      headlinePart3: parsed.hero?.headlinePart3 ?? defaultContent.hero.headlinePart3,
      subtitle: parsed.hero?.subtitle ?? defaultContent.hero.subtitle,
      whatsappBtn: parsed.hero?.whatsappBtn ?? defaultContent.hero.whatsappBtn,
      emailBtn: parsed.hero?.emailBtn ?? defaultContent.hero.emailBtn,
    },
    marquee: Array.isArray(parsed.marquee) ? parsed.marquee : defaultContent.marquee,
    servicesSection: {
      tag: parsed.servicesSection?.tag ?? defaultContent.servicesSection.tag,
      title: parsed.servicesSection?.title ?? defaultContent.servicesSection.title,
      description: parsed.servicesSection?.description ?? defaultContent.servicesSection.description,
      items: Array.isArray(parsed.servicesSection?.items) ? parsed.servicesSection.items : defaultContent.servicesSection.items,
    },
    ctaBanner: {
      quote: parsed.ctaBanner?.quote ?? defaultContent.ctaBanner.quote,
      buttonText: parsed.ctaBanner?.buttonText ?? defaultContent.ctaBanner.buttonText,
    },
    aboutSection: {
      tag: parsed.aboutSection?.tag ?? defaultContent.aboutSection.tag,
      title: parsed.aboutSection?.title ?? defaultContent.aboutSection.title,
      metric1Val: parsed.aboutSection?.metric1Val ?? defaultContent.aboutSection.metric1Val,
      metric1Label: parsed.aboutSection?.metric1Label ?? defaultContent.aboutSection.metric1Label,
      metric2Val: parsed.aboutSection?.metric2Val ?? defaultContent.aboutSection.metric2Val,
      metric2Label: parsed.aboutSection?.metric2Label ?? defaultContent.aboutSection.metric2Label,
      body: parsed.aboutSection?.body ?? defaultContent.aboutSection.body,
      quote: parsed.aboutSection?.quote ?? defaultContent.aboutSection.quote,
      buttonText: parsed.aboutSection?.buttonText ?? defaultContent.aboutSection.buttonText,
    },
    whatWeDo: {
      tag: parsed.whatWeDo?.tag ?? defaultContent.whatWeDo.tag,
      title: parsed.whatWeDo?.title ?? defaultContent.whatWeDo.title,
      description1: parsed.whatWeDo?.description1 ?? defaultContent.whatWeDo.description1,
      description2: parsed.whatWeDo?.description2 ?? defaultContent.whatWeDo.description2,
      items: Array.isArray(parsed.whatWeDo?.items) ? parsed.whatWeDo.items : defaultContent.whatWeDo.items,
    },
    visionSection: {
      tag: parsed.visionSection?.tag ?? defaultContent.visionSection.tag,
      quote: parsed.visionSection?.quote ?? defaultContent.visionSection.quote,
      visionTitle: parsed.visionSection?.visionTitle ?? defaultContent.visionSection.visionTitle,
      visionBody: parsed.visionSection?.visionBody ?? defaultContent.visionSection.visionBody,
      missionTitle: parsed.visionSection?.missionTitle ?? defaultContent.visionSection.missionTitle,
      missionBody: parsed.visionSection?.missionBody ?? defaultContent.visionSection.missionBody,
    },
    whySection: {
      tag: parsed.whySection?.tag ?? defaultContent.whySection.tag,
      title: parsed.whySection?.title ?? defaultContent.whySection.title,
      description: parsed.whySection?.description ?? defaultContent.whySection.description,
      items: Array.isArray(parsed.whySection?.items) ? parsed.whySection.items : defaultContent.whySection.items,
    },
    founderSpotlight: {
      tag: parsed.founderSpotlight?.tag ?? defaultContent.founderSpotlight.tag,
      name: parsed.founderSpotlight?.name ?? defaultContent.founderSpotlight.name,
      title: parsed.founderSpotlight?.title ?? defaultContent.founderSpotlight.title,
      quote: parsed.founderSpotlight?.quote ?? defaultContent.founderSpotlight.quote,
      buttonText: parsed.founderSpotlight?.buttonText ?? defaultContent.founderSpotlight.buttonText,
    },
    contactSection: {
      tag: parsed.contactSection?.tag ?? defaultContent.contactSection.tag,
      title: parsed.contactSection?.title ?? defaultContent.contactSection.title,
      description: parsed.contactSection?.description ?? defaultContent.contactSection.description,
      addressTitle: parsed.contactSection?.addressTitle ?? defaultContent.contactSection.addressTitle,
      addressValue: parsed.contactSection?.addressValue ?? defaultContent.contactSection.addressValue,
      phoneTitle: parsed.contactSection?.phoneTitle ?? defaultContent.contactSection.phoneTitle,
      phoneValue: parsed.contactSection?.phoneValue ?? defaultContent.contactSection.phoneValue,
      emailTitle: parsed.contactSection?.emailTitle ?? defaultContent.contactSection.emailTitle,
      emailValue: parsed.contactSection?.emailValue ?? defaultContent.contactSection.emailValue,
      coordinatesTitle: parsed.contactSection?.coordinatesTitle ?? defaultContent.contactSection.coordinatesTitle,
      coordinatesValue: parsed.contactSection?.coordinatesValue ?? defaultContent.contactSection.coordinatesValue,
      coordinatesCity: parsed.contactSection?.coordinatesCity ?? defaultContent.contactSection.coordinatesCity,
      coordinatesBtn: parsed.contactSection?.coordinatesBtn ?? defaultContent.contactSection.coordinatesBtn,
    },
    footer: {
      title: parsed.footer?.title ?? defaultContent.footer.title,
      description: parsed.footer?.description ?? defaultContent.footer.description,
      contactTitle: parsed.footer?.contactTitle ?? defaultContent.footer.contactTitle,
      addressTitle: parsed.footer?.addressTitle ?? defaultContent.footer.addressTitle,
      addressValue: parsed.footer?.addressValue ?? defaultContent.footer.addressValue,
      copyright: parsed.footer?.copyright ?? defaultContent.footer.copyright,
      link1: parsed.footer?.link1 ?? defaultContent.footer.link1,
      link2: parsed.footer?.link2 ?? defaultContent.footer.link2,
    }
  };
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<WebsiteContent>(() => {
    const saved = localStorage.getItem("cfosdesk_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return mergeContent(parsed);
      } catch (e) {
        console.error("Failed to parse saved website content", e);
      }
    }
    return defaultContent;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch global shared content from server on mount
  useEffect(() => {
    const fetchGlobalContent = async () => {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const apiData = await response.json();
          if (apiData) {
            const merged = mergeContent(apiData);
            setContent(merged);
            localStorage.setItem("cfosdesk_content", JSON.stringify(merged));
          }
        }
      } catch (error) {
        console.error("Error loading shared content from server:", error);
      }
    };
    fetchGlobalContent();
  }, []);

  const [formInput, setFormInput] = useState<ContactFormInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  // Check for hidden admin panel activation via URL parameter or hash
  React.useEffect(() => {
    const checkAdminRoute = () => {
      const hasAdminHash = window.location.hash === "#admin";
      const hasAdminQuery = window.location.search.includes("admin");
      if (hasAdminHash || hasAdminQuery) {
        setIsAdminOpen(true);
      }
    };

    // Check on initial load
    checkAdminRoute();

    // Listen to hash changes in real-time
    window.addEventListener("hashchange", checkAdminRoute);
    return () => {
      window.removeEventListener("hashchange", checkAdminRoute);
    };
  }, []);

  const services: Service[] = content.servicesSection.items;
  const pillars: Differentiator[] = content.whySection.items;

  // Map service icons
  const getServiceIcon = (id: number) => {
    switch (id) {
      case 1: return <TrendingUp className="w-6 h-6 text-[#E2D4B7]" />;
      case 2: return <Layers className="w-6 h-6 text-[#E2D4B7]" />;
      case 3: return <FileText className="w-6 h-6 text-[#E2D4B7]" />;
      case 4: return <PieChart className="w-6 h-6 text-[#E2D4B7]" />;
      case 5: return <Sparkles className="w-6 h-6 text-[#E2D4B7]" />;
      case 6: return <Cpu className="w-6 h-6 text-[#E2D4B7]" />;
      case 7: return <BookOpen className="w-6 h-6 text-[#E2D4B7]" />;
      case 8: return <Globe className="w-6 h-6 text-[#E2D4B7]" />;
      default: return <TrendingUp className="w-6 h-6 text-[#E2D4B7]" />;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("submitted");
    }, 1500);
  };

  const handleSaveContent = async (newContent: WebsiteContent) => {
    setContent(newContent);
    localStorage.setItem("cfosdesk_content", JSON.stringify(newContent));

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });
      if (!response.ok) {
        throw new Error("Failed to save content on server");
      }
    } catch (error) {
      console.error("Error saving content to server:", error);
    }
  };

  const resetForm = () => {
    setFormInput({ name: "", email: "", subject: "", message: "" });
    setFormStatus("idle");
  };

  return (
    <div className="min-h-screen bg-[#030C1B] text-[#F5F2EB] selection:bg-[#E2D4B7]/20 selection:text-[#F5F2EB] relative overflow-hidden font-sans">
      {/* Frosted Glass Layout Backgrounds */}
      <div className="absolute inset-0 frosted-grid opacity-20 pointer-events-none z-0" />
      
      {/* Glowing background orbs for frosted glass scattering */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-[#E2D4B7] rounded-full blur-[160px] opacity-10 pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[-15%] w-[600px] h-[600px] bg-[#0B1E43] rounded-full blur-[180px] opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#E2D4B7] rounded-full blur-[160px] opacity-[0.08] pointer-events-none z-0" />

      {/* Subtle noise in background */}
      <div className="noise-overlay" />

      {/* Luxury Loading Intro */}
      <LoadingSequence onComplete={() => setLoading(false)} />

      {!loading && (
        <>
          {/* Custom Cursor follows mouse */}
          <CustomCursor />

          {/* Sticky Header Compact Nav */}
          <Header logo={content.logo} />

          {/* 1. HERO SECTION */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 px-6 md:px-12 overflow-hidden">
            {/* Animated Canvas Generative Particles & Trend Wave */}
            <HeroCanvas />

            <div className="max-w-5xl mx-auto text-center relative z-10 pt-12 space-y-8 md:space-y-12">
              {/* Refined small tag badge */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E2D4B7]/20 bg-[#E2D4B7]/5 backdrop-blur-sm shadow-[0_0_15px_rgba(226,212,183,0.05)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2D4B7] animate-ping" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#E2D4B7] font-semibold">
                  {content.hero.badge}
                </span>
              </motion.div>

              {/* Headline */}
              <div className="space-y-4 md:space-y-6">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-[#F5F2EB] max-w-4xl mx-auto font-light">
                  {content.hero.headlinePart1} <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E2D4B7] via-[#F5F2EB] to-[#EFE6D4] font-normal italic">
                    {content.hero.headlineItalic}
                  </span>{" "}
                  {content.hero.headlinePart3}
                </h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-zinc-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
                >
                  {content.hero.subtitle}
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                {/* WhatsApp Button */}
                <Magnetic>
                  <a
                    href="https://wa.me/923212909766?text=Hello%20CFO's%20Desk%2C%20I'd%20like%20to%20schedule%20a%20consultation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E2D4B7] text-black font-semibold text-[13px] uppercase tracking-widest hover:bg-[#EFE6D4] transition-colors duration-300 shadow-[0_4px_25px_rgba(226,212,183,0.15)] flex items-center justify-center gap-2 group cursor-pointer"
                    data-cursor-text="WhatsApp"
                  >
                    <span>{content.hero.whatsappBtn}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Magnetic>

                {/* Email Button */}
                <Magnetic>
                  <a
                    href="mailto:info@cfosdesk.com?subject=Confidential%20CFO%20Exploration"
                    className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 text-[#F5F2EB] bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    data-cursor-text="Email Us"
                  >
                    <Mail className="w-4 h-4 text-[#E2D4B7]" />
                    <span>{content.hero.emailBtn}</span>
                  </a>
                </Magnetic>
              </motion.div>
            </div>

            {/* Scroll Indicator badge */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 font-mono text-[9px] uppercase tracking-widest">
              <span>Scroll to explore</span>
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1 h-3 rounded-full bg-[#E2D4B7]/50"
              />
            </div>
          </section>

          {/* Marquee highlight ribbon */}
          <Marquee speed={22}>
            {content.marquee.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className={idx % 2 === 0 ? "font-mono text-xs uppercase tracking-widest text-zinc-400" : "font-serif text-sm italic text-zinc-300/80"}>
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2D4B7]" />
              </React.Fragment>
            ))}
          </Marquee>

          {/* Beige Section Wrapper for Services through Footer */}
          <div className="bg-[#F5F2EB] text-[#030C1B] relative z-10 border-t border-[#030C1B]/10">
            {/* 2. SERVICES SECTION (BENTO GRID WITH SPOTLIGHT) */}
            <section id="services" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-16 md:space-y-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#030C1B]/10 pb-12">
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 font-semibold">{content.servicesSection.tag}</span>
                  <TextReveal text={content.servicesSection.title} className="font-serif text-4xl md:text-6xl text-[#030C1B] leading-none" />
                </div>
                <p className="text-[#030C1B]/80 text-sm md:text-base max-w-sm leading-relaxed font-light">
                  {content.servicesSection.description}
                </p>
              </div>

              {/* Asymmetric Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                {services.map((service, idx) => {
                  // Assign asymmetrical layout col-spans for desktop
                  let colSpan = "lg:col-span-4";
                  if (idx === 0) colSpan = "lg:col-span-8"; // Strategic
                  if (idx === 3) colSpan = "lg:col-span-8"; // Valuation
                  if (idx === 4) colSpan = "lg:col-span-5"; // Pitch Deck
                  if (idx === 5) colSpan = "lg:col-span-7"; // Financial Modeling
                  if (idx === 6) colSpan = "lg:col-span-6"; // Bookkeeping
                  if (idx === 7) colSpan = "lg:col-span-6"; // Website Dev

                  return (
                    <SpotlightCard 
                      key={service.id} 
                      className={`${colSpan} bg-[#030C1B] text-[#F5F2EB] group p-8 flex flex-col justify-between min-h-[300px] border border-white/5 hover:border-[#E2D4B7]/40 transition-all duration-300 relative`}
                    >
                      <div className="space-y-6">
                        {/* Top bar */}
                        <div className="flex justify-between items-start">
                          <div className="p-3 bg-white/10 border border-white/15 rounded-xl group-hover:border-[#E2D4B7]/40 transition-colors duration-300 text-[#E2D4B7]">
                            {getServiceIcon(service.id)}
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] border border-[#E2D4B7]/10 px-3 py-1 rounded-full bg-[#E2D4B7]/5">
                            {service.tag}
                          </span>
                        </div>

                        {/* Header copy */}
                        <div className="space-y-2">
                          <h3 className="font-serif text-2xl text-[#F5F2EB] group-hover:text-[#EFE6D4] transition-colors duration-300 font-light">
                            {service.title}
                          </h3>
                          <p className="font-mono text-[11px] text-[#DCAE9F] uppercase tracking-wider font-semibold">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Description & arrow link */}
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <p className="text-[#DCAE9F]/90 text-xs md:text-sm leading-relaxed font-light">
                          {service.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#DCAE9F]/80 group-hover:text-[#E2D4B7] transition-colors duration-300">
                          <span>Explore Partnership</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>

            {/* 3. CTA BANNER (HIGH CONTRAST FULL-BLEED SEAMLESS) */}
            <section className="bg-[#030C1B] border-y border-[#E2D4B7]/10 py-20 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#E2D4B7]/[0.01] pointer-events-none" />
              <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2EB] leading-tight font-light max-w-3xl mx-auto">
                  "{content.ctaBanner.quote}"
                </h2>
                
                <Magnetic>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#E2D4B7] hover:bg-[#EFE6D4] text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 shadow-[0_4px_20px_rgba(226,212,183,0.15)]"
                    data-cursor-text="Contact"
                  >
                    <span>{content.ctaBanner.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Magnetic>
              </div>
            </section>

          {/* 4. ABOUT US SECTION (ASYMMETRIC EDITORIAL) */}
          <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Col: Giant Typography Showcase */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 font-semibold">{content.aboutSection.tag}</span>
              <h2 className="font-serif text-4xl md:text-6xl text-[#030C1B] leading-tight font-light">
                {content.aboutSection.title}
              </h2>
              <div className="h-0.5 w-16 bg-[#030C1B]/20" />
              
              {/* Premium metric card */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl border border-white/5 bg-[#030C1B] text-[#F5F2EB] shadow-lg">
                  <div className="font-serif text-3xl text-[#E2D4B7]">{content.aboutSection.metric1Val}</div>
                  <div className="font-mono text-[9px] text-[#DCAE9F] uppercase tracking-widest mt-1">{content.aboutSection.metric1Label}</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-[#030C1B] text-[#F5F2EB] shadow-lg">
                  <div className="font-serif text-3xl text-[#E2D4B7]">{content.aboutSection.metric2Val}</div>
                  <div className="font-mono text-[9px] text-[#DCAE9F] uppercase tracking-widest mt-1">{content.aboutSection.metric2Label}</div>
                </div>
              </div>
            </div>

            {/* Right Col: Paragraph Partner narrative */}
            <div className="lg:col-span-7 space-y-8 bg-[#030C1B] text-[#F5F2EB] border border-white/5 p-8 md:p-12 rounded-3xl shadow-xl">
              <p className="text-[#DCAE9F]/90 text-base md:text-lg leading-relaxed font-light">
                {content.aboutSection.body}
              </p>
              
              <blockquote className="border-l-2 border-[#E2D4B7] pl-6 py-1 italic text-[#F5F2EB] text-base font-serif">
                "{content.aboutSection.quote}"
              </blockquote>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-mono text-xs uppercase tracking-widest text-[#E2D4B7] hover:text-[#EFE6D4] transition-colors flex items-center gap-2 group"
                >
                  <span>{content.aboutSection.buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </section>

          {/* 5. WHAT WE DO (SCROLL-PINNED LAYOUT) */}
          <section id="what-we-do" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#030C1B]/10">
            <InteractiveChecklist 
              tag={content.whatWeDo.tag} 
              title={content.whatWeDo.title}
              description1={content.whatWeDo.description1}
              description2={content.whatWeDo.description2}
              items={content.whatWeDo.items}
            />
          </section>

          {/* 6. VISION & MISSION (CENTERED DRAWING GRAPHICS) */}
          <section id="vision" className="py-24 md:py-32 border-y border-[#030C1B]/10 px-6 relative">
            <div className="absolute inset-0 bg-radial-gradient from-[#E2D4B7]/[0.01] to-transparent pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              {/* Monogram drawing element */}
              <div className="w-16 h-16 mx-auto flex items-center justify-center relative mb-4">
                <svg className="absolute inset-0 w-full h-full text-[#030C1B]/20" viewBox="0 0 100 100">
                  {/* Drawing abstract North Star */}
                  <motion.path
                    d="M 50 10 L 50 90 M 10 50 L 90 50 M 25 25 L 75 75 M 25 75 L 75 25"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  />
                  <circle cx="50" cy="50" r="4" fill="#030C1B" className="animate-pulse" />
                </svg>
              </div>

              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 font-semibold">{content.visionSection.tag}</span>
                <h2 className="font-serif text-3xl md:text-5xl text-[#030C1B] leading-tight font-light italic">
                  "{content.visionSection.quote}"
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left pt-8 border-t border-[#030C1B]/10">
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/80 font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#030C1B]" /> {content.visionSection.visionTitle}
                  </h3>
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed font-light">
                    {content.visionSection.visionBody}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/80 font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#030C1B]" /> {content.visionSection.missionTitle}
                  </h3>
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed font-light">
                    {content.visionSection.missionBody}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. WHY CFO'S DESK (3D TILT PILLARS & FOUNDER SPOTLIGHT) */}
          <section id="why-us" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 font-semibold">{content.whySection.tag}</span>
              <h2 className="font-serif text-4xl md:text-6xl text-[#030C1B] font-light">{content.whySection.title}</h2>
              <p className="text-slate-600 text-sm md:text-base font-light">
                {content.whySection.description}
              </p>
            </div>

            {/* 3 Pillars in 3D-Tilt Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <TiltCard key={pillar.id} className="bg-[#030C1B] text-[#F5F2EB] border border-white/5 p-8 md:p-10 flex flex-col justify-between hover:border-[#E2D4B7]/30 transition-all duration-300 min-h-[320px] shadow-lg">
                  <div className="space-y-6">
                    {/* Index count */}
                    <div className="font-mono text-xs text-[#E2D4B7] font-bold">
                      [0{pillar.id}]
                    </div>
                    
                    <h3 className="font-serif text-2xl text-[#F5F2EB] font-light">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-[#DCAE9F] text-sm leading-relaxed pt-8 border-t border-white/5 mt-4">
                    {pillar.description}
                  </p>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* 8. CONTACT SECTION (GLASSMORPHIC FORM & DETAILS) */}
          <section id="contact" className="py-24 md:py-32 border-t border-[#030C1B]/10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Column: Direct info detail details */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#030C1B]/70 font-semibold">{content.contactSection.tag}</span>
                  <h2 className="font-serif text-4xl md:text-6xl text-[#030C1B] leading-tight font-light">
                    {content.contactSection.title}
                  </h2>
                </div>

                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-light">
                  {content.contactSection.description}
                </p>

                {/* Direct info coordinates */}
                <div className="space-y-6 pt-6 border-t border-[#030C1B]/10">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-[#030C1B]/5 border border-[#030C1B]/10 rounded-xl text-[#030C1B]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#030C1B]/80 font-semibold mb-1">{content.contactSection.addressTitle}</h4>
                      <p className="text-slate-700 text-sm leading-relaxed font-light">
                        {content.contactSection.addressValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-[#030C1B]/5 border border-[#030C1B]/10 rounded-xl text-[#030C1B]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#030C1B]/80 font-semibold mb-1">{content.contactSection.phoneTitle}</h4>
                      <a href={`tel:${content.contactSection.phoneValue.replace(/\s+/g, '')}`} className="text-slate-700 text-sm hover:text-[#030C1B] transition-colors font-light font-medium">
                        {content.contactSection.phoneValue}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-[#030C1B]/5 border border-[#030C1B]/10 rounded-xl text-[#030C1B]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#030C1B]/80 font-semibold mb-1">{content.contactSection.emailTitle}</h4>
                      <a href={`mailto:${content.contactSection.emailValue}`} className="text-slate-700 text-sm hover:text-[#030C1B] transition-colors font-light font-medium">
                        {content.contactSection.emailValue}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Mock representation styling */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#030C1B] text-[#F5F2EB] shadow-lg flex flex-col justify-between h-44 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 opacity-10 font-serif text-8xl font-bold select-none text-[#E2D4B7]">KHI</div>
                  <div className="z-10">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#E2D4B7] font-semibold">{content.contactSection.coordinatesTitle}</span>
                    <h4 className="font-serif text-lg text-[#F5F2EB] mt-1">{content.contactSection.coordinatesCity}</h4>
                    <p className="text-[#DCAE9F] text-xs mt-1 font-mono">{content.contactSection.coordinatesValue}</p>
                  </div>
                  
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(content.contactSection.addressValue)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="z-10 text-xs font-mono text-[#DCAE9F] hover:text-[#E2D4B7] flex items-center gap-1 mt-4 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    <span>{content.contactSection.coordinatesBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Glassmorphic Contact Form */}
              <div className="lg:col-span-7">
                <div className="p-8 md:p-10 rounded-3xl bg-[#030C1B] text-[#F5F2EB] border border-[#E2D4B7]/20 relative overflow-hidden shadow-2xl">
                  <AnimatePresence mode="wait">
                    {formStatus === "submitted" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-12 space-y-6"
                      >
                        <div className="w-16 h-16 bg-[#E2D4B7]/10 text-[#E2D4B7] rounded-full flex items-center justify-center mx-auto border border-[#E2D4B7]/20 shadow-[0_0_25px_rgba(226,212,183,0.15)]">
                          <Check className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-serif text-3xl text-[#F5F2EB] font-light">Transmission Received</h3>
                          <p className="text-[#DCAE9F] text-sm max-w-md mx-auto leading-relaxed">
                            Thank you for initiating communication. Your request has been securely logged. Our principal consultant, <strong>Mr. Abdul Wahab Essani</strong>, will connect with you within 4 hours.
                          </p>
                        </div>
                        <button
                          onClick={resetForm}
                          className="font-mono text-xs uppercase tracking-widest text-[#DCAE9F] hover:text-[#E2D4B7] transition-colors py-2 px-6 border border-[#E2D4B7]/15 rounded-full cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        onSubmit={handleFormSubmit}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block font-semibold">Your Name</label>
                            <input
                              type="text"
                              id="name"
                              required
                              value={formInput.name}
                              onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                              placeholder="e.g. Sterling Hunt"
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#E2D4B7]/50 focus:outline-none focus:ring-1 focus:ring-[#E2D4B7]/50 rounded-xl text-sm transition-all duration-300 text-[#F5F2EB] placeholder-[#DCAE9F]/40 font-light"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block font-semibold">Your Email</label>
                            <input
                              type="email"
                              id="email"
                              required
                              value={formInput.email}
                              onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                              placeholder="e.g. sterling@capital.com"
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#E2D4B7]/50 focus:outline-none focus:ring-1 focus:ring-[#E2D4B7]/50 rounded-xl text-sm transition-all duration-300 text-[#F5F2EB] placeholder-[#DCAE9F]/40 font-light"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="subject" className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block font-semibold">Strategic Topic</label>
                          <input
                            type="text"
                            id="subject"
                            required
                            value={formInput.subject}
                            onChange={(e) => setFormInput({ ...formInput, subject: e.target.value })}
                            placeholder="e.g. Fractional CFO Strategy Proposal"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#E2D4B7]/50 focus:outline-none focus:ring-1 focus:ring-[#E2D4B7]/50 rounded-xl text-sm transition-all duration-300 text-[#F5F2EB] placeholder-[#DCAE9F]/40 font-light"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block font-semibold">Message Details</label>
                          <textarea
                            id="message"
                            required
                            rows={5}
                            value={formInput.message}
                            onChange={(e) => setFormInput({ ...formInput, message: e.target.value })}
                            placeholder="Detail your enterprise requirements or operational timeline..."
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#E2D4B7]/50 focus:outline-none focus:ring-1 focus:ring-[#E2D4B7]/50 rounded-xl text-sm transition-all duration-300 text-[#F5F2EB] placeholder-[#DCAE9F]/40 resize-none font-light"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <Magnetic>
                            <button
                              type="submit"
                              disabled={formStatus === "submitting"}
                              className="w-full px-8 py-4 bg-[#E2D4B7] hover:bg-[#EFE6D4] text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(226,212,183,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              data-cursor-text="Send"
                            >
                              <span>{formStatus === "submitting" ? "Securing Transmission..." : "Deliver Confidential Request"}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </Magnetic>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </section>

          {/* 9. FOOTER SECTION */}
          <footer className="bg-[#F5F2EB] border-t border-[#030C1B]/10 py-16 px-6 relative text-[#030C1B]">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start pb-12 border-b border-[#030C1B]/10">
                {/* Brand Logo column */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-4">
                    {content.logo?.type === "image" && content.logo?.imageUrl ? (
                      <img
                        src={content.logo.imageUrl}
                        alt={content.logo.text || "CFO'S DESK"}
                        className="w-16 h-16 md:w-28 md:h-28 rounded-2xl object-contain border border-[#030C1B]/10 bg-[#030C1B] p-1.5 shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-28 md:h-28 rounded-2xl border border-white/5 flex items-center justify-center bg-[#030C1B] text-[#F5F2EB] font-serif font-semibold text-xl md:text-3xl shadow-xl">
                        {content.logo?.initials || "CD"}
                      </div>
                    )}
                    <span className="font-serif text-lg md:text-2xl tracking-widest text-[#030C1B] uppercase font-semibold">
                      {content.logo?.text || content.footer.title}
                    </span>
                  </div>
                  <p className="text-[#030C1B]/70 text-xs md:text-sm max-w-sm leading-relaxed font-light">
                    {content.footer.description}
                  </p>
                </div>

                {/* Secure Contact column */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#030C1B]/60 font-semibold">{content.footer.contactTitle}</h4>
                  <p className="text-[#030C1B]/80 text-xs leading-relaxed flex items-center gap-2 font-light">
                    <Mail className="w-3.5 h-3.5 text-[#030C1B]" /> {content.contactSection.emailValue}
                  </p>
                  <p className="text-[#030C1B]/80 text-xs leading-relaxed flex items-center gap-2 font-light">
                    <Phone className="w-3.5 h-3.5 text-[#030C1B]" /> {content.contactSection.phoneValue}
                  </p>
                </div>

                {/* Headquarters column */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#030C1B]/60 font-semibold">{content.footer.addressTitle}</h4>
                  <p className="text-[#030C1B]/80 text-xs leading-relaxed font-light">
                    {content.contactSection.addressValue}
                  </p>
                </div>
              </div>

              {/* Bottom copy row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[#030C1B]/50 font-mono text-[10px] uppercase tracking-widest">
                <div>
                  © {new Date().getFullYear()} {content.footer.copyright}
                </div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-[#030C1B] transition-colors font-medium">{content.footer.link1}</a>
                  <a href="#" className="hover:text-[#030C1B] transition-colors font-medium">{content.footer.link2}</a>
                </div>
              </div>
            </div>
          </footer>
        </div> {/* End Beige Section Wrapper */}

        {/* Admin drawer wrapper */}
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          currentContent={content}
          onSave={handleSaveContent}
        />
      </>
    )}
  </div>
  );
}
