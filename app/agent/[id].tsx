import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function AgentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agents, properties, favorites, toggleFavorite } = useApp();
  
  const agent = agents.find(a => a.id === id);
  const agentProperties = properties.filter(p => p.agent.id === id);

  if (!agent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <MaterialIcons name="person-off" size={60} color={theme.error} />
          <Text style={styles.errorText}>Agent introuvable</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleWhatsApp = () => {
    Haptics.selectionAsync();
    const message = encodeURIComponent(
      `Bonjour ${agent.name}, je vous contacte via l'application ForUs. Je souhaiterais avoir des informations sur vos propriétés disponibles.`
    );
    Linking.openURL(`https://wa.me/${agent.whatsapp.replace('+', '')}?text=${message}`);
  };

  const handleCall = () => {
    Haptics.selectionAsync();
    Linking.openURL(`tel:${agent.phone}`);
  };

  const handleEmail = () => {
    Haptics.selectionAsync();
    Linking.openURL(`mailto:${agent.email}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Profil Agent</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Agent Profile Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <Image
            source={{ uri: agent.photo }}
            style={styles.profilePhoto}
            contentFit="cover"
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{agent.name}</Text>
              {agent.verified && (
                <MaterialIcons name="verified" size={20} color={theme.primary} />
              )}
            </View>
            <Text style={styles.profileAgency}>{agent.agency}</Text>
            
            <View style={styles.ratingRow}>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialIcons
                    key={star}
                    name={star <= Math.floor(agent.rating) ? 'star' : 'star-border'}
                    size={18}
                    color="#FFB800"
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {agent.rating} ({agent.reviews} avis)
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{agent.properties}</Text>
            <Text style={styles.statLabel}>Annonces</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{agent.reviews}</Text>
            <Text style={styles.statLabel}>Avis</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{agent.rating}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </Animated.View>

        {/* Bio */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.bioText}>{agent.bio}</Text>
        </Animated.View>

        {/* Specialties */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.specialtiesRow}>
            {agent.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyChip}>
                <MaterialIcons name="check-circle" size={16} color={theme.primary} />
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Agency Info */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Agence</Text>
          <View style={styles.agencyCard}>
            <Image
              source={{ uri: agent.agencyLogo }}
              style={styles.agencyLogo}
              contentFit="cover"
            />
            <View style={styles.agencyInfo}>
              <Text style={styles.agencyName}>{agent.agency}</Text>
              <Text style={styles.agencyDesc}>Agence immobilière certifiée</Text>
            </View>
          </View>
        </Animated.View>

        {/* Properties */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Annonces de {agent.name.split(' ')[0]}</Text>
            <Text style={styles.propertyCount}>{agentProperties.length} bien(s)</Text>
          </View>
          
          {agentProperties.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {agentProperties.map((property) => (
                <Pressable
                  key={property.id}
                  style={styles.propertyCard}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/property/${property.id}`);
                  }}
                >
                  <Image
                    source={{ uri: property.images[0] }}
                    style={styles.propertyImage}
                    contentFit="cover"
                  />
                  <View style={[
                    styles.propertyStatus,
                    { backgroundColor: property.status === 'vente' ? theme.forSale : theme.forRent }
                  ]}>
                    <Text style={styles.propertyStatusText}>
                      {property.status === 'vente' ? 'VENTE' : 'LOCATION'}
                    </Text>
                  </View>
                  <Pressable 
                    style={styles.propertyFavorite}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      toggleFavorite(property.id);
                    }}
                  >
                    <MaterialIcons 
                      name={favorites.includes(property.id) ? 'favorite' : 'favorite-border'} 
                      size={18} 
                      color={favorites.includes(property.id) ? theme.error : '#FFF'} 
                    />
                  </Pressable>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
                    <Text style={styles.propertyTitle} numberOfLines={1}>{property.title}</Text>
                    <Text style={styles.propertyLocation} numberOfLines={1}>
                      {property.neighborhood}, {property.city}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noProperties}>
              <MaterialIcons name="home" size={40} color={theme.textMuted} />
              <Text style={styles.noPropertiesText}>Aucune annonce disponible</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.callBtn} onPress={handleCall}>
          <MaterialIcons name="phone" size={22} color={theme.primary} />
        </Pressable>
        <Pressable style={styles.emailBtn} onPress={handleEmail}>
          <MaterialIcons name="email" size={22} color={theme.primary} />
        </Pressable>
        <Pressable style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <MaterialIcons name="chat" size={22} color="#FFF" />
          <Text style={styles.whatsappBtnText}>WhatsApp</Text>
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
    fontWeight: '600',
    color: theme.textPrimary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.surface,
    marginBottom: 12,
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  profileAgency: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
    marginVertical: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  propertyCount: {
    fontSize: 14,
    color: theme.textMuted,
  },
  bioText: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  specialtyText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
  },
  agencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.border,
  },
  agencyLogo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  agencyInfo: {
    flex: 1,
  },
  agencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  agencyDesc: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  propertyCard: {
    width: 200,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  propertyImage: {
    width: '100%',
    height: 140,
  },
  propertyStatus: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyStatusText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  propertyFavorite: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 12,
    color: theme.textMuted,
  },
  noProperties: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
  },
  noPropertiesText: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 8,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    gap: 12,
    ...shadows.lg,
  },
  callBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  emailBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.whatsapp,
    borderRadius: 26,
    height: 52,
  },
  whatsappBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
  },
  errorButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
