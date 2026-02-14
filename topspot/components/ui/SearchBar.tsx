import { useState } from "react"
import {View, TextInput, TouchableOpacity, StyleSheet, Text} from "react-native"

interface Props{
  query:string;
  onChange: (text: string) => void; //an arrow function that recieves text also a parent setter
}

export default function SearchBar({query,onChange}:Props){

    return(
        <View>
            {/* Search Bar */}
                <View style={[styles.searchContainer, { borderColor: '#ddd' }]}>
                    
                    <TextInput
                    style={[styles.searchInput, { color: "black", outlineStyle: 'none' } as any]}
                    placeholder="Search rooftops..."
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={onChange}
                    selectionColor="#007AFF"
                    />
                    {query.length > 0 && (
                    <TouchableOpacity onPress={() => onChange('')}>
                        <Text style={styles.clearText}>✕</Text>
                    </TouchableOpacity>
                    )}
                </View>
        </View>
    )
}

const styles=StyleSheet.create({
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
   
  },
  clearText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
})