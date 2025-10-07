import gradio as gr
import re

def analyze_sentiment(text):
    """
    Enhanced rule-based sentiment analysis with better scoring
    Returns: [label, confidence_score]
    """
    if not text or text.strip() == "":
        return ["NEUTRAL", 0.5]
    
    try:
        text_lower = text.lower()
        
        positive_words = {
            'harika': 2, 'mükemmel': 2, 'muhteşem': 2, 'excellent': 2, 'amazing': 2, 
            'wonderful': 2, 'fantastic': 2, 'awesome': 2, 'brilliant': 2, 'outstanding': 2,
            'seviyorum': 2, 'love': 2, 'adore': 2,
            
            'güzel': 1.5, 'iyi': 1.5, 'başarılı': 1.5, 'süper': 1.5, 'mutlu': 1.5,
            'good': 1.5, 'great': 1.5, 'nice': 1.5, 'happy': 1.5, 'pleased': 1.5,
            'beğendim': 1.5, 'like': 1.5, 'enjoy': 1.5, 'perfect': 1.5,
            
            'fena değil': 0.8, 'idare eder': 0.8, 'okay': 0.8, 'fine': 0.8, 'alright': 0.8,
            'teşekkür': 0.8, 'thanks': 0.8, 'hoş': 0.8, 'tatlı': 0.8
        }
        
        negative_words = {
            'berbat': 2, 'korkunç': 2, 'iğrenç': 2, 'rezalet': 2, 'nefret': 2,
            'terrible': 2, 'horrible': 2, 'awful': 2, 'disgusting': 2, 'hate': 2,
            'worst': 2, 'pathetic': 2, 'atrocious': 2,
            
            'kötü': 1.5, 'berbat': 1.5, 'üzücü': 1.5, 'sinirli': 1.5, 'kızgın': 1.5,
            'bad': 1.5, 'sad': 1.5, 'angry': 1.5, 'disappointed': 1.5, 'annoying': 1.5,
            'beğenmedim': 1.5, 'dislike': 1.5, 'furious': 1.5,
            
            'eh': 1, 'sönük': 1, 'sıkıcı': 1, 'boring': 1, 'meh': 1, 'blah': 1
        }
        
        intensifiers = ['çok', 'very', 'really', 'extremely', 'so', 'too', 'quite', 'incredibly']
        negations = ['değil', 'yok', 'not', 'no', 'never', 'neither', 'nor', 'hiç']
        
        positive_score = 0
        negative_score = 0
        
        words = text_lower.split()
        for i, word in enumerate(words):
            multiplier = 1.3 if i > 0 and words[i-1] in intensifiers else 1.0
            
            negated = i > 0 and words[i-1] in negations
            
            if word in positive_words:
                score = positive_words[word] * multiplier
                if negated:
                    negative_score += score
                else:
                    positive_score += score
                    
            elif word in negative_words:
                score = negative_words[word] * multiplier
                if negated:
                    positive_score += score
                else:
                    negative_score += score
        
        if 'hiç beğenmedim' in text_lower or 'hiç iyi değil' in text_lower:
            negative_score += 2
        if 'çok güzel' in text_lower or 'çok iyi' in text_lower:
            positive_score += 2
            
        total_score = positive_score + negative_score
        
        if total_score == 0:
            return ["NEUTRAL", 0.55]
        
        if positive_score > negative_score:
            diff = positive_score - negative_score
            confidence = min(0.65 + (diff * 0.08), 0.98)
            return ["POSITIVE", round(confidence, 2)]
        elif negative_score > positive_score:
            diff = negative_score - positive_score
            confidence = min(0.65 + (diff * 0.08), 0.98)
            return ["NEGATIVE", round(confidence, 2)]
        else:
            return ["NEUTRAL", 0.60]
        
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return ["NEUTRAL", 0.5]

iface = gr.Interface(
    fn=analyze_sentiment,
    inputs=gr.Textbox(
        label="Mesaj",
        placeholder="Analiz edilecek mesajı buraya yazın...",
        lines=3
    ),
    outputs=[
        gr.Textbox(label="Duygu"),
        gr.Number(label="Güven Skoru")
    ],
    title="🎭 Duygu Analizi Servisi",
    description="Türkçe ve çok dilli metinler için duygu analizi yapan AI servisi. Mesajınızın pozitif, negatif veya nötr olduğunu belirler.",
    examples=[
        ["Bu harika bir gün! Çok mutluyum!"],
        ["Bu ürün berbat, hiç beğenmedim."],
        ["Bugün hava güzel ama biraz soğuk."],
        ["I love this product! It's amazing!"],
        ["This is terrible and disappointing."],
        ["Merhaba, nasılsın?"],
        ["Çok güzel bir film izledim."],
        ["Kötü bir deneyimdi, çok üzücü."]
    ],
    api_name="predict"
)

if __name__ == "__main__":
    iface.launch()
