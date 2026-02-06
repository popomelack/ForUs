import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { messages as mockMessages, conversations as mockConversations } from '../../services/mockData';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const conversation = mockConversations.find(c => c.id === id);
  const otherParticipant = conversation?.participants.find(p => p.id !== 'user-1');
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load mock messages and transform them
    const chatMessages = mockMessages
      .filter(m => m.conversationId === id)
      .map(m => ({
        ...m,
        isOwn: m.senderId === 'user-1',
      }));
    setMessages(chatMessages);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [id]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'Vous',
      senderAvatar: '',
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <MaterialIcons name="error-outline" size={60} color={theme.error} />
          <Text style={styles.errorText}>Conversation introuvable</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        
        <Pressable style={styles.headerInfo}>
          <Image
            source={{ uri: otherParticipant?.avatar }}
            style={styles.headerAvatar}
            contentFit="cover"
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{otherParticipant?.name}</Text>
            <Text style={styles.headerStatus}>En ligne</Text>
          </View>
        </Pressable>
        
        <View style={styles.headerActions}>
          <Pressable style={styles.headerActionBtn}>
            <MaterialIcons name="phone" size={22} color={theme.textPrimary} />
          </Pressable>
          <Pressable style={styles.headerActionBtn}>
            <MaterialIcons name="more-vert" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Property Context */}
      {conversation.propertyTitle && (
        <Pressable 
          style={styles.propertyContext}
          onPress={() => router.push(`/property/${conversation.propertyId}`)}
        >
          <MaterialIcons name="home" size={18} color={theme.primary} />
          <Text style={styles.propertyContextText} numberOfLines={1}>
            {conversation.propertyTitle}
          </Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </Pressable>
      )}

      {/* Messages */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
              style={[
                styles.messageWrapper,
                message.isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther
              ]}
            >
              {!message.isOwn && (
                <Image
                  source={{ uri: message.senderAvatar || otherParticipant?.avatar }}
                  style={styles.messageAvatar}
                  contentFit="cover"
                />
              )}
              <View style={[
                styles.messageBubble,
                message.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther
              ]}>
                <Text style={[
                  styles.messageText,
                  message.isOwn && styles.messageTextOwn
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.isOwn && styles.messageTimeOwn
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <Pressable style={styles.attachBtn}>
            <MaterialIcons name="add" size={24} color={theme.textSecondary} />
          </Pressable>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Écrire un message..."
              placeholderTextColor={theme.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <Pressable style={styles.emojiBtn}>
              <MaterialIcons name="emoji-emotions" size={22} color={theme.textMuted} />
            </Pressable>
          </View>
          <Pressable 
            style={[
              styles.sendBtn,
              messageText.trim() && styles.sendBtnActive
            ]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <MaterialIcons 
              name="send" 
              size={20} 
              color={messageText.trim() ? '#FFF' : theme.textMuted} 
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {},
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  headerStatus: {
    fontSize: 12,
    color: theme.success,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyContext: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.primaryBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    gap: 8,
  },
  propertyContextText: {
    flex: 1,
    fontSize: 13,
    color: theme.primary,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageWrapperOwn: {
    justifyContent: 'flex-end',
  },
  messageWrapperOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleOwn: {
    backgroundColor: theme.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 4,
    ...shadows.sm,
  },
  messageText: {
    fontSize: 15,
    color: theme.textPrimary,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: '#FFF',
  },
  messageTime: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    gap: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.textPrimary,
    paddingVertical: 0,
    maxHeight: 100,
  },
  emojiBtn: {
    padding: 4,
    marginLeft: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: theme.primary,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
  },
  errorButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
