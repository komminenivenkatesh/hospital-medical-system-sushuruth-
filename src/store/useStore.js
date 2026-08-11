import { create } from 'zustand';
import { doctors as seedDoctors } from '../data/doctors';
import { patient as seedPatient } from '../data/appointments';
import { conversations as seedConversations } from '../data/conversations';

const initialNotifications = [
  { id: 'n1', type: 'appointment', title: 'Appointment Reminder', body: 'Your video call with Dr. Arvind Rao is in 2 hours', time: '9:00 AM', read: false, icon: 'calendar' },
  { id: 'n2', type: 'prescription', title: 'Medication Reminder', body: 'Time to take Amitriptyline 10mg', time: '8:30 AM', read: false, icon: 'pill' },
  { id: 'n3', type: 'report', title: 'MRI Report Ready', body: 'Your brain MRI report has been reviewed by Dr. Arvind Rao', time: 'Yesterday', read: false, icon: 'report' },
  { id: 'n4', type: 'message', title: 'New Message', body: 'Dr. Priya Mehta sent you a follow-up message', time: 'Yesterday', read: true, icon: 'chat' },
  { id: 'n5', type: 'promo', title: 'Health Tip', body: 'New article: 5 daily habits that reduce migraine frequency', time: '2 days ago', read: true, icon: 'tip' },
];

const useStore = create((set, get) => ({
  // ---- Appearance ----
  themeMode: 'light', // 'light' | 'dark' | 'system'
  accentColor: 'blue', // 'blue' | 'purple' | 'green' | 'amber'
  fontSize: 'default', // 'small' | 'default' | 'large'
  setThemeMode: (mode) => set({ themeMode: mode }),
  setAccentColor: (color) => set({ accentColor: color }),
  setFontSize: (size) => set({ fontSize: size }),

  // ---- Patient / plan ----
  patient: seedPatient,
  isPro: seedPatient.plan === 'pro',
  upgradeToPro: () => set((s) => ({ isPro: true, patient: { ...s.patient, plan: 'pro' } })),
  togglePlan: () => set((s) => ({ isPro: !s.isPro, patient: { ...s.patient, plan: s.isPro ? 'free' : 'pro' } })),

  // ---- Notifications ----
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  markNotificationRead: (id) => set((s) => {
    const notifications = s.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
  }),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  // ---- Doctors (availability is mutable) ----
  doctors: seedDoctors,
  doctorStatus: 'Available',
  setDoctorStatus: (status) =>
    set((s) => ({
      doctorStatus: status,
      doctors: s.doctors.map((d) =>
        d.id === 'd001' ? { ...d, availableToday: status === 'Available' } : d
      ),
    })),

  // ---- Conversations (chat) ----
  conversations: seedConversations,
  activeConversationId: seedConversations[0]?.id ?? null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  sendMessage: (conversationId, content, type = 'text') =>
    set((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const msg = {
          id: `msg_${Date.now()}`,
          senderId: 'u001',
          senderType: 'patient',
          content,
          timestamp: new Date().toISOString(),
          read: false,
          type,
        };
        return {
          ...c,
          messages: [...c.messages, msg],
          lastMessage: content.slice(0, 32),
          lastMessageTime: msg.timestamp,
        };
      }),
    })),

  // ---- Booking draft ----
  booking: { type: null, date: null, slot: null, reason: '', shareHistory: true },
  setBooking: (patch) => set((s) => ({ booking: { ...s.booking, ...patch } })),
  resetBooking: () => set({ booking: { type: null, date: null, slot: null, reason: '', shareHistory: true } }),

  // ---- Disclaimer ----
  chatDisclaimerDismissed: typeof localStorage !== 'undefined' && localStorage.getItem('nc_chat_disclaimer') === '1',
  dismissChatDisclaimer: () => {
    try { localStorage.setItem('nc_chat_disclaimer', '1'); } catch (e) { /* ignore */ }
    set({ chatDisclaimerDismissed: true });
  },
}));

export default useStore;
