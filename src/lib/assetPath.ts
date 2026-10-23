/** Prefix local public assets when the site is hosted under a GitHub Pages path. */
export function assetPath(path: string): string {
  if (/^(?:https?:|data:|blob:|\/\/)/i.test(path)) return path;
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const localPath = `/${path.replace(/^\/+/, '')}`;
  if (basePath && (localPath === basePath || localPath.startsWith(`${basePath}/`))) return localPath;
  return `${basePath}${localPath}`;
}
