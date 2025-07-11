import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { getFavorites } from "@/utils/favorite";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const EmptyState = () => (
  <Animated.View
    entering={FadeInUp.delay(200).springify()}
    className="flex-1 justify-center items-center py-20">
    <View className="bg-surface/50 backdrop-blur-sm rounded-3xl p-8 border border-border-subtle/30 items-center max-w-xs">
      <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-6">
        <Image
          source={icons.favorite}
          className="size-10"
          tintColor="#4a9eff"
        />
      </View>
      <Text className="text-text-primary text-xl font-bold mb-2 text-center">
        No Saved Movies
      </Text>
      <Text className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
        Movies you mark as favorites will appear here. Start exploring and save
        your favorites!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="bg-accent rounded-2xl px-6 py-3 flex-row items-center">
        <Image
          source={icons.search}
          className="size-4 mr-2"
          tintColor="#ffffff"
        />
        <Text className="text-white font-semibold text-sm">
          Discover Movies
        </Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const SavedMoviesScreen = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "title">("date");

  // Simulate loading saved movies
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const [allMovies, favoriteIds] = await Promise.all([
        fetchMovies({ query: "" }),
        getFavorites(),
      ]);
      const favorites = allMovies.filter((movie: Movie) =>
        favoriteIds.includes(movie.id.toString())
      );
      setFavoriteMovies(favorites);
    } catch (err) {
      console.error("Error loading saved movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const sortedMovies = [...favoriteMovies].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.vote_average - a.vote_average;
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
    }
  });

  const SortButton = ({
    type,
    label,
  }: {
    type: "date" | "rating" | "title";
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSortBy(type)}
      className={`px-4 py-2 rounded-full mr-2 ${
        sortBy === type
          ? "bg-accent border border-accent"
          : "bg-surface/50 border border-border-subtle/30"
      }`}>
      <Text
        className={`text-sm font-medium ${
          sortBy === type ? "text-white" : "text-text-secondary"
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View className="flex-1 p-5">
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="pt-16 pb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-primary font-bold text-3xl">
              Saved Movies
            </Text>
            <View className="bg-accent/20 border border-accent/30 px-3 py-1 rounded-full">
              <Text className="text-accent font-bold text-sm">
                {favoriteMovies.length}
              </Text>
            </View>
          </View>
          <Text className="text-text-secondary text-base leading-relaxed">
            Your personal collection of favorite movies
          </Text>
        </Animated.View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-surface/30 backdrop-blur-sm rounded-2xl p-8 items-center">
              <ActivityIndicator
                size="large"
                color="#4a9eff"
                className="mb-4"
              />
              <Text className="text-text-secondary text-base font-medium">
                Loading your saved movies...
              </Text>
            </View>
          </View>
        ) : favoriteMovies.length === 0 ? (
          <EmptyState />
        ) : (
          <View className="flex-1">
            {/* Sort Options */}
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              className="mb-6">
              <Text className="text-text-secondary font-medium text-sm mb-3 tracking-wider uppercase">
                Sort by
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2 }}>
                <SortButton type="date" label="Date Added" />
                <SortButton type="rating" label="Rating" />
                <SortButton type="title" label="Title" />
              </ScrollView>
            </Animated.View>

            {/* Movies Grid */}
            <FlatList
              data={sortedMovies}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 10,
                marginBottom: 32,
              }}
              renderItem={({ item }) => <MovieCard {...item} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#4a9eff"
                  colors={["#4a9eff"]}
                />
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SavedMoviesScreen;
