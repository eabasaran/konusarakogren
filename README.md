# Konuşarak Öğren - AI Destekli Chat Uygulaması

Bu proje, kullanıcıların mesajlaşarak sohbet edebildiği ve mesajların AI tarafından duygu analizi yapılarak canlı olarak gösterildiği bir web ve mobil uygulamasıdır.

## 🎯 Proje Özeti

Kullanıcılar chat ekranında mesaj yazabilir, gönderilen mesajlar otomatik olarak AI duygu analizi sistemine gönderilir ve pozitif/negatif/nötr değerlendirmesi anlık olarak görüntülenir.

## 🚀 Teknoloji Stack'i

- **Frontend**: React (Web) / React Native CLI (Mobil)
- **Backend**: .NET Core 7 + SQLite + Entity Framework
- **AI Servisi**: Python + Transformers + Gradio (Hugging Face Spaces)
- **Hosting**: 
  - Web: Vercel (Ücretsiz)
  - Backend: Render (Ücretsiz)
  - AI: Hugging Face Spaces (Ücretsiz)

## 📁 Proje Yapısı

```
konusarakogren/
├── frontend/          # React web uygulaması
├── mobile/            # React Native CLI mobil uygulama
├── backend/           # .NET Core API
│   └── MessageApi/    # Ana API projesi
│       ├── Models/    # Veri modelleri
│       ├── Data/      # Entity Framework DbContext
│       ├── Repositories/ # Veri erişim katmanı
│       └── Program.cs # API endpoints ve konfigürasyon
├── ai-service/        # Python duygu analizi servisi
│   ├── app.py        # Gradio API uygulaması
│   └── requirements.txt
└── README.md
```

## 🛠️ Kurulum Adımları

### 1. Backend (.NET Core API)

```bash
cd backend/MessageApi
dotnet restore
dotnet run
```

API şu endpoint'lerde çalışacak:
- `POST /messages` - Yeni mesaj gönder
- `GET /messages` - Tüm mesajları getir

### 2. AI Servisi (Hugging Face Spaces)

1. [Hugging Face](https://huggingface.co) hesabı oluşturun
2. Yeni bir Space oluşturun (Gradio + Python)
3. `ai-service/` klasöründeki dosyaları Space'e yükleyin
4. Space URL'ini backend `appsettings.json` dosyasında `AI_URL` olarak ayarlayın

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev    # Development
npm run build  # Production build
```

### 4. Mobile (React Native CLI)

```bash
cd mobile/KonusarakOgren
npm install
# iOS için
npx react-native run-ios
# Android için
npx react-native run-android
# APK build için
cd android && ./gradlew assembleRelease
```

## 🚀 Production Deployment

### Vercel (Frontend)
```bash
# Frontend klasöründe
vercel --prod
```

### Render (Backend)
1. GitHub repository'yi Render'a bağla
2. `render.yaml` dosyası otomatik deployment yapar
3. Environment variables ayarla

### Hugging Face Spaces (AI)
1. `ai-service/` klasörünü yeni Space'e yükle
2. `README.md` dosyasındaki metadata ile otomatik deploy

## 🤖 AI Araçları Kullanımı

### Elle Yazılan Kodlar:
- **Backend API endpoint'leri** (`Program.cs` - mesaj CRUD işlemleri)
- **Entity Framework model konfigürasyonları** (`MessageContext.cs`)
- **Repository pattern implementasyonu** (`MessageRepository.cs`)

### AI Destekli Yazılan Kodlar:
- Duygu analizi model entegrasyonu (Hugging Face Transformers)
- Frontend React bileşenleri (planlanmış)
- React Native mobil arayüzler (planlanmış)

## 📊 Duygu Analizi

AI servisi `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual` modelini kullanarak:
- Türkçe ve çok dilli metinleri destekler
- Pozitif/Negatif/Nötr sınıflandırması yapar
- 0.0-1.0 arası güven skoru sağlar

## 🔗 Demo Linkleri

- **🌐 Web Chat**: `konusarakogren.vercel.app` (Deploy edilecek)
- **🔧 API Backend**: `konusarakogren-api.onrender.com` (Deploy edilecek)
- **🤖 AI Duygu Analizi**: `https://huggingface.co/spaces/emineaycabasaran/konusarak-ogren-sentiment` ⚠️ **Manuel deploy gerekli**
- **📱 Mobile APK**: Android build hazır (emulator gerekli)
- **📂 GitHub**: https://github.com/eabasaran/konusarakogren

## 📋 Özellikler (MVP)

- [x] Mesaj gönderme ve listeleme API'si
- [x] SQLite veritabanı entegrasyonu
- [x] Duygu analizi AI servisi (Gelişmiş kural tabanlı sistem)
- [x] React web chat arayüzü (Vite + TypeScript)
- [x] React Native mobil uygulama (CLI kurulum + TypeScript)
- [x] API + AI servisi entegrasyonu
- [x] AsyncStorage ile kullanıcı adı kaydetme
- [x] Production-ready mobile app
- [ ] Production deployment (Vercel + Render)
- [ ] Android APK build
- [ ] Gerçek zamanlı güncellemeler (WebSocket)

## 🏗️ Geliştirme Planı

### 1. Gün (Tamamlandı ✅)
- GitHub repo oluşturma
- Hugging Face duygu analizi API'si hazırlama
- .NET backend ile mesaj kayıt API'si kurma

### 2. Gün (Tamamlandı ✅)
- React web frontend geliştirme (Vite + TypeScript)
- Backend + AI API entegrasyonu
- React Native CLI kurulum ve proje oluşturma
- Mobil chat uygulaması geliştirme (AsyncStorage, API calls)
- Vercel deployment hazırlığı

### 3. Gün (Tamamlandı ✅)
- Production build hazırlığı (Frontend + Backend)
- Render deployment konfigürasyonu
- Hugging Face Spaces hazırlığı
- Mobile production URL entegrasyonu
- Final dokümantasyon

## 🤝 Katkıda Bulunma

1. Repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
