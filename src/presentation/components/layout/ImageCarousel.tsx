import React, { useState, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

interface ImageCarouselProps {
  images: string[];
  onImagePress: (imageUri: string) => void;
  onScrollStateChange?: (isScrolling: boolean) => void;
}

export default function ImageCarousel({
  images,
  onImagePress,
  onScrollStateChange,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <View style={styles.singleImageContainer}>
        <TouchableOpacity
          onPress={() => onImagePress(images[0])}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: images[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  }

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => onImagePress(item)}
      activeOpacity={0.8}
      style={styles.carouselItem}
    >
      <Image
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const handleGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsScrolling(true);
      onScrollStateChange?.(true);
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      setIsScrolling(false);
      onScrollStateChange?.(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.carouselContainer}>
      <PanGestureHandler
        onHandlerStateChange={handleGestureEvent}
        onGestureEvent={handleGestureEvent}
        shouldCancelWhenOutside={false}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <View style={styles.carouselWrapper}>
          <Carousel
            loop={false}
            width={screenWidth - 64}
            height={200}
            autoPlay={false}
            data={images}
            scrollAnimationDuration={300}
            onSnapToItem={(index) => {
              setCurrentIndex(index);
              setIsScrolling(false);
              onScrollStateChange?.(false);
            }}
            onScrollStart={() => {
              setIsScrolling(true);
              onScrollStateChange?.(true);
            }}
            renderItem={renderCarouselItem}
            style={styles.carousel}
          />
        </View>
      </PanGestureHandler>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentIndex(index)}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.activePaginationDot,
            ]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carouselWrapper: {
    alignItems: "center",
  },
  carousel: {
    width: screenWidth - 64,
    height: 200,
  },
  carouselItem: {
    width: "100%",
    height: 200,
  },
  carouselImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  singleImageContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  singleImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  activePaginationDot: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
