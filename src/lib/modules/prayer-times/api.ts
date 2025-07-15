import type { HijriDateDto, JadwalSholatHarianDto, LokasiPencarianDto } from './types';

const apiUrl = import.meta.env.VITE_API_MY_QURAN;

export async function fetchJadwalHarian(
	kota: string,
	date: string
): Promise<JadwalSholatHarianDto> {
	const response = await fetch(`${apiUrl}/sholat/jadwal/${kota}/${date}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch prayer schedule: ${response.status}`);
	}

	return await response.json();
}

export async function fetchLokasiPencarian(kota: string) {
	const response = await fetch(`${apiUrl}/sholat/kota/cari/${kota}`);

	if (!response.ok) {
		throw new Error(`Failed to search cities: ${response.status}`);
	}

	return await response.json();
}

export const hijriDate = async () => {
	const response = await fetch(`${apiUrl}/cal/hijr`);

	if (!response.ok) {
		throw new Error(`Failed to fetch Hijri date: ${response.status}`);
	}

	const data = await response.json();

	return data.data.date;
};
