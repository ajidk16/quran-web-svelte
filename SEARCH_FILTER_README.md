# Functional Filter untuk scrollToAyat - Dokumentasi

## Overview
Kami telah mengimplementasikan sistem pencarian dan filter yang komprehensif untuk fungsi `scrollToAyat` pada halaman detail surah. Fitur ini memungkinkan pengguna untuk mencari ayat berdasarkan teks dan navigasi yang lebih mudah.

## Fitur Utama

### 1. Pencarian Teks Real-time
- **Input pencarian**: Mencari dalam teks Arab, Latin, Indonesia, dan nomor ayat
- **Debounced search**: Pencarian dijalankan setelah 300ms untuk performa optimal
- **Highlighting**: Kata kunci pencarian dihighlight dalam hasil

### 2. Filter Lanjutan
- **Filter berdasarkan rentang ayat**: Memfilter hasil pencarian berdasarkan rentang ayat tertentu
- **Toggle interface**: Interface yang dapat dibuka/tutup untuk menjaga kerapihan UI
- **Validasi otomatis**: Rentang ayat disesuaikan dengan jumlah ayat surah

### 3. Navigasi Keyboard
- **Ctrl+F**: Fokus pada input pencarian
- **Ctrl+G**: Buka quick navigation modal
- **Ctrl+↑/↓**: Navigasi ke ayat sebelumnya/selanjutnya
- **Ctrl+Home/End**: Scroll ke atas/bawah halaman
- **Escape**: Hapus pencarian aktif

### 4. Hasil Pencarian Interaktif
- **Preview ayat**: Menampilkan snippet dari ayat yang ditemukan
- **Click to navigate**: Klik hasil untuk langsung scroll ke ayat
- **Numbered results**: Menampilkan urutan hasil
- **Performance optimization**: Batasi 10 hasil pertama untuk performa

## Implementasi Teknis

### State Management
```javascript
let searchQuery: string = '';
let filteredAyats: any[] = [];
let showSearchResults: boolean = false;
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let showAdvancedFilter: boolean = false;
let filterByRange: boolean = false;
let rangeStart: number = 1;
let rangeEnd: number = 1;
```

### Reactive Search Logic
```javascript
$: if (surah?.ayat && searchQuery.trim()) {
    searchTimeout = setTimeout(() => {
        let results = surah.ayat.filter(ayat => 
            ayat.teksArab.includes(searchQuery.trim()) ||
            ayat.teksLatin.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            ayat.teksIndonesia.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            ayat.nomorAyat.toString().includes(searchQuery.trim())
        );
        
        if (filterByRange) {
            results = results.filter(ayat => 
                ayat.nomorAyat >= rangeStart && ayat.nomorAyat <= rangeEnd
            );
        }
        
        filteredAyats = results.slice(0, 10);
        showSearchResults = filteredAyats.length > 0;
    }, 300);
}
```

### Enhanced scrollToAyat Function
Fungsi `scrollToAyat` telah ditingkatkan dengan:
- Highlight effect animation
- Better scroll positioning (`block: 'center'`)
- Visual feedback dengan temporary highlight
- Console logging untuk debugging

### Highlight Text Function
```javascript
function highlightText(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}
```

## UI Components

### 1. Search Input
- Input field dengan placeholder yang jelas
- Clear button (X) yang muncul saat ada teks
- Label yang terhubung dengan input (accessibility)
- Keyboard shortcut indicator (Ctrl+F)

### 2. Advanced Filter Panel
- Collapsible panel dengan animasi smooth
- Checkbox untuk mengaktifkan filter rentang
- Input number untuk start dan end range
- Validasi otomatis berdasarkan jumlah ayat surah

### 3. Search Results Panel
- Sticky header dengan statistik hasil
- Scroll container dengan custom scrollbar
- Quick action: "Pergi ke pertama"
- Individual result cards dengan preview

### 4. Result Cards
- Nomor ayat dan posisi dalam hasil
- Preview teks Arab dengan highlighting
- Truncated Latin dan Indonesia text (line-clamp)
- Click area untuk navigasi

## Styling & Animations

### CSS Classes
```css
.line-clamp-1, .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* or 2 */
}

.highlight-ayat {
    animation: highlightPulse 2s ease-in-out;
    border-color: rgb(34 197 94) !important;
    box-shadow: 0 0 0 4px rgb(34 197 94 / 0.2) !important;
}

.search-results::-webkit-scrollbar {
    width: 6px;
}
```

### Animation Keyframes
- `highlightPulse`: Animasi untuk ayat yang discroll
- Smooth transitions untuk dropdown dan hover effects

## Performance Optimizations

1. **Debounced Search**: 300ms delay untuk mengurangi calls
2. **Limited Results**: Maksimal 10 hasil ditampilkan
3. **Efficient Filtering**: Single pass filter dengan multiple conditions
4. **Memory Management**: Cleanup timeout saat component unmount

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support
2. **Proper Labels**: Semua input memiliki label yang terhubung
3. **ARIA Attributes**: Proper ARIA labels untuk screen readers
4. **Focus Management**: Auto-focus pada pencarian dengan Ctrl+F
5. **Clear Shortcuts**: Visual indicators untuk keyboard shortcuts

## Usage Examples

### Basic Search
1. User mengetik "الله" di search box
2. Sistem mencari di semua teks Arab, Latin, Indonesia
3. Hasil muncul secara real-time dengan highlighting
4. User click pada salah satu hasil
5. Page scroll ke ayat yang dipilih dengan highlight effect

### Advanced Filter
1. User membuka "Filter Lanjutan"
2. Mengaktifkan "Filter berdasarkan rentang ayat"
3. Set rentang ayat 1-50
4. Melakukan pencarian normal
5. Hasil dibatasi hanya pada ayat 1-50

### Keyboard Navigation
1. User tekan Ctrl+F → fokus ke search box
2. User ketik pencarian
3. User tekan Escape → clear search
4. User tekan Ctrl+G → buka quick nav modal

## Future Enhancements

1. **Search History**: Simpan riwayat pencarian
2. **Bookmarks**: Bookmark ayat favorit dari hasil pencarian
3. **Export Results**: Export hasil pencarian ke PDF/text
4. **Advanced Filters**: Filter berdasarkan tema, kata kunci, dll
5. **Voice Search**: Pencarian menggunakan suara
6. **Search Analytics**: Track popular searches

## Testing Guidelines

### Manual Testing
1. Test pencarian dengan berbagai bahasa (Arab, Latin, Indonesia)
2. Test filter rentang dengan nilai batas
3. Test keyboard shortcuts
4. Test responsiveness di mobile
5. Test accessibility dengan screen reader

### Performance Testing
1. Test dengan query panjang
2. Test dengan surah yang memiliki banyak ayat
3. Test scroll performance dengan highlighting
4. Monitor memory usage saat pencarian

## Conclusion

Implementasi functional filter untuk `scrollToAyat` ini memberikan pengalaman pengguna yang jauh lebih baik dalam navigasi Al-Quran. Dengan kombinasi pencarian real-time, filter lanjutan, keyboard navigation, dan visual feedback yang baik, fitur ini mendukung berbagai gaya belajar dan preferensi navigasi pengguna.

Fitur ini juga dibangun dengan mempertimbangkan performa, accessibility, dan maintainability untuk pengembangan jangka panjang.
