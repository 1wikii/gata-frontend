# Pengumuman (Announcement) Management

Halaman manajemen pengumuman untuk admin yang memungkinkan pembuatan, pengeditan, penghapusan, dan filtrasi pengumuman.

## 📋 Fitur Utama

### 1. **Tampilan Statistik (Dashboard)**

- Total Pengumuman
- Pengumuman Dipublikasi
- Pengumuman Draft
- Pengumuman Prioritas Tinggi

### 2. **Pencarian & Filter**

- **Search**: Pencarian berdasarkan judul atau konten pengumuman
- **Filter Status Publikasi**: Semua, Dipublikasi, Draft
- **Filter Prioritas**: Semua, Rendah, Tinggi
- **Reset Filter**: Mengembalikan semua filter ke nilai default

### 3. **Tabel Pengumuman**

Menampilkan data pengumuman dengan kolom:

- **Judul**: Judul dan preview konten
- **Status**: Dipublikasi/Draft dengan ikon
- **Prioritas**: Badge dengan warna berbeda (Rendah/Tinggi)
- **Dibuat Oleh**: Nama dan email pembuat
- **Tanggal**: Tanggal pembuatan
- **Aksi**: Edit dan Delete

### 4. **CRUD Operations**

#### Tambah Pengumuman

- Form modal untuk membuat pengumuman baru
- Input: Judul, Konten, Prioritas, Status Publikasi
- Validasi: Judul tidak boleh kosong, max 255 karakter
- Konten tidak boleh kosong
- Preview real-time

#### Edit Pengumuman

- Form modal dengan data pengumuman yang sudah ada
- Update field yang diperlukan
- Validasi sama dengan tambah

#### Hapus Pengumuman

- Dialog konfirmasi sebelum menghapus
- Menampilkan judul dan preview konten
- Peringatan bahwa tindakan tidak dapat dibatalkan

### 5. **Pagination**

- Navigasi antar halaman
- Tombol Previous/Next
- Nomor halaman yang dapat diklik
- Disabled state untuk halaman pertama/terakhir

## 📁 Struktur File

```
containers/admin/pengumuman-page/
├── index.tsx                    # Halaman utama
├── AnnouncementTable.tsx        # Komponen tabel
├── AnnouncementFormModal.tsx    # Modal form tambah/edit
├── DeleteConfirmDialog.tsx      # Dialog konfirmasi hapus
├── FilterSearch.tsx             # Komponen filter & search
├── AnnouncementStats.tsx        # Komponen statistik
└── export.ts                    # Export file

types/
└── pengumuman.ts               # Type definitions

utils/
└── announcementApi.ts          # API utility functions

app/admin/(pages)/pengumuman/
└── page.tsx                    # Route page
```

## 🔌 API Integration

### Endpoints Digunakan

1. **GET** `/admin/pengumuman`

   - Mengambil semua pengumuman dengan paginasi
   - Parameters: page, limit, search, is_published, priority, sortBy, sortOrder

2. **GET** `/admin/pengumuman/:id`

   - Mengambil detail pengumuman

3. **POST** `/admin/pengumuman`

   - Membuat pengumuman baru
   - Body: title, content, priority, is_published

4. **PUT** `/admin/pengumuman/:id`

   - Update pengumuman
   - Body: Sebagian atau semua field

5. **DELETE** `/admin/pengumuman/:id`
   - Menghapus pengumuman

## 📦 Dependencies

- **React**: UI components dan hooks
- **Lucide React**: Icons (Plus, Edit, Trash2, Eye, EyeOff, etc.)
- **TailwindCSS**: Styling
- **UI Components**: Card, Table dari shadcn/ui

## 🎨 Design Pattern

### Konsistensi dengan Project

- **Color Scheme**:

  - Blue: Primary action (600, 700)
  - Green: Success/Published (600, 100)
  - Red: Danger/High Priority (600, 100)
  - Yellow: Warning/Low Priority (600, 100)
  - Gray: Secondary/Draft (100-600)

- **Typography**:

  - Title: text-xl font-semibold
  - Label: text-sm font-semibold
  - Body: text-sm text-gray-600

- **Spacing**:

  - Grid: gap-6
  - Card: p-6
  - Modal: p-6
  - Section: mb-6

- **Borders & Shadows**:
  - Card: border border-gray-200 shadow-sm
  - Input: border border-gray-300 rounded-lg
  - Rounded: rounded-lg

### Component State Management

- State untuk data, loading, error, filter
- Memoization untuk perhitungan stats
- Controlled forms dengan onChange handlers
- Error handling dengan try-catch

## 📝 Usage

### Import Container

```tsx
import PengumumanPage from "@/containers/admin/pengumuman-page";

export default function Pengumuman() {
  return <PengumumanPage />;
}
```

### Menggunakan API Utility

```tsx
import { announcementApi } from "@/utils/announcementApi";

// Get all
const response = await announcementApi.getAll(1, 10, {
  search: "keyword",
  is_published: true,
  priority: "high",
});

// Create
await announcementApi.create({
  title: "Judul",
  content: "Konten",
  priority: "high",
  is_published: true,
});

// Update
await announcementApi.update(id, {
  title: "Judul Baru",
});

// Delete
await announcementApi.delete(id);
```

## 🚀 Fitur Lanjutan (Optional)

1. **Bulk Actions**: Delete multiple announcements
2. **Export**: Export pengumuman ke CSV/PDF
3. **Schedule**: Penjadwalan publikasi otomatis
4. **Email Notifications**: Kirim notifikasi ke user
5. **Rich Text Editor**: Editor teks yang lebih advanced
6. **Images/Attachments**: Upload gambar atau file
7. **Comments/Reactions**: User dapat berkomentar
8. **Version History**: Riwayat perubahan

## ⚙️ Error Handling

- API error response ditampilkan dalam alert
- Form validation error ditampilkan di atas form
- Loading state pada tombol submit
- Retry button pada error alert
- Console logging untuk debugging

## 🔐 Security

- Token-based authentication (Bearer token)
- Authorization header di setiap request
- Form validation sebelum submit
- Input sanitization pada form
- Secure API endpoints dengan admin role check

## 📱 Responsive Design

- Grid responsive: `grid-cols-1 md:grid-cols-4`
- Mobile-friendly modal dan dialog
- Overflow handling untuk tabel
- Touch-friendly buttons dan controls
