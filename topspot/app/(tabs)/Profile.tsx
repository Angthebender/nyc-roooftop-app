import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ProfileHeader from '@/components/ui/ProfileHeader';
import { useState, useEffect, useCallback} from "react";
import {supabase} from "../lib/supabase"
import { router, Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import ProfileGridPost from "@/components/ui/ProfileGridPost";
import ProfileSidebar from '@/components/ui/ProfileSidebar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface UserProfile {
  id: string;
  username: string;
  biography: string;
  profile_picture?: string;
}
interface LikedRooftop {
  id: string;
  name: string;
  location: string;
  created_at: string;
  avg_rating: number | null;
  images: string[]; // Changed from image?: string to images: string[]
  review_count?: number;
  price_range?: string;
  description?: string;
  updated_at?: string;
  isliked?:boolean|false
}

export default function Profile(){
    const insets= useSafeAreaInsets();
    const theme = Colors.dark;
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [likedIds,setLikedIds]=useState<string[]>([]);
    const [likedRooftops,setLikedRooftops]=useState<LikedRooftop[]>([]);
    const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;
    const [session, setSession] = useState<string | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const AuthCheck=async()  =>{
        const response=(await supabase.auth.getSession())
        const token = await response.data.session?.access_token ?? null; // or ""
    
        const responseid=response.data.session?.user.id
        
        if(!responseid){
          router.replace("/auth/login")
        }else{
          setUserId(responseid)
          setSession(token);
          const res= await fetch(`${API_BASE_URL}/authstore?uid=${responseid}`);
          if(!res.ok){
              console.log("This is the status from the backend",res.status)
          } 
        }
      }

    const fetchUserProfile = async (userid: string) => {
      setLoading(true)
        try {
          
          const { data, error } = await supabase
            .from('Users') // Create this table in Supabase
            .select('*')
            .eq('id', userid)
            .single();
            
          if (error) {
            console.error('Error fetching user profile ❌:', error);
          } else {
            setUserProfile(data);
          }
        } catch (e) {
          console.error('Profile fetch error:', e);
        }finally{
          setLoading(false)
        }
    };

    const fetchLikedDetails = async (userId: string) => {
      try {
        // 1. get liked IDs
        const res = await fetch(`${API_BASE_URL}/LikedRooftopsId?uid=${userId}`);
        if (!res.ok) throw new Error('liked list');
        const body = await res.json();
        if (!body.success) throw new Error(body.error);

        // 2. get full rooftop for each ID 
        const detailPromises = body.data.map(async (r: any) => {
          const dRes = await fetch(`${API_BASE_URL}/details?rooftopid=${r.rooftop_id}`);
          if (!dRes.ok) return null;
          const dJson = await dRes.json();
          return dJson.data?.[0] ?? null; // backend wraps in array
        });

        const roofs = (await Promise.all(detailPromises)).filter(Boolean);
        
        setLikedRooftops(roofs); // Rooftop[] with images etc.
      } catch (e) {
        console.log('❌ fetch liked details', e);
        setLikedRooftops([]);
      }
    };
    
    useEffect(() => {
        AuthCheck();
    }, []);
    useEffect(() => {
      if (userId) {
        fetchUserProfile(userId);  
        fetchLikedDetails(userId);
      }
    }, []);
    useEffect(() => {
      if (userId) {
          fetchUserProfile(userId);  
          fetchLikedDetails(userId);
    }}, [userId]);

    useFocusEffect(
      useCallback(() => {
        
        if (userId) {
          fetchLikedDetails(userId);
          fetchUserProfile(userId); 
        } // fresh data
      }, [userId])
    );
    return<View style={[styles.container, { 
      backgroundColor: theme.background,
      // paddingTop: insets.top,      // Handle notch/status bar
      // paddingBottom: insets.bottom // Handle home indicator
      }]}>
        <ProfileHeader userProfile={userProfile} onMenuPress={() => setSidebarVisible(true)}/>
        {/* Grid of Liked Rooftops*/}
        <FlatList
          data={likedRooftops}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <ProfileGridPost
              likedPosts={item}
              sessiontoken={session}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: '#666' }]}>
                No liked rooftops yet
              </Text>
              <Text style={[styles.emptySubtext, { color: '#3b82f6' }]}>
                <TouchableOpacity onPress={()=>{router.replace("/(tabs)/home")}}>Start exploring and like your favorites!</TouchableOpacity>
              </Text>
              
            </View>
          }
        />
        {/* Add the Sidebar */}
      <ProfileSidebar 
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
       
    </View>
}
const styles=StyleSheet.create({
  container: {
    flex: 1,
    padding:0,
    margin:0
  },
  gridItem: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    
  },
})