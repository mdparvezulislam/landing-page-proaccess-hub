"use client";

import React, { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/useCMS";
import {
  Monitor,
  Wallet,
  Globe,
  Layout,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Headset,
  AlertTriangle,
  Image as ImageIcon,
  Zap,
  Clock,
  Hash,
  List,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SortableList } from "../components/SortableList";

export default function SettingsTab() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (settings) setLocalSettings(JSON.parse(JSON.stringify(settings)));
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const navItems = [
    { id: "hero", label: "Hero Section", icon: Monitor },
    { id: "site", label: "Site & Brand", icon: Globe },
    { id: "payments", label: "Payment Manager", icon: Wallet },
    { id: "navbar", label: "Navigation", icon: List },
    { id: "countdown", label: "Urgency Timer", icon: Clock },
    { id: "trust", label: "Trust Badges", icon: ShieldCheck },
    { id: "footer", label: "Footer & Links", icon: Layout },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">
            Global CMS
          </h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">
            Manage platform identity and sections
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <Save className="w-5 h-5" />
          Publish All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-3 space-y-4 sticky top-32">
          <div className="glass-card rounded-[32px] p-3 border-white/5 bg-white/[0.01]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-text-muted group-hover:text-primary"}`}
                    />
                    <span
                      className={`text-[10px] font-black uppercase tracking-[2px] ${isActive ? "text-white" : "text-text-muted group-hover:text-text-primary"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-white/5 group-hover:text-primary"}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 border-dashed">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[2px]">
                Admin Guard
              </span>
            </div>
            <p className="text-xs font-bold text-text-muted leading-relaxed">
              System updates are synchronized across all instances in real-time.
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="xl:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* HERO SECTION */}
              {activeSection === "hero" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                    <Monitor className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-black tracking-tighter uppercase">
                      Hero Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="admin-label">Badge Text (EN)</label>
                      <input
                        className="admin-input w-full"
                        value={localSettings.hero?.badgeEn}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            hero: {
                              ...localSettings.hero,
                              badgeEn: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="admin-label">Badge Text (BN)</label>
                      <input
                        className="admin-input w-full"
                        value={localSettings.hero?.badgeBn}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            hero: {
                              ...localSettings.hero,
                              badgeBn: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <label className="admin-label">Title (EN)</label>
                    <input
                      className="admin-input w-full text-xl"
                      value={localSettings.hero?.titleEn}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          hero: {
                            ...localSettings.hero,
                            titleEn: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-8 mt-12">
                    <h4 className="text-[10px] font-black uppercase tracking-[3px] text-primary">
                      Hero Stats
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {localSettings.hero?.stats?.map(
                        (stat: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4"
                          >
                            <input
                              className="admin-input-sm w-full"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...localSettings.hero.stats];
                                newStats[idx].value = e.target.value;
                                setLocalSettings({
                                  ...localSettings,
                                  hero: {
                                    ...localSettings.hero,
                                    stats: newStats,
                                  },
                                });
                              }}
                            />
                            <input
                              className="admin-input-sm w-full opacity-60"
                              value={stat.labelEn}
                              onChange={(e) => {
                                const newStats = [...localSettings.hero.stats];
                                newStats[idx].labelEn = e.target.value;
                                setLocalSettings({
                                  ...localSettings,
                                  hero: {
                                    ...localSettings.hero,
                                    stats: newStats,
                                  },
                                });
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* SITE INFO */}
              {activeSection === "site" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                    <Globe className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-black tracking-tighter uppercase">
                      Brand & Identity
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="admin-label">Site Name (EN)</label>
                      <input
                        className="admin-input w-full"
                        value={localSettings.site?.siteNameEn}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            site: {
                              ...localSettings.site,
                              siteNameEn: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="admin-label">Telegram Link</label>
                      <input
                        className="admin-input w-full"
                        value={localSettings.site?.telegramLink}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            site: {
                              ...localSettings.site,
                              telegramLink: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* PAYMENT MANAGER */}
              {activeSection === "payments" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                      <Wallet className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-black tracking-tighter uppercase">
                        Payment Manager
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        const newMethod = {
                          name: "New Method",
                          number: "",
                          accountTypeEn: "Personal",
                          accountTypeBn: "পার্সোনাল",
                          enabled: true,
                          color: "#3b82f6",
                          order:
                            (localSettings.paymentSettings?.methods?.length ||
                              0) + 1,
                        };
                        setLocalSettings({
                          ...localSettings,
                          paymentSettings: {
                            ...localSettings.paymentSettings,
                            methods: [
                              ...(localSettings.paymentSettings.methods || []),
                              newMethod,
                            ],
                          },
                        });
                      }}
                      className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest"
                    >
                      Add Method
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="admin-label">
                          Instruction Title (EN)
                        </label>
                        <input
                          className="admin-input w-full"
                          value={
                            localSettings.paymentSettings?.instructionTitleEn
                          }
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              paymentSettings: {
                                ...localSettings.paymentSettings,
                                instructionTitleEn: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="admin-label">
                          Warning Message (EN)
                        </label>
                        <input
                          className="admin-input w-full border-red-500/20 bg-red-500/5"
                          value={localSettings.paymentSettings?.warningTextEn}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              paymentSettings: {
                                ...localSettings.paymentSettings,
                                warningTextEn: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[3px] text-secondary">
                        Active Methods
                      </h4>
                      <SortableList
                        items={(
                          localSettings.paymentSettings?.methods || []
                        ).map((m: any, i: number) => ({
                          ...m,
                          id: `method-${i}`,
                        }))}
                        idField="id"
                        onReorder={(newMethods) =>
                          setLocalSettings({
                            ...localSettings,
                            paymentSettings: {
                              ...localSettings.paymentSettings,
                              methods: newMethods,
                            },
                          })
                        }
                        renderItem={(method) => (
                          <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black uppercase text-[10px]"
                              style={{ backgroundColor: method.color }}
                            >
                              {method.name.charAt(0)}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input
                                className="admin-input-sm"
                                value={method.name}
                                placeholder="Method Name"
                                onChange={(e) => {
                                  const newMethods =
                                    localSettings.paymentSettings.methods.map(
                                      (m: any, idx: number) =>
                                        `method-${idx}` === method.id
                                          ? { ...m, name: e.target.value }
                                          : m,
                                    );
                                  setLocalSettings({
                                    ...localSettings,
                                    paymentSettings: {
                                      ...localSettings.paymentSettings,
                                      methods: newMethods,
                                    },
                                  });
                                }}
                              />
                              <input
                                className="admin-input-sm"
                                value={method.number}
                                placeholder="Number"
                                onChange={(e) => {
                                  const newMethods =
                                    localSettings.paymentSettings.methods.map(
                                      (m: any, idx: number) =>
                                        `method-${idx}` === method.id
                                          ? { ...m, number: e.target.value }
                                          : m,
                                    );
                                  setLocalSettings({
                                    ...localSettings,
                                    paymentSettings: {
                                      ...localSettings.paymentSettings,
                                      methods: newMethods,
                                    },
                                  });
                                }}
                              />
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    const newMethods =
                                      localSettings.paymentSettings.methods.map(
                                        (m: any, idx: number) =>
                                          `method-${idx}` === method.id
                                            ? { ...m, enabled: !m.enabled }
                                            : m,
                                      );
                                    setLocalSettings({
                                      ...localSettings,
                                      paymentSettings: {
                                        ...localSettings.paymentSettings,
                                        methods: newMethods,
                                      },
                                    });
                                  }}
                                  className={`p-2 rounded-lg border transition-all ${method.enabled ? "bg-success/20 text-success border-success/30" : "bg-red-500/20 text-red-500 border-red-500/30"}`}
                                >
                                  {method.enabled ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    const newMethods =
                                      localSettings.paymentSettings.methods.filter(
                                        (m: any, idx: number) =>
                                          `method-${idx}` !== method.id,
                                      );
                                    setLocalSettings({
                                      ...localSettings,
                                      paymentSettings: {
                                        ...localSettings.paymentSettings,
                                        methods: newMethods,
                                      },
                                    });
                                  }}
                                  className="p-2 bg-white/5 text-text-muted hover:text-red-500 rounded-lg border border-white/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* NAVBAR CMS */}
              {activeSection === "navbar" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                      <List className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-black tracking-tighter uppercase">
                        Navigation Links
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          labelEn: "New Link",
                          labelBn: "নতুন লিঙ্ক",
                          href: "#",
                          visible: true,
                        };
                        setLocalSettings({
                          ...localSettings,
                          navbar: {
                            ...localSettings.navbar,
                            links: [
                              ...(localSettings.navbar.links || []),
                              newItem,
                            ],
                          },
                        });
                      }}
                      className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest"
                    >
                      Add Link
                    </button>
                  </div>

                  <SortableList
                    items={(localSettings.navbar?.links || []).map(
                      (l: any, i: number) => ({ ...l, id: `nav-${i}` }),
                    )}
                    idField="id"
                    onReorder={(newLinks) =>
                      setLocalSettings({
                        ...localSettings,
                        navbar: { ...localSettings.navbar, links: newLinks },
                      })
                    }
                    renderItem={(link) => (
                      <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <input
                          className="admin-input-sm flex-1"
                          value={link.labelEn}
                          onChange={(e) => {
                            const newLinks = localSettings.navbar.links.map(
                              (l: any, idx: number) =>
                                `nav-${idx}` === link.id
                                  ? { ...l, labelEn: e.target.value }
                                  : l,
                            );
                            setLocalSettings({
                              ...localSettings,
                              navbar: {
                                ...localSettings.navbar,
                                links: newLinks,
                              },
                            });
                          }}
                        />
                        <input
                          className="admin-input-sm flex-1"
                          value={link.href}
                          onChange={(e) => {
                            const newLinks = localSettings.navbar.links.map(
                              (l: any, idx: number) =>
                                `nav-${idx}` === link.id
                                  ? { ...l, href: e.target.value }
                                  : l,
                            );
                            setLocalSettings({
                              ...localSettings,
                              navbar: {
                                ...localSettings.navbar,
                                links: newLinks,
                              },
                            });
                          }}
                        />
                      </div>
                    )}
                  />
                </section>
              )}

              {/* TRUST BADGES */}
              {activeSection === "trust" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-black tracking-tighter uppercase">
                        Trust Badges
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localSettings.trustBadges?.map(
                      (badge: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4"
                        >
                          <input
                            className="admin-input-sm w-full"
                            value={badge.textEn}
                            onChange={(e) => {
                              const newBadges = [...localSettings.trustBadges];
                              newBadges[idx].textEn = e.target.value;
                              setLocalSettings({
                                ...localSettings,
                                trustBadges: newBadges,
                              });
                            }}
                          />
                          <input
                            className="admin-input-sm w-full opacity-60"
                            value={badge.icon}
                            onChange={(e) => {
                              const newBadges = [...localSettings.trustBadges];
                              newBadges[idx].icon = e.target.value;
                              setLocalSettings({
                                ...localSettings,
                                trustBadges: newBadges,
                              });
                            }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

              {/* FOOTER */}
              {activeSection === "footer" && (
                <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5">
                  <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                    <Layout className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-black tracking-tighter uppercase">
                      Footer Settings
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <label className="admin-label">Copyright Text (EN)</label>
                    <input
                      className="admin-input w-full"
                      value={localSettings.footer?.copyrightEn}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          footer: {
                            ...localSettings.footer,
                            copyrightEn: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .admin-label {
          @apply text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1;
        }
        .admin-input {
          @apply bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all;
        }
        .admin-input-sm {
          @apply bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all;
        }
      `}</style>
    </div>
  );
}
