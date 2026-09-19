import './styles.css';
import { featuredDishes, openingHours, restaurant, reviewCategories } from './content/site-content';

export const navigationItems = ['Home', 'Menu', 'Catering', 'Reviews', 'Contact'] as const;

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
