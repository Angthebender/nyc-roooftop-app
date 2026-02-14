import React, { useEffect, useState, useRef } from 'react';
import {supabase} from "../lib/supabase";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack} from 'expo-router';
import { ArrowLeft, Heart, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import ImageGallery from '@/components/ui/ImageGallery';
import StarRating from '@/components/ui/StarRating';

interface Rooftop {
  id: string;
  name: string;
  location: string;
  created_at: string;
  avg_rating: number;
  images: string[];
  review_count?: number;
  price_range?: string;
  description?: string;
  updated_at?: string;
  isliked?:boolean|false
  sessiontoken:string;
}

export default function Details1() {
  console.log("we are at details 1");
  const params = useLocalSearchParams();
  console.log(params)
  const router = useRouter();
  const [userid,setUserid]=useState('')
  const [isFavorite, setIsFavorite] = useState(params.isliked==='true');//this will turn the string into bolean because react params convert everythign to string
  console.log(isFavorite)
  const [isDark, setIsDark] = useState(true);
  const busy=useRef(false)
  const theme = isDark ? Colors.dark : Colors.light;
  const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const AuthCheck=async()=>{
    const response=(await supabase.auth.getSession())
    const sessionid=response.data.session?.user.id
    if(!sessionid){
        router.replace("/auth/login")
      }else{
        setUserid(sessionid)
      }
  }
    console.log("router",router.canGoBack())

  const routingback=()=>{
    
    if(router.canGoBack()){
      router.back()
    }else{
      router.replace("/(tabs)/home")
    }
  }

  const togglefavorite = async () => {
    console.log("liking.......")
    console.log(busy.current)
    if (busy.current) return; // ignore spam
    busy.current = true;
    console.log("we are in")
    const next=!isFavorite;
    console.log("is favorite is:",isFavorite)
    
    setIsFavorite(next);//changes it visually
    
     // should be a long JWT string
    try {
      
      const res = await fetch(`${API_BASE_URL}/togglelike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.sessiontoken}`, // ← user JWT
        },
        body: JSON.stringify({
          userid: userid,
          rooftopid: params.id,
          isliked: !next, // current state BEFORE the flip
        }),
      });

      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error);

      
    } catch (e) {
      console.log('toggle failed', e);
      setIsFavorite(!next); // rollback
      
    } finally {
      busy.current = false;
    }
  };

  
  // const togglefavorite=async()=>{
      
  //     if(isFavorite){// if isfav is false meaning not liked yet and the code below just likes it
  //       try{
  //         const {error}= await supabase.from('Liked_Rooftops')
  //         .delete()
  //         .eq('user_id',userid)
  //         .eq('rooftop_id',params.id)
  //         if(error){
  //           throw error
  //         }
  //       }
  //       catch(error){
  //         console.log("error while unliking the post")
  //       }
  //       finally{
  //         setIsFavorite(false)
  //       }
  //     }else{
  //       try{
  //         const {error}= await supabase.from('Liked_Rooftops')
  //         .insert([{user_id:userid,rooftop_id:params.id}])
  
  //         if(error) throw error
  //       }catch(error){
  //         console.log("error while liking the post")
  //       }
  //       finally{
  //         setIsFavorite(true)
  //       }
  //     }
  //   }
  useEffect(()=>{
    AuthCheck()
  },[])

  if (!params) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 18, color: theme.text }}>
          Rooftop not found
        </Text>
      </View>
    );
  }
  
  

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section with Title and Back Button */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => routingback()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            
            <Text style={[styles.title, { color: theme.text }]}>
              {params.name}
            </Text>
          </View>

          {/* Image Gallery with Floating Heart Button */}
          <View style={styles.imageContainer}>
          {/* @ts-ignore  error wiht params.images*/}
            <ImageGallery images={JSON.parse(params.images)} />
            
            {/* Floating Heart Button */}
            <TouchableOpacity
              onPress={() => togglefavorite()}
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

          {/* Location */}
          {params.location && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#888" />
              <Text style={styles.locationText}>{params.location}</Text>
            </View>
          )}
            
          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* @ts-ignore error with parms.avg.rating*/}
            <StarRating rating={parseFloat(params.avg_rating)}/>
            {/* Price Range */}
            {params.price_range && (
              <View style={[styles.priceContainer, { borderColor: theme.border }]}>
                <Text style={styles.priceLabel}>
                  Price Range
                </Text>
                <Text style={[styles.priceValue, { color: theme.text }]}>
                  {params.price_range}
                </Text>
              </View>
            )}

            {/* Description */}
            {params.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Description
                </Text>
                <Text style={[styles.descriptionText, { color: theme.text }]}>
                  {params.description}
                </Text>
              </View>
            )}

            {/* Comments Section Placeholder */}
            <View style={styles.commentsPlaceholder}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Comments
              </Text>
              <Text style={styles.placeholderText}>
                Comments section coming soon...
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 12,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#888',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  priceContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  commentsPlaceholder: {
    marginTop: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
});