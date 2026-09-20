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

const navToggle = document.querySelector<HTMLButtonElement>('#nav-toggle');
const primaryNavigation = document.querySelector<HTMLElement>('#primary-navigation');

const setNavigationOpen = (isOpen: boolean) => {
  if (!navToggle || !primaryNavigation) return;
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  primaryNavigation.classList.toggle('is-open', isOpen);
};

navToggle?.addEventListener('click', () => {
  setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

primaryNavigation?.addEventListener('click', async (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;

  const wasOpen = navToggle?.getAttribute('aria-expanded') === 'true';
  const destination = document.querySelector<HTMLElement>(event.target.hash);
  setNavigationOpen(false);

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

const phoneNavigation = window.matchMedia('(max-width: 40rem)');
phoneNavigation.addEventListener('change', (event) => {
  if (!event.matches) setNavigationOpen(false);
});

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
      (rating) => `<article class="rating-card rating-card--${rating.id}">
        <div class="rating-card-brand">
          <span class="rating-icon-wrap"><img class="rating-platform-icon" src="${ratingIcons[rating.id]}" alt="" width="30" height="30" loading="lazy" /></span>
          <span class="rating-platform">${rating.platform}</span>
        </div>
        <div class="rating-score-row">
          <strong>${rating.rating.toFixed(1)}</strong><span class="rating-scale">/ ${rating.scale}</span>
        </div>
        <div class="rating-card-footer">
          <div><b>${rating.reviewCount} reviews</b><small>Checked ${rating.checkedDate}</small></div>
          <a href="${rating.href}" target="_blank" rel="noreferrer" aria-label="View ${rating.platform} reviews">View reviews <span aria-hidden="true">↗</span></a>
        </div>
      </article>`,
    )
    .join('');
}

const address = document.querySelector<HTMLParagraphElement>('#restaurant-address');
if (address) address.textContent = restaurant.address;

const mapLink = document.querySelector<HTMLAnchorElement>('#map-link');
if (mapLink) mapLink.href = restaurant.mapHref;

const visitMain = document.querySelector<HTMLElement>('.visit-main');
if (visitMain) {
  const encodedAddress = encodeURIComponent(restaurant.address);
  const mapPreview = document.createElement('div');
  mapPreview.className = 'visit-map';
  mapPreview.innerHTML = `
    <iframe
      title="Map showing ${restaurant.shortName} on Fishponds Road"
      src="https://www.google.com/maps?q=${encodedAddress}&output=embed"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      tabindex="-1"
      aria-hidden="true"
    ></iframe>
    <a class="visit-map-link" href="${restaurant.mapHref}" target="_blank" rel="noreferrer" aria-label="Open directions to ${restaurant.shortName} in Google Maps">
      <span>Tap map for directions ↗</span>
    </a>`;
  visitMain.append(mapPreview);
}

const phoneLink = document.querySelector<HTMLAnchorElement>('#phone-link');
if (phoneLink) {
  phoneLink.href = restaurant.phoneHref;
  phoneLink.setAttribute('aria-label', `Call ${restaurant.shortName} on ${restaurant.phoneDisplay}`);
}

const hoursContainer = document.querySelector<HTMLDListElement>('#opening-hours');
if (hoursContainer) {
  hoursContainer.innerHTML = openingHours.map(({ day, hours }) => `<div><dt>${day}</dt><dd>${hours}</dd></div>`).join('');
}
