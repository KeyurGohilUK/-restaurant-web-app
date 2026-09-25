const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const isHistoryNavigation = navigationEntry?.type === 'back_forward';
const targetsPageTop = window.location.hash === '' || window.location.hash === '#home';

if (!isHistoryNavigation && targetsPageTop) {
  const previousScrollRestoration = window.history.scrollRestoration;
  const scrollToPageTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  window.history.scrollRestoration = 'manual';

  if (window.location.hash === '#home') {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }

  scrollToPageTop();
  window.addEventListener('load', scrollToPageTop, { once: true });
  window.addEventListener(
    'pageshow',
    () => {
      scrollToPageTop();
      window.history.scrollRestoration = previousScrollRestoration;
    },
    { once: true },
  );
}
