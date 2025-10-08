import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PostService } from "../services/postService";
import { AuthService } from "../services/authService";
import { ImageService } from "../services/imageService";

const createPostSchema = yup.object().shape({
  title: yup
    .string()
    .required("제목을 입력해주세요")
    .min(2, "제목은 최소 2자 이상이어야 합니다")
    .max(100, "제목은 최대 100자까지 입력 가능합니다"),
  content: yup
    .string()
    .required("내용을 입력해주세요")
    .min(10, "내용은 최소 10자 이상이어야 합니다")
    .max(2000, "내용은 최대 2000자까지 입력 가능합니다"),
});

type CreatePostFormData = yup.InferType<typeof createPostSchema>;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CreatePostScreen({ navigation }: any) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: yupResolver(createPostSchema),
    mode: "onChange",
  });

  React.useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      Alert.alert("오류", "사용자 정보를 불러올 수 없습니다.");
      navigation.goBack();
    }
  };

  const handleImagePicker = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert("알림", "이미지는 최대 3개까지만 업로드할 수 있습니다.");
      return;
    }

    try {
      const imageUri = await ImageService.pickImage();
      if (imageUri) {
        setSelectedImages((prev) => [...prev, imageUri]);
      }
    } catch (error) {
      Alert.alert("오류", "이미지를 선택할 수 없습니다.");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const openImageModal = (imageUri: string) => {
    setSelectedImageUri(imageUri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImageUri("");
  };

  const onSubmit = async (data: CreatePostFormData) => {
    if (!currentUser) {
      Alert.alert("오류", "사용자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setUploading(true);

      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await ImageService.uploadMultipleImages(
          selectedImages,
          currentUser.id
        );
      }

      const postData = {
        title: data.title,
        content: data.content,
        images: imageUrls,
        authorId: currentUser.id,
        authorName: currentUser.email.split("@")[0],
      };

      await PostService.createPost(postData);

      Alert.alert("성공", "게시글이 작성되었습니다.", [
        { text: "확인", onPress: () => navigation.navigate("Home") },
      ]);

      reset();
      setSelectedImages([]);
    } catch (error) {
      Alert.alert("오류", "게시글 작성에 실패했습니다.");
      console.error("Error creating post:", error);
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    handleImagePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>글쓰기</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.titleInput,
                        errors.title && styles.inputError,
                      ]}
                      placeholder="제목을 입력하세요"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      maxLength={100}
                    />
                    <View style={styles.characterCount}>
                      <Text style={styles.errorText}>
                        {errors.title?.message || ""}
                      </Text>
                      <Text style={styles.characterCountText}>
                        ({value?.length || 0}/100)
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.contentInput,
                        errors.content && styles.inputError,
                      ]}
                      placeholder="내용을 입력하세요"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      multiline
                      numberOfLines={10}
                      textAlignVertical="top"
                      maxLength={2000}
                    />

                    <View style={styles.characterCount}>
                      <Text style={styles.errorText}>
                        {errors.content?.message || ""}
                      </Text>
                      <Text style={styles.characterCountText}>
                        ({value?.length || 0}/2000)
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <View>
              <View style={styles.imageSectionHeader}>
                <Text style={styles.imageSectionTitle}>
                  이미지 ({selectedImages.length}/3)
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    selectedImages.length >= 3 && styles.addImageButtonDisabled,
                  ]}
                  onPress={showImageOptions}
                  disabled={selectedImages.length >= 3}
                >
                  <Text
                    style={[
                      styles.addImageButtonText,
                      selectedImages.length >= 3 &&
                        styles.addImageButtonTextDisabled,
                    ]}
                  >
                    + 추가
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imageGrid}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageItem}>
                    <TouchableOpacity
                      onPress={() => openImageModal(imageUri)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.selectedImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {Array.from(
                  { length: 3 - selectedImages.length },
                  (_, index) => (
                    <TouchableOpacity
                      key={`skeleton-${index}`}
                      style={styles.imageSkeleton}
                      onPress={handleImagePicker}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.skeletonSubText}>이미지 추가</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              uploading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>완료</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            activeOpacity={1}
            onPress={closeImageModal}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalImageContainer}
                activeOpacity={1}
                onPress={() => {}}
              >
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeImageModal}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
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
  bottomButtonContainer: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4a90e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  titleInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  contentInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 200,
  },
  inputError: {
    borderColor: "rgba(255, 107, 107, 0.6)",
    backgroundColor: "rgba(255, 107, 107, 0.15)",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    flex: 1,
  },
  characterCountText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  characterCount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  imageSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  imageSectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  addImageButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addImageButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  addImageButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  addImageButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  imageItem: {
    position: "relative",
    width: 100,
    height: 100,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff6b6b",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  skeletonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  skeletonSubText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalCloseButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
