import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout, favorites } = useApp();

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await logout();
            router.replace('/(tabs)');
          }
        },
      ]
    );
  };

  const handleContact = () => {
    Haptics.selectionAsync();
    Linking.openURL(`https://wa.me/${APP_CONFIG.whatsappNumber.replace('+', '')}`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Super Admin', color: theme.error, icon: 'admin-panel-settings' };
      case 'agency':
        return { label: 'Agence', color: theme.primary, icon: 'business' };
      case 'agent':
        return { label: 'Agent', color: theme.success, icon: 'badge' };
      default:
        return { label: 'Client', color: theme.success, icon: 'verified' };
    }
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  // Admin menu items
  const adminMenuItems = [
    {
      section: 'Administration',
      items: [
        { icon: 'dashboard', label: 'Dashboard Admin', onPress: () => router.push('/admin') },
        { icon: 'people', label: 'Gestion Utilisateurs', onPress: () => router.push('/admin/users') },
        { icon: 'business', label: 'Gestion Agences', onPress: () => router.push('/admin/agencies') },
        { icon: 'fact-check', label: 'Modération Annonces', badge: 12, onPress: () => router.push('/admin/properties') },
        { icon: 'flag', label: 'Signalements', badge: 5, onPress: () => router.push('/admin/reports') },
        { icon: 'analytics', label: 'Analytics', onPress: () => router.push('/admin/analytics') },
      ],
    },
  ];

  const menuItems = [
    {
      section: 'Compte',
      items: [
        { icon: 'person', label: 'Mon profil', onPress: () => {} },
        { icon: 'favorite', label: 'Mes favoris', badge: favorites.length, onPress: () => router.push('/(tabs)/favorites') },
        { icon: 'notifications', label: 'Notifications', onPress: () => {} },
        { icon: 'history', label: 'Historique', onPress: () => {} },
      ],
    },
    {
      section: 'Recherches',
      items: [
        { icon: 'bookmark', label: 'Recherches sauvegardées', onPress: () => {} },
        { icon: 'add-alert', label: 'Alertes prix', onPress: () => {} },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help', label: 'Centre d\'aide', onPress: () => {} },
        { icon: 'chat', label: 'Contacter le support', onPress: handleContact },
        { icon: 'star', label: 'Noter l\'application', onPress: () => {} },
      ],
    },
    {
      section: 'Légal',
      items: [
        { icon: 'description', label: 'Conditions d\'utilisation', onPress: () => {} },
        { icon: 'privacy-tip', label: 'Politique de confidentialité', onPress: () => {} },
      ],
    },
  ];

  if (!isAuthenticated) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        >
          <Animated.View entering={FadeIn.duration(500)} style={styles.guestCard}>
            <View style={styles.guestIconContainer}>
              <MaterialIcons name="person-outline" size={50} color={theme.primary} />
            </View>
            <Text style={styles.guestTitle}>Bienvenue sur ForUs</Text>
            <Text style={styles.guestText}>
              Connectez-vous pour accéder à toutes les fonctionnalités
            </Text>
            <Pressable 
              style={styles.loginButton}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/login');
              }}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </Pressable>
            <Pressable 
              style={styles.registerButton}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/login');
              }}
            >
              <Text style={styles.registerButtonText}>Créer un compte</Text>
            </Pressable>
          </Animated.View>

          {/* Menu Items for Guest */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Support</Text>
            {menuItems[2].items.map((item, idx) => (
              <Animated.View 
                key={item.label}
                entering={FadeInDown.delay(idx * 50).duration(300)}
              >
                <Pressable 
                  style={styles.menuItem}
                  onPress={() => {
                    Haptics.selectionAsync();
                    item.onPress();
                  }}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconBox}>
                      <MaterialIcons name={item.icon as any} size={20} color={theme.primary} />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                </Pressable>
              </Animated.View>
            ))}
          </View>

          <Text style={styles.versionText}>Version {APP_CONFIG.version}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <Pressable style={styles.settingsBtn}>
          <MaterialIcons name="settings" size={24} color={theme.textPrimary} />
        </Pressable>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.userCard}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.userAvatar}
            contentFit="cover"
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {roleBadge && (
              <View style={[styles.userBadge, { backgroundColor: `${roleBadge.color}15` }]}>
                <MaterialIcons name={roleBadge.icon as any} size={14} color={roleBadge.color} />
                <Text style={[styles.userBadgeText, { color: roleBadge.color }]}>{roleBadge.label}</Text>
              </View>
            )}
          </View>
          <Pressable style={styles.editBtn}>
            <MaterialIcons name="edit" size={18} color={theme.primary} />
          </Pressable>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Visites</Text>
          </View>
        </Animated.View>

        {/* Admin Menu - Only for admin users */}
        {user?.role === 'admin' && adminMenuItems.map((section, sectionIdx) => (
          <Animated.View 
            key={section.section}
            entering={FadeInDown.delay(150 + sectionIdx * 50).duration(400)}
            style={[styles.menuSection, styles.adminSection]}
          >
            <Text style={[styles.menuSectionTitle, styles.adminSectionTitle]}>{section.section}</Text>
            {section.items.map((item, idx) => (
              <Pressable 
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  Haptics.selectionAsync();
                  item.onPress();
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, styles.adminIconBox]}>
                    <MaterialIcons name={item.icon as any} size={20} color={theme.error} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View style={[styles.menuBadge, { backgroundColor: theme.error }]}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                </View>
              </Pressable>
            ))}
          </Animated.View>
        ))}

        {/* Menu Sections */}
        {menuItems.map((section, sectionIdx) => (
          <Animated.View 
            key={section.section}
            entering={FadeInDown.delay(200 + sectionIdx * 50).duration(400)}
            style={styles.menuSection}
          >
            <Text style={styles.menuSectionTitle}>{section.section}</Text>
            {section.items.map((item, idx) => (
              <Pressable 
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  Haptics.selectionAsync();
                  item.onPress();
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconBox}>
                    <MaterialIcons name={item.icon as any} size={20} color={theme.primary} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <MaterialIcons name="chevron-right" size={22} color={theme.textMuted} />
                </View>
              </Pressable>
            ))}
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.logoutSection}>
          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color={theme.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </Pressable>
        </Animated.View>

        <Text style={styles.versionText}>Version {APP_CONFIG.version}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestCard: {
    margin: 16,
    padding: 24,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  guestIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  guestText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    width: '100%',
    backgroundColor: theme.primaryBg,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 6,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: theme.surface,
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
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
    marginVertical: 4,
  },
  menuSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    color: theme.textPrimary,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.errorLight,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },
  logoutText: {
    color: theme.error,
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 8,
    marginBottom: 16,
  },
  adminSection: {
    borderWidth: 1,
    borderColor: theme.errorLight,
  },
  adminSectionTitle: {
    color: theme.error,
  },
  adminIconBox: {
    backgroundColor: theme.errorLight,
  },
});
