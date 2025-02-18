import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/auth';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  stats: {
    shared: number;
    received: number;
    impact: number;
  };
}

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80';

const ACTIVITY = [
  { id: '1', type: 'shared', item: 'Apples', date: '2023-10-01' },
  { id: '2', type: 'received', item: 'Bananas', date: '2023-10-02' },
  { id: '3', type: 'shared', item: 'Carrots', date: '2023-10-03' },
];

export default function ProfileScreen() {
  const { user } = useAuth();
  const { signIn, loading } = useGoogleAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Welcome to FoodSaver</Text>
          <Text style={styles.loginSubtitle}>Sign in to start sharing food and making an impact</Text>
          <Pressable 
            style={styles.googleButton}
            onPress={() => signIn()}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color="#000000" />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  console.log('User Photo URL:', user.photoURL);
  console.log('Default Image URL:', DEFAULT_IMAGE_URL);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: user.photoURL || DEFAULT_IMAGE_URL }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats?.shared ?? 0}</Text>
          <Text style={styles.statLabel}>Items Shared</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats?.received ?? 0}</Text>
          <Text style={styles.statLabel}>Items Received</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats?.impact ?? 0}</Text>
          <Text style={styles.statLabel}>Food Saved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {ACTIVITY.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={activity.type === 'shared' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={24}
                color={activity.type === 'shared' ? '#22c55e' : '#3b82f6'}
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {activity.type === 'shared' ? 'Shared' : 'Received'} {activity.item}
              </Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Pressable style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>
        <Pressable style={styles.settingItem}>
          <Ionicons name="location-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>Location Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>
        <Pressable style={styles.settingItem}>
          <Ionicons name="shield-outline" size={24} color="#64748b" />
          <Text style={styles.settingText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={24} color="#64748b" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#64748b',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 16,
  },
});