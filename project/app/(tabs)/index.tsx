import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { getFoodItems, createTransaction } from '../../lib/db';
import type { FoodItem } from '../../types/database';
import { formatDistanceToNow } from 'date-fns';

export default function HomeScreen() {
  const { user } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservingItem, setReservingItem] = useState<string | null>(null);

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getFoodItems();
      setFoodItems(items);
    } catch (err) {
      setError('Failed to load food items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (itemId: string) => {
    if (!user) return;
    
    try {
      setReservingItem(itemId);
      await createTransaction({
        foodItemId: itemId,
        donorId: foodItems.find(item => item.id === itemId)?.userId || '',
        receiverId: user.uid,
        status: 'pending'
      });
      await loadFoodItems(); // Refresh the list
    } catch (err) {
      console.error(err);
    } finally {
      setReservingItem(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to FoodSaver</Text>
        <Text style={styles.subtitle}>Reduce waste, share more!</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadFoodItems}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.nearbySection}>
        <Text style={styles.sectionTitle}>Available Nearby</Text>
        {foodItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No food items available right now</Text>
            <Text style={styles.emptyStateSubtext}>Check back later or share some food yourself!</Text>
          </View>
        ) : (
          foodItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {item.images.length > 0 && (
                <Image
                  source={item.images[0]}
                  style={styles.itemImage}
                  contentFit="cover"
                />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemLocation}>
                    <Ionicons name="location" size={14} color="#64748b" /> {item.location.address}
                  </Text>
                  <Text style={styles.itemExpiry}>
                    <Ionicons name="time" size={14} color="#64748b" /> Expires {formatDistanceToNow(item.expiryDate.toDate(), { addSuffix: true })}
                  </Text>
                </View>
                {user ? (
                  <Pressable
                    style={[styles.reserveButton, reservingItem === item.id && styles.reserveButtonDisabled]}
                    onPress={() => handleReserve(item.id)}
                    disabled={reservingItem === item.id || item.userId === user.uid}
                  >
                    {reservingItem === item.id ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.reserveButtonText}>
                        {item.userId === user.uid ? 'Your Item' : 'Reserve'}
                      </Text>
                    )}
                  </Pressable>
                ) : (
                  <Link href="/profile" asChild>
                    <Pressable style={styles.signInButton}>
                      <Text style={styles.signInButtonText}>Sign in to Reserve</Text>
                    </Pressable>
                  </Link>

                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#dc2626',
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    marginLeft: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  nearbySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemInfo: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  itemLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  itemExpiry: {
    fontSize: 14,
    color: '#64748b',
  },
  reserveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  reserveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
});