import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice, formatPriceFull, APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

export default function PropertyDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, favorites, toggleFavorite, likeProperty } = useApp();
  
  const property = properties.find(p => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - 100],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <MaterialIcons name="error-outline" size={60} color={theme.error} />
          <Text style={styles.errorText}>Propriété introuvable</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(property.id);

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(property.id);
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeProperty(property.id);
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: `${property.title}\n${formatPriceFull(property.price)}\n${property.neighborhood}, ${property.city}\n\nVoir sur ForUs`,
        title: property.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleWhatsApp = () => {
    Haptics.selectionAsync();
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par cette propriété :\n\n${property.title}\nPrix: ${formatPriceFull(property.price)}\nLocalisation: ${property.neighborhood}, ${property.city}\n\nPouvez-vous me donner plus d'informations ?`
    );
    Linking.openURL(`https://wa.me/${property.agent.whatsapp.replace('+', '')}?text=${message}`);
  };

  const handleCall = () => {
    Haptics.selectionAsync();
    Linking.openURL(`tel:${property.agent.phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, headerAnimatedStyle]}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>{property.title}</Text>
            <Pressable style={styles.headerShareBtn} onPress={handleShare}>
              <MaterialIcons name="share" size={22} color={theme.textPrimary} />
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.galleryTopGradient}
          />
          
          {/* Back Button */}
          <SafeAreaView edges={['top']} style={styles.galleryControls}>
            <Pressable 
              style={styles.galleryBackBtn}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFF" />
            </Pressable>
            <View style={styles.galleryActions}>
              <Pressable style={styles.galleryActionBtn} onPress={handleShare}>
                <MaterialIcons name="share" size={22} color="#FFF" />
              </Pressable>
              <Pressable style={styles.galleryActionBtn} onPress={handleFavorite}>
                <MaterialIcons 
                  name={isFavorite ? 'favorite' : 'favorite-border'} 
                  size={22} 
                  color={isFavorite ? theme.error : '#FFF'} 
                />
              </Pressable>
            </View>
          </SafeAreaView>
          
          {/* Image Pagination */}
          <View style={styles.pagination}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
          
          {/* Status Badge */}
          <View style={[
            styles.galleryStatusBadge,
            { backgroundColor: property.status === 'vente' ? theme.forSale : theme.forRent }
          ]}>
            <Text style={styles.galleryStatusText}>
              {property.status === 'vente' ? 'À VENDRE' : 'À LOUER'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Price & Title */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.titleSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(property.price)}</Text>
              {property.status === 'location' && (
                <Text style={styles.priceUnit}>/mois</Text>
              )}
              {property.isPremium && (
                <View style={styles.premiumTag}>
                  <MaterialIcons name="star" size={14} color="#FFD700" />
                  <Text style={styles.premiumTagText}>Premium</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{property.title}</Text>
            
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={18} color={theme.primary} />
              <Text style={styles.location}>
                {property.address}, {property.neighborhood}, {property.city}
              </Text>
            </View>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statsGrid}>
            {property.bedrooms > 0 && (
              <View style={styles.statBox}>
                <MaterialIcons name="king-bed" size={24} color={theme.primary} />
                <Text style={styles.statValue}>{property.bedrooms}</Text>
                <Text style={styles.statLabel}>Chambres</Text>
              </View>
            )}
            {property.bathrooms > 0 && (
              <View style={styles.statBox}>
                <MaterialIcons name="bathtub" size={24} color={theme.primary} />
                <Text style={styles.statValue}>{property.bathrooms}</Text>
                <Text style={styles.statLabel}>Salles de bain</Text>
              </View>
            )}
            <View style={styles.statBox}>
              <MaterialIcons name="straighten" size={24} color={theme.primary} />
              <Text style={styles.statValue}>{property.surface}</Text>
              <Text style={styles.statLabel}>m² Surface</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="visibility" size={24} color={theme.primary} />
              <Text style={styles.statValue}>{property.views}</Text>
              <Text style={styles.statLabel}>Vues</Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.featuresList}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={18} color={theme.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Agent Card */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Agent immobilier</Text>
            <Pressable 
              style={styles.agentCard}
              onPress={() => router.push(`/agent/${property.agent.id}`)}
            >
              <Image
                source={{ uri: property.agent.photo }}
                style={styles.agentAvatar}
                contentFit="cover"
              />
              <View style={styles.agentInfo}>
                <View style={styles.agentNameRow}>
                  <Text style={styles.agentName}>{property.agent.name}</Text>
                  {property.agent.verified && (
                    <MaterialIcons name="verified" size={16} color={theme.primary} />
                  )}
                </View>
                <Text style={styles.agentAgency}>{property.agent.agency}</Text>
                <View style={styles.agentRating}>
                  <MaterialIcons name="star" size={14} color="#FFB800" />
                  <Text style={styles.agentRatingText}>
                    {property.agent.rating} ({property.agent.reviews} avis)
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
            </Pressable>
          </Animated.View>

          {/* Social Actions */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.socialSection}>
            <Pressable style={styles.socialButton} onPress={handleLike}>
              <MaterialIcons name="thumb-up" size={22} color={theme.textSecondary} />
              <Text style={styles.socialButtonText}>{property.likes} J'aime</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={handleShare}>
              <MaterialIcons name="share" size={22} color={theme.textSecondary} />
              <Text style={styles.socialButtonText}>{property.shares} Partager</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.callButton} onPress={handleCall}>
          <MaterialIcons name="phone" size={22} color={theme.primary} />
          <Text style={styles.callButtonText}>Appeler</Text>
        </Pressable>
        <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
          <MaterialIcons name="chat" size={22} color="#FFF" />
          <Text style={styles.whatsappButtonText}>WhatsApp</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  headerSafeArea: {
    backgroundColor: theme.surface,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginHorizontal: 12,
  },
  headerShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGallery: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: HEADER_HEIGHT,
  },
  galleryTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  galleryControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  galleryBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  galleryActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFF',
    width: 24,
  },
  galleryStatusBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  galleryStatusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    marginTop: -24,
    paddingTop: 24,
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
    gap: 4,
  },
  premiumTagText: {
    color: '#B8860B',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 26,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 6,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.xl,
    padding: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.xl,
  },
  agentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  agentInfo: {
    flex: 1,
  },
  agentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  agentAgency: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  agentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agentRatingText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  socialSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.lg,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    gap: 12,
    ...shadows.lg,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: theme.primaryBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
  },
  whatsappButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: theme.whatsapp,
    borderRadius: borderRadius.lg,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
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
