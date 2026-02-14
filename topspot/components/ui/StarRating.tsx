
import React,{ useState } from 'react';
import { View,Text,StyleSheet,} from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
export default function StarRating({ rating }: { rating: number }) {
  // const stars = [];
  // const full = Math.floor(rating);
  // const half = rating % 1 !== 0;
  // const empty = 5 - Math.ceil(rating);

  // for (let i = 0; i < full; i++)
  //   stars.push(<Star key={`full-${i}`} size={14} color="#fbbf24" fill="#fbbf24" />);
  // if (half) stars.push(<Star key="half" size={14} color="#fbbf24" fill="none" />);
  // for (let i = 0; i < empty; i++) stars.push(<Star key={`empty-${i}`} size={14} color="#d1d5db" fill="none" />);
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? Colors.dark : Colors.light;
  const stars = [];
  const fullStars = Math.floor(rating);//basic floor division stuff 4.9->4
  const hasHalfStar = rating % 1 !== 0;//this willl get the extra numbers like 0.6->1  

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} size={14} color="#fbbf24" fill="#fbbf24" />
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <Star key="half" size={14} color="#fbbf24" fill="none" />
    );
  }

  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} size={14} color="#d1d5db" fill="none" />
    );
  }
  

  return(<View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              <Text>
                {stars}
              </Text>
              
            </View>
            <Text style={[styles.ratingText, { color: theme.text }]}>
                {rating.toFixed(1)}{/*basicaly puts thigns to 1 decimal place */}
            </Text>
          </View>
        </View>);
}

const styles=StyleSheet.create({
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
})