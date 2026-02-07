import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { formatPrice } from '../../constants/config';

// Mock leads data
const mockLeads = [
  {
    id: '1',
    name: 'Marc Ossete',
    email: 'marc.ossete@yahoo.fr',
    phone: '+242 06 700 00 00',
    property: 'Villa moderne avec piscine',
    propertyId: '1',
    propertyPrice: 250000000,
    message: 'Je suis intéressé par cette villa. Est-il possible de programmer une visite ce week-end ?',
    date: '2026-02-06',
    time: '14:30',
    status: 'new',
    source: 'app',
  },
  {
    id: '2',
    name: 'Julienne Nkounkou',
    email: 'julienne.n@hotmail.com',
    phone: '+242 05 500 00 00',
    property: 'Appartement F4 centre-ville',
    propertyId: '3',
    propertyPrice: 45000000,
    message: 'Bonjour, l\'appartement est-il encore disponible ? Je recherche un F4 pour ma famille.',
    date: '2026-02-05',
    time: '10:15',
    status: 'contacted',
    source: 'whatsapp',
  },
  {
    id: '3',
    name: 'Bernard Ikonga',
    email: 'bernard.i@gmail.com',
    phone: '+242 06 900 00 00',
    property: 'Terrain viabilisé 500m²',
    propertyId: '4',
    propertyPrice: 35000000,
    message: 'Je souhaite construire ma maison. Le terrain est-il vraiment viabilisé avec eau et électricité ?',
    date: '2026-02-04',
    time: '16:45',
    status: 'visited',
    source: 'app',
  },
  {
    id: '4',
    name: 'Thérèse Moukala',
    email: 'therese.moukala@gmail.com',
    phone: '+242 06 800 00 00',
    property: 'Duplex luxueux Pointe-Noire',
    propertyId: '2',
    propertyPrice: 180000000,
    message: 'Vue mer magnifique ! Je suis prête à faire une offre. Pouvons-nous discuter du prix ?',
    date: '2026-02-03',
    time: '09:00',
    status: 'negotiating',
    source: 'app',
  },
  {
    id: '5',
    name: 'Patrick Malanda',
    email: 'p.malanda@business.cg',
    phone: '+242 06 600 00 00',
    property: 'Bureau Tour Nabemba',
    propertyId: '6',
    propertyPrice: 85000000,
    message: 'Nous recherchons des bureaux pour notre entreprise. Quelle est la surface exacte ?',
    date: '2026-02-02',
    time: '11:30',
    status: 'converted',
    source: 'whatsapp',
  },
  {
    id: '6',
    name: 'Sylvie Loufoua',
    email: 'sylvie.l@email.com',
    phone: '+242 06 500 00 00',
    property: 'Studio meublé à louer',
    propertyId: '5',
    propertyPrice: 150000,
    message: 'Pour combien de temps minimum peut-on louer ? J\'ai besoin de 6 mois.',
    date: '2026-02-01',
    time: '15:20',
    status: 'lost',
    source: 'app',
  },
];

const statusFilters = [
  { id: 'all', label: 'Tous', count: mockLeads.length },
  { id: 'new', label: 'Nouveaux', count: mockLeads.filter(l => l.status === 'new').length },
  { id: 'contacted', label: 'Contactés', count: mockLeads.filter(l => l.status === 'contacted').length },
  { id: 'visited', label: 'Visités', count: mockLeads.filter(l => l.status === 'visited').length },
  { id: 'negotiating', label: 'En négo.', count: mockLeads.filter(l => l.status === 'negotiating').length },
  { id: 'converted', label: 'Convertis', count: mockLeads.filter(l => l.status === 'converted').length },
];

export default function AgencyLeads() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [leads, setLeads] = useState(mockLeads);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCall = (phone: string) => {
    Haptics.selectionAsync();
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    Haptics.selectionAsync();
    const message = encodeURIComponent(`Bonjour ${name}, je vous contacte suite à votre demande sur ForUs.`);
    Linking.openURL(`https://wa.me/${phone.replace(/\s/g, '').replace('+', '')}?text=${message}`);
  };

  const handleEmail = (email: string, property: string) => {
    Haptics.selectionAsync();
    const subject = encodeURIComponent(`Concernant: ${property}`);
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  const handleUpdateStatus = (leadId: string, newStatus: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLeads(prev => prev.map(l => 
      l.id === leadId ? { ...l, status: newStatus } : l
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'Nouveau', color: theme.success, bg: theme.successLight, icon: 'fiber-new' };
      case 'contacted':
        return { label: 'Contacté', color: theme.info, bg: theme.infoLight, icon: 'phone-callback' };
      case 'visited':
        return { label: 'Visité', color: theme.warning, bg: theme.warningLight, icon: 'home' };
      case 'negotiating':
        return { label: 'En négo.', color: theme.primary, bg: theme.primaryBg, icon: 'handshake' };
      case 'converted':
        return { label: 'Converti', color: '#9C27B0', bg: '#F3E5F5', icon: 'check-circle' };
      case 'lost':
        return { label: 'Perdu', color: theme.error, bg: theme.errorLight, icon: 'cancel' };
      default:
        return { label: 'Inconnu', color: theme.textMuted, bg: theme.backgroundSecondary, icon: 'help' };
    }
  };

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const conversionRate = Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mes Leads</Text>
        <Pressable style={styles.exportBtn}>
          <MaterialIcons name="file-download" size={22} color={theme.primary} />
        </Pressable>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{leads.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.success }]}>{newLeadsCount}</Text>
          <Text style={styles.statLabel}>Nouveaux</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#9C27B0' }]}>{conversionRate}%</Text>
          <Text style={styles.statLabel}>Conversion</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un lead..."
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
              {filter.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  selectedStatus === filter.id && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    selectedStatus === filter.id && styles.filterBadgeTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Leads List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
        </Text>

        {filteredLeads.map((lead, index) => {
          const statusBadge = getStatusBadge(lead.status);
          
          return (
            <Animated.View
              key={lead.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <View style={styles.leadCard}>
                {/* Lead Header */}
                <View style={styles.leadHeader}>
                  <View style={styles.leadAvatar}>
                    <Text style={styles.leadAvatarText}>{lead.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.leadInfo}>
                    <View style={styles.leadNameRow}>
                      <Text style={styles.leadName}>{lead.name}</Text>
                      {lead.source === 'whatsapp' && (
                        <MaterialIcons name="chat" size={14} color="#25D366" />
                      )}
                    </View>
                    <Text style={styles.leadContact}>{lead.phone}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                    <MaterialIcons name={statusBadge.icon as any} size={12} color={statusBadge.color} />
                    <Text style={[styles.statusText, { color: statusBadge.color }]}>
                      {statusBadge.label}
                    </Text>
                  </View>
                </View>

                {/* Property Info */}
                <Pressable 
                  style={styles.propertySection}
                  onPress={() => router.push(`/property/${lead.propertyId}`)}
                >
                  <MaterialIcons name="home" size={16} color={theme.primary} />
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName} numberOfLines={1}>{lead.property}</Text>
                    <Text style={styles.propertyPrice}>{formatPrice(lead.propertyPrice)}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
                </Pressable>

                {/* Message */}
                <View style={styles.messageSection}>
                  <Text style={styles.messageText} numberOfLines={2}>{lead.message}</Text>
                  <Text style={styles.messageDate}>{lead.date} à {lead.time}</Text>
                </View>

                {/* Actions */}
                <View style={styles.leadActions}>
                  <Pressable 
                    style={[styles.actionBtn, { backgroundColor: theme.primaryBg }]}
                    onPress={() => handleCall(lead.phone)}
                  >
                    <MaterialIcons name="phone" size={18} color={theme.primary} />
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionBtn, { backgroundColor: '#E8F5E9' }]}
                    onPress={() => handleWhatsApp(lead.phone, lead.name)}
                  >
                    <MaterialIcons name="chat" size={18} color="#25D366" />
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionBtn, { backgroundColor: theme.infoLight }]}
                    onPress={() => handleEmail(lead.email, lead.property)}
                  >
                    <MaterialIcons name="email" size={18} color={theme.info} />
                  </Pressable>

                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <Pressable 
                      style={[styles.statusUpdateBtn]}
                      onPress={() => {
                        const nextStatus = 
                          lead.status === 'new' ? 'contacted' :
                          lead.status === 'contacted' ? 'visited' :
                          lead.status === 'visited' ? 'negotiating' : 'converted';
                        handleUpdateStatus(lead.id, nextStatus);
                      }}
                    >
                      <MaterialIcons name="arrow-forward" size={16} color={theme.success} />
                      <Text style={styles.statusUpdateText}>Avancer</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Animated.View>
          );
        })}

        {filteredLeads.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={60} color={theme.textMuted} />
            <Text style={styles.emptyTitle}>Aucun lead</Text>
            <Text style={styles.emptyText}>Les demandes de clients apparaîtront ici</Text>
          </View>
        )}
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginTop: 16,
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
    color: theme.textPrimary,
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
    paddingHorizontal: 14,
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
    backgroundColor: theme.backgroundSecondary,
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
    color: theme.textSecondary,
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
  leadCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leadAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  leadInfo: {
    flex: 1,
  },
  leadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  leadContact: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  propertySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 12,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  propertyPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  messageSection: {
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  messageDate: {
    fontSize: 11,
    color: theme.textMuted,
  },
  leadActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusUpdateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: theme.successLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  statusUpdateText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.success,
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
  },
});
