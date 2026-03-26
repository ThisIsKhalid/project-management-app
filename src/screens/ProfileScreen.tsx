import React from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuthStore();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>ACCOUNT</Text>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
             <Text style={styles.avatarTextLarge}>{user.name.charAt(0)}</Text>
             <View style={styles.roleBadge}>
                <Ionicons 
                  name={user.role === 'manager' ? 'shield-checkmark' : 'code-working'} 
                  size={14} 
                  color="#fff" 
                />
             </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={[styles.roleLabel, { backgroundColor: user.role === 'manager' ? colors.accent.soft : colors.info + '15' }]}>
             <Text style={[styles.roleLabelText, { color: user.role === 'manager' ? colors.accent.primary : colors.info }]}>
               {user.role === 'manager' ? 'System Manager' : 'Developer'}
             </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="settings-outline" size={16} color={colors.text.muted} />
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
          </View>
          
          <View style={styles.settingsGroup}>
             {[
               { icon: 'notifications-outline', label: 'Push Notifications', value: 'Enabled' },
               { icon: 'moon-outline', label: 'Appearance', value: 'Dark Flow' },
               { icon: 'shield-outline', label: 'Privacy & Security', value: '' },
               { icon: 'help-circle-outline', label: 'Support Center', value: '' },
             ].map((item, idx) => (
               <Pressable key={idx} style={styles.settingsItem}>
                  <View style={styles.settingsIconBg}>
                    <Ionicons name={item.icon as any} size={18} color={colors.text.secondary} />
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {item.value ? <Text style={styles.settingsValue}>{item.value}</Text> : null}
                    <Ionicons name="chevron-forward" size={16} color={colors.dark[500]} />
                  </View>
               </Pressable>
             ))}
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutWrapper}>
           <Pressable
            onPress={signOut}
            style={({ pressed }) => [
              styles.signOutBtn,
              pressed && styles.signOutBtnPressed,
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.signOutBtnText}>Log Out from ProjectFlow</Text>
          </Pressable>
          <Text style={styles.versionText}>ProjectFlow v1.0.4 • Made with Passion</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerSubtitle: {
    color: colors.accent.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.dark[800],
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.dark[600],
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: colors.dark[700],
  },
  avatarTextLarge: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.accent.secondary,
    borderWidth: 3,
    borderColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    color: colors.text.secondary,
    fontSize: 15,
    marginBottom: 16,
  },
  roleLabel: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleLabelText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  settingsGroup: {
    backgroundColor: colors.dark[800],
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[600],
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[700],
  },
  settingsIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  settingsValue: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  logoutWrapper: {
    alignItems: 'center',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.danger + '10',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.danger + '20',
    marginBottom: 20,
  },
  signOutBtnPressed: {
    backgroundColor: colors.danger + '20',
  },
  signOutBtnText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '500',
  },
});
