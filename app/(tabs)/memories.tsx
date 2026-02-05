// Memories Tab - Real photo gallery with upload
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFamily } from '@/hooks/useFamily';
import { useAuth } from '@/template';
import { mediaService, Media } from '@/services/mediaService';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');
const imageSize = (width - spacing.md * 4) / 3;

export default function MemoriesScreen() {
  const insets = useSafeAreaInsets();
  const { currentFamily } = useFamily();
  const { user } = useAuth();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    if (!currentFamily) return;

    try {
      setLoading(true);
      const data = await mediaService.getMedia(currentFamily.id);
      setMedia(data);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [currentFamily]);

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && currentFamily && user) {
      setUploading(true);
      try {
        await mediaService.uploadMedia(
          currentFamily.id,
          user.id,
          result.assets[0].uri,
          'photo'
        );
        await loadMedia();
      } catch (error) {
        console.error('Error uploading photo:', error);
        Alert.alert('Upload failed', 'Please try again');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLike = async (mediaId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await mediaService.unlikeMedia(mediaId, user.id);
      } else {
        await mediaService.likeMedia(mediaId, user.id);
      }
      await loadMedia();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View>
          <Text style={styles.headerTitle}>Memories</Text>
          <Text style={styles.headerSubtitle}>{currentFamily?.name}</Text>
        </View>
        <Pressable onPress={handleUpload} style={styles.uploadButton} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMedia} tintColor={colors.primary} />
        }
      >
        {loading && media.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : media.length > 0 ? (
          <View style={styles.grid}>
            {media.map((item) => {
              const isLiked = item.likes?.some(like => like.user_id === user?.id) || false;
              const likeCount = item.likes?.length || 0;

              return (
                <Pressable key={item.id} style={styles.gridItem}>
                  <Image
                    source={{ uri: item.url }}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.overlay}>
                    <Pressable
                      style={styles.likeButton}
                      onPress={() => handleLike(item.id, isLiked)}
                    >
                      <MaterialIcons
                        name={isLiked ? 'favorite' : 'favorite-border'}
                        size={20}
                        color={isLiked ? colors.error : colors.surface}
                      />
                      {likeCount > 0 && (
                        <Text style={styles.likeCount}>{likeCount}</Text>
                      )}
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="photo-library" size={64} color={colors.border} />
            <Text style={styles.emptyText}>No memories yet</Text>
            <Text style={styles.emptySubtext}>Start sharing family moments</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: spacing.sm,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  likeCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.sizes.base,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
