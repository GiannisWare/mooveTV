import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

// Use the same width calculations as index.tsx
const screenWidth = Dimensions.get("window").width;
const spacing = 16;
const columns = 3;
const horizontalPadding = 20; // 20 for px-5 (5 * 4 = 20)
const totalSpacing = spacing * (columns - 1);
const cardWidth =
  (screenWidth - horizontalPadding * 2 - totalSpacing) / columns;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: moviesLoad,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await moviesLoad();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.[0]) updateSearchCount(searchQuery, movies[0]);
  }, [movies]);

  return (
    <View className="flex-1 bg-dark-100">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(100 + index * 100).springify()}
            style={{
              width: cardWidth,
              marginBottom: 32,
            }}>
            <MovieCard {...item} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <LottieView
                source={require("../../assets/lotties/movie-search.json")}
                colorFilters={[
                  {
                    keypath: "*",
                    color: "#E5E0D8",
                  },
                ]}
                autoPlay
                loop
                style={{ width: 200, height: 200, alignSelf: "center" }}
              />
              <Text className="text-center text-gray-400 text-2xl">
                {searchQuery.trim()
                  ? "No movies found..."
                  : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 8, 
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-[96px] h-[96px]" />
            </View>

            <View className="my-5">
              <SearchBar
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                placeholder="Search movies..."
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#4a9eff"
                className="my-3"
              />
            )}
            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && (
              <Text className="text-xl text-white font-bold mb-4">
                Search results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default Search;
