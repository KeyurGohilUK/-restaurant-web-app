const backToTopLink = document.querySelector<HTMLAnchorElement>(".footer-links a[href='#home']");
const revealThreshold = 480;

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
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.history.replaceState(null, '', '#home');
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    window.requestAnimationFrame(updateBackToTopVisibility);
  });
}
