import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post } from "../types";
import { PostService } from "../services/postService";
import { AuthService } from "../services/authService";
import { AnimatedLoadingSpinner } from "../presentation/components/ui/AnimatedLoadingSpinner";

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (
    page: number = currentPage,
    showLoading: boolean = true
  ) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const [postsData, totalCount] = await Promise.all([
        PostService.getPosts(page, postsPerPage),
        PostService.getTotalPostsCount(),
      ]);

      setPosts(postsData);
      setTotalPosts(totalCount);
      setTotalPages(Math.ceil(totalCount / postsPerPage));
    } catch (error) {
      Alert.alert("오류", "게시글을 불러오는데 실패했습니다.");
      console.error("Error loading posts:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts(currentPage);
    setRefreshing(false);
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    await loadPosts(page, false);
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.logout();
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("오류", "로그아웃에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>

      <View style={styles.postMeta}>
        <Text style={styles.postAuthor}>{item.authorName}</Text>
        <View style={styles.metaRight}>
          <Text style={styles.commentCount}>💬 {item.commentCount}</Text>
          <Text style={styles.postDate}>
            {item.createdAt.toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <AnimatedLoadingSpinner
          size="large"
          text="게시글을 불러오는 중..."
          animation="rotate"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>케이엘피</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.push("CreatePost")}
          >
            <Text style={styles.createButtonText}>글쓰기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={() => (
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationInfo}>
              {totalPosts}개 중 {(currentPage - 1) * postsPerPage + 1}-
              {Math.min(currentPage * postsPerPage, totalPosts)}개 표시
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === 1 && styles.pageButtonTextDisabled,
                  ]}
                >
                  이전
                </Text>
              </TouchableOpacity>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                const pageNumber = startPage + i;
                if (pageNumber > totalPages) return null;

                return (
                  <TouchableOpacity
                    key={pageNumber}
                    style={[
                      styles.pageButton,
                      currentPage === pageNumber && styles.pageButtonActive,
                    ]}
                    onPress={() => handlePageChange(pageNumber)}
                  >
                    <Text
                      style={[
                        styles.pageButtonText,
                        currentPage === pageNumber &&
                          styles.pageButtonTextActive,
                      ]}
                    >
                      {pageNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === totalPages && styles.pageButtonTextDisabled,
                  ]}
                >
                  다음
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  createButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 107, 107, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    justifyContent: "space-between",
  },
  postItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  postContent: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  postAuthor: {
    fontSize: 12,
    color: "#87ceeb",
    fontWeight: "500",
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  commentCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  postDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  imagePreview: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
  },
  imageCountText: {
    fontSize: 12,
    color: "#87ceeb",
    fontWeight: "500",
  },
  paginationContainer: {
    padding: 20,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  paginationInfo: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  paginationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minWidth: 40,
    alignItems: "center",
  },
  pageButtonActive: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2",
  },
  pageButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pageButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  pageButtonTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  pageButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
});
