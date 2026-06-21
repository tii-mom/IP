export function normalizeUrlForHref(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function displayUrl(input: string): string {
  return normalizeUrlForHref(input).replace(/^https?:\/\//i, '').replace(/\/$/, '');
}
