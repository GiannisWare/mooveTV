import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
} from "react-native";

import { fetchMovies } from "@/services/api";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Dimensions } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInUp,
  ZoomIn,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("window").width;
const spacing = 16;
const columns = 3;
const horizontalPadding = 24;
const totalSpacing = spacing * (columns - 1);
const cardWidth =
  (screenWidth - horizontalPadding * 2 - totalSpacing) / columns;

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <View className="flex-1 bg-dark-100">
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <Animated.Image
        entering={FadeInUp.duration(800)}
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Main Content */}
      <Animated.ScrollView
        entering={FadeInUp.duration(500)}
        className="flex-1"
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View className="items-center pt-16 pb-8">
          <Animated.Image source={icons.logo} className="w-24 h-24 mb-2" />
          <Animated.Text
            entering={FadeInUp.delay(600).duration(400)}
            className="text-text-secondary text-sm font-medium tracking-wide">
            Discover Amazing Movies
          </Animated.Text>
        </Animated.View>

        {/* Loading State */}
        {moviesLoading || trendingLoading ? (
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            className="flex-1 justify-center items-center py-20">
            <Animated.View entering={ZoomIn.delay(100).duration(400)}>
              <ActivityIndicator
                size="large"
                color="#4a9eff"
                className="mb-4"
              />
            </Animated.View>
            <Animated.Text
              entering={FadeInUp.delay(200).duration(400)}
              className="text-text-secondary text-sm">
              Loading movies...
            </Animated.Text>
          </Animated.View>
        ) : moviesError || trendingError ? (
          /* Error State */
          <Animated.View
            entering={SlideInUp.delay(300).duration(600).springify()}
            className="flex-1 justify-center items-center py-20">
            <Animated.View
              entering={ZoomIn.delay(100).duration(500)}
              className="bg-surface p-6 rounded-2xl border border-border-subtle">
              <Animated.Text
                entering={FadeInDown.delay(200).duration(400)}
                className="text-status-error text-lg font-semibold mb-2 text-center">
                Something went wrong
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.delay(300).duration(400)}
                className="text-text-muted text-sm text-center">
                {moviesError?.message || trendingError?.message}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        ) : (
          /* Main Content */
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            className="flex-1">
            {/* Search Bar */}
            <View className="mb-8">
              <SearchBar
                onPress={() => {
                  router.push("/search");
                }}
                placeholder="Search for movies..."
              />
            </View>

            {/* Trending Section */}
            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mb-8 flex-1">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-bold text-text-primary">
                    Trending Now
                  </Text>
                  <View className="bg-accent px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-white uppercase tracking-wide">
                      Hot
                    </Text>
                  </View>
                </View>

                <AnimatedFlatList
                  entering={FadeInUp.delay(400).duration(500).springify()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4"></View>}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      entering={FadeInUp.delay(800 + index * 200).springify()}>
                      <TrendingCard movie={item} index={index} />
                    </Animated.View>
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            )}

            {/* Latest Movies Section */}
            <Animated.View entering={FadeInUp.delay(1100).duration(600)}>
              <Animated.View
                entering={FadeInUp.delay(1200).duration(500).springify()}
                className="flex-row items-center justify-between mb-4">
                <Animated.Text
                  entering={FadeInDown.delay(1300).duration(400)}
                  className="text-xl font-bold text-text-primary">
                  Latest Movies
                </Animated.Text>
                <Animated.Text
                  entering={FadeInDown.delay(1300).duration(400)}
                  className="text-text-secondary text-md font-medium">
                  {movies?.length || 0} movies
                </Animated.Text>
              </Animated.View>

              {movies && movies.length > 0 ? (
                <FlatList
                  data={movies}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      entering={FadeInUp.delay(800 + index * 200).springify()}
                      style={{
                        width: cardWidth,
                        marginBottom: 32,
                      }}>
                      <MovieCard {...item} />
                    </Animated.View>
                  )}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                  }}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    paddingTop: 8,
                  }}
                />
              ) : (
                <Animated.View
                  entering={ZoomIn.delay(1500).duration(600).springify()}
                  className="bg-surface p-8 rounded-2xl border border-border-subtle items-center">
                  <Animated.Text
                    entering={FadeInDown.delay(1600).duration(400)}
                    className="text-text-secondary text-base font-medium mb-2">
                    No movies found
                  </Animated.Text>
                  <Animated.Text
                    entering={FadeInUp.delay(1700).duration(400)}
                    className="text-text-muted text-sm text-center">
                    Try refreshing or check your connection
                  </Animated.Text>
                </Animated.View>
              )}
            </Animated.View>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default Index;
