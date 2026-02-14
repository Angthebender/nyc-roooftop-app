import React, {useEffect, useRef, useState} from 'react';
import { Link, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Linking, ActionSheetIOS } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import ImageGallery from './ImageGallery';
import StarRating from './StarRating';
import { supabase } from '../../app/lib/supabase';

export default function RooftopCard({ item, userid, sessiontoken }: any) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(item.isliked);
  const busy = useRef(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

  const openMaps = async () => {
    const address = encodeURIComponent(item.location);
    
    if (Platform.OS === 'ios') {
      // iOS: Show native action sheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Open in Apple Maps', 'Open in Google Maps'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Apple Maps
            const url = `http://maps.apple.com/?q=${address}`;
            await Linking.openURL(url);
          } else if (buttonIndex === 2) {
            // Google Maps
            const googleUrl = `comgooglemaps://?q=${address}`;
            const webUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            
            const canOpen = await Linking.canOpenURL(googleUrl);
            if (canOpen) {
              await Linking.openURL(googleUrl);
            } else {
              await Linking.openURL(webUrl);
            }
          }
        }
      );
    } else {
      // Android: Try Google Maps app, fallback to web
      const googleUrl = `geo:0,0?q=${address}`;
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
      
      try {
        const canOpen = await Linking.canOpenURL(googleUrl);
        if (canOpen) {
          await Linking.openURL(googleUrl);
        } else {
          await Linking.openURL(webUrl);
        }
      } catch (error) {
        console.log('Error opening maps:', error);
        await Linking.openURL(webUrl);
      }
    }
  };

  const togglefavorite = async () => {
    console.log("liking.......");
    console.log(busy.current);
    if (busy.current) return;
    busy.current = true;
    console.log("we are in");
    const next = !isFavorite;
    console.log("is favorite is:", isFavorite);
    
    setIsFavorite(next);
    
    try {
      const res = await fetch(`${API_BASE_URL}/togglelike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessiontoken}`,
        },
        body: JSON.stringify({
          userid: userid,
          rooftopid: item.id,
          isliked: !next,
        }),
      });

      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error);
    } catch (e) {
      console.log('toggle failed', e);
      setIsFavorite(!next);
    } finally {
      busy.current = false;
    }
  };
  
  return (
    <View style={styles.card}>
      {/* Gallery */}
      <View style={styles.imageContainer}>
        <View>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => {
              router.push({
                pathname: "/pages/Details",
                params: {
                  id: item.id,
                  name: item.name,
                  location: item.location,
                  avg_rating: item.avg_rating || 0,
                  review_count: item.review_count?.toString() || '0',
                  price_range: item.price_range || '',
                  description: item.description || '',
                  images: JSON.stringify(item.images),
                  isliked: isFavorite,
                  sessiontoken: sessiontoken
                }
              });
            }}
          >
            <ImageGallery images={item.images} />
          </TouchableOpacity>
        </View>

        {/* Floating Heart Button */}
        <TouchableOpacity
          onPress={() => { 
            togglefavorite();
          }}
          style={styles.heartButton}
        >
          <Heart
            size={25}
            color={isFavorite ? '#ef4444' : '#fff'}
            fill={isFavorite ? '#ef4444' : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
     
      {/* Text row */}
      <View style={{ 
        paddingLeft: 20,
        paddingRight: 20
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
        </View>

        <View>
          <View style={{ marginTop: 8 }}>
            <StarRating rating={item.avg_rating || 0} />
          </View>
          
          {/* Clickable Location */}
          <TouchableOpacity 
            onPress={openMaps}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 6 }}
            activeOpacity={0.6}
          >
            <MapPin size={14} color="#ffffffff" />
            <Text style={{ color: '#fffafaff', fontSize: 14, textDecorationLine: 'underline' }}>
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    alignContent: "center",
    textAlign: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});