import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideIn" | "scaleIn" | "bounceIn";
  delay?: number;
  duration?: number;
  direction?: "top" | "bottom" | "left" | "right";
  style?: any;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 300,
  direction = "bottom",
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    const config = {
      duration,
      easing: Easing.out(Easing.cubic),
    };

    switch (animation) {
      case "fadeIn":
        opacity.value = withDelay(delay, withTiming(1, config));
        break;
      case "slideIn":
        opacity.value = withDelay(delay, withTiming(1, config));
        if (direction === "top") {
          translateY.value = withDelay(delay, withTiming(0, config));
        } else if (direction === "bottom") {
          translateY.value = withDelay(delay, withTiming(0, config));
        } else if (direction === "left") {
          translateX.value = withDelay(delay, withTiming(0, config));
        } else if (direction === "right") {
          translateX.value = withDelay(delay, withTiming(0, config));
        }
        break;
      case "scaleIn":
        opacity.value = withDelay(delay, withTiming(1, config));
        scale.value = withDelay(
          delay,
          withSpring(1, {
            damping: 15,
            stiffness: 150,
          })
        );
        break;
      case "bounceIn":
        opacity.value = withDelay(delay, withTiming(1, config));
        scale.value = withDelay(
          delay,
          withSpring(1, {
            damping: 8,
            stiffness: 200,
          })
        );
        break;
    }
  }, [animation, delay, duration, direction]);

  const animatedStyle = useAnimatedStyle(() => {
    const initialTranslateX =
      direction === "left" ? -50 : direction === "right" ? 50 : 0;
    const initialTranslateY =
      direction === "top" ? -50 : direction === "bottom" ? 50 : 0;

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
