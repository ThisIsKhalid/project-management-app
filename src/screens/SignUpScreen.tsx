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
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: colors.success,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: colors.success,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="person-add" size={36} color="#fff" />
            </View>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 30,
                fontWeight: '800',
                letterSpacing: -0.5,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                color: colors.text.muted,
                fontSize: 15,
                marginTop: 8,
              }}
            >
              Sign up as a developer
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

          {/* Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
              Full Name
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
              <Ionicons name="person-outline" size={18} color={colors.text.muted} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.text.muted}
                autoCapitalize="words"
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

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
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
            <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
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
                placeholder="Min. 6 characters"
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

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: colors.success,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed || loading ? 0.8 : 1,
              shadowColor: colors.success,
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
                Create Developer Account
              </Text>
            )}
          </Pressable>

          {/* Sign In Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              gap: 4,
            }}
          >
            <Text style={{ color: colors.text.muted, fontSize: 14 }}>
              Already have an account?
            </Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text
                style={{
                  color: colors.accent.secondary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
