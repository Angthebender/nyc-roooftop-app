import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { supabase } from '../../app/lib/supabase'
import { useRouter,Stack } from 'expo-router'
import { MaterialIcons ,AntDesign } from '@expo/vector-icons'
import { useThemeColor } from '../../hooks/useThemeColor'

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();


export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background')
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text')
  const primaryColor = useThemeColor({ light: '#2563eb', dark: '#3b82f6' }, 'primary')

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      Alert.alert('Success', 'Check your email for confirmation!')
      router.replace('/') // send to home after signup
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    //iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, add them later ang
    //androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, add them later ang
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });
    React.useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;

            supabase.auth.signInWithIdToken({
            provider: "google",
            token: id_token,
            }).then(({ error }) => {
            if (error) {
                Alert.alert("Google Sign-In Failed", error.message);
            } else {
                router.replace("/"); // go to home after login
            }
            });
        }
    }, [response]);
  return (
    <View style={{ flex:1, justifyContent:'center', padding:20, backgroundColor }}>
      <Stack.Screen options={{ headerShown: false }} />
        <View style={{marginBottom:10 }}>
        <Text style={{ fontSize:24, fontWeight:'bold', marginBottom:20, color:textColor }}>Sign Up</Text>

        <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ borderWidth:1, borderColor:'#ccc', padding:17, marginBottom:10, borderRadius:8, color:textColor }}
        />
        </View>
      

      <View style={{ flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'#ccc', borderRadius:8, marginBottom:20 }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ flex:1, padding:17, color:textColor }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding:10 }}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignup} style={{ backgroundColor:primaryColor, padding:15, borderRadius:10, alignItems:'center' }}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'bold' }}>Sign Up</Text>}
      </TouchableOpacity>
        <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            style={{
                marginTop: 15,
                borderWidth: 1,
                borderColor: primaryColor,
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
            >
            <AntDesign name="google" size={20} color={primaryColor} />
            <Text style={{ marginLeft: 10, color: primaryColor, fontWeight: 'bold' }}>
                Continue with Google
            </Text>
        </TouchableOpacity>
      <Text style={{ marginTop:20, textAlign:'center', color:textColor }}>
        Already have an account?{'  '}
        
        <Text style={{ color:primaryColor }} onPress={() => router.push('/auth/login')}>Login</Text>
      </Text>
    </View>
  )
}
