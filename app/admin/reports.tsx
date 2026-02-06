import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
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

// Mock reports data
const mockReports = [
  {
    id: '1',
    type: 'property',
    reason: 'Contenu inapproprié',
    description: 'Les photos ne correspondent pas à la propriété réelle',
    targetId: 'prop-1',
    targetTitle: 'Villa moderne avec piscine à Mpila',
    targetImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    reporter: 'Marc Ossete',
    reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    date: '2026-02-06',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    type: 'property',
    reason: 'Prix incorrect',
    description: 'Le prix affiché est différent du prix réel demandé',
    targetId: 'prop-3',
    targetTitle: 'Appartement F4 centre-ville',
    targetImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    reporter: 'Julienne Nkounkou',
    reporterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    date: '2026-02-05',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'user',
    reason: 'Comportement suspect',
    description: 'Cet utilisateur envoie des messages de spam',
    targetId: 'user-5',
    targetTitle: 'Jean Malonga',
    targetImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    reporter: 'Thérèse Moukala',
    reporterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: '2026-02-04',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '4',
    type: 'property',
    reason: 'Annonce frauduleuse',
    description: 'Cette propriété n\'existe pas à cette adresse',
    targetId: 'prop-7',
    targetTitle: 'Maison coloniale rénovée',
    targetImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    reporter: 'Bernard Ikonga',
    reporterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    date: '2026-02-03',
    status: 'reviewed',
    priority: 'critical',
  },
  {
    id: '5',
    type: 'agent',
    reason: 'Agent non professionnel',
    description: 'L\'agent n\'a pas répondu à mes demandes depuis 2 semaines',
    targetId: 'agent-4',
    targetTitle: 'Patrick Mabiala',
    targetImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    reporter: 'Julienne Nkounkou',
    reporterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    date: '2026-02-02',
    status: 'resolved',
    priority: 'low',
  },
];

const statusFilters = [
  { id: 'all', label: 'Tous' },
  { id: 'pending', label: 'En attente' },
  { id: 'reviewed', label: 'En cours' },
  { id: 'resolved', label: 'Résolus' },
];

const typeFilters = [
  { id: 'all', label: 'Tous types' },
  { id: 'property', label: 'Annonces' },
  { id: 'user', label: 'Utilisateurs' },
  { id: 'agent', label: 'Agents' },
];

export default function ReportsManagement() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [reports, setReports] = useState(mockReports);

  const filteredReports = reports.filter(report => {
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesStatus && matchesType;
  });

  const handleResolve = (reportId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' } : r
    ));
  };

  const handleReview = (reportId: string) => {
    Haptics.selectionAsync();
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'reviewed' } : r
    ));
  };

  const handleTakeAction = (report: typeof mockReports[0]) => {
    Alert.alert(
      'Action sur le signalement',
      `Que voulez-vous faire concernant "${report.targetTitle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Avertir', 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            handleResolve(report.id);
          }
        },
        { 
          text: 'Suspendre', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleResolve(report.id);
          }
        },
      ]
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { label: 'Critique', color: '#9C27B0', bg: '#F3E5F5' };
      case 'high':
        return { label: 'Haute', color: theme.error, bg: theme.errorLight };
      case 'medium':
        return { label: 'Moyenne', color: theme.warning, bg: theme.warningLight };
      default:
        return { label: 'Basse', color: theme.info, bg: theme.infoLight };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: theme.warning, bg: theme.warningLight };
      case 'reviewed':
        return { label: 'En cours', color: theme.info, bg: theme.infoLight };
      case 'resolved':
        return { label: 'Résolu', color: theme.success, bg: theme.successLight };
      default:
        return { label: 'Inconnu', color: theme.textMuted, bg: theme.backgroundSecondary };
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const criticalCount = reports.filter(r => r.priority === 'critical' && r.status !== 'resolved').length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Signalements</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reports.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.warning }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#9C27B0' }]}>{criticalCount}</Text>
          <Text style={styles.statLabel}>Critiques</Text>
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
          {typeFilters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterChip,
                selectedType === filter.id && styles.filterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedType(filter.id);
              }}
            >
              <Text style={[
                styles.filterText,
                selectedType === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredReports.length} signalement{filteredReports.length !== 1 ? 's' : ''}
        </Text>

        {filteredReports.map((report, index) => {
          const priorityBadge = getPriorityBadge(report.priority);
          const statusBadge = getStatusBadge(report.status);
          
          return (
            <Animated.View
              key={report.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <View style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Image
                    source={{ uri: report.targetImage }}
                    style={styles.reportImage}
                    contentFit="cover"
                  />
                  <View style={styles.reportInfo}>
                    <View style={styles.reportBadges}>
                      <View style={[styles.badge, { backgroundColor: priorityBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: priorityBadge.color }]}>
                          {priorityBadge.label}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: statusBadge.color }]}>
                          {statusBadge.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reportTarget} numberOfLines={1}>{report.targetTitle}</Text>
                    <Text style={styles.reportReason}>{report.reason}</Text>
                  </View>
                </View>

                <View style={styles.reportDescription}>
                  <Text style={styles.descriptionText}>{report.description}</Text>
                </View>

                <View style={styles.reportMeta}>
                  <View style={styles.reporterInfo}>
                    <Image
                      source={{ uri: report.reporterAvatar }}
                      style={styles.reporterAvatar}
                      contentFit="cover"
                    />
                    <Text style={styles.reporterName}>Par {report.reporter}</Text>
                  </View>
                  <Text style={styles.reportDate}>{report.date}</Text>
                </View>

                {report.status !== 'resolved' && (
                  <View style={styles.reportActions}>
                    {report.status === 'pending' && (
                      <Pressable 
                        style={[styles.actionBtn, { backgroundColor: theme.infoLight }]}
                        onPress={() => handleReview(report.id)}
                      >
                        <MaterialIcons name="visibility" size={16} color={theme.info} />
                        <Text style={[styles.actionText, { color: theme.info }]}>Examiner</Text>
                      </Pressable>
                    )}
                    <Pressable 
                      style={[styles.actionBtn, { backgroundColor: theme.warningLight }]}
                      onPress={() => handleTakeAction(report)}
                    >
                      <MaterialIcons name="gavel" size={16} color={theme.warning} />
                      <Text style={[styles.actionText, { color: theme.warning }]}>Action</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.actionBtn, { backgroundColor: theme.successLight }]}
                      onPress={() => handleResolve(report.id)}
                    >
                      <MaterialIcons name="check-circle" size={16} color={theme.success} />
                      <Text style={[styles.actionText, { color: theme.success }]}>Résoudre</Text>
                    </Pressable>
                  </View>
                )}
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
  filtersSection: {
    paddingTop: 16,
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
  reportCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reportImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reportBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportTarget: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  reportReason: {
    fontSize: 13,
    color: theme.error,
    fontWeight: '500',
  },
  reportDescription: {
    backgroundColor: theme.backgroundSecondary,
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reporterAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  reporterName: {
    fontSize: 12,
    color: theme.textMuted,
  },
  reportDate: {
    fontSize: 12,
    color: theme.textMuted,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
