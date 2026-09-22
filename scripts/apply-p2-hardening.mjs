import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/main.ts';
let source = readFileSync(path, 'utf8');

const replaceRange = (startMarker, endMarker, replacement) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Unable to find migration markers: ${startMarker} ... ${endMarker}`);
  }
  source = `${source.slice(0, start)}${replacement}\n\n${source.slice(end)}`;
};

const helpers = `type ElementOptions = {
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
};`;

source = source.replace(
  "const favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];",
  `${helpers}\n\nconst favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];`,
);

replaceRange(
  "const favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];",
  'const menuFilters =',
  `const favouriteNames = ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'];
const favouritesGrid = document.querySelector<HTMLDivElement>('#favourites-grid');
if (favouritesGrid) {
  const cards = favouriteNames.flatMap((name) => {
    const item = menuCategories.flatMap((category) => category.items).find((menuItem) => menuItem.name === name);
    const image = getMenuImage(name);
    if (!item || !image) return [];

    const article = createElement('article', { className: 'favourite-card' });
    const imageElement = createElement('img', {
      attributes: {
        src: \`${'${image}'}?fit=cover&format=auto&width=900&quality=88\`,
        alt: \`${'${name}'} from Masala Munch by Shreeji Food\`,
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
}`,
);

replaceRange(
  'const menuFilters =',
  'const cateringOccasionsContainer =',
  `const menuFilters = document.querySelector<HTMLDivElement>('#menu-filters');
const menuCategoriesContainer = document.querySelector<HTMLDivElement>('#menu-categories');

type MenuItem = { name: string; price: string; description: string; popular?: boolean };

const createMenuItemCard = (item: MenuItem) => {
  const image = getMenuImage(item.name);
  const article = createElement('article', { className: \`menu-item-card${'${image ? \' has-image\' : \'\'}'}\` });

  if (image) {
    article.append(
      createElement('img', {
        className: 'menu-item-image',
        attributes: {
          src: \`${'${image}'}?fit=cover&format=auto&width=640&quality=85\`,
          alt: \`${'${item.name}'} from Masala Munch by Shreeji Food\`,
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
      attributes: { 'aria-labelledby': \`menu-${'${category.id}'}\` },
    });
    const heading = createElement('div', { className: 'menu-category-heading' });
    const title = createElement('h3', { text: category.name });
    title.id = \`menu-${'${category.id}'}\`;
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
renderMenu();`,
);

replaceRange(
  'const cateringOccasionsContainer =',
  'const cateringPhoneLink =',
  `const cateringOccasionsContainer = document.querySelector<HTMLDivElement>('#catering-occasions');
if (cateringOccasionsContainer) {
  cateringOccasionsContainer.replaceChildren(
    ...cateringOccasions.map((occasion) => createElement('span', { className: 'occasion-pill', text: occasion.name })),
  );
}`,
);

replaceRange(
  'const ratingSummary =',
  'const address =',
  `const ratingSummary = document.querySelector<HTMLDivElement>('#external-ratings');
if (ratingSummary) {
  const cards = externalRatings.map((rating) => {
    const card = createElement('a', {
      className: \`rating-card rating-card--${'${rating.id}'}\`,
      attributes: {
        href: rating.href,
        target: '_blank',
        rel: 'noreferrer',
        'aria-label': \`View ${'${rating.platform}'} reviews\`,
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
      createElement('span', { className: 'rating-scale', text: \`/ ${'${rating.scale}'}\` }),
    );

    const footer = createElement('div', { className: 'rating-card-footer' });
    const footerCopy = createElement('div');
    footerCopy.append(
      createElement('b', { text: \`${'${rating.reviewCount}'} reviews\` }),
      createElement('small', { text: \`Checked ${'${rating.checkedDate}'}\` }),
    );
    footer.append(footerCopy);
    card.append(brand, score, footer);
    return card;
  });
  ratingSummary.replaceChildren(...cards);
}`,
);

replaceRange(
  'const visitMain =',
  'const phoneLink =',
  `const visitMain = document.querySelector<HTMLElement>('.visit-main');
if (visitMain) {
  const encodedMapQuery = encodeURIComponent(restaurant.mapQuery);
  const mapPreview = createElement('div', { className: 'visit-map' });
  const iframe = createElement('iframe', {
    attributes: {
      title: \`Map showing ${'${restaurant.shortName}'} on Fishponds Road\`,
      src: \`https://www.google.com/maps?q=${'${encodedMapQuery}'}&output=embed\`,
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
      'aria-label': \`Open directions to ${'${restaurant.shortName}'} in Google Maps\`,
    },
  });
  mapPreview.append(iframe, mapLink);
  visitMain.append(mapPreview);
}`,
);

replaceRange(
  'const hoursContainer =',
  'const openingStatus =',
  `const hoursContainer = document.querySelector<HTMLDListElement>('#opening-hours');
if (hoursContainer) {
  const rows = openingHours.map(({ day, hours }) => {
    const row = createElement('div');
    row.append(createElement('dt', { text: day }), createElement('dd', { text: hours }));
    return row;
  });
  hoursContainer.replaceChildren(...rows);
}`,
);

if (source.includes('innerHTML')) {
  throw new Error('P2 migration incomplete: innerHTML remains in src/main.ts');
}

writeFileSync(path, source);
