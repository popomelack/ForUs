import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, spacing, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { properties, favorites, toggleFavorite } = useApp();
  
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  const handlePropertyPress = (propertyId: string) => {
    Haptics.selectionAsync();
    router.push(`/property/${propertyId}`);
  };

  const handleRemoveFavorite = (propertyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(propertyId);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteProperties.length} propriété{favoriteProperties.length !== 1 ? 's' : ''} sauvegardée{favoriteProperties.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favoriteProperties.length > 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: insets.bottom + 16 
          }}
          showsVerticalScrollIndicator={false}
        >
          {favoriteProperties.map((property, index) => (
            <Animated.View
              key={property.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <Pressable 
                style={styles.favoriteCard}
                onPress={() => handlePropertyPress(property.id)}
              >
                <Image
                  source={{ uri: property.images[0] }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: property.status === 'vente' ? theme.forSale : theme.forRent }
                    ]}>
                      <Text style={styles.statusText}>
                        {property.status === 'vente' ? 'À VENDRE' : 'À LOUER'}
                      </Text>
                    </View>
                    <Pressable 
                      style={styles.removeBtn}
                      onPress={() => handleRemoveFavorite(property.id)}
                    >
                      <MaterialIcons name="favorite" size={24} color={theme.error} />
                    </Pressable>
                  </View>
                  
                  <Text style={styles.cardPrice}>{formatPrice(property.price)}</Text>
                  <Text style={styles.cardTitle} numberOfLines={2}>{property.title}</Text>
                  
                  <View style={styles.cardLocation}>
                    <MaterialIcons name="location-on" size={14} color={theme.textMuted} />
                    <Text style={styles.locationText}>
                      {property.neighborhood}, {property.city}
                    </Text>
                  </View>
                  
                  <View style={styles.cardFeatures}>
                    {property.bedrooms > 0 && (
                      <View style={styles.featureItem}>
                        <MaterialIcons name="king-bed" size={16} color={theme.textSecondary} />
                        <Text style={styles.featureText}>{property.bedrooms} ch</Text>
                      </View>
                    )}
                    {property.bathrooms > 0 && (
                      <View style={styles.featureItem}>
                        <MaterialIcons name="bathtub" size={16} color={theme.textSecondary} />
                        <Text style={styles.featureText}>{property.bathrooms} sdb</Text>
                      </View>
                    )}
                    <View style={styles.featureItem}>
                      <MaterialIcons name="straighten" size={16} color={theme.textSecondary} />
                      <Text style={styles.featureText}>{property.surface} m²</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.agentInfo}>
                      <Image
                        source={{ uri: property.agent.photo }}
                        style={styles.agentAvatar}
                        contentFit="cover"
                      />
                      <Text style={styles.agentName}>{property.agent.name}</Text>
                    </View>
                    <Pressable 
                      style={styles.contactBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        router.push(`/property/${property.id}`);
                      }}
                    >
                      <MaterialIcons name="chat-bubble" size={16} color={theme.primary} />
                      <Text style={styles.contactText}>Contacter</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="favorite-border" size={80} color={theme.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptyText}>
              Ajoutez des propriétés à vos favoris pour les retrouver facilement ici
            </Text>
            <Pressable 
              style={styles.emptyButton}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/search');
              }}
            >
              <MaterialIcons name="search" size={20} color="#FFF" />
              <Text style={styles.emptyButtonText}>Explorer les annonces</Text>
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
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  favoriteCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginTop: 16,
    ...shadows.md,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  removeBtn: {
    padding: 4,
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: theme.textMuted,
    marginLeft: 4,
  },
  cardFeatures: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  agentName: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
