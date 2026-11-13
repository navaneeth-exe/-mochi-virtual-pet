/**
 * notifications.ts
 * Browser Notification & In-App Reminder Manager for MOCHI.
 * Complies with strict permission guidelines: requests permission ONLY upon explicit user opt-in.
 */

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

/**
 * Request notification permissions upon explicit user action.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('[MOCHI Reminders] Notifications are not supported in this browser.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('[MOCHI Reminders] Permission request failed:', err);
    return false;
  }
};

/**
 * Dispatch a reminder notification or invoke in-app fallback.
 */
export const sendNotification = (
  title: string,
  body: string,
  inAppFallback?: (msg: string) => void
): void => {
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/assets/icon-192.png',
        badge: '/assets/favicon.png'
      });
      return;
    } catch (e) {
      console.warn('[MOCHI Reminders] Native notification failed, using fallback:', e);
    }
  }

  // Graceful in-app fallback
  if (inAppFallback) {
    inAppFallback(`🔔 ${title}: ${body}`);
  }
};

