# 📚 Proje Bölümleri ve Amaçları

Bu dokümantasyon, "Konuşarak Öğren" projesinin her bölümünün neden yapıldığını ve ne işe yaradığını açıklar.

## 🎯 Projenin Genel Amacı

Kullanıcıların mesajlaşabildiği ve her mesajın duygusunun (pozitif/negatif/nötr) yapay zeka tarafından analiz edildiği bir chat uygulaması geliştirmek. Bu uygulama hem web hem de mobil platformlarda çalışabilir.

---

## 1️⃣ Backend (API Servisi)

### 📂 Konum: `backend/MessageApi/`

### 🎯 Amaç
Tüm uygulamanın beyni olan backend, mesajları veritabanına kaydeder, saklar ve istendiğinde geri gönderir. Aynı zamanda AI servisine bağlanarak mesajların duygu analizini yapar.

### 🔧 Neler Yapıyor?

#### `Program.cs` - Ana Uygulama Dosyası
```csharp
// API endpoint'leri tanımlar
app.MapPost("/messages", ...)  // Mesaj gönderme
app.MapGet("/messages", ...)   // Mesajları listeleme
```

**Ne işe yarıyor?**
- Yeni mesaj geldiğinde veritabanına kaydeder
- AI servisine mesajı gönderir ve duygu analizi sonucunu alır
- Duygu analizini mesajla birlikte veritabanına kaydeder
- Frontend/Mobile'dan gelen isteklere cevap verir

#### `Models/Message.cs` - Veri Modeli
```csharp
public class Message {
    public int Id { get; set; }
    public string Nickname { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; }
    public string? SentimentLabel { get; set; }  // "POSITIVE", "NEGATIVE", "NEUTRAL"
    public double? SentimentScore { get; set; }   // 0.0 - 1.0 güven skoru
}
```

**Ne işe yarıyor?**
- Veritabanında mesajların nasıl saklanacağını tanımlar
- Her mesajın kullanıcı adı, içerik, tarih ve duygu bilgilerini tutar

#### `Data/MessageContext.cs` - Veritabanı Bağlantısı
```csharp
public class MessageContext : DbContext {
    public DbSet<Message> Messages { get; set; }
}
```

**Ne işe yarıyor?**
- Entity Framework ile SQLite veritabanına bağlanır
- Veritabanı tablolarını otomatik oluşturur
- CRUD işlemlerini kolaylaştırır

#### `Repositories/MessageRepository.cs` - Veri Erişim Katmanı
```csharp
public async Task AddAsync(Message message)
public async Task<List<Message>> GetAllAsync()
public async Task UpdateAsync(Message message)
```

**Ne işe yarıyor?**
- Veritabanı işlemlerini organize eder
- Kod tekrarını önler
- Veritabanı sorgularını tek bir yerden yönetir

### 💾 SQLite Veritabanı

**Neden SQLite?**
- ✅ Kolay kurulum - ayrı bir server gerektirmez
- ✅ Dosya tabanlı - `messages.db` tek dosyada tüm veriler
- ✅ Hafif ve hızlı
- ✅ Ücretsiz hosting platformlarında çalışır

**Ne işe yarıyor?**
- Tüm mesajları kalıcı olarak saklar
- Uygulama kapansa bile veriler kaybolmaz
- Mesaj geçmişini tutar

---

## 2️⃣ AI Service (Duygu Analizi)

### 📂 Konum: `ai-service/`

### 🎯 Amaç
Gelen mesajların duygusunu (pozitif/negatif/nötr) analiz eder ve güven skoruyla birlikte sonuç döner.

### 🔧 Neler Yapıyor?

#### `app.py` - Ana AI Servisi
```python
def analyze_sentiment(text):
    # Mesajdaki kelimeleri analiz eder
    # Pozitif kelimeler: harika, güzel, mükemmel...
    # Negatif kelimeler: kötü, berbat, üzücü...
    
    positive_score = 2.5  # Örnek
    negative_score = 0.0
    
    return ["POSITIVE", 0.81]  # Label ve güven skoru
```

**Nasıl Çalışıyor?**

1. **Kelime Veri Tabanı** (300+ kelime)
   - Pozitif kelimeler ağırlıklarıyla: "harika" (2.0), "güzel" (1.5)
   - Negatif kelimeler ağırlıklarıyla: "berbat" (2.0), "kötü" (1.5)

2. **Ağırlıklandırılmış Skorlama**
   ```
   "Bu çok güzel bir film!" 
   → "güzel" (1.5 puan) + "çok" güçlendirici (×1.3) = 1.95 puan
   → POSITIVE (0.97 güven skoru)
   ```

3. **Negation (Olumsuzluk) Algılama**
   ```
   "Bu film güzel değil"
   → "güzel" kelimesi var AMA "değil" var
   → Duygu tersine çevrilir → NEGATIVE
   ```

4. **Intensifier (Güçlendirici) Desteği**
   ```
   "çok", "very", "really" → %30 skor artışı
   "Bu çok harika!" daha yüksek skor alır
   ```

**Neden Kural Tabanlı Sistem?**
- ✅ Hızlı yanıt (< 100ms)
- ✅ İnternet bağlantısı gerektirmez
- ✅ Tahmin edilebilir sonuçlar
- ✅ Türkçe'ye özel optimize edilebilir
- ✅ Ücretsiz (API limiti yok)

#### `requirements.txt` - Python Bağımlılıkları
```
gradio==4.44.0        # Web arayüzü ve API
```

**Ne işe yarıyor?**
- Gradio: Hem görsel arayüz hem de REST API sağlar
- Browser'da test edilebilir arayüz
- `/api/predict` endpoint'i ile API erişimi

---

## 3️⃣ Frontend (Web Uygulaması)

### 📂 Konum: `frontend/`

### 🎯 Amaç
Kullanıcıların tarayıcıdan mesaj gönderebildiği ve gelen mesajların duygularını renklerle görebildiği modern bir chat arayüzü.

### 🔧 Neler Yapıyor?

#### `src/App.tsx` - Ana React Bileşeni
```typescript
const [messages, setMessages] = useState<Message[]>([]);

// Backend'den mesajları çek
const loadMessages = async () => {
    const response = await fetch(`${API_BASE}/messages`);
    const data = await response.json();
    setMessages(data);
};

// Yeni mesaj gönder
const sendMessage = async () => {
    await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        body: JSON.stringify({ nickname, content })
    });
};
```

**Kullanıcı Arayüzü Özellikleri:**
- 📝 Mesaj yazma kutusu
- 👤 Kullanıcı adı girişi
- 📊 Mesaj listesi
- 🎨 Duygu renklendirmesi:
  - 🟢 Yeşil: POSITIVE
  - 🔴 Kırmızı: NEGATIVE
  - ⚪ Gri: NEUTRAL
- ⏱️ Otomatik yenileme (5 saniyede bir)

#### Neden React + Vite + TypeScript?
- **React**: Popüler, kolay öğrenilir, güçlü topluluk
- **Vite**: Çok hızlı development server ve build
- **TypeScript**: Hataları önceden yakalar, kod kalitesi artar

---

## 4️⃣ Mobile (Mobil Uygulama)

### 📂 Konum: `mobile/KonusarakOgren/`

### 🎯 Amaç
Aynı chat uygulamasının Android ve iOS telefonlarda çalışan versiyonu.

### 🔧 Neler Yapıyor?

#### `src/screens/ChatScreen.tsx`
```typescript
// AsyncStorage ile kullanıcı adını kaydet
await AsyncStorage.setItem('nickname', nickname);

// Uygulama açılınca son kullanılan adı yükle
const savedNickname = await AsyncStorage.getItem('nickname');
```

**Özellikler:**
- 📱 Native iOS/Android görünümü
- 💾 Kullanıcı adını hatırlar (AsyncStorage)
- 🔄 Pull-to-refresh (aşağı çekerek yenile)
- ⌨️ Keyboard-aware (klavye açılınca UI uyum sağlar)
- 🎨 Platform-specific tasarım (iOS/Android farkları)

#### Neden React Native CLI?
- ✅ Tek kod, iki platform (iOS + Android)
- ✅ Native performans
- ✅ Gerçek uygulama store'lara yüklenebilir
- ✅ React bilgisiyle mobile geliştirme

---

## 🔄 Sistemin Çalışma Akışı

### Kullanıcı Mesaj Gönderdiğinde:

```
1. FRONTEND/MOBILE
   ↓ (HTTP POST /messages)
   
2. BACKEND API
   ↓ Mesajı veritabanına kaydet
   ↓ (HTTP POST /api/predict)
   
3. AI SERVICE
   ↓ Duygu analizi yap
   ↓ Sonuç: ["POSITIVE", 0.81]
   
4. BACKEND API
   ↓ Duygu sonucunu mesaja ekle
   ↓ Veritabanını güncelle
   ↓ (HTTP Response)
   
5. FRONTEND/MOBILE
   ✅ Mesajı yeşil/kırmızı/gri göster
```

### Otomatik Yenileme:

```
Her 5 saniyede bir:

FRONTEND → GET /messages → BACKEND
           ← Tüm mesajlar ←

Ekranı güncelle
```

---

## 📦 Neden Bu Teknolojiler?

### Backend: .NET Core 7
- ✅ **Hızlı**: C# performanslı bir dil
- ✅ **Cross-platform**: Windows, Linux, Mac'te çalışır
- ✅ **Ücretsiz hosting**: Render.com gibi platformlarda ücretsiz
- ✅ **Entity Framework**: Veritabanı işlemleri kolay

### Frontend: React + Vite
- ✅ **Popüler**: İş bulurken avantaj
- ✅ **Hızlı development**: Vite çok hızlı
- ✅ **TypeScript**: Güvenli kod yazımı
- ✅ **Ücretsiz hosting**: Vercel ücretsiz

### Mobile: React Native
- ✅ **Tek kod, iki platform**: Zaman tasarrufu
- ✅ **React bilgisi yeterli**: Yeni dil öğrenmeye gerek yok
- ✅ **Güçlü ekosistem**: Binlerce hazır kütüphane

### AI: Python + Gradio
- ✅ **Python**: AI/ML için en popüler dil
- ✅ **Gradio**: Hem UI hem API
- ✅ **Hızlı**: Kural tabanlı sistem milisaniyeler içinde yanıt verir

### Database: SQLite
- ✅ **Basit**: Tek dosya
- ✅ **Kurulum gerektirmez**: Embedded veritabanı
- ✅ **Ücretsiz**: Hosting maliyeti yok

---

## 🎓 Öğrenilen Konular

### 1. Full Stack Development
- Frontend, Backend, Mobile ayrımı
- API tasarımı ve RESTful prensipler
- Client-Server mimarisi

### 2. Veritabanı Yönetimi
- ORM (Object-Relational Mapping)
- Entity Framework kullanımı
- CRUD işlemleri

### 3. API Entegrasyonu
- HTTP istekleri (GET, POST)
- JSON veri formatı
- Async/await programlama

### 4. Duygu Analizi (NLP)
- Doğal dil işleme temelleri
- Kural tabanlı sistemler
- Skor hesaplama algoritmaları

### 5. Modern Geliştirme Araçları
- Git/GitHub version control
- TypeScript tip güvenliği
- Vite build tool
- Gradio rapid prototyping

### 6. Deployment & DevOps
- Environment variables
- Production vs Development ayarları
- Cloud hosting hazırlığı

---

## 🚀 Projenin Gerçek Dünya Kullanımı

### Eğitim Platformları
- Öğrenci yorumlarının otomatik analizi
- Memnuniyet ölçümü
- Erken uyarı sistemi (negatif geri bildirimler)

### Müşteri Hizmetleri
- Şikayet tespiti
- Önceliklendirme (çok negatif mesajlar önce)
- Otomatik kategorizasyon

### Sosyal Medya Analizi
- Marka algısı takibi
- Kampanya etkinliği ölçümü
- Trend analizi

### Mental Sağlık
- Ruh hali takibi
- Günlük duygu kayıtları
- Psikolog için veri sağlama

---

## 💡 Proje Geliştirme Fırsatları

### Kısa Vadeli İyileştirmeler
1. ✨ Emoji desteği ekle
2. 🔍 Mesaj arama özelliği
3. 🗑️ Mesaj silme
4. ✏️ Mesaj düzenleme
5. 👥 Kullanıcı profilleri

### Orta Vadeli
1. 🔐 Kullanıcı authentication (giriş/kayıt)
2. 🎨 Tema değiştirme (dark/light mode)
3. 📊 İstatistik sayfası (günlük duygu grafiği)
4. 🔔 Bildirimler
5. 💬 Gerçek zamanlı mesajlaşma (WebSocket)

### Uzun Vadeli
1. 🤖 Gelişmiş AI modeli (BERT, Transformer)
2. 🌍 Çoklu dil desteği
3. 🏢 Çoklu workspace/kanal
4. 📱 Video/ses mesaj desteği
5. 🔗 Üçüncü parti entegrasyonlar (Slack, Teams)

---

## 📝 Özet

Bu proje, modern web ve mobil uygulama geliştirmenin temel taşlarını içerir:
- **Backend API** ile veri yönetimi
- **AI servisi** ile akıllı özellikler
- **Frontend** ile kullanıcı deneyimi
- **Mobile** ile cross-platform erişim

Her bölüm, birbirine bağlı ama bağımsız çalışabilen bir mikroservis mantığıyla tasarlanmıştır. Bu sayede:
- 🔄 Bir servis değiştirildiğinde diğerleri etkilenmez
- 📊 Her servis bağımsız ölçeklendirilebilir
- 🐛 Hata ayıklama kolaydır
- 👥 Ekip çalışmasına uygundur

**Sonuç**: Hem öğrenme hem de gerçek dünya problemlerini çözmeye uygun, production-ready bir full-stack projedir. 🎉
