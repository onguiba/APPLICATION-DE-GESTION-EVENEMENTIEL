'use client';

import { create } from 'zustand';

// Types
export type EventStatus = 'Planifié' | 'En cours' | 'Brouillon' | 'Terminé';
export type EventType = 'Conférence' | 'Gala' | 'Séminaire' | 'Festival' | 'Réunion' | 'Corporate' | 'Concert' | 'Atelier' | 'Autre';
export type ParticipantStatus = 'Confirmé' | 'En attente' | 'Annulé';
export type PaymentStatus = 'Payé' | 'En attente' | 'Remboursé';
export type NotificationType = 'alert' | 'success' | 'info' | 'warning';
export type NotificationChannel = 'Email' | 'SMS' | 'WhatsApp' | 'Push';

export interface AppEvent {
  id: number;
  name: string;
  date: string;
  location: string;
  capacity: number;
  budget: number;
  status: EventStatus;
  type: EventType;
  img: string;
  description: string;
  participants: any[];
  visibility: 'public' | 'private';
  createdAt: string;
}

export interface Participant {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  status: ParticipantStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
}

export interface Depense {
  id: number;
  eventId: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId?: number;
  type: NotificationType;
  message: string;
  channel: NotificationChannel;
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface StoreState {
  // Data
  events: AppEvent[];
  participants: Participant[];
  depenses: Depense[];
  notifications: Notification[];
  toasts: Toast[];
  searchQuery: string;
  loading: boolean;

  // Fetch actions
  fetchEvents: () => Promise<void>;
  fetchParticipants: () => Promise<void>;
  fetchDepenses: () => Promise<void>;

  // Event actions
  addEvent: (event: Partial<AppEvent>) => Promise<void>;
  updateEvent: (id: number, event: Partial<AppEvent>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  getEvent: (id: number) => AppEvent | undefined;

  // Participant actions
  addParticipant: (participant: Partial<Participant>) => Promise<void>;
  updateParticipant: (id: number, participant: Partial<Participant>) => Promise<void>;
  deleteParticipant: (id: number) => Promise<void>;
  getParticipant: (id: number) => Participant | undefined;

  // Expense actions
  addDepense: (depense: Partial<Depense>) => Promise<void>;
  updateDepense: (id: number, depense: Partial<Depense>) => Promise<void>;
  deleteDepense: (id: number) => Promise<void>;
  getDepense: (id: number) => Depense | undefined;

  // Notification actions
  addNotification: (notification: Partial<Notification>) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: number) => void;

  // Toast actions
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeToast: (id: string) => void;

  // Search
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  events: [],
  participants: [],
  depenses: [],
  notifications: [],
  toasts: [],
  searchQuery: '',
  loading: false,

  fetchEvents: async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        set({ events: data });
      }
    } catch (e) {
      console.error(e);
    }
  },

  fetchParticipants: async () => {
    try {
      const res = await fetch('/api/participants');
      if (res.ok) {
        const data = await res.json();
        set({ participants: data });
      }
    } catch (e) {
      console.error(e);
    }
  },

  fetchDepenses: async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        set({ depenses: data });
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Event actions
  addEvent: async (event) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (res.ok) {
        get().fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  },

  updateEvent: async (id, event) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      if (res.ok) {
        get().fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  },

  deleteEvent: async (id) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        get().fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  },

  getEvent: (id: number) => get().events.find((e) => e.id === id),

  // Participant actions
  addParticipant: async (participant) => {
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant)
      });
      if (res.ok) {
        get().fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  },

  updateParticipant: async (id, participant) => {
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant)
      });
      if (res.ok) {
        get().fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  },

  deleteParticipant: async (id) => {
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        get().fetchParticipants();
      }
    } catch (e) {
      console.error(e);
    }
  },

  getParticipant: (id: number) => get().participants.find((p) => p.id === id),

  // Expense actions
  addDepense: async (depense) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depense)
      });
      if (res.ok) {
        get().fetchDepenses();
      }
    } catch (e) {
      console.error(e);
    }
  },

  updateDepense: async (id, depense) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depense)
      });
      if (res.ok) {
        get().fetchDepenses();
      }
    } catch (e) {
      console.error(e);
    }
  },

  deleteDepense: async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        get().fetchDepenses();
      }
    } catch (e) {
      console.error(e);
    }
  },

  getDepense: (id: number) => get().depenses.find((d) => d.id === id),

  // Notification actions
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.max(0, ...state.notifications.map((n) => n.id)) + 1,
          read: false,
          createdAt: new Date().toISOString(),
        } as Notification,
      ],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Toast actions
  showToast: (message, type, duration = 3000) =>
    set((state) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type, duration };
      return { toasts: [...state.toasts, toast] };
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Search
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
