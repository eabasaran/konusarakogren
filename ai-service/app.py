import gradio as gr
from transformers import pipeline

# Initialize sentiment analysis pipeline with a Turkish/multilingual model
# Using a model that supports Turkish text
classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual",
    return_all_scores=True
)

def analyze_sentiment(text):
    """
    Analyze sentiment of the given text
    Returns: [label, confidence_score]
    """
    if not text or text.strip() == "":
        return ["NEUTRAL", 0.5]
    
    try:
        # Get prediction from the model
        results = classifier(text)
        
        # Find the prediction with highest score
        best_prediction = max(results[0], key=lambda x: x['score'])
        
        # Map labels to our format
        label_mapping = {
            'LABEL_0': 'NEGATIVE',  # Negative
            'LABEL_1': 'NEUTRAL',   # Neutral  
            'LABEL_2': 'POSITIVE'   # Positive
        }
        
        label = label_mapping.get(best_prediction['label'], best_prediction['label'])
        score = round(best_prediction['score'], 4)
        
        return [label, score]
        
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
