import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

// Mock agency data
const agencyStats = {
  totalProperties: 45,
  activeProperties: 38,
  pendingProperties: 4,
  soldProperties: 3,
  totalViews: 12580,
  viewsThisMonth: 3420,
  viewsChange: 15.3,
  totalLeads: 234,
  leadsThisMonth: 45,
  leadsChange: 8.7,
  conversionRate: 4.2,
  avgResponseTime: '2h 15min',
  rating: 4.8,
  reviews: 127,
};

const subscriptionInfo = {
  plan: 'Premium',
  price: 150000,
  propertiesLimit: 100,
  propertiesUsed: 45,
  agentsLimit: 10,
  agentsUsed: 6,
  expiresAt: '2026-12-31',
  daysRemaining: 328,
  features: ['Support prioritaire', 'Annonces premium', 'Analytics avancées'],
};

const recentLeads = [
  { id: '1', name: 'Marc Ossete', property: 'Villa moderne Mpila', date: '2026-02-06', status: 'new', phone: '+242 06 700 00 00' },
  { id: '2', name: 'Julienne Nkounkou', property: 'Appartement F4', date: '2026-02-05', status: 'contacted', phone: '+242 05 500 00 00' },
  { id: '3', name: 'Bernard Ikonga', property: 'Terrain 500m²', date: '2026-02-04', status: 'visited', phone: '+242 06 900 00 00' },
];

const topProperties = [
  { id: '1', title: 'Villa moderne avec piscine', views: 1250, leads: 12, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&h=150&fit=crop' },
  { id: '2', title: 'Duplex vue mer', views: 980, leads: 8, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=150&fit=crop' },
  { id: '3', title: 'Appartement standing', views: 756, leads: 6, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=150&fit=crop' },
];

const weeklyViews = [
  { day: 'Lun', views: 420 },
  { day: 'Mar', views: 580 },
  { day: 'Mer', views: 390 },
  { day: 'Jeu', views: 620 },
  { day: 'Ven', views: 710 },
  { day: 'Sam', views: 450 },
  { day: 'Dim', views: 250 },
];

export default function AgencyDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const maxViews = Math.max(...weeklyViews.map(d => d.views));
  const usagePercentage = (subscriptionInfo.propertiesUsed / subscriptionInfo.propertiesLimit) * 100;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mon Agence</Text>
          <View style={styles.planBadge}>
            <MaterialIcons name="workspace-premium" size={12} color={theme.primary} />
            <Text style={styles.planBadgeText}>{subscriptionInfo.plan}</Text>
          </View>
        </View>
        <Pressable style={styles.notifBtn}>
          <MaterialIcons name="notifications" size={24} color={theme.textPrimary} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        {/* Agency Info Banner */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.agencyBanner}>
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerContent}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop' }}
                style={styles.agencyLogo}
                contentFit="cover"
              />
              <View style={styles.bannerInfo}>
                <Text style={styles.agencyName}>Immo Premium Congo</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{agencyStats.rating} ({agencyStats.reviews} avis)</Text>
                </View>
              </View>
            </View>
            <View style={styles.bannerStats}>
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatValue}>{agencyStats.totalProperties}</Text>
                <Text style={styles.bannerStatLabel}>Annonces</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatValue}>{agencyStats.totalLeads}</Text>
                <Text style={styles.bannerStatLabel}>Leads</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatValue}>{(agencyStats.totalViews / 1000).toFixed(1)}K</Text>
                <Text style={styles.bannerStatLabel}>Vues</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.primaryBg }]}>
              <MaterialIcons name="visibility" size={22} color={theme.primary} />
            </View>
            <Text style={styles.statValue}>{agencyStats.viewsThisMonth}</Text>
            <Text style={styles.statLabel}>Vues ce mois</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>+{agencyStats.viewsChange}%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.successLight }]}>
              <MaterialIcons name="leaderboard" size={22} color={theme.success} />
            </View>
            <Text style={styles.statValue}>{agencyStats.leadsThisMonth}</Text>
            <Text style={styles.statLabel}>Leads ce mois</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>+{agencyStats.leadsChange}%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.infoLight }]}>
              <MaterialIcons name="swap-horiz" size={22} color={theme.info} />
            </View>
            <Text style={styles.statValue}>{agencyStats.conversionRate}%</Text>
            <Text style={styles.statLabel}>Conversion</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="check-circle" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>Bon</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.warningLight }]}>
              <MaterialIcons name="schedule" size={22} color={theme.warning} />
            </View>
            <Text style={styles.statValue}>{agencyStats.avgResponseTime}</Text>
            <Text style={styles.statLabel}>Temps réponse</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="speed" size={14} color={theme.warning} />
              <Text style={[styles.statChangeText, { color: theme.warning }]}>Moyen</Text>
            </View>
          </Animated.View>
        </View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsRow}>
            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/agency/add-property');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primaryBg }]}>
                <MaterialIcons name="add-home" size={26} color={theme.primary} />
              </View>
              <Text style={styles.actionLabel}>Ajouter annonce</Text>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/agency/properties');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.infoLight }]}>
                <MaterialIcons name="home-work" size={26} color={theme.info} />
              </View>
              <Text style={styles.actionLabel}>Mes annonces</Text>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/agency/leads');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.successLight }]}>
                <MaterialIcons name="people" size={26} color={theme.success} />
              </View>
              <Text style={styles.actionLabel}>Mes leads</Text>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>{agencyStats.leadsThisMonth}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/agency/subscription');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.warningLight }]}>
                <MaterialIcons name="card-membership" size={26} color={theme.warning} />
              </View>
              <Text style={styles.actionLabel}>Abonnement</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Subscription Status */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mon abonnement</Text>
            <Pressable onPress={() => router.push('/agency/subscription')}>
              <Text style={styles.seeAllText}>Gérer</Text>
            </Pressable>
          </View>
          <View style={styles.subscriptionCard}>
            <View style={styles.subHeader}>
              <View style={styles.subPlanInfo}>
                <View style={styles.subPlanBadge}>
                  <MaterialIcons name="workspace-premium" size={18} color={theme.primary} />
                  <Text style={styles.subPlanName}>{subscriptionInfo.plan}</Text>
                </View>
                <Text style={styles.subPrice}>{formatPrice(subscriptionInfo.price)}/mois</Text>
              </View>
              <View style={styles.subExpiry}>
                <Text style={styles.subExpiryLabel}>Expire dans</Text>
                <Text style={styles.subExpiryValue}>{subscriptionInfo.daysRemaining} jours</Text>
              </View>
            </View>
            
            <View style={styles.usageSection}>
              <View style={styles.usageItem}>
                <View style={styles.usageHeader}>
                  <Text style={styles.usageLabel}>Annonces</Text>
                  <Text style={styles.usageValue}>{subscriptionInfo.propertiesUsed}/{subscriptionInfo.propertiesLimit}</Text>
                </View>
                <View style={styles.usageBarBg}>
                  <View style={[styles.usageBar, { width: `${usagePercentage}%` }]} />
                </View>
              </View>
              <View style={styles.usageItem}>
                <View style={styles.usageHeader}>
                  <Text style={styles.usageLabel}>Agents</Text>
                  <Text style={styles.usageValue}>{subscriptionInfo.agentsUsed}/{subscriptionInfo.agentsLimit}</Text>
                </View>
                <View style={styles.usageBarBg}>
                  <View style={[styles.usageBar, { width: `${(subscriptionInfo.agentsUsed / subscriptionInfo.agentsLimit) * 100}%`, backgroundColor: theme.info }]} />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Weekly Views Chart */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Vues cette semaine</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {weeklyViews.map((data, index) => (
                <View key={data.day} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <Animated.View 
                      entering={FadeInDown.delay(450 + index * 30).duration(400)}
                      style={[
                        styles.chartBar,
                        { height: (data.views / maxViews) * 80 }
                      ]}
                    >
                      <LinearGradient
                        colors={theme.gradients.primary as [string, string]}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartTotal}>
              <Text style={styles.chartTotalLabel}>Total semaine:</Text>
              <Text style={styles.chartTotalValue}>{weeklyViews.reduce((a, b) => a + b.views, 0)} vues</Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Leads */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Derniers leads</Text>
            <Pressable onPress={() => router.push('/agency/leads')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
          {recentLeads.map((lead, index) => (
            <Animated.View 
              key={lead.id}
              entering={FadeInRight.delay(500 + index * 50).duration(400)}
            >
              <Pressable style={styles.leadCard}>
                <View style={styles.leadAvatar}>
                  <Text style={styles.leadAvatarText}>{lead.name.charAt(0)}</Text>
                </View>
                <View style={styles.leadInfo}>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <Text style={styles.leadProperty} numberOfLines={1}>{lead.property}</Text>
                  <Text style={styles.leadDate}>{lead.date}</Text>
                </View>
                <View style={styles.leadActions}>
                  <View style={[
                    styles.leadStatus,
                    { backgroundColor: lead.status === 'new' ? theme.successLight : lead.status === 'contacted' ? theme.infoLight : theme.warningLight }
                  ]}>
                    <Text style={[
                      styles.leadStatusText,
                      { color: lead.status === 'new' ? theme.success : lead.status === 'contacted' ? theme.info : theme.warning }
                    ]}>
                      {lead.status === 'new' ? 'Nouveau' : lead.status === 'contacted' ? 'Contacté' : 'Visité'}
                    </Text>
                  </View>
                  <Pressable style={styles.leadCallBtn}>
                    <MaterialIcons name="phone" size={18} color={theme.primary} />
                  </Pressable>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Top Properties */}
        <Animated.View entering={FadeInDown.delay(550).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Annonces populaires</Text>
            <Pressable onPress={() => router.push('/agency/properties')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {topProperties.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInRight.delay(600 + index * 50).duration(400)}
              >
                <Pressable 
                  style={styles.topPropertyCard}
                  onPress={() => router.push(`/property/${property.id}`)}
                >
                  <Image
                    source={{ uri: property.image }}
                    style={styles.topPropertyImage}
                    contentFit="cover"
                  />
                  <View style={styles.topPropertyInfo}>
                    <Text style={styles.topPropertyTitle} numberOfLines={1}>{property.title}</Text>
                    <View style={styles.topPropertyStats}>
                      <View style={styles.topPropertyStat}>
                        <MaterialIcons name="visibility" size={14} color={theme.textMuted} />
                        <Text style={styles.topPropertyStatText}>{property.views}</Text>
                      </View>
                      <View style={styles.topPropertyStat}>
                        <MaterialIcons name="people" size={14} color={theme.textMuted} />
                        <Text style={styles.topPropertyStatText}>{property.leads}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Properties Status */}
        <Animated.View entering={FadeInDown.delay(650).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>État des annonces</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
                <Text style={styles.statusLabel}>Actives</Text>
                <Text style={styles.statusValue}>{agencyStats.activeProperties}</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.warning }]} />
                <Text style={styles.statusLabel}>En attente</Text>
                <Text style={styles.statusValue}>{agencyStats.pendingProperties}</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: theme.info }]} />
                <Text style={styles.statusLabel}>Vendues</Text>
                <Text style={styles.statusValue}>{agencyStats.soldProperties}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.primary,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.error,
  },
  agencyBanner: {
    margin: 16,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  agencyLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerInfo: {
    flex: 1,
  },
  agencyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  bannerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    padding: 14,
  },
  bannerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  bannerStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  bannerStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  bannerStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  statCard: {
    width: (width - 36) / 2,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 6,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 14,
    position: 'relative',
    ...shadows.sm,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.success,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  subscriptionCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subPlanInfo: {},
  subPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  subPrice: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  subExpiry: {
    alignItems: 'flex-end',
  },
  subExpiryLabel: {
    fontSize: 11,
    color: theme.textMuted,
  },
  subExpiryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.success,
  },
  usageSection: {
    gap: 12,
  },
  usageItem: {},
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  usageLabel: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  usageValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  usageBarBg: {
    height: 8,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  usageBar: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    marginBottom: 12,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: '500',
  },
  chartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  chartTotalLabel: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  chartTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
  },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 14,
    ...shadows.sm,
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leadAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  leadProperty: {
    fontSize: 13,
    color: theme.textSecondary,
    marginVertical: 2,
  },
  leadDate: {
    fontSize: 11,
    color: theme.textMuted,
  },
  leadActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  leadStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  leadStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  leadCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPropertyCard: {
    width: 160,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  topPropertyImage: {
    width: '100%',
    height: 100,
  },
  topPropertyInfo: {
    padding: 10,
  },
  topPropertyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 6,
  },
  topPropertyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  topPropertyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topPropertyStatText: {
    fontSize: 11,
    color: theme.textMuted,
  },
  statusCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
});
