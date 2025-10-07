import { useState, useEffect } from 'react'
import './App.css'

interface Message {
  id: number;
  nickname: string;
  content: string;
  sentAt: string;
  sentimentLabel?: string;
  sentimentScore?: number;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5087';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mesajları yükle
  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    }
  };

  // Yeni mesaj gönder
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: nickname.trim(), content: content.trim() })
      });

      if (response.ok) {
        setContent('');
        loadMessages(); // Mesajları yenile
      }
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sayfa yüklendiğinde mesajları getir
  useEffect(() => {
    loadMessages();
  }, []);

  // Duygu analizi renklerini belirle
  const getSentimentColor = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'positive':
      case 'label_2':
        return '#28a745';
      case 'negative':
      case 'label_0':
        return '#dc3545';
      case 'neutral':
      case 'label_1':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getSentimentText = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'positive':
      case 'label_2':
        return 'Pozitif 😊';
      case 'negative':
      case 'label_0':
        return 'Negatif 😔';
      case 'neutral':
      case 'label_1':
        return 'Nötr 😐';
      default:
        return 'Analiz edilmedi';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎭 Konuşarak Öğren</h1>
        <p>AI destekli duygu analizi ile chat uygulaması</p>
      </header>

      <main className="chat-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">Henüz mesaj yok. İlk mesajı siz gönderin! 🚀</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="message">
                <div className="message-header">
                  <strong>{message.nickname}</strong>
                  <span className="message-time">
                    {new Date(message.sentAt).toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
                <div 
                  className="message-sentiment"
                  style={{ color: getSentimentColor(message.sentimentLabel) }}
                >
                  {getSentimentText(message.sentimentLabel)}
                  {message.sentimentScore && (
                    <span className="sentiment-score">
                      ({(message.sentimentScore * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Kullanıcı adınız..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="nickname-input"
            />
          </div>
          <div className="form-row">
            <textarea
              placeholder="Mesajınızı yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '🚀'} Gönder
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default App
