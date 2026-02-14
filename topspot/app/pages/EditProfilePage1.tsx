import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { router,Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/app/lib/supabase';
import * as ImagePicker from 'expo-image-picker';

interface UserProfile {
  id: string;
  username: string;
  biography: string;
  profile_picture?: string;
}

export default function EditProfile() {
    console.log("edit page 2")
  const theme = Colors.dark;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState('');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) {
        router.replace('/auth/login');
        return;
      }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setBio(data.biography || '');
        setProfilePicture(data.profile_picture || '');
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // const handleSave = async () => {
  //   if (!username.trim()) {
  //       Alert.alert('Error', 'Username cannot be empty');
  //       return;
  //   }

  //   setSaving(true);
  //   try {
  //       // 1️⃣  convert image → base64
  //       let base64 = '';
  //       if (profilePicture && profilePicture.startsWith('file://')) {
  //           const resp = await fetch(profilePicture);
  //           const blob = await resp.blob();
  //           base64 = await new Promise<string>(resolve => {
  //               const reader = new FileReader();
  //               reader.onloadend = () => resolve(reader.result as string);
  //               reader.readAsDataURL(blob);
  //           });
  //       }
  //       console.log("this is the picturte: ",base64)
  //       // 2️⃣  send to backend
  //       const { data, error } = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/updateuser`, {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //           user_id: userId,
  //           username: username.trim(),
  //           biography: bio.trim(),
  //           profile_picture_base64: base64
  //       })
  //       }).then(r => r.json());

  //       if (error) throw new Error(error);
  //       Alert.alert('Success', 'Profile updated!');
  //       router.replace('/(tabs)/Profile');
  //   } catch (e: any) {
  //       Alert.alert('Error', e.message);
  //   } finally {
  //       setSaving(false);
  //   }
  //   };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setSaving(true);
    try {
      let profilePictureData = profilePicture;
      
      // If we have a local image URI, we need to convert it to base64
      if (profilePicture && !profilePicture.startsWith('http')) {
        // Convert local file to base64
        const response = await fetch(profilePicture);
        const blob = await response.blob();
        
        profilePictureData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
              resolve(result);
            } else {
              reject(new Error('Failed to convert image to base64'));
            }
          };
          
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(blob);
        });
      }

      // Call your Flask backend instead of Supabase directly
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          username: username.trim(),
          biography: bio.trim(),
          profile_picture: profilePictureData || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/Profile') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to save profile');
      }
    } catch (error:any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };
  const hasChanges = () => {
    if (!originalData) return false;
    return (
      username !== originalData.username ||
      bio !== originalData.biography ||
      profilePicture !== (originalData.profile_picture || '')
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
    <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/Profile")}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || !hasChanges()}
          style={styles.saveButton}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Text style={[
              styles.saveText,
              !hasChanges() && styles.saveTextDisabled
            ]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>
                  {username.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Camera size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change photo</Text>
        </View>

        {/* Username Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Username</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: '#334155' }]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#64748b"
            maxLength={30}
          />
          <Text style={styles.charCount}>{username.length}/30</Text>
        </View>

        {/* Bio Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
          <TextInput
            style={[styles.bioInput, { color: theme.text, borderColor: '#334155' }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#64748b"
            multiline
            maxLength={150}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/150</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            Profile Tips
          </Text>
          <Text style={styles.infoText}>
            • Choose a unique username{'\n'}
            • Add a bio that shows your vibe{'\n'}
            • Upload a picture that shows who you are{'\n'}
            • Keep it real, keep it you
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 4,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  saveTextDisabled: {
    color: '#64748b',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  placeholderImage: {
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  imageHint: {
    fontSize: 14,
    color: '#64748b',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#1e293b',
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#1e293b',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
});