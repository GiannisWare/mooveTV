import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { WebView } from "react-native-webview";

import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
  icon?: any;
}

const MovieInfo = ({ label, value, icon }: MovieInfoProps) => (
  <Animated.View
    className="mb-5 bg-surface/30 backdrop-blur-sm rounded-xl p-4 border border-border-subtle/50"
    entering={FadeInUp.delay(100).springify()}>
    <View className="flex-row items-center mb-2">
      {icon && (
        <Image source={icon} className="size-4 mr-2" tintColor="#4a9eff" />
      )}
      <Text className="text-text-secondary font-medium text-xs tracking-wider uppercase">
        {label}
      </Text>
    </View>
    <Text className="text-text-primary font-semibold text-base leading-6">
      {value || "N/A"}
    </Text>
  </Animated.View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const favoriteScale = useSharedValue(1);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string, true)
  );

  const trailer = movie?.videos?.results?.find(
    (video: any) =>
      (video.type === "Trailer" || video.type === "Teaser") &&
      video.site === "YouTube"
  );

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 200], [0, 1]),
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, 200], [-50, 0]),
        },
      ],
    };
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 200], [1, 1.1]),
        },
      ],
    };
  });

  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: favoriteScale.value }],
    };
  });

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const handleTrailerPress = () => {
    setShowTrailer(true);
  };

  const handleFavoritePress = () => {
    favoriteScale.value = withSpring(0.8, {}, () => {
      favoriteScale.value = withSpring(1);
    });
    setIsFavorite(!isFavorite);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#4CAF50";
    if (rating >= 6) return "#4A9EFF";
    if (rating >= 4) return "#FF9800";
    return "#F44336";
  };

  const formatBudget = (budget: number) => {
    if (budget >= 1000000000) {
      return `$${(budget / 1000000000).toFixed(1)}B`;
    }
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${budget.toLocaleString()}`;
  };

  const formatRuntime = (runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <View className="bg-surface/20 rounded-2xl p-8 items-center backdrop-blur-sm">
          <ActivityIndicator size="large" color="#4a9eff" />
          <Text className="text-text-secondary mt-4 text-base">
            Loading movie details...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-dark-100 flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header
      <Animated.View
        style={[headerAnimatedStyle]}
        className="absolute top-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border-subtle/30">
        <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
          <TouchableOpacity
            onPress={router.back}
            className="bg-surface/50 rounded-full p-2">
            <Image
              source={icons.arrow}
              className="size-5 rotate-180"
              tintColor="#ffffff"
            />
          </TouchableOpacity>
          <Text
            className="text-text-primary font-bold text-lg"
            numberOfLines={1}>
            {movie?.title}
          </Text>
          <Animated.View style={favoriteAnimatedStyle}>
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="bg-surface/50 rounded-full p-2">
              <Image
                source={icons.star}
                className="size-5"
                tintColor={isFavorite ? "#ff4757" : "#ffffff"}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View> */}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {/* Hero Section with Poster */}
        <Animated.View style={[heroAnimatedStyle]} className="relative">
          <View style={{ width, height: height * 0.6 }}>
            {/* Backdrop Image */}
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w780${
                  movie?.backdrop_path || movie?.poster_path
                }`,
              }}
              style={{ width, height: height * 0.6 }}
              resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: height * 0.3,
              }}
            />

            {/* Back button */}
            <TouchableOpacity
              className="absolute top-12 left-5 bg-surface/30 backdrop-blur-sm rounded-full p-3 z-20"
              onPress={router.back}>
              <Image
                source={icons.arrow}
                className="size-6 rotate-180"
                tintColor="#ffffff"
              />
            </TouchableOpacity>

            {/* Favorite button */}
            <Animated.View
              style={[favoriteAnimatedStyle]}
              className="absolute top-12 right-5 z-20">
              <TouchableOpacity
                onPress={handleFavoritePress}
                className="bg-surface/30 backdrop-blur-sm rounded-full p-3">
                <Image
                  source={isFavorite ? icons.favorite_on : icons.favorite}
                  className="size-6"
                  tintColor={isFavorite ? "#ffb703" : "#ffffff"}
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Trailer Play Button */}
            {!showTrailer && trailer?.key && (
              <TouchableOpacity
                onPress={handleTrailerPress}
                className="absolute inset-0 items-center justify-center">
                <View className="w-24 h-24 rounded-full bg-black/70 backdrop-blur-sm items-center justify-center border-2 border-white/30">
                  <Image
                    source={icons.play}
                    className="w-8 h-8 tint-white ml-1"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}

            {/* Embedded Video */}
            {showTrailer && trailer?.key && (
              <View className="absolute inset-0 bg-black">
                <WebView
                  source={{
                    uri: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&playsinline=1`,
                  }}
                  style={{ flex: 1 }}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  onError={() => setVideoError(true)}
                  allowsFullscreenVideo={true}
                />
              </View>
            )}
          </View>
        </Animated.View>

        {/* Movie Information */}
        <View className="px-6 -mt-20 relative z-10">
          {/* Movie Card */}
          <View className="bg-surface/95 backdrop-blur-md rounded-3xl p-6 border border-border-subtle/30 shadow-2xl">
            {/* Title */}
            <Text className="text-text-primary font-bold text-3xl mb-3 text-center leading-tight">
              {movie?.title}
            </Text>

            {/* Quick Info Row */}
            <View className="flex-row items-center justify-center mb-6 flex-wrap">
              <View className="bg-accent/20 border border-accent/30 px-4 py-2 rounded-full mr-3 mb-2">
                <Text className="text-accent text-sm font-semibold">
                  {movie?.release_date?.split("-")[0]}
                </Text>
              </View>
              <View className="bg-accent/20 border border-accent/30 px-4 py-2 rounded-full mr-3 mb-2">
                <Text className="text-accent text-sm font-semibold">
                  {formatRuntime(movie?.runtime || 0)}
                </Text>
              </View>
              <View className="bg-accent/20 border border-accent/30 px-4 py-2 rounded-full mb-2">
                <Text className="text-accent text-sm font-semibold">
                  {movie?.adult ? "18+" : "PG-13"}
                </Text>
              </View>
            </View>

            {/* Rating */}
            <View className="items-center mb-6">
              <View
                className="flex-row items-center px-6 py-3 rounded-2xl shadow-lg"
                style={{
                  backgroundColor: getRatingColor(movie?.vote_average || 0),
                }}>
                <Image
                  source={icons.favorite}
                  className="size-5 mr-2"
                  tintColor="#ffffff"
                />
                <Text className="text-white font-bold text-lg mr-4">
                  {movie?.vote_average?.toFixed(1)}
                </Text>
                <Text className="text-white/90 text-sm">
                  ({movie?.vote_count?.toLocaleString()} reviews)
                </Text>
              </View>
            </View>

            {/* Overview */}
            <View className="mb-6">
              <Text className="text-text-secondary font-medium text-sm mb-3 tracking-wider uppercase">
                Overview
              </Text>
              <Text className="text-text-primary font-medium text-base leading-6">
                {showFullOverview
                  ? movie?.overview
                  : `${movie?.overview?.substring(0, 150)}...`}
              </Text>
              {movie?.overview && movie.overview.length > 150 && (
                <TouchableOpacity
                  onPress={() => setShowFullOverview(!showFullOverview)}
                  className="mt-2">
                  <Text className="text-accent font-semibold text-sm">
                    {showFullOverview ? "Show Less" : "Read More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Genres */}
            <View className="mb-6">
              <Text className="text-text-secondary font-medium text-sm mb-3 tracking-wider uppercase">
                Genres
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {movie?.genres?.map((genre: any) => (
                  <View
                    key={genre.id}
                    className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 px-4 py-2 rounded-full">
                    <Text className="text-accent text-sm font-semibold">
                      {genre.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row justify-between mb-6">
              <View className="flex-1 items-center bg-surface/30 rounded-2xl p-4 mr-2">
                <Text className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  Budget
                </Text>
                <Text className="text-text-primary font-bold text-lg">
                  {movie?.budget ? formatBudget(movie.budget) : "N/A"}
                </Text>
              </View>
              <View className="flex-1 items-center bg-surface/30 rounded-2xl p-4 ml-2">
                <Text className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  Revenue
                </Text>
                <Text className="text-text-primary font-bold text-lg">
                  {movie?.revenue ? formatBudget(movie.revenue) : "N/A"}
                </Text>
              </View>
            </View>

            {/* Production Companies */}
            {
              <View>
                <Text className="text-text-secondary font-medium text-sm mb-3 tracking-wider uppercase">
                  Production Companies
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {movie?.production_companies
                    .slice(0, 3)
                    .map((company: any) => (
                      <View
                        key={company.id}
                        className="bg-surface/30 border border-border-subtle/50 px-4 py-2 rounded-full">
                        <Text className="text-text-primary text-sm font-medium">
                          {company.name}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            }
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-8 left-6 right-6">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-accent rounded-2xl py-4 flex-row items-center justify-center shadow-lg"
            onPress={() => {
              // Add to watchlist logic
            }}
            style={{
              shadowColor: "#4a9eff",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <Image
              source={icons.bookmark}
              className="size-5 mr-2"
              tintColor="#ffffff"
            />
            <Text className="text-white font-semibold text-base">
              Add to Watchlist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface/80 backdrop-blur-sm rounded-2xl py-4 px-6 items-center justify-center border border-border-subtle/30"
            onPress={router.back}>
            <Image
              source={icons.arrow}
              className="size-5 rotate-180"
              tintColor="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MovieDetails;
