// Family Tab - Real family management
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { useFamily } from '@/hooks/useFamily';
import { useAuth, useAlert } from '@/template';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

export default function FamilyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentFamily, familyMembers, leaveFamily } = useFamily();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const handleShareInvite = async () => {
    if (!currentFamily) return;

    try {
      await Share.share({
        message: `Join our family on FamilyCircle!\n\nFamily: ${currentFamily.name}\nInvite Code: ${currentFamily.invite_code}\n\nDownload FamilyCircle and use this code to join.`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLeaveFamily = () => {
    showAlert(
      'Leave Family',
      'Are you sure you want to leave this family? You can rejoin using the invite code.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const { error } = await leaveFamily();
            if (error) {
              showAlert('Error', error);
            }
          },
        },
      ]
    );
  };

  const onlineCount = familyMembers.filter(m => m.user?.username).length; // Simplified online count

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View>
          <Text style={styles.headerTitle}>Family</Text>
          <Text style={styles.headerSubtitle}>{currentFamily?.name}</Text>
        </View>
        <Pressable onPress={handleShareInvite} style={styles.inviteButton}>
          <MaterialIcons name="person-add" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inviteCard}>
          <Text style={styles.inviteTitle}>Invite Code</Text>
          <Text style={styles.inviteCode}>{currentFamily?.invite_code}</Text>
          <Text style={styles.inviteHint}>Share this code with family members</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{familyMembers.length}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{onlineCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Family Members</Text>
        {familyMembers.map((member) => {
          const isMe = member.user_id === user?.id;
          
          return (
            <View key={member.id} style={styles.memberCard}>
              <Avatar name={member.user?.username || 'Unknown'} size={56} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {member.user?.username || 'Unknown'}
                  {isMe && ' (You)'}
                </Text>
                <Text style={styles.memberEmail}>{member.user?.email}</Text>
                {member.relation && (
                  <Text style={styles.memberRelation}>{member.relation}</Text>
                )}
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{member.role}</Text>
              </View>
            </View>
          );
        })}

        <Pressable style={styles.leaveButton} onPress={handleLeaveFamily}>
          <MaterialIcons name="exit-to-app" size={20} color={colors.error} />
          <Text style={styles.leaveButtonText}>Leave Family</Text>
        </Pressable>
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
  inviteButton: {
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
  },
  inviteCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  inviteTitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inviteCode: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 4,
  },
  inviteHint: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memberName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  memberEmail: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  memberRelation: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary + '20',
  },
  roleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  leaveButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
});
