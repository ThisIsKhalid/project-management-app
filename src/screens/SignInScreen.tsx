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
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = signIn(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error || 'Something went wrong');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Branding */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: colors.accent.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: colors.accent.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="briefcase" size={36} color="#fff" />
            </View>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 30,
                fontWeight: '800',
                letterSpacing: -0.5,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                color: colors.text.muted,
                fontSize: 15,
                marginTop: 8,
              }}
            >
              Sign in to manage your projects
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View
              style={{
                backgroundColor: '#FF6B6B18',
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                borderWidth: 1,
                borderColor: '#FF6B6B30',
              }}
            >
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
              <Text style={{ color: colors.danger, fontSize: 14, flex: 1 }}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <View
              style={{
                backgroundColor: colors.dark[700],
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                borderWidth: 1,
                borderColor: colors.dark[500],
              }}
            >
              <Ionicons name="mail-outline" size={18} color={colors.text.muted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  color: colors.text.primary,
                  fontSize: 15,
                  paddingVertical: 14,
                  marginLeft: 10,
                }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <View
              style={{
                backgroundColor: colors.dark[700],
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                borderWidth: 1,
                borderColor: colors.dark[500],
              }}
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.text.muted} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.muted}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  color: colors.text.primary,
                  fontSize: 15,
                  paddingVertical: 14,
                  marginLeft: 10,
                }}
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
            style={({ pressed }) => ({
              backgroundColor: colors.accent.primary,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed || loading ? 0.8 : 1,
              shadowColor: colors.accent.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                Sign In
              </Text>
            )}
          </Pressable>

          {/* Sign Up Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              gap: 4,
            }}
          >
            <Text style={{ color: colors.text.muted, fontSize: 14 }}>
              Don't have an account?
            </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{
                  color: colors.accent.secondary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Test Credentials */}
          <View
            style={{
              backgroundColor: colors.dark[800],
              borderRadius: 14,
              padding: 16,
              marginTop: 32,
              borderWidth: 1,
              borderColor: colors.dark[600],
            }}
          >
            <Text
              style={{
                color: colors.text.muted,
                fontSize: 11,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              Test Accounts
            </Text>
            {[
              { label: 'Manager', email: 'manager@test.com' },
              { label: 'Dev 1', email: 'dev1@test.com' },
              { label: 'Dev 2', email: 'dev2@test.com' },
            ].map((account) => (
              <Pressable
                key={account.email}
                onPress={() => {
                  setEmail(account.email);
                  setPassword('password123');
                  setError('');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
                  {account.label}
                </Text>
                <Text style={{ color: colors.accent.secondary, fontSize: 12 }}>
                  {account.email}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
