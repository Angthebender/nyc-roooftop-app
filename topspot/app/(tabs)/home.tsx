
import React, { useEffect, useState ,useCallback } from 'react';
import { FlatList,View,StyleSheet,StatusBar,Text, } from 'react-native';
import RooftopCard from '@/components/ui/RooftopCard';
import LoadingCard from '@/components/ui/LoadingCard';
import { Colors } from '@/constants/Colors';
import supabase from '../lib/supabase';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface Rooftop {
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
interface RooftopId{
  id:string;
}

export default function HomeScreen() {
  const insets =useSafeAreaInsets();
  const [rooftops, setRooftops] = useState<Rooftop[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [loading,setLoading]=useState(false)
  const theme = isDark ? Colors.dark : Colors.light;
  const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const [userid,setUserid]=useState('')
  const [session, setSession] = useState<string | null>(null);
  //this is the funtion that checks if there is a session
  const AuthCheck=async()  =>{
    
    const response=(await supabase.auth.getSession())
    const token = await response.data.session?.access_token ?? null; // or ""

    const responseid=response.data.session?.user.id
    console.log("this is auth")
    if(!responseid){
      router.replace("/auth/login")
    }else{
      setUserid(responseid)
      setSession(token);
      const res= await fetch(`${API_BASE_URL}/authstore?uid=${responseid}`);
      if(!res.ok){
        return  res.status
      } 
    }
  }

  const fetchlikedrooftopsID = async (userId: string) => {
    console.log('checking liked rts');

    const res = await fetch(`${API_BASE_URL}/LikedRooftopsId?uid=${userId}`);

    if (!res.ok) {
      console.log('Error while getting liked rooftop ids ❌:', res.status);
      return [];
    }

    const body = await res.json();
    if (!body.success) {
      console.log('Server error ❌:', body.error);
      return [];
    }

    return body.data.map((r: any) => r.rooftop_id);
 };
  // fucntion Get rooftops from server
  const fetchRooftops = async () => {
    setLoading(true);
    try {
      console.log("fetching rooftops")
      const res = await fetch(`${API_BASE_URL}/rooftops`); // ← no ?q= & no ?sort=
      if (!res.ok) {
        console.log('Error while getting liked rooftop ids ❌:', res.status);
        return [];
      }
      const justrooftops:Rooftop[] = (await res.json()).data;// raw list
      const likedIds = new Set<string>(userid ? await fetchlikedrooftopsID(userid) : []);
      const merged:Rooftop[] = []
      
      for (let i = 0; i < justrooftops.length; i++) {
        const rt = justrooftops[i];
        merged.push({ ...rt, isliked: likedIds.has(rt.id) }); // so the ...rt is a javascript spread operator so we can add new filed instead of mutating the original object (react state rules) BORINGGG jk
      }
      setRooftops(merged);
      // console.log(merged)
    } catch (e) {
      console.error(e);
    } finally {
      console.log("closign the loading")
      setLoading(false);

    }
  };
  //fetches rooftops when the page opens
  useEffect(()=>{
    AuthCheck()  
  },[])
  useEffect(() => {
    if (userid) fetchRooftops(); // now we have the id
  }, [userid]);
  // Home / Profile / Search – same hook
  useFocusEffect(
    useCallback(() => {
      if (userid) fetchRooftops(); // fresh data
    }, [userid])
  );

  
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.background,
        paddingTop: insets.top,      // Handle notch/status bar
        paddingBottom: insets.bottom // Handle home indicator
      }
    ]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Rooftops
        </Text>
        <Text style={[styles.headerSubtitle, { color: '#666' }]}>
          Discover amazing views
        </Text>
      </View>
      {loading?(<FlatList data={[1, 2, 3]} renderItem={() => <LoadingCard />} contentContainerStyle={{ paddingBottom: 100 }} />):(
        <FlatList
        data={rooftops}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RooftopCard
            item={item}
            userid={userid}
            sessiontoken={session}
          />
        )}  
      />
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Make sure container fills screen
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
    color: '#666666',
  },
});  