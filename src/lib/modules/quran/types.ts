export type Surah = {
	nomor: number;
	nama: string;
	namaLatin: string;
	jumlahAyat: number;
	tempatTurun: string;
	arti: string;
	deskripsi: string;
	audioFull: Record<string, string>;
};

export type QuranAyatDto = {
	nomorAyat: number;
	teksArab: string;
	teksLatin: string;
	teksIndonesia: string;
	audio: Record<string, string>;
};

export type QuranStep = {
	nomor: number;
	nama: string;
	namaLatin: string;
	jumlahAyat: number;
};

export type QuranDataDto = {
	nomor: number;
	nama: string;
	namaLatin: string;
	jumlahAyat: number;
	tempatTurun: string;
	arti: string;
	deskripsi: string;
	audioFull: Record<string, string>;
	ayat: Array<QuranAyatDto>;
	suratSelanjutnya: QuranStep;
	suratSebelumnya: QuranStep | false;
};

export type DetailQuranDto = {
	code: number;
	message: string;
	data: QuranDataDto;
};
