import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

/* ------------------------------------------------------------------ *
 *  PWAInstallBanner
 *  Shows a sticky bottom sheet (mobile) or toast (desktop) asking the
 *  user to install the app.  Persists across routes and pages until the
 *  user either installs OR keeps snoozing.
 * ------------------------------------------------------------------ */

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, isDismissed, promptInstall, snooze } =
    usePWAInstall(10 * 60 * 1000); // re-ask after 10 min

  // iOS can't use beforeinstallprompt – show manual instructions instead
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [visible, setVisible] = useState(false);

  const ios = isIOS();
  const alreadyInstalled = isInstalled || isInStandaloneMode();

  useEffect(() => {
    if (alreadyInstalled || isDismissed) return;
    // Tiny delay so the page settles before we slide in
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [alreadyInstalled, isDismissed, isInstallable]);

  // Nothing to show
  if (alreadyInstalled) return null;
  if (!visible) return null;
  if (!isInstallable && !ios) return null; // browser doesn't support install on this device
  if (isDismissed) return null;

  const handleInstall = async () => {
    if (ios) {
      setShowIOSGuide(true);
      return;
    }
    setInstalling(true);
    const accepted = await promptInstall();
    if (!accepted) setInstalling(false);
  };

  const handleSnooze = () => {
    setVisible(false);
    snooze();
  };

  return (
    <>
      {/* -------- Overlay backdrop (mobile full-sheet) -------- */}
      <div
        className="pwa-backdrop"
        onClick={handleSnooze}
        aria-hidden="true"
      />

      {/* -------- Main banner -------- */}
      <div
        className="pwa-banner"
        role="dialog"
        aria-modal="true"
        aria-label="Install Time2Farm app"
      >
        <div className="pwa-banner-inner">
          {/* App icon */}
          <div className="pwa-icon-wrap">
            <img src="/logo.png" alt="Time2Farm logo" className="pwa-icon" />
          </div>

          {/* Copy */}
          <div className="pwa-copy">
            <p className="pwa-title">Install Time2Farm</p>
            <p className="pwa-subtitle">
              Get the full app experience — works offline, loads instantly, no
              browser bar.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="pwa-pills">
          {['🚀 Instant load', '📴 Works offline', '🔔 Notifications', '📱 Native feel'].map(
            (f) => (
              <span key={f} className="pwa-pill">
                {f}
              </span>
            )
          )}
        </div>

        {/* Buttons */}
        <div className="pwa-actions">
          <button
            className="pwa-btn-install"
            onClick={handleInstall}
            disabled={installing}
            id="pwa-install-btn"
          >
            {installing ? 'Installing…' : ios ? '📋 How to Install' : '⬇️ Install App'}
          </button>
          <button
            className="pwa-btn-later"
            onClick={handleSnooze}
            id="pwa-later-btn"
          >
            Maybe later
          </button>
        </div>

        {/* Close X */}
        <button
          className="pwa-close"
          onClick={handleSnooze}
          aria-label="Dismiss"
          id="pwa-close-btn"
        >
          ✕
        </button>
      </div>

      {/* -------- iOS instruction modal -------- */}
      {showIOSGuide && (
        <div className="pwa-ios-overlay" role="dialog" aria-label="iOS installation guide">
          <div className="pwa-ios-modal">
            <button
              className="pwa-ios-close"
              onClick={() => setShowIOSGuide(false)}
              aria-label="Close guide"
            >
              ✕
            </button>
            <div className="pwa-ios-icon">📱</div>
            <h3 className="pwa-ios-title">Add to Home Screen</h3>
            <p className="pwa-ios-subtitle">Follow these steps in Safari:</p>
            <ol className="pwa-ios-steps">
              <li>
                Tap the <strong>Share</strong> button{' '}
                <span className="pwa-ios-share">⬆</span> at the bottom of your
                browser
              </li>
              <li>
                Scroll down and tap{' '}
                <strong>"Add to Home Screen"</strong>
              </li>
              <li>
                Tap <strong>"Add"</strong> in the top-right corner
              </li>
            </ol>
            <button
              className="pwa-btn-install"
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={() => setShowIOSGuide(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
