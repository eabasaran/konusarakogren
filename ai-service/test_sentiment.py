"""
Test script for sentiment analysis
"""
import sys
sys.path.insert(0, '.')

from app import analyze_sentiment

# Test cases
test_cases = [
    ("Bu harika bir gün! Çok mutluyum!", "POSITIVE"),
    ("Bu ürün berbat, hiç beğenmedim.", "NEGATIVE"),
    ("Merhaba, nasılsın?", "NEUTRAL"),
    ("Çok güzel bir film izledim.", "POSITIVE"),
    ("Kötü bir deneyimdi, çok üzücü.", "NEGATIVE"),
    ("I love this product! It's amazing!", "POSITIVE"),
    ("This is terrible and disappointing.", "NEGATIVE"),
    ("Bugün hava güzel.", "POSITIVE"),
    ("Normal bir gün.", "NEUTRAL"),
    ("İğrenç ve korkunç bir şey.", "NEGATIVE"),
]

print("🎭 Duygu Analizi Test Sonuçları\n" + "="*60)

for text, expected in test_cases:
    result = analyze_sentiment(text)
    label, confidence = result
    status = "✅" if label == expected else "❌"
    
    print(f"\n{status} Metin: {text[:50]}...")
    print(f"   Beklenen: {expected}")
    print(f"   Sonuç: {label} (Güven: {confidence:.2f})")

print("\n" + "="*60)
