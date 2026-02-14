import { TouchableOpacity, Image, Text, Dimensions, StyleSheet} from 'react-native'

import { router } from 'expo-router';
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
  isLiked?:boolean | true;
}
interface ProfileGridPostProps {
  likedPosts: LikedRooftop;  // Changed this
  sessiontoken: string | null;
}
export default function ProfileGridPost({likedPosts,sessiontoken}:ProfileGridPostProps){
    const rooftop=likedPosts;
    
    
    
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth )/3; // 24px padding on each side, 2 gaps of 8px
    
    // const handleRooftopPress=(rooftopid:string)=>{
    //     console.log("this is the id: ",rooftopid)
    // }
    return (
        <TouchableOpacity
            style={[styles.gridItem, { width: itemWidth, height: itemWidth }]}
            onPress={()=>{
                router.push({
                  pathname: "/pages/Details",
                  params: {
                    id: rooftop.id,
                    name: rooftop.name,
                    location: rooftop.location,
                    avg_rating: rooftop.avg_rating || 0,
                    review_count: rooftop.review_count?.toString() || '0',
                    price_range: rooftop.price_range || '',
                    description: rooftop.description || '',
                    images: JSON.stringify(rooftop.images),
                    isliked:"true",
                    sessiontoken:sessiontoken||''
                  }
                })
              }}
            >
            <Image
                source={{
                uri: rooftop.images?.[0] || 'https://via.placeholder.com/150',
                }}
                style={styles.gridImage}
            />
        </TouchableOpacity>
    );
}
const styles=StyleSheet.create({
    gridItem: {
        
        overflow: 'hidden',
        backgroundColor: '#1e293b',
        
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    
})