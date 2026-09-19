import './styles.css';
import { menuCategories } from './content/menu-content';
import { externalRatings, reviewGroups, verifiedTestimonials } from './content/review-content';
import { featuredDishes, openingHours, restaurant } from './content/site-content';

const dishesContainer = document.querySelector<HTMLDivElement>('#featured-dishes');
if (dishesContainer) {
  dishesContainer.innerHTML = featuredDishes
    .map(
      (dish) => `
        <article class="dish-card">
          <div class="dish-card-art" aria-hidden="true">✦</div>
          <div>
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
          </div>
        </article>`,
    )
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
          <div class="menu-category-heading">
            <h3 id="menu-${category.id}">${category.name}</h3>
            <span>${category.items.length} ${category.items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div class="menu-item-grid">
            ${category.items.map((item) => `
              <article class="menu-item-card">
                <div class="menu-item-title-row">
                  <h4>${item.name}</h4>
                  <strong>${item.price}</strong>
                </div>
                <p>${item.description}</p>
                ${item.popular ? '<span class="popular-badge">Popular</span>' : ''}
              </article>`).join('')}
          </div>
        </section>`,
    )
    .join('');
};

if (menuFilters) {
  menuFilters.innerHTML = menuCategories
    .map((category) => `<button class="menu-filter" type="button" data-menu-filter="${category.id}" aria-pressed="false">${category.name}</button>`)
    .join('');

  menuFilters.closest('.menu-toolbar')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const categoryId = target.dataset.menuFilter;
    if (!categoryId) return;

    target.closest('.menu-toolbar')?.querySelectorAll<HTMLButtonElement>('.menu-filter').forEach((button) => {
      const isActive = button === target;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    renderMenu(categoryId);
  });
}
renderMenu();

const externalRatingsContainer = document.querySelector<HTMLDivElement>('#external-ratings');
if (externalRatingsContainer) {
  externalRatingsContainer.innerHTML = externalRatings.map((rating) => `
    <article class="rating-card">
      <div>
        <span class="rating-platform">${rating.platform}</span>
        <strong>${rating.rating.toFixed(1)}<small> / ${rating.scale}</small></strong>
        <p>${rating.reviewCount} reviews</p>
      </div>
      <div>
        <a href="${rating.href}" target="_blank" rel="noreferrer">View on ${rating.platform} ↗</a>
        <small>Checked ${rating.checkedDate}</small>
      </div>
    </article>`).join('');
}

const reviewFilters = document.querySelector<HTMLDivElement>('#review-filters');
const reviewResults = document.querySelector<HTMLDivElement>('#review-results');

const renderReviews = (categoryId = reviewGroups[0].id) => {
  if (!reviewResults) return;
  const group = reviewGroups.find((item) => item.id === categoryId) ?? reviewGroups[0];
  const testimonials = verifiedTestimonials.filter((item) => item.category === group.id);

  if (testimonials.length === 0) {
    reviewResults.innerHTML = `
      <div class="review-empty-state">
        <span>${group.name}</span>
        <h4>Verified testimonials coming here.</h4>
        <p>${group.description}</p>
        <p>We only publish individual customer feedback after its source and wording have been verified.</p>
      </div>`;
    return;
  }

  reviewResults.innerHTML = testimonials.map((testimonial) => `
    <blockquote class="review-card">
      <p>“${testimonial.quote}”</p>
      <footer>${testimonial.customerName} · ${testimonial.source}</footer>
    </blockquote>`).join('');
};

if (reviewFilters) {
  reviewFilters.innerHTML = reviewGroups.map((group, index) => `
    <button class="review-filter${index === 0 ? ' is-active' : ''}" type="button" data-review-filter="${group.id}" aria-pressed="${index === 0}">${group.name}</button>`).join('');

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
