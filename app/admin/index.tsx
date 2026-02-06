import React, { useState, useEffect } from 'react';
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
import { properties, agents, usersDatabase } from '../../services/mockData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;

// Mock admin data
const adminStats = {
  totalProperties: 156,
  activeProperties: 132,
  pendingApproval: 12,
  totalUsers: 2847,
  activeUsers: 1923,
  newUsersThisMonth: 234,
  totalAgencies: 24,
  activeAgencies: 21,
  pendingAgencies: 3,
  totalRevenue: 45750000,
  monthlyRevenue: 8250000,
  commissions: 2475000,
};

const recentActivities = [
  { id: '1', type: 'new_property', user: 'Immo Premium', action: 'a ajouté une nouvelle propriété', time: 'Il y a 5 min', icon: 'home' },
  { id: '2', type: 'new_user', user: 'Marc Ossete', action: 's\'est inscrit', time: 'Il y a 15 min', icon: 'person-add' },
  { id: '3', type: 'report', user: 'Julienne N.', action: 'a signalé une annonce', time: 'Il y a 30 min', icon: 'flag' },
  { id: '4', type: 'transaction', user: 'Congo Habitat', action: 'transaction finalisée', time: 'Il y a 1h', icon: 'payment' },
  { id: '5', type: 'agency_request', user: 'Nouvelle Agence', action: 'demande d\'inscription', time: 'Il y a 2h', icon: 'business' },
];

const pendingItems = [
  { id: '1', type: 'property', title: 'Villa luxe Kintélé', agency: 'Immo Premium', date: '2026-02-05', status: 'pending' },
  { id: '2', type: 'property', title: 'Appartement F4 Centre', agency: 'Congo Habitat', date: '2026-02-04', status: 'pending' },
  { id: '3', type: 'agency', title: 'Immobilier Elite', contact: 'contact@elite.cg', date: '2026-02-03', status: 'pending' },
];

const monthlyData = [
  { month: 'Sep', properties: 45, users: 320, revenue: 5.2 },
  { month: 'Oct', properties: 52, users: 380, revenue: 6.1 },
  { month: 'Nov', properties: 48, users: 410, revenue: 5.8 },
  { month: 'Déc', properties: 61, users: 520, revenue: 7.4 },
  { month: 'Jan', properties: 58, users: 480, revenue: 6.9 },
  { month: 'Fév', properties: 42, users: 340, revenue: 8.2 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <View style={styles.adminBadge}>
            <MaterialIcons name="admin-panel-settings" size={12} color={theme.error} />
            <Text style={styles.adminBadgeText}>Super Admin</Text>
          </View>
        </View>
        <Pressable style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={24} color={theme.textPrimary} />
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
        {/* Welcome Banner */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.welcomeBanner}>
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeText}>Bienvenue, Admin</Text>
              <Text style={styles.welcomeSubtext}>
                Vue d'ensemble de la plateforme ForUs
              </Text>
            </View>
            <View style={styles.welcomeIcon}>
              <MaterialIcons name="dashboard" size={50} color="rgba(255,255,255,0.3)" />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.primaryBg }]}>
              <MaterialIcons name="home" size={24} color={theme.primary} />
            </View>
            <Text style={styles.statValue}>{adminStats.totalProperties}</Text>
            <Text style={styles.statLabel}>Propriétés</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>+{adminStats.pendingApproval} en attente</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.infoLight }]}>
              <MaterialIcons name="people" size={24} color={theme.info} />
            </View>
            <Text style={styles.statValue}>{adminStats.totalUsers}</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>+{adminStats.newUsersThisMonth} ce mois</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.successLight }]}>
              <MaterialIcons name="business" size={24} color={theme.success} />
            </View>
            <Text style={styles.statValue}>{adminStats.totalAgencies}</Text>
            <Text style={styles.statLabel}>Agences</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="schedule" size={14} color={theme.warning} />
              <Text style={[styles.statChangeText, { color: theme.warning }]}>{adminStats.pendingAgencies} en attente</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.warningLight }]}>
              <MaterialIcons name="payments" size={24} color={theme.warning} />
            </View>
            <Text style={styles.statValue}>{formatPrice(adminStats.monthlyRevenue)}</Text>
            <Text style={styles.statLabel}>Revenus/mois</Text>
            <View style={styles.statChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.statChangeText, { color: theme.success }]}>+12%</Text>
            </View>
          </Animated.View>
        </View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/admin/properties');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primaryBg }]}>
                <MaterialIcons name="fact-check" size={24} color={theme.primary} />
              </View>
              <Text style={styles.actionLabel}>Modérer</Text>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>{adminStats.pendingApproval}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/admin/users');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.infoLight }]}>
                <MaterialIcons name="group" size={24} color={theme.info} />
              </View>
              <Text style={styles.actionLabel}>Utilisateurs</Text>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/admin/agencies');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.successLight }]}>
                <MaterialIcons name="business" size={24} color={theme.success} />
              </View>
              <Text style={styles.actionLabel}>Agences</Text>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/admin/reports');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.errorLight }]}>
                <MaterialIcons name="flag" size={24} color={theme.error} />
              </View>
              <Text style={styles.actionLabel}>Signalements</Text>
              <View style={[styles.actionBadge, { backgroundColor: theme.error }]}>
                <Text style={styles.actionBadgeText}>5</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.actionCard}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/admin/analytics');
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.warningLight }]}>
                <MaterialIcons name="analytics" size={24} color={theme.warning} />
              </View>
              <Text style={styles.actionLabel}>Analytics</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>

        {/* Revenue Chart */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenus mensuels</Text>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <Pressable
                  key={period}
                  style={[
                    styles.periodBtn,
                    selectedPeriod === period && styles.periodBtnActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive
                  ]}>
                    {period === 'week' ? 'Sem.' : period === 'month' ? 'Mois' : 'An'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {monthlyData.map((data, index) => (
                <View key={data.month} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <Animated.View 
                      entering={FadeInDown.delay(400 + index * 50).duration(400)}
                      style={[
                        styles.chartBar,
                        { height: (data.revenue / maxRevenue) * 120 }
                      ]}
                    >
                      <LinearGradient
                        colors={theme.gradients.primary as [string, string]}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                  </View>
                  <Text style={styles.chartLabel}>{data.month}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartTotal}>
                Total: <Text style={styles.chartTotalValue}>{formatPrice(adminStats.totalRevenue)}</Text>
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Pending Approvals */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En attente d'approbation</Text>
            <Pressable onPress={() => router.push('/admin/properties')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>
          
          {pendingItems.map((item, index) => (
            <Animated.View 
              key={item.id}
              entering={FadeInRight.delay(450 + index * 50).duration(400)}
            >
              <View style={styles.pendingCard}>
                <View style={[
                  styles.pendingIcon,
                  { backgroundColor: item.type === 'property' ? theme.primaryBg : theme.successLight }
                ]}>
                  <MaterialIcons 
                    name={item.type === 'property' ? 'home' : 'business'} 
                    size={20} 
                    color={item.type === 'property' ? theme.primary : theme.success} 
                  />
                </View>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingTitle}>{item.title}</Text>
                  <Text style={styles.pendingSubtitle}>
                    {item.type === 'property' ? item.agency : item.contact}
                  </Text>
                </View>
                <View style={styles.pendingActions}>
                  <Pressable 
                    style={styles.approveBtn}
                    onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                  >
                    <MaterialIcons name="check" size={20} color={theme.success} />
                  </Pressable>
                  <Pressable 
                    style={styles.rejectBtn}
                    onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)}
                  >
                    <MaterialIcons name="close" size={20} color={theme.error} />
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <View style={styles.activityCard}>
            {recentActivities.map((activity, index) => (
              <View 
                key={activity.id}
                style={[
                  styles.activityItem,
                  index < recentActivities.length - 1 && styles.activityItemBorder
                ]}
              >
                <View style={[
                  styles.activityIcon,
                  { 
                    backgroundColor: 
                      activity.type === 'report' ? theme.errorLight :
                      activity.type === 'transaction' ? theme.successLight :
                      activity.type === 'new_user' ? theme.infoLight :
                      theme.primaryBg
                  }
                ]}>
                  <MaterialIcons 
                    name={activity.icon as any} 
                    size={18} 
                    color={
                      activity.type === 'report' ? theme.error :
                      activity.type === 'transaction' ? theme.success :
                      activity.type === 'new_user' ? theme.info :
                      theme.primary
                    } 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* System Status */}
        <Animated.View entering={FadeInDown.delay(550).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>État du système</Text>
          <View style={styles.systemCard}>
            <View style={styles.systemItem}>
              <View style={styles.systemLeft}>
                <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
                <Text style={styles.systemLabel}>Serveurs</Text>
              </View>
              <Text style={[styles.systemStatus, { color: theme.success }]}>Opérationnel</Text>
            </View>
            <View style={styles.systemItem}>
              <View style={styles.systemLeft}>
                <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
                <Text style={styles.systemLabel}>Base de données</Text>
              </View>
              <Text style={[styles.systemStatus, { color: theme.success }]}>Opérationnel</Text>
            </View>
            <View style={styles.systemItem}>
              <View style={styles.systemLeft}>
                <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
                <Text style={styles.systemLabel}>Paiements</Text>
              </View>
              <Text style={[styles.systemStatus, { color: theme.success }]}>Opérationnel</Text>
            </View>
            <View style={[styles.systemItem, { borderBottomWidth: 0 }]}>
              <View style={styles.systemLeft}>
                <View style={[styles.statusDot, { backgroundColor: theme.warning }]} />
                <Text style={styles.systemLabel}>Notifications</Text>
              </View>
              <Text style={[styles.systemStatus, { color: theme.warning }]}>Maintenance</Text>
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.error,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBanner: {
    margin: 16,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  welcomeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  welcomeContent: {},
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeIcon: {
    opacity: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    width: (width - 36) / 2,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 8,
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
    marginTop: 16,
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
  actionCard: {
    width: 90,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 14,
    position: 'relative',
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.primary,
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  periodBtnActive: {
    backgroundColor: theme.surface,
    ...shadows.sm,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textMuted,
  },
  periodTextActive: {
    color: theme.primary,
    fontWeight: '600',
  },
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 20,
    ...shadows.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 16,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 32,
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: '500',
  },
  chartLegend: {
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    paddingTop: 12,
    alignItems: 'center',
  },
  chartTotal: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  chartTotalValue: {
    fontWeight: '700',
    color: theme.primary,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 14,
    ...shadows.sm,
  },
  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  pendingSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  activityUser: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
  activityTime: {
    fontSize: 12,
    color: theme.textMuted,
  },
  systemCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    ...shadows.sm,
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  systemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  systemLabel: {
    fontSize: 14,
    color: theme.textPrimary,
    fontWeight: '500',
  },
  systemStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
});
