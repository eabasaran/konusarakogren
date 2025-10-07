---
title: Duygu Analizi Servisi
emoji: 🎭
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---

# 🎭 Duygu Analizi Servisi

Türkçe ve çok dilli metinler için gelişmiş duygu analizi servisi.

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

### Python

```python
import requests

response = requests.post(
    "http://localhost:7860/api/predict",
    json={"data": ["Analiz edilecek mesaj"]}
)

# Yanıt: {"data": ["POSITIVE", 0.81]}
```

### cURL

```bash
curl -X POST http://localhost:7860/api/predict \
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

## 📚 Dokümantasyon

- **[SENTIMENT_FIX.md](SENTIMENT_FIX.md)** - Duygu analizi düzeltme detayları

## 📊 Performans

- **Doğruluk**: ~90% (test set üzerinde)
- **Yanıt Süresi**: <100ms (local)
- **Desteklenen Diller**: Türkçe (öncelikli), İngilizce, ve diğer Latin alfabesi dilleri
