import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Avatar from '../../components/Avatar';
import colors from '../../theme/colors';
import { listGiftOptions } from '../../api/gifts';

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
  const [headerHeight, setHeaderHeight] = useState(0);
  const [composerHeight, setComposerHeight] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const [attachSheetVisible, setAttachSheetVisible] = useState(false);
  const [cameraModeVisible, setCameraModeVisible] = useState(false);
  const [giftSheetVisible, setGiftSheetVisible] = useState(false);
  const [giftOptions, setGiftOptions] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [giftError, setGiftError] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

    useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

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

  const formatPoints = useCallback((amount) => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return '0';
    try {
      if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function') {
        return new Intl.NumberFormat('ko-KR').format(numeric);
      }
    } catch (error) {
      console.warn('Intl format failed:', error);
    }
    return Math.round(numeric)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  const appendMessage = useCallback((message = {}) => {
    const { sender = 'me', timestamp, ...rest } = message;
    const resolvedTimestamp =
      timestamp ??
      new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        sender,
        timestamp: resolvedTimestamp,
        ...rest,
      },
    ]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
      }, []);

  const appendMediaMessage = useCallback(
    (asset) => {
      if (!asset?.uri) return;
      const assetType = (asset?.type || '').toLowerCase();
      const mediaType = assetType.includes('video') ? 'video' : 'image';
      appendMessage({
        type: 'media',
        mediaType,
        media: {
          uri: asset.uri,
          width: asset?.width ?? null,
          height: asset?.height ?? null,
          duration: asset?.duration ?? null,
        },
      });
    },
    [appendMessage]
  );

  const ensureCameraPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근을 허용해 주세요. 설정에서 권한을 변경할 수 있습니다.');
      return false;
    }
    return true;
  }, []);

  const ensureLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다. 설정에서 권한을 허용해 주세요.');
      return false;
    }
    return true;
  }, []);

  const handleLaunchCamera = useCallback(
    async (mode) => {
      setCameraModeVisible(false);
      const hasPermission = await ensureCameraPermission();
      if (!hasPermission) return;

      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes:
            mode === 'video'
              ? ImagePicker.MediaTypeOptions.Videos
              : ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          videoMaxDuration: 60,
        });

        if (!result.canceled && Array.isArray(result.assets)) {
          result.assets.forEach(appendMediaMessage);
        }
      } catch (error) {
        console.error('Camera launch error:', error);
        Alert.alert('오류', '카메라를 여는 중 문제가 발생했습니다.');
      }
    },
    [appendMediaMessage, ensureCameraPermission]
  );

  const handlePickFromLibrary = useCallback(async () => {
    setAttachSheetVisible(false);
    const hasPermission = await ensureLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && Array.isArray(result.assets)) {
        result.assets.forEach(appendMediaMessage);
      }
    } catch (error) {
      console.error('Library pick error:', error);
      Alert.alert('오류', '앨범을 여는 중 문제가 발생했습니다.');
    }
  }, [appendMediaMessage, ensureLibraryPermission]);

  const handleOpenCameraOptions = useCallback(() => {
    setAttachSheetVisible(false);
    setCameraModeVisible(true);
  }, []);

  const handleOpenGiftSheet = useCallback(() => {
    setAttachSheetVisible(false);
    setGiftSheetVisible(true);
  }, []);

  const handleSendGift = useCallback(
    (gift) => {
      if (!gift) return;
      appendMessage({ type: 'gift', gift });
      setGiftSheetVisible(false);
      Alert.alert('선물 전송 완료', `${formatPoints(gift.amount)}P를 선물했습니다.`);
    },
    [appendMessage, formatPoints]
  );

  const loadGiftOptions = useCallback(async () => {
    setLoadingGifts(true);
    setGiftError(null);
    try {
      const gifts = await listGiftOptions();
      setGiftOptions(gifts);
      if (gifts.length === 0) {
        setGiftError('선물 기능이 준비 중입니다.');
      }
    } catch (error) {
      console.error('Failed to load gift options:', error);
      setGiftOptions([]);
      setGiftError('선물 기능이 준비 중입니다.');
    } finally {
      setLoadingGifts(false);
    }
  }, []);

  useEffect(() => {
    if (giftSheetVisible) {
      loadGiftOptions();
    }
  }, [giftSheetVisible, loadGiftOptions]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    appendMessage({ text: inputText.trim() });
    setInputText('');
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
        const bubbleStyles = [
      styles.messageBubble,
      isMe ? styles.myMessageBubble : styles.otherMessageBubble,
    ];

    if (item.type === 'media') {
      bubbleStyles.push(styles.mediaMessageBubble);
    }

    if (item.type === 'gift') {
      bubbleStyles.push(styles.giftMessageBubble);
    }

    const renderBubbleContent = () => {
      if (item.type === 'media' && item.media?.uri) {
        if (item.mediaType === 'video') {
          return (
            <View style={styles.videoAttachmentContainer}>
              <Video
                source={{ uri: item.media.uri }}
                style={styles.videoAttachment}
                resizeMode="cover"
                useNativeControls
                shouldPlay={false}
              />
            </View>
          );
        }

        return (
          <Image
            source={{ uri: item.media.uri }}
            style={styles.imageAttachment}
            resizeMode="cover"
          />
        );
      }

      if (item.type === 'gift' && item.gift) {
        const giftTextColor = isMe ? colors.textInverse : colors.text;
        const giftAccentColor = isMe ? colors.textInverse : colors.primary;

        return (
          <View style={styles.giftContent}>
            <View style={[styles.giftIconBadge, { borderColor: giftAccentColor }]}>
              <Ionicons name="gift-outline" size={18} color={giftAccentColor} />
            </View>
            <View style={styles.giftTextWrapper}>
              <Text style={[styles.giftTitle, { color: giftTextColor }]}>{item.gift.name}</Text>
              <Text style={[styles.giftAmount, { color: giftAccentColor }]}>
                {formatPoints(item.gift.amount)}P 전송
              </Text>
              {item.gift.description ? (
                <Text style={styles.giftDescription}>{item.gift.description}</Text>
              ) : null}
            </View>
          </View>
        );
      }

      return (
        <Text
          style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
      );
    };
 
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!isMe && (
          <Avatar
            name={user.name}
            size={40}
            shape="rounded"
            style={styles.messageAvatar}
          />
        )}
        <View style={styles.messageContent}>
          <View style={bubbleStyles}>{renderBubbleContent()}</View>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  const renderGiftOption = ({ item }) => (
    <TouchableOpacity
      style={styles.giftOptionButton}
      onPress={() => handleSendGift(item)}
    >
      <View style={styles.giftOptionTextWrapper}>
        <Text style={styles.giftOptionAmount}>{formatPoints(item.amount)}P</Text>
        <Text style={styles.giftOptionName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.giftOptionDescription}>{item.description}</Text>
        ) : null}
      </View>
      <Ionicons name="paper-plane" size={18} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View
        style={styles.header}
        onLayout={(event) => {
          const nextHeight = event.nativeEvent.layout.height;
          if (nextHeight !== headerHeight) {
            setHeaderHeight(nextHeight);
          }
        }}
      >
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
        enabled={Platform.OS === 'ios' ? true : isKeyboardVisible}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesListContainer}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: composerHeight + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom + 8 },
          ]}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight !== composerHeight) {
              setComposerHeight(nextHeight);
            }
          }}
        >
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => {
              Keyboard.dismiss();
              setAttachSheetVisible(true);
            }}
          >
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
        visible={attachSheetVisible}
        animationType="fade"
        onRequestClose={() => {
          Keyboard.dismiss();
          setAttachSheetVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setAttachSheetVisible(false);
          }}
        >
          <View style={styles.bottomSheetBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.bottomSheetContainer, { paddingBottom: insets.bottom + 16 }]}>
                <Text style={styles.sheetTitle}>빠른 첨부</Text>
                <View style={styles.sheetActionsRow}>
                  <TouchableOpacity
                    style={styles.sheetActionButton}
                    onPress={handleOpenCameraOptions}
                  >
                    <View style={styles.sheetActionIcon}>
                      <Ionicons name="camera-outline" size={22} color={colors.primary} />
                    </View>
                    <Text style={styles.sheetActionLabel}>카메라</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sheetActionButton}
                    onPress={handlePickFromLibrary}
                  >
                    <View style={styles.sheetActionIcon}>
                      <Ionicons name="images-outline" size={22} color={colors.primary} />
                    </View>
                    <Text style={styles.sheetActionLabel}>앨범</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sheetActionButton}
                    onPress={handleOpenGiftSheet}
                  >
                    <View style={styles.sheetActionIcon}>
                      <Ionicons name="gift-outline" size={22} color={colors.primary} />
                    </View>
                    <Text style={styles.sheetActionLabel}>선물하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent
        visible={cameraModeVisible}
        animationType="fade"
        onRequestClose={() => setCameraModeVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCameraModeVisible(false)}>
          <View style={styles.bottomSheetBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.bottomSheetContainer, { paddingBottom: insets.bottom + 16 }]}>
                <Text style={styles.sheetTitle}>촬영 모드 선택</Text>
                <TouchableOpacity
                  style={styles.sheetOptionButton}
                  onPress={() => handleLaunchCamera('photo')}
                >
                  <Ionicons name="camera" size={20} color={colors.primary} style={styles.sheetOptionIcon} />
                  <Text style={styles.sheetOptionLabel}>사진 촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetOptionButton}
                  onPress={() => handleLaunchCamera('video')}
                >
                  <Ionicons name="videocam" size={20} color={colors.primary} style={styles.sheetOptionIcon} />
                  <Text style={styles.sheetOptionLabel}>동영상 촬영</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent
        visible={giftSheetVisible}
        animationType="fade"
        onRequestClose={() => setGiftSheetVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setGiftSheetVisible(false)}>
          <View style={styles.bottomSheetBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.bottomSheetContainer, styles.giftSheetContainer, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.giftSheetHeader}>
                  <Text style={styles.sheetTitle}>선물하기</Text>
                  <View style={styles.giftSheetHeaderActions}>
                    <TouchableOpacity
                      style={[styles.giftHeaderButton, loadingGifts && styles.giftHeaderButtonDisabled]}
                      onPress={loadGiftOptions}
                      disabled={loadingGifts}
                    >
                      <Ionicons
                        name="refresh"
                        size={20}
                        color={loadingGifts ? colors.textTertiary : colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {loadingGifts ? (
                  <View style={styles.giftLoadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.giftLoadingText}>선물 목록을 불러오는 중...</Text>
                  </View>
                ) : giftOptions.length > 0 ? (
                  <FlatList
                    data={giftOptions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGiftOption}
                    contentContainerStyle={styles.giftList}
                    ItemSeparatorComponent={() => <View style={styles.giftSeparator} />}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.giftErrorContainer}>
                    <Text style={styles.giftErrorText}>{giftError || '선물 기능이 준비 중입니다.'}</Text>
                    <TouchableOpacity style={styles.giftRetryButton} onPress={loadGiftOptions}>
                      <Text style={styles.giftRetryText}>다시 시도</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
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
  messagesListContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    mediaMessageBubble: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 18,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  giftMessageBubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  sendButton: {
    padding: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
    bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sheetActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
  },
  sheetActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  sheetOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    marginTop: 4,
    gap: 12,
    backgroundColor: colors.background,
  },
  sheetOptionIcon: {
    width: 28,
    textAlign: 'center',
  },
  sheetOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  giftSheetContainer: {
    gap: 16,
  },
  giftSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftSheetHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  giftHeaderButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  giftHeaderButtonDisabled: {
    opacity: 0.6,
  },
  giftList: {
    gap: 12,
    paddingBottom: 8,
  },
  giftSeparator: {
    height: 10,
  },
  giftOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 16,
  },
  giftOptionTextWrapper: {
    flex: 1,
  },
  giftOptionAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  giftOptionName: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  giftOptionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  giftLoadingContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  giftLoadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  giftErrorContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  giftErrorText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  giftRetryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  giftRetryText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  imageAttachment: {
    width: 220,
    height: 220,
    borderRadius: 18,
  },
  videoAttachmentContainer: {
    width: 220,
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoAttachment: {
    width: '100%',
    height: '100%',
  },
  giftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  giftTextWrapper: {
    flex: 1,
  },
  giftTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  giftAmount: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
  },
  giftDescription: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
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
