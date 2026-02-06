import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';

// Mock agencies data
const mockAgencies = [
  {
    id: '1',
    name: 'Immo Premium Congo',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    email: 'agence@immopremium.cg',
    phone: '+242 06 700 00 00',
    address: 'Centre-ville, Brazzaville',
    status: 'active',
    plan: 'Premium',
    planPrice: 150000,
    agents: 10,
    properties: 45,
    views: 12500,
    leads: 234,
    joinDate: '2023-06-01',
    verified: true,
  },
  {
    id: '2',
    name: 'Congo Habitat Solutions',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    email: 'agence@congohabitat.cg',
    phone: '+242 06 600 00 00',
    address: 'Loandjili, Pointe-Noire',
    status: 'active',
    plan: 'Enterprise',
    planPrice: 350000,
    agents: 25,
    properties: 78,
    views: 28400,
    leads: 456,
    joinDate: '2023-06-15',
    verified: true,
  },
  {
    id: '3',
    name: 'Agence du Centre',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
    email: 'agence@centre.cg',
    phone: '+242 06 500 00 00',
    address: 'Centre-ville, Brazzaville',
    status: 'active',
    plan: 'Basique',
    planPrice: 50000,
    agents: 5,
    properties: 23,
    views: 5600,
    leads: 89,
    joinDate: '2024-03-01',
    verified: true,
  },
  {
    id: '4',
    name: 'Immobilier Moderne',
    logo: 'https://images.unsplash.com/photo-1464938050520-ef2571f05df4?w=100&h=100&fit=crop',
    email: 'agence@immomoderne.cg',
    phone: '+242 06 400 00 00',
    address: 'Moungali, Brazzaville',
    status: 'active',
    plan: 'Gratuit',
    planPrice: 0,
    agents: 3,
    properties: 15,
    views: 2300,
    leads: 34,
    joinDate: '2025-11-01',
    verified: false,
  },
  {
    id: '5',
    name: 'Immobilier Elite',
    logo: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=100&h=100&fit=crop',
    email: 'contact@elite.cg',
    phone: '+242 06 300 00 00',
    address: 'Mpila, Brazzaville',
    status: 'pending',
    plan: 'Premium',
    planPrice: 150000,
    agents: 0,
    properties: 0,
    views: 0,
    leads: 0,
    joinDate: '2026-02-03',
    verified: false,
  },
  {
    id: '6',
    name: 'ProImmo Congo',
    logo: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=100&h=100&fit=crop',
    email: 'contact@proimmo.cg',
    phone: '+242 06 200 00 00',
    address: 'Tié-Tié, Pointe-Noire',
    status: 'suspended',
    plan: 'Basique',
    planPrice: 50000,
    agents: 4,
    properties: 12,
    views: 1200,
    leads: 23,
    joinDate: '2024-08-15',
    verified: true,
  },
];

const statusFilters = [
  { id: 'all', label: 'Toutes' },
  { id: 'active', label: 'Actives' },
  { id: 'pending', label: 'En attente' },
  { id: 'suspended', label: 'Suspendues' },
];

const planFilters = [
  { id: 'all', label: 'Tous plans' },
  { id: 'Gratuit', label: 'Gratuit' },
  { id: 'Basique', label: 'Basique' },
  { id: 'Premium', label: 'Premium' },
  { id: 'Enterprise', label: 'Enterprise' },
];

export default function AgenciesManagement() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [agencies, setAgencies] = useState(mockAgencies);

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = 
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || agency.status === selectedStatus;
    const matchesPlan = selectedPlan === 'all' || agency.plan === selectedPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleApproveAgency = (agencyId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAgencies(prev => prev.map(a => 
      a.id === agencyId ? { ...a, status: 'active', verified: true } : a
    ));
  };

  const handleSuspendAgency = (agencyId: string) => {
    Alert.alert(
      'Suspendre l\'agence',
      'Toutes les annonces de cette agence seront masquées. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Suspendre', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setAgencies(prev => prev.map(a => 
              a.id === agencyId ? { ...a, status: 'suspended' } : a
            ));
          }
        },
      ]
    );
  };

  const handleReactivateAgency = (agencyId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAgencies(prev => prev.map(a => 
      a.id === agencyId ? { ...a, status: 'active' } : a
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: theme.success, bg: theme.successLight };
      case 'suspended':
        return { label: 'Suspendue', color: theme.error, bg: theme.errorLight };
      case 'pending':
        return { label: 'En attente', color: theme.warning, bg: theme.warningLight };
      default:
        return { label: 'Inconnu', color: theme.textMuted, bg: theme.backgroundSecondary };
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return { color: '#9C27B0', bg: '#F3E5F5' };
      case 'Premium':
        return { color: theme.primary, bg: theme.primaryBg };
      case 'Basique':
        return { color: theme.info, bg: theme.infoLight };
      default:
        return { color: theme.textMuted, bg: theme.backgroundSecondary };
    }
  };

  const totalRevenue = agencies.reduce((acc, a) => acc + a.planPrice, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Gestion Agences</Text>
        <Pressable style={styles.addBtn}>
          <MaterialIcons name="add-business" size={22} color={theme.primary} />
        </Pressable>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{agencies.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {agencies.filter(a => a.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Actives</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.warning }]}>
            {agencies.filter(a => a.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary, fontSize: 16 }]}>
            {formatPrice(totalRevenue)}
          </Text>
          <Text style={styles.statLabel}>Revenus/mois</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une agence..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color={theme.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {statusFilters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterChip,
                selectedStatus === filter.id && styles.filterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedStatus(filter.id);
              }}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.filterSeparator} />
          {planFilters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterChip,
                selectedPlan === filter.id && styles.filterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPlan(filter.id);
              }}
            >
              <Text style={[
                styles.filterText,
                selectedPlan === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Agencies List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredAgencies.length} agence{filteredAgencies.length !== 1 ? 's' : ''} trouvée{filteredAgencies.length !== 1 ? 's' : ''}
        </Text>

        {filteredAgencies.map((agency, index) => {
          const statusBadge = getStatusBadge(agency.status);
          const planBadge = getPlanBadge(agency.plan);
          
          return (
            <Animated.View
              key={agency.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <View style={styles.agencyCard}>
                <View style={styles.agencyHeader}>
                  <Image
                    source={{ uri: agency.logo }}
                    style={styles.agencyLogo}
                    contentFit="cover"
                  />
                  <View style={styles.agencyInfo}>
                    <View style={styles.agencyNameRow}>
                      <Text style={styles.agencyName}>{agency.name}</Text>
                      {agency.verified && (
                        <MaterialIcons name="verified" size={18} color={theme.primary} />
                      )}
                    </View>
                    <Text style={styles.agencyEmail}>{agency.email}</Text>
                    <View style={styles.badges}>
                      <View style={[styles.badge, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: statusBadge.color }]}>
                          {statusBadge.label}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: planBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: planBadge.color }]}>
                          {agency.plan}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.agencyStats}>
                  <View style={styles.agencyStatItem}>
                    <MaterialIcons name="home" size={18} color={theme.primary} />
                    <Text style={styles.agencyStatValue}>{agency.properties}</Text>
                    <Text style={styles.agencyStatLabel}>Annonces</Text>
                  </View>
                  <View style={styles.agencyStatItem}>
                    <MaterialIcons name="people" size={18} color={theme.info} />
                    <Text style={styles.agencyStatValue}>{agency.agents}</Text>
                    <Text style={styles.agencyStatLabel}>Agents</Text>
                  </View>
                  <View style={styles.agencyStatItem}>
                    <MaterialIcons name="visibility" size={18} color={theme.success} />
                    <Text style={styles.agencyStatValue}>{(agency.views / 1000).toFixed(1)}K</Text>
                    <Text style={styles.agencyStatLabel}>Vues</Text>
                  </View>
                  <View style={styles.agencyStatItem}>
                    <MaterialIcons name="leaderboard" size={18} color={theme.warning} />
                    <Text style={styles.agencyStatValue}>{agency.leads}</Text>
                    <Text style={styles.agencyStatLabel}>Leads</Text>
                  </View>
                </View>

                <View style={styles.agencyFooter}>
                  <Text style={styles.agencyJoinDate}>
                    Membre depuis {agency.joinDate}
                  </Text>
                  <Text style={styles.agencyPrice}>
                    {agency.planPrice > 0 ? formatPrice(agency.planPrice) + '/mois' : 'Gratuit'}
                  </Text>
                </View>

                <View style={styles.agencyActions}>
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => Haptics.selectionAsync()}
                  >
                    <MaterialIcons name="visibility" size={18} color={theme.info} />
                    <Text style={[styles.actionText, { color: theme.info }]}>Détails</Text>
                  </Pressable>
                  
                  {agency.status === 'pending' && (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleApproveAgency(agency.id)}
                    >
                      <MaterialIcons name="check-circle" size={18} color={theme.success} />
                      <Text style={[styles.actionText, { color: theme.success }]}>Approuver</Text>
                    </Pressable>
                  )}
                  
                  {agency.status === 'active' && (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleSuspendAgency(agency.id)}
                    >
                      <MaterialIcons name="block" size={18} color={theme.warning} />
                      <Text style={[styles.actionText, { color: theme.warning }]}>Suspendre</Text>
                    </Pressable>
                  )}
                  
                  {agency.status === 'suspended' && (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleReactivateAgency(agency.id)}
                    >
                      <MaterialIcons name="refresh" size={18} color={theme.success} />
                      <Text style={[styles.actionText, { color: theme.success }]}>Réactiver</Text>
                    </Pressable>
                  )}
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => Haptics.selectionAsync()}
                  >
                    <MaterialIcons name="email" size={18} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>Contacter</Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          );
        })}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
    marginVertical: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: theme.textPrimary,
  },
  filtersSection: {
    paddingTop: 14,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  filterSeparator: {
    width: 1,
    backgroundColor: theme.border,
    marginHorizontal: 4,
  },
  resultsText: {
    fontSize: 13,
    color: theme.textMuted,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  agencyCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  agencyHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  agencyLogo: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 14,
  },
  agencyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  agencyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  agencyName: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  agencyEmail: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  agencyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.borderLight,
    marginBottom: 14,
  },
  agencyStatItem: {
    alignItems: 'center',
  },
  agencyStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 4,
  },
  agencyStatLabel: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 2,
  },
  agencyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  agencyJoinDate: {
    fontSize: 12,
    color: theme.textMuted,
  },
  agencyPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  agencyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
