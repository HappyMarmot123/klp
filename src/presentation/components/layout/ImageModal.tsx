import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AnimatedModal } from "../ui/AnimatedModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ImageModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

export default function ImageModal({
  visible,
  imageUri,
  onClose,
}: ImageModalProps) {
  return (
    <AnimatedModal visible={visible} onClose={onClose} animation="scale">
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.modalImageContainer}
          activeOpacity={1}
          onPress={() => {}}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Text style={styles.modalCloseButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
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
