// Quick timing test
const now = new Date();
const currentTime = now.getHours() * 60 + now.getMinutes();

console.log('=== TIMING DEBUG ===');
console.log(`Current time: ${now.toLocaleTimeString()}`);
console.log(`Current minutes since midnight: ${currentTime}`);

// Test prayer times (example)
const prayers = [
	{ name: 'Subuh', time: '04:30' },
	{ name: 'Dzuhur', time: '12:00' },
	{ name: 'Ashar', time: '15:15' },
	{ name: 'Maghrib', time: '18:05' },
	{ name: 'Isya', time: '19:20' }
];

const minutesBefore = 5;

prayers.forEach(prayer => {
	const [hours, minutes] = prayer.time.split(':').map(Number);
	const prayerMinutes = hours * 60 + minutes;
	const adzanMinutes = prayerMinutes - minutesBefore;
	
	const adzanTime = `${Math.floor(adzanMinutes/60)}:${String(adzanMinutes%60).padStart(2, '0')}`;
	const isCurrentWindow = currentTime >= adzanMinutes && currentTime < (adzanMinutes + 10);
	const isUpcoming = currentTime < adzanMinutes;
	
	console.log(`${prayer.name}: ${prayer.time} -> Adzan at ${adzanTime} (${adzanMinutes}min) | Current: ${isCurrentWindow ? '🕌 YES' : isUpcoming ? '⏰ UPCOMING' : '❌ PASSED'}`);
});

console.log('===================');
