import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Lưu thông tin tạm thời của subscription:
 * - subscriptionId: ID của subscription
 * - country: Quốc gia được chọn
 * - sessionId: Session ID được generate ngẫu nhiên (khi refresh proxy)
 *
 * Dữ liệu này chỉ lưu trên trình duyệt, không bắn API lưu database
 * Khi refresh proxy, sessionId sẽ được random lại
 */

export interface SubscriptionData {
  subscriptionId: string;
  country?: string;
  sessionId?: string;
}

interface SubscriptionState {
  // Map of subscriptionId -> SubscriptionData
  subscriptions: Record<string, SubscriptionData>;

  // Actions
  setSubscriptionData: (subscriptionId: string, data: Partial<SubscriptionData>) => void;
  getSubscriptionData: (subscriptionId: string) => SubscriptionData | undefined;
  removeSubscriptionData: (subscriptionId: string) => void;
  clearAllSubscriptions: () => void;
  updateCountry: (subscriptionId: string, country: string) => void;
  updateSessionId: (subscriptionId: string, sessionId: string) => void;
  generateNewSessionId: (subscriptionId: string) => string;
}

/**
 * Generate random session ID
 * Format: 6 character random alphanumeric string
 */
const generateRandomSessionId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: {},

      setSubscriptionData: (subscriptionId: string, data: Partial<SubscriptionData>) => {
        set((state) => ({
          subscriptions: {
            ...state.subscriptions,
            [subscriptionId]: {
              ...state.subscriptions[subscriptionId],
              subscriptionId,
              ...data
            }
          }
        }));
      },

      getSubscriptionData: (subscriptionId: string) => {
        return get().subscriptions[subscriptionId];
      },

      removeSubscriptionData: (subscriptionId: string) => {
        set((state) => {
          const { [subscriptionId]: _, ...rest } = state.subscriptions;
          return { subscriptions: rest };
        });
      },

      clearAllSubscriptions: () => {
        set({ subscriptions: {} });
      },

      updateCountry: (subscriptionId: string, country: string) => {
        get().setSubscriptionData(subscriptionId, { country });
      },

      updateSessionId: (subscriptionId: string, sessionId: string) => {
        get().setSubscriptionData(subscriptionId, { sessionId });
      },

      generateNewSessionId: (subscriptionId: string) => {
        const newSessionId = generateRandomSessionId();
        get().updateSessionId(subscriptionId, newSessionId);
        return newSessionId;
      }
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        subscriptions: state.subscriptions
      })
    }
  )
);

// Export helper hook
export const useSubscriptionData = (subscriptionId: string) => {
  const data = useSubscriptionStore((state) => state.getSubscriptionData(subscriptionId));
  const setData = useSubscriptionStore((state) => state.setSubscriptionData);
  const updateCountry = useSubscriptionStore((state) => state.updateCountry);
  const generateNewSessionId = useSubscriptionStore((state) => state.generateNewSessionId);

  // Initialize with defaults if not exist
  const finalData = data || {
    subscriptionId,
    country: 'us', // Default country is US
    sessionId: '' // Will be generated on demand
  };

  // Ensure sessionId exists, generate if empty
  const getSessionId = () => {
    if (!finalData.sessionId) {
      const newSessionId = generateNewSessionId(subscriptionId);
      return newSessionId;
    }
    return finalData.sessionId;
  };

  return {
    data: finalData,
    setData: (partialData: Partial<SubscriptionData>) => setData(subscriptionId, partialData),
    updateCountry: (country: string) => updateCountry(subscriptionId, country),
    generateNewSessionId: () => generateNewSessionId(subscriptionId),
    country: finalData.country || 'us',
    sessionId: getSessionId()
  };
};
