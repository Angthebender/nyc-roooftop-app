import React, { useState } from 'react';
import { ScrollView, Image, View, Text, useWindowDimensions } from 'react-native';

export default function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();
  const IMAGE_WIDTH = width - 40;

  const handleScroll = (e => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / IMAGE_WIDTH));
  });

  const list = images?.length ? images : ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=240&fit=crop&auto=format'];

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {list.map((uri, i) => (
          <Image key={i} source={{ uri }} style={{ width: IMAGE_WIDTH, height: 200, resizeMode: 'stretch' }} />
        ))}
      </ScrollView>

      {/* dots */}
      {list.length > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          {list.map((_, i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 3,
                backgroundColor: i === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </View>
      )}

      {/* counter */}
      {list.length > 1 && (
        <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>{currentIndex + 1}/{list.length}</Text>
        </View>
      )}
    </View>
  );
}