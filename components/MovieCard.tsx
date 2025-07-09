import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#4CAF50"; // Green
    if (rating >= 6) return "#4A9EFF"; // Blue
    if (rating >= 4) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity 
        className="w-[30%] mb-6"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }}
        >
          {/* Movie Poster Container */}
          <View className="relative">
            <Image
              source={{
                uri: poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : "https://placehold.co/600x900/2a2a2a/808080.png",
              }}
              className="w-full h-52 rounded-xl"
              resizeMode="cover"
              style={{
                backgroundColor: "#2a2a2a",
                borderWidth: 1,
                borderColor: "#333333",
              }}
            />
            
            {/* Gradient Overlay for Rating */}
            <LinearGradient
              colors={['transparent', 'rgba(26, 26, 26, 0.8)']}
              className="absolute bottom-0 left-0 right-0 h-16 rounded-b-xl"
            />
            
            {/* Rating Badge */}
            <View 
              className="absolute top-2 right-2 px-2 py-1 rounded-full"
              style={{
                backgroundColor: getRatingColor(vote_average),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View className="flex-row items-center">
                <Image source={icons.star} className="size-3 mr-1" tintColor="#ffffff" />
                <Text className="text-xs text-white font-semibold">
                  {vote_average.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Movie Information */}
          <View className="mt-3 px-1">
            {/* Title */}
            <Text 
              className="text-sm font-semibold mb-2" 
              numberOfLines={2}
              style={{ 
                color: "#ffffff",
                lineHeight: 18,
                letterSpacing: 0.2,
              }}
            >
              {title}
            </Text>

            {/* Release Date and Type */}
            <View className="flex-row items-center justify-between">
              <Text 
                className="text-xs font-medium"
                style={{ color: "#b0b0b0" }}
              >
                {release_date?.split("-")[0] || "TBA"}
              </Text>
              
              <View 
                className="px-2 py-1 rounded-md"
                style={{ backgroundColor: "#3a3a3a" }}
              >
                <Text 
                  className="text-xs font-medium uppercase"
                  style={{ color: "#4a9eff" }}
                >
                  Movie
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;