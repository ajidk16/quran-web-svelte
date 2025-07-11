import type { DetailQuranDto, Surah } from './types';

export interface SurahResponse {
	code: number;
	message: string;
	data: Surah[];
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function fetchAllSurah(): Promise<Surah[]> {
	const res = await fetch(`${baseUrl}/surat`);
	if (!res.ok) throw new Error('Failed to fetch surah');
	const json: SurahResponse = await res.json();
	console.log('fetchAllSurah', json);
	return json.data;
}

export async function fetchSurahBySlug(slug: string): Promise<DetailQuranDto> {
	const res = await fetch(`${baseUrl}/surat/${slug}`);
	if (!res.ok) throw new Error(`Failed to fetch surah with slug: ${slug}`);

	const json = await res.json();

	if (json.data.length === 0) throw new Error('Surah not found');
	return json;
}
