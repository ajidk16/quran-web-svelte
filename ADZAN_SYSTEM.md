# 🕌 Sistem Adzan Global

Sistem adzan global telah diimplementasikan dan akan otomatis aktif di semua route ketika user sudah memilih kota. **Semua file adzan sekarang terorganisir di dalam module prayer-times.**

## ✨ Fitur

### 🔊 Pemutaran Otomatis
- ✅ Adzan akan diputar **5 menit sebelum** setiap waktu sholat
- ✅ Bekerja di **semua halaman/route** secara global
- ✅ Hanya aktif jika user sudah memilih kota
- ✅ Mencegah pemutaran duplikat dalam satu hari

### ⚙️ Pengaturan Lengkap
- ✅ **On/Off** - Aktifkan/nonaktifkan adzan
- ✅ **Volume** - Kontrol volume 0-100%
- ✅ **Waktu** - Atur berapa menit sebelum sholat (0-10 menit)
- ✅ **Pilih Sholat** - Pilih sholat mana yang ingin ada adzannya

### 🔔 Notifikasi
- ✅ **Browser Notification** - Muncul saat adzan akan diputar
- ✅ **Visual Indicator** - Popup di pojok kanan bawah
- ✅ **Info Real-time** - Menampilkan countdown waktu adzan berikutnya

## 🗂️ Struktur File (Terintegrasi dalam Prayer-Times Module)

```
src/lib/modules/prayer-times/
├── services/
│   └── adzan.ts                    # Service utama adzan
├── components/
│   ├── AdzanService.svelte         # Background service
│   ├── AdzanNotification.svelte    # Visual notification
│   ├── AdzanSettings.svelte        # Panel pengaturan
│   ├── CitySearchModal.svelte
│   └── PrayerCard.svelte
├── pages/
│   └── index.svelte               # Termasuk demo & settings
├── stores/
├── utils/
├── api.ts
├── store.ts
├── types.ts
└── index.ts                      # Export semua termasuk adzan
```

## 🎯 Cara Kerja

### 1. Service Global (`/services/adzan.ts`)
```typescript
// Mengecek setiap menit apakah sudah waktunya adzan
// Mengelola pengaturan user
// Memutar audio dan menampilkan notifikasi
```

### 2. Komponen Global (`/components/AdzanService.svelte`)
```svelte
<!-- Berjalan di background di semua route -->
<!-- Dimasukkan ke +layout.svelte -->
```

### 3. UI Notification (`/components/AdzanNotification.svelte`)
```svelte
<!-- Popup di pojok kanan bawah -->
<!-- Menampilkan info adzan berikutnya -->
```

### 4. Settings Panel (`/components/AdzanSettings.svelte`)
```svelte
<!-- Panel pengaturan di halaman prayer-times -->
<!-- Kontrol volume, waktu, dan pilihan sholat -->
```

## 📁 File Audio

Audio adzan disimpan di: `/static/audio/adzan.mp3`

### Cara Menambah Audio:
1. Download file audio adzan (format MP3)
2. Rename menjadi `adzan.mp3`
3. Letakkan di folder `/static/audio/`
4. Pastikan ukuran tidak terlalu besar (<5MB)

### Sumber Audio yang Disarankan:
- https://www.myinstants.com/en/search/?name=adzan
- https://freesound.org/search/?q=adzan
- Atau rekam sendiri

## 🚀 Status Implementasi

### ✅ Sudah Selesai:
- [x] Service adzan global yang cek setiap menit
- [x] Pengaturan lengkap (on/off, volume, waktu, pilih sholat)
- [x] Notifikasi browser + visual popup
- [x] Integrasi ke semua route via +layout.svelte
- [x] Penyimpanan pengaturan di localStorage
- [x] Mencegah duplicate play dalam satu hari
- [x] UI settings panel di halaman prayer-times
- [x] **File terorganisir di dalam module prayer-times**
- [x] **Export dari prayer-times/index.ts**

### 🎯 Cara Menggunakan:
1. **Pilih kota** di halaman Prayer Times
2. **Klik tombol "Adzan"** di header untuk pengaturan
3. **Aktifkan adzan** dan atur sesuai keinginan
4. **Izinkan notifikasi** browser saat diminta
5. **Sistem akan otomatis** memutar adzan 5 menit sebelum sholat

### 🔧 Testing:
- Untuk testing, ubah `minutesBefore` menjadi 0 atau 1 menit
- Atau ubah waktu sistem untuk mensimulasi waktu sholat
- Check console browser untuk log "🕌 Adzan dimainkan untuk [NamaSholat]"

### 📋 Import dari Module:
```typescript
// Import dari prayer-times module
import { 
  adzanSettings, 
  nextAdzanInfo, 
  playAdzan, 
  updateAdzanSettings 
} from '$lib/modules/prayer-times';

// Atau spesifik dari service
import { 
  adzanSettings, 
  playAdzan 
} from '$lib/modules/prayer-times/services/adzan';
```

## 💡 Catatan Teknis

### Browser Compatibility:
- ✅ Chrome/Edge (Web Audio API)
- ✅ Firefox (Web Audio API)  
- ✅ Safari (mungkin perlu user interaction dulu)

### Permissions:
- 🔔 **Notification**: Otomatis request saat pertama kali
- 🔊 **Audio**: Modern browser butuh user interaction dulu

### Performance:
- ⚡ **Ringan**: Cek hanya setiap 1 menit
- 💾 **Efficient**: Audio di-preload saat init
- 🎯 **Smart**: Hanya aktif jika ada kota terpilih

## 🐛 Troubleshooting

### Audio Tidak Muncul:
1. Check apakah file `/static/audio/adzan.mp3` ada
2. Check console browser untuk error
3. Pastikan browser tidak dalam mode silent
4. Coba interaksi dengan halaman dulu (klik sesuatu)

### Notifikasi Tidak Muncul:
1. Check permission notifikasi browser
2. Pastikan tidak dalam mode Do Not Disturb
3. Check pengaturan adzan sudah diaktifkan

### Adzan Tidak Otomatis:
1. Pastikan sudah pilih kota
2. Check pengaturan adzan enabled
3. Check apakah sholat tidak dimute
4. Lihat console untuk log adzan service

## 📁 File Audio

Audio adzan disimpan di: `/static/audio/adzan.mp3`

### Cara Menambah Audio:
1. Download file audio adzan (format MP3)
2. Rename menjadi `adzan.mp3`
3. Letakkan di folder `/static/audio/`
4. Pastikan ukuran tidak terlalu besar (<5MB)

### Sumber Audio yang Disarankan:
- https://www.myinstants.com/en/search/?name=adzan
- https://freesound.org/search/?q=adzan
- Atau rekam sendiri

## 🚀 Status Implementasi

### ✅ Sudah Selesai:
- [x] Service adzan global yang cek setiap menit
- [x] Pengaturan lengkap (on/off, volume, waktu, pilih sholat)
- [x] Notifikasi browser + visual popup
- [x] Integrasi ke semua route via +layout.svelte
- [x] Penyimpanan pengaturan di localStorage
- [x] Mencegah duplicate play dalam satu hari
- [x] UI settings panel di halaman prayer-times

### 🎯 Cara Menggunakan:
1. **Pilih kota** di halaman Prayer Times
2. **Klik tombol "Adzan"** di header untuk pengaturan
3. **Aktifkan adzan** dan atur sesuai keinginan
4. **Izinkan notifikasi** browser saat diminta
5. **Sistem akan otomatis** memutar adzan 5 menit sebelum sholat

### 🔧 Testing:
- Untuk testing, ubah `minutesBefore` menjadi 0 atau 1 menit
- Atau ubah waktu sistem untuk mensimulasi waktu sholat
- Check console browser untuk log "🕌 Adzan dimainkan untuk [NamaSholat]"

## 💡 Catatan Teknis

### Browser Compatibility:
- ✅ Chrome/Edge (Web Audio API)
- ✅ Firefox (Web Audio API)  
- ✅ Safari (mungkin perlu user interaction dulu)

### Permissions:
- 🔔 **Notification**: Otomatis request saat pertama kali
- 🔊 **Audio**: Modern browser butuh user interaction dulu

### Performance:
- ⚡ **Ringan**: Cek hanya setiap 1 menit
- 💾 **Efficient**: Audio di-preload saat init
- 🎯 **Smart**: Hanya aktif jika ada kota terpilih

## 🐛 Troubleshooting

### Audio Tidak Muncul:
1. Check apakah file `/static/audio/adzan.mp3` ada
2. Check console browser untuk error
3. Pastikan browser tidak dalam mode silent
4. Coba interaksi dengan halaman dulu (klik sesuatu)

### Notifikasi Tidak Muncul:
1. Check permission notifikasi browser
2. Pastikan tidak dalam mode Do Not Disturb
3. Check pengaturan adzan sudah diaktifkan

### Adzan Tidak Otomatis:
1. Pastikan sudah pilih kota
2. Check pengaturan adzan enabled
3. Check apakah sholat tidak dimute
4. Lihat console untuk log adzan service
