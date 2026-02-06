import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';

const { width } = Dimensions.get('window');

// Analytics data
const overviewStats = {
  totalViews: 458920,
  viewsChange: 12.5,
  totalUsers: 2847,
  usersChange: 8.3,
  totalProperties: 156,
  propertiesChange: 5.2,
  totalTransactions: 45,
  transactionsChange: 15.7,
  avgSessionDuration: '4m 32s',
  bounceRate: 32.4,
  conversionRate: 3.8,
  revenue: 45750000,
};

const trafficSources = [
  { source: 'Recherche Google', visits: 125000, percentage: 45 },
  { source: 'Réseaux sociaux', visits: 85000, percentage: 30 },
  { source: 'Accès direct', visits: 42000, percentage: 15 },
  { source: 'Référencement', visits: 28000, percentage: 10 },
];

const topProperties = [
  { id: '1', title: 'Villa moderne Mpila', views: 12500, leads: 45, conversion: 4.2 },
  { id: '2', title: 'Duplex vue mer', views: 9800, leads: 38, conversion: 3.9 },
  { id: '3', title: 'Villa standing Kintélé', views: 8900, leads: 42, conversion: 4.7 },
  { id: '4', title: 'Appartement F4', views: 7200, leads: 28, conversion: 3.5 },
  { id: '5', title: 'Bureau Tour Nabemba', views: 5600, leads: 22, conversion: 3.2 },
];

const topAgencies = [
  { name: 'Immo Premium', properties: 45, views: 125000, leads: 234, revenue: 15000000 },
  { name: 'Congo Habitat', properties: 78, views: 98000, leads: 189, revenue: 12500000 },
  { name: 'Agence du Centre', properties: 23, views: 45000, leads: 78, revenue: 6500000 },
  { name: 'Immobilier Moderne', properties: 15, views: 28000, leads: 45, revenue: 3200000 },
];

const weeklyData = [
  { day: 'Lun', views: 12500, users: 850 },
  { day: 'Mar', views: 14200, users: 920 },
  { day: 'Mer', views: 11800, users: 780 },
  { day: 'Jeu', views: 15600, users: 1050 },
  { day: 'Ven', views: 18200, users: 1200 },
  { day: 'Sam', views: 9800, users: 620 },
  { day: 'Dim', views: 7400, users: 480 },
];

const deviceStats = [
  { device: 'Mobile', percentage: 68, color: theme.primary },
  { device: 'Desktop', percentage: 24, color: theme.info },
  { device: 'Tablet', percentage: 8, color: theme.success },
];

export default function AnalyticsDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const maxViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Pressable style={styles.exportBtn}>
          <MaterialIcons name="file-download" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['day', 'week', 'month', 'year'].map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodBtn,
                selectedPeriod === period && styles.periodBtnActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPeriod(period);
              }}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive
              ]}>
                {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.overviewCard}>
            <View style={[styles.overviewIcon, { backgroundColor: theme.primaryBg }]}>
              <MaterialIcons name="visibility" size={22} color={theme.primary} />
            </View>
            <Text style={styles.overviewValue}>{(overviewStats.totalViews / 1000).toFixed(0)}K</Text>
            <Text style={styles.overviewLabel}>Vues totales</Text>
            <View style={styles.overviewChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.changeText, { color: theme.success }]}>+{overviewStats.viewsChange}%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.overviewCard}>
            <View style={[styles.overviewIcon, { backgroundColor: theme.infoLight }]}>
              <MaterialIcons name="people" size={22} color={theme.info} />
            </View>
            <Text style={styles.overviewValue}>{overviewStats.totalUsers}</Text>
            <Text style={styles.overviewLabel}>Utilisateurs</Text>
            <View style={styles.overviewChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.changeText, { color: theme.success }]}>+{overviewStats.usersChange}%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.overviewCard}>
            <View style={[styles.overviewIcon, { backgroundColor: theme.successLight }]}>
              <MaterialIcons name="swap-horiz" size={22} color={theme.success} />
            </View>
            <Text style={styles.overviewValue}>{overviewStats.conversionRate}%</Text>
            <Text style={styles.overviewLabel}>Conversion</Text>
            <View style={styles.overviewChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.changeText, { color: theme.success }]}>+0.5%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.overviewCard}>
            <View style={[styles.overviewIcon, { backgroundColor: theme.warningLight }]}>
              <MaterialIcons name="payments" size={22} color={theme.warning} />
            </View>
            <Text style={styles.overviewValue}>{formatPrice(overviewStats.revenue)}</Text>
            <Text style={styles.overviewLabel}>Revenus</Text>
            <View style={styles.overviewChange}>
              <MaterialIcons name="trending-up" size={14} color={theme.success} />
              <Text style={[styles.changeText, { color: theme.success }]}>+{overviewStats.transactionsChange}%</Text>
            </View>
          </Animated.View>
        </View>

        {/* Weekly Chart */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Trafic hebdomadaire</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {weeklyData.map((data, index) => (
                <View key={data.day} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <Animated.View 
                      entering={FadeInDown.delay(350 + index * 30).duration(400)}
                      style={[
                        styles.chartBar,
                        { height: (data.views / maxViews) * 100 }
                      ]}
                    >
                      <LinearGradient
                        colors={theme.gradients.primary as [string, string]}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                  <Text style={styles.chartValue}>{(data.views / 1000).toFixed(1)}K</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Traffic Sources */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Sources de trafic</Text>
          <View style={styles.sourcesCard}>
            {trafficSources.map((source, index) => (
              <View key={source.source} style={styles.sourceItem}>
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceName}>{source.source}</Text>
                  <Text style={styles.sourceVisits}>{(source.visits / 1000).toFixed(0)}K visites</Text>
                </View>
                <View style={styles.sourceBarContainer}>
                  <Animated.View 
                    entering={FadeInRight.delay(450 + index * 50).duration(400)}
                    style={[styles.sourceBar, { width: `${source.percentage}%` }]}
                  />
                </View>
                <Text style={styles.sourcePercentage}>{source.percentage}%</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Device Stats */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Appareils</Text>
          <View style={styles.devicesCard}>
            <View style={styles.deviceChart}>
              {deviceStats.map((device, index) => (
                <View 
                  key={device.device}
                  style={[
                    styles.deviceSegment,
                    { 
                      width: `${device.percentage}%`,
                      backgroundColor: device.color,
                      borderTopLeftRadius: index === 0 ? 8 : 0,
                      borderBottomLeftRadius: index === 0 ? 8 : 0,
                      borderTopRightRadius: index === deviceStats.length - 1 ? 8 : 0,
                      borderBottomRightRadius: index === deviceStats.length - 1 ? 8 : 0,
                    }
                  ]}
                />
              ))}
            </View>
            <View style={styles.deviceLegend}>
              {deviceStats.map((device) => (
                <View key={device.device} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: device.color }]} />
                  <Text style={styles.legendText}>{device.device}</Text>
                  <Text style={styles.legendValue}>{device.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Top Properties */}
        <Animated.View entering={FadeInDown.delay(550).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Top Propriétés</Text>
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Propriété</Text>
              <Text style={styles.tableHeaderText}>Vues</Text>
              <Text style={styles.tableHeaderText}>Leads</Text>
              <Text style={styles.tableHeaderText}>Conv.</Text>
            </View>
            {topProperties.map((property, index) => (
              <View key={property.id} style={[
                styles.tableRow,
                index === topProperties.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                  <Text style={styles.tableRank}>{index + 1}</Text>
                  <Text style={styles.tableTitle} numberOfLines={1}>{property.title}</Text>
                </View>
                <Text style={styles.tableCellText}>{(property.views / 1000).toFixed(1)}K</Text>
                <Text style={styles.tableCellText}>{property.leads}</Text>
                <Text style={[styles.tableCellText, { color: theme.success }]}>{property.conversion}%</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Top Agencies */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Agences</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {topAgencies.map((agency, index) => (
              <Animated.View
                key={agency.name}
                entering={FadeInRight.delay(650 + index * 50).duration(400)}
              >
                <View style={styles.agencyCard}>
                  <Text style={styles.agencyName}>{agency.name}</Text>
                  <View style={styles.agencyStats}>
                    <View style={styles.agencyStatItem}>
                      <MaterialIcons name="home" size={16} color={theme.primary} />
                      <Text style={styles.agencyStatValue}>{agency.properties}</Text>
                    </View>
                    <View style={styles.agencyStatItem}>
                      <MaterialIcons name="visibility" size={16} color={theme.info} />
                      <Text style={styles.agencyStatValue}>{(agency.views / 1000).toFixed(0)}K</Text>
                    </View>
                    <View style={styles.agencyStatItem}>
                      <MaterialIcons name="leaderboard" size={16} color={theme.success} />
                      <Text style={styles.agencyStatValue}>{agency.leads}</Text>
                    </View>
                  </View>
                  <View style={styles.agencyRevenue}>
                    <Text style={styles.agencyRevenueLabel}>Revenus</Text>
                    <Text style={styles.agencyRevenueValue}>{formatPrice(agency.revenue)}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Session Stats */}
        <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement</Text>
          <View style={styles.engagementRow}>
            <View style={styles.engagementCard}>
              <MaterialIcons name="timer" size={28} color={theme.primary} />
              <Text style={styles.engagementValue}>{overviewStats.avgSessionDuration}</Text>
              <Text style={styles.engagementLabel}>Durée moyenne</Text>
            </View>
            <View style={styles.engagementCard}>
              <MaterialIcons name="exit-to-app" size={28} color={theme.warning} />
              <Text style={styles.engagementValue}>{overviewStats.bounceRate}%</Text>
              <Text style={styles.engagementLabel}>Taux de rebond</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    margin: 16,
    padding: 4,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  periodBtnActive: {
    backgroundColor: theme.primary,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  periodTextActive: {
    color: '#FFF',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  overviewCard: {
    width: (width - 36) / 2,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  overviewLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  overviewChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
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
    height: 140,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 28,
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  sourcesCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sourceInfo: {
    width: 120,
  },
  sourceName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  sourceVisits: {
    fontSize: 11,
    color: theme.textMuted,
  },
  sourceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  sourceBar: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  sourcePercentage: {
    width: 40,
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    textAlign: 'right',
  },
  devicesCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  deviceChart: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  deviceSegment: {
    height: '100%',
  },
  deviceLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  tableCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: theme.textMuted,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  tableCell: {
    flex: 1,
  },
  tableRank: {
    width: 20,
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  tableTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  tableCellText: {
    flex: 1,
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  agencyCard: {
    width: 160,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 14,
    ...shadows.sm,
  },
  agencyName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  agencyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  agencyStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  agencyStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  agencyRevenue: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  agencyRevenueLabel: {
    fontSize: 11,
    color: theme.textMuted,
  },
  agencyRevenueValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.success,
  },
  engagementRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  engagementCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    alignItems: 'center',
    ...shadows.sm,
  },
  engagementValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  engagementLabel: {
    fontSize: 12,
    color: theme.textSecondary,
  },
});
