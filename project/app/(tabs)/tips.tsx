import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const TIPS = [
  {
    id: 1,
    title: 'Smart Storage Solutions',
    description: 'Learn how to store different types of food to maximize their shelf life.',
    image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&h=216&q=80',
    category: 'Storage',
  },
  {
    id: 2,
    title: 'Meal Planning Basics',
    description: 'Plan your meals effectively to reduce food waste and save money.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&h=216&q=80',
    category: 'Planning',
  },
  {
    id: 3,
    title: 'Understanding Date Labels',
    description: 'Know the difference between "best before" and "use by" dates.',
    image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&h=216&q=80',
    category: 'Education',
  },
];

export default function TipsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Management Tips</Text>
        <Text style={styles.subtitle}>
          Learn how to reduce food waste and make your food last longer
        </Text>
      </View>

      <View style={styles.content}>
        {TIPS.map((tip) => (
          <Pressable key={tip.id} style={styles.tipCard}>
            <Image source={tip.image} style={styles.tipImage} contentFit="cover" />
            <View style={styles.tipContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{tip.category}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Ionicons name="arrow-forward" size={16} color="#22c55e" />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipImage: {
    width: '100%',
    height: 200,
  },
  tipContent: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '500',
  },
});