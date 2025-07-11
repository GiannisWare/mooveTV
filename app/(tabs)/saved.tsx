import { icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 3; // 3 columns with padding

interface SavedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

// Mock data - replace with your actual favorites/saved movies data
const mockSavedMovies: SavedMovie[] = [
  {
    id: 1,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    release_date: "2008-07-18",
    genre_ids: [28, 80, 18],
    overview: "Batman raises the stakes in his war on crime...",
  },
  {
    id: 2,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    vote_average: 8.8,
    release_date: "2010-07-16",
    genre_ids: [28, 878, 53],
    overview: "Dom Cobb is a skilled thief...",
  },
  {
    id: 3,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.6,
    release_date: "2014-11-07",
    genre_ids: [18, 878],
    overview: "A team of explorers travel through a wormhole...",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    vote_average: 8.9,
    release_date: "1994-10-14",
    genre_ids: [80, 18],
    overview: "The lives of two mob hitmen...",
  },
  {
    id: 5,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    vote_average: 8.7,
    release_date: "1999-03-31",
    genre_ids: [28, 878],
    overview: "A computer hacker learns from mysterious rebels...",
  },
  {
    id: 6,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.8,
    release_date: "1999-10-15",
    genre_ids: [18],
    overview: "An insomniac office worker...",
  },
];

const SavedMovieCard = ({
  movie,
  index,
}: {
  movie: SavedMovie;
  index: number;
}) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const scaleValue = useSharedValue(1);
  const favoriteScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: favoriteScale.value }],
    };
  });

  const handlePress = () => {
    scaleValue.value = withSpring(0.95, {}, () => {
      scaleValue.value = withSpring(1);
    });
    router.push(`/movie/${movie.id}`);
  };

  const handleFavoritePress = () => {
    favoriteScale.value = withSpring(0.8, {}, () => {
      favoriteScale.value = withSpring(1);
    });
    setIsFavorite(!isFavorite);
    // Add logic to remove from favorites
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#4CAF50";
    if (rating >= 6) return "#4A9EFF";
    if (rating >= 4) return "#FF9800";
    return "#F44336";
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      style={[animatedStyle, { width: ITEM_WIDTH }]}
      className="mb-10 justify-between">
      <TouchableOpacity className="bg-surface rounded-2xl  overflow-hidden border border-border-subtle/30 shadow-lg">
        {/* Movie Poster */}
        <View className="relative justify-between">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
          />

          {/* Favorite Button */}
          <Animated.View
            style={[favoriteAnimatedStyle]}
            className="absolute top-2 right-2">
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="bg-black/50 backdrop-blur-sm rounded-full p-2">
              <Image
                source={icons.favorite}
                className="size-4"
                tintColor={isFavorite ? "#ff4757" : "#ffffff"}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Rating Badge */}
          <View
            className="absolute top-2 left-2 flex-row items-center px-2 py-1 rounded-full"
            style={{
              backgroundColor: getRatingColor(movie.vote_average),
            }}>
            <Image
              source={icons.favorite}
              className="size-3 mr-1"
              tintColor="#ffffff"
            />
            <Text className="text-white font-bold text-xs">
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>

          {/* Movie Title */}
          <View className="absolute bottom-0 left-0 right-0 p-3">
            <Text
              className="text-white font-semibold text-sm leading-tight"
              numberOfLines={2}>
              {movie.title}
            </Text>
            <Text className="text-white/70 text-xs mt-1">
              {movie.release_date.split("-")[0]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "title">("date");

  // Simulate loading saved movies
  useEffect(() => {
    const loadSavedMovies = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedMovies(mockSavedMovies);
      setLoading(false);
    };

    loadSavedMovies();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const sortedMovies = [...savedMovies].sort((a, b) => {
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4a9eff"
            colors={["#4a9eff"]}
          />
        }
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}>
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
                {savedMovies.length}
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
        ) : savedMovies.length === 0 ? (
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
              renderItem={({ item, index }) => (
                <SavedMovieCard movie={item} index={index} />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 4,
              }}
              ItemSeparatorComponent={() => <View className="h-4" />}
              scrollEnabled={false}
              contentContainerStyle={{ paddingTop: 8 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SavedMoviesScreen;
