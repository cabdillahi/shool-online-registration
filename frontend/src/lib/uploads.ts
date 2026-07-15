const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

/** Build absolute URL for a stored upload filename. */
export function getUploadUrl(filename?: string | null): string | null {
  if (!filename) return null;
  const clean = filename.replace(/^uploads\//, "").replace(/^\//, "");
  return `${API_ORIGIN}/uploads/${clean}`;
}

export function isImageFile(filename?: string | null): boolean {
  if (!filename) return false;
  return /\.(jpe?g|png|gif|webp|bmp)$/i.test(filename);
}

export function isPdfFile(filename?: string | null): boolean {
  if (!filename) return false;
  return /\.pdf$/i.test(filename);
}
