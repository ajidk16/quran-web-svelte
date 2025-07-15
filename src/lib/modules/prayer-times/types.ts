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

export type CoordinateAddressDto = {
	road?: string;
	village?: string;
	city?: string;
	state?: string;
	'ISO3166-2-lvl4'?: string;
	region?: string;
	'ISO3166-2-lvl3'?: string;
	postcode?: string;
	country?: string;
	country_code?: string;
};
