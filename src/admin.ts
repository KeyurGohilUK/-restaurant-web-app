import './admin.css';
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

const status = (message: string) => {
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

const configured = getSupabaseConfig();
if (!configured) {
  setupPanel?.removeAttribute('hidden');
  loginPanel?.setAttribute('hidden', '');
} else if (adminEmailInput && configured.adminEmail) {
  adminEmailInput.value = configured.adminEmail;
}

const saveSession = (token: string) => sessionStorage.setItem(sessionKey, token);
const clearSession = () => sessionStorage.removeItem(sessionKey);

const field = (label: string, name: string, value: unknown, type = 'text', extra = '') =>
  `<label>${escapeHtml(label)}<input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${extra} /></label>`;

const textarea = (label: string, name: string, value: unknown) =>
  `<label>${escapeHtml(label)}<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea></label>`;

const checkbox = (label: string, name: string, checked: boolean) =>
  `<label class="admin-check"><input name="${escapeHtml(name)}" type="checkbox" ${checked ? 'checked' : ''} />${escapeHtml(label)}</label>`;

const renderSite = () => {
  if (!adminContent || !content) return;
  const site = content.siteSettings;
  if (!site) {
    adminContent.innerHTML = '<div class="admin-empty">Site settings row is missing. Re-run the migration seed.</div>';
    return;
  }

  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Site & homepage</h2><p class="admin-muted">Contact details, homepage copy, imagery and temporary notices.</p></div></div>
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

  document.querySelector<HTMLFormElement>('#site-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!accessToken || !content?.siteSettings) return;
    const data = new FormData(event.currentTarget);
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
    await upsertRows('site_settings', next, accessToken);
    content.siteSettings = next;
    status('Site settings saved.');
  });
};

const renderHours = () => {
  if (!adminContent || !content) return;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Opening hours</h2><p class="admin-muted">Set regular opening times, closed days and optional notes.</p></div></div>
    <div class="admin-grid">${content.openingHours
      .map(
        (row) => `<form class="admin-card admin-form hours-form" data-day="${row.day_of_week}">
          <h3>${escapeHtml(row.day_name)}</h3>
          <div class="admin-row">${field('Opens', 'opens_at', row.opens_at?.slice(0, 5) ?? '', 'time')}${field('Closes', 'closes_at', row.closes_at?.slice(0, 5) ?? '', 'time')}</div>
          ${field('Note', 'note', row.note ?? '')}
          ${checkbox('Closed', 'is_closed', row.is_closed)}
          <div class="admin-actions"><button class="admin-primary" type="submit">Save ${escapeHtml(row.day_name)}</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelectorAll<HTMLFormElement>('.hours-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!content || !accessToken) return;
      const day = Number(form.dataset.day);
      const existing = content.openingHours.find((row) => row.day_of_week === day);
      if (!existing) return;
      const data = new FormData(form);
      const next: OpeningHourRecord = {
        ...existing,
        opens_at: String(data.get('opens_at') ?? '').trim() || null,
        closes_at: String(data.get('closes_at') ?? '').trim() || null,
        is_closed: data.get('is_closed') === 'on',
        note: String(data.get('note') ?? '').trim() || null,
      };
      await upsertRows('opening_hours', next, accessToken);
      Object.assign(existing, next);
      status(`${existing.day_name} saved.`);
    });
  });
};

const renderCategories = () => {
  if (!adminContent || !content) return;
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Menu categories</h2><p class="admin-muted">Rename, reorder, hide or add menu sections.</p></div><button id="add-category" class="admin-primary" type="button">Add category</button></div>
    <div class="admin-grid">${content.categories
      .map(
        (row) => `<form class="admin-card admin-form category-form" data-id="${escapeHtml(row.id)}">
          <div class="admin-row">${field('ID', 'id', row.id, 'text', 'readonly')}${field('Name', 'name', row.name)}</div>
          ${field('Order', 'sort_order', row.sort_order, 'number')}
          ${checkbox('Visible', 'is_active', row.is_active)}
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button><button class="admin-danger category-delete" type="button">Delete</button></div>
        </form>`,
      )
      .join('')}</div>`;

  const bind = () => {
    document.querySelectorAll<HTMLFormElement>('.category-form').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!content || !accessToken) return;
        const id = form.dataset.id ?? '';
        const existing = content.categories.find((row) => row.id === id);
        if (!existing) return;
        const data = new FormData(form);
        const next: MenuCategoryRecord = {
          ...existing,
          name: String(data.get('name') ?? ''),
          sort_order: Number(data.get('sort_order') ?? 0),
          is_active: data.get('is_active') === 'on',
        };
        await upsertRows('menu_categories', next, accessToken);
        Object.assign(existing, next);
        status('Category saved.');
      });
      form.querySelector<HTMLButtonElement>('.category-delete')?.addEventListener('click', async () => {
        if (!content || !accessToken) return;
        const id = form.dataset.id ?? '';
        if (!window.confirm('Delete this category and all items inside it?')) return;
        await deleteRow('menu_categories', 'id', id, accessToken);
        content.categories = content.categories.filter((row) => row.id !== id);
        content.items = content.items.filter((row) => row.category_id !== id);
        renderCategories();
        status('Category deleted.');
      });
    });
  };
  bind();

  document.querySelector<HTMLButtonElement>('#add-category')?.addEventListener('click', async () => {
    if (!content || !accessToken) return;
    const name = window.prompt('Category name');
    if (!name?.trim()) return;
    const id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const next: MenuCategoryRecord = { id, name: name.trim(), sort_order: content.categories.length * 10, is_active: true };
    const [created] = await insertRows<MenuCategoryRecord>('menu_categories', next, accessToken);
    content.categories.push(created ?? next);
    renderCategories();
    status('Category added.');
  });
};

const renderItems = () => {
  if (!adminContent || !content) return;
  const options = content.categories.map((row) => `<option value="${escapeHtml(row.id)}">${escapeHtml(row.name)}</option>`).join('');
  adminContent.innerHTML = `
    <div class="admin-section-head"><div><h2>Menu items</h2><p class="admin-muted">Manage prices, descriptions, visibility, images and homepage favourites.</p></div><button id="add-item" class="admin-primary" type="button">Add item</button></div>
    <div class="admin-grid">${content.items
      .map(
        (row) => `<form class="admin-card admin-form item-form" data-id="${row.id}">
          <div class="admin-row">${field('Name', 'name', row.name)}${field('Price', 'price', row.price)}</div>
          <label>Category<select name="category_id">${content!.categories.map((category) => `<option value="${escapeHtml(category.id)}" ${category.id === row.category_id ? 'selected' : ''}>${escapeHtml(category.name)}</option>`).join('')}</select></label>
          ${textarea('Description', 'description', row.description)}
          ${field('Image URL', 'image_url', row.image_url ?? '', 'url')}
          ${field('Order', 'sort_order', row.sort_order, 'number')}
          <div class="admin-row">${checkbox('Visible', 'is_active', row.is_active)}${checkbox('Featured on homepage', 'is_featured', row.is_featured)}</div>
          <div class="admin-actions"><button class="admin-primary" type="submit">Save</button><button class="admin-danger item-delete" type="button">Delete</button></div>
        </form>`,
      )
      .join('')}</div>`;

  document.querySelectorAll<HTMLFormElement>('.item-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
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
      await upsertRows('menu_items', next, accessToken);
      Object.assign(existing, next);
      status('Menu item saved.');
    });
    form.querySelector<HTMLButtonElement>('.item-delete')?.addEventListener('click', async () => {
      if (!content || !accessToken || !form.dataset.id) return;
      if (!window.confirm('Delete this menu item?')) return;
      await deleteRow('menu_items', 'id', form.dataset.id, accessToken);
      content.items = content.items.filter((row) => row.id !== form.dataset.id);
      renderItems();
      status('Menu item deleted.');
    });
  });

  document.querySelector<HTMLButtonElement>('#add-item')?.addEventListener('click', async () => {
    if (!content || !accessToken || content.categories.length === 0) return;
    const name = window.prompt('Item name');
    if (!name?.trim()) return;
    const next = {
      category_id: content.categories[0].id,
      name: name.trim(),
      description: '',
      price: '£0.00',
      image_url: null,
      sort_order: content.items.length * 10,
      is_active: true,
      is_featured: false,
    };
    const [created] = await insertRows<MenuItemRecord>('menu_items', next, accessToken);
    if (created) content.items.push(created);
    renderItems();
    status('Menu item added.');
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

  document.querySelectorAll<HTMLFormElement>('.review-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
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
      await upsertRows('reviews', next, accessToken);
      Object.assign(existing, next);
      status('Review saved.');
    });
    form.querySelector<HTMLButtonElement>('.review-delete')?.addEventListener('click', async () => {
      if (!content || !accessToken || !form.dataset.id) return;
      if (!window.confirm('Delete this review?')) return;
      await deleteRow('reviews', 'id', form.dataset.id, accessToken);
      content.reviews = content.reviews.filter((row) => row.id !== form.dataset.id);
      renderReviews();
      status('Review deleted.');
    });
  });

  document.querySelector<HTMLButtonElement>('#add-review')?.addEventListener('click', async () => {
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
    const [created] = await insertRows<ReviewRecord>('reviews', next, accessToken);
    if (created) content.reviews.push(created);
    renderReviews();
    status('Draft review added.');
  });
};

const renderActiveTab = () => {
  tabs?.querySelectorAll('button').forEach((button) => button.classList.toggle('is-active', button.getAttribute('data-tab') === activeTab));
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
    clearSession();
    accessToken = '';
    loginPanel?.removeAttribute('hidden');
    adminApp?.setAttribute('hidden', '');
  }
};

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!loginMessage) return;
  loginMessage.textContent = 'Signing in…';
  const data = new FormData(loginForm);
  try {
    const session = await signInAdmin(String(data.get('email') ?? ''), String(data.get('password') ?? ''));
    saveSession(session.access_token);
    loginMessage.textContent = '';
    await enterAdmin(session.access_token);
  } catch (error) {
    loginMessage.textContent = error instanceof Error ? error.message : 'Sign in failed.';
  }
});

signOutButton?.addEventListener('click', () => {
  clearSession();
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
  if (!(target instanceof HTMLButtonElement)) return;
  const tab = target.dataset.tab;
  if (!tab) return;
  activeTab = tab;
  renderActiveTab();
});

const existingToken = sessionStorage.getItem(sessionKey);
if (existingToken && configured) void enterAdmin(existingToken);
