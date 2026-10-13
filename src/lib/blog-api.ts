export interface PostSeo {
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface Post {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  seo?: PostSeo | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PostsPaginationMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface PostsResponse {
  data: Post[];
  meta?: PostsPaginationMeta;
}

const DEFAULT_API_URL = "https://houstonitsecurity.net/api/v1/sites/albranprinting";

export function getApiBaseUrl(): string {
  const envUrl =
    import.meta.env.PUBLIC_API_URL ||
    (typeof process !== "undefined" ? process.env.PUBLIC_API_URL : undefined);
  return (envUrl || DEFAULT_API_URL)
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/posts\/?$/, "");
}

/**
 * Consulta la lista paginada de artículos a la API de Laravel / Filament.
 */
export async function getPosts(
  params: { page?: number; per_page?: number } = {}
): Promise<PostsResponse> {
  const baseUrl = getApiBaseUrl();
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 12;
  const url = `${baseUrl}/posts?per_page=${perPage}&page=${page}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      console.warn(`[Blog API] Error al obtener posts (${res.status} ${res.statusText}) de ${url}`);
      return {
        data: [],
        meta: { current_page: page, last_page: 1, per_page: perPage, total: 0 },
      };
    }

    const json = await res.json();

    if (Array.isArray(json)) {
      return {
        data: json,
        meta: { current_page: 1, last_page: 1, per_page: json.length, total: json.length },
      };
    }

    return {
      data: Array.isArray(json.data) ? json.data : [],
      meta: json.meta ?? {
        current_page: page,
        last_page: 1,
        per_page: perPage,
        total: Array.isArray(json.data) ? json.data.length : 0,
      },
    };
  } catch (error) {
    console.warn(`[Blog API] Error de red o parseo en ${url}:`, error);
    return {
      data: [],
      meta: { current_page: page, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}

/**
 * Consulta un post individual por su slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!slug) return null;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/posts/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const json = await res.json();
      return (json.data ?? json) as Post;
    }

    if (res.status === 404) {
      // Búsqueda de respaldo en el listado si la ruta individual varía
      const all = await getPosts({ per_page: 100 });
      const found = all.data.find((p) => p.slug === slug);
      return found ?? null;
    }

    console.warn(`[Blog API] Error al obtener post "${slug}" (${res.status} ${res.statusText})`);
    return null;
  } catch (error) {
    console.warn(`[Blog API] Error de red para el post "${slug}":`, error);
    return null;
  }
}

/**
 * Formatea fechas ISO-8601 (ej. "October 9, 2026").
 */
export function formatPostDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function normalizeHtmlContent(content?: string | null): string {
  if (!content) return "";
  let cleaned = content.trim();
  if (/&lt;\s*\/?\s*(p|h[1-6]|ul|ol|li|strong|em|b|i|a|br|hr|div|blockquote|span|img|table|tr|td|th)\b/i.test(cleaned)) {
    cleaned = cleaned
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&");
  }
  return cleaned;
}
