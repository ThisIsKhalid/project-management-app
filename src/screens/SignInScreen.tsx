import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'SignIn'>;

export const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signIn(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoOuter}>
               <View style={styles.logoInner}>
                  <Ionicons name="flash" size={40} color="#fff" />
               </View>
            </View>
            <Text style={styles.appName}>ProjectFlow</Text>
            <Text style={styles.tagline}>Precision in every project</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.instructionText}>Log in to manage your pipeline</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning" size={18} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Input Groups */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.text.muted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@company.com"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.text.muted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.text.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Sign In Button */}
            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInBtn,
                (pressed || loading) && styles.signInBtnPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.signInBtnText}>Log In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              )}
            </Pressable>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>New to ProjectFlow?</Text>
              <Pressable onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLink}>Join now</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Test Accounts */}
          <View style={styles.testSection}>
            <Text style={styles.testTitle}>DEMO ACCESS</Text>
            <View style={styles.testGrid}>
               {[
                 { label: 'Manager', email: 'manager@test.com' },
                 { label: 'Dev 1', email: 'dev1@test.com' },
                 { label: 'Dev 2', email: 'dev2@test.com' },
               ].map((acc) => (
                 <Pressable 
                   key={acc.email}
                   onPress={() => {
                     setEmail(acc.email);
                     setPassword('password123');
                     setError('');
                   }}
                   style={styles.testBtn}
                 >
                    <Text style={styles.testBtnLabel}>{acc.label}</Text>
                 </Pressable>
               ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
    marginBottom: 20,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  formSection: {
    width: '100%',
  },
  welcomeText: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  instructionText: {
    color: colors.text.secondary,
    fontSize: 15,
    marginBottom: 32,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.danger + '15',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[800],
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: 16,
    marginLeft: 12,
  },
  signInBtn: {
    backgroundColor: colors.accent.primary,
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 12,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 12,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  signInBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  signUpLink: {
    color: colors.accent.secondary,
    fontSize: 14,
    fontWeight: '800',
  },
  testSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  testTitle: {
    color: colors.text.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  testGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  testBtn: {
    backgroundColor: colors.dark[800],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  testBtnLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
