export function normalizeUrlForHref(input: string): string {
  let value = input.trim();
  if (!value) return '';
  value = value
    .replace(/^https\/\/+/i, 'https://')
    .replace(/^http\/\/+/i, 'http://')
    .replace(/^https:\/(?!\/)/i, 'https://')
    .replace(/^http:\/(?!\/)/i, 'http://');
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

export function displayUrl(input: string): string {
  return normalizeUrlForHref(input)
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '');
}
