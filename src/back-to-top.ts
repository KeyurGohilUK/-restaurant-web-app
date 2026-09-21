const backToTopLink = document.querySelector<HTMLAnchorElement>(".footer-links a[href='#home']");
const siteHeader = document.querySelector<HTMLElement>('.site-header');
const mobileHeader = window.matchMedia('(max-width: 40rem)');
const revealThreshold = 480;
const compactHeaderThreshold = 56;

const updateBackToTopVisibility = () => {
  if (!backToTopLink) return;
  const isVisible = window.scrollY > revealThreshold;
  backToTopLink.classList.toggle('is-visible', isVisible);
  backToTopLink.setAttribute('aria-hidden', String(!isVisible));
  backToTopLink.tabIndex = isVisible ? 0 : -1;
};

const updateMobileHeaderState = () => {
  if (!siteHeader) return;
  const shouldCompact = mobileHeader.matches && window.scrollY > compactHeaderThreshold;
  siteHeader.classList.toggle('is-compact', shouldCompact);
};

const updateScrollUi = () => {
  updateBackToTopVisibility();
  updateMobileHeaderState();
};

updateMobileHeaderState();
window.addEventListener('scroll', updateScrollUi, { passive: true });
mobileHeader.addEventListener('change', updateMobileHeaderState);

if (backToTopLink) {
  updateBackToTopVisibility();
  backToTopLink.addEventListener('click', (event) => {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.history.replaceState(null, '', '#home');
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    window.requestAnimationFrame(updateScrollUi);
  });
}
