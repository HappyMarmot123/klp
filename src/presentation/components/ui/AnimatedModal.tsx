import React, { useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animation?: "fade" | "slide" | "scale" | "bounce";
  direction?: "top" | "bottom" | "left" | "right";
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  children,
  animation = "fade",
  direction = "bottom",
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      switch (animation) {
        case "fade":
          break;
        case "slide":
          if (direction === "top") {
            translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
          } else if (direction === "bottom") {
            translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
          } else if (direction === "left") {
            translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
          } else if (direction === "right") {
            translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
          }
          break;
        case "scale":
          scale.value = withSpring(1, { damping: 15, stiffness: 150 });
          break;
        case "bounce":
          scale.value = withSpring(1, { damping: 8, stiffness: 200 });
          break;
      }
    } else {
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });

      switch (animation) {
        case "fade":
          break;
        case "slide":
          if (direction === "top") {
            translateY.value = withTiming(-screenHeight, { duration: 200 });
          } else if (direction === "bottom") {
            translateY.value = withTiming(screenHeight, { duration: 200 });
          } else if (direction === "left") {
            translateX.value = withTiming(-screenWidth, { duration: 200 });
          } else if (direction === "right") {
            translateX.value = withTiming(screenWidth, { duration: 200 });
          }
          break;
        case "scale":
        case "bounce":
          scale.value = withTiming(0.8, { duration: 200 });
          break;
      }
    }
  }, [visible, animation, direction]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => {
    const initialTranslateX =
      direction === "left"
        ? -screenWidth
        : direction === "right"
        ? screenWidth
        : 0;
    const initialTranslateY =
      direction === "top"
        ? -screenHeight
        : direction === "bottom"
        ? screenHeight
        : 0;

    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value + initialTranslateX },
        { translateY: translateY.value + initialTranslateY },
        { scale: scale.value },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View style={[styles.content, contentStyle]}>
            <TouchableOpacity
              style={styles.contentTouchable}
              activeOpacity={1}
              onPress={() => {}}
            >
              {children}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: screenWidth * 0.95,
    maxHeight: screenHeight * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
