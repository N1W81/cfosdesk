import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Save, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Sparkles, 
  ChevronRight, 
  Layout, 
  Briefcase, 
  Eye, 
  ShieldAlert, 
  Sliders, 
  FileText,
  MapPin,
  CheckCircle2,
  Image,
  UploadCloud,
  Download,
  Upload
} from "lucide-react";
import { WebsiteContent, Service, Differentiator, ChecklistItem } from "../types";
import { defaultContent } from "../defaultContent";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: WebsiteContent;
  onSave: (newContent: WebsiteContent) => void;
}

type TabType = "logo" | "hero" | "services" | "about_vision" | "what_we_do" | "pillars_founder" | "contact_footer";

export default function AdminPanel({ isOpen, onClose, currentContent, onSave }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  // Local state copy of the website content
  const [editedContent, setEditedContent] = useState<WebsiteContent>({ ...currentContent });
  const [activeTab, setActiveTab] = useState<TabType>("logo");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sync state with currentContent when panel is opened
  React.useEffect(() => {
    if (isOpen) {
      setEditedContent({ ...currentContent });
    }
  }, [isOpen, currentContent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1986") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      // shake effect simulation
      setTimeout(() => setLoginError(false), 1000);
    }
  };

  const handleSave = () => {
    onSave(editedContent);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all copy back to the original default? This will overwrite your custom changes.")) {
      setEditedContent({ ...defaultContent });
    }
  };

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditedContent(prev => ({
          ...prev,
          logo: {
            ...prev.logo,
            type: "image",
            imageUrl: event.target!.result as string
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editedContent, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "cfosdesk_content.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && 'logo' in parsed) {
          setEditedContent(parsed);
          alert("Configuration loaded successfully! Click 'Save & Apply Changes' at the bottom to publish it globally.");
        } else {
          alert("Invalid website configuration file structure.");
        }
      } catch (e) {
        alert("Failed to parse configuration file. Make sure it's valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Helper to update deeply nested strings in state
  const updateField = (section: keyof WebsiteContent, field: string, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateSubField = (parent: keyof WebsiteContent, subkey: string, field: string, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [subkey]: {
          ...(prev[parent] as any)[subkey],
          [field]: value
        }
      }
    }));
  };

  // Helper for services array updates
  const updateService = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...editedContent.servicesSection.items];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setEditedContent(prev => ({
      ...prev,
      servicesSection: {
        ...prev.servicesSection,
        items: updatedServices
      }
    }));
  };

  // Helper for pillars array updates
  const updatePillar = (index: number, field: keyof Differentiator, value: string) => {
    const updatedPillars = [...editedContent.whySection.items];
    updatedPillars[index] = { ...updatedPillars[index], [field]: value };
    setEditedContent(prev => ({
      ...prev,
      whySection: {
        ...prev.whySection,
        items: updatedPillars
      }
    }));
  };

  // Helper for checklist items updates
  const updateChecklistItem = (index: number, field: keyof ChecklistItem, value: string) => {
    const updatedItems = [...editedContent.whatWeDo.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditedContent(prev => ({
      ...prev,
      whatWeDo: {
        ...prev.whatWeDo,
        items: updatedItems
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Access Gate (Not logged in) */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-3xl bg-[#030C1B] border border-[#E2D4B7]/20 shadow-2xl text-[#F5F2EB] z-50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-6 pt-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E2D4B7]/10 flex items-center justify-center mx-auto border border-[#E2D4B7]/30">
                <Lock className="w-6 h-6 text-[#E2D4B7]" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-light">CFO's Desk Gatekeeper</h2>
                <p className="text-[#DCAE9F]/70 text-xs font-mono tracking-wide">CONFIDENTIAL ADMINISTRATION ACCESS REQUIRED</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F] block text-left">System Passcode</label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter administration passcode"
                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-sm transition-all duration-300 text-center ${
                      loginError ? "border-red-500 ring-2 ring-red-500/20" : "border-white/10 focus:border-[#E2D4B7]/50"
                    }`}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E2D4B7] hover:bg-[#EFE6D4] text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(226,212,183,0.15)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate Access</span>
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* Main Admin Panel Dashboard Drawer */
          <motion.div 
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl h-full bg-[#030C1B] border-l border-[#E2D4B7]/20 shadow-2xl flex flex-col z-50 text-[#F5F2EB]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E2D4B7]/10 flex justify-between items-center bg-[#071329]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E2D4B7]/10 rounded-lg border border-[#E2D4B7]/20 text-[#E2D4B7]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-light flex items-center gap-2">
                    System Administration Panel <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#E2D4B7]/10 text-[#E2D4B7]">LIVE EDIT</span>
                  </h2>
                  <p className="text-[#DCAE9F]/60 text-[10px] font-mono tracking-widest">MODIFY OR TRANSLATE ANY TEXT ON THE WEBSITE</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2.5 rounded-xl border border-white/10 text-[#DCAE9F] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Reset to Original Content"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClose} 
                  className="p-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Layout Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Vertical Sidebar Tabs */}
              <div className="w-64 border-r border-[#E2D4B7]/10 bg-[#071329]/50 flex flex-col justify-between p-4 space-y-2 overflow-y-auto">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/50 px-2 mb-3">WEBSITE SECTIONS</p>
                  
                  <button
                    onClick={() => setActiveTab("logo")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "logo" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span>Logo & Branding</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("hero")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "hero" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <Layout className="w-4 h-4" />
                    <span>Hero Section</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("services")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "services" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>8 Services Suite</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("about_vision")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "about_vision" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>About & Vision</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("what_we_do")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "what_we_do" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>What We Do</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("pillars_founder")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "pillars_founder" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Pillars & Founder</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("contact_footer")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all ${
                      activeTab === "contact_footer" ? "bg-[#E2D4B7] text-black font-semibold" : "text-zinc-400 hover:text-[#F5F2EB] hover:bg-white/5"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Contact & Footer</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
                  <div className="flex gap-1.5 items-center font-mono text-[9px] uppercase tracking-wider text-[#E2D4B7]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Global Sync Status</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-relaxed font-light">
                    Your changes sync globally for everyone via <span className="text-[#E2D4B7] font-medium">Firebase Firestore</span>.
                  </p>
                  <p className="text-zinc-500 text-[9px] leading-relaxed font-mono">
                    Firebase Spark is <span className="text-emerald-400 font-semibold">100% Free</span> (50k reads & 20k writes/day free limit). You will never be billed.
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#DCAE9F]/70">Local Backup Utilities</p>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.03] hover:bg-[#E2D4B7]/10 border border-white/10 hover:border-[#E2D4B7]/40 rounded-xl text-[10px] font-mono uppercase tracking-wider text-[#F5F2EB] transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#E2D4B7]" />
                      <span>Export config.json</span>
                    </button>

                    <div className="relative">
                      <input
                        id="config-file-import"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImportJSON(e.target.files[0]);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const fileInput = document.getElementById("config-file-import");
                          if (fileInput) fileInput.click();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.03] hover:bg-[#E2D4B7]/10 border border-white/10 hover:border-[#E2D4B7]/40 rounded-xl text-[10px] font-mono uppercase tracking-wider text-[#F5F2EB] transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#E2D4B7]" />
                        <span>Import config.json</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-[#030C1B]">
                
                {/* LOGO & BRANDING TAB */}
                {activeTab === "logo" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Configure Logo & Branding Settings</h3>
                        <p className="text-zinc-400 text-xs mt-1">Control how your brand identity renders at the top and bottom of the website.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Logo Type Selector */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Logo Type</label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditedContent(prev => ({
                                ...prev,
                                logo: { ...prev.logo, type: "image" }
                              }));
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                              editedContent.logo?.type === "image"
                                ? "bg-[#E2D4B7] text-black border-[#E2D4B7] font-semibold"
                                : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-[#F5F2EB] hover:bg-white/5"
                            }`}
                          >
                            Premium Image Emblem
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditedContent(prev => ({
                                ...prev,
                                logo: { ...prev.logo, type: "text" }
                              }));
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                              editedContent.logo?.type === "text"
                                ? "bg-[#E2D4B7] text-black border-[#E2D4B7] font-semibold"
                                : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-[#F5F2EB] hover:bg-white/5"
                            }`}
                          >
                            Initials & Typography Text
                          </button>
                        </div>
                      </div>

                      {/* Brand Name Text & Subtext */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Brand Name Text</label>
                          <input
                            type="text"
                            value={editedContent.logo?.text || ""}
                            onChange={(e) => {
                              setEditedContent(prev => ({
                                ...prev,
                                logo: { ...prev.logo, text: e.target.value }
                              }));
                            }}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            placeholder="CFO'S DESK"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Subtext / Tagline</label>
                          <input
                            type="text"
                            value={editedContent.logo?.subtext || ""}
                            onChange={(e) => {
                              setEditedContent(prev => ({
                                ...prev,
                                logo: { ...prev.logo, subtext: e.target.value }
                              }));
                            }}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            placeholder="Fractional CFO"
                          />
                        </div>
                      </div>

                      {/* Type-Specific Fields */}
                      {editedContent.logo?.type === "image" ? (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Upload Custom Logo Image</label>
                            
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleLogoUpload(e.dataTransfer.files[0]);
                                }
                              }}
                              onClick={() => {
                                const fileInput = document.getElementById("logo-file-picker");
                                if (fileInput) fileInput.click();
                              }}
                              className={`group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white/[0.01] ${
                                isDragging
                                  ? "border-[#E2D4B7] bg-[#E2D4B7]/5 shadow-[0_0_20px_rgba(226,212,183,0.1)]"
                                  : "border-white/10 hover:border-[#E2D4B7]/50 hover:bg-white/[0.02]"
                              }`}
                            >
                              <input
                                id="logo-file-picker"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleLogoUpload(e.target.files[0]);
                                  }
                                }}
                              />
                              <UploadCloud className="w-10 h-10 text-[#E2D4B7]/60 group-hover:text-[#E2D4B7] transition-all duration-300 mb-3" />
                              <p className="text-sm text-[#F5F2EB] font-light">
                                Drag & Drop your logo image here, or <span className="text-[#E2D4B7] font-semibold underline decoration-dotted decoration-1">click to browse</span>
                              </p>
                              <p className="text-[10px] font-mono text-zinc-500 mt-1.5">
                                Supports PNG, JPG, JPEG, WEBP or SVG format
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Image URL / Local File Path</label>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditedContent(prev => ({
                                    ...prev,
                                    logo: {
                                      ...prev.logo,
                                      imageUrl: "/cfosdesk_logo.jpg"
                                    }
                                  }));
                                }}
                                className="flex items-center gap-1.5 text-[10px] font-mono text-[#E2D4B7]/70 hover:text-[#E2D4B7] transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Reset to Default Logo
                              </button>
                            </div>
                            <input
                              type="text"
                              value={editedContent.logo?.imageUrl || ""}
                              onChange={(e) => {
                                setEditedContent(prev => ({
                                  ...prev,
                                  logo: { ...prev.logo, imageUrl: e.target.value }
                                }));
                              }}
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none font-mono"
                              placeholder="/cfosdesk_logo.jpg"
                            />
                            <p className="text-zinc-500 text-[10px] font-mono leading-relaxed mt-1">
                              Note: When you upload a custom file, its data is automatically embedded securely as a base64 string.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Brand Initials Box Text (Max 3 chars)</label>
                          <input
                            type="text"
                            maxLength={3}
                            value={editedContent.logo?.initials || ""}
                            onChange={(e) => {
                              setEditedContent(prev => ({
                                ...prev,
                                logo: { ...prev.logo, initials: e.target.value }
                              }));
                            }}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            placeholder="CD"
                          />
                        </div>
                      )}

                      {/* Live Visual Preview Card */}
                      <div className="p-6 rounded-2xl border border-[#E2D4B7]/10 bg-white/[0.01] backdrop-blur-md space-y-4">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#E2D4B7] block font-semibold">Live Brand Preview (Header Simulation)</span>
                        <div className="p-6 rounded-xl border border-white/5 bg-[#030C1B] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {editedContent.logo?.type === "image" && editedContent.logo?.imageUrl ? (
                              <img
                                src={editedContent.logo.imageUrl}
                                alt="Emblem Preview"
                                className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-contain border border-[#E2D4B7]/30 bg-white/5 p-1.5 shadow-lg"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl border border-[#E2D4B7]/30 flex items-center justify-center bg-white/5 text-[#E2D4B7] font-serif font-semibold tracking-wider text-xl md:text-3xl">
                                {editedContent.logo?.initials || "CD"}
                              </div>
                            )}
                            <div className="flex flex-col justify-center">
                              <span className="font-serif text-lg md:text-2xl font-semibold tracking-widest text-[#F5F2EB]">
                                {editedContent.logo?.text || "CFO'S DESK"}
                              </span>
                              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-zinc-400">
                                {editedContent.logo?.subtext || "Fractional CFO"}
                              </span>
                            </div>
                          </div>
                          
                          <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-[#E2D4B7]/10 text-[#E2D4B7]">Header Nav Sim</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HERO TAB */}
                {activeTab === "hero" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Configure Hero Section Content</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Top Badge Label</label>
                        <input
                          type="text"
                          value={editedContent.hero.badge}
                          onChange={(e) => updateField("hero", "badge", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Main Title (Plain Pt 1)</label>
                          <input
                            type="text"
                            value={editedContent.hero.headlinePart1}
                            onChange={(e) => updateField("hero", "headlinePart1", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Main Title (Italic Gold Pt 2)</label>
                          <input
                            type="text"
                            value={editedContent.hero.headlineItalic}
                            onChange={(e) => updateField("hero", "headlineItalic", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none italic font-serif"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Main Title (Plain Pt 3)</label>
                          <input
                            type="text"
                            value={editedContent.hero.headlinePart3}
                            onChange={(e) => updateField("hero", "headlinePart3", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Subtitle Paragraph</label>
                        <textarea
                          rows={3}
                          value={editedContent.hero.subtitle}
                          onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">WhatsApp Action Button Label</label>
                          <input
                            type="text"
                            value={editedContent.hero.whatsappBtn}
                            onChange={(e) => updateField("hero", "whatsappBtn", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Email Action Button Label</label>
                          <input
                            type="text"
                            value={editedContent.hero.emailBtn}
                            onChange={(e) => updateField("hero", "emailBtn", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Marquee Customizer */}
                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Horizontal Marquee Ribbons (Comma-separated)</label>
                        <input
                          type="text"
                          value={editedContent.marquee.join(", ")}
                          onChange={(e) => updateField("marquee", "", e.target.value.split(",").map(s => s.trim()))}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === "services" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Customize Services & Bento Grid</h3>
                    
                    <div className="space-y-4 border-b border-white/5 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Tagline</label>
                          <input
                            type="text"
                            value={editedContent.servicesSection.tag}
                            onChange={(e) => updateSubField("servicesSection", "tag", "", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Main Title</label>
                          <input
                            type="text"
                            value={editedContent.servicesSection.title}
                            onChange={(e) => updateSubField("servicesSection", "title", "", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Description Text</label>
                        <textarea
                          rows={2}
                          value={editedContent.servicesSection.description}
                          onChange={(e) => updateSubField("servicesSection", "description", "", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70">Individual Service Cards (8 Items)</p>
                      
                      {editedContent.servicesSection.items.map((service, idx) => (
                        <div key={service.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 relative">
                          <div className="absolute top-4 right-4 font-mono text-[10px] text-[#E2D4B7]/40 bg-[#E2D4B7]/5 px-2.5 py-0.5 rounded-full border border-[#E2D4B7]/10">
                            Service ID: {service.id}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Tag / Label</label>
                              <input
                                type="text"
                                value={service.tag}
                                onChange={(e) => updateService(idx, "tag", e.target.value)}
                                className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Service Name</label>
                              <input
                                type="text"
                                value={service.title}
                                onChange={(e) => updateService(idx, "title", e.target.value)}
                                className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Highlight Subtitle</label>
                            <input
                              type="text"
                              value={service.subtitle}
                              onChange={(e) => updateService(idx, "subtitle", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Description Details</label>
                            <textarea
                              rows={2}
                              value={service.description}
                              onChange={(e) => updateService(idx, "description", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ABOUT & VISION */}
                {activeTab === "about_vision" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Configure About Us, Metrics & Vision</h3>
                    
                    <div className="space-y-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70 border-b border-white/5 pb-2">About Section</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Tagline</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.tag}
                            onChange={(e) => updateField("aboutSection", "tag", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Main Title</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.title}
                            onChange={(e) => updateField("aboutSection", "title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Metric 1 Val</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.metric1Val}
                            onChange={(e) => updateField("aboutSection", "metric1Val", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Metric 1 Label</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.metric1Label}
                            onChange={(e) => updateField("aboutSection", "metric1Label", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Metric 2 Val</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.metric2Val}
                            onChange={(e) => updateField("aboutSection", "metric2Val", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Metric 2 Label</label>
                          <input
                            type="text"
                            value={editedContent.aboutSection.metric2Label}
                            onChange={(e) => updateField("aboutSection", "metric2Label", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">About Body Text</label>
                        <textarea
                          rows={4}
                          value={editedContent.aboutSection.body}
                          onChange={(e) => updateField("aboutSection", "body", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Editorial Quote</label>
                        <textarea
                          rows={2}
                          value={editedContent.aboutSection.quote}
                          onChange={(e) => updateField("aboutSection", "quote", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none italic"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Button Text</label>
                        <input
                          type="text"
                          value={editedContent.aboutSection.buttonText}
                          onChange={(e) => updateField("aboutSection", "buttonText", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70 border-b border-white/5 pb-2">Vision & Mission Section</p>
                      
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Our North Star Quote</label>
                        <input
                          type="text"
                          value={editedContent.visionSection.quote}
                          onChange={(e) => updateField("visionSection", "quote", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none italic"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Vision Block Title</label>
                            <input
                              type="text"
                              value={editedContent.visionSection.visionTitle}
                              onChange={(e) => updateField("visionSection", "visionTitle", e.target.value)}
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Vision Block Body</label>
                            <textarea
                              rows={3}
                              value={editedContent.visionSection.visionBody}
                              onChange={(e) => updateField("visionSection", "visionBody", e.target.value)}
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Mission Block Title</label>
                            <input
                              type="text"
                              value={editedContent.visionSection.missionTitle}
                              onChange={(e) => updateField("visionSection", "missionTitle", e.target.value)}
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Mission Block Body</label>
                            <textarea
                              rows={3}
                              value={editedContent.visionSection.missionBody}
                              onChange={(e) => updateField("visionSection", "missionBody", e.target.value)}
                              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WHAT WE DO */}
                {activeTab === "what_we_do" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Customize What We Do (Interactive Checklist)</h3>
                    
                    <div className="space-y-4 border-b border-white/5 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Tagline</label>
                          <input
                            type="text"
                            value={editedContent.whatWeDo.tag}
                            onChange={(e) => updateField("whatWeDo", "tag", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Headline</label>
                          <input
                            type="text"
                            value={editedContent.whatWeDo.title}
                            onChange={(e) => updateField("whatWeDo", "title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Primary Description Paragraph</label>
                          <textarea
                            rows={3}
                            value={editedContent.whatWeDo.description1}
                            onChange={(e) => updateField("whatWeDo", "description1", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Secondary Description Italicized</label>
                          <textarea
                            rows={3}
                            value={editedContent.whatWeDo.description2}
                            onChange={(e) => updateField("whatWeDo", "description2", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none italic"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70">Interactive Checklist Items (5 items)</p>
                      
                      {editedContent.whatWeDo.items.map((item, idx) => (
                        <div key={item.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3 relative">
                          <div className="absolute top-4 right-4 font-mono text-[10px] text-[#E2D4B7]/40 bg-[#E2D4B7]/5 px-2 py-0.5 rounded-full">
                            Checklist Item {item.id}
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Item Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateChecklistItem(idx, "title", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Detailed description on Hover</label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => updateChecklistItem(idx, "description", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PILLARS & FOUNDER */}
                {activeTab === "pillars_founder" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Configure Pillars & Founder Spotlight</h3>
                    
                    <div className="space-y-4 border-b border-white/5 pb-6">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70">Pillars Heading Section</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Tagline</label>
                          <input
                            type="text"
                            value={editedContent.whySection.tag}
                            onChange={(e) => updateField("whySection", "tag", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Title</label>
                          <input
                            type="text"
                            value={editedContent.whySection.title}
                            onChange={(e) => updateField("whySection", "title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Description</label>
                        <textarea
                          rows={2}
                          value={editedContent.whySection.description}
                          onChange={(e) => updateField("whySection", "description", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70">Pillars (3 Items)</p>
                      
                      {editedContent.whySection.items.map((pillar, idx) => (
                        <div key={pillar.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3 relative">
                          <div className="absolute top-4 right-4 font-mono text-[10px] text-[#E2D4B7]/40">Pillar 0{pillar.id}</div>
                          
                          <div className="space-y-1.5 pt-2">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Pillar Title</label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => updatePillar(idx, "title", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-widest text-[#DCAE9F]/80 block">Pillar Body Copy</label>
                            <textarea
                              rows={3}
                              value={pillar.description}
                              onChange={(e) => updatePillar(idx, "description", e.target.value)}
                              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-xs text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70">Founder & Principal Spotlight</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Founder Spotlight Tag</label>
                          <input
                            type="text"
                            value={editedContent.founderSpotlight.tag}
                            onChange={(e) => updateField("founderSpotlight", "tag", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Founder Name</label>
                          <input
                            type="text"
                            value={editedContent.founderSpotlight.name}
                            onChange={(e) => updateField("founderSpotlight", "name", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Founder Corporate Role Title</label>
                        <input
                          type="text"
                          value={editedContent.founderSpotlight.title}
                          onChange={(e) => updateField("founderSpotlight", "title", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Founder Narrative Quote</label>
                        <textarea
                          rows={4}
                          value={editedContent.founderSpotlight.quote}
                          onChange={(e) => updateField("founderSpotlight", "quote", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none leading-relaxed italic"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Schedule Button Text</label>
                        <input
                          type="text"
                          value={editedContent.founderSpotlight.buttonText}
                          onChange={(e) => updateField("founderSpotlight", "buttonText", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTACT & FOOTER */}
                {activeTab === "contact_footer" && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-xl font-light text-[#E2D4B7]">Configure Contact Form & Site Footer</h3>
                    
                    <div className="space-y-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70 border-b border-white/5 pb-2">Contact Left Column Details</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Tagline</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.tag}
                            onChange={(e) => updateField("contactSection", "tag", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Section Title</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.title}
                            onChange={(e) => updateField("contactSection", "title", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Support Narrative</label>
                        <textarea
                          rows={2}
                          value={editedContent.contactSection.description}
                          onChange={(e) => updateField("contactSection", "description", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Phone Box Title</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.phoneTitle}
                            onChange={(e) => updateField("contactSection", "phoneTitle", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Phone Box Number</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.phoneValue}
                            onChange={(e) => updateField("contactSection", "phoneValue", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Email Box Address</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.emailValue}
                            onChange={(e) => updateField("contactSection", "emailValue", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">HQ Office Address</label>
                        <input
                          type="text"
                          value={editedContent.contactSection.addressValue}
                          onChange={(e) => updateField("contactSection", "addressValue", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>

                      {/* Map coordinates details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Map City Name</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.coordinatesCity}
                            onChange={(e) => updateField("contactSection", "coordinatesCity", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Map Coordinates text</label>
                          <input
                            type="text"
                            value={editedContent.contactSection.coordinatesValue}
                            onChange={(e) => updateField("contactSection", "coordinatesValue", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#E2D4B7]/70 border-b border-white/5 pb-2">Footer & Copyright Details</p>
                      
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Brand/Company Description</label>
                        <textarea
                          rows={3}
                          value={editedContent.footer.description}
                          onChange={(e) => updateField("footer", "description", e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Copyright Notice</label>
                          <input
                            type="text"
                            value={editedContent.footer.copyright}
                            onChange={(e) => updateField("footer", "copyright", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Footer Link 1</label>
                          <input
                            type="text"
                            value={editedContent.footer.link1}
                            onChange={(e) => updateField("footer", "link1", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-[#DCAE9F] block">Footer Link 2</label>
                          <input
                            type="text"
                            value={editedContent.footer.link2}
                            onChange={(e) => updateField("footer", "link2", e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-[#F5F2EB] focus:border-[#E2D4B7]/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Footer buttons row */}
            <div className="p-6 border-t border-[#E2D4B7]/10 flex justify-between items-center bg-[#071329]">
              <span className="font-mono text-[9px] text-[#DCAE9F]/60 uppercase tracking-widest hidden sm:inline">Authenticated Session</span>
              
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-[#F5F2EB] hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#E2D4B7] hover:bg-[#EFE6D4] text-black font-semibold text-xs font-mono uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(226,212,183,0.1)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Apply Changes</span>
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            <AnimatePresence>
              {showSaveToast && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  className="absolute bottom-24 right-6 bg-[#030C1B] border border-emerald-500/30 text-emerald-400 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 font-mono text-xs max-w-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-emerald-200">Changes Implemented!</strong>
                    <span>Your edits have been successfully compiled and saved to local storage.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
