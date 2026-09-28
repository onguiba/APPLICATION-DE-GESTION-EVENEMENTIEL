'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  participants: number;
  visibility: 'public' | 'private';
  createdAt: string;
}

export interface Participant {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
  event: string;
  type: string;
  statut: ParticipantStatus;
  paiement: PaymentStatus;
  montant: number;
  createdAt: string;
}

export interface Depense {
  id: number;
  eventId: number;
  category: string;
  description: string;
  montant: number;
  date: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId?: number;
  type: NotificationType;
  message: string;
  channel: NotificationChannel;
  lu: boolean;
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

  // Event actions
  addEvent: (event: Omit<AppEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: number, event: Partial<AppEvent>) => void;
  deleteEvent: (id: number) => void;
  getEvent: (id: number) => AppEvent | undefined;

  // Participant actions
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt'>) => void;
  updateParticipant: (id: number, participant: Partial<Participant>) => void;
  deleteParticipant: (id: number) => void;
  getParticipant: (id: number) => Participant | undefined;

  // Expense actions
  addDepense: (depense: Omit<Depense, 'id' | 'createdAt'>) => void;
  updateDepense: (id: number, depense: Partial<Depense>) => void;
  deleteDepense: (id: number) => void;
  getDepense: (id: number) => Depense | undefined;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: number) => void;

  // Toast actions
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeToast: (id: string) => void;

  // Search
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      participants: [],
      depenses: [],
      notifications: [],
      toasts: [],
      searchQuery: '',

      // Event actions
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: Math.max(0, ...state.events.map((e) => e.id)) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      getEvent: (id) => get().events.find((e) => e.id === id),

      // Participant actions
      addParticipant: (participant) =>
        set((state) => ({
          participants: [
            ...state.participants,
            {
              ...participant,
              id: Math.max(0, ...state.participants.map((p) => p.id)) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateParticipant: (id, participant) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, ...participant } : p
          ),
        })),

      deleteParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        })),

      getParticipant: (id) => get().participants.find((p) => p.id === id),

      // Expense actions
      addDepense: (depense) =>
        set((state) => ({
          depenses: [
            ...state.depenses,
            {
              ...depense,
              id: Math.max(0, ...state.depenses.map((d) => d.id)) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateDepense: (id, depense) =>
        set((state) => ({
          depenses: state.depenses.map((d) =>
            d.id === id ? { ...d, ...depense } : d
          ),
        })),

      deleteDepense: (id) =>
        set((state) => ({
          depenses: state.depenses.filter((d) => d.id !== id),
        })),

      getDepense: (id) => get().depenses.find((d) => d.id === id),

      // Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.max(0, ...state.notifications.map((n) => n.id)) + 1,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, lu: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, lu: true })),
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
    }),
    {
      name: 'lynkene-store',
      version: 1,
    }
  )
);
