import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, isAuthenticated } = useApp();
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    if (hours < 48) {
      return 'Hier';
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleConversationPress = (conversationId: string) => {
    Haptics.selectionAsync();
    router.push(`/chat/${conversationId}`);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        
        <View style={styles.authPrompt}>
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={styles.authIconContainer}>
              <MaterialIcons name="chat-bubble-outline" size={60} color={theme.primaryLight} />
            </View>
            <Text style={styles.authTitle}>Connectez-vous</Text>
            <Text style={styles.authText}>
              Connectez-vous pour accéder à vos messages et contacter les agents
            </Text>
            <Pressable 
              style={styles.authButton}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/login');
              }}
            >
              <Text style={styles.authButtonText}>Se connecter</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Pressable style={styles.newMessageBtn}>
          <MaterialIcons name="edit" size={22} color={theme.primary} />
        </Pressable>
      </View>

      {conversations.length > 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
        >
          {conversations.map((conversation, index) => {
            const otherParticipant = conversation.participants.find(p => p.id !== 'user-1');
            
            return (
              <Animated.View
                key={conversation.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <Pressable 
                  style={styles.conversationCard}
                  onPress={() => handleConversationPress(conversation.id)}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: otherParticipant?.avatar }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                    {conversation.unreadCount > 0 && (
                      <View style={styles.onlineDot} />
                    )}
                  </View>
                  
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <Text style={[
                        styles.participantName,
                        conversation.unreadCount > 0 && styles.participantNameUnread
                      ]}>
                        {otherParticipant?.name}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatTime(conversation.lastMessageTime)}
                      </Text>
                    </View>
                    
                    {conversation.propertyTitle && (
                      <View style={styles.propertyTag}>
                        <MaterialIcons name="home" size={12} color={theme.primary} />
                        <Text style={styles.propertyTagText} numberOfLines={1}>
                          {conversation.propertyTitle}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.messagePreview}>
                      <Text 
                        style={[
                          styles.lastMessage,
                          conversation.unreadCount > 0 && styles.lastMessageUnread
                        ]} 
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="forum" size={60} color={theme.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>Aucun message</Text>
            <Text style={styles.emptyText}>
              Contactez un agent pour démarrer une conversation
            </Text>
            <Pressable 
              style={styles.emptyButton}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/search');
              }}
            >
              <Text style={styles.emptyButtonText}>Voir les annonces</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  newMessageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.success,
    borderWidth: 2,
    borderColor: theme.surface,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  participantNameUnread: {
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  propertyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  propertyTagText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '500',
    flex: 1,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
  },
  lastMessageUnread: {
    color: theme.textPrimary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  authIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  authText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
  },
  authButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
