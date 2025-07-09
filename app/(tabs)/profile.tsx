import { icons } from '@/constants/icons'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={icons.person} style={styles.icon} />
        <Text style={styles.text}>Profile Coming Soon</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#404040',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: '#b0b0b0',
    marginBottom: 16,
  },
  text: {
    color: '#b0b0b0',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Profile