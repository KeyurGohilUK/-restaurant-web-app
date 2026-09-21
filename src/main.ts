import './styles.css';
import './about.css';
import './release.css';
import './media.css';
import './mobile-nav.css';
import './cookie-consent.css';
import './visit-map.css';
import './back-to-top';
import './cookie-consent';
import { cateringOccasions } from './content/catering-content';
import { getMenuImage, restaurantMedia } from './content/media-content';
import { menuCategories } from './content/menu-content';
import { externalRatings } from './content/review-content';
import { openingHours, restaurant } from './content/site-content';
import { getOpeningStatus } from './features/visit/domain/opening-status';

const navToggle = document.querySelector<HTMLButtonElement>('#nav-toggle');
const primaryNavigation = document.querySelector<HTMLElement>('#primary-navigation');
const copyrightYear = document.querySelector<HTMLTimeElement>('#copyright-year');
const phoneNavigation = window.matchMedia('(max-width: 40rem)');

if (copyrightYear) {
  const currentYear = String(new Date().getFullYear());
  copyrightYear.dateTime = currentYear;
  copyrightYear.textContent = currentYear;
}

const navigationLinks = Array.from(primaryNavigation?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? []);
const navigationSections = navigationLinks.flatMap((link) => {
  const section = document.querySelector<HTMLElement>(link.hash);
  return section ? [{ link, section }] : [];
});
const navigationIndicator = document.createElement('span');
navigationIndicator.className = 'nav-active-indicator';
navigationIndicator.setAttribute('aria-hidden', 'true');
primaryNavigation?.prepend(navigationIndicator);

const updateNavigationIndicator = () => {
  if (!primaryNavigation || (phoneNavigation.matches && !primaryNavigation.classList.contains('is-open'))) {
    primaryNavigation?.removeAttribute('data-indicator-ready');
    return;
  }

  const activeLink = navigationLinks.find((link) => link.getAttribute('aria-current') === 'page');
  if (!activeLink) return;

  navigationIndicator.style.width = `${activeLink.offsetWidth}px`;
  navigationIndicator.style.height = `${activeLink.offsetHeight}px`;
  navigationIndicator.style.transform = `translate3d(${activeLink.offsetLeft}px, ${activeLink.offsetTop}px, 0)`;
  primaryNavigation.setAttribute('data-indicator-ready', 'true');
};

let indicatorUpdateRequested = false;
const requestNavigationIndicatorUpdate = () => {
  if (indicatorUpdateRequested) return;
  indicatorUpdateRequested = true;
  window.requestAnimationFrame(() => {
    updateNavigationIndicator();
    indicatorUpdateRequested = false;
  });
};

const setActiveNavigationSection = (activeSection: HTMLElement) => {
  navigationSections.forEach(({ link, section }) => {
    if (section === activeSection) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  requestNavigationIndicatorUpdate();
};

const updateActiveNavigationSection = () => {
  if (navigationSections.length === 0) return;

  if (window.scrollY <= 1) {
    setActiveNavigationSection(navigationSections[0].section);
    return;
  }

  const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (isAtPageEnd) {
    setActiveNavigationSection(navigationSections.at(-1)!.section);
    return;
  }

  const scrollPaddingTop = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const activeSection = navigationSections.reduce(
    (current, candidate) =>
      candidate.section.getBoundingClientRect().top <= scrollPaddingTop + 1 ? candidate : current,
    navigationSections[0],
  );
  setActiveNavigationSection(activeSection.section);
};

let navigationUpdateRequested = false;
const requestNavigationUpdate = () => {
  if (navigationUpdateRequested) return;
  navigationUpdateRequested = true;
  window.requestAnimationFrame(() => {
    updateActiveNavigationSection();
    navigationUpdateRequested = false;
  });
};

updateActiveNavigationSection();
window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('resize', requestNavigationUpdate);
window.addEventListener('hashchange', requestNavigationUpdate);

const setNavigationOpen = (isOpen: boolean) => {
  if (!navToggle || !primaryNavigation) return;
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  primaryNavigation.classList.toggle('is-open', isOpen);
  requestNavigationIndicatorUpdate();
};

navToggle?.addEventListener('click', () => {
  setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

primaryNavigation?.addEventListener('click', async (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;

  const wasOpen = navToggle?.getAttribute('aria-expanded') === 'true';
  const destination = document.querySelector<HTMLElement>(event.target.hash);
  setNavigationOpen(false);
  if (destination) setActiveNavigationSection(destination);

  if (!phoneNavigation.matches || !wasOpen || !destination) return;

  event.preventDefault();
  await Promise.allSettled(primaryNavigation.getAnimations().map((animation) => animation.finished));
  window.location.hash = event.target.hash;
  destination.scrollIntoView();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setNavigationOpen(false);
    navToggle.focus();
  }
});

phoneNavigation.addEventListener('change', (event) => {
  if (!event.matches) setNavigationOpen(false);
  requestNavigationIndicatorUpdate();
});
primaryNavigation?.addEventListener('transitionend', requestNavigationIndicatorUpdate);

const heroFoodImage = document.querySelector<HTMLImageElement>('#hero-food-image');
if (heroFoodImage) {
  heroFoodImage.src = restaurantMedia.hero.src;
  heroFoodImage.alt = restaurantMedia.hero.alt;
}

const cateringImage = document.querySelector<HTMLImageElement>('#catering-image');
if (cateringImage) cateringImage.src = restaurantMedia.hero.src;

const favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];
const favouritesGrid = document.querySelector<HTMLDivElement>('#favourites-grid');
if (favouritesGrid) {
  favouritesGrid.innerHTML = favouriteNames
    .map((name) => {
      const item = menuCategories.flatMap((category) => category.items).find((menuItem) => menuItem.name === name);
      const image = getMenuImage(name);
      if (!item || !image) return '';
      return `<article class="favourite-card">
        <img src="${image}?fit=cover&format=auto&width=900&quality=88" alt="${name} from Masala Munch by Shreeji Food" loading="lazy" decoding="async" />
        <div><h3>${name}</h3><strong>${item.price}</strong></div>
      </article>`;
    })
    .join('');
}

const menuFilters = document.querySelector<HTMLDivElement>('#menu-filters');
const menuCategoriesContainer = document.querySelector<HTMLDivElement>('#menu-categories');

const renderMenu = (categoryId = 'all') => {
  if (!menuCategoriesContainer) return;
  const categories = categoryId === 'all' ? menuCategories : menuCategories.filter((category) => category.id === categoryId);

  menuCategoriesContainer.innerHTML = categories
    .map(
      (category) => `
        <section class="menu-category" aria-labelledby="menu-${category.id}">
          <div class="menu-category-heading"><h3 id="menu-${category.id}">${category.name}</h3></div>
          <div class="menu-item-grid">
            ${category.items
              .map((item) => {
                const image = getMenuImage(item.name);
                return `
                  <article class="menu-item-card${image ? ' has-image' : ''}">
                    ${image ? `<img class="menu-item-image" src="${image}?fit=cover&format=auto&width=640&quality=85" alt="${item.name} from Masala Munch by Shreeji Food" loading="lazy" decoding="async" />` : ''}
                    <div class="menu-item-card-copy">
                      <div class="menu-item-title-row"><h4>${item.name}</h4><strong>${item.price}</strong></div>
                      <p>${item.description}</p>
                    </div>
                  </article>`;
              })
              .join('')}
          </div>
        </section>`,
    )
    .join('');
};

if (menuFilters) {
  menuFilters.innerHTML = menuCategories
    .map((category) => `<button class="menu-filter" type="button" data-menu-filter="${category.id}" aria-pressed="false">${category.name}</button>`)
    .join('');

  const toolbar = menuFilters.closest('.menu-toolbar');
  toolbar?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const categoryId = target.dataset.menuFilter;
    if (!categoryId) return;

    toolbar.querySelectorAll<HTMLButtonElement>('.menu-filter').forEach((button) => {
      const isActive = button === target;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    renderMenu(categoryId);
  });
}
renderMenu();

const cateringOccasionsContainer = document.querySelector<HTMLDivElement>('#catering-occasions');
if (cateringOccasionsContainer) {
  cateringOccasionsContainer.innerHTML = cateringOccasions
    .map((occasion) => `<span class="occasion-pill">${occasion.name}</span>`)
    .join('');
}

const cateringPhoneLink = document.querySelector<HTMLAnchorElement>('#catering-phone-link');
if (cateringPhoneLink) {
  cateringPhoneLink.href = restaurant.phoneHref;
  cateringPhoneLink.setAttribute('aria-label', `Call ${restaurant.shortName} about catering on ${restaurant.phoneDisplay}`);
}

const dietaryPhoneLink = document.querySelector<HTMLAnchorElement>('#dietary-phone-link');
if (dietaryPhoneLink) {
  dietaryPhoneLink.href = restaurant.phoneHref;
  dietaryPhoneLink.setAttribute(
    'aria-label',
    `Call ${restaurant.shortName} about allergies or dietary requirements on ${restaurant.phoneDisplay}`,
  );
}

const ratingIcons: Record<string, string> = {
  google: 'https://cdn.simpleicons.org/google/4285F4',
  deliveroo: 'https://cdn.simpleicons.org/deliveroo/00CCBC',
};

const ratingSummary = document.querySelector<HTMLDivElement>('#external-ratings');
if (ratingSummary) {
  ratingSummary.innerHTML = externalRatings
    .map(
      (rating) => `<a class="rating-card rating-card--${rating.id}" href="${rating.href}" target="_blank" rel="noreferrer" aria-label="View ${rating.platform} reviews">
        <span class="rating-card-arrow" aria-hidden="true">↗</span>
        <div class="rating-card-brand">
          <span class="rating-icon-wrap"><img class="rating-platform-icon" src="${ratingIcons[rating.id]}" alt="" width="36" height="36" loading="lazy" /></span>
          <span class="rating-platform">${rating.platform}</span>
        </div>
        <div class="rating-score-row">
          <strong>${rating.rating.toFixed(1)}</strong><span class="rating-scale">/ ${rating.scale}</span>
        </div>
        <div class="rating-card-footer">
          <div><b>${rating.reviewCount} reviews</b><small>Checked ${rating.checkedDate}</small></div>
        </div>
      </a>`,
    )
    .join('');
}

const address = document.querySelector<HTMLParagraphElement>('#restaurant-address');
if (address) address.textContent = restaurant.address;

const visitMain = document.querySelector<HTMLElement>('.visit-main');
if (visitMain) {
  const encodedMapQuery = encodeURIComponent(restaurant.mapQuery);
  const mapPreview = document.createElement('div');
  mapPreview.className = 'visit-map';
  mapPreview.innerHTML = `
    <iframe
      title="Map showing ${restaurant.shortName} on Fishponds Road"
      src="https://www.google.com/maps?q=${encodedMapQuery}&output=embed"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      tabindex="-1"
      aria-hidden="true"
    ></iframe>
    <a class="visit-map-link" href="${restaurant.mapHref}" target="_blank" rel="noreferrer" aria-label="Open directions to ${restaurant.shortName} in Google Maps"></a>`;
  visitMain.append(mapPreview);
}

const phoneLink = document.querySelector<HTMLAnchorElement>('#phone-link');
if (phoneLink) {
  phoneLink.href = restaurant.phoneHref;
  phoneLink.textContent = `Call ${restaurant.phoneDisplay}`;
  phoneLink.setAttribute('aria-label', `Call ${restaurant.shortName} on ${restaurant.phoneDisplay}`);
}

const clickCollectPhoneLink = document.querySelector<HTMLAnchorElement>('#click-collect-phone-link');
if (clickCollectPhoneLink) {
  clickCollectPhoneLink.href = restaurant.phoneHref;
  clickCollectPhoneLink.setAttribute('aria-label', `Call ${restaurant.shortName} for click and collect`);
}

const hoursContainer = document.querySelector<HTMLDListElement>('#opening-hours');
if (hoursContainer) {
  hoursContainer.innerHTML = openingHours.map(({ day, hours }) => `<div><dt>${day}</dt><dd>${hours}</dd></div>`).join('');
}

const openingStatus = document.querySelector<HTMLElement>('#opening-status');
const openingStatusLabel = document.querySelector<HTMLElement>('#opening-status-label');
const openingStatusDetail = document.querySelector<HTMLElement>('#opening-status-detail');

const updateOpeningStatus = () => {
  if (!openingStatus || !openingStatusLabel || !openingStatusDetail) return;

  const status = getOpeningStatus(openingHours);
  openingStatus.dataset.state = status.isOpen ? 'open' : 'closed';
  openingStatusLabel.textContent = status.label;
  openingStatusDetail.textContent = status.detail;
};

if (openingStatus) {
  updateOpeningStatus();
  window.setInterval(updateOpeningStatus, 60_000);
}
