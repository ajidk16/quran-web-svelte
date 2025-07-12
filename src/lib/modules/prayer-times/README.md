# Prayer Times Store

Store global untuk mengelola jadwal sholat dengan localStorage dan state management yang lengkap.

## Features

- ✅ **Persistent Storage**: Data tersimpan di localStorage
- ✅ **Auto Refresh**: Data otomatis diperbarui setiap 1 jam
- ✅ **Geolocation**: Deteksi lokasi pengguna otomatis
- ✅ **City Search**: Pencarian kota dengan API
- ✅ **Current Prayer**: Informasi sholat saat ini dan berikutnya
- ✅ **Global State**: Bisa digunakan di seluruh aplikasi
- ✅ **Error Handling**: Penanganan error yang baik
- ✅ **Loading States**: Indikator loading untuk UX yang baik

## Quick Start

### 1. Import Store

```typescript
import { 
  prayerTimesStore,
  prayerSelectedCity,
  prayerScheduleData,
  prayerCurrentInfo 
} from '$lib/modules/prayer-times';
```

### 2. Initialize (di +layout.svelte atau main app)

```svelte
<script>
  import { onMount } from 'svelte';
  import { prayerTimesStore } from '$lib/modules/prayer-times';
  
  onMount(async () => {
    await prayerTimesStore.initialize();
  });
</script>
```

### 3. Menggunakan Store

```svelte
<script>
  import { 
    prayerSelectedCity,
    prayerScheduleData,
    prayerCurrentInfo,
    prayerIsLoading,
    prayerError
  } from '$lib/modules/prayer-times';
</script>

<!-- Tampilkan kota yang dipilih -->
{#if $prayerSelectedCity}
  <p>📍 {$prayerSelectedCity.lokasi}</p>
{/if}

<!-- Tampilkan jadwal sholat -->
{#if $prayerScheduleData}
  <div>
    <p>Subuh: {$prayerScheduleData.data.jadwal.subuh}</p>
    <p>Dzuhur: {$prayerScheduleData.data.jadwal.dzuhur}</p>
    <p>Ashar: {$prayerScheduleData.data.jadwal.ashar}</p>
    <p>Maghrib: {$prayerScheduleData.data.jadwal.maghrib}</p>
    <p>Isya: {$prayerScheduleData.data.jadwal.isya}</p>
  </div>
{/if}

<!-- Tampilkan info sholat saat ini -->
{#if $prayerCurrentInfo}
  <div>
    {#if $prayerCurrentInfo.current}
      <p>Waktu: {$prayerCurrentInfo.current.name}</p>
    {/if}
    {#if $prayerCurrentInfo.next}
      <p>Selanjutnya: {$prayerCurrentInfo.next.name} - {$prayerCurrentInfo.next.time}</p>
    {/if}
  </div>
{/if}
```

## Store Actions

### Set City
```typescript
await prayerTimesStore.setCity({
  id: 'jakarta',
  lokasi: 'Jakarta'
});
```

### Search Cities
```typescript
await prayerTimesStore.searchCities('jakarta');
```

### Get User Location
```typescript
const location = await prayerTimesStore.getUserLocation();
```

### Fetch Prayer Times
```typescript
await prayerTimesStore.fetchPrayerTimes('jakarta', '2024-01-15');
```

### Refresh Data
```typescript
await prayerTimesStore.refreshIfNeeded();
```

### Clear All Data
```typescript
prayerTimesStore.clearData();
```

## Available Stores

- `prayerSelectedCity` - Kota yang dipilih
- `prayerScheduleData` - Data jadwal sholat lengkap
- `prayerCurrentInfo` - Info sholat saat ini dan berikutnya
- `prayerUserLocation` - Lokasi GPS pengguna
- `prayerSearchResults` - Hasil pencarian kota
- `prayerIsLoading` - Status loading
- `prayerError` - Error message
- `prayerIsDataFresh` - Apakah data masih fresh (< 1 jam)

## Component Usage

```svelte
<!-- Import widget yang sudah jadi -->
<script>
  import PrayerTimesWidget from '$lib/modules/prayer-times/components/PrayerTimesWidget.svelte';
</script>

<PrayerTimesWidget />
```

## LocalStorage Keys

Data disimpan dengan key:
- `prayer_times_selected_city` - Kota yang dipilih
- `prayer_times_schedule` - Jadwal sholat
- `prayer_times_last_updated` - Timestamp update terakhir
- `prayer_times_user_location` - Lokasi pengguna

## Error Handling

Store akan menangani error dan menyimpannya di `prayerError` store:

```svelte
{#if $prayerError}
  <div class="error">
    {$prayerError}
  </div>
{/if}
```

## Auto Refresh

Data otomatis diperbarui jika sudah lebih dari 1 jam sejak update terakhir. Gunakan `prayerIsDataFresh` untuk cek status:

```svelte
{#if !$prayerIsDataFresh}
  <button onclick={() => prayerTimesStore.refreshIfNeeded()}>
    Data perlu diperbarui
  </button>
{/if}
```
