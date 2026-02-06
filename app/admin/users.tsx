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

const { width } = Dimensions.get('window');

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Thérèse Moukala',
    email: 'therese.moukala@gmail.com',
    phone: '+242 06 800 00 00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    role: 'client',
    status: 'active',
    joinDate: '2024-06-15',
    lastActive: '2026-02-06',
    properties: 0,
    favorites: 5,
  },
  {
    id: '2',
    name: 'Marc Ossete',
    email: 'marc.ossete@yahoo.fr',
    phone: '+242 06 700 00 00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    role: 'client',
    status: 'active',
    joinDate: '2024-08-20',
    lastActive: '2026-02-05',
    properties: 0,
    favorites: 3,
  },
  {
    id: '3',
    name: 'Marie Okemba',
    email: 'marie.okemba@immopremium.cg',
    phone: '+242 06 600 00 01',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop',
    role: 'agent',
    status: 'active',
    joinDate: '2023-06-01',
    lastActive: '2026-02-06',
    properties: 45,
    favorites: 0,
  },
  {
    id: '4',
    name: 'Jean-Paul Moukoko',
    email: 'jp.moukoko@congohabitat.cg',
    phone: '+242 06 600 00 02',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    role: 'agent',
    status: 'active',
    joinDate: '2023-09-15',
    lastActive: '2026-02-04',
    properties: 78,
    favorites: 0,
  },
  {
    id: '5',
    name: 'Julienne Nkounkou',
    email: 'julienne.n@hotmail.com',
    phone: '+242 05 500 00 00',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    role: 'client',
    status: 'suspended',
    joinDate: '2025-01-10',
    lastActive: '2026-01-15',
    properties: 0,
    favorites: 8,
  },
  {
    id: '6',
    name: 'Bernard Ikonga',
    email: 'bernard.i@gmail.com',
    phone: '+242 06 900 00 00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    role: 'client',
    status: 'active',
    joinDate: '2025-02-01',
    lastActive: '2026-02-06',
    properties: 0,
    favorites: 2,
  },
];

const roleFilters = [
  { id: 'all', label: 'Tous' },
  { id: 'client', label: 'Clients' },
  { id: 'agent', label: 'Agents' },
  { id: 'agency', label: 'Agences' },
];

const statusFilters = [
  { id: 'all', label: 'Tous' },
  { id: 'active', label: 'Actifs' },
  { id: 'suspended', label: 'Suspendus' },
  { id: 'pending', label: 'En attente' },
];

export default function UsersManagement() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId: string) => {
    Alert.alert(
      'Suspendre l\'utilisateur',
      'Êtes-vous sûr de vouloir suspendre cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Suspendre', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setUsers(prev => prev.map(u => 
              u.id === userId ? { ...u, status: 'suspended' } : u
            ));
          }
        },
      ]
    );
  };

  const handleActivateUser = (userId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' } : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Supprimer l\'utilisateur',
      'Cette action est irréversible. Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setUsers(prev => prev.filter(u => u.id !== userId));
          }
        },
      ]
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'agent':
        return { label: 'Agent', color: theme.info, bg: theme.infoLight };
      case 'agency':
        return { label: 'Agence', color: theme.success, bg: theme.successLight };
      case 'admin':
        return { label: 'Admin', color: theme.error, bg: theme.errorLight };
      default:
        return { label: 'Client', color: theme.primary, bg: theme.primaryBg };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Actif', color: theme.success, bg: theme.successLight };
      case 'suspended':
        return { label: 'Suspendu', color: theme.error, bg: theme.errorLight };
      case 'pending':
        return { label: 'En attente', color: theme.warning, bg: theme.warningLight };
      default:
        return { label: 'Inconnu', color: theme.textMuted, bg: theme.backgroundSecondary };
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Gestion Utilisateurs</Text>
        <Pressable style={styles.addBtn}>
          <MaterialIcons name="person-add" size={22} color={theme.primary} />
        </Pressable>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {users.filter(u => u.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.error }]}>
            {users.filter(u => u.status === 'suspended').length}
          </Text>
          <Text style={styles.statLabel}>Suspendus</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un utilisateur..."
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
          {roleFilters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterChip,
                selectedRole === filter.id && styles.filterChipActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedRole(filter.id);
              }}
            >
              <Text style={[
                styles.filterText,
                selectedRole === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.filterSeparator} />
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

      {/* Users List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsText}>
          {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
        </Text>

        {filteredUsers.map((user, index) => {
          const roleBadge = getRoleBadge(user.role);
          const statusBadge = getStatusBadge(user.status);
          
          return (
            <Animated.View
              key={user.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <View style={styles.userCard}>
                <View style={styles.userHeader}>
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.userAvatar}
                    contentFit="cover"
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.badges}>
                      <View style={[styles.badge, { backgroundColor: roleBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: roleBadge.color }]}>
                          {roleBadge.label}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.badgeText, { color: statusBadge.color }]}>
                          {statusBadge.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.userStats}>
                  <View style={styles.userStatItem}>
                    <MaterialIcons name="event" size={16} color={theme.textMuted} />
                    <Text style={styles.userStatText}>Inscrit le {user.joinDate}</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <MaterialIcons name="access-time" size={16} color={theme.textMuted} />
                    <Text style={styles.userStatText}>Actif le {user.lastActive}</Text>
                  </View>
                  {user.role === 'agent' && (
                    <View style={styles.userStatItem}>
                      <MaterialIcons name="home" size={16} color={theme.textMuted} />
                      <Text style={styles.userStatText}>{user.properties} propriétés</Text>
                    </View>
                  )}
                </View>

                <View style={styles.userActions}>
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => Haptics.selectionAsync()}
                  >
                    <MaterialIcons name="visibility" size={18} color={theme.info} />
                    <Text style={[styles.actionText, { color: theme.info }]}>Voir</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => Haptics.selectionAsync()}
                  >
                    <MaterialIcons name="email" size={18} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>Email</Text>
                  </Pressable>
                  
                  {user.status === 'active' ? (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleSuspendUser(user.id)}
                    >
                      <MaterialIcons name="block" size={18} color={theme.warning} />
                      <Text style={[styles.actionText, { color: theme.warning }]}>Suspendre</Text>
                    </Pressable>
                  ) : (
                    <Pressable 
                      style={styles.actionBtn}
                      onPress={() => handleActivateUser(user.id)}
                    >
                      <MaterialIcons name="check-circle" size={18} color={theme.success} />
                      <Text style={[styles.actionText, { color: theme.success }]}>Activer</Text>
                    </Pressable>
                  )}
                  
                  <Pressable 
                    style={styles.actionBtn}
                    onPress={() => handleDeleteUser(user.id)}
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
  userCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    ...shadows.sm,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
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
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    marginBottom: 14,
  },
  userStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userStatText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
