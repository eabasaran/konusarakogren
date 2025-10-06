# 🎭 Duygu Analizi AI Servisi

Bu Hugging Face Space, Türkçe ve çok dilli mesajların duygu analizini gerçekleştiren bir AI servisidir.

## 🚀 Özellikler

- **Çok Dilli Destek**: Türkçe, İngilizce ve diğer diller
- **Hızlı Analiz**: Transformers tabanlı model
- **3 Sınıf**: Pozitif, Negatif, Nötr
- **Güven Skoru**: 0.0-1.0 arası

## 🤖 Kullanılan Model

`cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`

## 📡 API Kullanımı

```python
import requests

response = requests.post(
    "https://huggingface.co/spaces/YOUR_USERNAME/sentiment-analysis/api/predict",
    json={"data": ["Analiz edilecek mesaj"]}
)
```

## 🛠️ Yerel Çalıştırma

```bash
pip install -r requirements.txt
python app.py
```
