'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUserNotifications, useMarkNotificationsRead } from '@/hooks/useVIPDashboard';
import { Bell, CheckCircle2, X, AlertTriangle, Ban, Crown, Shield, Mail, Check, Info, Sparkles } from 'lucide-react';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  payment_received: { icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  payment_verified: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  payment_due: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  overdue: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  membership_paused: { icon: Ban, color: 'text-red-500', bg: 'bg-red-500/10' },
  membership_banned: { icon: Ban, color: 'text-red-500', bg: 'bg-red-500/10' },
  membership_activated: { icon: Crown, color: 'text-success', bg: 'bg-success/10' },
  admin_note: { icon: Mail, color: 'text-info', bg: 'bg-info/10' },
};

export default function NotificationsPage() {
  const { data: notifications } = useUserNotifications();
  const markRead = useMarkNotificationsRead();

  const allNotifications = notifications || [];
  const unreadCount = allNotifications.filter((n: any) => !n.read).length;

  const handleMarkAllRead = () => {
    markRead.mutate(undefined);
  };

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
            <Bell className="w-8 h-8 text-amber-500" /> Notifications
          </h2>
          <p className="text-text-muted text-sm mt-1">Stay updated on your membership</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} disabled={markRead.isPending}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <Check className="w-4 h-4" /> Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {allNotifications.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-[48px]">
          <Sparkles className="w-20 h-20 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white/40 mb-2">No notifications yet</h3>
          <p className="text-text-muted">You will be notified about payment updates, reminders, and membership changes here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allNotifications.map((notification: any, idx: number) => {
            const config = typeConfig[notification.type] || typeConfig.admin_note;
            const Icon = config.icon;
            const isUnread = !notification.read;

            return (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${isUnread ? 'bg-amber-500/[0.02] border-amber-500/10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                onClick={() => { if (isUnread) handleMarkRead(notification._id); }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 relative`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    {isUnread && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-bg-dark" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`text-sm font-black tracking-tight ${isUnread ? 'text-white' : 'text-white/80'}`}>
                        {notification.titleEn}
                      </h4>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-wider">New</span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isUnread ? 'text-text-muted' : 'text-text-muted/70'}`}>
                      {notification.messageEn}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-text-muted/50">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      {isUnread && (
                        <button onClick={(e) => { e.stopPropagation(); handleMarkRead(notification._id); }}
                          className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:text-amber-400">
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
