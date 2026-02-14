import { TouchableOpacity, View,Text,StyleSheet, ActivityIndicator, Alert} from "react-native";
import { Stack ,router} from 'expo-router'
import { useState } from "react";
import { supabase } from '../lib/supabase'//supabse has been set up in that location
import InputBox from "@/components/ui/InputBox";
export default function SignUp(){
    console.log("we are at login 2 chat")
    const [email,setEmail]=useState('')
    const [username,setUserName]=useState('')
    const [password,setPassword]=useState('')
    const [isLoading,setIsLoading]=useState(false)
    const [missingField,setMissingField]=useState(false)
    const handleSignUp= async()=>{
        
        if (!email || !password || !username) {
            setMissingField(true)
            return
        }
        
        
        setIsLoading(true)
        try {
            const {data:authData,error:authError } = await supabase.auth.signUp({ email,password })
            if (authError){
                 throw authError
            }else{
            const userId=authData.user?.id
            
            if (!userId) {
                throw new Error('User ID not found after signup')
            }
            const{error:dbError}=await supabase.from('Users').insert([{
                    id: userId, 
                    username:username,
                }])
            if(dbError){
                throw dbError
                
            }router.replace('/auth/login') // send to home after signup
            }
            
            
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message)
        } finally {
            setIsLoading(false)
        }
    }
    console.log("we at the signup 2")
    return<>
        <View style={styles.container}>
            <Text style={{ fontSize:28, fontWeight:'bold', marginBottom:20, color:'#fff', marginLeft:10}}>SignUp</Text>
            {/* this stack screen line makes the header invisible instead of "auth/login" */}
            <Stack.Screen options={{ headerShown: false }} />
            {missingField &&(
                <Text style={{color:'#ff0000ff', marginBottom:8 , marginTop:-15, marginLeft:10, fontSize:14}}>Required fields are missing</Text>
                )
            }
            

            <InputBox type="email" input={email} output={setEmail} incorrect={missingField}/>
            <InputBox type="username" input={username} output={setUserName} incorrect={missingField}/>
            <InputBox type="password" input={password} output={setPassword} incorrect={missingField}/>
            <TouchableOpacity onPress={handleSignUp} style={styles.signupbutton}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'bold', fontSize:17}}>Signup</Text>}
            </TouchableOpacity>
            <Text style={{ marginTop:20, textAlign:'center', color:"white" }}>
            Already have an account?{' '}
            {/* change this form login 2 to singup  */}
                <Text style={{ color:"#3b82f6" }} onPress={() => router.push('/auth/login')}>Sign in</Text>
                
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
    signupbutton:{
        backgroundColor:"#3b82f6", 
        padding:18, 
        borderRadius:24, 
        alignItems:'center'

    }
})