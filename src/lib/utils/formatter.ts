export function formatDate(
	dateInput: Date | string | number,
	options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}
): string {
	const date = new Date(dateInput);
	return new Intl.DateTimeFormat('id-ID', options).format(date);
}

export function formatArabicNumber(num: number): string {
	return new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(num);
}
