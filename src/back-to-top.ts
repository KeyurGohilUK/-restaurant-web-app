const backToTopLink = document.querySelector<HTMLAnchorElement>(".footer-links a[href='#home']");
const homeSection = document.querySelector<HTMLElement>('#home');
const siteHeader = document.querySelector<HTMLElement>('.site-header');
const revealThreshold = 480;
const minimumRestingOffset = 40;

const updateBackToTopVisibility = () => {
  if (!backToTopLink) return;
  const isVisible = window.scrollY > revealThreshold;
  backToTopLink.classList.toggle('is-visible', isVisible);
  backToTopLink.setAttribute('aria-hidden', String(!isVisible));
  backToTopLink.tabIndex = isVisible ? 0 : -1;
};

if (backToTopLink) {
  updateBackToTopVisibility();
  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
  backToTopLink.addEventListener('click', (event) => {
    if (!homeSection) return;

    event.preventDefault();
    const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
    const homeTop = window.scrollY + homeSection.getBoundingClientRect().top;
    const targetTop = Math.max(minimumRestingOffset, homeTop - headerHeight);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.history.replaceState(null, '', '#home');
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    window.requestAnimationFrame(updateBackToTopVisibility);
  });
}
