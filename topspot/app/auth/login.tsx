import InputBox from "@/components/ui/InputBox";
import { useState } from "react";
import { TouchableOpacity, View,Text,StyleSheet, ActivityIndicator,Alert} from "react-native";
import { supabase } from '../lib/supabase'//supabse has been set up in that location
import { Stack ,router} from 'expo-router'



export default function Login(){
    console.log("we are at login 2 chat")
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [isLoading,setIsLoading]=useState(false)
    const [missingField,setMissingField]=useState(false)
    const handleLogin= async()=>{
        
        if (!email || !password) {
            setMissingField(true)
            return
        }
        setIsLoading(true)
        try{
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            
            if(error){
                throw error
            }else{
                router.replace("/home")
            }
        }
        catch(error:any){
            Alert.alert('Login Failed', error.message)
        }
        finally{
            setIsLoading(false)
        }
    }
    return <>
        <View style={styles.container}>
            <Text style={{ fontSize:28, fontWeight:'bold', marginBottom:20, color:'#fff', marginLeft:10}}>Login</Text>
            {/* this stack screen line makes the header invisible instead of "auth/login" */}
            <Stack.Screen options={{ headerShown: false }} />
            {missingField &&(
                <Text style={{color:'#ff0000ff', marginBottom:8 , marginTop:-15, marginLeft:10, fontSize:14}}>Required fields are missing</Text>
                )
            }
            

            <InputBox type="email" input={email} output={setEmail} incorrect={missingField}/>
            <InputBox type="password" input={password} output={setPassword} incorrect={missingField}/>
            <TouchableOpacity onPress={handleLogin} style={styles.loginbutton}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'bold', fontSize:17 }}>Login</Text>}
            </TouchableOpacity>
            <Text style={{ marginTop:20, textAlign:'center', color:"white" }}>
            Don’t have an account?{' '}
            {/* change this form sing up 2 to singup  */}
                <Text style={{ color:"#3b82f6" }} onPress={() => router.push('/auth/signup')}>Sign up</Text>
                
            </Text>
        </View>
    </>
}
const styles=StyleSheet.create({
    container:{
        flex:1, 
        justifyContent:'center', 
        padding:20, 
        backgroundColor:"black"
    },
    loginbutton:{
        backgroundColor:"#3b82f6", 
        padding:18, 
        borderRadius:24,  
        alignItems:'center'
    }
})