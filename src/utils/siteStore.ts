import type { SiteData } from '../types/site';

const DRAFT_KEY = 'moulu_admin_draft_v1';
const GH_CONFIG_KEY = 'moulu_github_publish_v1';

export interface GitHubPublishConfig {
  repo: string; // e.g. "usuario/moulu-cafe"
  branch: string; // e.g. "main"
  token: string;
}

export async function fetchPublishedSiteData(): Promise<SiteData> {
  const response = await fetch('./data/siteData.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('No se pudo cargar la configuración publicada.');
  }
  return (await response.json()) as SiteData;
}

export function loadDraftSiteData(): SiteData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SiteData) : null;
  } catch {
    return null;
  }
}

export function saveDraftSiteData(data: SiteData): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function clearDraftSiteData(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function loadGitHubConfig(): GitHubPublishConfig {
  try {
    const raw = localStorage.getItem(GH_CONFIG_KEY);
    return raw
      ? (JSON.parse(raw) as GitHubPublishConfig)
      : { repo: '', branch: 'main', token: '' };
  } catch {
    return { repo: '', branch: 'main', token: '' };
  }
}

export function saveGitHubConfig(cfg: GitHubPublishConfig): void {
  localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(cfg));
}

export function downloadSiteDataJson(data: SiteData): void {
  const finalData: SiteData = {
    ...data,
    version: (data.version || 1) + 1,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const blob = new Blob([JSON.stringify(finalData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'siteData.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function publishToGitHub(
  data: SiteData,
  cfg: GitHubPublishConfig
): Promise<{ commitUrl: string }> {
  const cleanRepo = cfg.repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
  if (!cleanRepo.includes('/') || !cfg.token.trim()) {
    throw new Error('Ingresa el repositorio (usuario/repo) y tu Token de GitHub.');
  }

  const path = 'public/data/siteData.json';
  const apiBase = `https://api.github.com/repos/${cleanRepo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${cfg.token.trim()}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  let sha: string | undefined;
  const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(cfg.branch || 'main')}`, {
    headers,
  });
  if (getRes.ok) {
    const existing = (await getRes.json()) as { sha?: string };
    sha = existing.sha;
  }

  const finalData: SiteData = {
    ...data,
    version: (data.version || 1) + 1,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const jsonString = JSON.stringify(finalData, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Publicar versión final del sitio (${finalData.updatedAt})`,
      content: encodedContent,
      branch: cfg.branch || 'main',
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errBody = await putRes.text();
    throw new Error(`Error al publicar en GitHub (${putRes.status}): ${errBody}`);
  }

  const result = (await putRes.json()) as { commit?: { html_url?: string } };
  return { commitUrl: result.commit?.html_url || `https://github.com/${cleanRepo}` };
}

