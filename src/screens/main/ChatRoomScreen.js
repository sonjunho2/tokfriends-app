import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import colors from '../../theme/colors';

const INITIAL_MESSAGES = [
  {
    id: '1',
    text: '안녕하세요! 만나서 반가워요 😊',
    sender: 'other',
    timestamp: '오후 2:30',
  },
  {
    id: '2',
    text: '안녕하세요! 저도 반가워요~',
    sender: 'me',
    timestamp: '오후 2:31',
  },
  {
    id: '3',
    text: '프로필 보고 대화 신청했어요. 취미가 비슷한 것 같아서요!',
    sender: 'other',
    timestamp: '오후 2:32',
  },
  {
    id: '4',
    text: '어떤 취미 좋아하세요?',
    sender: 'other',
    timestamp: '오후 2:32',
  },
  {
    id: '5',
    text: '저는 주로 카페 가는 걸 좋아하고, 주말엔 영화 보러 가기도 해요!',
    sender: 'me',
    timestamp: '오후 2:33',
  },
  {
    id: '6',
    text: '오 저도 카페 투어 좋아해요! 최근에 가본 곳 중에 추천할 만한 곳 있으세요?',
    sender: 'other',
    timestamp: '오후 2:34',
  },
];

export default function ChatRoomScreen({ route, navigation }) {
  const { user: paramUser, title: paramTitle } = route.params || {};
  const user = paramUser || { name: paramTitle || '친구' };
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const openReport = () => {
    setOptionsVisible(false);
    setReportVisible(true);
  };

  const submitReport = () => {
    if (!reportText.trim()) {
      Alert.alert('알림', '신고 내용을 입력해 주세요.');
      return;
    }

    const submittedText = reportText.trim();
    setReportVisible(false);
    setReportText('');
    Alert.alert('신고 완료', `신고가 접수되었습니다.\n\n내용: ${submittedText}`);
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {!isMe && (
          <Avatar
            name={user.name}
            size={40}
            shape="rounded"
            style={styles.messageAvatar}
          />
        )}
        <View style={styles.messageContent}>
          <View style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
          </View>
          <Text style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
            
        <View style={styles.headerCenter}>
          <Avatar
            name={user.name}
            size={44}
            shape="rounded"
            showBorder
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{user.name}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>온라인</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setOptionsVisible(true)}
          hitSlop={8}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom + 8 },
          ]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color={colors.textTertiary} />
          </TouchableOpacity>
            
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="메시지 입력..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={24} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? colors.primary : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
              
      <Modal
        transparent
        visible={optionsVisible}
        animationType="fade"
        onRequestClose={() => setOptionsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOptionsVisible(false)}>
          <View style={styles.optionsBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.optionCard}>
                <TouchableOpacity style={styles.optionItem} onPress={openReport}>
                  <Ionicons name="flag-outline" size={18} color={colors.primary} />
                  <Text style={styles.optionText}>신고하기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent
        visible={reportVisible}
        animationType="fade"
        onRequestClose={() => setReportVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setReportVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.reportCard}>
                <Text style={styles.reportTitle}>신고하기</Text>
                <Text style={styles.reportDescription}>
                  문제가 되는 내용을 자세히 작성해 주세요. 확인 후 신속히 조치하겠습니다.
                </Text>
                <TextInput
                  style={styles.reportInput}
                  multiline
                  placeholder="신고 내용을 입력하세요"
                  placeholderTextColor={colors.textTertiary}
                  value={reportText}
                  onChangeText={setReportText}
                  maxLength={500}
                />
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => setReportVisible(false)}
                  >
                    <Text style={styles.secondaryBtnTxt}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryBtn, reportText.trim() === '' && styles.primaryBtnDisabled]}
                    onPress={submitReport}
                    disabled={reportText.trim() === ''}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnTxt}>신고 보내기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
    headerAvatar: {
    marginRight: 12,
  },
  headerInfo: {
    marginLeft: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
        alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
        alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
        alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    marginTop: 4,
  },
  messageContent: {
    maxWidth: '75%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: 4,
        borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: colors.textInverse,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  myMessageTime: {
    color: colors.textTertiary,
    textAlign: 'right',
  },
  otherMessageTime: {
    color: colors.textTertiary,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachButton: {
    padding: 4,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 140,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 120,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 4,
  },
  sendButton: {
    padding: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
    optionsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: 72,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  optionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 140,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  reportCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: '100%',
    maxWidth: 420,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  reportDescription: {
    marginTop: 8,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reportInput: {
    marginTop: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    color: colors.text,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  secondaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
  },
  secondaryBtnTxt: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  primaryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnTxt: {
    color: colors.textInverse,
    fontWeight: '800',
  },
});
