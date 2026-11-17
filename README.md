# Dompetku

Aplikasi keuangan pribadi berbasis web yang dapat dipasang di Android sebagai **Progressive Web App (PWA)** melalui GitHub Pages.

## Fitur
- Dashboard saldo, pemasukan, dan pengeluaran
- Catatan transaksi
- Tagihan bulanan dan status pembayaran
- Penyisihan total tagihan belum lunas setelah pemasukan kategori **Gaji**
- Tabungan emas dan estimasi harga emas (memerlukan internet untuk pembaruan harga)
- Target tabungan dan laporan
- Penyimpanan data lokal di browser
- Dukungan cache/offline setelah aplikasi pertama kali dibuka

## Publikasikan melalui GitHub Pages

1. Masuk ke https://github.com dan login.
2. Tekan **New repository**.
3. Isi nama repository, misalnya `dompetku`, pilih **Public**, lalu tekan **Create repository**.
4. Di halaman repository, pilih **Add file → Upload files**.
5. Unggah seluruh isi folder ini: `index.html`, `manifest.webmanifest`, `sw.js`, folder `icons`, dan `README.md`.
6. Tekan **Commit changes**.
7. Buka **Settings → Pages**.
8. Pada **Build and deployment**, pilih **Deploy from a branch**.
9. Pilih branch **main** dan folder **/(root)**, lalu tekan **Save**.
10. Tunggu proses publikasi selesai. GitHub akan menampilkan alamat situs seperti `https://USERNAME.github.io/dompetku/`.

## Pasang di Android

1. Buka alamat GitHub Pages tadi menggunakan Google Chrome di HP Android.
2. Tunggu sampai halaman Dompetku selesai dimuat dan koneksi internet aktif.
3. Tekan menu Chrome **⋮**.
4. Pilih **Install app** atau **Tambahkan ke layar utama** (nama menu dapat berbeda menurut versi Chrome).
5. Konfirmasi **Install** / **Tambahkan**.
6. Ikon Dompetku akan muncul di layar aplikasi HP. Buka dari ikon tersebut agar tampil seperti aplikasi.

## Catatan penting tentang data

- Data transaksi, tagihan, dan tabungan disimpan di penyimpanan browser pada perangkat tersebut; aplikasi ini belum memakai server/login untuk sinkronisasi antarperangkat.
- Data yang sebelumnya tersimpan saat membuka file HTML lokal tidak otomatis berpindah ke alamat GitHub Pages karena browser memisahkan penyimpanan berdasarkan alamat situs. Catat ulang data atau gunakan fitur ekspor/impor jika tersedia pada versi aplikasi.
- Jangan hapus data situs/browser jika ingin mempertahankan data lokal.
- Harga emas live membutuhkan internet; fitur transaksi dan pencatatan utama dapat dibuka dari cache setelah kunjungan pertama.

## Struktur repository

```text
Dompetku/
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
└── icons/
    ├── icon-192.png
    └── icon-512.png
```
