import './admin.css';
import { getMenuImage } from './content/media-content';
import { menuCategories as bundledMenuCategories } from './content/menu-content';
import {
  deleteRow,
  getSupabaseConfig,
  insertRows,
  loadManagedContent,
  signInAdmin,
  upsertRows,
  type ManagedContent,
  type MenuCategoryRecord,
  type MenuItemRecord,
  type OpeningHourRecord,
  type ReviewRecord,
  type SiteSettingsRecord,
} from './infrastructure/supabase-api';

const setupPanel = document.querySelector<HTMLElement>('#admin-setup');
const loginPanel = document.querySelector<HTMLElement>('#admin-login');
const loginForm = document.querySelector<HTMLFormElement>('#admin-login-form');
const loginMessage = document.querySelector<HTMLElement>('#admin-login-message');
const adminEmailInput = document.querySelector<HTMLInputElement>('#admin-email');
const adminApp = document.querySelector<HTMLElement>('#admin-app');
const adminContent = document.querySelector<HTMLElement>('#admin-content');
const signOutButton = document.querySelector<HTMLButtonElement>('#admin-sign-out');
const tabs = document.querySelector<HTMLElement>('.admin-tabs');

const sessionKey = 'masala-munch-admin-session';
const configured = getSupabaseConfig();
let accessToken = '';
let content: ManagedContent | null = null;
let activeTab = 'site';

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const field = (label: string, name: string, value: unknown, type = 'text', extra = '') =>
  `<label>${escapeHtml(label)}<input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${extra} /></label>`;

const textarea = (label: string, name: string, value: unknown) =>
  `<label>${escapeHtml(label)}<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea></label>`;

const checkbox = (label: string, name: string, checked: boolean) =>
  `<label class="admin-check"><input name="${escapeHtml(name)}" type="checkbox" ${checked ? 'checked' : ''} />${escapeHtml(label)}</label>`;

const showStatus = (message: string) => {
  let element = document.querySelector<HTMLElement>('#admin-status');
  if (!element) {
    element = document.createElement('div');
    element.id = 'admin-status';
    element.className = 'admin-status';
    adminApp?.append(element);
  }
  element.textContent = message;
  window.setTimeout(() => {
    if (element?.textContent === message) element.textContent = '';
  }, 2800);
};

const runAction = async (action: () => Promise<void>, successMessage: string) => {
  try {
    await action();
    showStatus(successMessage);
  } catch (error) {
    showStatus(error instanceof Error ? error.message : 'Action failed.');
  }
};

if (!configured) {
  setupPanel?.removeAttribute('hidden');
  loginPanel?.setAttribute('hidden', '');
} else if (adminEmailInput && configured.adminEmail) {
  adminEmailInput.value = configured.adminEmail;
}

const renderSite = () => {
  if (!adminContent || !content?.siteSettings) return;
  const site = content.siteSettings;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Site & homepage</h2><p class="admin-muted">Contact details, homepage copy, images and temporary notices.</p></div></div>
    <form id="site-form" class="admin-card admin-form">
      <div class="admin-row">${field('Restaurant name', 'restaurant_name', site.restaurant_name)}${field('Short name', 'short_name', site.short_name)}</div>
      ${textarea('Tagline', 'tagline', site.tagline)}
      ${textarea('Address', 'address', site.address)}
      <div class="admin-row">${field('Phone display', 'phone_display', site.phone_display)}${field('Phone link', 'phone_href', site.phone_href)}</div>
      ${field('Map link', 'map_href', site.map_href, 'url')}
      <div class="admin-row">${field('Hero eyebrow', 'hero_eyebrow', site.hero_eyebrow)}${field('Hero heading', 'hero_heading', site.hero_heading)}</div>
      ${textarea('Hero intro', 'hero_intro', site.hero_intro)}
      ${field('Hero image URL', 'hero_image_url', site.hero_image_url ?? '', 'url')}
      ${field('Catering heading', 'catering_heading', site.catering_heading)}
      ${field('Catering image URL', 'catering_image_url', site.catering_image_url ?? '', 'url')}
      ${textarea('Temporary notice', 'temporary_notice', site.temporary_notice ?? '')}
      <div class="admin-actions"><button class="admin-primary" type="submit">Save site settings</button></div>
    </form>`;

  const form = document.querySelector<HTMLFormElement>('#site-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!content?.siteSettings || !accessToken) return;
    const data = new FormData(form);
    const next: SiteSettingsRecord = {
      ...content.siteSettings,
      restaurant_name: String(data.get('restaurant_name') ?? ''),
      short_name: String(data.get('short_name') ?? ''),
      tagline: String(data.get('tagline') ?? ''),
      address: String(data.get('address') ?? ''),
      phone_display: String(data.get('phone_display') ?? ''),
      phone_href: String(data.get('phone_href') ?? ''),
      map_href: String(data.get('map_href') ?? ''),
      hero_eyebrow: String(data.get('hero_eyebrow') ?? ''),
      hero_heading: String(data.get('hero_heading') ?? ''),
      hero_intro: String(data.get('hero_intro') ?? ''),
      hero_image_url: String(data.get('hero_image_url') ?? '').trim() || null,
      catering_heading: String(data.get('catering_heading') ?? ''),
      catering_image_url: String(data.get('catering_image_url') ?? '').trim() || null,
      temporary_notice: String(data.get('temporary_notice') ?? '').trim() || null,
    };
    void runAction(async () => {
      await upsertRows('site_settings', next, accessToken);
      if (content) content.siteSettings = next;
    }, 'Site settings saved.');
  });
};

const renderHours = () => {
  if (!adminContent || !content) return;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Opening hours</h2><p class="admin-muted">Set regular times, closed days and optional notes.</p></div></div>
    <div class="admin-grid">${content.openingHours
      .map(
        (row) => `<form class="admin-card admin-form hours-form" data-day="${row.day_of_week}">
          <h3>${escapeHtml(row.day_name)}</h3>
          <div class="admin-row">${field('Opens', 'opens_at', row.opens_at?.slice(0, 5) ?? '', 'time')}${field('Closes', 'closes_at', row.closes_at?.slice(0, 5) ?? '', 'time')}</div>
          ${field('Note', 'note', row.note ?? '')}
          ${checkbox('Closed', 'is_closed', row.is_closed)}
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelectorAll<HTMLFormElement>('.hours-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!content || !accessToken) return;
      const existing = content.openingHours.find((row) => row.day_of_week === Number(form.dataset.day));
      if (!existing) return;
      const data = new FormData(form);
      const next: OpeningHourRecord = {
        ...existing,
        opens_at: String(data.get('opens_at') ?? '').trim() || null,
        closes_at: String(data.get('closes_at') ?? '').trim() || null,
        note: String(data.get('note') ?? '').trim() || null,
        is_closed: data.get('is_closed') === 'on',
      };
      void runAction(async () => {
        await upsertRows('opening_hours', next, accessToken);
        Object.assign(existing, next);
      }, `${existing.day_name} saved.`);
    });
  });
};

const importBundledMenu = async () => {
  if (!content || !accessToken) return;
  const categories: MenuCategoryRecord[] = bundledMenuCategories.map((category, index) => ({
    id: category.id,
    name: category.name,
    sort_order: index * 10,
    is_active: true,
  }));
  await upsertRows('menu_categories', categories, accessToken);

  const items = bundledMenuCategories.flatMap((category) =>
    category.items.map((item, index) => ({
      category_id: category.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: getMenuImage(item.name) ?? null,
      sort_order: index * 10,
      is_active: true,
      is_featured: ['Samosa Chaat', 'Dahi Puri', 'Mattar Paneer'].includes(item.name),
    })),
  );
  await insertRows<MenuItemRecord>('menu_items', items, accessToken);
  content = await loadManagedContent(accessToken);
};

const renderCategories = () => {
  if (!adminContent || !content) return;
  const importButton = content.categories.length === 0
    ? '<button id="import-menu" class="admin-secondary" type="button">Import current menu</button>'
    : '';
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Menu categories</h2><p class="admin-muted">Rename, reorder, hide or add menu sections.</p></div><div class="admin-actions">${importButton}<button id="add-category" class="admin-primary" type="button">Add category</button></div></div>
    <div class="admin-grid">${content.categories.length === 0 ? '<div class="admin-empty">No managed categories yet. Import the current menu or add one.</div>' : content.categories
      .map(
        (row) => `<form class="admin-card admin-form category-form" data-id="${escapeHtml(row.id)}">
          <div class="admin-row">${field('ID', 'id', row.id, 'text', 'readonly')}${field('Name', 'name', row.name)}</div>
          ${field('Order', 'sort_order', row.sort_order, 'number')}
          ${checkbox('Visible', 'is_active', row.is_active)}
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button><button class="admin-danger category-delete" type="button">Delete</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelector<HTMLButtonElement>('#import-menu')?.addEventListener('click', () => {
    void runAction(async () => {
      await importBundledMenu();
      renderCategories();
    }, 'Current menu imported.');
  });

  document.querySelector<HTMLButtonElement>('#add-category')?.addEventListener('click', () => {
    if (!content || !accessToken) return;
    const name = window.prompt('Category name')?.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const next: MenuCategoryRecord = {
      id,
      name,
      sort_order: content.categories.length * 10,
      is_active: true,
    };
    void runAction(async () => {
      const [created] = await insertRows<MenuCategoryRecord>('menu_categories', next, accessToken);
      content?.categories.push(created ?? next);
      renderCategories();
    }, 'Category added.');
  });

  document.querySelectorAll<HTMLFormElement>('.category-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!content || !accessToken) return;
      const existing = content.categories.find((row) => row.id === form.dataset.id);
      if (!existing) return;
      const data = new FormData(form);
      const next: MenuCategoryRecord = {
        ...existing,
        name: String(data.get('name') ?? ''),
        sort_order: Number(data.get('sort_order') ?? 0),
        is_active: data.get('is_active') === 'on',
      };
      void runAction(async () => {
        await upsertRows('menu_categories', next, accessToken);
        Object.assign(existing, next);
      }, 'Category saved.');
    });

    form.querySelector<HTMLButtonElement>('.category-delete')?.addEventListener('click', () => {
      if (!content || !accessToken || !form.dataset.id) return;
      if (!window.confirm('Delete this category and all of its menu items?')) return;
      const id = form.dataset.id;
      void runAction(async () => {
        await deleteRow('menu_categories', 'id', id, accessToken);
        if (!content) return;
        content.categories = content.categories.filter((row) => row.id !== id);
        content.items = content.items.filter((row) => row.category_id !== id);
        renderCategories();
      }, 'Category deleted.');
    });
  });
};

const renderItems = () => {
  if (!adminContent || !content) return;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Menu items</h2><p class="admin-muted">Manage prices, descriptions, visibility, images and homepage favourites.</p></div><button id="add-item" class="admin-primary" type="button">Add item</button></div>
    <div class="admin-grid">${content.items.length === 0 ? '<div class="admin-empty">No managed menu items yet.</div>' : content.items
      .map(
        (row) => `<form class="admin-card admin-form item-form" data-id="${row.id}">
          <div class="admin-row">${field('Name', 'name', row.name)}${field('Price', 'price', row.price)}</div>
          <label>Category<select name="category_id">${content!.categories
            .map((category) => `<option value="${escapeHtml(category.id)}" ${category.id === row.category_id ? 'selected' : ''}>${escapeHtml(category.name)}</option>`)
            .join('')}</select></label>
          ${textarea('Description', 'description', row.description)}
          ${field('Image URL', 'image_url', row.image_url ?? '', 'url')}
          ${field('Order', 'sort_order', row.sort_order, 'number')}
          <div class="admin-row">${checkbox('Visible', 'is_active', row.is_active)}${checkbox('Featured on homepage', 'is_featured', row.is_featured)}</div>
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button><button class="admin-danger item-delete" type="button">Delete</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelector<HTMLButtonElement>('#add-item')?.addEventListener('click', () => {
    if (!content || !accessToken || content.categories.length === 0) {
      showStatus('Add a category first.');
      return;
    }
    const name = window.prompt('Item name')?.trim();
    if (!name) return;
    const next = {
      category_id: content.categories[0].id,
      name,
      description: '',
      price: '£0.00',
      image_url: null,
      sort_order: content.items.length * 10,
      is_active: true,
      is_featured: false,
    };
    void runAction(async () => {
      const [created] = await insertRows<MenuItemRecord>('menu_items', next, accessToken);
      if (created) content?.items.push(created);
      renderItems();
    }, 'Menu item added.');
  });

  document.querySelectorAll<HTMLFormElement>('.item-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!content || !accessToken) return;
      const existing = content.items.find((row) => row.id === form.dataset.id);
      if (!existing) return;
      const data = new FormData(form);
      const next: MenuItemRecord = {
        ...existing,
        name: String(data.get('name') ?? ''),
        price: String(data.get('price') ?? ''),
        category_id: String(data.get('category_id') ?? ''),
        description: String(data.get('description') ?? ''),
        image_url: String(data.get('image_url') ?? '').trim() || null,
        sort_order: Number(data.get('sort_order') ?? 0),
        is_active: data.get('is_active') === 'on',
        is_featured: data.get('is_featured') === 'on',
      };
      void runAction(async () => {
        await upsertRows('menu_items', next, accessToken);
        Object.assign(existing, next);
      }, 'Menu item saved.');
    });

    form.querySelector<HTMLButtonElement>('.item-delete')?.addEventListener('click', () => {
      if (!content || !accessToken || !form.dataset.id) return;
      if (!window.confirm('Delete this menu item?')) return;
      const id = form.dataset.id;
      void runAction(async () => {
        await deleteRow('menu_items', 'id', id, accessToken);
        if (content) content.items = content.items.filter((row) => row.id !== id);
        renderItems();
      }, 'Menu item deleted.');
    });
  });
};

const renderReviews = () => {
  if (!adminContent || !content) return;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Reviews</h2><p class="admin-muted">Only publish reviews you have permission to reproduce.</p></div><button id="add-review" class="admin-primary" type="button">Add review</button></div>
    <div class="admin-grid">${content.reviews.length === 0 ? '<div class="admin-empty">No managed reviews yet.</div>' : content.reviews
      .map(
        (row) => `<form class="admin-card admin-form review-form" data-id="${row.id}">
          <label>Category<select name="category"><option value="restaurant" ${row.category === 'restaurant' ? 'selected' : ''}>Restaurant</option><option value="catering" ${row.category === 'catering' ? 'selected' : ''}>Catering</option><option value="events" ${row.category === 'events' ? 'selected' : ''}>Events</option><option value="large-orders" ${row.category === 'large-orders' ? 'selected' : ''}>Large orders</option></select></label>
          ${textarea('Review', 'quote', row.quote)}
          <div class="admin-row">${field('Customer name', 'customer_name', row.customer_name)}${field('Source', 'source', row.source)}</div>
          ${field('Source URL', 'source_href', row.source_href ?? '', 'url')}
          ${field('Order', 'sort_order', row.sort_order, 'number')}
          ${checkbox('Visible', 'is_active', row.is_active)}
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button><button class="admin-danger review-delete" type="button">Delete</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelector<HTMLButtonElement>('#add-review')?.addEventListener('click', () => {
    if (!content || !accessToken) return;
    const next = {
      category: 'restaurant' as const,
      quote: 'New review',
      customer_name: 'Customer',
      source: 'First-party',
      source_href: null,
      sort_order: content.reviews.length * 10,
      is_active: false,
    };
    void runAction(async () => {
      const [created] = await insertRows<ReviewRecord>('reviews', next, accessToken);
      if (created) content?.reviews.push(created);
      renderReviews();
    }, 'Draft review added.');
  });

  document.querySelectorAll<HTMLFormElement>('.review-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!content || !accessToken) return;
      const existing = content.reviews.find((row) => row.id === form.dataset.id);
      if (!existing) return;
      const data = new FormData(form);
      const next: ReviewRecord = {
        ...existing,
        category: String(data.get('category')) as ReviewRecord['category'],
        quote: String(data.get('quote') ?? ''),
        customer_name: String(data.get('customer_name') ?? ''),
        source: String(data.get('source') ?? ''),
        source_href: String(data.get('source_href') ?? '').trim() || null,
        sort_order: Number(data.get('sort_order') ?? 0),
        is_active: data.get('is_active') === 'on',
      };
      void runAction(async () => {
        await upsertRows('reviews', next, accessToken);
        Object.assign(existing, next);
      }, 'Review saved.');
    });

    form.querySelector<HTMLButtonElement>('.review-delete')?.addEventListener('click', () => {
      if (!content || !accessToken || !form.dataset.id) return;
      if (!window.confirm('Delete this review?')) return;
      const id = form.dataset.id;
      void runAction(async () => {
        await deleteRow('reviews', 'id', id, accessToken);
        if (content) content.reviews = content.reviews.filter((row) => row.id !== id);
        renderReviews();
      }, 'Review deleted.');
    });
  });
};

const renderActiveTab = () => {
  tabs?.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('is-active', button.getAttribute('data-tab') === activeTab);
  });
  if (activeTab === 'site') renderSite();
  if (activeTab === 'hours') renderHours();
  if (activeTab === 'categories') renderCategories();
  if (activeTab === 'items') renderItems();
  if (activeTab === 'reviews') renderReviews();
};

const enterAdmin = async (token: string) => {
  accessToken = token;
  try {
    content = await loadManagedContent(accessToken);
    loginPanel?.setAttribute('hidden', '');
    adminApp?.removeAttribute('hidden');
    signOutButton?.removeAttribute('hidden');
    renderActiveTab();
  } catch {
    sessionStorage.removeItem(sessionKey);
    accessToken = '';
    loginPanel?.removeAttribute('hidden');
    adminApp?.setAttribute('hidden', '');
  }
};

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!loginMessage) return;
  loginMessage.textContent = 'Signing in…';
  const data = new FormData(loginForm);
  void (async () => {
    try {
      const session = await signInAdmin(String(data.get('email') ?? ''), String(data.get('password') ?? ''));
      sessionStorage.setItem(sessionKey, session.access_token);
      loginMessage.textContent = '';
      await enterAdmin(session.access_token);
    } catch (error) {
      loginMessage.textContent = error instanceof Error ? error.message : 'Sign in failed.';
    }
  })();
});

signOutButton?.addEventListener('click', () => {
  sessionStorage.removeItem(sessionKey);
  accessToken = '';
  content = null;
  adminApp?.setAttribute('hidden', '');
  signOutButton.setAttribute('hidden', '');
  loginPanel?.removeAttribute('hidden');
  loginForm?.reset();
  if (adminEmailInput && configured?.adminEmail) adminEmailInput.value = configured.adminEmail;
});

tabs?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.tab) return;
  activeTab = target.dataset.tab;
  renderActiveTab();
});

const existingToken = sessionStorage.getItem(sessionKey);
if (existingToken && configured) void enterAdmin(existingToken);
