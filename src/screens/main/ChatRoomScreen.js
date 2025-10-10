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
import { LinearGradient } from 'expo-linear-gradient';
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
  const [isFavorite, setIsFavorite] = useState(route?.params?.isFavorite ?? false);
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

    useEffect(() => {
    if (typeof route?.params?.isFavorite === 'boolean') {
      setIsFavorite(route.params.isFavorite);
    }
  }, [route?.params?.isFavorite]);

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
    setKeyboardVisible(false);
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
    setKeyboardVisible(false);
    setAttachSheetVisible(false);
    setCameraModeVisible(true);
  }, []);

  const handleOpenGiftSheet = useCallback(() => {
    setKeyboardVisible(false);
    setAttachSheetVisible(false);
    setGiftSheetVisible(true);
  }, []);

    const handleToggleFavorite = useCallback(() => {
    setOptionsVisible(false);
    setIsFavorite((prev) => {
      const next = !prev;
      route?.params?.onToggleFavorite?.(next);
      navigation.setParams({ isFavorite: next });
      Alert.alert(
        '즐겨찾기',
        next
          ? `${user.name}님을 즐겨찾기에 추가했어요.`
          : `${user.name}님을 즐겨찾기에서 삭제했어요.`
      );
      return next;
    });
  }, [navigation, route?.params, user.name]);

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
        const giftTextColor = isMe ? '#3F2A00' : colors.text;
        const giftAccentColor = isMe ? '#3F2A00' : colors.primary;

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
            shape="circle"
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
    <LinearGradient colors={['#B7D9FF', '#FFE5A8']} style={styles.gradient}>
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
          <Ionicons name="arrow-back" size={24} color="#1F2A44" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Avatar
            name={user.name}
            size={46}
            shape="circle"
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

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={handleToggleFavorite}
            hitSlop={8}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={22}
              color={isFavorite ? '#F7B500' : '#1F2A44'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setOptionsVisible(true)}
            hitSlop={8}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#1F2A44" />
          </TouchableOpacity>
        </View>
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
              setKeyboardVisible(false);
              setAttachSheetVisible(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={28} color="#7D8597" />
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
             name="paper-plane"
              size={20}
              color={inputText.trim() ? '#3F2A00' : colors.textTertiary}
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
          setKeyboardVisible(false);
          setAttachSheetVisible(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setKeyboardVisible(false);
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
                                <TouchableOpacity style={styles.optionItem} onPress={handleToggleFavorite}>
                  <Ionicons
                    name={isFavorite ? 'star' : 'star-outline'}
                    size={18}
                    color={isFavorite ? '#F7B500' : '#1F2A44'}
                  />
                  <Text style={styles.optionText}>
                    {isFavorite ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.optionDivider} />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#96B8FF',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',    
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,   
  },
  headerAvatar: {
    marginRight: 0,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2A44',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD47A',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#3A8F6B',
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,220,120,0.45)',
  },
  moreButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  chatContainer: {
    flex: 1,
  },
  messagesListContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginRight: 10,
    marginTop: 2,
  },
  messageContent: {
    maxWidth: '78%',
  },
  messageBubble: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
  },
  mediaMessageBubble: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  giftMessageBubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  myMessageBubble: {
    backgroundColor: 'rgba(255,226,102,0.95)',
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,198,53,0.45)',
  },
  otherMessageBubble: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#D9DEEB',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myMessageText: {
    color: '#3F2A00',
    fontWeight: '600',
  },
  otherMessageText: {
    color: '#1F2430',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  myMessageTime: {
    color: 'rgba(63, 42, 0, 0.6)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#7D8597',
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderTopWidth: 0,
  },
  attachButton: {
    padding: 6,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E3E8F5',
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFE266',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EBCB54',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 18,
    shadowColor: '#7EA0FF',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2A44',
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
    borderColor: '#E2E8F5',
    backgroundColor: '#F8FAFF',
    gap: 8,
  },
  sheetActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(243,108,147,0.18)',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  sheetActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2A44',
  },
  sheetOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F5',
    paddingHorizontal: 14,
    marginTop: 4,
    gap: 12,
    backgroundColor: '#F8FAFF',
  },
  sheetOptionIcon: {
    width: 28,
    textAlign: 'center',
  },
  sheetOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2A44',
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
    borderColor: '#E2E8F5',
    backgroundColor: '#FFFFFF',
    gap: 16,
    shadowColor: '#E2E8F5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
    color: '#1F2A44',
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
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E2E8F5',
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
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(243,108,147,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6FB',
  },
  giftTextWrapper: {
    flex: 1,
  },
  giftTitle: {
    fontSize: 15,
    fontWeight: '700',    
    color: '#1F2A44',
  },
  giftAmount: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  giftDescription: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  optionsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: 72,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 160,
    shadowColor: '#8BA9FF',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#E4E9F6',
    marginVertical: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2A44',
  },
  reportCard: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 26,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#7EA0FF',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2A44',
  },
  reportDescription: {
    marginTop: 10,
    color: '#5B657A',
    lineHeight: 20,
  },
  reportInput: {
    marginTop: 18,
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#E2E8F5',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F2F4FF',
  },
  secondaryBtnTxt: {
    color: '#5B657A',
    fontWeight: '700',
  },
  primaryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
    shadowColor: '#F36C93',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnTxt: {
    color: colors.textInverse,
    fontWeight: '800',
  },
});
