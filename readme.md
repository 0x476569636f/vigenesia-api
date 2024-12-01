# Vigenesia API

Proyek ini adalah API yang dibangun menggunakan [Hono](https://hono.dev/) dan dijalankan di Cloudflare Workers. API ini terhubung dengan Neon Serverless Database untuk penyimpanan data dan menggunakan JWT untuk otentikasi.

## Fitur

- Otentikasi pengguna menggunakan JWT (login untuk mendapatkan token)
- CRUD untuk berita dan motivasi
- Pencarian berita
- Middleware untuk otorisasi berdasarkan role (admin | user)

## Prerequisites

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) 20+ Disarankan Versi Lts
## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek ini di lingkungan lokal Anda:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/vigenesia-api.git
   cd vigenesia-api
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Buat file `.dev.vars` di root proyek Anda dan tambahkan variabel berikut:
   ```env
   DATABASE_URL= //Neon Serverless Database URL
   JWT_SECRET= //Your JWT secret key
   ```

4. Jalankan proyek dalam mode pengembangan:
   ```bash
   npm run dev
   ```

## Deploy

Untuk mendepoy proyek ini ke Cloudflare Workers, gunakan perintah berikut:

```bash
npm run deploy
```

## Dokumentasi API
Kami sudah menyiapkan dokumentasi API menggunakan spesifikasi OpenAPI, yang dapat Anda akses menggunakan Scalar:

Scalar UI - Vigenesia API 
https://tws-api.tesirvan.workers.dev/

Dokumentasi ini mencakup semua endpoint API yang tersedia, beserta metode HTTP yang digunakan, parameter yang diperlukan, dan contoh respons.

## Penggunaan

Setelah proyek berjalan, Anda dapat mengakses API melalui endpoint yang telah ditentukan. Pastikan untuk menggunakan token JWT yang valid dalam header Authorization untuk mengakses endpoint yang memerlukan otentikasi.

## Kontribusi

Jika Anda ingin berkontribusi, silakan lakukan langkah-langkah berikut:

1. Fork repositori
2. Buat cabang baru (`git checkout -b fitur-baru`)
3. Lakukan perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Dorong ke cabang (`git push origin fitur-baru`)
5. Buat Pull Request
