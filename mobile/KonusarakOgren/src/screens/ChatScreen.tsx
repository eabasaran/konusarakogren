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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: number;
  nickname: string;
  content: string;
  sentAt: string;
  sentimentLabel?: string;
  sentimentScore?: number;
}

const API_BASE = 'https://konusarakogren-api.onrender.com'; // Production API URL

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // AsyncStorage'dan kullanıcı adını yükle
  useEffect(() => {
    loadStoredNickname();
    loadMessages();
  }, []);

  const loadStoredNickname = async () => {
    try {
      const storedNickname = await AsyncStorage.getItem('nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      }
    } catch (error) {
      console.error('Kullanıcı adı yüklenirken hata:', error);
    }
  };

  const saveNickname = async (name: string) => {
    try {
      await AsyncStorage.setItem('nickname', name);
    } catch (error) {
      console.error('Kullanıcı adı kaydedilemedi:', error);
    }
  };

  // Mesajları yükle
  const loadMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const response = await fetch(`${API_BASE}/messages`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      Alert.alert(
        'Bağlantı Hatası', 
        'Mesajlar yüklenemedi. İnternet bağlantınızı kontrol edin.',
        [
          { text: 'Tekrar Dene', onPress: loadMessages },
          { text: 'Tamam', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Yeni mesaj gönder
  const sendMessage = async () => {
    if (!nickname.trim()) {
      Alert.alert('Uyarı', 'Lütfen kullanıcı adınızı girin');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Uyarı', 'Lütfen mesajınızı yazın');
      return;
    }

    setIsLoading(true);
    
    try {
      // Kullanıcı adını kaydet
      await saveNickname(nickname.trim());
      
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

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setContent('');
      // Mesajları yenile
      await loadMessages();
      
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      Alert.alert(
        'Gönderim Hatası', 
        'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
        [
          { text: 'Tekrar Dene', onPress: sendMessage },
          { text: 'Tamam', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Duygu analizi rengini belirle
  const getSentimentColor = (label?: string): string => {
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

  const getSentimentText = (label?: string): string => {
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
        return 'Analiz ediliyor...';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎭 Konuşarak Öğren</Text>
          <Text style={styles.subtitle}>AI destekli duygu analizi chat</Text>
        </View>

        {/* Messages List */}
        <ScrollView 
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingMessages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
            </View>
          ) : messages.length === 0 ? (
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
                <View style={styles.sentimentContainer}>
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
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.nicknameInput}
            placeholder="Kullanıcı adınız..."
            value={nickname}
            onChangeText={setNickname}
            maxLength={50}
          />
          
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Mesajınızı yazın..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={3}
              maxLength={1000}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (isLoading || !nickname.trim() || !content.trim()) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={isLoading || !nickname.trim() || !content.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
  noMessages: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: 30,
    fontSize: 16,
  },
  message: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#2c3e50',
    marginBottom: 10,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentiment: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sentimentScore: {
    fontWeight: 'normal',
    fontSize: 12,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatScreen;
