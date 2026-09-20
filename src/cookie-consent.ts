type CookieConsent = 'accepted' | 'denied';

const STORAGE_KEY = 'masala-munch-cookie-consent';

const getStoredConsent = (): CookieConsent | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

const storeConsent = (consent: CookieConsent) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // The choice still applies for the current page even if storage is unavailable.
  }
};

const banner = document.querySelector<HTMLElement>('#cookie-consent');
const acceptButton = document.querySelector<HTMLButtonElement>('#cookie-accept');
const denyButton = document.querySelector<HTMLButtonElement>('#cookie-deny');
const settingsButton = document.querySelector<HTMLButtonElement>('#cookie-settings');

const setBannerVisible = (visible: boolean) => {
  if (!banner) return;
  banner.hidden = !visible;
};

const saveChoice = (consent: CookieConsent) => {
  storeConsent(consent);
  setBannerVisible(false);
  settingsButton?.focus();
};

acceptButton?.addEventListener('click', () => saveChoice('accepted'));
denyButton?.addEventListener('click', () => saveChoice('denied'));
settingsButton?.addEventListener('click', () => {
  setBannerVisible(true);
  acceptButton?.focus();
});

setBannerVisible(getStoredConsent() === null);
