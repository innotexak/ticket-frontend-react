export function cn(...inputs: any[]) {
  return inputs
    .filter(Boolean)
    .map(input => (typeof input === 'string' ? input : ''))
    .join(' ');
}
