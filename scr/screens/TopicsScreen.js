// tokfriends-app/src/screens/TopicsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:8000';

export default function TopicsScreen() {
  const { token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicPosts, setTopicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topics`);
      setTopics(response.data || []);
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopicPosts = async (topicId) => {
    setPostsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/topics/${topicId}/posts`);
      setTopicPosts(response.data.items || response.data || []);
    } catch (error) {
      console.error('Failed to load topic posts:', error);
      setTopicPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleTopicPress = (topic) => {
    if (selectedTopic?.id === topic.id) {
      setSelectedTopic(null);
      setTopicPosts([]);
    } else {
      setSelectedTopic(topic);
      loadTopicPosts(topic.id);
    }
  };

  const renderTopic = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.topicCard,
        selectedTopic?.id === item.id && styles.topicCardActive
      ]}
      onPress={() => handleTopicPress(item)}
    >
      <Text style={styles.topicName}>{item.name}</Text>
      <Text style={styles.topicCount}>게시물 {item.postsCount || 0}개</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.postDate}>
        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TokFriends</Text>
      <Text style={styles.subtitle}>토픽 목록</Text>
      
      <FlatList
        data={topics}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.topicList}
      />

      {selectedTopic && (
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>{selectedTopic.name} 게시물</Text>
          {postsLoading ? (
            <ActivityIndicator size="small" color="#10B981" />
          ) : (
            <FlatList
              data={topicPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.postsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>게시물이 없습니다</Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 24,
    fontFamily: 'NotoSansKR_700Bold',
    color: '#10B981',
    textAlign: 'center',
    paddingTop: 15,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 15,
  },
  topicList: {
    padding: 15,
  },
  topicCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicCardActive: {
    backgroundColor: '#10B981',
  },
  topicName: {
    fontSize: 16,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#fff',
  },
  topicCount: {
    fontSize: 14,
    fontFamily: 'NotoSansKR_400Regular',
    color: '#9CA3AF',
  },
  postsSection: {
    flex: 1,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#10B981',
    marginBottom: 15,
  },
  postsList: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'NotoSansKR_400Regular',
    color: '#fff',
    marginBottom: 5,
  },
  postDate: {
    fontSize: 12,
    fontFamily: 'NotoSansKR_400Regular',
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});