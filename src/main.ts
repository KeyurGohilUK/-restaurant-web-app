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
import { menuCategories as staticMenuCategories, type MenuCategory } from './content/menu-content';
import { externalRatings, reviewGroups, verifiedTestimonials } from './content/review-content';
import { openingHours as staticOpeningHours, restaurant as staticRestaurant } from './content/site-content';
import { getSupabaseConfig, loadManagedContent, type ReviewRecord } from './infrastructure/supabase-api';

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const navToggle = document.querySelector<HTMLButtonElement>('#nav-toggle');
const primaryNavigation = document.querySelector<HTMLElement>('#primary-navigation');
const phoneNavigation = window.matchMedia('(max-width: 40rem)');

const setNavigationOpen = (isOpen: boolean) => {
  if (!navToggle || !primaryNavigation) return;
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  primaryNavigation.classList.toggle('is-open', isOpen);
};

navToggle?.addEventListener('click', () => setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true'));
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

let menuCategories: readonly MenuCategory[] = staticMenuCategories;
let managedItemImages = new Map<string, string>();
let featuredNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];
let currentRestaurant = { ...staticRestaurant };
let currentOpeningHours: { day: string; hours: string }[] = [...staticOpeningHours];
let managedReviews: ReviewRecord[] = [];

const favouritesGrid = document.querySelector<HTMLDivElement>('#favourites-grid');
const menuFilters = document.querySelector<HTMLDivElement>('#menu-filters');
const menuCategoriesContainer = document.querySelector<HTMLDivElement>('#menu-categories');
const reviewFilters = document.querySelector<HTMLDivElement>('#review-filters');
const reviewResults = document.querySelector<HTMLDivElement>('#review-results');
const address = document.querySelector<HTMLParagraphElement>('#restaurant-address');
const mapLink = document.querySelector<HTMLAnchorElement>('#map-link');
const phoneLink = document.querySelector<HTMLAnchorElement>('#phone-link');
const cateringPhoneLink = document.querySelector<HTMLAnchorElement>('#catering-phone-link');
const dietaryPhoneLink = document.querySelector<HTMLAnchorElement>('#dietary-phone-link');
const hoursContainer = document.querySelector<HTMLDListElement>('#opening-hours');

const imageForItem = (name: string) => managedItemImages.get(name) || getMenuImage(name);

const renderFavourites = () => {
  if (!favouritesGrid) return;
  favouritesGrid.innerHTML = featuredNames
    .map((name) => {
      const item = menuCategories.flatMap((category) => category.items).find((menuItem) => menuItem.name === name);
      const image = imageForItem(name);
      if (!item || !image) return '';
      return `<article class="favourite-card">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)} from ${escapeHtml(currentRestaurant.name)}" loading="lazy" decoding="async" />
        <div><h3>${escapeHtml(name)}</h3><strong>${escapeHtml(item.price)}</strong></div>
      </article>`;
    })
    .join('');
};

const renderMenu = (categoryId = 'all') => {
  if (!menuCategoriesContainer) return;
  const categories = categoryId === 'all' ? menuCategories : menuCategories.filter((category) => category.id === categoryId);
  menuCategoriesContainer.innerHTML = categories
    .map(
      (category) => `<section class="menu-category" aria-labelledby="menu-${escapeHtml(category.id)}">
        <div class="menu-category-heading"><h3 id="menu-${escapeHtml(category.id)}">${escapeHtml(category.name)}</h3></div>
        <div class="menu-item-grid">${category.items
          .map((item) => {
            const image = imageForItem(item.name);
            return `<article class="menu-item-card${image ? ' has-image' : ''}">
              ${image ? `<img class="menu-item-image" src="${escapeHtml(image)}" alt="${escapeHtml(item.name)} from ${escapeHtml(currentRestaurant.name)}" loading="lazy" decoding="async" />` : ''}
              <div class="menu-item-card-copy"><div class="menu-item-title-row"><h4>${escapeHtml(item.name)}</h4><strong>${escapeHtml(item.price)}</strong></div><p>${escapeHtml(item.description)}</p></div>
            </article>`;
          })
          .join('')}</div>
      </section>`,
    )
    .join('');
};

const renderMenuFilters = () => {
  if (!menuFilters) return;
  menuFilters.innerHTML = menuCategories
    .map((category) => `<button class="menu-filter" type="button" data-menu-filter="${escapeHtml(category.id)}" aria-pressed="false">${escapeHtml(category.name)}</button>`)
    .join('');
};

if (menuFilters) {
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

const renderReviews = (categoryId: string = reviewGroups[0].id) => {
  if (!reviewResults) return;
  const group = reviewGroups.find((item) => item.id === categoryId) ?? reviewGroups[0];
  const managed = managedReviews.filter((item) => item.category === group.id && item.is_active);
  const testimonials = managed.length > 0
    ? managed.map((item) => ({ quote: item.quote, customerName: item.customer_name, source: item.source }))
    : verifiedTestimonials.filter((item) => item.category === group.id);
  if (testimonials.length === 0) {
    reviewResults.innerHTML = `<div class="review-empty-state"><strong>${escapeHtml(group.name)}</strong><span>Verified feedback coming soon.</span></div>`;
    return;
  }
  reviewResults.innerHTML = testimonials
    .map((testimonial) => `<blockquote class="review-card"><p>“${escapeHtml(testimonial.quote)}”</p><footer>${escapeHtml(testimonial.customerName)} · ${escapeHtml(testimonial.source)}</footer></blockquote>`)
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

const renderContact = () => {
  if (address) address.textContent = currentRestaurant.address;
  if (mapLink) mapLink.href = currentRestaurant.mapHref;
  if (phoneLink) {
    phoneLink.href = currentRestaurant.phoneHref;
    phoneLink.setAttribute('aria-label', `Call ${currentRestaurant.shortName} on ${currentRestaurant.phoneDisplay}`);
  }
  if (cateringPhoneLink) {
    cateringPhoneLink.href = currentRestaurant.phoneHref;
    cateringPhoneLink.setAttribute('aria-label', `Call ${currentRestaurant.shortName} about catering on ${currentRestaurant.phoneDisplay}`);
  }
  if (dietaryPhoneLink) {
    dietaryPhoneLink.href = currentRestaurant.phoneHref;
    dietaryPhoneLink.setAttribute('aria-label', `Call ${currentRestaurant.shortName} about allergies or dietary requirements on ${currentRestaurant.phoneDisplay}`);
  }
  if (hoursContainer) {
    hoursContainer.innerHTML = currentOpeningHours.map(({ day, hours }) => `<div><dt>${escapeHtml(day)}</dt><dd>${escapeHtml(hours)}</dd></div>`).join('');
  }
};

const cateringOccasionsContainer = document.querySelector<HTMLDivElement>('#catering-occasions');
if (cateringOccasionsContainer) {
  cateringOccasionsContainer.innerHTML = cateringOccasions.map((occasion) => `<span class="occasion-pill">${escapeHtml(occasion.name)}</span>`).join('');
}
const ratingSummary = document.querySelector<HTMLDivElement>('#external-ratings');
if (ratingSummary) {
  ratingSummary.innerHTML = externalRatings
    .map((rating) => `<article class="rating-card"><div><span class="rating-platform">${rating.platform}</span><strong>${rating.rating.toFixed(1)}<small> / ${rating.scale}</small></strong><p>${rating.reviewCount} reviews</p></div><div><a href="${rating.href}" target="_blank" rel="noreferrer">View ↗</a><small>Checked ${rating.checkedDate}</small></div></article>`)
    .join('');
}

renderFavourites();
renderMenuFilters();
renderMenu();
renderReviews();
renderContact();

const hydrateManagedContent = async () => {
  if (!getSupabaseConfig()) return;
  try {
    const managed = await loadManagedContent();
    const activeCategories = managed.categories.filter((category) => category.is_active);
    const activeItems = managed.items.filter((item) => item.is_active);
    if (activeCategories.length > 0) {
      managedItemImages = new Map(activeItems.filter((item) => item.image_url).map((item) => [item.name, item.image_url as string]));
      menuCategories = activeCategories.map((category) => ({
        id: category.id,
        name: category.name,
        items: activeItems
          .filter((item) => item.category_id === category.id)
          .map((item) => ({ name: item.name, price: item.price, description: item.description })),
      }));
      const featured = activeItems.filter((item) => item.is_featured).map((item) => item.name);
      if (featured.length > 0) featuredNames = featured.slice(0, 6);
    }

    if (managed.openingHours.length > 0) {
      currentOpeningHours = managed.openingHours.map((row) => ({
        day: row.day_name,
        hours: row.is_closed ? row.note || 'Closed' : `${row.opens_at?.slice(0, 5) ?? ''}–${row.closes_at?.slice(0, 5) ?? ''}${row.note ? ` · ${row.note}` : ''}`,
      }));
    }

    if (managed.siteSettings) {
      const site = managed.siteSettings;
      currentRestaurant = {
        name: site.restaurant_name,
        shortName: site.short_name,
        tagline: site.tagline,
        address: site.address,
        phoneDisplay: site.phone_display,
        phoneHref: site.phone_href,
        mapHref: site.map_href,
      };
      const heroEyebrow = document.querySelector<HTMLElement>('.hero-eyebrow');
      const heroHeading = document.querySelector<HTMLElement>('#hero-title');
      const heroIntro = document.querySelector<HTMLElement>('.hero-intro');
      const cateringHeading = document.querySelector<HTMLElement>('#catering-title');
      if (heroEyebrow) heroEyebrow.textContent = site.hero_eyebrow;
      if (heroHeading) heroHeading.textContent = site.hero_heading;
      if (heroIntro) heroIntro.textContent = site.hero_intro;
      if (cateringHeading) cateringHeading.textContent = site.catering_heading;
      if (heroFoodImage && site.hero_image_url) heroFoodImage.src = site.hero_image_url;
      if (cateringImage && site.catering_image_url) cateringImage.src = site.catering_image_url;
      if (site.temporary_notice) {
        const notice = document.createElement('p');
        notice.className = 'site-notice';
        notice.textContent = site.temporary_notice;
        document.querySelector('.site-header')?.insertAdjacentElement('afterend', notice);
      }
    }

    managedReviews = managed.reviews;
    renderFavourites();
    renderMenuFilters();
    renderMenu();
    renderReviews();
    renderContact();
  } catch (error) {
    console.warn('Managed content unavailable; using bundled fallback content.', error);
  }
};

void hydrateManagedContent();
