import { browser } from '$app/environment';

// Interface for selected city
export interface SelectedCity {
	id: string;
	lokasi: string;
}

// Interface for user location
export interface UserLocation {
	latitude: number;
	longitude: number;
	city: {
		city: string;
		country: string;
	};
}

// Get user's current location using geolocation API
export async function getUserLocation(): Promise<UserLocation | null> {
	if (!browser || !navigator.geolocation) {
		throw new Error('Geolocation tidak didukung oleh browser');
	}

	return new Promise<UserLocation | null>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const location: UserLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					city: {
						city: '',
						country: ''
					}
				};

				// Try to get city name from coordinates using reverse geocoding
				try {
					const cityName = await getCityFromCoordinates(location.latitude, location.longitude);

					if (cityName) {
						location.city.city = cityName;
					}
				} catch (err) {
					console.warn('Failed to get city name from coordinates:', err);
				}

				resolve(location);
			},
			(err) => {
				const errorMessage = `Gagal mendapatkan lokasi: ${err.message}`;
				console.error('Geolocation error:', err);
				reject(new Error(errorMessage));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000 // 5 minutes
			}
		);
	});
}

// Get city name from coordinates using Nominatim (OpenStreetMap) API
export async function getCityFromCoordinates(lat: number, lng: number): Promise<string | null> {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`
		);

		if (!response.ok) {
			throw new Error('Reverse geocoding failed');
		}

		const data = await response.json();

		console.log('Reverse geocoding response:', data);
		// Extract city name from the response
		const address = data.address;
		const cityName =
			address?.city ||
			address?.town ||
			address?.village ||
			address?.municipality ||
			address?.county ||
			address?.state;

		return address || null;
	} catch (err) {
		console.error('Error in reverse geocoding:', err);
		return null;
	}
}
