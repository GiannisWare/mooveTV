import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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

  return (
    <View className="flex-1 bg-dark-100">
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

     
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}>
        {/* Header Section */}
        <View className="items-center pt-16 pb-8">
          <Image
            source={icons.logo}
            className="w-24 h-24 mb-2"
          
          />
          <Text className="text-text-secondary text-sm font-medium tracking-wide">
            Discover Amazing Movies
          </Text>
        </View>

        {/* Loading State */}
        {moviesLoading || trendingLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4a9eff" className="mb-4" />
            <Text className="text-text-secondary text-sm">
              Loading movies...
            </Text>
          </View>
        ) : moviesError || trendingError ? (
          /* Error State */
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-surface p-6 rounded-2xl border border-border-subtle">
              <Text className="text-status-error text-lg font-semibold mb-2 text-center">
                Something went wrong
              </Text>
              <Text className="text-text-muted text-sm text-center">
                {moviesError?.message || trendingError?.message}
              </Text>
            </View>
          </View>
        ) : (
          /* Main Content */
          <View className="flex-1">
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
              <View className="mb-8">
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

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            )}

            {/* Latest Movies Section */}
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-text-primary">
                  Latest Movies
                </Text>
                <Text className="text-text-secondary text-md font-medium">
                  {movies?.length || 0} movies
                </Text>
              </View>

              {movies && movies.length > 0 ? (
                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
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
              ) : (
                <View className="bg-surface p-8 rounded-2xl border border-border-subtle items-center">
                  <Text className="text-text-secondary text-base font-medium mb-2">
                    No movies found
                  </Text>
                  <Text className="text-text-muted text-sm text-center">
                    Try refreshing or check your connection
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
