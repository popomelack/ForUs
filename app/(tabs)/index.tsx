import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, spacing, borderRadius, shadows, typography } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    properties, 
    news, 
    agents, 
    favorites, 
    toggleFavorite, 
    likeProperty,
    shareProperty,
    setSearchQuery,
  } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const premiumProperties = properties.filter(p => p.isPremium).slice(0, 5);
  const newProperties = properties.filter(p => p.isNew).slice(0, 6);
  const featuredAgents = agents.slice(0, 4);
  const latestNews = news.slice(0, 3);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      setSearchQuery(searchText);
      router.push('/search');
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    Haptics.selectionAsync();
    router.push(`/property/${propertyId}`);
  };

  const handleAgentPress = (agentId: string) => {
    Haptics.selectionAsync();
    router.push(`/agent/${agentId}`);
  };

  const handleFavorite = (propertyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(propertyId);
  };

  const handleLike = (propertyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeProperty(propertyId);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Bienvenue sur</Text>
              <View style={styles.logoRow}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logoIcon}
                  contentFit="contain"
                />
                <Text style={styles.logoText}>ForUs</Text>
              </View>
            </View>
            <Pressable 
              style={styles.notificationBtn}
              onPress={() => Haptics.selectionAsync()}
            >
              <MaterialIcons name="notifications-none" size={26} color={theme.textPrimary} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </Pressable>
          </View>

          {/* Search Bar */}
          <Pressable 
            style={styles.searchBar}
            onPress={() => router.push('/search')}
          >
            <MaterialIcons name="search" size={22} color={theme.textMuted} />
            <Text style={styles.searchPlaceholder}>
              Rechercher une propriété...
            </Text>
            <View style={styles.searchFilter}>
              <MaterialIcons name="tune" size={20} color={theme.primary} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.heroBanner}
        >
          <Image
            source={require('../../assets/images/hero-brazzaville.png')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTag}>L'IMMOBILIER AU CONGO</Text>
              <Text style={styles.heroTitle}>
                Trouvez votre{'\n'}bien idéal
              </Text>
              <Pressable 
                style={styles.heroCta}
                onPress={() => router.push('/search')}
              >
                <Text style={styles.heroCtaText}>Explorer</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Filters */}
        <Animated.View 
          entering={FadeInRight.delay(300).duration(500)}
          style={styles.quickFilters}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {[
              { icon: 'home', label: 'Villas', type: 'villa' },
              { icon: 'apartment', label: 'Appartements', type: 'appartement' },
              { icon: 'landscape', label: 'Terrains', type: 'terrain' },
              { icon: 'business', label: 'Bureaux', type: 'bureau' },
              { icon: 'room', label: 'Studios', type: 'studio' },
            ].map((filter, index) => (
              <Pressable 
                key={filter.type}
                style={styles.filterChip}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push('/search');
                }}
              >
                <View style={styles.filterIconBox}>
                  <MaterialIcons 
                    name={filter.icon as any} 
                    size={22} 
                    color={theme.primary} 
                  />
                </View>
                <Text style={styles.filterLabel}>{filter.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Premium Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Propriétés Premium</Text>
              <Text style={styles.sectionSubtitle}>Sélection exclusive</Text>
            </View>
            <Pressable 
              style={styles.seeAllBtn}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
              <MaterialIcons name="chevron-right" size={20} color={theme.primary} />
            </Pressable>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
          >
            {premiumProperties.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInRight.delay(400 + index * 100).duration(500)}
              >
                <PropertyCard
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onPress={() => handlePropertyPress(property.id)}
                  onFavorite={() => handleFavorite(property.id)}
                  onLike={() => handleLike(property.id)}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Stats Banner */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.statsBanner}
        >
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statsGradient}
          >
            {[
              { value: '500+', label: 'Propriétés' },
              { value: '50+', label: 'Agents' },
              { value: '2K+', label: 'Clients' },
            ].map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* New Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Nouvelles Annonces</Text>
              <Text style={styles.sectionSubtitle}>Récemment ajoutées</Text>
            </View>
            <Pressable 
              style={styles.seeAllBtn}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
              <MaterialIcons name="chevron-right" size={20} color={theme.primary} />
            </Pressable>
          </View>
          
          <View style={styles.gridContainer}>
            {newProperties.slice(0, 4).map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInDown.delay(700 + index * 100).duration(500)}
                style={styles.gridItem}
              >
                <SmallPropertyCard
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onPress={() => handlePropertyPress(property.id)}
                  onFavorite={() => handleFavorite(property.id)}
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Featured Agents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Agents Recommandés</Text>
              <Text style={styles.sectionSubtitle}>Experts de confiance</Text>
            </View>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {featuredAgents.map((agent, index) => (
              <Animated.View
                key={agent.id}
                entering={FadeInRight.delay(800 + index * 100).duration(500)}
              >
                <Pressable
                  style={styles.agentCard}
                  onPress={() => handleAgentPress(agent.id)}
                >
                  <Image
                    source={{ uri: agent.photo }}
                    style={styles.agentPhoto}
                    contentFit="cover"
                  />
                  {agent.verified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialIcons name="verified" size={14} color={theme.primary} />
                    </View>
                  )}
                  <Text style={styles.agentName} numberOfLines={1}>
                    {agent.name}
                  </Text>
                  <View style={styles.agentRating}>
                    <MaterialIcons name="star" size={12} color="#FFB800" />
                    <Text style={styles.agentRatingText}>{agent.rating}</Text>
                  </View>
                  <Text style={styles.agentProperties}>
                    {agent.properties} annonces
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Latest News */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Actualités</Text>
              <Text style={styles.sectionSubtitle}>Marché immobilier</Text>
            </View>
          </View>
          
          {latestNews.map((article, index) => (
            <Animated.View
              key={article.id}
              entering={FadeInDown.delay(900 + index * 100).duration(500)}
            >
              <NewsCard article={article} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Property Card Component
function PropertyCard({ 
  property, 
  isFavorite, 
  onPress, 
  onFavorite,
  onLike 
}: { 
  property: any; 
  isFavorite: boolean;
  onPress: () => void;
  onFavorite: () => void;
  onLike: () => void;
}) {
  return (
    <Pressable style={styles.propertyCard} onPress={onPress}>
      <View style={styles.propertyImageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.propertyImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.propertyImageGradient}
        />
        
        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: property.status === 'vente' ? theme.forSale : theme.forRent }
        ]}>
          <Text style={styles.statusText}>
            {property.status === 'vente' ? 'À VENDRE' : 'À LOUER'}
          </Text>
        </View>
        
        {/* Premium Badge */}
        {property.isPremium && (
          <View style={styles.premiumBadge}>
            <MaterialIcons name="star" size={12} color="#FFD700" />
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <Pressable style={styles.favoriteBtn} onPress={onFavorite}>
          <MaterialIcons 
            name={isFavorite ? 'favorite' : 'favorite-border'} 
            size={22} 
            color={isFavorite ? theme.error : '#FFF'} 
          />
        </Pressable>
        
        {/* Price */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
          {property.status === 'location' && (
            <Text style={styles.priceUnit}>/mois</Text>
          )}
        </View>
      </View>
      
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        
        <View style={styles.propertyLocation}>
          <MaterialIcons name="location-on" size={14} color={theme.textMuted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.neighborhood}, {property.city}
          </Text>
        </View>
        
        <View style={styles.propertyFeatures}>
          {property.bedrooms > 0 && (
            <View style={styles.featureItem}>
              <MaterialIcons name="king-bed" size={16} color={theme.textSecondary} />
              <Text style={styles.featureText}>{property.bedrooms}</Text>
            </View>
          )}
          {property.bathrooms > 0 && (
            <View style={styles.featureItem}>
              <MaterialIcons name="bathtub" size={16} color={theme.textSecondary} />
              <Text style={styles.featureText}>{property.bathrooms}</Text>
            </View>
          )}
          <View style={styles.featureItem}>
            <MaterialIcons name="straighten" size={16} color={theme.textSecondary} />
            <Text style={styles.featureText}>{property.surface}m²</Text>
          </View>
        </View>
        
        {/* Social Actions */}
        <View style={styles.socialActions}>
          <Pressable style={styles.socialBtn} onPress={onLike}>
            <MaterialIcons name="thumb-up" size={18} color={theme.textMuted} />
            <Text style={styles.socialText}>{property.likes}</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <MaterialIcons name="chat-bubble-outline" size={18} color={theme.textMuted} />
            <Text style={styles.socialText}>Contacter</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <MaterialIcons name="share" size={18} color={theme.textMuted} />
            <Text style={styles.socialText}>{property.shares}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// Small Property Card for Grid
function SmallPropertyCard({ 
  property, 
  isFavorite, 
  onPress, 
  onFavorite 
}: { 
  property: any; 
  isFavorite: boolean;
  onPress: () => void;
  onFavorite: () => void;
}) {
  return (
    <Pressable style={styles.smallCard} onPress={onPress}>
      <View style={styles.smallImageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.smallImage}
          contentFit="cover"
        />
        <View style={[
          styles.smallStatusBadge,
          { backgroundColor: property.status === 'vente' ? theme.forSale : theme.forRent }
        ]}>
          <Text style={styles.smallStatusText}>
            {property.status === 'vente' ? 'VENTE' : 'LOCATION'}
          </Text>
        </View>
        <Pressable style={styles.smallFavoriteBtn} onPress={onFavorite}>
          <MaterialIcons 
            name={isFavorite ? 'favorite' : 'favorite-border'} 
            size={18} 
            color={isFavorite ? theme.error : '#FFF'} 
          />
        </Pressable>
      </View>
      <View style={styles.smallInfo}>
        <Text style={styles.smallPrice}>{formatPrice(property.price)}</Text>
        <Text style={styles.smallTitle} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.smallLocation} numberOfLines={1}>
          {property.neighborhood}, {property.city}
        </Text>
        <View style={styles.smallFeatures}>
          {property.bedrooms > 0 && (
            <Text style={styles.smallFeatureText}>{property.bedrooms} ch</Text>
          )}
          <Text style={styles.smallFeatureText}>{property.surface}m²</Text>
        </View>
      </View>
    </Pressable>
  );
}

// News Card Component
function NewsCard({ article }: { article: any }) {
  return (
    <Pressable style={styles.newsCard}>
      <Image
        source={{ uri: article.image }}
        style={styles.newsImage}
        contentFit="cover"
      />
      <View style={styles.newsContent}>
        <View style={styles.newsCategoryBadge}>
          <Text style={styles.newsCategoryText}>{article.category}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.newsExcerpt} numberOfLines={2}>{article.excerpt}</Text>
        <View style={styles.newsFooter}>
          <View style={styles.newsAuthor}>
            <Image
              source={{ uri: article.authorAvatar }}
              style={styles.newsAuthorAvatar}
              contentFit="cover"
            />
            <Text style={styles.newsAuthorName}>{article.author}</Text>
          </View>
          <View style={styles.newsSocial}>
            <View style={styles.newsStatItem}>
              <MaterialIcons name="thumb-up" size={14} color={theme.textMuted} />
              <Text style={styles.newsStatText}>{article.likes}</Text>
            </View>
            <View style={styles.newsStatItem}>
              <MaterialIcons name="share" size={14} color={theme.textMuted} />
              <Text style={styles.newsStatText}>{article.shares}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...shadows.sm,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: theme.textMuted,
  },
  searchFilter: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroContent: {},
  heroTag: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.primaryLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 32,
    marginBottom: 12,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  heroCtaText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  quickFilters: {
    marginBottom: 24,
  },
  filterChip: {
    alignItems: 'center',
    gap: 8,
  },
  filterIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  propertyCard: {
    width: CARD_WIDTH,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  propertyImageContainer: {
    height: 200,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyImageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
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
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  priceUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 2,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 6,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: theme.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  propertyFeatures: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
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
  socialActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  socialText: {
    fontSize: 13,
    color: theme.textMuted,
    fontWeight: '500',
  },
  statsBanner: {
    marginHorizontal: 16,
    marginBottom: 28,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  statsGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  gridItem: {
    width: (width - 36) / 2,
  },
  smallCard: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  smallImageContainer: {
    height: 120,
    position: 'relative',
  },
  smallImage: {
    width: '100%',
    height: '100%',
  },
  smallStatusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  smallStatusText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
  },
  smallFavoriteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallInfo: {
    padding: 10,
  },
  smallPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  smallLocation: {
    fontSize: 11,
    color: theme.textMuted,
    marginBottom: 6,
  },
  smallFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  smallFeatureText: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  agentCard: {
    width: 100,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 12,
    ...shadows.sm,
  },
  agentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 2,
  },
  agentName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  agentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  agentRatingText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  agentProperties: {
    fontSize: 10,
    color: theme.textMuted,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  newsImage: {
    width: 110,
    height: 130,
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  newsCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.primary,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  newsExcerpt: {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newsAuthorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  newsAuthorName: {
    fontSize: 11,
    color: theme.textMuted,
  },
  newsSocial: {
    flexDirection: 'row',
    gap: 10,
  },
  newsStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  newsStatText: {
    fontSize: 11,
    color: theme.textMuted,
  },
});
