import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Post, Comment } from "../types";

export class PostService {
  static async createPost(
    postData: Omit<
      Post,
      "id" | "createdAt" | "updatedAt" | "likes" | "comments" | "commentCount"
    >
  ) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: [],
        commentCount: 0,
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  static async getPosts(page: number = 1, limitCount: number = 10) {
    try {
      const offset = (page - 1) * limitCount;

      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(offset + limitCount)
      );

      const querySnapshot = await getDocs(q);
      const allDocs = querySnapshot.docs;

      const paginatedDocs = allDocs.slice(offset, offset + limitCount);

      return paginatedDocs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          commentCount: data.commentCount || 0,
        };
      }) as Post[];
    } catch (error) {
      throw error;
    }
  }

  static async getTotalPostsCount() {
    try {
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      throw error;
    }
  }

  static async getPost(postId: string) {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
          updatedAt: docSnap.data().updatedAt.toDate(),
        } as Post;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async updatePost(postId: string, updateData: Partial<Post>) {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  static async deletePost(postId: string) {
    try {
      const docRef = doc(db, "posts", postId);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }

  static async addComment(
    commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const postRef = doc(db, "posts", commentData.postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentCommentCount = postSnap.data().commentCount || 0;
        await updateDoc(postRef, {
          commentCount: currentCommentCount + 1,
          updatedAt: new Date(),
        });
      }

      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  static async getComments(postId: string) {
    try {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Comment[];

      return comments.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    } catch (error) {
      throw error;
    }
  }

  static async syncCommentCounts() {
    try {
      const postsQuery = query(collection(db, "posts"));
      const postsSnapshot = await getDocs(postsQuery);

      const updatePromises = postsSnapshot.docs.map(async (postDoc) => {
        const postId = postDoc.id;
        const commentsQuery = query(
          collection(db, "comments"),
          where("postId", "==", postId)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const actualCommentCount = commentsSnapshot.size;

        const currentCommentCount = postDoc.data().commentCount || 0;

        if (actualCommentCount !== currentCommentCount) {
          await updateDoc(doc(db, "posts", postId), {
            commentCount: actualCommentCount,
            updatedAt: new Date(),
          });
        }
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error syncing comment counts:", error);
      throw error;
    }
  }
}
