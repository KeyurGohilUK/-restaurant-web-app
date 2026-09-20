import './styles.css';
import './about.css';
import './release.css';
import './media.css';
import './mobile-nav.css';
import './cookie-consent.css';
import './back-to-top';
import './cookie-consent';
import { cateringOccasions } from './content/catering-content';
import { getMenuImage, restaurantMedia } from './content/media-content';
import { menuCategories } from './content/menu-content';
import { externalRatings, reviewGroups, verifiedTestimonials } from './content/review-content';
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

primaryNavigation?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) setNavigationOpen(false);
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
          <div class="menu-category-heading"><h3 id="menu-${category.id}">${category.name}</h3><span>${category.items.length}</span></div>
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

const ratingSummary = document.querySelector<HTMLDivElement>('#external-ratings');
if (ratingSummary) {
  ratingSummary.innerHTML = externalRatings
    .map((rating) => `<article class="rating-card"><div><span class="rating-platform">${rating.platform}</span><strong>${rating.rating.toFixed(1)}<small> / ${rating.scale}</small></strong><p>${rating.reviewCount} reviews</p></div><div><a href="${rating.href}" target="_blank" rel="noreferrer">View ↗</a><small>Checked ${rating.checkedDate}</small></div></article>`)
    .join('');
}

const reviewFilters = document.querySelector<HTMLDivElement>('#review-filters');
const reviewResults = document.querySelector<HTMLDivElement>('#review-results');

const renderReviews = (categoryId: string = reviewGroups[0].id) => {
  if (!reviewResults) return;
  const group = reviewGroups.find((item) => item.id === categoryId) ?? reviewGroups[0];
  const testimonials = verifiedTestimonials.filter((item) => item.category === group.id);

  if (testimonials.length === 0) {
    reviewResults.innerHTML = `<div class="review-empty-state"><strong>${group.name}</strong><span>Verified feedback coming soon.</span></div>`;
    return;
  }

  reviewResults.innerHTML = testimonials
    .map((testimonial) => `<blockquote class="review-card"><p>“${testimonial.quote}”</p><footer>${testimonial.customerName} · ${testimonial.source}</footer></blockquote>`)
    .join('');
};

if (reviewFilters) {
  reviewFilters.innerHTML = reviewGroups
    .map((group, index) => `<button class="review-filter${index === 0 ? ' is-active' : ''}" type="button" data-review-filter="${group.id}" aria-pressed="${index === 0}">${group.name}</button>`)
    .join('');

  reviewFilters.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const categoryId = target.dataset.reviewFilter;
    if (!categoryId) return;

    reviewFilters.querySelectorAll<HTMLButtonElement>('.review-filter').forEach((button) => {
      const isActive = button === target;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    renderReviews(categoryId);
  });
}
renderReviews();

const address = document.querySelector<HTMLParagraphElement>('#restaurant-address');
if (address) address.textContent = restaurant.address;

const mapLink = document.querySelector<HTMLAnchorElement>('#map-link');
if (mapLink) mapLink.href = restaurant.mapHref;

const phoneLink = document.querySelector<HTMLAnchorElement>('#phone-link');
if (phoneLink) {
  phoneLink.href = restaurant.phoneHref;
  phoneLink.setAttribute('aria-label', `Call ${restaurant.shortName} on ${restaurant.phoneDisplay}`);
}

const hoursContainer = document.querySelector<HTMLDListElement>('#opening-hours');
if (hoursContainer) {
  hoursContainer.innerHTML = openingHours.map(({ day, hours }) => `<div><dt>${day}</dt><dd>${hours}</dd></div>`).join('');
}
