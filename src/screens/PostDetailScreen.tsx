import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";
import { Post, Comment } from "../types";
import { PostService } from "../services/postService";
import { CommentList, CommentInput } from "../components/CommentSection";
import ImageCarousel from "../presentation/components/layout/ImageCarousel";
import ImageModal from "../presentation/components/layout/ImageModal";

export default function PostDetailScreen({ navigation, route }: any) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>("");

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        PostService.getPost(postId),
        PostService.getComments(postId),
      ]);

      if (postData) {
        setPost(postData);
        setComments(commentsData);
      } else {
        Alert.alert("오류", "게시글을 찾을 수 없습니다.");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("오류", "게시글을 불러오는데 실패했습니다.");
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageUri: string) => {
    setSelectedImageUri(imageUri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImageUri("");
  };

  if (loading) {
    return (
      <SafeAreaViewContext style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaViewContext>
    );
  }

  if (!post) {
    return (
      <SafeAreaViewContext style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaViewContext>
    );
  }

  return (
    <SafeAreaViewContext style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>게시글</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>

            <View style={styles.postMeta}>
              <Text style={styles.postAuthor}>{post.authorName}</Text>
              <Text style={styles.postDate}>
                {post.createdAt.toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <ImageCarousel
              images={post.images || []}
              onImagePress={openImageModal}
            />
          </View>

          <CommentList comments={comments} />
        </ScrollView>

        <CommentInput postId={postId} onCommentsUpdate={loadPostData} />
      </KeyboardAvoidingView>

      <ImageModal
        visible={modalVisible}
        imageUri={selectedImageUri}
        onClose={closeImageModal}
      />
    </SafeAreaViewContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#87ceeb",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  postContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  postTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  postAuthor: {
    fontSize: 14,
    color: "#87ceeb",
    fontWeight: "500",
  },
  postDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  postContent: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 16,
  },
  postStats: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  statText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
