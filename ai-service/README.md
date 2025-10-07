---
title: Konuşarak Öğren - Duygu Analizi
emoji: 🎭
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---

# 🎭 Konuşarak Öğren - Duygu Analizi Servisi

Bu AI servisi, Türkçe ve çok dilli metinler için gelişmiş duygu analizi yapar.

## 🚀 Özellikler

- 🌍 **Çok Dilli Destek**: Türkçe, İngilizce ve diğer diller
- ⚡ **Gelişmiş Analiz**: Ağırlıklandırılmış kelime skorlama sistemi
- 🎯 **3 Sınıf**: Pozitif, Negatif, Nötr
- 📊 **Güven Skoru**: 0.55-0.98 arası dinamik skorlama
- 🔍 **Intensifier Desteği**: "çok", "very" gibi güçlendiricileri algılar
- ↔️ **Negation Desteği**: "değil", "not" gibi olumsuzlukları algılar

## 🤖 Analiz Yöntemi

Kural tabanlı (rule-based) duygu analizi sistemi:
- **300+ kelime** veri tabanı (Türkçe + İngilizce)
- **Ağırlıklandırılmış skorlama**: Yüksek (2.0), Orta (1.5), Düşük (0.8)
- **Güçlendirici desteği**: %30 skor artışı
- **Olumsuzluk algılama**: Duygu tersine çevirme

### Örnek Analizler
```
✅ "Bu harika bir gün! Çok mutluyum!" → POSITIVE (0.81)
✅ "Bu ürün berbat, hiç beğenmedim." → NEGATIVE (0.81)
✅ "Çok güzel bir film izledim." → POSITIVE (0.97)
✅ "Merhaba, nasılsın?" → NEUTRAL (0.55)
```

## 📡 API Kullanımı

### Hugging Face Spaces'te Deploy Edilmiş Versiyon

```python
import requests

response = requests.post(
    "https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment/api/predict",
    json={"data": ["Analiz edilecek mesaj"]}
)

# Beklenen yanıt: {"data": ["POSITIVE", 0.81]}
```

### cURL ile Test

```bash
curl -X POST https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment/api/predict \
  -H "Content-Type: application/json" \
  -d '{"data": ["Bu harika bir gün!"]}'
```

## 🛠️ Yerel Çalıştırma

```bash
# Sanal ortam oluştur (opsiyonel)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Bağımlılıkları yükle
pip install -r requirements.txt

# Uygulamayı başlat
python app.py
```

Gradio arayüzü http://127.0.0.1:7860 adresinde açılacak.

## 🧪 Test

Otomatik test script'i ile:

```bash
python test_sentiment.py
```

10 farklı test senaryosu ile %90 doğruluk oranı.

## 🚀 Hugging Face Spaces'e Deployment

Detaylı talimatlar için: **[DEPLOY_HF.md](DEPLOY_HF.md)**

### Hızlı Başlangıç

1. https://huggingface.co/spaces adresine gidin
2. "Create new Space" → Gradio seçin
3. Şu dosyaları yükleyin:
   - `README.md` (metadata içerir)
   - `app.py` (ana uygulama)
   - `requirements.txt` (bağımlılıklar)
4. Otomatik build başlayacak (2-5 dakika)
5. Space hazır! 🎉

## 🔧 Backend Entegrasyonu

Space deploy edildikten sonra, backend'inizde AI URL'yi güncelleyin:

**appsettings.Production.json:**
```json
{
  "AI_URL": "https://huggingface.co/spaces/KULLANICI_ADI/konusarak-ogren-sentiment"
}
```

## 📚 Dokümantasyon

- **[SENTIMENT_FIX.md](SENTIMENT_FIX.md)** - Duygu analizi düzeltme detayları
- **[DEPLOY_HF.md](DEPLOY_HF.md)** - Hugging Face deployment talimatları

## 📊 Performans

- **Doğruluk**: ~90% (test set üzerinde)
- **Yanıt Süresi**: <100ms (local), <500ms (HF Spaces CPU)
- **Desteklenen Diller**: Türkçe (öncelikli), İngilizce, ve diğer Latin alfabesi dilleri
