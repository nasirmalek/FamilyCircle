// New Chat Screen - Create direct or group chat
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth, useAlert } from '@/template';
import { useFamily } from '@/hooks/useFamily';
import { chatService } from '@/services/chatService';
import { Button, Input, Avatar } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function NewChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { currentFamily, familyMembers } = useFamily();
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableMembers = familyMembers.filter(m => m.user_id !== user?.id);

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateChat = async () => {
    if (!currentFamily || !user) return;

    if (selectedMembers.length === 0) {
      showAlert('Please select at least one member');
      return;
    }

    if (chatType === 'group' && !groupName.trim()) {
      showAlert('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const participantIds = [user.id, ...selectedMembers];
      let chat;

      if (chatType === 'direct') {
        chat = await chatService.createDirectChat(currentFamily.id, participantIds);
      } else {
        chat = await chatService.createGroupChat(currentFamily.id, groupName.trim(), participantIds);
      }

      router.replace(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      showAlert('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>New Chat</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.typeSelector}>
          <Pressable
            style={[styles.typeButton, chatType === 'direct' && styles.activeType]}
            onPress={() => setChatType('direct')}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={chatType === 'direct' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.typeText, chatType === 'direct' && styles.activeTypeText]}>
              Direct
            </Text>
          </Pressable>
          <Pressable
            style={[styles.typeButton, chatType === 'group' && styles.activeType]}
            onPress={() => setChatType('group')}
          >
            <MaterialIcons
              name="group"
              size={24}
              color={chatType === 'group' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.typeText, chatType === 'group' && styles.activeTypeText]}>
              Group
            </Text>
          </Pressable>
        </View>

        {chatType === 'group' && (
          <Input
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
            style={styles.groupNameInput}
          />
        )}

        <Text style={styles.sectionTitle}>Select Members</Text>
        {availableMembers.map(member => (
          <Pressable
            key={member.id}
            style={[styles.memberItem, selectedMembers.includes(member.user_id) && styles.selectedMember]}
            onPress={() => toggleMember(member.user_id)}
          >
            <Avatar name={member.user?.username || 'Unknown'} size={48} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.user?.username || 'Unknown'}</Text>
              {member.relation && (
                <Text style={styles.memberRelation}>{member.relation}</Text>
              )}
            </View>
            <View style={[styles.checkbox, selectedMembers.includes(member.user_id) && styles.checkboxSelected]}>
              {selectedMembers.includes(member.user_id) && (
                <MaterialIcons name="check" size={20} color={colors.surface} />
              )}
            </View>
          </Pressable>
        ))}

        {availableMembers.length === 0 && (
          <Text style={styles.noMembers}>No other family members available</Text>
        )}

        <Button
          title={loading ? 'Creating...' : 'Create Chat'}
          onPress={handleCreateChat}
          disabled={loading || selectedMembers.length === 0}
          style={styles.createButton}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  content: {
    padding: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeType: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  typeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  activeTypeText: {
    color: colors.primary,
  },
  groupNameInput: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  selectedMember: {
    backgroundColor: colors.primary + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memberName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  memberRelation: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  noMembers: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  createButton: {
    marginTop: spacing.lg,
  },
});
