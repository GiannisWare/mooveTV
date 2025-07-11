import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export const getFavorites = async (): Promise<string[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const isFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(id);
};

export const saveFavorite = async (id: string): Promise<void> => {
  const favorites = await getFavorites();
  if (!favorites.includes(id)) {
    favorites.push(id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = async (id: string): Promise<void> => {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};
