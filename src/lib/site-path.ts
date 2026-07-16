export function withSiteBasePath(
  assetPath: string,
  basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "",
) {
  const normalizedBasePath = basePath.replace(/\/$/, "");
  const normalizedAssetPath = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;

  return `${normalizedBasePath}${normalizedAssetPath}`;
}
