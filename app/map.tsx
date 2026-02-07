import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../constants/theme';
import { formatPrice, NEIGHBORHOODS } from '../constants/config';
import { properties, Property } from '../services/mockData';
import { useApp } from '../contexts/AppContext';

const { width, height } = Dimensions.get('window');

// City coordinates
const CITY_REGIONS = {
  'Brazzaville': {
    latitude: -4.2634,
    longitude: 15.2429,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  },
  'Pointe-Noire': {
    latitude: -4.7692,
    longitude: 11.8636,
    latitudeDelta: 0.10,
    longitudeDelta: 0.10,
  },
};

// Add coordinates to properties that don't have them
const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  // Brazzaville
  'Mpila': { lat: -4.2634, lng: 15.2429 },
  'Centre-ville': { lat: -4.2611, lng: 15.2469 },
  'Bacongo': { lat: -4.2701, lng: 15.2521 },
  'Moungali': { lat: -4.2550, lng: 15.2550 },
  'Poto-Poto': { lat: -4.2580, lng: 15.2510 },
  'Talangaï': { lat: -4.2400, lng: 15.2600 },
  'Ouenzé': { lat: -4.2450, lng: 15.2480 },
  'Kintélé': { lat: -4.1900, lng: 15.2800 },
  'Djiri': { lat: -4.2100, lng: 15.3000 },
  'Makélékélé': { lat: -4.2900, lng: 15.2400 },
  // Pointe-Noire
  'Loandjili': { lat: -4.7692, lng: 11.8636 },
  'Tié-Tié': { lat: -4.7800, lng: 11.8500 },
  'Mvou-Mvou': { lat: -4.7550, lng: 11.8700 },
  'Lumumba': { lat: -4.7900, lng: 11.8600 },
};

// Enhance properties with coordinates
const propertiesWithCoords = properties.map((property) => {
  if (property.coordinates) return property;
  
  const neighborhoodCoord = NEIGHBORHOOD_COORDS[property.neighborhood];
  if (neighborhoodCoord) {
    // Add small random offset to prevent overlapping
    return {
      ...property,
      coordinates: {
        lat: neighborhoodCoord.lat + (Math.random() - 0.5) * 0.01,
        lng: neighborhoodCoord.lng + (Math.random() - 0.5) * 0.01,
      },
    };
  }
  return property;
});

const typeFilters = [
  { id: 'all', label: 'Tous', icon: 'home' },
  { id: 'villa', label: 'Villas', icon: 'villa' },
  { id: 'appartement', label: 'Apparts', icon: 'apartment' },
  { id: 'terrain', label: 'Terrains', icon: 'landscape' },
  { id: 'bureau', label: 'Bureaux', icon: 'business' },
];

const statusFilters = [
  { id: 'all', label: 'Tous' },
  { id: 'vente', label: 'À vendre' },
  { id: 'location', label: 'À louer' },
];

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useApp();
  
  const [selectedCity, setSelectedCity] = useState<'Brazzaville' | 'Pointe-Noire'>('Brazzaville');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return propertiesWithCoords.filter((property) => {
      if (!property.coordinates) return false;
      if (property.city !== selectedCity) return false;
      if (selectedType !== 'all' && property.type !== selectedType) return false;
      if (selectedStatus !== 'all' && property.status !== selectedStatus) return false;
      if (selectedNeighborhood && property.neighborhood !== selectedNeighborhood) return false;
      return true;
    });
  }, [selectedCity, selectedType, selectedStatus, selectedNeighborhood]);

  // Get neighborhoods for selected city
  const cityNeighborhoods = NEIGHBORHOODS[selectedCity] || [];

  // Handle city change
  const handleCityChange = useCallback((city: 'Brazzaville' | 'Pointe-Noire') => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedCity(city);
    setSelectedNeighborhood(null);
    setSelectedProperty(null);
  }, []);

  // Handle marker press
  const handleMarkerPress = useCallback((property: Property) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProperty(property);
  }, []);

  // Handle neighborhood filter
  const handleNeighborhoodSelect = useCallback((neighborhood: string | null) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedNeighborhood(neighborhood);
    setSelectedProperty(null);
  }, []);

  // Get marker color based on property status
  const getMarkerColor = (property: Property) => {
    if (property.isPremium) return theme.premium;
    return property.status === 'vente' ? theme.forSale : theme.forRent;
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Carte</Text>
        <Pressable 
          style={styles.filterBtn}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setShowFilters(!showFilters);
          }}
        >
          <MaterialIcons name="tune" size={24} color={theme.primary} />
          {(selectedType !== 'all' || selectedStatus !== 'all' || selectedNeighborhood) && (
            <View style={styles.filterBadge} />
          )}
        </Pressable>
      </View>

      {/* City Selector */}
      <View style={styles.citySelectorContainer}>
        <View style={styles.citySelector}>
          {(['Brazzaville', 'Pointe-Noire'] as const).map((city) => (
            <Pressable
              key={city}
              style={[
                styles.cityBtn,
                selectedCity === city && styles.cityBtnActive
              ]}
              onPress={() => handleCityChange(city)}
            >
              <MaterialIcons 
                name="location-city" 
                size={16} 
                color={selectedCity === city ? '#FFF' : theme.textSecondary} 
              />
              <Text style={[
                styles.cityBtnText,
                selectedCity === city && styles.cityBtnTextActive
              ]}>
                {city}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.propertiesCount}>
          {filteredProperties.length} bien{filteredProperties.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <Animated.View 
          entering={SlideInDown.duration(300)}
          style={styles.filtersPanel}
        >
          {/* Type Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type de bien</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {typeFilters.map((filter) => (
                <Pressable
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedType === filter.id && styles.filterChipActive
                  ]}
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                    setSelectedType(filter.id);
                  }}
                >
                  <MaterialIcons 
                    name={filter.icon as any} 
                    size={16} 
                    color={selectedType === filter.id ? '#FFF' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    selectedType === filter.id && styles.filterChipTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Status Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Transaction</Text>
            <View style={styles.filterRowWrap}>
              {statusFilters.map((filter) => (
                <Pressable
                  key={filter.id}
                  style={[
                    styles.statusChip,
                    selectedStatus === filter.id && styles.statusChipActive
                  ]}
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                    setSelectedStatus(filter.id);
                  }}
                >
                  <Text style={[
                    styles.statusChipText,
                    selectedStatus === filter.id && styles.statusChipTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Neighborhood Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Quartier</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              <Pressable
                style={[
                  styles.neighborhoodChip,
                  !selectedNeighborhood && styles.neighborhoodChipActive
                ]}
                onPress={() => handleNeighborhoodSelect(null)}
              >
                <Text style={[
                  styles.neighborhoodChipText,
                  !selectedNeighborhood && styles.neighborhoodChipTextActive
                ]}>
                  Tous
                </Text>
              </Pressable>
              {cityNeighborhoods.map((neighborhood) => (
                <Pressable
                  key={neighborhood}
                  style={[
                    styles.neighborhoodChip,
                    selectedNeighborhood === neighborhood && styles.neighborhoodChipActive
                  ]}
                  onPress={() => handleNeighborhoodSelect(neighborhood)}
                >
                  <Text style={[
                    styles.neighborhoodChipText,
                    selectedNeighborhood === neighborhood && styles.neighborhoodChipTextActive
                  ]}>
                    {neighborhood}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Reset Filters */}
          <Pressable 
            style={styles.resetBtn}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedNeighborhood(null);
            }}
          >
            <MaterialIcons name="refresh" size={18} color={theme.primary} />
            <Text style={styles.resetBtnText}>Réinitialiser les filtres</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Static Map Placeholder with Property Grid */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapOverlay}>
            <MaterialIcons name="map" size={48} color={theme.primary} />
            <Text style={styles.mapPlaceholderTitle}>
              Carte de {selectedCity}
            </Text>
            <Text style={styles.mapPlaceholderText}>
              {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} disponible{filteredProperties.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {/* Property Markers Grid */}
          <ScrollView 
            style={styles.markersContainer}
            contentContainerStyle={styles.markersGrid}
            showsVerticalScrollIndicator={false}
          >
            {filteredProperties.map((property) => (
              <Pressable
                key={property.id}
                style={[
                  styles.propertyMarker,
                  selectedProperty?.id === property.id && styles.propertyMarkerSelected
                ]}
                onPress={() => handleMarkerPress(property)}
              >
                <Image
                  source={{ uri: property.images[0] }}
                  style={styles.markerImage}
                  contentFit="cover"
                />
                <View style={[
                  styles.markerBadge,
                  { backgroundColor: getMarkerColor(property) }
                ]}>
                  <MaterialIcons 
                    name={property.status === 'vente' ? 'sell' : 'key'} 
                    size={10} 
                    color="#FFF" 
                  />
                </View>
                <View style={styles.markerInfo}>
                  <Text style={styles.markerPrice} numberOfLines={1}>
                    {formatPrice(property.price)}
                  </Text>
                  <Text style={styles.markerLocation} numberOfLines={1}>
                    {property.neighborhood}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.forSale }]} />
            <Text style={styles.legendText}>Vente</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.forRent }]} />
            <Text style={styles.legendText}>Location</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.premium }]} />
            <Text style={styles.legendText}>Premium</Text>
          </View>
        </View>
      </View>

      {/* Selected Property Card */}
      {selectedProperty && (
        <Animated.View 
          entering={FadeInUp.duration(300)}
          style={[styles.propertyCard, { paddingBottom: insets.bottom + 16 }]}
        >
          <Pressable 
            style={styles.propertyCardContent}
            onPress={() => router.push(`/property/${selectedProperty.id}`)}
          >
            <Image
              source={{ uri: selectedProperty.images[0] }}
              style={styles.propertyImage}
              contentFit="cover"
            />
            <View style={styles.propertyInfo}>
              <View style={styles.propertyBadges}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedProperty.status === 'vente' ? theme.primaryBg : '#E0F2F1' }
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    { color: selectedProperty.status === 'vente' ? theme.primary : theme.secondary }
                  ]}>
                    {selectedProperty.status === 'vente' ? 'À vendre' : 'À louer'}
                  </Text>
                </View>
                {selectedProperty.isPremium && (
                  <View style={styles.premiumBadge}>
                    <MaterialIcons name="star" size={12} color={theme.premium} />
                  </View>
                )}
              </View>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {selectedProperty.title}
              </Text>
              <Text style={styles.propertyPrice}>{formatPrice(selectedProperty.price)}</Text>
              <View style={styles.propertyDetails}>
                <View style={styles.propertyDetail}>
                  <MaterialIcons name="location-on" size={14} color={theme.textMuted} />
                  <Text style={styles.propertyDetailText}>{selectedProperty.neighborhood}</Text>
                </View>
                <View style={styles.propertyDetail}>
                  <MaterialIcons name="square-foot" size={14} color={theme.textMuted} />
                  <Text style={styles.propertyDetailText}>{selectedProperty.surface} m²</Text>
                </View>
                {selectedProperty.bedrooms > 0 && (
                  <View style={styles.propertyDetail}>
                    <MaterialIcons name="bed" size={14} color={theme.textMuted} />
                    <Text style={styles.propertyDetailText}>{selectedProperty.bedrooms}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.propertyActions}>
              <Pressable 
                style={styles.favoriteBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  toggleFavorite(selectedProperty.id);
                }}
              >
                <MaterialIcons 
                  name={isFavorite(selectedProperty.id) ? 'favorite' : 'favorite-border'} 
                  size={22} 
                  color={isFavorite(selectedProperty.id) ? theme.error : theme.textMuted} 
                />
              </Pressable>
              <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
            </View>
          </Pressable>
          
          {/* Close button */}
          <Pressable 
            style={styles.closeCardBtn}
            onPress={() => setSelectedProperty(null)}
          >
            <MaterialIcons name="close" size={18} color={theme.textMuted} />
          </Pressable>
        </Animated.View>
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
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
  },
  citySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
  },
  citySelector: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  cityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  cityBtnActive: {
    backgroundColor: theme.primary,
  },
  cityBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  cityBtnTextActive: {
    color: '#FFF',
  },
  propertiesCount: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textMuted,
  },
  filtersPanel: {
    backgroundColor: theme.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: theme.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: theme.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statusChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  statusChipTextActive: {
    color: '#FFF',
  },
  neighborhoodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: theme.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  neighborhoodChipActive: {
    backgroundColor: theme.secondary,
    borderColor: theme.secondary,
  },
  neighborhoodChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  neighborhoodChipTextActive: {
    color: '#FFF',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
  },
  mapOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 12,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  markersContainer: {
    flex: 1,
  },
  markersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  propertyMarker: {
    width: (width - 48) / 3,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  propertyMarkerSelected: {
    borderWidth: 2,
    borderColor: theme.primary,
  },
  markerImage: {
    width: '100%',
    height: 70,
  },
  markerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInfo: {
    padding: 8,
  },
  markerPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  markerLocation: {
    fontSize: 10,
    color: theme.textMuted,
    marginTop: 2,
  },
  legend: {
    position: 'absolute',
    left: 16,
    top: 16,
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    padding: 10,
    gap: 12,
    ...shadows.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  propertyCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: 16,
    ...shadows.lg,
  },
  propertyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyImage: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.lg,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  propertyBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF9C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 6,
  },
  propertyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  propertyDetailText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  propertyActions: {
    alignItems: 'center',
    gap: 8,
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCardBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
