import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { properties as mockProperties } from '../../services/mockData';

const { width } = Dimensions.get('window');

// Extended properties with moderation status
const adminProperties = mockProperties.map((p, index) => ({
  ...p,
  moderationStatus: index < 2 ? 'pending' : index === 5 ? 'rejected' : 'approved',
  reportCount: index === 3 ? 2 : index === 7 ? 5 : 0,
  featured: index === 0 || index === 1 || index === 8,
}));

const statusFilters = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'approved', label: 'Approuvées' },
  { id: 'rejected', label: 'Rejetées' },
  { id: 'reported', label: 'Signalées' },
];

export default function PropertiesModeration() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [properties, setProperties] = useState(adminProperties);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedStatus === 'all') return matchesSearch;
    if (selectedStatus === 'reported') return matchesSearch && property.reportCount > 0;
    return matchesSearch && property.moderationStatus === selectedStatus;
  });

  const handleApprove = (propertyId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, moderationStatus: 'approved' } : p
    ));
  };

  const handleReject = (propertyId: string) => {
    Alert.alert(
      'Rejeter l\'annonce',
      'Voulez-vous rejeter cette annonce ? L\'agence sera notifiée.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Rejeter', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setProperties(prev => prev.map(p => 
              p.id === propertyId ? { ...p, moderationStatus: 'rejected' } : p
            ));
          }
        },
      ]
    );
  };

  const handleDelete = (propertyId: string) => {
    Alert.alert(
      'Supprimer l\'annonce',
      'Cette action est irréversible. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setProperties(prev => prev.filter(p => p.id !== propertyId));
          }
        },
      ]
    );
  };

  const handleToggleFeatured = (propertyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, featured: !p.featured } : p
    ));
  };

  const handleDismissReports = (propertyId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, reportCount: 0 } : p
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approuvée', color: theme.success, bg: theme.successLight, icon: 'check-circle' };
      case 'rejected':
        return { label: 'Rejetée', color: theme.error, bg: theme.errorLight, icon: 'cancel' };
      case 'pending':
        return { label: 'En attente', color: theme.warning, bg: theme.warningLight, icon: 'schedule' };
      default:
        return { label: 'Inconnu', color: theme.textMuted, bg: theme.backgroundSecondary, icon: 'help' };
    }
  };

  const pendingCount = properties.filter(p => p.moderationStatus === 'pending').length;
  const reportedCount = properties.filter(p => p.reportCount > 0).length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Modération Annonces</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{properties.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.warning }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.error }]}>{reportedCount}</Text>
          <Text style={styles.statLabel}>Signalées</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {properties.filter(p => p.featured).length}
          </Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une annonce..."
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
              {filter.id === 'pending' && pendingCount > 0 && (
                <View style={[
                  styles.filterBadge,
                  selectedStatus === filter.id && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedStatus === filter.id && styles.filterBadgeTextActive
                  ]}>
                    {pendingCount}
                  </Text>
                </View>
              )}
              {filter.id === 'reported' && reportedCount > 0 && (
                <View style={[
                  styles.filterBadge,
                  { backgroundColor: theme.error },
                  selectedStatus === filter.id && styles.filterBadgeActive
                ]}>
                  <Text style={[styles.filterBadgeText, styles.filterBadgeTextActive]}>
                    {reportedCount}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Properties List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredProperties.length} annonce{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
        </Text>

        {filteredProperties.map((property, index) => {
          const statusBadge = getStatusBadge(property.moderationStatus);
          
          return (
            <Animated.View
              key={property.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <View style={styles.propertyCard}>
                <Pressable 
                  style={styles.propertyMain}
                  onPress={() => router.push(`/property/${property.id}`)}
                >
                  <Image
                    source={{ uri: property.images[0] }}
                    style={styles.propertyImage}
                    contentFit="cover"
                  />
                  <View style={styles.propertyInfo}>
                    <View style={styles.propertyHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                        <MaterialIcons name={statusBadge.icon as any} size={12} color={statusBadge.color} />
                        <Text style={[styles.statusText, { color: statusBadge.color }]}>
                          {statusBadge.label}
                        </Text>
                      </View>
                      {property.featured && (
                        <View style={styles.featuredBadge}>
                          <MaterialIcons name="star" size={12} color="#FFD700" />
                        </View>
                      )}
                      {property.reportCount > 0 && (
                        <View style={styles.reportBadge}>
                          <MaterialIcons name="flag" size={12} color={theme.error} />
                          <Text style={styles.reportCount}>{property.reportCount}</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.propertyTitle} numberOfLines={1}>{property.title}</Text>
                    <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
                    
                    <View style={styles.propertyMeta}>
                      <Text style={styles.propertyLocation} numberOfLines={1}>
                        {property.neighborhood}, {property.city}
                      </Text>
                      <Text style={styles.propertyAgency}>• {property.agent.agency}</Text>
                    </View>
                  </View>
                </Pressable>

                {/* Actions */}
                <View style={styles.propertyActions}>
                  {property.moderationStatus === 'pending' && (
                    <>
                      <Pressable 
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleApprove(property.id)}
                      >
                        <MaterialIcons name="check" size={18} color={theme.success} />
                        <Text style={[styles.actionText, { color: theme.success }]}>Approuver</Text>
                      </Pressable>
                      <Pressable 
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleReject(property.id)}
                      >
                        <MaterialIcons name="close" size={18} color={theme.error} />
                        <Text style={[styles.actionText, { color: theme.error }]}>Rejeter</Text>
                      </Pressable>
                    </>
                  )}
                  
                  {property.reportCount > 0 && (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleDismissReports(property.id)}
                    >
                      <MaterialIcons name="flag" size={18} color={theme.warning} />
                      <Text style={[styles.actionText, { color: theme.warning }]}>Ignorer signalements</Text>
                    </Pressable>
                  )}
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => handleToggleFeatured(property.id)}
                  >
                    <MaterialIcons 
                      name={property.featured ? 'star' : 'star-outline'} 
                      size={18} 
                      color={property.featured ? '#FFD700' : theme.textMuted} 
                    />
                    <Text style={[styles.actionText, { color: property.featured ? '#FFD700' : theme.textMuted }]}>
                      {property.featured ? 'Premium' : 'Promouvoir'}
                    </Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => router.push(`/property/${property.id}`)}
                  >
                    <MaterialIcons name="visibility" size={18} color={theme.info} />
                    <Text style={[styles.actionText, { color: theme.info }]}>Voir</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => handleDelete(property.id)}
                  >
                    <MaterialIcons name="delete" size={18} color={theme.error} />
                    <Text style={[styles.actionText, { color: theme.error }]}>Suppr.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 6,
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
  filterBadge: {
    backgroundColor: theme.warning,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  filterBadgeTextActive: {
    color: '#FFF',
  },
  resultsText: {
    fontSize: 13,
    color: theme.textMuted,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  propertyCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  propertyMain: {
    flexDirection: 'row',
    padding: 12,
  },
  propertyImage: {
    width: 100,
    height: 80,
    borderRadius: borderRadius.md,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    padding: 4,
    borderRadius: 6,
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reportCount: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.error,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 4,
  },
  propertyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyLocation: {
    fontSize: 12,
    color: theme.textMuted,
  },
  propertyAgency: {
    fontSize: 12,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  propertyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: theme.backgroundSecondary,
  },
  approveBtn: {
    backgroundColor: theme.successLight,
  },
  rejectBtn: {
    backgroundColor: theme.errorLight,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
