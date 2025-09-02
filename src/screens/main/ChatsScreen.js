import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import Avatar from '../../components/Avatar';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';

const DUMMY_CHATS = [
  {
    id: '1',
    user: { name: '지은', age: 26 },
    lastMessage: '네! 주말에 시간 어떠세요? 😊',
    timestamp: '방금 전',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    user: { name: '민준', age: 28 },
    lastMessage: '운동 끝났어요! 오늘 진짜 힘들었네요',
    timestamp: '10분 전',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    user: { name: '서연', age: 25 },
    lastMessage: '사진 너무 예쁘게 나왔네요 👍',
    timestamp: '1시간 전',
    unread: 5,
    online: false,
  },
  {
    id: '4',
    user: { name: '현우', age: 30 },
    lastMessage: '다음에 같이 영화 보러 가요',
    timestamp: '3시간 전',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    user: { name: '수아', age: 24 },
    lastMessage: '안녕하세요! 잘 지내시죠?',
    timestamp: '어제',
    unread: 1,
    online: false,
  },
  {
    id: '6',
    user: { name: '준서', age: 27 },
    lastMessage: '프로젝트 잘 마무리 되셨나요?',
    timestamp: '2일 전',
    unread: 0,
    online: false,
  },
];

export default function ChatsScreen({ navigation }) {
  const [chats, setChats] = useState(DUMMY_CHATS);
  const [searchText, setSearchText] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChat = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatRoom', { 
        user: item.user,
        chatId: item.id 
      })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar
          name={item.user.name}
          size="medium"
          online={item.online}
        />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderLogo size="small" />
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="채팅 검색"
            placeholderTextColor={colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Tag label="전체" selected={true} size="medium" onPress={() => {}} />
        <Tag label="온라인" selected={false} size="medium" onPress={() => {}} />
        <Tag label="안읽음" selected={false} size="medium" onPress={() => {}} />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyText}>아직 채팅이 없습니다</Text>
            <Text style={styles.emptySubtext}>새로운 친구와 대화를 시작해보세요</Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  newChatButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
});
