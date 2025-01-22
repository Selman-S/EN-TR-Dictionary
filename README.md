# 📚 Türkçe-İngilizce Sözlük

Modern ve kullanıcı dostu bir web uygulaması olan bu sözlük, dil öğrenenler ve çevirmenler için kapsamlı bir Türkçe-İngilizce çeviri aracıdır.

## ✨ Özellikler

- **Çift Dilli Arama**
  - Türkçe'den İngilizce'ye
  - İngilizce'den Türkçe'ye
  - Anlık arama önerileri

- **Telaffuz Desteği** 🔊
  - İngilizce kelimeler için Free Dictionary API
  - Türkçe kelimeler için tarayıcı ses sentezi

- **Detaylı Kelime Bilgisi**
  - Çoklu çeviriler ve anlamlar
  - Kelime türleri (isim, fiil, sıfat vb.)
  - Örnek cümleler
  - CEFR seviye gösterimi (A1-C2)

- **Kullanıcı Deneyimi**
  - Koyu/Açık tema desteği
  - Mobil uyumlu tasarım
  - Sade ve modern arayüz

## 🔧 Teknolojiler

- **Frontend**
  - Next.js 14.1.0
  - TypeScript
  - Tailwind CSS
  - Material UI

- **API**
  - RESTful mimari
  - Free Dictionary API entegrasyonu

## 💻 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/turkce-ingilizce-sozluk.git
```

2. Proje dizinine gidin:
```bash
cd turkce-ingilizce-sozluk
```

3. Bağımlılıkları yükleyin:
```bash
npm install
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## ⚙️ Ortam Değişkenleri

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
API_URL=api_adresiniz
# Diğer gerekli ortam değişkenleri
```

## 📁 Proje Yapısı

```
src/
├── app/           # Next.js uygulama dizini
├── components/    # Yeniden kullanılabilir bileşenler
├── hooks/         # Özel React hook'ları
├── styles/        # Global stiller
└── types/         # TypeScript tip tanımlamaları
```

## 🧪 Test

```bash
npm run test
```

## 🚀 Canlıya Alma

Vercel ile hızlı deployment:

1. GitHub'a kodunuzu gönderin
2. Vercel'de projenizi import edin
3. Otomatik dağıtım başlayacaktır

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Yeni bir branch oluşturun (`git checkout -b ozellik/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin ozellik/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👥 Geliştiriciler

- [GitHub Profiliniz](https://github.com/kullaniciadi)

## 🙏 Teşekkürler

- Free Dictionary API ekibine
- Projeye katkıda bulunan herkese

---

### 🌟 Bizi Destekleyin

- Projeye yıldız verin ⭐
- Hataları bildirin 🐛
- Özellik önerilerinde bulunun 💡
