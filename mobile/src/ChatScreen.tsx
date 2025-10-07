import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface Message {
  id: number;
  nickname: string;
  content: string;
  sentAt: string;
  sentimentLabel?: string;
  sentimentScore?: number;
}

const API_BASE = 'http://localhost:5087'; // Production'da değiştirilecek

export default function ChatScreen() {
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
      Alert.alert('Hata', 'Mesajlar yüklenemedi');
    }
  };

  // Yeni mesaj gönder
  const sendMessage = async () => {
    if (!nickname.trim() || !content.trim()) {
      Alert.alert('Uyarı', 'Lütfen kullanıcı adı ve mesaj girin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nickname: nickname.trim(), 
          content: content.trim() 
        })
      });

      if (response.ok) {
        setContent('');
        loadMessages();
      } else {
        Alert.alert('Hata', 'Mesaj gönderilemedi');
      }
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      Alert.alert('Hata', 'Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  };

  // Sayfa yüklendiğinde mesajları getir
  useEffect(() => {
    loadMessages();
  }, []);

  // Duygu analizi rengini belirle
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎭 Konuşarak Öğren</Text>
        <Text style={styles.subtitle}>AI destekli duygu analizi chat</Text>
      </View>

      <ScrollView style={styles.messagesList}>
        {messages.length === 0 ? (
          <Text style={styles.noMessages}>
            Henüz mesaj yok. İlk mesajı siz gönderin! 🚀
          </Text>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.message}>
              <View style={styles.messageHeader}>
                <Text style={styles.nickname}>{message.nickname}</Text>
                <Text style={styles.timestamp}>
                  {new Date(message.sentAt).toLocaleString('tr-TR')}
                </Text>
              </View>
              <Text style={styles.messageContent}>{message.content}</Text>
              <Text 
                style={[
                  styles.sentiment, 
                  { color: getSentimentColor(message.sentimentLabel) }
                ]}
              >
                {getSentimentText(message.sentimentLabel)}
                {message.sentimentScore && (
                  <Text style={styles.sentimentScore}>
                    {' '}({(message.sentimentScore * 100).toFixed(1)}%)
                  </Text>
                )}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.nicknameInput}
          placeholder="Kullanıcı adınız..."
          value={nickname}
          onChangeText={setNickname}
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Mesajınızı yazın..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Gönder</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  messagesList: {
    flex: 1,
    padding: 15,
  },
  noMessages: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: 20,
  },
  message: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nickname: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  messageContent: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  sentiment: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sentimentScore: {
    fontWeight: 'normal',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
