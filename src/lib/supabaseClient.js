import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_STORAGE_BUCKET = 'bella-skin';

export const fixStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  const u = url.trim();
  if (!u) return u;
  if (
    u.includes('/storage/v1/object/sign/') ||
    u.includes('/storage/v1/object/render/') ||
    u.includes('/storage/v1/object/authenticated/')
  ) {
    return u;
  }
  if (u.includes('/storage/v1/object/') && !u.includes('/storage/v1/object/public/')) {
    return u.replace('/storage/v1/object/', '/storage/v1/object/public/');
  }
  return u;
};

/** Full URL for <img src>: fixes Supabase storage, bare uploads/ paths, and site-relative paths. */
export const resolveImageUrl = (url) => {
  if (url == null || url === '') return '';
  const s = typeof url === 'string' ? url.trim() : String(url).trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return fixStorageUrl(s);
  if (s.startsWith('//')) return fixStorageUrl(`https:${s}`);
  if (s.startsWith('data:') || s.startsWith('blob:')) return s;

  const su = typeof supabaseUrl === 'string' ? supabaseUrl.trim().replace(/\/$/, '') : '';
  const noLeading = s.replace(/^\//, '');
  if (su && /^uploads\//.test(noLeading)) {
    return fixStorageUrl(`${su}/storage/v1/object/public/${DEFAULT_STORAGE_BUCKET}/${noLeading}`);
  }

  const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const path = s.startsWith('/') ? s : `/${s}`;
  return base ? `${base}${path}` : path;
};

/** Extra product images from DB: JSON array, JSON string, or newline/comma-separated URLs. */
export const normalizeGalleryUrls = (raw) => {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((u) => {
        if (typeof u === 'string') return u.trim();
        if (u && typeof u === 'object' && typeof u.url === 'string') return u.url.trim();
        return '';
      })
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t) return [];
    if (t.startsWith('[')) {
      try {
        const p = JSON.parse(t);
        return Array.isArray(p) ? normalizeGalleryUrls(p) : [];
      } catch {
        return [];
      }
    }
    return t.split(/[\n,]/).map((v) => v.trim()).filter(Boolean);
  }
  return [];
};
