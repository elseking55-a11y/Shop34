import React, { useState } from 'react';
import { useStore } from '../../store';
import { Palette, Sparkles, Layout, Info, Megaphone, PhoneCall, Check, Save, RotateCcw, Eye, Sliders, Layers } from 'lucide-react';
import { SiteSettings as ISiteSettings } from '../../types';

export default function AdminSiteSettings() {
  const { siteSettings, updateSiteSettings, showToast } = useStore();
  const [formData, setFormData] = useState<ISiteSettings>({ ...siteSettings });
  const [activeTab, setActiveTab] = useState<'branding' | 'appearance' | 'animation' | 'hero' | 'about' | 'contact'>('branding');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings(formData);
    setIsSaved(true);
    showToast('Site settings updated successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const themePresets = [
    { id: 'amber', name: 'Sunset Amber', bg: 'bg-orange-500', border: 'border-orange-500', desc: 'Warm Amber & Gold (Default)' },
    { id: 'emerald', name: 'Royal Emerald', bg: 'bg-emerald-600', border: 'border-emerald-500', desc: 'Deep Mint & Forest Green' },
    { id: 'sapphire', name: 'Sapphire Blue', bg: 'bg-blue-600', border: 'border-blue-500', desc: 'Tech Cyan & Cobalt Blue' },
    { id: 'crimson', name: 'Crimson Red', bg: 'bg-red-600', border: 'border-red-500', desc: 'Garnet & Vibrant Scarlet' },
    { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-600', border: 'border-purple-500', desc: 'Velvet & Vibrant Amethyst' },
    { id: 'gold', name: 'Luxury Gold', bg: 'bg-yellow-500', border: 'border-yellow-500', desc: 'Metallic Gold & Onyx' },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-amber-900/10">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-3">
            Site Appearance & Content <Sliders className="text-orange-600" size={28} />
          </h1>
          <p className="text-amber-900/70 dark:text-zinc-400 text-sm sm:text-base mt-1">
            Customize website colors, branding, hero content, mission statements, and UI animations without editing code.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSaved ? <Check size={20} /> : <Save size={20} />}
          <span>{isSaved ? 'Saved & Applied!' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-900/10 scrollbar-none">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'branding'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <Megaphone size={16} /> Branding & Announcement
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'appearance'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <Palette size={16} /> Colors & Theme
        </button>

        <button
          onClick={() => setActiveTab('animation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'animation'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <Sparkles size={16} /> Animations & Motion
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'hero'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <Layout size={16} /> Hero Banner
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'about'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <Info size={16} /> About & Mission
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'contact'
              ? 'bg-amber-950 text-orange-400 shadow-md'
              : 'bg-white dark:bg-zinc-900 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
          }`}
        >
          <PhoneCall size={16} /> Support & Contact
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* TAB 1: BRANDING & ANNOUNCEMENT */}
        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Megaphone className="text-orange-600" size={22} /> Branding & Top Announcement Marquee
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Website Name / Brand Title</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold focus:outline-none focus:border-orange-500"
                  required
                />
                <p className="text-xs text-amber-900/50 dark:text-zinc-500 mt-1">Appears in logo, headers, footer, and emails.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Website Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-amber-900/10 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-zinc-100">Top Announcement Banner Bar</h4>
                  <p className="text-xs text-amber-900/60 dark:text-zinc-400">Show a prominent alert marquee banner at the very top of the website.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.announcementEnabled}
                    onChange={e => setFormData({ ...formData, announcementEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {formData.announcementEnabled && (
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Announcement Banner Text</label>
                  <textarea
                    rows={2}
                    value={formData.announcementText}
                    onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:border-orange-500"
                    placeholder="Enter special offer, code, or notification message..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPEARANCE & COLORS */}
        {activeTab === 'appearance' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Palette className="text-orange-600" size={22} /> Color Theme & Palette Customization
            </h3>

            <div>
              <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-3">Select Primary Color Accent Preset</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {themePresets.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryTheme: preset.id as any })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      formData.primaryTheme === preset.id
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 ring-2 ring-orange-500/30'
                        : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/30 dark:bg-zinc-800/40 hover:bg-amber-100/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full shrink-0 ${preset.bg} shadow-md mt-0.5`} />
                    <div>
                      <h4 className="font-bold text-amber-950 dark:text-zinc-100 text-sm">{preset.name}</h4>
                      <p className="text-xs text-amber-900/60 dark:text-zinc-400 mt-0.5">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-amber-900/10 dark:border-zinc-800">
              <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Custom Hex Color Accent Code (Optional)</label>
              <div className="flex items-center gap-3 max-w-md">
                <input
                  type="color"
                  value={formData.customAccentColor || '#ea580c'}
                  onChange={e => setFormData({ ...formData, customAccentColor: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-amber-900/20 cursor-pointer p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.customAccentColor || '#ea580c'}
                  onChange={e => setFormData({ ...formData, customAccentColor: e.target.value })}
                  className="flex-1 p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono text-sm focus:outline-none"
                  placeholder="#ea580c"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANIMATIONS & MOTION */}
        {activeTab === 'animation' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="text-orange-600" size={22} /> Animation & Motion Controls
            </h3>

            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-zinc-800/60 rounded-2xl border border-amber-900/10 dark:border-zinc-700">
              <div>
                <h4 className="font-bold text-amber-950 dark:text-zinc-100">Enable Website Motion Effects</h4>
                <p className="text-xs text-amber-900/60 dark:text-zinc-400">Controls floating badges, bouncing icons, and smooth card entrance transitions.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.motionEffectsEnabled}
                  onChange={e => setFormData({ ...formData, motionEffectsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-2">Global Animation Speed</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'fast', title: '⚡ Fast (0.3s)', desc: 'Snappy & responsive' },
                  { id: 'normal', title: '✨ Normal (0.6s)', desc: 'Balanced smooth motion' },
                  { id: 'slow', title: '🎬 Slow (1.0s)', desc: 'Cinematic fade-ins' },
                  { id: 'minimal', title: '🚫 Minimal', desc: 'Low-motion / performance mode' },
                ].map(speed => (
                  <button
                    key={speed.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, animationSpeed: speed.id as any })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.animationSpeed === speed.id
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-amber-950 dark:text-zinc-100 font-bold'
                        : 'border-amber-900/10 dark:border-zinc-800 bg-amber-50/30 dark:bg-zinc-800/40 text-amber-900/70 dark:text-zinc-400 hover:bg-amber-100'
                    }`}
                  >
                    <div className="text-sm font-bold">{speed.title}</div>
                    <div className="text-[11px] opacity-70 mt-0.5">{speed.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERO BANNER */}
        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Layout className="text-orange-600" size={22} /> Homepage Hero Banner
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Hero Eyebrow Badge</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold uppercase text-xs tracking-wider"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Hero Main Title</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-serif font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={formData.heroSubtitle}
                  onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.heroCtaText}
                    onChange={e => setFormData({ ...formData, heroCtaText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Primary CTA Target Link</label>
                  <input
                    type="text"
                    value={formData.heroCtaLink}
                    onChange={e => setFormData({ ...formData, heroCtaLink: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.heroSecondaryCtaText}
                    onChange={e => setFormData({ ...formData, heroSecondaryCtaText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Secondary CTA Target Link</label>
                  <input
                    type="text"
                    value={formData.heroSecondaryCtaLink}
                    onChange={e => setFormData({ ...formData, heroSecondaryCtaLink: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Hero Background Image URL</label>
                <input
                  type="text"
                  value={formData.heroImageUrl}
                  onChange={e => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT & MISSION */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <Info className="text-orange-600" size={22} /> About Us, Story & Mission Statements
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">About Section Headline</label>
                <input
                  type="text"
                  value={formData.aboutHeadline}
                  onChange={e => setFormData({ ...formData, aboutHeadline: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-serif font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">About Section Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.aboutSubtitle}
                  onChange={e => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Our Story Heading</label>
                <input
                  type="text"
                  value={formData.ourStoryTitle}
                  onChange={e => setFormData({ ...formData, ourStoryTitle: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Our Story Content</label>
                <textarea
                  rows={4}
                  value={formData.ourStoryContent}
                  onChange={e => setFormData({ ...formData, ourStoryContent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Our Mission Statement</label>
                  <textarea
                    rows={3}
                    value={formData.ourMission}
                    onChange={e => setFormData({ ...formData, ourMission: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Our Vision Statement</label>
                  <textarea
                    rows={3}
                    value={formData.ourVision}
                    onChange={e => setFormData({ ...formData, ourVision: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Stat Counter: Active Traders</label>
                  <input
                    type="text"
                    value={formData.statTradersCount}
                    onChange={e => setFormData({ ...formData, statTradersCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Stat Counter: Proven Algorithms</label>
                  <input
                    type="text"
                    value={formData.statAlgorithmsCount}
                    onChange={e => setFormData({ ...formData, statAlgorithmsCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUPPORT & CONTACT */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 dark:text-zinc-100 flex items-center gap-2">
              <PhoneCall className="text-orange-600" size={22} /> Support & Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Support Email Address</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Support Phone / WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={e => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Physical Address / Headquarters</label>
                <input
                  type="text"
                  value={formData.supportAddress}
                  onChange={e => setFormData({ ...formData, supportAddress: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-amber-950 dark:text-zinc-200 mb-1.5">Working Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full p-3 rounded-xl border border-amber-900/20 dark:border-zinc-700 bg-amber-50/50 dark:bg-zinc-800 text-amber-950 dark:text-zinc-100 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaved ? <Check size={20} /> : <Save size={20} />}
            <span>{isSaved ? 'All Settings Saved!' : 'Save Site Customizations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
