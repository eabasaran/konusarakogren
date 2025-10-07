import gradio as gr
import re

# Simple rule-based sentiment analysis for MVP testing
# In production, this would be replaced with a proper ML model

def analyze_sentiment(text):
    """
    Simple rule-based sentiment analysis for MVP testing
    Returns: [label, confidence_score]
    """
    if not text or text.strip() == "":
        return ["NEUTRAL", 0.5]
    
    try:
        text_lower = text.lower()
        
        # Positive keywords (Turkish and English)
        positive_words = [
            'harika', 'güzel', 'mükemmel', 'süper', 'başarılı', 'mutlu', 'seviyorum', 
            'beğendim', 'iyi', 'excellent', 'great', 'good', 'amazing', 'wonderful',
            'love', 'like', 'fantastic', 'awesome', 'perfect', 'happy', 'pleased'
        ]
        
        # Negative keywords (Turkish and English)
        negative_words = [
            'kötü', 'berbat', 'korkunç', 'üzücü', 'kızgın', 'sinirli', 'nefret',
            'beğenmedim', 'bad', 'terrible', 'horrible', 'awful', 'hate', 'angry',
            'sad', 'disappointed', 'worst', 'disgusting', 'annoying', 'furious'
        ]
        
        positive_score = sum(1 for word in positive_words if word in text_lower)
        negative_score = sum(1 for word in negative_words if word in text_lower)
        
        # Determine sentiment based on keyword counts
        if positive_score > negative_score:
            confidence = min(0.7 + (positive_score * 0.1), 0.95)
            return ["POSITIVE", confidence]
        elif negative_score > positive_score:
            confidence = min(0.7 + (negative_score * 0.1), 0.95)
            return ["NEGATIVE", confidence]
        else:
            return ["NEUTRAL", 0.6]
        
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return ["NEUTRAL", 0.5]

# Create Gradio interface
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
        ["Bu harika bir gün!"],
        ["Çok üzgünüm bu duruma."],
        ["Bugün hava güzel."],
        ["I love this product!"],
        ["This is terrible."]
    ],
    api_name="predict"
)

if __name__ == "__main__":
    iface.launch()
