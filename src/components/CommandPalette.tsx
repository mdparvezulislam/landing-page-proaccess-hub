'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Star, MessageSquare, Zap, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const actions = [
    { name: 'Browse Products', icon: Package, href: '#products' },
    { name: 'View Pricing', icon: Zap, href: '#pricing' },
    { name: 'Read Reviews', icon: Star, href: '#reviews' },
    { name: 'FAQ Support', icon: MessageSquare, href: '#faq' },
  ];

  const filteredActions = actions.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center p-4 border-b border-white/5">
              <Search className="w-5 h-5 text-text-muted mr-3" />
              <input
                autoFocus
                placeholder="Search products, sections or actions... (Ctrl+K)"
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {filteredActions.length > 0 ? (
                <div className="space-y-1">
                  {filteredActions.map((action) => (
                    <button
                      key={action.name}
                      onClick={() => {
                        router.push(action.href);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 group transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-text-primary font-medium">{action.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  No results found for "{query}"
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-text-muted uppercase tracking-widest font-bold">
              <span>Navigate with arrows</span>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10">ESC</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
