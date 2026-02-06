import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, spacing, borderRadius, shadows } from '../../constants/theme';
import { formatPrice, APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters, 
    clearFilters,
    getFilteredProperties,
    favorites,
    toggleFavorite,
  } = useApp();
  
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  
  const filteredProperties = useMemo(() => getFilteredProperties(), [
    searchQuery, 
    filters,
  ]);
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.city) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minBedrooms) count++;
    return count;
  }, [filters]);

  const handleSearch = () => {
    setSearchQuery(localQuery);
    Haptics.selectionAsync();
  };

  const handlePropertyPress = (propertyId: string) => {
    Haptics.selectionAsync();
    router.push(`/property/${propertyId}`);
  };

  const handleFavorite = (propertyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(propertyId);
  };

  const renderProperty = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable 
        style={styles.propertyRow}
        onPress={() => handlePropertyPress(item.id)}
      >
        <View style={styles.rowImageContainer}>
          <Image
            source={{ uri: item.images[0] }}
            style={styles.rowImage}
            contentFit="cover"
          />
          <View style={[
            styles.rowStatusBadge,
            { backgroundColor: item.status === 'vente' ? theme.forSale : theme.forRent }
          ]}>
            <Text style={styles.rowStatusText}>
              {item.status === 'vente' ? 'VENTE' : 'LOCATION'}
            </Text>
          </View>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NOUVEAU</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rowInfo}>
          <Text style={styles.rowPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.rowLocation}>
            <MaterialIcons name="location-on" size={12} color={theme.textMuted} />
            <Text style={styles.rowLocationText} numberOfLines={1}>
              {item.neighborhood}, {item.city}
            </Text>
          </View>
          
          <View style={styles.rowFeatures}>
            {item.bedrooms > 0 && (
              <View style={styles.rowFeatureItem}>
                <MaterialIcons name="king-bed" size={14} color={theme.textSecondary} />
                <Text style={styles.rowFeatureText}>{item.bedrooms}</Text>
              </View>
            )}
            {item.bathrooms > 0 && (
              <View style={styles.rowFeatureItem}>
                <MaterialIcons name="bathtub" size={14} color={theme.textSecondary} />
                <Text style={styles.rowFeatureText}>{item.bathrooms}</Text>
              </View>
            )}
            <View style={styles.rowFeatureItem}>
              <MaterialIcons name="straighten" size={14} color={theme.textSecondary} />
              <Text style={styles.rowFeatureText}>{item.surface}m²</Text>
            </View>
          </View>
          
          <View style={styles.rowActions}>
            <View style={styles.rowStats}>
              <MaterialIcons name="visibility" size={14} color={theme.textMuted} />
              <Text style={styles.rowStatText}>{item.views}</Text>
            </View>
            <Pressable 
              style={styles.rowFavoriteBtn}
              onPress={() => handleFavorite(item.id)}
            >
              <MaterialIcons 
                name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'} 
                size={20} 
                color={favorites.includes(item.id) ? theme.error : theme.textMuted} 
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={22} color={theme.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ville, quartier, type..."
              placeholderTextColor={theme.textMuted}
              value={localQuery}
              onChangeText={setLocalQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {localQuery.length > 0 && (
              <Pressable onPress={() => { setLocalQuery(''); setSearchQuery(''); }}>
                <MaterialIcons name="close" size={20} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable 
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive
            ]}
            onPress={() => setShowFilters(true)}
          >
            <MaterialIcons 
              name="tune" 
              size={22} 
              color={activeFiltersCount > 0 ? '#FFF' : theme.primary} 
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
        
        {/* Quick Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersContainer}
        >
          {[
            { label: 'Tous', value: null },
            { label: 'À vendre', value: 'vente' },
            { label: 'À louer', value: 'location' },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={[
                styles.quickFilterChip,
                filters.status === item.value && styles.quickFilterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setFilters({ status: item.value });
              }}
            >
              <Text style={[
                styles.quickFilterText,
                filters.status === item.value && styles.quickFilterTextActive
              ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
          
          <View style={styles.quickFilterDivider} />
          
          {APP_CONFIG.cities.map((city) => (
            <Pressable
              key={city}
              style={[
                styles.quickFilterChip,
                filters.city === city && styles.quickFilterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setFilters({ city: filters.city === city ? null : city });
              }}
            >
              <MaterialIcons 
                name="location-on" 
                size={14} 
                color={filters.city === city ? '#FFF' : theme.textSecondary} 
              />
              <Text style={[
                styles.quickFilterText,
                filters.city === city && styles.quickFilterTextActive
              ]}>
                {city}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
        </Text>
        {activeFiltersCount > 0 && (
          <Pressable 
            style={styles.clearFiltersBtn}
            onPress={() => {
              Haptics.selectionAsync();
              clearFilters();
              setLocalQuery('');
            }}
          >
            <Text style={styles.clearFiltersText}>Effacer filtres</Text>
            <MaterialIcons name="close" size={16} color={theme.primary} />
          </Pressable>
        )}
      </View>

      {/* Results List */}
      {filteredProperties.length > 0 ? (
        <FlashList
          data={filteredProperties}
          renderItem={renderProperty}
          estimatedItemSize={150}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/images/empty-search.png')}
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyText}>
            Essayez de modifier vos critères de recherche
          </Text>
          <Pressable 
            style={styles.emptyButton}
            onPress={() => {
              clearFilters();
              setLocalQuery('');
            }}
          >
            <Text style={styles.emptyButtonText}>Effacer les filtres</Text>
          </Pressable>
        </View>
      )}

      {/* Filters Modal */}
      <FilterModal 
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />
    </SafeAreaView>
  );
}

function FilterModal({ 
  visible, 
  onClose, 
  filters, 
  setFilters,
  clearFilters 
}: {
  visible: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (f: any) => void;
  clearFilters: () => void;
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={['top']} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={styles.modalTitle}>Filtres</Text>
          <Pressable onPress={() => { clearFilters(); Haptics.selectionAsync(); }}>
            <Text style={styles.modalClearText}>Effacer</Text>
          </Pressable>
        </View>
        
        <ScrollView 
          style={styles.modalContent}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          {/* Property Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Type de bien</Text>
            <View style={styles.filterOptions}>
              {APP_CONFIG.propertyTypes.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.filterOption,
                    filters.type === type.id && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilters({ type: filters.type === type.id ? null : type.id });
                  }}
                >
                  <MaterialIcons 
                    name={type.icon as any} 
                    size={20} 
                    color={filters.type === type.id ? '#FFF' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.filterOptionText,
                    filters.type === type.id && styles.filterOptionTextActive
                  ]}>
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Status */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Statut</Text>
            <View style={styles.filterOptions}>
              {APP_CONFIG.propertyStatus.slice(0, 2).map((status) => (
                <Pressable
                  key={status.id}
                  style={[
                    styles.filterOption,
                    styles.filterOptionWide,
                    filters.status === status.id && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilters({ status: filters.status === status.id ? null : status.id });
                  }}
                >
                  <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                  <Text style={[
                    styles.filterOptionText,
                    filters.status === status.id && styles.filterOptionTextActive
                  ]}>
                    {status.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* City */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Ville</Text>
            <View style={styles.filterOptions}>
              {APP_CONFIG.cities.map((city) => (
                <Pressable
                  key={city}
                  style={[
                    styles.filterOption,
                    filters.city === city && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilters({ city: filters.city === city ? null : city });
                  }}
                >
                  <MaterialIcons 
                    name="location-on" 
                    size={18} 
                    color={filters.city === city ? '#FFF' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.filterOptionText,
                    filters.city === city && styles.filterOptionTextActive
                  ]}>
                    {city}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Budget</Text>
            <View style={styles.filterOptions}>
              {APP_CONFIG.priceRanges.map((range, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.filterOption,
                    filters.minPrice === range.min && filters.maxPrice === range.max && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    if (filters.minPrice === range.min && filters.maxPrice === range.max) {
                      setFilters({ minPrice: null, maxPrice: null });
                    } else {
                      setFilters({ minPrice: range.min, maxPrice: range.max });
                    }
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.minPrice === range.min && filters.maxPrice === range.max && styles.filterOptionTextActive
                  ]}>
                    {range.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bedrooms */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Chambres minimum</Text>
            <View style={styles.filterOptions}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Pressable
                  key={num}
                  style={[
                    styles.filterOptionSmall,
                    filters.minBedrooms === num && styles.filterOptionActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilters({ minBedrooms: filters.minBedrooms === num ? null : num });
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.minBedrooms === num && styles.filterOptionTextActive
                  ]}>
                    {num}+
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable 
            style={styles.applyButton}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onClose();
            }}
          >
            <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.surface,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    ...shadows.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: theme.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  quickFiltersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  quickFilterChipActive: {
    backgroundColor: theme.primary,
  },
  quickFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  quickFilterTextActive: {
    color: '#FFF',
  },
  quickFilterDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.border,
    marginHorizontal: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  propertyRow: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  rowImageContainer: {
    width: 130,
    height: 140,
    position: 'relative',
  },
  rowImage: {
    width: '100%',
    height: '100%',
  },
  rowStatusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  rowStatusText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
  },
  newBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: theme.success,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  rowPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 18,
  },
  rowLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLocationText: {
    fontSize: 12,
    color: theme.textMuted,
    marginLeft: 2,
  },
  rowFeatures: {
    flexDirection: 'row',
    gap: 12,
  },
  rowFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rowFeatureText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowStatText: {
    fontSize: 11,
    color: theme.textMuted,
  },
  rowFavoriteBtn: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
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
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    backgroundColor: theme.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  modalClearText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  modalContent: {
    flex: 1,
    paddingTop: 16,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 6,
  },
  filterOptionWide: {
    flex: 1,
    justifyContent: 'center',
  },
  filterOptionSmall: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterOptionActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  filterOptionTextActive: {
    color: '#FFF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  applyButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
