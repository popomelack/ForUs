import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { CITIES, NEIGHBORHOODS, PROPERTY_TYPES } from '../../constants/config';

const transactionTypes = [
  { id: 'sale', label: 'Vente' },
  { id: 'rent', label: 'Location' },
];

const amenitiesList = [
  { id: 'pool', label: 'Piscine', icon: 'pool' },
  { id: 'garden', label: 'Jardin', icon: 'park' },
  { id: 'garage', label: 'Garage', icon: 'garage' },
  { id: 'security', label: 'Sécurité 24h', icon: 'security' },
  { id: 'ac', label: 'Climatisation', icon: 'ac-unit' },
  { id: 'furnished', label: 'Meublé', icon: 'chair' },
  { id: 'generator', label: 'Groupe électrogène', icon: 'bolt' },
  { id: 'water', label: 'Château d\'eau', icon: 'water-drop' },
];

export default function AddProperty() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    transactionType: 'sale',
    price: '',
    city: 'Brazzaville',
    neighborhood: '',
    address: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    images: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAmenity = (amenityId: string) => {
    Haptics.selectionAsync();
    const newAmenities = formData.amenities.includes(amenityId)
      ? formData.amenities.filter(a => a !== amenityId)
      : [...formData.amenities, amenityId];
    updateField('amenities', newAmenities);
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - formData.images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      updateField('images', [...formData.images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    Haptics.selectionAsync();
    const newImages = formData.images.filter((_, i) => i !== index);
    updateField('images', newImages);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.price.trim()) newErrors.price = 'Prix requis';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Quartier requis';
    if (!formData.area.trim()) newErrors.area = 'Surface requise';
    if (formData.images.length === 0) newErrors.images = 'Au moins une photo requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      'Succès',
      isEditing ? 'Annonce modifiée avec succès' : 'Annonce créée et soumise pour validation',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const cityNeighborhoods = NEIGHBORHOODS[formData.city as keyof typeof NEIGHBORHOODS] || [];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Images Section */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Photos *</Text>
            <Text style={styles.sectionSubtitle}>Ajoutez jusqu'à 10 photos de qualité</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
            >
              {formData.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} contentFit="cover" />
                  <Pressable 
                    style={styles.removeImageBtn}
                    onPress={() => removeImage(index)}
                  >
                    <MaterialIcons name="close" size={16} color="#FFF" />
                  </Pressable>
                  {index === 0 && (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Principale</Text>
                    </View>
                  )}
                </View>
              ))}
              
              {formData.images.length < 10 && (
                <Pressable style={styles.addImageBtn} onPress={pickImages}>
                  <MaterialIcons name="add-photo-alternate" size={32} color={theme.primary} />
                  <Text style={styles.addImageText}>Ajouter</Text>
                </Pressable>
              )}
            </ScrollView>
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </Animated.View>

          {/* Basic Info */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Titre de l'annonce *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Ex: Villa moderne avec piscine"
                placeholderTextColor={theme.textMuted}
                value={formData.title}
                onChangeText={(text) => updateField('title', text)}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                placeholder="Décrivez votre bien en détail..."
                placeholderTextColor={theme.textMuted}
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </Animated.View>

          {/* Transaction Type */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Type de transaction</Text>
            <View style={styles.optionsRow}>
              {transactionTypes.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.optionChip,
                    formData.transactionType === type.id && styles.optionChipActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    updateField('transactionType', type.id);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    formData.transactionType === type.id && styles.optionTextActive
                  ]}>
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Property Type */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Type de bien</Text>
            <View style={styles.typeGrid}>
              {PROPERTY_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.typeCard,
                    formData.type === type.id && styles.typeCardActive
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    updateField('type', type.id);
                  }}
                >
                  <MaterialIcons 
                    name={type.icon as any} 
                    size={24} 
                    color={formData.type === type.id ? theme.primary : theme.textMuted} 
                  />
                  <Text style={[
                    styles.typeLabel,
                    formData.type === type.id && styles.typeLabelActive
                  ]}>
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Price */}
          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Prix *</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={[styles.priceInput, errors.price && styles.inputError]}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                value={formData.price}
                onChangeText={(text) => updateField('price', text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
              <View style={styles.priceSuffix}>
                <Text style={styles.priceCurrency}>FCFA</Text>
                {formData.transactionType === 'rent' && (
                  <Text style={styles.priceUnit}>/mois</Text>
                )}
              </View>
            </View>
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </Animated.View>

          {/* Location */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ville</Text>
              <View style={styles.selectContainer}>
                {CITIES.map((city) => (
                  <Pressable
                    key={city}
                    style={[
                      styles.selectOption,
                      formData.city === city && styles.selectOptionActive
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      updateField('city', city);
                      updateField('neighborhood', '');
                    }}
                  >
                    <Text style={[
                      styles.selectText,
                      formData.city === city && styles.selectTextActive
                    ]}>
                      {city}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quartier *</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.neighborhoodContainer}
              >
                {cityNeighborhoods.map((neighborhood) => (
                  <Pressable
                    key={neighborhood}
                    style={[
                      styles.neighborhoodChip,
                      formData.neighborhood === neighborhood && styles.neighborhoodChipActive
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      updateField('neighborhood', neighborhood);
                    }}
                  >
                    <Text style={[
                      styles.neighborhoodText,
                      formData.neighborhood === neighborhood && styles.neighborhoodTextActive
                    ]}>
                      {neighborhood}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {errors.neighborhood && <Text style={styles.errorText}>{errors.neighborhood}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse exacte</Text>
              <TextInput
                style={styles.input}
                placeholder="Rue, numéro, repère..."
                placeholderTextColor={theme.textMuted}
                value={formData.address}
                onChangeText={(text) => updateField('address', text)}
              />
            </View>
          </Animated.View>

          {/* Details */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailInput}>
                <Text style={styles.inputLabel}>Surface (m²) *</Text>
                <TextInput
                  style={[styles.input, errors.area && styles.inputError]}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  value={formData.area}
                  onChangeText={(text) => updateField('area', text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.detailInput}>
                <Text style={styles.inputLabel}>Chambres</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  value={formData.bedrooms}
                  onChangeText={(text) => updateField('bedrooms', text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.detailInput}>
                <Text style={styles.inputLabel}>Salles de bain</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  value={formData.bathrooms}
                  onChangeText={(text) => updateField('bathrooms', text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
          </Animated.View>

          {/* Amenities */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.amenitiesGrid}>
              {amenitiesList.map((amenity) => (
                <Pressable
                  key={amenity.id}
                  style={[
                    styles.amenityCard,
                    formData.amenities.includes(amenity.id) && styles.amenityCardActive
                  ]}
                  onPress={() => toggleAmenity(amenity.id)}
                >
                  <MaterialIcons 
                    name={amenity.icon as any} 
                    size={22} 
                    color={formData.amenities.includes(amenity.id) ? theme.primary : theme.textMuted} 
                  />
                  <Text style={[
                    styles.amenityLabel,
                    formData.amenities.includes(amenity.id) && styles.amenityLabelActive
                  ]}>
                    {amenity.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable 
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.submitBtnText}>Publication en cours...</Text>
          ) : (
            <>
              <MaterialIcons name="publish" size={20} color="#FFF" />
              <Text style={styles.submitBtnText}>
                {isEditing ? 'Enregistrer les modifications' : 'Publier l\'annonce'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
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
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  imagesContainer: {
    paddingVertical: 8,
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: theme.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainImageText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFF',
  },
  addImageBtn: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundSecondary,
  },
  addImageText: {
    fontSize: 12,
    color: theme.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  inputError: {
    borderColor: theme.error,
  },
  textArea: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: theme.error,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  optionChipActive: {
    backgroundColor: theme.primaryBg,
    borderColor: theme.primary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  optionTextActive: {
    color: theme.primary,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  typeCard: {
    width: '31%',
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  typeCardActive: {
    backgroundColor: theme.primaryBg,
    borderColor: theme.primary,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textSecondary,
    marginTop: 6,
  },
  typeLabelActive: {
    color: theme.primary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  priceSuffix: {
    marginLeft: 12,
    alignItems: 'flex-start',
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  priceUnit: {
    fontSize: 12,
    color: theme.textMuted,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  selectOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: theme.primaryBg,
    borderColor: theme.primary,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  selectTextActive: {
    color: theme.primary,
  },
  neighborhoodContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  neighborhoodChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  neighborhoodChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  neighborhoodText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  neighborhoodTextActive: {
    color: '#FFF',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  detailInput: {
    flex: 1,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  amenityCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  amenityCardActive: {
    backgroundColor: theme.primaryBg,
    borderColor: theme.primary,
  },
  amenityLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  amenityLabelActive: {
    color: theme.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    ...shadows.lg,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
