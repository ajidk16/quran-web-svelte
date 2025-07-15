export interface JadwalSholatHarianDto {
	status: boolean;
	request: {
		path: string;
		year: string;
		month: string;
		date: string;
	};
	data: {
		id: number;
		lokasi: string;
		daerah: string;
		jadwal: {
			tanggal: string;
			imsak: string;
			subuh: string;
			terbit: string;
			dhuha: string;
			dzuhur: string;
			ashar: string;
			maghrib: string;
			isya: string;
			date: string;
		};
	};
}

export interface LokasiData {
	id: string;
	lokasi: string;
}

export interface LokasiPencarianDto {
	status: boolean;
	request: {
		path: string;
		keyword: string;
	};
	data: LokasiData[];
}

export interface HijriDateDto {
	data: string[];
}
