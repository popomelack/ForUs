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

// Filter only agency properties
const agencyProperties = mockProperties.slice(0, 6).map((p, index) => ({
  ...p,
  status: index === 0 ? 'active' : index === 1 ? 'pending' : index === 5 ? 'sold' : 'active',
  views: Math.floor(Math.random() * 2000) + 200,
  leads: Math.floor(Math.random() * 30) + 2,
  createdAt: '2026-01-' + (20 - index).toString().padStart(2, '0'),
}));

const statusFilters = [
  { id: 'all', label: 'Toutes' },
  { id: 'active', label: 'Actives' },
  { id: 'pending', label: 'En attente' },
  { id: 'sold', label: 'Vendues' },
];

export default function AgencyProperties() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [properties, setProperties] = useState(agencyProperties);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (propertyId: string) => {
    Haptics.selectionAsync();
    router.push(`/agency/add-property?id=${propertyId}`);
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

  const handleToggleStatus = (propertyId: string, currentStatus: string) => {
    Haptics.selectionAsync();
    const newStatus = currentStatus === 'active' ? 'sold' : 'active';
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus } : p
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: theme.success, bg: theme.successLight };
      case 'pending':
        return { label: 'En attente', color: theme.warning, bg: theme.warningLight };
      case 'sold':
        return { label: 'Vendue', color: theme.info, bg: theme.infoLight };
      default:
        return { label: 'Inactive', color: theme.textMuted, bg: theme.backgroundSecondary };
    }
  };

  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const totalLeads = properties.reduce((acc, p) => acc + p.leads, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mes Annonces</Text>
        <Pressable 
          style={styles.addBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/agency/add-property');
          }}
        >
          <MaterialIcons name="add" size={24} color={theme.primary} />
        </Pressable>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{properties.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {properties.filter(p => p.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Actives</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{totalViews}</Text>
          <Text style={styles.statLabel}>Vues</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.info }]}>{totalLeads}</Text>
          <Text style={styles.statLabel}>Leads</Text>
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
          {filteredProperties.length} annonce{filteredProperties.length !== 1 ? 's' : ''}
        </Text>

        {filteredProperties.map((property, index) => {
          const statusBadge = getStatusBadge(property.status);
          
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
                    <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                      <Text style={[styles.statusText, { color: statusBadge.color }]}>
                        {statusBadge.label}
                      </Text>
                    </View>
                    <Text style={styles.propertyTitle} numberOfLines={1}>{property.title}</Text>
                    <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
                    <Text style={styles.propertyLocation} numberOfLines={1}>
                      {property.neighborhood}, {property.city}
                    </Text>
                  </View>
                </Pressable>

                {/* Stats Row */}
                <View style={styles.propertyStats}>
                  <View style={styles.propertyStat}>
                    <MaterialIcons name="visibility" size={16} color={theme.textMuted} />
                    <Text style={styles.propertyStatText}>{property.views} vues</Text>
                  </View>
                  <View style={styles.propertyStat}>
                    <MaterialIcons name="people" size={16} color={theme.textMuted} />
                    <Text style={styles.propertyStatText}>{property.leads} leads</Text>
                  </View>
                  <View style={styles.propertyStat}>
                    <MaterialIcons name="event" size={16} color={theme.textMuted} />
                    <Text style={styles.propertyStatText}>{property.createdAt}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.propertyActions}>
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => router.push(`/property/${property.id}`)}
                  >
                    <MaterialIcons name="visibility" size={18} color={theme.info} />
                    <Text style={[styles.actionText, { color: theme.info }]}>Voir</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => handleEdit(property.id)}
                  >
                    <MaterialIcons name="edit" size={18} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>Modifier</Text>
                  </Pressable>
                  
                  {property.status !== 'pending' && (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleToggleStatus(property.id, property.status)}
                    >
                      <MaterialIcons 
                        name={property.status === 'active' ? 'check-circle' : 'replay'} 
                        size={18} 
                        color={property.status === 'active' ? theme.success : theme.warning} 
                      />
                      <Text style={[styles.actionText, { color: property.status === 'active' ? theme.success : theme.warning }]}>
                        {property.status === 'active' ? 'Marquer vendue' : 'Réactiver'}
                      </Text>
                    </Pressable>
                  )}
                  
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

        {filteredProperties.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="home-work" size={60} color={theme.textMuted} />
            <Text style={styles.emptyTitle}>Aucune annonce</Text>
            <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces</Text>
            <Pressable 
              style={styles.addFirstBtn}
              onPress={() => router.push('/agency/add-property')}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
              <Text style={styles.addFirstBtnText}>Créer ma première annonce</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable 
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/agency/add-property');
        }}
      >
        <MaterialIcons name="add" size={28} color="#FFF" />
      </Pressable>
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
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
  propertyLocation: {
    fontSize: 12,
    color: theme.textMuted,
  },
  propertyStats: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 16,
  },
  propertyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyStatText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  propertyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 10,
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
  actionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.lg,
  },
  addFirstBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
