import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<any, 'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signUp(name, email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error || 'Something went wrong');
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
          {/* Back btn */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the developer network</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Input Groups */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.text.muted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.text.muted}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            </View>

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
                  placeholder="Min. 6 characters"
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

            {/* Terms Info */}
            <Text style={styles.termsText}>
              By joining, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* Create Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={loading}
              style={({ pressed }) => [
                styles.signUpBtn,
                (pressed || loading) && styles.signUpBtnPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.signUpBtnText}>Register Now</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
              )}
            </Pressable>

            {/* Bottom Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already part of ProjectFlow?</Text>
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={styles.signInLink}>Log In</Text>
              </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[600],
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    marginTop: 6,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  termsText: {
    color: colors.text.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: colors.text.secondary,
    fontWeight: '700',
  },
  signUpBtn: {
    backgroundColor: colors.accent.primary,
    borderRadius: 18,
    paddingVertical: 18,
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
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  signUpBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  signUpBtnText: {
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
  signInLink: {
    color: colors.accent.secondary,
    fontSize: 14,
    fontWeight: '800',
  },
});
