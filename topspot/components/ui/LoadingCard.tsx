import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function LoadingCard() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>

      {/* Loading Skeleton */}
      <View style={styles.cardContainer}>
        {/* Fake Image */}
        <View style={styles.loadingImage} />

        {/* Fake Text Blocks */}
        <View style={{ marginTop: 16 }}>
          <View style={styles.loadingLineLarge} />
          <View style={styles.loadingLineSmall} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  

  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#000000ff',
    overflow: 'hidden',
    paddingBottom:10,
  },

  loadingImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e4e4e4e1',
    borderRadius: 10,
    marginBottom:10,
  },

  loadingLineLarge: {
    height: 20,
    width: '70%',
    backgroundColor: '#e4e4e4e1',
    borderRadius: 4,
    marginLeft:5,
  },

  loadingLineSmall: {
    height: 16,
    width: '40%',
    backgroundColor: '#e4e4e4e1',
    borderRadius: 4,
    marginTop: 20,
    marginLeft:5,
  },
});
