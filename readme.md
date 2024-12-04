# Vigenesia API

Proyek ini merupakan remake dari [Vigenesia](https://github.com/indrakoto/vigenesia), sebuah API yang awalnya dibangun menggunakan PHP lalu diremake menggunakan JavaScript. Proyek ini juga merupakan eksperimen untuk mengeksplorasi kemampuan dan performa JavaScript dalam pengembangan API. API ini dijalankan di Cloudflare Workers, terhubung dengan Neon Serverless Database untuk penyimpanan data, dan menggunakan JWT (JSON Web Token) untuk otentikasi

## Anggota Kelompok 3

| No  | Nama Anggota   | NIM      |
| --- | -------------- | -------- |
| 1   | Rizki Fernando | 10220045 |
| 2   | Irvan Pramana  | 10220008 |
| 3   | Azfa Haqqani   | 10220082 |
| 4   | Haikal Putra   | 10220068 |
| 5   | Tirta Raga     | 10220021 |

## Tech Stack

Proyek ini dibangun menggunakan teknologi berikut:

- [Node.js](https://nodejs.org/)
- [Hono](https://hono.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Neon Serveless Database](https://neon.tech/)

## Fitur

- Otentikasi pengguna menggunakan JWT
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

Kami sudah menyiapkan dokumentasi API menggunakan spesifikasi OpenAPI, yang dapat Anda akses di url:

https://tws-api.tesirvan.workers.dev/

Dokumentasi ini mencakup semua endpoint API yang tersedia, beserta metode HTTP yang digunakan, parameter yang diperlukan, dan contoh respons.

## Penggunaan

Setelah proyek berjalan,Anda dapat mengakses API melalui endpoint yang telah ditentukan. Pastikan untuk menggunakan token JWT yang valid dalam header Authorization untuk mengakses endpoint yang memerlukan otentikasi.
token bisa di dapat setelah login, jika belum mempunyai akun silahkan register terlebih daluhu.
