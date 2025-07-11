import type { QuranAyatData, QuranAyatResponse, Surah } from './types';

export interface SurahResponse {
	code: number;
	message: string;
	data: Surah[];
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function fetchAllSurah(): Promise<Surah[]> {
	const res = await fetch(`${baseUrl}/quran/surat/semua`);
	if (!res.ok) throw new Error('Failed to fetch surah');
	const json: SurahResponse = await res.json();
	return json.data;
}

export async function fetchSurahBySlug(slug: string): Promise<Surah> {
	const res = await fetch(`${baseUrl}/quran/surat/${slug}`);
	if (!res.ok) throw new Error(`Failed to fetch surah with slug: ${slug}`);

	const json = await res.json();

	if (json.data.length === 0) throw new Error('Surah not found');
	return json.data;
}

export async function fetchSurahDetail(
	surah: string,
	ayatAwal: string,
	ayatAkhir: string
): Promise<QuranAyatResponse> {
	const res = await fetch(`${baseUrl}/quran/ayat/${surah}/${ayatAwal}/${ayatAkhir}`);

	if (!res.ok) throw new Error('Failed to fetch surah detail');

	const response: QuranAyatResponse = await res.json();

	if (!response.status) throw new Error('Failed to fetch surah detail');

	return response;
}
