import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebase.config";
import * as ImagePicker from "expo-image-picker";

export class ImageService {
  static async pickImage(): Promise<string | null> {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        throw new Error("갤러리 접근 권한이 필요합니다.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("이미지 선택 중 오류:", error);
      throw error;
    }
  }

  static async takePhoto(): Promise<string | null> {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        throw new Error("카메라 접근 권한이 필요합니다.");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("사진 촬영 중 오류:", error);
      throw error;
    }
  }

  static async uploadImage(imageUri: string, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `images/${userId}/${timestamp}.jpg`;
      const storageRef = ref(storage, fileName);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      throw error;
    }
  }

  static async uploadMultipleImages(
    imageUris: string[],
    userId: string
  ): Promise<string[]> {
    try {
      const uploadPromises = imageUris.map((uri) =>
        this.uploadImage(uri, userId)
      );
      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      console.error("여러 이미지 업로드 중 오류:", error);
      throw error;
    }
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("이미지 삭제 중 오류:", error);
      throw error;
    }
  }
}
