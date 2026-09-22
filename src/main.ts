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
const siteHeader = document.querySelector<HTMLElement>('.site-header');
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
  const headerBottom = siteHeader?.getBoundingClientRect().bottom ?? 0;
  const activationLine = Math.max(scrollPaddingTop, headerBottom) + 24;
  const activeSection = navigationSections.reduce(
    (current, candidate) =>
      candidate.section.getBoundingClientRect().top <= activationLine + 1 ? candidate : current,
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
  requestNavigationUpdate();
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
  requestNavigationUpdate();
});
primaryNavigation?.addEventListener('transitionend', () => {
  requestNavigationIndicatorUpdate();
  requestNavigationUpdate();
});
siteHeader?.addEventListener('transitionend', requestNavigationUpdate);

const heroFoodImage = document.querySelector<HTMLImageElement>('#hero-food-image');
if (heroFoodImage) {
  heroFoodImage.src = restaurantMedia.hero.src;
  heroFoodImage.alt = restaurantMedia.hero.alt;
}

const cateringImage = document.querySelector<HTMLImageElement>('#catering-image');
if (cateringImage) {
  cateringImage.src = restaurantMedia.catering.src;
  cateringImage.alt = restaurantMedia.catering.alt;
}

type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string>;
};

const createElement = <K extends keyof HTMLElementTagNameMap>(tagName: K, options: ElementOptions = {}) => {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  Object.entries(options.attributes ?? {}).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
};

const favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];
const favouritesGrid = document.querySelector<HTMLDivElement>('#favourites-grid');
if (favouritesGrid) {
  const cards = favouriteNames.flatMap((name) => {
    const item = menuCategories.flatMap((category) => category.items).find((menuItem) => menuItem.name === name);
    const image = getMenuImage(name);
    if (!item || !image) return [];

    const article = createElement('article', { className: 'favourite-card' });
    const imageElement = createElement('img', {
      attributes: {
        src: `${image}?fit=cover&format=auto&width=900&quality=88`,
        alt: `${name} from Masala Munch by Shreeji Food`,
        loading: 'lazy',
        decoding: 'async',
      },
    });
    const copy = createElement('div');
    copy.append(createElement('h3', { text: name }), createElement('strong', { text: item.price }));
    article.append(imageElement, copy);
    return [article];
  });
  favouritesGrid.replaceChildren(...cards);
}

const menuFilters = document.querySelector<HTMLDivElement>('#menu-filters');
const menuCategoriesContainer = document.querySelector<HTMLDivElement>('#menu-categories');

type MenuItem = { name: string; price: string; description: string; popular?: boolean };

const createMenuItemCard = (item: MenuItem) => {
  const image = getMenuImage(item.name);
  const article = createElement('article', { className: `menu-item-card${image ? ' has-image' : ''}` });

  if (image) {
    article.append(
      createElement('img', {
        className: 'menu-item-image',
        attributes: {
          src: `${image}?fit=cover&format=auto&width=640&quality=85`,
          alt: `${item.name} from Masala Munch by Shreeji Food`,
          loading: 'lazy',
          decoding: 'async',
        },
      }),
    );
  }

  const copy = createElement('div', { className: 'menu-item-card-copy' });
  const titleRow = createElement('div', { className: 'menu-item-title-row' });
  const name = createElement('div', { className: 'menu-item-name' });
  name.append(createElement('h4', { text: item.name }));
  if (item.popular) name.append(createElement('span', { className: 'menu-item-popular', text: 'Popular' }));
  titleRow.append(name, createElement('strong', { text: item.price }));
  copy.append(titleRow, createElement('p', { text: item.description }));
  article.append(copy);
  return article;
};

const renderMenu = (categoryId = 'all') => {
  if (!menuCategoriesContainer) return;
  const categories = categoryId === 'all' ? menuCategories : menuCategories.filter((category) => category.id === categoryId);
  const sections = categories.map((category) => {
    const section = createElement('section', {
      className: 'menu-category',
      attributes: { 'aria-labelledby': `menu-${category.id}` },
    });
    const heading = createElement('div', { className: 'menu-category-heading' });
    const title = createElement('h3', { text: category.name });
    title.id = `menu-${category.id}`;
    heading.append(title);
    const grid = createElement('div', { className: 'menu-item-grid' });
    grid.append(...category.items.map((item) => createMenuItemCard(item)));
    section.append(heading, grid);
    return section;
  });
  menuCategoriesContainer.replaceChildren(...sections);
};

if (menuFilters) {
  const filterButtons = menuCategories.map((category) => {
    const button = createElement('button', {
      className: 'menu-filter',
      text: category.name,
      attributes: { type: 'button', 'data-menu-filter': category.id, 'aria-pressed': 'false' },
    });
    return button;
  });
  menuFilters.replaceChildren(...filterButtons);

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
  cateringOccasionsContainer.replaceChildren(
    ...cateringOccasions.map((occasion) => createElement('span', { className: 'occasion-pill', text: occasion.name })),
  );
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
  const cards = externalRatings.map((rating) => {
    const card = createElement('a', {
      className: `rating-card rating-card--${rating.id}`,
      attributes: {
        href: rating.href,
        target: '_blank',
        rel: 'noreferrer',
        'aria-label': `View ${rating.platform} reviews`,
      },
    });
    card.append(createElement('span', { className: 'rating-card-arrow', text: '↗', attributes: { 'aria-hidden': 'true' } }));

    const brand = createElement('div', { className: 'rating-card-brand' });
    const iconWrap = createElement('span', { className: 'rating-icon-wrap' });
    iconWrap.append(
      createElement('img', {
        className: 'rating-platform-icon',
        attributes: { src: ratingIcons[rating.id], alt: '', width: '36', height: '36', loading: 'lazy' },
      }),
    );
    brand.append(iconWrap, createElement('span', { className: 'rating-platform', text: rating.platform }));

    const score = createElement('div', { className: 'rating-score-row' });
    score.append(
      createElement('strong', { text: rating.rating.toFixed(1) }),
      createElement('span', { className: 'rating-scale', text: `/ ${rating.scale}` }),
    );

    const footer = createElement('div', { className: 'rating-card-footer' });
    const footerCopy = createElement('div');
    footerCopy.append(
      createElement('b', { text: `${rating.reviewCount} reviews` }),
      createElement('small', { text: `Checked ${rating.checkedDate}` }),
    );
    footer.append(footerCopy);
    card.append(brand, score, footer);
    return card;
  });
  ratingSummary.replaceChildren(...cards);
}

const address = document.querySelector<HTMLParagraphElement>('#restaurant-address');
if (address) address.textContent = restaurant.address;

const visitMain = document.querySelector<HTMLElement>('.visit-main');
if (visitMain) {
  const encodedMapQuery = encodeURIComponent(restaurant.mapQuery);
  const mapPreview = createElement('div', { className: 'visit-map' });
  const iframe = createElement('iframe', {
    attributes: {
      title: `Map showing ${restaurant.shortName} on Fishponds Road`,
      src: `https://www.google.com/maps?q=${encodedMapQuery}&output=embed`,
      loading: 'lazy',
      referrerpolicy: 'no-referrer-when-downgrade',
      tabindex: '-1',
      'aria-hidden': 'true',
    },
  });
  const mapLink = createElement('a', {
    className: 'visit-map-link',
    attributes: {
      href: restaurant.mapHref,
      target: '_blank',
      rel: 'noreferrer',
      'aria-label': `Open directions to ${restaurant.shortName} in Google Maps`,
    },
  });
  mapPreview.append(iframe, mapLink);
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
  const rows = openingHours.map(({ day, hours }) => {
    const row = createElement('div');
    row.append(createElement('dt', { text: day }), createElement('dd', { text: hours }));
    return row;
  });
  hoursContainer.replaceChildren(...rows);
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
