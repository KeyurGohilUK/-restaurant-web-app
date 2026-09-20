export type SupabaseConfig = {
  url: string;
  anonKey: string;
  adminEmail: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: { email?: string };
};

export type MenuCategoryRecord = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export type MenuItemRecord = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
};

export type OpeningHourRecord = {
  day_of_week: number;
  day_name: string;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
  note: string | null;
};

export type SiteSettingsRecord = {
  id: boolean;
  restaurant_name: string;
  short_name: string;
  tagline: string;
  address: string;
  phone_display: string;
  phone_href: string;
  map_href: string;
  hero_eyebrow: string;
  hero_heading: string;
  hero_intro: string;
  hero_image_url: string | null;
  catering_heading: string;
  catering_image_url: string | null;
  temporary_notice: string | null;
};

export type ReviewRecord = {
  id: string;
  category: 'restaurant' | 'catering' | 'events' | 'large-orders';
  quote: string;
  customer_name: string;
  source: string;
  source_href: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ManagedContent = {
  categories: MenuCategoryRecord[];
  items: MenuItemRecord[];
  openingHours: OpeningHourRecord[];
  siteSettings: SiteSettingsRecord | null;
  reviews: ReviewRecord[];
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getSupabaseConfig = (): SupabaseConfig | null => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
  if (!url || !anonKey) return null;
  return { url: trimTrailingSlash(url), anonKey, adminEmail: adminEmail ?? '' };
};

const request = async <T>(path: string, init: RequestInit = {}, accessToken?: string, prefer?: string): Promise<T> => {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');

  const headers = new Headers(init.headers);
  headers.set('apikey', config.anonKey);
  headers.set('Authorization', `Bearer ${accessToken ?? config.anonKey}`);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (prefer) headers.set('Prefer', prefer);

  const response = await fetch(`${config.url}${path}`, { ...init, headers });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed with status ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
};

export const signInAdmin = async (email: string, password: string) => {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');
  if (config.adminEmail && email.trim().toLowerCase() !== config.adminEmail) {
    throw new Error('This email is not configured as the administrator.');
  }

  const session = await request<AuthSession>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (config.adminEmail && session.user.email?.toLowerCase() !== config.adminEmail) {
    throw new Error('Authenticated user is not the configured administrator.');
  }
  return session;
};

export const loadManagedContent = async (accessToken?: string): Promise<ManagedContent> => {
  const [categories, items, openingHours, siteSettingsRows, reviews] = await Promise.all([
    request<MenuCategoryRecord[]>('/rest/v1/menu_categories?select=*&order=sort_order.asc', {}, accessToken),
    request<MenuItemRecord[]>('/rest/v1/menu_items?select=*&order=sort_order.asc', {}, accessToken),
    request<OpeningHourRecord[]>('/rest/v1/opening_hours?select=*&order=day_of_week.asc', {}, accessToken),
    request<SiteSettingsRecord[]>('/rest/v1/site_settings?select=*&limit=1', {}, accessToken),
    request<ReviewRecord[]>('/rest/v1/reviews?select=*&order=sort_order.asc', {}, accessToken),
  ]);

  return { categories, items, openingHours, siteSettings: siteSettingsRows[0] ?? null, reviews };
};

export const upsertRows = async <T extends object>(table: string, rows: T | T[], accessToken: string) =>
  request<T[]>(
    `/rest/v1/${table}?on_conflict=${table === 'site_settings' ? 'id' : table === 'opening_hours' ? 'day_of_week' : 'id'}`,
    {
      method: 'POST',
      body: JSON.stringify(rows),
    },
    accessToken,
    'resolution=merge-duplicates,return=representation',
  );

export const insertRows = async <T extends object>(table: string, rows: T | T[], accessToken: string) =>
  request<T[]>(
    `/rest/v1/${table}`,
    { method: 'POST', body: JSON.stringify(rows) },
    accessToken,
    'return=representation',
  );

export const deleteRow = async (table: string, column: string, value: string | number, accessToken: string) =>
  request<void>(
    `/rest/v1/${table}?${column}=eq.${encodeURIComponent(String(value))}`,
    { method: 'DELETE' },
    accessToken,
  );
