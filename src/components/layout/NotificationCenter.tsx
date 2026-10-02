import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useApp();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        <div onClick={onClose} className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm" />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#FCFBF8] border-l border-[#E6E2D8] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E6E2D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF56D] text-[#111111] flex items-center justify-center font-black">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#111111]">Activity Radar</h3>
                <p className="text-[10px] text-[#666666]">System alerts & cap notifications</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="p-2 rounded-2xl text-[#666666] hover:text-[#111111] hover:bg-[#F0EDE4]"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-2xl text-[#666666] hover:text-[#111111] hover:bg-[#F0EDE4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-20 text-[#666666]">
                <Bell className="w-8 h-8 mx-auto mb-2 text-[#666666]/40" />
                <p className="text-xs font-bold text-[#111111]">Zero unread notifications</p>
                <p className="text-[11px] text-[#666666] mt-0.5">Budget warnings and vault accomplishments appear here.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    n.read
                      ? 'bg-[#F7F5F0] border-[#E6E2D8] opacity-70'
                      : 'bg-[#FCFBF8] border-[#111111]/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#EAF56D] text-[#111111] flex items-center justify-center">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#111111]">{n.title}</h4>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        clearNotification(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#666666] hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#666666] mt-2 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-[#666666]/70 block mt-2 font-mono">{n.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
