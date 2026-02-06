import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, borderRadius, shadows } from '../constants/theme';
import { useApp } from '../contexts/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await login(email, password);
    
    setIsLoading(false);
    
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Erreur de connexion',
        'Email ou mot de passe incorrect.\n\nComptes de test:\n• therese.moukala@gmail.com / client123\n• admin@forus.cg / admin123'
      );
    }
  };

  const demoAccounts = [
    { label: 'Client', email: 'therese.moukala@gmail.com', password: 'client123' },
    { label: 'Admin', email: 'admin@forus.cg', password: 'admin123' },
    { label: 'Agence', email: 'agence@immopremium.cg', password: 'premium123' },
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    Haptics.selectionAsync();
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="close" size={24} color={theme.textPrimary} />
          </Pressable>

          {/* Logo */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.logoText}>ForUs</Text>
            <Text style={styles.tagline}>L'immobilier au Congo simplifié</Text>
          </Animated.View>

          {/* Tabs */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)} 
            style={styles.tabs}
          >
            <Pressable
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                Connexion
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                Inscription
              </Text>
            </Pressable>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={22} color={theme.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    placeholderTextColor={theme.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <MaterialIcons name="phone" size={22} color={theme.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Téléphone"
                    placeholderTextColor={theme.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={22} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={22} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={22} 
                  color={theme.textMuted} 
                />
              </Pressable>
            </View>

            {isLogin && (
              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </Pressable>
            )}

            <Pressable 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={theme.gradients.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isLoading ? (
                  <Text style={styles.submitText}>Chargement...</Text>
                ) : (
                  <Text style={styles.submitText}>
                    {isLogin ? 'Se connecter' : 'Créer un compte'}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Demo Accounts */}
          {isLogin && (
            <Animated.View 
              entering={FadeInDown.delay(300).duration(400)}
              style={styles.demoSection}
            >
              <Text style={styles.demoTitle}>Comptes de démonstration</Text>
              <View style={styles.demoAccounts}>
                {demoAccounts.map((account) => (
                  <Pressable
                    key={account.label}
                    style={styles.demoAccount}
                    onPress={() => fillDemoAccount(account)}
                  >
                    <MaterialIcons name="person-outline" size={18} color={theme.primary} />
                    <Text style={styles.demoAccountText}>{account.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Social Login */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.socialSection}
          >
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continuer avec</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <Pressable style={styles.socialButton}>
                <MaterialIcons name="g-translate" size={24} color="#DB4437" />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <MaterialIcons name="facebook" size={24} color="#1877F2" />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <MaterialIcons name="apple" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Terms */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.terms}
          >
            <Text style={styles.termsText}>
              En continuant, vous acceptez nos{' '}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text>
              {' '}et notre{' '}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    ...shadows.sm,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.primary,
  },
  tagline: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.surface,
    ...shadows.sm,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textMuted,
  },
  tabTextActive: {
    color: theme.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 12,
    fontSize: 15,
    color: theme.textPrimary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoSection: {
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  demoAccounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  demoAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.primaryBg,
    borderRadius: borderRadius.full,
  },
  demoAccountText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  socialSection: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    fontSize: 13,
    color: theme.textMuted,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  terms: {
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: theme.primary,
    fontWeight: '500',
  },
});
