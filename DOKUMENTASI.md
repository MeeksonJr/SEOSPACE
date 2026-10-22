# Dokumentasi & Panduan Operasional — TrustPulse AI

> **Status:** Turnkey SaaS Architecture  
> **Arsitektur:** Next.js 15 App Router, React 19, Tailwind CSS v4, Supabase PostgreSQL, PulseMind™ AI Engine, Stripe Billing  
> **Biaya Operasional:** $0.00 / bulan (100% Free Tier Vercel Hobby + Supabase Free + PulseMind™ AI Free Tier)  

---

## 1. Ikhtisar Produk (Overview)

TrustPulse AI adalah platform B2B Micro-SaaS komersial yang dirancang untuk membantu agensi pemasaran digital, pemilik bisnis lokal (klinik gigi, bengkel, restoran, salon, kantor hukum), dan pengusaha e-commerce:
1. **Mengumpulkan Ulasan Positif Bintang 5:** Memandu pelanggan puas langsung ke Google My Business atau Trustpilot hanya dengan 1 kali klik.
2. **Negative Review Shield (Perisai Ulasan Buruk):** Mencegat pelanggan yang kecewa (bintang 1–3) dan mengarahkan mereka ke formulir komplain rahasia langsung ke pemilik bisnis, sehingga ulasan buruk tidak pernah dipublikasikan di Google Maps.
3. **Widget Social Proof Siap Tempel:** Menampilkan notifikasi popup melayang (*floating toast*), *Wall of Love* responsif, dan *Review Badge* di website mana pun hanya dengan menyalin 1 baris kode `<script>`.
4. **AI Auto-Responder:** Menggunakan PulseMind™ Neural Engine untuk menyusun 3 variasi balasan otomatis berbobot SEO untuk setiap ulasan pelanggan.

---

## 2. Struktur Modul & URL Rute

| Rute | Fungsi | Akses |
|---|---|---|
| `/` | Landing page komersial konversi tinggi dengan demo widget interaktif, kalkulator ROI agensi, dan tabel harga Stripe | Publik |
| `/r/[slug]` | Halaman funnel pengumpulan ulasan pintar (QR code scanning page dengan logika gatekeeper) | Publik |
| `/embed/[widgetId]` | Halaman preview iframe widget mandiri untuk disematkan di CMS (WordPress, Webflow, Shopify) | Publik / Cross-Origin |
| `/api/widget/[widgetId]` | JSON API cepat untuk render ulasan ke script widget eksternal | Publik (CORS Enabled) |
| `/dashboard` | Portal utama bisnis/agensi untuk memantau metrik ulasan, sentimen, dan pertumbuhan rating | Terproteksi / Demo Mode |
| `/dashboard/widgets` | Studio pembuat widget visual (kustomisasi warna, tema, posisi, interval loop) | Terproteksi |
| `/dashboard/shield` | Kotak masuk feedback privat (ulasan 1-3 bintang yang berhasil dicegat) | Terproteksi |
| `/dashboard/ai-replies` | Asisten balasan ulasan bertenaga PulseMind™ AI dengan 3 sudut pandang (SEO, Resolusi, Loyalitas) | Terproteksi |
| `/dashboard/importer` | Importer ulasan dari Google Places, Trustpilot, atau CSV file | Terproteksi |
| `/dashboard/agency` | Multi-workspace switcher untuk agensi mengelola puluhan klien bisnis | Terproteksi (Agency Plan) |

---

## 3. Logika Gatekeeper "Negative Review Shield"

```
[ Pelanggan Scan QR Code di Toko / Meja ]
                   │
                   ▼
       [ Halaman /r/nama-toko ]
"Bagaimana pengalaman Anda hari ini? (1 - 5 Bintang)"
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
  [ 4 atau 5 Bintang ]     [ 1, 2, atau 3 Bintang ]
       │                       │
       │                       ▼
       │               [ Perisai Aktif! ]
       │          "Mohon maaf kami mengecewakan Anda.
       │           Sampaikan keluhan Anda langsung ke
       │           manajer kami agar kami perbaiki."
       │                       │
       │                       ▼
       │               [ Form Feedback Privat ]
       │               (Tersimpan di TrustPulse,
       │                Kirim Notifikasi ke Manajer,
       │                TIDAK MASUK GOOGLE)
       ▼
 [ Tombol Copy & Redirect ke Google Maps ]
 "Terima kasih! Bantu kami dengan membagikan
  pengalaman Anda di Google dalam 10 detik."
       │
       ▼
 [ Google Business Profile Review Page ]
 (Rating Publik Tetap Tinggi 4.8 - 5.0)
```

---

## 4. Cara Embed Widget di Website Klien

### Opsi A: 1-Line Async Script (Rekomendasi untuk Webflow / HTML / Shopify)
```html
<script 
  src="https://trustpulse-ai.vercel.app/api/widget/script?id=WIDGET_ID" 
  defer>
</script>
```

### Opsi B: Responsive iFrame (Untuk WordPress / Wix)
```html
<iframe 
  src="https://trustpulse-ai.vercel.app/embed/WIDGET_ID" 
  width="100%" 
  height="600" 
  frameborder="0" 
  loading="lazy">
</iframe>
```

---

## 5. Estimasi Valuasi & Penjualan di Flippa

- **Kategori Listing:** Micro-SaaS / Turnkey B2B Agency Software
- **Perkiraan Harga Jual (Turnkey Awal):** $2,500 – $4,500
- **Perkiraan Harga Jual (Dengan 5–10 Klien Agensi Aktif):** $6,000 – $12,000+
- **Biaya Operasional Bulanan:** $0.00 / bulan
- **Margin Keuntungan Bersih:** 99%+
