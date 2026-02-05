// Mock Data Service - Simulates backend responses
import { User, Chat, Message, Event, Trip, MediaItem, Notification } from '@/types';

// Current user (logged in)
export const currentUser: User = {
  id: 'user-1',
  name: 'You',
  email: 'you@family.com',
  phone: '+1234567890',
  avatar: 'https://i.pravatar.cc/150?img=1',
  role: 'admin',
  relation: 'Self',
  joinedAt: '2024-01-01T00:00:00Z',
  isOnline: true,
};

// Family Members
export const familyMembers: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Mom',
    phone: '+1234567891',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'organizer',
    relation: 'Mother',
    dateOfBirth: '1965-05-15',
    joinedAt: '2024-01-01T00:00:00Z',
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'user-3',
    name: 'Dad',
    phone: '+1234567892',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'organizer',
    relation: 'Father',
    dateOfBirth: '1963-08-22',
    joinedAt: '2024-01-01T00:00:00Z',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'user-4',
    name: 'Sarah',
    phone: '+1234567893',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'member',
    relation: 'Sister',
    dateOfBirth: '1998-03-10',
    joinedAt: '2024-01-01T00:00:00Z',
    isOnline: true,
  },
  {
    id: 'user-5',
    name: 'John',
    phone: '+1234567894',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: 'member',
    relation: 'Brother',
    dateOfBirth: '2002-11-28',
    joinedAt: '2024-01-01T00:00:00Z',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'user-6',
    name: 'Grandma',
    phone: '+1234567895',
    avatar: 'https://i.pravatar.cc/150?img=44',
    role: 'member',
    relation: 'Grandmother',
    dateOfBirth: '1945-12-05',
    joinedAt: '2024-01-02T00:00:00Z',
    isOnline: false,
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'user-7',
    name: 'Uncle Mike',
    phone: '+1234567896',
    avatar: 'https://i.pravatar.cc/150?img=15',
    role: 'member',
    relation: 'Uncle',
    joinedAt: '2024-01-05T00:00:00Z',
    isOnline: true,
  },
  {
    id: 'user-8',
    name: 'Aunt Lisa',
    phone: '+1234567897',
    avatar: 'https://i.pravatar.cc/150?img=48',
    role: 'member',
    relation: 'Aunt',
    joinedAt: '2024-01-05T00:00:00Z',
    isOnline: false,
    lastSeen: new Date(Date.now() - 14400000).toISOString(),
  },
];

// Mock Chats
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'group',
    name: 'Family Group',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=family',
    participants: familyMembers.map(m => m.id),
    participantNames: familyMembers.map(m => m.name),
    lastMessage: {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'user-2',
      senderName: 'Mom',
      senderAvatar: familyMembers[1].avatar,
      content: 'Looking forward to Sunday dinner everyone! 🍽️',
      type: 'text',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      isRead: false,
    },
    unreadCount: 3,
    isPinned: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'chat-2',
    type: 'direct',
    participants: ['user-1', 'user-2'],
    participantNames: ['You', 'Mom'],
    avatar: familyMembers[1].avatar,
    lastMessage: {
      id: 'msg-2',
      chatId: 'chat-2',
      senderId: 'user-2',
      senderName: 'Mom',
      content: 'Can you pick up milk on your way home?',
      type: 'text',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
    },
    unreadCount: 1,
    isPinned: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Summer Trip Planning',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=trip',
    participants: ['user-1', 'user-3', 'user-4', 'user-5'],
    participantNames: ['You', 'Dad', 'Sarah', 'John'],
    lastMessage: {
      id: 'msg-3',
      chatId: 'chat-3',
      senderId: 'user-4',
      senderName: 'Sarah',
      content: 'I found a great resort! Sharing photos...',
      type: 'text',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    isPinned: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'chat-4',
    type: 'direct',
    participants: ['user-1', 'user-4'],
    participantNames: ['You', 'Sarah'],
    avatar: familyMembers[3].avatar,
    lastMessage: {
      id: 'msg-4',
      chatId: 'chat-4',
      senderId: 'user-1',
      senderName: 'You',
      content: 'Thanks for the birthday gift! 🎁',
      type: 'text',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    unreadCount: 0,
    isPinned: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Sunday Family Dinner',
    description: 'Monthly family dinner at home',
    type: 'dinner',
    date: new Date(Date.now() + 172800000).toISOString(),
    time: '18:00',
    location: 'Home',
    createdBy: 'user-2',
    attendees: [
      { userId: 'user-1', userName: 'You', status: 'going' },
      { userId: 'user-2', userName: 'Mom', status: 'going' },
      { userId: 'user-3', userName: 'Dad', status: 'going' },
      { userId: 'user-4', userName: 'Sarah', status: 'maybe' },
      { userId: 'user-5', userName: 'John', status: 'going' },
      { userId: 'user-6', userName: 'Grandma', status: 'pending' },
    ],
    reminderSet: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'event-2',
    title: "Grandma's Birthday",
    description: 'Celebrating Grandma turning 79! 🎂',
    type: 'birthday',
    date: new Date(Date.now() + 1209600000).toISOString(),
    time: '15:00',
    location: 'Garden Restaurant',
    createdBy: 'user-2',
    attendees: familyMembers.slice(0, 6).map(m => ({
      userId: m.id,
      userName: m.name,
      status: 'going' as const,
    })),
    reminderSet: true,
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'event-3',
    title: 'Family Reunion',
    description: 'Annual family get-together',
    type: 'reunion',
    date: new Date(Date.now() + 5184000000).toISOString(),
    time: '12:00',
    location: 'City Park',
    createdBy: 'user-3',
    attendees: familyMembers.map(m => ({
      userId: m.id,
      userName: m.name,
      status: 'pending' as const,
    })),
    reminderSet: false,
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
  },
];

// Mock Trips
export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Summer Beach Vacation',
    destination: 'Hawaii',
    startDate: new Date(Date.now() + 7776000000).toISOString(),
    endDate: new Date(Date.now() + 8380800000).toISOString(),
    description: 'Week-long family beach vacation',
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    createdBy: 'user-3',
    participants: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    budget: 5000,
    status: 'planning',
    chatId: 'chat-3',
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
  },
  {
    id: 'trip-2',
    title: 'Weekend Ski Trip',
    destination: 'Aspen, Colorado',
    startDate: new Date(Date.now() + 2592000000).toISOString(),
    endDate: new Date(Date.now() + 2851200000).toISOString(),
    description: 'Winter skiing adventure',
    coverImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    createdBy: 'user-1',
    participants: ['user-1', 'user-4', 'user-5'],
    budget: 1500,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
  },
];

// Mock Media Gallery
export const mockMediaItems: MediaItem[] = [
  {
    id: 'media-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
    caption: 'Family dinner last weekend',
    uploadedBy: 'user-2',
    uploadedByName: 'Mom',
    uploadedAt: new Date(Date.now() - 604800000).toISOString(),
    likes: ['user-1', 'user-3', 'user-4', 'user-5'],
    comments: [
      {
        id: 'comment-1',
        userId: 'user-4',
        userName: 'Sarah',
        content: 'Best dinner ever! ❤️',
        timestamp: new Date(Date.now() - 600000000).toISOString(),
      },
    ],
  },
  {
    id: 'media-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800',
    caption: 'Birthday celebration 🎂',
    uploadedBy: 'user-1',
    uploadedByName: 'You',
    uploadedAt: new Date(Date.now() - 1209600000).toISOString(),
    likes: ['user-2', 'user-3', 'user-6'],
    comments: [],
  },
  {
    id: 'media-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=800',
    caption: 'Kids at the park',
    uploadedBy: 'user-3',
    uploadedByName: 'Dad',
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    likes: ['user-1', 'user-2'],
    comments: [],
  },
  {
    id: 'media-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800',
    caption: 'Sunset walk',
    uploadedBy: 'user-4',
    uploadedByName: 'Sarah',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    likes: ['user-1', 'user-2', 'user-3', 'user-5', 'user-6'],
    comments: [
      {
        id: 'comment-2',
        userId: 'user-6',
        userName: 'Grandma',
        content: 'Beautiful! 🌅',
        timestamp: new Date(Date.now() - 82800000).toISOString(),
      },
    ],
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New Message',
    body: 'Mom sent you a message',
    userId: 'user-1',
    isRead: false,
    data: { chatId: 'chat-2' },
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'event',
    title: 'Upcoming Event',
    body: 'Sunday Family Dinner is in 2 days',
    userId: 'user-1',
    isRead: false,
    data: { eventId: 'event-1' },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'birthday',
    title: 'Birthday Reminder',
    body: "Grandma's birthday is coming up in 2 weeks",
    userId: 'user-1',
    isRead: true,
    data: { eventId: 'event-2' },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper Functions
export const getUserById = (id: string): User | undefined => {
  return familyMembers.find(m => m.id === id);
};

export const getChatById = (id: string): Chat | undefined => {
  return mockChats.find(c => c.id === id);
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(e => e.id === id);
};

export const getTripById = (id: string): Trip | undefined => {
  return mockTrips.find(t => t.id === id);
};
