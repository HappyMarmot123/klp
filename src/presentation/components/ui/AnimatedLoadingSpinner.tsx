import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface AnimatedLoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  overlay?: boolean;
  animation?: "rotate" | "pulse" | "bounce" | "dots";
}

export const AnimatedLoadingSpinner: React.FC<AnimatedLoadingSpinnerProps> = ({
  size = "medium",
  color = "#4a90e2",
  text,
  overlay = false,
  animation = "rotate",
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    switch (animation) {
      case "rotate":
        rotation.value = withRepeat(
          withTiming(360, { duration: 1000, easing: Easing.linear }),
          -1,
          false
        );
        break;
      case "pulse":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 600 }),
            withTiming(1, { duration: 600 })
          ),
          -1,
          true
        );
        break;
      case "bounce":
        scale.value = withRepeat(
          withSequence(
            withTiming(1.3, {
              duration: 300,
              easing: Easing.out(Easing.cubic),
            }),
            withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) })
          ),
          -1,
          true
        );
        break;
      case "dots":
        dot1Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 })
          ),
          -1,
          false
        );
        dot2Opacity.value = withRepeat(
          withSequence(
            withDelay(200, withTiming(1, { duration: 400 })),
            withTiming(0.3, { duration: 400 })
          ),
          -1,
          false
        );
        dot3Opacity.value = withRepeat(
          withSequence(
            withDelay(400, withTiming(1, { duration: 400 })),
            withTiming(0.3, { duration: 400 })
          ),
          -1,
          false
        );
        break;
    }
  }, [animation]);

  const getSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 30;
      case "large":
        return 40;
      default:
        return 30;
    }
  };

  const spinnerStyle = useAnimatedStyle(() => {
    if (animation === "rotate") {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    } else if (animation === "pulse" || animation === "bounce") {
      return {
        transform: [{ scale: scale.value }],
      };
    }
    return {};
  });

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  const renderSpinner = () => {
    if (animation === "dots") {
      return (
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[styles.dot, { backgroundColor: color }, dot1Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: color }, dot2Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: color }, dot3Style]}
          />
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.spinner,
          { width: getSize(), height: getSize() },
          spinnerStyle,
        ]}
      >
        <View
          style={[
            styles.spinnerCircle,
            {
              width: getSize(),
              height: getSize(),
              borderColor: color,
              borderTopColor: "transparent",
            },
          ]}
        />
      </Animated.View>
    );
  };

  const containerStyle = overlay ? styles.overlay : styles.container;

  return (
    <View style={containerStyle}>
      {renderSpinner()}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  spinner: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerCircle: {
    borderRadius: 50,
    borderWidth: 3,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});
