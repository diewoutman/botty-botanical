export function buildAssetUrl(assetPath: string, basePath: string = import.meta.env.BASE_URL): string {
  if (/^(https?:)?\/\//.test(assetPath) || assetPath.startsWith('data:')) {
    return assetPath;
  }

  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const normalizedPath = assetPath.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}
