import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice, formatPriceFull } from '../../constants/config';

// Current subscription
const currentSubscription = {
  plan: 'Premium',
  price: 150000,
  billingCycle: 'monthly',
  startDate: '2024-01-01',
  nextBillingDate: '2026-03-01',
  daysRemaining: 22,
  autoRenew: true,
  usage: {
    properties: { used: 45, limit: 100 },
    agents: { used: 6, limit: 10 },
    premiumListings: { used: 8, limit: 15 },
    featuredSlots: { used: 2, limit: 5 },
  },
  features: [
    'Jusqu\'à 100 annonces actives',
    'Jusqu\'à 10 agents',
    '15 annonces premium/mois',
    '5 emplacements à la une',
    'Analytics avancées',
    'Support prioritaire',
    'Badge vérifié',
    'Export des leads',
  ],
};

// Available plans
const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    popular: false,
    features: [
      { text: '10 annonces actives', included: true },
      { text: '3 agents maximum', included: true },
      { text: '0 annonces premium', included: true },
      { text: 'Support email', included: true },
      { text: 'Analytics basiques', included: true },
      { text: 'Badge vérifié', included: false },
      { text: 'Annonces à la une', included: false },
      { text: 'Export des leads', included: false },
    ],
    limits: { properties: 10, agents: 3, premium: 0, featured: 0 },
  },
  {
    id: 'basic',
    name: 'Basique',
    price: 50000,
    popular: false,
    features: [
      { text: '30 annonces actives', included: true },
      { text: '5 agents maximum', included: true },
      { text: '5 annonces premium/mois', included: true },
      { text: 'Support email', included: true },
      { text: 'Analytics détaillées', included: true },
      { text: 'Badge vérifié', included: true },
      { text: 'Annonces à la une', included: false },
      { text: 'Export des leads', included: false },
    ],
    limits: { properties: 30, agents: 5, premium: 5, featured: 0 },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 150000,
    popular: true,
    features: [
      { text: '100 annonces actives', included: true },
      { text: '10 agents maximum', included: true },
      { text: '15 annonces premium/mois', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Analytics avancées', included: true },
      { text: 'Badge vérifié', included: true },
      { text: '5 emplacements à la une', included: true },
      { text: 'Export des leads', included: true },
    ],
    limits: { properties: 100, agents: 10, premium: 15, featured: 5 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 350000,
    popular: false,
    features: [
      { text: '500 annonces actives', included: true },
      { text: '25 agents maximum', included: true },
      { text: 'Annonces premium illimitées', included: true },
      { text: 'Support 24/7 VIP', included: true },
      { text: 'Analytics personnalisées', included: true },
      { text: 'Badge vérifié gold', included: true },
      { text: '15 emplacements à la une', included: true },
      { text: 'API accès complet', included: true },
    ],
    limits: { properties: 500, agents: 25, premium: -1, featured: 15 },
  },
];

// Payment history
const paymentHistory = [
  { id: '1', date: '2026-02-01', amount: 150000, status: 'paid', method: 'Mobile Money' },
  { id: '2', date: '2026-01-01', amount: 150000, status: 'paid', method: 'Mobile Money' },
  { id: '3', date: '2025-12-01', amount: 150000, status: 'paid', method: 'Virement' },
  { id: '4', date: '2025-11-01', amount: 150000, status: 'paid', method: 'Mobile Money' },
];

export default function AgencySubscription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPlans, setShowPlans] = useState(false);
  const [autoRenew, setAutoRenew] = useState(currentSubscription.autoRenew);

  const handleUpgrade = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      Alert.alert(
        `Passer au plan ${plan.name}`,
        `Vous allez être facturé ${formatPriceFull(plan.price)}/mois. Continuer ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Confirmer', 
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Succès', 'Votre abonnement a été mis à jour');
              setShowPlans(false);
            }
          },
        ]
      );
    }
  };

  const handleToggleAutoRenew = () => {
    Haptics.selectionAsync();
    setAutoRenew(!autoRenew);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return theme.error;
    if (percentage >= 70) return theme.warning;
    return theme.success;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mon Abonnement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.currentPlanCard}>
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planGradient}
          >
            <View style={styles.planHeader}>
              <View>
                <View style={styles.planBadge}>
                  <MaterialIcons name="workspace-premium" size={18} color="#FFD700" />
                  <Text style={styles.planName}>{currentSubscription.plan}</Text>
                </View>
                <Text style={styles.planPrice}>{formatPrice(currentSubscription.price)}/mois</Text>
              </View>
              <View style={styles.planStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Actif</Text>
              </View>
            </View>
            
            <View style={styles.billingInfo}>
              <View style={styles.billingItem}>
                <MaterialIcons name="event" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.billingText}>
                  Prochain paiement: {currentSubscription.nextBillingDate}
                </Text>
              </View>
              <View style={styles.billingItem}>
                <MaterialIcons name="timer" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.billingText}>
                  {currentSubscription.daysRemaining} jours restants
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Usage Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Utilisation</Text>
          <View style={styles.usageCard}>
            {Object.entries(currentSubscription.usage).map(([key, value], index) => {
              const percentage = getUsagePercentage(value.used, value.limit);
              const color = getUsageColor(percentage);
              const labels: Record<string, string> = {
                properties: 'Annonces',
                agents: 'Agents',
                premiumListings: 'Annonces premium',
                featuredSlots: 'À la une',
              };
              
              return (
                <View key={key} style={[styles.usageItem, index < 3 && styles.usageItemBorder]}>
                  <View style={styles.usageHeader}>
                    <Text style={styles.usageLabel}>{labels[key]}</Text>
                    <Text style={[styles.usageValue, { color }]}>
                      {value.used}/{value.limit}
                    </Text>
                  </View>
                  <View style={styles.usageBarBg}>
                    <View style={[styles.usageBar, { width: `${percentage}%`, backgroundColor: color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités incluses</Text>
          <View style={styles.featuresCard}>
            {currentSubscription.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={18} color={theme.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Auto-Renew Toggle */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Pressable style={styles.toggleCard} onPress={handleToggleAutoRenew}>
            <View style={styles.toggleInfo}>
              <MaterialIcons name="autorenew" size={24} color={theme.primary} />
              <View style={styles.toggleText}>
                <Text style={styles.toggleTitle}>Renouvellement automatique</Text>
                <Text style={styles.toggleSubtitle}>
                  {autoRenew ? 'Votre abonnement sera renouvelé automatiquement' : 'Vous devrez renouveler manuellement'}
                </Text>
              </View>
            </View>
            <View style={[styles.toggle, autoRenew && styles.toggleActive]}>
              <View style={[styles.toggleDot, autoRenew && styles.toggleDotActive]} />
            </View>
          </Pressable>
        </Animated.View>

        {/* Change Plan Button */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Pressable 
            style={styles.changePlanBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setShowPlans(!showPlans);
            }}
          >
            <MaterialIcons name="swap-vert" size={20} color={theme.primary} />
            <Text style={styles.changePlanText}>
              {showPlans ? 'Masquer les plans' : 'Changer de plan'}
            </Text>
            <MaterialIcons 
              name={showPlans ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={theme.primary} 
            />
          </Pressable>
        </Animated.View>

        {/* Plans Grid */}
        {showPlans && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Plans disponibles</Text>
            {plans.map((plan, index) => {
              const isCurrent = plan.id === 'premium';
              return (
                <Animated.View
                  key={plan.id}
                  entering={FadeInDown.delay(index * 50).duration(300)}
                >
                  <View style={[
                    styles.planCard,
                    plan.popular && styles.planCardPopular,
                    isCurrent && styles.planCardCurrent
                  ]}>
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Populaire</Text>
                      </View>
                    )}
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentText}>Actuel</Text>
                      </View>
                    )}
                    
                    <View style={styles.planCardHeader}>
                      <Text style={styles.planCardName}>{plan.name}</Text>
                      <Text style={styles.planCardPrice}>
                        {plan.price > 0 ? formatPrice(plan.price) : 'Gratuit'}
                        {plan.price > 0 && <Text style={styles.planCardPeriod}>/mois</Text>}
                      </Text>
                    </View>

                    <View style={styles.planFeatures}>
                      {plan.features.slice(0, 5).map((feature, fIndex) => (
                        <View key={fIndex} style={styles.planFeatureItem}>
                          <MaterialIcons 
                            name={feature.included ? 'check' : 'close'} 
                            size={16} 
                            color={feature.included ? theme.success : theme.textMuted} 
                          />
                          <Text style={[
                            styles.planFeatureText,
                            !feature.included && styles.planFeatureDisabled
                          ]}>
                            {feature.text}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {!isCurrent && (
                      <Pressable 
                        style={[
                          styles.selectPlanBtn,
                          plan.price > currentSubscription.price && styles.upgradePlanBtn
                        ]}
                        onPress={() => handleUpgrade(plan.id)}
                      >
                        <Text style={[
                          styles.selectPlanText,
                          plan.price > currentSubscription.price && styles.upgradePlanText
                        ]}>
                          {plan.price > currentSubscription.price ? 'Passer au supérieur' : 
                           plan.price < currentSubscription.price ? 'Rétrograder' : 'Sélectionner'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

        {/* Payment History */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des paiements</Text>
            <Pressable>
              <Text style={styles.seeAllText}>Tout voir</Text>
            </Pressable>
          </View>
          <View style={styles.historyCard}>
            {paymentHistory.map((payment, index) => (
              <View key={payment.id} style={[
                styles.historyItem,
                index < paymentHistory.length - 1 && styles.historyItemBorder
              ]}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>{payment.date}</Text>
                  <Text style={styles.historyMethod}>{payment.method}</Text>
                </View>
                <View style={styles.historyAmount}>
                  <Text style={styles.historyPrice}>{formatPrice(payment.amount)}</Text>
                  <View style={styles.historyStatus}>
                    <MaterialIcons name="check-circle" size={14} color={theme.success} />
                    <Text style={styles.historyStatusText}>Payé</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Méthodes de paiement</Text>
          <View style={styles.paymentCard}>
            <Pressable style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="phone-android" size={22} color="#FF9800" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Mobile Money</Text>
                <Text style={styles.paymentDetail}>MTN, Airtel Money</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
            </Pressable>
            
            <Pressable style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: theme.infoLight }]}>
                <MaterialIcons name="account-balance" size={22} color={theme.info} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Virement bancaire</Text>
                <Text style={styles.paymentDetail}>Banques locales</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
            </Pressable>
            
            <Pressable style={[styles.paymentMethod, { borderBottomWidth: 0 }]}>
              <View style={[styles.paymentIcon, { backgroundColor: theme.primaryBg }]}>
                <MaterialIcons name="credit-card" size={22} color={theme.primary} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Carte bancaire</Text>
                <Text style={styles.paymentDetail}>Visa, Mastercard</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.supportCard}>
          <MaterialIcons name="support-agent" size={28} color={theme.primary} />
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Besoin d'aide ?</Text>
            <Text style={styles.supportText}>Notre équipe est disponible 24/7</Text>
          </View>
          <Pressable style={styles.supportBtn}>
            <Text style={styles.supportBtnText}>Contacter</Text>
          </Pressable>
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
  currentPlanCard: {
    margin: 16,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  planGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  planPrice: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  planStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  billingInfo: {
    gap: 8,
  },
  billingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
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
  usageCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  usageItem: {
    paddingVertical: 12,
  },
  usageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  usageValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  usageBarBg: {
    height: 8,
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  usageBar: {
    height: '100%',
    borderRadius: 4,
  },
  featuresCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.border,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: theme.success,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    ...shadows.sm,
  },
  toggleDotActive: {
    transform: [{ translateX: 22 }],
  },
  changePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    backgroundColor: theme.primaryBg,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },
  changePlanText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  planCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    position: 'relative',
    ...shadows.sm,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: theme.primary,
  },
  planCardCurrent: {
    borderWidth: 2,
    borderColor: theme.success,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  currentBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: theme.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  planCardHeader: {
    marginBottom: 16,
  },
  planCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  planCardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  planCardPeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.textSecondary,
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  planFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontSize: 13,
    color: theme.textPrimary,
  },
  planFeatureDisabled: {
    color: theme.textMuted,
    textDecorationLine: 'line-through',
  },
  selectPlanBtn: {
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  upgradePlanBtn: {
    backgroundColor: theme.primary,
  },
  selectPlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  upgradePlanText: {
    color: '#FFF',
  },
  historyCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 4,
    ...shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  historyInfo: {},
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  historyMethod: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  historyAmount: {
    alignItems: 'flex-end',
  },
  historyPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  historyStatusText: {
    fontSize: 11,
    color: theme.success,
    fontWeight: '500',
  },
  paymentCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  paymentDetail: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  supportInfo: {
    flex: 1,
    marginLeft: 14,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  supportText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  supportBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  supportBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
});
