import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  animation?: "fadeIn" | "slideIn" | "scaleIn";
  direction?: "left" | "right" | "top" | "bottom";
  style?: any;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  delay = 100,
  animation = "fadeIn",
  direction = "left",
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const animationDelay = index * delay;
    const config = {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    };

    switch (animation) {
      case "fadeIn":
        opacity.value = withDelay(animationDelay, withTiming(1, config));
        break;
      case "slideIn":
        opacity.value = withDelay(animationDelay, withTiming(1, config));
        if (direction === "left") {
          translateX.value = withDelay(animationDelay, withTiming(0, config));
        } else if (direction === "right") {
          translateX.value = withDelay(animationDelay, withTiming(0, config));
        } else if (direction === "top") {
          translateY.value = withDelay(animationDelay, withTiming(0, config));
        } else if (direction === "bottom") {
          translateY.value = withDelay(animationDelay, withTiming(0, config));
        }
        break;
      case "scaleIn":
        opacity.value = withDelay(animationDelay, withTiming(1, config));
        scale.value = withDelay(
          animationDelay,
          withSpring(1, {
            damping: 15,
            stiffness: 150,
          })
        );
        break;
    }
  }, [index, delay, animation, direction]);

  const animatedStyle = useAnimatedStyle(() => {
    const initialTranslateX =
      direction === "left" ? -50 : direction === "right" ? 50 : 0;
    const initialTranslateY =
      direction === "top" ? -30 : direction === "bottom" ? 30 : 0;

    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value + initialTranslateX },
        { translateY: translateY.value + initialTranslateY },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};
