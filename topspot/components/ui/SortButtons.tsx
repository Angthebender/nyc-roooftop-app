import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface Props{
    Sortby:'distance'|'rating';
    changeSort: (newSort: 'distance' | 'rating') => void;
}
export default function SortButtons({Sortby,changeSort}:Props){
    return <>
        {/* Sort Buttons */}
        <View style={styles.sortContainer}>
            <Text style={[styles.sortLabel, { color: '#666' }]}>
            Sort by:
            </Text>
            
            <View style={styles.sortButtons}>
            <TouchableOpacity
                style={[
                styles.sortButton,
                Sortby === 'distance' && styles.activeSortButton
                ]}
                onPress={() => changeSort('distance')}
            >
                <Text style={[
                styles.sortButtonText,
                Sortby === 'distance' && styles.activeSortButtonText
                ]}>
                Distance
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={[
                styles.sortButton,
                Sortby === 'rating' && styles.activeSortButton
                ]}
                onPress={() => changeSort('rating')}
            >
                <Text style={[
                styles.sortButtonText,
                Sortby === 'rating' && styles.activeSortButtonText
                ]}>
                Rating
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    </>
}

const styles=StyleSheet.create({
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeSortButtonText: {
    color: '#fff',
  },
})