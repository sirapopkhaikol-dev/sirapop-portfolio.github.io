// GitHub project Pages use a repository subdirectory. Local and root hosting
// leave this setting empty; Next inlines it into the client at build time.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export function sitePath(value: string) {
  if (!basePath || !value.startsWith("/") || value.startsWith("//")) return value;
  if (value === basePath || value.startsWith(basePath + "/")) return value;
  return basePath + value;
}

export function withoutBasePath(value: string) {
  if (basePath && value === basePath) return "/";
  return basePath && value.startsWith(basePath + "/") ? value.slice(basePath.length) : value;
}
