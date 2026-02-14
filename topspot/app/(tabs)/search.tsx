import SearchBar from "@/components/ui/SearchBar";
import { useEffect, useState , useCallback} from "react";
import { View, StyleSheet, Text, FlatList,} from "react-native"
import { Colors } from '@/constants/Colors';
import SortButtons from "@/components/ui/SortButtons";//costum ui componentes
import RooftopCard from "@/components/ui/RooftopCard";//costum ui componentes
import LoadingCard from "@/components/ui/LoadingCard";
import {supabase} from "../lib/supabase";
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
interface Rooftop {
  id: string;
  name: string;
  images?: string[];
  avg_rating: number | null;
  location: string;
  created_at: string;
  updated_at?: string;
  description?: string;
  price_range?: string;
  isliked?:boolean|false;
}

export default function Search(){
  const [isDark, setIsDark] = useState(true);
  const [session, setSession] = useState<string | null>(null);
  const [loading,setLoading]=useState(false)
  const [searchQuery,setSearchQuery]=useState("")
  const theme = isDark ? Colors.dark : Colors.light;
  const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [rooftops,setRooftops] =useState<Rooftop[]>([])
  const [userId,setUserId]=useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  // the open form of this reponse guy is in profile page check that out to make more sense out of it 
  const AuthCheck=async()  =>{
      const response=(await supabase.auth.getSession())
      const token = await response.data.session?.access_token ?? null; // or ""
  
      const responseid=response.data.session?.user.id
      console.log("this is auth")
      if(!responseid){
        router.replace("/auth/login")
      }else{
        setUserId(responseid)
        setSession(token);
        const res= await fetch(`${API_BASE_URL}/authstore?uid=${responseid}`);
        if(!res.ok){
          return  res.status
        } 
      }
    }

    

  const handleSearch = () => {
    let filtered = rooftops;
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = rooftops.filter(rooftop =>
        rooftop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rooftop.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating') {
        console.log("we are sorting this shit")
        return (b.avg_rating || 0) - (a.avg_rating || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setRooftops(sorted);

  };
  // Get rooftops from server
  const fetchlikedrooftopsID = async (userid: string) => {
    console.log('checking liked rts');

    const res = await fetch(`${API_BASE_URL}/LikedRooftopsId?uid=${userid}`);

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
      console.log("fetching rooftops for search page")
      const res = await fetch(`${API_BASE_URL}/rooftops`); // ← no ?q= & no ?sort=
      console.log(' rooftops network', res.ok, res.status); 
      if (!res.ok) {
        console.log('Error while getting liked rooftop ids ❌:', res.status);
        return [];
      }
      const justrooftops:Rooftop[] = (await res.json()).data;// raw list
      
      const likedIds = new Set<string>(userId ? await fetchlikedrooftopsID(userId) : []);
      
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
      
      setLoading(false);

    }
  };
  //fetches rooftops when the page opens (works✅)
  useEffect(()=>{
    AuthCheck();
    if(userId){
      fetchRooftops();
    }
  },[]) 

  useEffect(()=>{
    if(userId){
      fetchRooftops();
      handleSearch();
    }
  },[userId])
  useFocusEffect(
      useCallback(() => {
        if (userId) fetchRooftops(); // fresh data
      }, [userId])
    );
  // debounce 300 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);
  // filter on the debounced value
  useEffect(()=>{
    handleSearch()
  },[debouncedQuery,sortBy])

  useEffect(() => {
    console.log("rooftops updated:",rooftops);
  }, [rooftops]);
  
  return(
      <View style={{backgroundColor: theme.background,flex:1}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Search Rooftops
            </Text>
            {/* Search Bar */}
            <SearchBar query={searchQuery} onChange={setSearchQuery}/>
            <SortButtons Sortby={sortBy} changeSort={setSortBy}/>
          </View>
          {/* Results Count */}
          <View style={styles.resultsInfo}>
            <Text style={[styles.resultsText, { color: '#666' }]}>
              {rooftops.length} rooftop{rooftops.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
          </View>
          

          {loading ? (
            <FlatList data={[1, 2, 3]} renderItem={() => <LoadingCard />} contentContainerStyle={{ paddingBottom: 100 }} />
          ):(
            <FlatList
            data={rooftops}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RooftopCard
                item={item}
                userid={userId}
                sessiontoken={session}
              />
            )}
            />
          )}
          
       
          
          
        </View>
      </View>
  );
}
const styles=StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
})