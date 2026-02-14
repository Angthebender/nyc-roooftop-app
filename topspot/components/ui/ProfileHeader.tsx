import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"
import { Colors } from "@/constants/Colors";

interface headerprop {
  userProfile: any;
  onMenuPress: () => void; // Changed this - simpler
}

export default function ProfileHeader({ userProfile, onMenuPress }: headerprop) {
  const theme = Colors.dark;

  return (
    <View style={styles.profileSection}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>
          {userProfile?.username}
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onMenuPress} // Just call the parent function
        >
          <View style={styles.hamburger}>
            <View style={[styles.line, { backgroundColor: theme.text }]} />
            <View style={[styles.line, { backgroundColor: theme.text }]} />
            <View style={[styles.line, { backgroundColor: theme.text }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}  
      <View style={styles.profileImageContainer}>
        {userProfile?.profile_picture ? (
          <Image
            source={{ uri: userProfile.profile_picture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
            <Text style={styles.profileImageText}>
              {userProfile?.username?.charAt(0).toUpperCase() || '😔'}
            </Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <Text style={styles.userBio}>
        {userProfile?.biography || 'No bio added yet'}
      </Text>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Liked Rooftops</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  line: {
    height: 2,
    borderRadius: 1,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBio: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
});