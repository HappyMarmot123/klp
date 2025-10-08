import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Comment } from "../types";
import { PostService } from "../services/postService";
import { AuthService } from "../services/authService";
import { AnimatedButton } from "../presentation/components/ui/AnimatedButton";

const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required("댓글을 입력해주세요")
    .min(1, "댓글을 입력해주세요")
    .max(50, "댓글은 50자 이하로 입력해주세요")
    .trim(),
});

interface CommentListProps {
  comments: Comment[];
}

interface CommentInputProps {
  postId: string;
  onCommentsUpdate: () => void;
}

export function CommentList({ comments }: CommentListProps) {
  const renderComment = (comment: Comment, index: number) => (
    <View key={comment.id} style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
        <Text style={styles.commentDate}>
          {comment.createdAt.toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );

  return (
    <View style={styles.commentListContainer}>
      <Text style={styles.commentsTitle}>댓글 ({comments.length})</Text>
      {comments.map(renderComment)}
      {comments.length === 0 && (
        <Text style={styles.noCommentsText}>아직 댓글이 없습니다.</Text>
      )}
    </View>
  );
}

export function CommentInput({ postId, onCommentsUpdate }: CommentInputProps) {
  const [submittingComment, setSubmittingComment] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const watchedContent = watch("content");

  const handleAddComment = async (data: { content: string }) => {
    try {
      setSubmittingComment(true);
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      await PostService.addComment({
        postId,
        authorId: currentUser.id,
        authorName: currentUser.email.split("@")[0],
        content: data.content.trim(),
      });

      reset();
      onCommentsUpdate();
    } catch (error) {
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <View style={styles.commentInputContainer}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력하세요..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={value}
              onChangeText={onChange}
              multiline
              maxLength={50}
            />
          )}
        />
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            ({watchedContent?.length || 0}/50)
          </Text>
        </View>
      </View>
      <AnimatedButton
        title={submittingComment ? "작성 중..." : "등록"}
        onPress={handleSubmit(handleAddComment)}
        disabled={submittingComment}
        loading={submittingComment}
        variant="primary"
        size="medium"
        animation="scale"
      />
      {errors.content && (
        <Text style={styles.errorText}>{errors.content.message}</Text>
      )}
    </View>
  );
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdate: () => void;
}

export default function CommentSection({
  postId,
  comments,
  onCommentsUpdate,
}: CommentSectionProps) {
  return (
    <View style={styles.container}>
      <CommentList comments={comments} />
      <CommentInput postId={postId} onCommentsUpdate={onCommentsUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 0,
  },
  commentListContainer: {
    padding: 20,
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    color: "#87ceeb",
    fontWeight: "500",
  },
  commentDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  commentContent: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  noCommentsText: {
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    padding: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10,
    borderRadius: 12,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    marginRight: 12,
  },
  commentInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    paddingRight: 60,
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 14,
    maxHeight: 72,
    minHeight: 48,
    textAlignVertical: "top",
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  characterCountText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 8,
    marginLeft: 16,
  },
});
