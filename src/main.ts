import './styles.css';
import { menuCategories } from './content/menu-content';
import { featuredDishes, openingHours, restaurant, reviewCategories } from './content/site-content';

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

  const categories =
    categoryId === 'all' ? menuCategories : menuCategories.filter((category) => category.id === categoryId);

  menuCategoriesContainer.innerHTML = categories
    .map(
      (category) => `
        <section class="menu-category" aria-labelledby="menu-${category.id}">
          <div class="menu-category-heading">
            <h3 id="menu-${category.id}">${category.name}</h3>
            <span>${category.items.length} ${category.items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div class="menu-item-grid">
            ${category.items
              .map(
                (item) => `
                  <article class="menu-item-card">
                    <div class="menu-item-title-row">
                      <h4>${item.name}</h4>
                      <strong>${item.price}</strong>
                    </div>
                    <p>${item.description}</p>
                    ${item.popular ? '<span class="popular-badge">Popular</span>' : ''}
                  </article>`,
              )
              .join('')}
          </div>
        </section>`,
    )
    .join('');
};

if (menuFilters) {
  menuFilters.innerHTML = menuCategories
    .map(
      (category) => `
        <button class="menu-filter" type="button" data-menu-filter="${category.id}" aria-pressed="false">
          ${category.name}
        </button>`,
    )
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

const reviewCategoriesContainer = document.querySelector<HTMLDivElement>('#review-categories');
if (reviewCategoriesContainer) {
  reviewCategoriesContainer.innerHTML = reviewCategories
    .map((category) => `<span class="category-pill">${category}</span>`)
    .join('');
}

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
  hoursContainer.innerHTML = openingHours
    .map(({ day, hours }) => `<div><dt>${day}</dt><dd>${hours}</dd></div>`)
    .join('');
}
