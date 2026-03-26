import React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  if (!user) return null;

  const isManager = user.role === 'manager';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark[900] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark[900]} />

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '800' }}>
          Profile
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: isManager ? colors.accent.primary : colors.success,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: isManager ? colors.accent.primary : colors.success,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 36, fontWeight: '700' }}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 22,
              fontWeight: '700',
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              color: colors.text.muted,
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {user.email}
          </Text>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: isManager ? '#6C5CE720' : '#00C9A720',
            }}
          >
            <Text
              style={{
                color: isManager ? colors.accent.primary : colors.success,
                fontSize: 13,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {user.role}
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View
          style={{
            backgroundColor: colors.dark[800],
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
          }}
        >
          {[
            { icon: 'person-outline' as const, label: 'Name', value: user.name },
            { icon: 'mail-outline' as const, label: 'Email', value: user.email },
            { icon: 'shield-outline' as const, label: 'Role', value: isManager ? 'Manager' : 'Developer' },
          ].map((item, index) => (
            <View
              key={item.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: index < 2 ? 1 : 0,
                borderBottomColor: colors.dark[600],
                gap: 12,
              }}
            >
              <Ionicons name={item.icon} size={20} color={colors.accent.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text.muted, fontSize: 11, fontWeight: '500' }}>
                  {item.label}
                </Text>
                <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '500', marginTop: 2 }}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={signOut}
          style={({ pressed }) => ({
            backgroundColor: '#FF6B6B15',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            borderWidth: 1,
            borderColor: '#FF6B6B30',
            opacity: pressed ? 0.8 : 1,
            marginTop: 12,
          })}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, fontSize: 15, fontWeight: '600' }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
