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

Bu AI servisi, Türkçe ve çok dilli metinler için duygu analizi yapar.

## 🚀 Özellikler

- 🌍 **Çok Dilli Destek**: Türkçe, İngilizce ve diğer diller
- ⚡ **Hızlı Analiz**: BERT tabanlı model
- 🎯 **3 Sınıf**: Pozitif, Negatif, Nötr
- 📊 **Güven Skoru**: 0.0-1.0 arası

## 🤖 Kullanılan Model

`nlptown/bert-base-multilingual-uncased-sentiment`

## 📡 API Kullanımı

```python
import requests

response = requests.post(
    "https://huggingface.co/spaces/eabasaran/konusarakogren-sentiment/api/predict",
    json={"data": ["Analiz edilecek mesaj"]}
)
```

## 🛠️ Yerel Çalıştırma

```bash
pip install -r requirements.txt
python app.py
```
