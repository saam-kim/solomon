const modules = import.meta.glob("../assets/illustrations/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const assetMap = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [path.split("/").pop() ?? path, url]),
);

export function assetUrl(file: string): string {
  const url = assetMap[file];
  if (!url) {
    console.warn(`Missing illustration asset: ${file}`);
    return "";
  }
  return url;
}
