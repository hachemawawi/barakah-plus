import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/auth';
import { createFoodItem } from '../../lib/db';
import { router } from 'expo-router';
import { Timestamp } from 'firebase/firestore';

export default function ShareScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [location, setLocation] = useState('');

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Sign In Required</Text>
          <Text style={styles.messageText}>
            Please sign in to share food items with your community.
          </Text>
          <Pressable
            style={styles.signInButton}
            onPress={() => router.push('/profile')}>
            <Text style={styles.signInButtonText}>Go to Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleShare = async () => {
    if (!title || !description || !expiryDate || !location) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert expiry date string to Timestamp
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        throw new Error('Invalid expiry date');
      }

      await createFoodItem({
        userId: user.uid,
        title,
        description,
        images: [], // TODO: Implement image upload
        expiryDate: Timestamp.fromDate(expiry),
        location: {
          address: location,
          coordinates: {
            // TODO: Implement proper geolocation
            latitude: 0,
            longitude: 0,
          },
        },
        status: 'available',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setExpiryDate('');
      setLocation('');

      // Navigate back to home
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Share Surplus Food</Text>
        <Text style={styles.subtitle}>
          Help reduce food waste by sharing your surplus food with others in your community
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.imageSection}>
          <Pressable style={styles.addImageButton}>
            <Ionicons name="camera" size={24} color="#22c55e" />
            <Text style={styles.addImageText}>Add Photos</Text>
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What food are you sharing?"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add details about the food (quantity, packaging, etc.)"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Best Before Date</Text>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Where can others collect the food?"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Pressable
            style={[styles.shareButton, loading && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.shareButtonText}>Share Food</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  imageSection: {
    marginBottom: 24,
  },
  addImageButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#22c55e',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  shareButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  shareButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});