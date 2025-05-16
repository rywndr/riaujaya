#  🛵 Dasbor POS

>  *pt.riaujaya cemerlang suzuki - sistem manajemen layanan & penjualan sepeda motor*

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)  ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)  ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)  ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)  ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)

##  📋 gambaran umum

aplikasi web modern dan responsif yang dibuat untuk bengkel sepeda motor untuk mengelola penjualan, inventaris, dan staf. Dapat diadaptasi untuk bisnis serupa.

>  **_catatan:_**  *ini bukan aplikasi resmi untuk pt.riaujaya cemerlang suzuki. ini adalah aplikasi konsep yang terinspirasi oleh perusahaan tersebut.*

###  ✨ fitur utama

- 📊 **Dasbor**: visualisasikan data penjualan, produk populer, dan transaksi terkini
- 💰 **Point of Sale (POS)**: proses transaksi dengan cepat dengan perhitungan waktu-nyata
- 🧾 **Struk**: hasilkan dan cetak struk
- 📝 **Riwayat Transaksi**: cari dan filter penjualan sebelumnya dengan tampilan detail
- 📦 **Manajemen Inventaris**: lacak produk dengan fungsionalitas arsip/pemulihan
- 👥 **Manajemen Tim**: kelola staf penjualan dan lacak kinerja
- 🔒 **Autentikasi Aman**: auth dengan Supabase

##  🛠️ tumpukan teknologi

- ⚛️ **React**: untuk membangun antarmuka pengguna
- 🎨 **Tailwind CSS**: untuk styling responsif berbasis utilitas
- 🔐 **Supabase**: untuk autentikasi dan basis data
- 📊 **MySQL**: basis data backend (komponen server)
- 📱 **Desain Responsif**: berfungsi di desktop dan perangkat seluler
- 🚀 **Express**: untuk membangun API sisi server

##  🚀 memulai

###  prasyarat

- node.js (v16+)
- npm atau yarn
- basis data mysql

###  instalasi

```bash
# clone repo
git clone https://github.com/rywndr/riaujaya.git

# navigasi ke direktori proyek
cd riaujaya

# instal dependensi client
cd client
npm install

# instal dependensi server
cd ../server
npm install
```

###  konfigurasi

buat file `.env` di direktori client dan server berdasarkan contoh:

**client/.env**
```
VITE_SUPABASE_URL=url_supabase_anda
VITE_SUPABASE_ANON_KEY=kunci_anon_supabase_anda
VITE_API_URL=http://localhost:3000/api
```

**server/.env**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=kata_sandi_anda
DB_NAME=riaujaya
PORT=3000
```

###  menjalankan aplikasi

```bash
# mulai server
cd server
npm run dev

# di terminal lain, run client
cd client
npm run dev
```
kunjungi `http://localhost:5173` di browser Anda

##  📱 screenshots

*[screenshots coming soon]*

##  🔍 fitur secara detail

###  💼 dasbor manajemen

- manajemen inventaris produk dengan pengarsipan
- manajemen anggota tim penjualan
- pencarian dan paginasi untuk navigasi yang mudah

###  🧮 POS

- pencarian produk intuitif dan manajemen keranjang
- penerapan diskon di tingkat produk
- pengambilan informasi pelanggan
- pembuatan struk terperinci

###  📜 riwayat transaksi

- log transaksi komprehensif
- pemfilteran berdasarkan rentang tanggal dan istilah pencarian
- detail transaksi yang dapat diperluas
- melihat dan mencetak struk

##  🤝 kontribusi

kontribusi sangat diterima! jangan ragu untuk mengirimkan pull request.

##  📄 lisensi

proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detailnya.

---
