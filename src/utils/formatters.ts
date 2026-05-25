/**
 * Formats a date string (YYYY-MM-DD) into standard representation (D MMMM YYYY).
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, monthIdx, day);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${day} ${months[date.getMonth()]} ${year}`;
}

/**
 * Formats a field-building date range (YYYY-MM -> Month YYYY or ongoing -> Ongoing).
 */
export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'ongoing') return 'Ongoing';
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (isNaN(year) || isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) {
    return dateStr;
  }
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[monthIdx]} ${year}`;
}

/**
 * Translates start date strings to a comparable numeric rank for sorting.
 */
export function parseStartDateForSort(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  return (year || 0) * 100 + (month || 0);
}

/**
 * Bolds the site owner's name inside the list of publication authors.
 */
export function formatAuthors(authors: string[], owner: string = "Theo Farrell"): string {
  const [ownerFirst, ...ownerRest] = owner.split(' ');
  const ownerLast = ownerRest.at(-1) ?? '';
  return authors
    .map((a) => {
      const isOwner =
        a === owner ||
        (a.includes(ownerFirst) && a.includes(ownerLast));
      return isOwner ? `<strong>${a}</strong>` : a;
    })
    .join(', ');
}

/**
 * Converts standard markdown links [text](url) to styled HTML anchors.
 */
export function parseMarkdownLinks(text: string): string {
  if (!text) return '';
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="border-b border-rule hover:border-accent hover:text-accent transition-colors font-semibold" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
