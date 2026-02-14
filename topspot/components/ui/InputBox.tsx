
import { useState } from "react";
import { StyleSheet , View, TextInput, TouchableOpacity } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'

interface box{
    type:'email'|'password'|'username';
    input:string;
    output:(text:string)=>void;
    incorrect:boolean
}

export default function InputBox({type,input,output,incorrect}:box){

    const [showPassword,setShowPassword]=useState(false)
    if(type==="email"){
        return(
        <View style={styles.emailcontainer}>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                value={input}
                onChangeText={output}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                style={[styles.emailbox ,{borderColor:incorrect ? '#ff0000ff' : '#fff' }]}
                cursorColor="#3b82f6"  
                selectionColor="#3b82f6"
            />
        </View>
        )
        
    }else if(type==="password"){
        return (
            
        <View style={[styles.pwcontainer,{borderColor:incorrect ? '#ff0000ff' : '#fff'}]}>
            <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                value={input}
                onChangeText={output}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="password"
                underlineColorAndroid="transparent"
                style={styles.passwordbox }
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showbutton}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color={'#3b82f6'} />
            </TouchableOpacity>
        </View>
        )
    }else if(type==="username"){
        return(
        <View style={styles.emailcontainer}>
            <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                value={input}
                onChangeText={output}
                autoCapitalize="none"
                textContentType="username"
                autoComplete="username"
                style={[styles.usernamebox,{borderColor:incorrect ? '#ff0000ff' : '#fff'}]}
            />
            
        </View>
        )
        
    }

}
const styles=StyleSheet.create({
    emailcontainer:{
        marginBottom:10 
    },
    pwcontainer:{
        flexDirection:'row', 
        alignItems:'center', 
        borderWidth:1, 
        borderColor:'#ccc', 
        borderRadius:22,
        marginBottom:20
    },
    emailbox:{
        borderWidth:1, 
        borderColor:'#ccc', 
        padding:17, 
        marginBottom:10, 
        borderRadius:22, 
        color:"white"
    },
    usernamebox:{
        borderWidth:1, 
        color:'#ccc', 
        padding:17, 
        marginBottom:5,
        marginTop:-5,
        borderRadius:22, 
        
    },
    passwordbox:{
        flex:1, 
        padding:17, 
        borderRadius:22,
        borderWidth:0,
        color:"white"
    },
    showbutton:{
        padding:10, 
        position:"absolute",
        right:0
    }

})