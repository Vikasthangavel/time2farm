import { useState, useEffect, useCallback } from 'react';

const PWA_DISMISSED_KEY = 'time2farm.pwa_dismissed_until';
const PWA_INSTALLED_KEY = 'time2farm.pwa_installed';

/**
 * usePWAInstall – captures the browser's beforeinstallprompt event and
 * exposes helpers to trigger the native install dialog.
 *
 * Logic:
 *  - isInstallable  → true when the browser has a deferred prompt ready
 *  - isInstalled    → true once the user accepted the prompt (or app was launched standalone)
 *  - isDismissed    → true only for the current "snooze" window (10 min by default)
 *  - promptInstall  → call to show the native dialog
 *  - snooze         → hide banner temporarily (re-shows on next load / after snoozeMs)
 */
export function usePWAInstall(snoozeMs = 10 * 60 * 1000) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Already running as installed PWA?
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (standalone || localStorage.getItem(PWA_INSTALLED_KEY) === 'true') {
      setIsInstalled(true);
      return;
    }

    // Check snooze
    const snoozedUntil = Number(localStorage.getItem(PWA_DISMISSED_KEY) || 0);
    if (Date.now() < snoozedUntil) {
      setIsDismissed(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      localStorage.removeItem(PWA_DISMISSED_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const snooze = useCallback(() => {
    localStorage.setItem(PWA_DISMISSED_KEY, String(Date.now() + snoozeMs));
    setIsDismissed(true);
  }, [snoozeMs]);

  return { isInstallable, isInstalled, isDismissed, promptInstall, snooze };
}
