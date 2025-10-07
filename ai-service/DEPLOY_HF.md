# 🚀 Hugging Face Spaces Deployment Talimatları

Bu dosya, AI servisini Hugging Face Spaces'e nasıl deploy edeceğinizi açıklar.

## 📋 Ön Gereksinimler

1. **Hugging Face Hesabı**
   - https://huggingface.co adresinden ücretsiz hesap oluşturun
   - Email adresinizi doğrulayın

2. **Hugging Face CLI** (Opsiyonel - Git ile de yapılabilir)
   ```bash
   pip install huggingface-hub
   huggingface-cli login
   ```

## 🎯 Deployment Yöntem 1: Web Arayüzü (Önerilen)

### Adım 1: Yeni Space Oluştur
1. https://huggingface.co/spaces adresine gidin
2. "Create new Space" butonuna tıklayın
3. Bilgileri doldurun:
   - **Space name**: `konusarak-ogren-sentiment` (veya istediğiniz isim)
   - **License**: MIT
   - **SDK**: Gradio
   - **Hardware**: CPU (basic - ücretsiz)
   - **Visibility**: Public veya Private

### Adım 2: Dosyaları Yükle
Space oluşturulduktan sonra, aşağıdaki dosyaları yükleyin:

**Yüklenecek dosyalar:**
```
ai-service/
├── README.md          ✅ (Hugging Face metadata içerir)
├── app.py            ✅ (Ana uygulama)
├── requirements.txt  ✅ (Python bağımlılıkları)
└── SENTIMENT_FIX.md  📄 (Opsiyonel - dokümantasyon)
```

**Web Arayüzünden Yükleme:**
1. Space sayfanızda "Files" sekmesine gidin
2. "Add file" → "Upload files" seçin
3. Yukarıdaki 3 dosyayı sürükleyin
4. Commit message yazın: "Initial deployment"
5. "Commit to main" butonuna tıklayın

### Adım 3: Build Sürecini İzle
- Space otomatik olarak build edilecek (2-5 dakika sürer)
- "Building" → "Running" durumuna geçince hazırdır
- Space URL'niz: `https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment`

## 🎯 Deployment Yöntem 2: Git ile (İleri Seviye)

### Adım 1: Space'i Clone'la
```bash
git clone https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment
cd konusarak-ogren-sentiment
```

### Adım 2: Dosyaları Kopyala
```powershell
# Windows PowerShell
Copy-Item ..\konusarakogren\ai-service\README.md .
Copy-Item ..\konusarakogren\ai-service\app.py .
Copy-Item ..\konusarakogren\ai-service\requirements.txt .
```

### Adım 3: Commit ve Push
```bash
git add .
git commit -m "Initial deployment: Sentiment analysis service"
git push
```

## 🔧 Backend Konfigürasyonu

Deployment sonrasında, backend'inizin AI servis URL'sini güncellemelisiniz:

### Render Deployment için:
1. Render Dashboard → Web Service'iniz → Environment
2. `AI_URL` değişkenini güncelleyin:
   ```
   AI_URL=https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment
   ```
3. "Save Changes" ve servisi yeniden başlatın

### Local Development için:
`backend/MessageApi/appsettings.Development.json`:
```json
{
  "AI_URL": "https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment"
}
```

## ✅ Deployment Doğrulama

### 1. Web Arayüzü Testi
- Space URL'nizi tarayıcıda açın
- Test mesajları deneyin:
  - "Bu harika bir gün!" → POSITIVE beklenilir
  - "Çok kötü bir deneyim" → NEGATIVE beklenilir
  - "Merhaba" → NEUTRAL beklenilir

### 2. API Testi
```bash
curl -X POST https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment/api/predict \
  -H "Content-Type: application/json" \
  -d '{"data": ["Bu harika bir mesaj!"]}'
```

Beklenen yanıt:
```json
{
  "data": ["POSITIVE", 0.81]
}
```

### 3. Backend Entegrasyon Testi
Backend API'nize bir mesaj gönderin ve sentiment analizi eklendiğini doğrulayın:
```bash
curl -X POST https://YOUR-BACKEND-URL/messages \
  -H "Content-Type: application/json" \
  -d '{"nickname": "Test", "content": "Harika bir uygulama!"}'
```

## 🎨 Space Özelleştirme (Opsiyonel)

README.md dosyasındaki metadata'yı düzenleyebilirsiniz:

```yaml
---
title: Konuşarak Öğren - Duygu Analizi  # Space başlığı
emoji: 🎭                                # Space ikonu
colorFrom: blue                          # Gradient başlangıç rengi
colorTo: purple                          # Gradient bitiş rengi
sdk: gradio                              # SDK (değiştirmeyin)
sdk_version: 4.44.0                      # Gradio versiyonu
app_file: app.py                         # Ana dosya
pinned: false                            # Profilinizde sabitle
license: mit                             # Lisans
---
```

## 🔍 Sorun Giderme

### Build Hatası
- **Logs** sekmesinden hata mesajlarını kontrol edin
- Genelde `requirements.txt` sorunları olur
- Gradio versiyonunu kontrol edin

### Yavaş Yanıt
- CPU basic ücretsiz tier yavaş olabilir
- Upgrade to GPU (ücretli) düşünebilirsiniz
- Veya model optimizasyonu yapabilirsiniz

### API 502 Hatası
- Space'in "Running" durumda olduğunu doğrulayın
- Space otomatik olarak sleep moduna geçebilir (ilk istek biraz yavaş olur)

## 📊 Sonraki Adımlar

1. ✅ Space'i test edin
2. ✅ Backend'e URL'yi ekleyin
3. ✅ Frontend/Mobile uygulamalardan test edin
4. 📈 Usage metrics'leri izleyin
5. 🚀 Production'a geçin!

## 🔗 Faydalı Linkler

- [Hugging Face Spaces Dokümantasyon](https://huggingface.co/docs/hub/spaces)
- [Gradio Dokümantasyon](https://www.gradio.app/docs)
- [Space örneği](https://huggingface.co/spaces/gradio/hello_world)

---

**Not:** İlk deployment sonrası Space URL'nizi `backend/MessageApi/appsettings.Production.json` dosyasına eklemeyi unutmayın!
