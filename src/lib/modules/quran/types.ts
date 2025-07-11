export type Surah = {
    audio_url: string;
    name_en: string;
    name_id: string;
    name_long: string;
    name_short: string;
    number: string;
    number_of_verses: string;
    revelation: string;
    revelation_en: string;
    revelation_id: string;
    sequence: string;
    tafsir: string;
    translation_en: string;
    translation_id: string;
};

export type QuranAyatRequest = {
    path: string;
    surat: string;
    ayat: string;
    panjang: string;
};

export type QuranSuratInfo = {
    id: number;
    nama: {
        ar: string;
        id: string;
    };
    relevasi: string;
    ayat_max: number;
};

export type QuranAyatData = {
    arab: string;
    asbab: string;
    audio: string;
    ayah: string;
    hizb: string | null;
    id: string;
    juz: string;
    latin: string;
    notes: string | null;
    page: string;
    surah: string;
    text: string;
    theme: string | null;
};

export type QuranAyatResponse = {
    status: boolean;
    request: QuranAyatRequest;
    info: {
        surat: QuranSuratInfo;
    };
    data: QuranAyatData[];
};